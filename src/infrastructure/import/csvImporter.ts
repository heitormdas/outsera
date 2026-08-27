import fs from 'node:fs/promises';
import path from 'node:path';

import type { DatabaseClient } from '../database';
import { MovieRepository } from '../repositories/movieRepository';
import { parseCsvFile } from './csvParser';

export type CsvImportResult = {
  movieCount: number;
  producerCount: number;
};

export async function importCsvDataset(db: DatabaseClient, csvPath: string): Promise<CsvImportResult> {
  const resolvedPath = path.resolve(csvPath);
  const content = await fs.readFile(resolvedPath, 'utf-8');
  const rows = parseCsvFile(content);

  const repository = new MovieRepository(db);
  const existingProducers = new Map((await repository.listProducers()).map((producer) => [producer.name, producer.id]));
  let totalMovies = 0;
  let totalProducers = 0;

  for (const row of rows) {
    const year = Number.parseInt(row.year, 10);
    const title = row.title;
    const studios = row.studios;
    const winner = row.winner.toLowerCase() === 'yes';

    if (!Number.isInteger(year) || !title || !studios) {
      throw new Error(`Invalid CSV row: ${JSON.stringify(row)}`);
    }

    const movieId = await repository.insertMovie({
      year,
      title,
      studios,
      winner,
    });
    totalMovies += 1;

    const producers = row.producers
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);

    for (const producerName of producers) {
      const existingProducerId = existingProducers.get(producerName);

      if (existingProducerId !== undefined) {
        await repository.linkProducerToMovie(movieId, existingProducerId);
        continue;
      }

      const producerId = await repository.insertProducer(producerName);
      existingProducers.set(producerName, producerId);
      await repository.linkProducerToMovie(movieId, producerId);
      totalProducers += 1;
    }
  }

  return { movieCount: totalMovies, producerCount: totalProducers };
}
