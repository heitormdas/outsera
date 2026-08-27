import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';

import { createApp } from '../src/app';
import {
  InMemoryProducerIntervalRepository,
  SqliteProducerIntervalRepository,
} from '../src/infrastructure/repositories/producerIntervalRepository';
import { initializeApplication } from '../src/startup';

function buildApp(winners: Array<{ producer: string; year: number }>) {
  return createApp(
    { port: 3000, csvPath: 'Movielist.csv' },
    { producerIntervalRepository: new InMemoryProducerIntervalRepository(winners) },
  );
}

test('GET /producers/intervals returns the normal dataset result', async () => {
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

test('GET /producers/intervals preserves all tied minimum results', async () => {
  const winners = [
    { producer: 'Producer A', year: 2000 },
    { producer: 'Producer A', year: 2001 },
    { producer: 'Producer B', year: 2005 },
    { producer: 'Producer B', year: 2006 },
    { producer: 'Producer C', year: 2010 },
    { producer: 'Producer C', year: 2011 },
    { producer: 'Producer D', year: 2030 },
    { producer: 'Producer D', year: 2035 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.min, [
    { producer: 'Producer A', interval: 1, previousWin: 2000, followingWin: 2001 },
    { producer: 'Producer B', interval: 1, previousWin: 2005, followingWin: 2006 },
    { producer: 'Producer C', interval: 1, previousWin: 2010, followingWin: 2011 },
  ]);
  assert.equal(response.body.max.length, 1);
});

test('GET /producers/intervals preserves all tied maximum results', async () => {
  const winners = [
    { producer: 'Producer A', year: 2000 },
    { producer: 'Producer A', year: 2010 },
    { producer: 'Producer B', year: 2005 },
    { producer: 'Producer B', year: 2015 },
    { producer: 'Producer C', year: 2010 },
    { producer: 'Producer C', year: 2020 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.max, [
    { producer: 'Producer A', interval: 10, previousWin: 2000, followingWin: 2010 },
    { producer: 'Producer B', interval: 10, previousWin: 2005, followingWin: 2015 },
    { producer: 'Producer C', interval: 10, previousWin: 2010, followingWin: 2020 },
  ]);
});

test('GET /producers/intervals supports multiple producers and unordered input years', async () => {
  const winners = [
    { producer: 'Producer Z', year: 2023 },
    { producer: 'Producer X', year: 2010 },
    { producer: 'Producer X', year: 2014 },
    { producer: 'Producer Y', year: 2012 },
    { producer: 'Producer Y', year: 2013 },
    { producer: 'Producer X', year: 2017 },
    { producer: 'Producer Z', year: 2021 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    min: [
      { producer: 'Producer Y', interval: 1, previousWin: 2012, followingWin: 2013 },
    ],
    max: [
      { producer: 'Producer X', interval: 4, previousWin: 2010, followingWin: 2014 },
    ],
  });
});

test('GET /producers/intervals ignores one-win producers', async () => {
  const response = await request(buildApp([
    { producer: 'Producer Solo', year: 1990 },
    { producer: 'Producer Multi', year: 2000 },
    { producer: 'Producer Multi', year: 2005 },
  ])).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    min: [{ producer: 'Producer Multi', interval: 5, previousWin: 2000, followingWin: 2005 }],
    max: [{ producer: 'Producer Multi', interval: 5, previousWin: 2000, followingWin: 2005 }],
  });
});

test('GET /producers/intervals handles consecutive interval correctness for the mandatory scenario', async () => {
  const winners = [
    { producer: 'Producer A', year: 1980 },
    { producer: 'Producer A', year: 1985 },
    { producer: 'Producer A', year: 1986 },
    { producer: 'Producer A', year: 2000 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    min: [{ producer: 'Producer A', interval: 1, previousWin: 1985, followingWin: 1986 }],
    max: [{ producer: 'Producer A', interval: 14, previousWin: 1986, followingWin: 2000 }],
  });
});

test('GET /producers/intervals returns empty arrays when no producer has multiple wins', async () => {
  const response = await request(buildApp([
    { producer: 'Producer One', year: 1991 },
    { producer: 'Producer Two', year: 1992 },
  ])).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { min: [], max: [] });
});

test('GET /producers/intervals works with an alternative dataset', async () => {
  const winners = [
    { producer: 'Producer A', year: 1990 },
    { producer: 'Producer A', year: 1992 },
    { producer: 'Producer A', year: 2000 },
    { producer: 'Producer B', year: 1995 },
    { producer: 'Producer B', year: 2005 },
    { producer: 'Producer C', year: 2001 },
    { producer: 'Producer C', year: 2005 },
  ];

  const response = await request(buildApp(winners)).get('/producers/intervals');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    min: [
      { producer: 'Producer A', interval: 2, previousWin: 1990, followingWin: 1992 },
    ],
    max: [
      { producer: 'Producer B', interval: 10, previousWin: 1995, followingWin: 2005 },
    ],
  });
});

test('GET /producers/intervals returns imported CSV data through SQLite', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outsera-api-'));
  const csvPath = path.join(tempDir, 'dataset.csv');

  await fs.writeFile(
    csvPath,
    [
      'year;title;studios;producers;winner',
      '2000;Movie A;Studio A;Producer A;yes',
      '2005;Movie B;Studio B;Producer A;yes',
      '2010;Movie C;Studio C;Producer A;no',
      '2012;Movie D;Studio D;Producer B;yes',
    ].join('\n'),
    'utf-8',
  );

  try {
    const { db } = await initializeApplication({ port: 3000, csvPath });
    const app = createApp(
      { port: 3000, csvPath },
      { producerIntervalRepository: new SqliteProducerIntervalRepository(db) },
    );

    const response = await request(app).get('/producers/intervals');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      min: [{ producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }],
      max: [{ producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }],
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('GET /producers/intervals handles duplicate producers in one CSV row', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outsera-api-'));
  const csvPath = path.join(tempDir, 'duplicate-producer.csv');

  await fs.writeFile(
    csvPath,
    [
      'year;title;studios;producers;winner',
      '2000;Movie A;Studio A;Producer A, Producer A;yes',
      '2005;Movie B;Studio B;Producer A;yes',
    ].join('\n'),
    'utf-8',
  );

  try {
    const { db } = await initializeApplication({ port: 3000, csvPath });
    const app = createApp(
      { port: 3000, csvPath },
      { producerIntervalRepository: new SqliteProducerIntervalRepository(db) },
    );

    const response = await request(app).get('/producers/intervals');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      min: [{ producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }],
      max: [{ producer: 'Producer A', interval: 5, previousWin: 2000, followingWin: 2005 }],
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
