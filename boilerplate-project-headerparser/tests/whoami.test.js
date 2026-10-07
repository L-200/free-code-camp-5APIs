const request = require('supertest');
const app = require('../index');

describe('GET /api/whoami', () => {
  test('Cenário 1: responde 200 com JSON', async () => {
    const res = await request(app).get('/api/whoami');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
  });

  test('Cenário 2: contém ipaddress não vazio', async () => {
    const res = await request(app).get('/api/whoami');
    expect(typeof res.body.ipaddress).toBe('string');
    expect(res.body.ipaddress.length).toBeGreaterThan(0);
  });

  test('Cenário 3: language reflete Accept-Language', async () => {
    const res = await request(app)
      .get('/api/whoami')
      .set('Accept-Language', 'pt-BR');
    expect(res.body.language).toBe('pt-BR');
  });

  test('Cenário 4: software reflete User-Agent', async () => {
    const res = await request(app)
      .get('/api/whoami')
      .set('User-Agent', 'Teste/1.0');
    expect(res.body.software).toBe('Teste/1.0');
  });
});
