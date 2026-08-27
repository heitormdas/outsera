import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app';
import { InMemoryProducerIntervalRepository } from '../src/infrastructure/repositories/producerIntervalRepository';

function buildApp(winners: Array<{ producer: string; year: number }>) {
  return createApp(
    { port: 3000, csvPath: 'Movielist.csv' },
    { producerIntervalRepository: new InMemoryProducerIntervalRepository(winners) },
  );
}

test('GET /producers/intervals handles consecutive interval correctness and tie preservation', async () => {
  const winners = [
    { producer: 'Producer A', year: 1980 },
    { producer: 'Producer A', year: 1985 },
    { producer: 'Producer A', year: 1986 },
    { producer: 'Producer A', year: 2000 },
    { producer: 'Producer B', year: 2000 },
    { producer: 'Producer B', year: 2001 },
    { producer: 'Producer C', year: 1990 },
    { producer: 'Producer D', year: 1995 },
    { producer: 'Producer D', year: 1997 },
    { producer: 'Producer E', year: 2020 },
    { producer: 'Producer F', year: 2021 },
    { producer: 'Producer F', year: 2023 },
    { producer: 'Producer F', year: 2025 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    min: [
      {
        producer: 'Producer A',
        interval: 1,
        previousWin: 1985,
        followingWin: 1986,
      },
      {
        producer: 'Producer B',
        interval: 1,
        previousWin: 2000,
        followingWin: 2001,
      },
    ],
    max: [
      {
        producer: 'Producer A',
        interval: 14,
        previousWin: 1986,
        followingWin: 2000,
      },
    ],
  });
});

test('GET /producers/intervals ignores single-win producers and returns empty arrays when no intervals exist', async () => {
  const response = await request(buildApp([
    { producer: 'Producer Only', year: 1990 },
    { producer: 'Producer Solo', year: 2000 },
  ])).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { min: [], max: [] });
});
