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

### 2026-08-27 — CSV startup import

**Prompt file:**
`.github/prompts/implementation/03-csv-import.prompt.md`

**Objective:**
Implement CSV startup import with parsing, normalization, transactional persistence, and startup failure handling, while keeping the stage scoped to import only.

**Agent result:**
Added the real CSV parser integration, dataset import orchestration, startup bootstrap that initializes schema and imports before server listen, and an integration-style test that verifies the dataset is persisted correctly with both winner and non-winner records.

**Decisions adopted:**
- `csv-parse` with `;` delimiter and quoted-field support
- `winner = yes` detection and lowercase normalization
- multiple producers split by comma and trimmed
- all records are persisted; winner filtering is deferred to the business-rule stage
- `startServer()` now initializes the database and imports the CSV before the app listens
- explicit startup failure on import error

**Decisions rejected:**
- none

**Files changed:**
- `package.json`
- `src/startup.ts`
- `src/server.ts`
- `src/infrastructure/import/csvParser.ts`
- `src/infrastructure/import/csvImporter.ts`
- `src/infrastructure/repositories/movieRepository.ts`
- `test/csv-import.test.ts`

**Validation:**
- tests: PASS
- lint: PASS
- typecheck: PASS
- build: PASS

**Notes:**
This stage did not add interval calculation or the final `/producers/intervals` endpoint.

### 2026-08-27 — API boundary for producer intervals

**Prompt file:**
`.github/prompts/implementation/05-api.prompt.md`

**Objective:**
Add the HTTP layer for `GET /producers/intervals` while keeping the business rule separate from the controller and repository boundary.

**Agent result:**
Introduced the application/use-case/controller/repository flow for producer interval retrieval and added an integration test that exercises the Express HTTP layer through Supertest.

**Decisions adopted:**
- route handler at `GET /producers/intervals`
- response payload shape matching the specification
- deterministic ordering by `interval`, then `producer`, then `previousWin`, then `followingWin`
- business-rule logic kept outside the route handler
- createApp() remains separate from startup/listen lifecycle

**Decisions rejected:**
- none

**Files changed:**
- `src/app.ts`
- `src/application/useCases/getProducerIntervalsUseCase.ts`
- `src/infrastructure/repositories/producerIntervalRepository.ts`
- `src/presentation/controllers/producerIntervalsController.ts`
- `test/api.test.ts`

**Validation:**
- tests: PASS
- lint: PASS
- typecheck: PASS
- build: PASS

**Notes:**
This stage does not add unrelated features beyond the API response contract for producer intervals.

### 2026-08-27 — HTTP integration coverage review

**Prompt file:**
`.github/prompts/review/06-integration-tests.prompt.md`

**Objective:**
Implement comprehensive HTTP integration coverage for the required producer-interval scenarios and validate the route contract against the project specification.

**Agent result:**
Expanded the integration suite to cover the normal dataset, minimum tie, maximum tie, multiple producers, one-win producer, unordered years, the mandatory consecutive-interval scenario, empty eligible sets, and an alternative dataset.

**Decisions adopted:**
- integration tests only
- route behavior validated through `Supertest` over the Express app
- scenarios map directly to the specification’s acceptance criteria
- ordering remains deterministic and is validated via the actual response payload

**Decisions rejected:**
- none

**Files changed:**
- `test/api.test.ts`
- `test/producer-intervals.test.ts`

**Validation:**
- tests: PASS
- lint: PASS
- typecheck: PASS
- build: PASS

**Notes:**
The suite remains focused on actual HTTP behavior and avoids private implementation assertions.
