# Database

Read:

- `specs/04-data-model.md`
- `specs/00-overview.md`

Implement the embedded in-memory SQLite persistence layer.

Use the recommended normalized model:

- movies;
- producers;
- movie_producers.

Requirements:

- no external database;
- create schema during startup;
- repository boundary;
- prepared statements;
- transaction support where required.

Do not implement CSV parsing, interval calculation, or HTTP endpoint behavior yet.

Validate schema creation and basic persistence through integration-level behavior where practical.

Run checks and record the interaction.
