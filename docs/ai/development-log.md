# AI Development Log

Record only AI interactions that actually occurred.

## Entry template

### YYYY-MM-DD — Task

**Prompt file:**
`.github/prompts/...`

**Objective:**
What the agent was asked to do.

**Agent result:**
What was actually proposed or changed.

**Decisions adopted:**
Relevant decisions accepted.

**Decisions rejected:**
Relevant suggestions intentionally rejected, if any.

**Files changed:**
Actual files changed.

**Validation:**
- tests: PASS/FAIL/NOT RUN
- lint: PASS/FAIL/NOT RUN
- typecheck: PASS/FAIL/NOT RUN
- build: PASS/FAIL/NOT RUN

**Notes:**
Important follow-up information.

## Rule

Never fabricate an interaction, prompt, decision, or validation result.

### 2026-08-27 — Bootstrap foundation implementation

**Prompt file:**
`.github/prompts/implementation/01-bootstrap.prompt.md`

**Objective:**
Set up the TypeScript/Express project foundation, add the test harness, and keep the work limited to bootstrap only.

**Agent result:**
Created the foundation files for configuration loading, the Express app factory, the startup entrypoint, and the project scripts/dependencies needed for TypeScript, linting, and Supertest-based HTTP testing. Added a minimal HTTP smoke test that exercises the Express app without binding a real TCP listener.

**Decisions adopted:**
- Node.js + TypeScript
- Express
- `createApp()` separated from real startup/listen lifecycle
- Supertest used for HTTP-layer testing without a real TCP listener
- default `CSV_PATH=Movielist.csv` and `PORT=3000`
- keep the bootstrap stage limited to foundation work only

**Decisions rejected:**
- none

**Files changed:**
- `package.json`
- `src/config.ts`
- `src/app.ts`
- `src/server.ts`
- `eslint.config.mjs`
- `test/app.test.ts`

**Validation:**
- tests: PASS
- lint: PASS
- typecheck: PASS
- build: PASS

**Notes:**
No database, CSV import, business rule, or final API endpoint logic was implemented in this stage.

### 2026-08-27 — SQLite persistence foundation

**Prompt file:**
`.github/prompts/implementation/02-database.prompt.md`

**Objective:**
Implement the in-memory SQLite persistence layer with the normalized movie/producer schema, repository boundary, and basic persistence checks without adding CSV import or API logic.

**Agent result:**
Created the in-memory SQLite initialization and repository layer for movies, producers, and the `movie_producers` link table. Added an integration-style test that verifies schema creation and persistence behavior through the repository boundary.

**Decisions adopted:**
- SQLite3 with an in-memory database
- normalized `movies`, `producers`, and `movie_producers` tables
- repository boundary encapsulating persistence operations
- `producer_id` used as the persisted identity in the database layer
- application startup is separated from the database bootstrap function, in line with the stage requirement

**Decisions rejected:**
- none

**Files changed:**
- `package.json`
- `src/infrastructure/database.ts`
- `src/infrastructure/repositories/movieRepository.ts`
- `test/database.test.ts`

**Validation:**
- tests: PASS
- lint: PASS
- typecheck: PASS
- build: PASS

**Notes:**
This stage did not add CSV parsing, interval calculation, or HTTP endpoint behavior.
