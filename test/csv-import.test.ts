import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createInMemoryDatabase, initializeSchema } from '../src/infrastructure/database';
import { importCsvDataset } from '../src/infrastructure/import/csvImporter';

test('CSV import persists all rows and normalizes producer names', async () => {
  const tmpDir = path.join(process.cwd(), 'tmp-tests');
  const csvPath = path.join(tmpDir, 'sample.csv');
  const db = createInMemoryDatabase();

  await fs.mkdir(tmpDir, { recursive: true });
  await fs.writeFile(
    csvPath,
    [
      'year;title;studios;producers;winner',
      '1980;The Empire Strikes Back;Lucasfilm;Producer A, Producer B;yes',
      '1981;The Thing;Universal;Producer C;no',
      '1982;Return of the Jedi;Lucasfilm;Producer A;yes',
    ].join('\n'),
    'utf-8',
  );

  try {
    await initializeSchema(db);
    const result = await importCsvDataset(db, csvPath);

    assert.equal(result.movieCount, 3);
    assert.equal(result.producerCount, 3);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
    await new Promise<void>((resolve, reject) => {
      db.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
