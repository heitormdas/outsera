import type { ProducerWin } from '../../app/producerIntervals';
import type { DatabaseClient } from '../database';

export type ProducerIntervalRepository = {
  getWinnerYears: () => Promise<ProducerWin[]>;
};

export class SqliteProducerIntervalRepository implements ProducerIntervalRepository {
  constructor(private readonly db: DatabaseClient) {}

  getWinnerYears(): Promise<ProducerWin[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `
        SELECT producers.name AS producer, movies.year AS year
        FROM movies
        INNER JOIN movie_producers ON movie_producers.movie_id = movies.id
        INNER JOIN producers ON producers.id = movie_producers.producer_id
        WHERE movies.winner = 1
        `,
        (error, rows: ProducerWin[]) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(rows);
        },
      );
    });
  }
}

export class InMemoryProducerIntervalRepository implements ProducerIntervalRepository {
  constructor(private readonly winners: ProducerWin[] = []) {}

  async getWinnerYears(): Promise<ProducerWin[]> {
    return [...this.winners];
  }
}
