# Hardening

Review the implementation against all specifications.

Do not add unrelated functionality.

Look for failures involving:

- CSV parsing;
- quoted fields;
- multiple producers;
- whitespace;
- invalid startup data;
- transactions;
- unordered years;
- ties;
- one-win producers;
- empty results;
- deterministic ordering;
- configuration paths;
- startup lifecycle.

When a real problem is found:

1. explain it;
2. implement the smallest safe correction;
3. add/adjust an integration test;
4. rerun checks;
5. record the decision.

Do not create unit tests.
