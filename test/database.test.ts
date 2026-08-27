import test from 'node:test';
import assert from 'node:assert/strict';

import { createInMemoryDatabase, initializeSchema } from '../src/infrastructure/database';
import { MovieRepository } from '../src/infrastructure/repositories/movieRepository';

test('database schema persists movies, producers and their link relations', async () => {
  const db = createInMemoryDatabase();

  try {
    await initializeSchema(db);

    const repository = new MovieRepository(db);

    const movieId = await repository.insertMovie({
      year: 1980,
      title: 'The Empire Strikes Back',
      studios: 'Lucasfilm',
      winner: true,
    });

    const producerOneId = await repository.insertProducer('Producer A');
    const producerTwoId = await repository.insertProducer('Producer B');

    await repository.linkProducerToMovie(movieId, producerOneId);
    await repository.linkProducerToMovie(movieId, producerTwoId);

    const movies = await repository.listMovies();
    const producers = await repository.listProducers();
    const links = await repository.listMovieProducerLinks();

    assert.equal(movies.length, 1);
    assert.equal(movies[0].title, 'The Empire Strikes Back');
    assert.equal(movies[0].winner, true);

    assert.equal(producers.length, 2);
    assert.deepEqual(
      producers.map((producer) => producer.name).sort(),
      ['Producer A', 'Producer B'],
    );

    assert.deepEqual(links, [
      { movie_id: movieId, producer_id: producerOneId },
      { movie_id: movieId, producer_id: producerTwoId },
    ]);
  } finally {
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
