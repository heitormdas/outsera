# Senior Code Review

Perform a senior-level review before making changes.

Read all specifications and inspect the full repository.

Prioritize:

1. requirement violations;
2. business-rule bugs;
3. alternative-dataset failures;
4. multiple-producer failures;
5. tie failures;
6. startup/import failures;
7. integration-test gaps;
8. architectural issues;
9. performance problems;
10. documentation issues.

Pay special attention to first-vs-last calculations, hardcoding, single-win producers, unordered data, nondeterministic responses, and tests that bypass HTTP.

Return findings by severity:

BLOCKER
HIGH
MEDIUM
LOW

For each finding include file, evidence, impact, and recommendation.

Do not modify the repository during the initial review.
