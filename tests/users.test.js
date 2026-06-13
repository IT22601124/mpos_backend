import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

const runDbTests = process.env.RUN_DB_TESTS === 'true';

test('GET /api/v1/users returns users', { skip: !runDbTests }, async () => {
  const response = await request(app).get('/api/v1/users');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data));
});

test('POST /api/v1/users creates a user', { skip: !runDbTests }, async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .send({ name: 'Test User', email: 'test@example.com' });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.email, 'test@example.com');
});
