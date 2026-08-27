import sqlite3 from 'sqlite3';

export type DatabaseClient = sqlite3.Database;

export function createInMemoryDatabase(): DatabaseClient {
  return new sqlite3.Database(':memory:');
}

export function initializeSchema(db: DatabaseClient): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year INTEGER NOT NULL,
          title TEXT NOT NULL,
          studios TEXT NOT NULL,
          winner INTEGER NOT NULL CHECK (winner IN (0, 1))
        )
        `,
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          db.run(
            `
            CREATE TABLE producers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL
            )
            `,
            (producerError) => {
              if (producerError) {
                reject(producerError);
                return;
              }

              db.run(
                `
                CREATE TABLE movie_producers (
                  movie_id INTEGER NOT NULL,
                  producer_id INTEGER NOT NULL,
                  PRIMARY KEY (movie_id, producer_id),
                  FOREIGN KEY (movie_id) REFERENCES movies(id),
                  FOREIGN KEY (producer_id) REFERENCES producers(id)
                )
                `,
                (joinError) => {
                  if (joinError) {
                    reject(joinError);
                    return;
                  }

                  resolve();
                },
              );
            },
          );
        },
      );
    });
  });
}
