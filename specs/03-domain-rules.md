# Domain Rules

## DR-01 — Winner filtering

Only winning records participate in the calculation.

## DR-02 — Producer expansion

Each producer listed on a winning movie is treated independently.

## DR-03 — Name normalization

Trim surrounding whitespace from producer names.

Do not perform aggressive transformations that could merge distinct producers without explicit justification.

## DR-04 — Chronological ordering

Winning years for each producer must be ordered ascending before interval generation.

## DR-05 — Consecutive pairs

For:

`y1, y2, y3, ..., yn`

generate:

`y2 - y1`, `y3 - y2`, ..., `yn - y(n-1)`.

## DR-06 — Minimum

Select the smallest generated interval.

## DR-07 — Maximum

Select the largest generated interval.

## DR-08 — Tie preservation

Do not discard equivalent min/max results.

## DR-09 — One-win producer

A producer with one winning year is not eligible for interval calculation.

## DR-10 — Duplicate data

The assessment does not explicitly define duplicate records or duplicate producer/year combinations.

Do not invent special semantics. If implementation decisions are required, document them and keep behavior deterministic.

## DR-11 — Dataset independence

The rules must apply to arbitrary valid input datasets.
