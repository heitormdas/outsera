# Functional Requirements

## FR-01 — Startup import

The application must load the configured CSV during startup and persist the dataset before the application is considered ready.

## FR-02 — Winner detection

Records with `winner = yes` are winners.

Non-winning records must not contribute to producer interval calculations.

## FR-03 — Multiple producers

A winning record with multiple producers gives the same winning year independently to each listed producer.

Example:

`Producer A, Producer B`

contributes a win for both Producer A and Producer B.

## FR-04 — Winning years

For each producer, collect every year in which the producer is associated with a winning record.

## FR-05 — Consecutive intervals

Sort the winning years of each producer in ascending order and calculate intervals only between adjacent years.

For `[1980, 1985, 1986, 2000]`:

- `1980 → 1985 = 5`
- `1985 → 1986 = 1`
- `1986 → 2000 = 14`

## FR-06 — Minimum interval

The minimum is the smallest interval produced across all eligible producers.

## FR-07 — Maximum interval

The maximum is the largest interval produced across all eligible producers.

## FR-08 — Ties

Return every result tied at the global minimum.

Return every result tied at the global maximum.

## FR-09 — Single-win producer

A producer with fewer than two winning years produces no interval and is excluded from min/max.

## FR-10 — Empty interval set

When no producer has two or more winning years, return:

```json
{
  "min": [],
  "max": []
}
```

This is a project behavior decision because the assessment does not specify a separate empty-case payload.

## FR-11 — Dataset independence

The implementation must work with datasets different from the example dataset.

No producer names, years, or expected answers may be hardcoded.

## FR-12 — Determinism

The response ordering must be deterministic.

The selected deterministic ordering must be documented by the implementation.
