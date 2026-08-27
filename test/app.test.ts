import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app';
import { loadConfig } from '../src/config';

test('createApp() exposes an Express app instance', async () => {
  const app = createApp(loadConfig({ PORT: '3000', CSV_PATH: 'Movielist.csv' }));

  const response = await request(app).get('/health');

  assert.equal(response.status, 404);
  assert.equal(typeof response.body, 'object');
});
