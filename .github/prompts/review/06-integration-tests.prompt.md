# Integration Tests

Read:

- `specs/06-testing-strategy.md`
- `specs/07-acceptance-criteria.md`
- `specs/02-api-contract.md`

Implement comprehensive integration coverage through HTTP.

Do not create unit tests.

Cover:

- normal dataset;
- minimum tie;
- maximum tie;
- multiple producers;
- one-win producer;
- unordered years;
- consecutive interval correctness;
- no repeated winners;
- alternative datasets.

Mandatory scenario:

1980, 1985, 1986, 2000
→ intervals 5, 1, 14
→ min 1
→ max 14

Tests must validate actual response values and shape.

Use fixtures where appropriate.

Run the full suite and record the interaction.
