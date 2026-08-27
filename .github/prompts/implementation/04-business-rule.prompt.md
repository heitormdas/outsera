# Business Rule

Read:

- `specs/01-functional-requirements.md`
- `specs/03-domain-rules.md`
- `specs/07-acceptance-criteria.md`

Implement producer interval calculation.

Rules:

1. winners only;
2. expand multiple producers independently;
3. group winning years by producer;
4. sort years ascending;
5. calculate only consecutive intervals;
6. ignore producers with fewer than two wins;
7. determine global minimum;
8. determine global maximum;
9. preserve all ties.

Mandatory scenario:

1980, 1985, 1986, 2000

must generate:

5, 1, 14

and therefore min=1, max=14.

Do not hardcode the sample dataset.

Do not create unit tests.

Keep the rule independent from HTTP and SQLite-specific details.

Validate through integration behavior once an HTTP boundary is available, or prepare the application component for that integration.

Run checks and record the interaction.
