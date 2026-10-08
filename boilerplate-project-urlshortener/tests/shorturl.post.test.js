const request = require('supertest');
const { loadApp } = require('./helpers');

let app;
beforeEach(() => {
  ({ app } = loadApp());
});

const post = (url) => request(app).post('/api/shorturl').type('form').send({ url });

// R2 - POST retorna { original_url, short_url }
describe('R2 - POST /api/shorturl com URL válida', () => {
  test('responde 200 com JSON contendo original_url e short_url', async () => {
    const res = await post('https://freeCodeCamp.org');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('short_url');
  });

  test('original_url é igual à URL enviada', async () => {
    const res = await post('https://freeCodeCamp.org');
    expect(res.body.original_url).toBe('https://freeCodeCamp.org');
  });

  test('short_url é um número inteiro', async () => {
    const res = await post('https://freeCodeCamp.org');
    expect(Number.isInteger(res.body.short_url)).toBe(true);
  });

  test('o primeiro ID é 1 e o segundo é 2', async () => {
    const a = await post('https://freeCodeCamp.org');
    const b = await post('https://www.example.com');
    expect(a.body.short_url).toBe(1);
    expect(b.body.short_url).toBe(2);
  });

  test('a mesma URL enviada duas vezes retorna o mesmo short_url', async () => {
    const a = await post('https://freeCodeCamp.org');
    const b = await post('https://freeCodeCamp.org');
    expect(b.body.short_url).toBe(a.body.short_url);
  });

  test('aceita application/x-www-form-urlencoded (formulário)', async () => {
    const res = await request(app)
      .post('/api/shorturl')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('url=https%3A%2F%2Fwww.example.com');
    expect(res.status).toBe(200);
    expect(res.body.original_url).toBe('https://www.example.com');
  });

  test('aceita URL com caminho e query string', async () => {
    const url = 'https://www.example.com/path/page?x=1&y=2';
    const res = await post(url);
    expect(res.body.original_url).toBe(url);
  });

  test('aceita http:// além de https://', async () => {
    const res = await post('http://www.example.com');
    expect(res.body.original_url).toBe('http://www.example.com');
    expect(Number.isInteger(res.body.short_url)).toBe(true);
  });
});

// R4 - URL inválida retorna { error: 'invalid url' }
describe('R4 - POST /api/shorturl com URL inválida', () => {
  test.each([
    ['protocolo ftp', 'ftp://example.com'],
    ['sem protocolo', 'example.com'],
    ['texto aleatório', 'abc'],
    ['string vazia', ''],
    ['apenas protocolo, sem host', 'http://'],
    ['protocolo malformado', 'ftp:/john-doe.invalidTLD'],
    ['espaços no host', 'http://exa mple.com'],
    ['host inexistente (ENOTFOUND)', 'https://invalid-host-that-does-not-exist.example'],
  ])('%s -> { error: "invalid url" }', async (_desc, url) => {
    const res = await post(url);
    expect(res.body).toEqual({ error: 'invalid url' });
  });

  test('campo url ausente -> { error: "invalid url" }', async () => {
    const res = await request(app).post('/api/shorturl').type('form').send({});
    expect(res.body).toEqual({ error: 'invalid url' });
  });

  test('URL inválida não consome ID: próximo válido continua sendo 1', async () => {
    await post('ftp://example.com');
    await post('https://invalid-host-that-does-not-exist.example');
    const ok = await post('https://freeCodeCamp.org');
    expect(ok.body.short_url).toBe(1);
  });
});
