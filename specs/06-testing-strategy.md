# Testing Strategy

## Constraint

The assessment requires integration tests only.

Do not create unit tests.

## Test boundary

Tests should start the application and exercise the API through HTTP.

## Required scenarios

At minimum:

1. normal dataset;
2. tied minimum;
3. tied maximum;
4. multiple producers;
5. producer with one win;
6. unordered input;
7. consecutive-interval correctness;
8. no producer with multiple wins;
9. alternative datasets.

## Mandatory consecutive case

For a producer with:

`1980, 1985, 1986, 2000`

the generated intervals are `5, 1, 14`.

Therefore:

- minimum = `1`;
- maximum = `14`.

The test must detect an incorrect first-vs-last implementation.

## Alternative fixtures

Use test datasets/fixtures so the business rule is not validated only against the production sample.

## Assertions

Integration tests should validate:

- HTTP status;
- JSON structure;
- result count;
- producer;
- interval;
- previousWin;
- followingWin;
- ties.

Avoid asserting incidental ordering unless the API contract defines the ordering.
