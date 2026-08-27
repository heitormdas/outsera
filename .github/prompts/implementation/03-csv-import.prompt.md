# CSV Import

Read:

- `specs/01-functional-requirements.md`
- `specs/05-startup-and-import.md`
- `specs/04-data-model.md`

Implement CSV startup import.

Requirements:

- delimiter `;`;
- `winner = yes` identifies winners;
- multiple producers separated by commas;
- trim surrounding producer whitespace;
- use a real CSV parser;
- transactional persistence;
- configurable path with an appropriate project default;
- fail startup explicitly when a required import fails.

Keep parsing/transformation/persistence responsibilities separated.

Do not implement producer interval calculation or final endpoint logic.

Run checks and record actual results.
