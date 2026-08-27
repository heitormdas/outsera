# Data Model

## Purpose

Represent movies and producers without losing the many-to-many relationship created by movies with multiple producers.

## Recommended relational model

### movies

- `id`
- `year`
- `title`
- `studios`
- `winner`

### producers

- `id`
- `name`

### movie_producers

- `movie_id`
- `producer_id`

## Relationships

One movie can have many producers.

One producer can be associated with many movies.

Therefore:

`movies N:N producers`

through:

`movie_producers`.

## Persistence constraints

Use an embedded in-memory database.

No externally installed database is required.

The database may be recreated on each process start.

## Repository boundary

SQLite-specific details remain in infrastructure/repository code.

Application/domain code should consume project-level types and data structures.
