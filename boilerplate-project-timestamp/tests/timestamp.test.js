const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../index');

describe('Suíte de Testes - Timestamp Microservice (Fase 1)', () => {

  describe('Cenário 1: Endpoint Sem Parâmetro (GET /api e GET /api/)', () => {
    it('deve retornar objeto JSON com unix (número) e utc (string GMT) correspondentes ao momento atual', async () => {
      const beforeTime = Date.now();
      const res = await request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200);

      const afterTime = Date.now();

      assert.ok(res.body, 'Resposta não deve ser vazia');
      assert.strictEqual(typeof res.body.unix, 'number', 'Chave "unix" deve ser do tipo number');
      assert.strictEqual(typeof res.body.utc, 'string', 'Chave "utc" deve ser do tipo string');

      assert.ok(
        res.body.unix >= beforeTime && res.body.unix <= afterTime,
        `Unix timestamp (${res.body.unix}) deve estar no intervalo do momento atual`
      );

      const parsedUtc = new Date(res.body.utc);
      assert.strictEqual(parsedUtc.toUTCString(), res.body.utc, 'Chave "utc" deve corresponder a uma string GMT/UTC válida');
    });

    it('deve funcionar com GET /api/', async () => {
      const res = await request(app)
        .get('/api/')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.strictEqual(typeof res.body.unix, 'number');
      assert.strictEqual(typeof res.body.utc, 'string');
    });
  });

  describe('Cenário 2: Timestamp Numérico (GET /api/:date)', () => {
    it('deve converter o timestamp numérico 1451001600000 para a data UTC/GMT correta', async () => {
      const res = await request(app)
        .get('/api/1451001600000')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        unix: 1451001600000,
        utc: 'Fri, 25 Dec 2015 00:00:00 GMT'
      });
    });

    it('deve converter o timestamp numérico 0 para 01 Jan 1970 00:00:00 GMT', async () => {
      const res = await request(app)
        .get('/api/0')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        unix: 0,
        utc: 'Thu, 01 Jan 1970 00:00:00 GMT'
      });
    });
  });

  describe('Cenário 3: Data Textual Válida (GET /api/:date)', () => {
    it('deve converter a data textual "2015-12-25" para formato unix e utc', async () => {
      const res = await request(app)
        .get('/api/2015-12-25')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        unix: 1451001600000,
        utc: 'Fri, 25 Dec 2015 00:00:00 GMT'
      });
    });

    it('deve converter uma data textual formatada por extenso ("05 October 2011, GMT")', async () => {
      const res = await request(app)
        .get('/api/05%20October%202011,%20GMT')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        unix: 1317772800000,
        utc: 'Wed, 05 Oct 2011 00:00:00 GMT'
      });
    });
  });

  describe('Cenário 4: Tratamento de Data Inválida (GET /api/:date)', () => {
    it('deve retornar { error: "Invalid Date" } para uma string textual inválida', async () => {
      const res = await request(app)
        .get('/api/invalid-date')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        error: 'Invalid Date'
      });
    });

    it('deve retornar { error: "Invalid Date" } para uma data inexistente ("2015-02-31")', async () => {
      const res = await request(app)
        .get('/api/2015-02-31')
        .expect('Content-Type', /json/)
        .expect(200);

      assert.deepStrictEqual(res.body, {
        error: 'Invalid Date'
      });
    });
  });

});
