const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { loadApp } = require('./helpers');

// R1 - O projeto deve ser próprio, não a URL de exemplo do freeCodeCamp
describe('R1 - projeto próprio', () => {
  test('index.js exporta o app Express', () => {
    const { app } = loadApp();
    expect(typeof app).toBe('function');
    expect(typeof app.use).toBe('function');
  });

  test('GET / responde 200 com HTML', async () => {
    const { app } = loadApp();
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('a view inicial contém um formulário que faz POST para /api/shorturl', () => {
    const html = fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf8');
    expect(html).toMatch(/<form[^>]*action=["']\/api\/shorturl["'][^>]*>/i);
    expect(html).toMatch(/method=["']post["']/i);
  });

  test('a view não aponta para o projeto de exemplo do freeCodeCamp', () => {
    const html = fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf8');
    expect(html).not.toMatch(/url-shortener-microservice\.freecodecamp\.rocks/i);
  });
});
