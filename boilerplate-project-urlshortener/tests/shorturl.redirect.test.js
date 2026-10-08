const request = require('supertest');
const { loadApp } = require('./helpers');

let app;
beforeEach(() => {
  ({ app } = loadApp());
});

const create = (url) => request(app).post('/api/shorturl').type('form').send({ url });

// R3 - GET /api/shorturl/<short_url> redireciona para a URL original
describe('R3 - GET /api/shorturl/:short_url', () => {
  test('redireciona (302) para a URL original', async () => {
    const { body } = await create('https://freeCodeCamp.org');
    const res = await request(app).get(`/api/shorturl/${body.short_url}`).redirects(0);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://freeCodeCamp.org');
  });

  test('cada ID redireciona para a sua própria URL', async () => {
    const a = await create('https://freeCodeCamp.org');
    const b = await create('https://www.example.com/page');
    const ra = await request(app).get(`/api/shorturl/${a.body.short_url}`).redirects(0);
    const rb = await request(app).get(`/api/shorturl/${b.body.short_url}`).redirects(0);
    expect(ra.headers.location).toBe('https://freeCodeCamp.org');
    expect(rb.headers.location).toBe('https://www.example.com/page');
  });

  test('preserva caminho e query string no redirecionamento', async () => {
    const url = 'https://www.example.com/a/b?x=1&y=2';
    const { body } = await create(url);
    const res = await request(app).get(`/api/shorturl/${body.short_url}`).redirects(0);
    expect(res.headers.location).toBe(url);
  });

  // Decisão: ID inexistente -> 404 + JSON de erro
  test('ID inexistente -> 404 com JSON de erro', async () => {
    const res = await request(app).get('/api/shorturl/999').redirects(0);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'No short URL found for the given input' });
  });

  // Decisão: ID não numérico recebe o mesmo tratamento do inexistente
  test.each(['abc', '1.5', '-1', '0'])('ID inválido "%s" -> 404 com JSON de erro', async (id) => {
    const res = await request(app).get(`/api/shorturl/${id}`).redirects(0);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'No short URL found for the given input' });
  });
});
