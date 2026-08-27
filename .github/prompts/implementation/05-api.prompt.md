# API

Read:

- `specs/02-api-contract.md`
- `specs/00-overview.md`

Implement:

`GET /producers/intervals`

Requirements:

- HTTP GET;
- HTTP 200 on successful calculation;
- response shape exactly compatible with the specification;
- deterministic result ordering;
- business rule outside the route handler;
- no HATEOAS.

Expected flow:

route
→ controller/presentation
→ application/use case
→ repository
→ database

A minimal health endpoint is optional only if it fits the existing application design.

Do not add unrelated features.

Run integration tests and checks.

Record actual interaction and validation.
