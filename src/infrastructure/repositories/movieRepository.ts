import type { DatabaseClient } from '../database';

export type MovieRecord = {
  id: number;
  year: number;
  title: string;
  studios: string;
  winner: boolean;
};

export type ProducerRecord = {
  id: number;
  name: string;
};

export type MovieProducerLink = {
  movie_id: number;
  producer_id: number;
};

export class MovieRepository {
  constructor(private readonly db: DatabaseClient) {}

  insertMovie(movie: Omit<MovieRecord, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)',
        [movie.year, movie.title, movie.studios, movie.winner ? 1 : 0],
        function onInserted(this: { lastID: number }, error: Error | null) {
          if (error) {
            reject(error);
            return;
          }

          resolve(this.lastID as number);
        },
      );
    });
  }

  insertProducer(name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO producers (name) VALUES (?)',
        [name],
        function onInserted(this: { lastID: number }, error: Error | null) {
          if (error) {
            reject(error);
            return;
          }

          resolve(this.lastID as number);
        },
      );
    });
  }

  linkProducerToMovie(movieId: number, producerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO movie_producers (movie_id, producer_id) VALUES (?, ?)',
        [movieId, producerId],
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  listMovies(): Promise<MovieRecord[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT id, year, title, studios, winner FROM movies', (error, rows: MovieRecord[]) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(
          rows.map((row) => ({
            ...row,
            winner: Boolean(row.winner),
          })),
        );
      });
    });
  }

  listProducers(): Promise<ProducerRecord[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT id, name FROM producers', (error, rows: ProducerRecord[]) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      });
    });
  }

  listMovieProducerLinks(): Promise<MovieProducerLink[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT movie_id, producer_id FROM movie_producers', (error, rows: MovieProducerLink[]) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      });
    });
  }
}
