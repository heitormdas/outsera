# Performance Review

Review performance and algorithmic complexity.

Inspect:

- CSV import;
- transactions;
- SQL query count;
- grouping;
- sorting;
- interval generation;
- memory use.

Look specifically for:

- N+1 queries;
- repeated sorting;
- unnecessary full-data passes;
- repeated CSV reads;
- inefficient data structures;
- unnecessarily complex SQL.

Do not optimize prematurely.

Report the current complexity and only implement improvements that materially improve the solution without hurting clarity.

Run tests/lint/typecheck after changes.
