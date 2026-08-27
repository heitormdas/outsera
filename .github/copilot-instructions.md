# Copilot Instructions

## Project

This repository is a backend technical assessment for a RESTful API related to the Golden Raspberry Awards category "Pior Filme".

The assessment requires:

- loading the CSV dataset during application startup;
- inserting imported data into an embedded in-memory database;
- exposing a RESTful API;
- calculating minimum and maximum intervals between consecutive wins by producer;
- returning all results tied for minimum and maximum;
- implementing Richardson maturity level 2;
- implementing integration tests only;
- providing README instructions;
- keeping a record of AI-assisted development.

## Source of truth

The specifications under `specs/` define expected behavior.

Do not invent requirements that are not supported by the assessment or the specifications.

## Dataset

Format:

`year;title;studios;producers;winner`

Delimiter: `;`

The `producers` field may contain multiple producers separated by commas.

`winner = yes` identifies a winning record.

## Business rule

Only winners participate.

For each producer:

1. collect winning years;
2. sort years ascending;
3. compare only consecutive years;
4. ignore producers with fewer than two wins;
5. find global minimum;
6. find global maximum;
7. preserve every tied result.

Never replace consecutive-interval calculation with first-win vs last-win calculation.

## Architecture

Keep responsibilities separated:

HTTP/presentation
→ application/use case
→ repository
→ database

CSV parsing/import must remain separate from HTTP concerns.

Database-specific types must not leak into application/domain or API contracts.

Prefer simple, cohesive components over unnecessary architectural layers.

## Testing

This assessment requires integration tests only.

Tests should exercise the application through HTTP and verify observable behavior.

Do not add unit tests unless the specification is explicitly changed.

Important integration scenarios:

- normal dataset;
- tied minimum;
- tied maximum;
- multiple producers;
- one-win producer;
- unordered input years;
- consecutive wins;
- no repeated winners;
- alternative datasets.

## Agent workflow

Before editing:

1. inspect the repository;
2. read the relevant specification;
3. identify affected files;
4. make a minimal plan.

After editing:

1. run relevant tests;
2. run lint;
3. run typecheck;
4. run build when available;
5. fix regressions;
6. update documentation when behavior changes;
7. record significant AI-assisted decisions in `docs/ai/development-log.md`.

Do not modify unrelated files.

Do not mark a task complete without validation.
