# Adversarial Dataset Review

Act as a hostile evaluator.

Read the business-rule and API specifications.

Do not modify code initially.

Construct alternative datasets mentally and identify cases that could break the implementation.

Consider:

- zero winners;
- one winner;
- single-win producers;
- repeated wins;
- equal minimum intervals;
- equal maximum intervals;
- both min and max ties;
- multiple producers;
- unordered years;
- years far apart;
- minimal datasets;
- larger datasets;
- quoted CSV fields;
- inconsistent surrounding whitespace.

Pay special attention to any accidental dependency on the supplied example dataset.

After reporting issues, correct only genuine problems and add integration tests for them.

Run the complete check suite.
