# Specification Audit

Act as a specification auditor.

Read:

- every file under `specs/`;
- `.github/copilot-instructions.md`;
- relevant source;
- integration tests;
- README.

For every acceptance criterion in `specs/07-acceptance-criteria.md`, report:

- PASS;
- PARTIAL;
- FAIL;
- N/A.

Do not infer success from code structure alone.

A criterion is PASS only when implementation and appropriate verification evidence exist.

Focus on:

- consecutive intervals;
- ties;
- multiple producers;
- one-win producers;
- alternative datasets;
- startup import;
- in-memory database;
- Richardson level 2;
- integration-only testing;
- API response contract.

Do not modify code during the audit.

Return:

ID | Criterion | Status | Implementation Evidence | Test Evidence | Risk
