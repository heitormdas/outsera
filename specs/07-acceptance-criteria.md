# Acceptance Criteria

## Startup

- [ ] Application creates an embedded in-memory database during startup.
- [ ] Application loads the configured CSV during startup.
- [ ] Application does not silently continue after a required import failure.
- [ ] Imported data is available before the application is considered ready.

## CSV

- [ ] Parser uses `;` as delimiter.
- [ ] `winner = yes` identifies winners.
- [ ] Multiple producers are handled independently.
- [ ] Surrounding producer whitespace is normalized.
- [ ] Import is transactional.
- [ ] CSV parsing is not implemented as a naive delimiter split.

## Business rule

- [ ] Only winners participate.
- [ ] Winning years are sorted.
- [ ] Only consecutive wins are compared.
- [ ] One-win producers are ignored.
- [ ] Minimum is correct.
- [ ] Maximum is correct.
- [ ] All minimum ties are returned.
- [ ] All maximum ties are returned.
- [ ] Original sample values are not hardcoded.
- [ ] Alternative datasets produce correct results.

## API

- [ ] `GET /producers/intervals` exists.
- [ ] Successful response is HTTP 200.
- [ ] Response contains `min` and `max`.
- [ ] Each item contains `producer`, `interval`, `previousWin`, and `followingWin`.
- [ ] Empty eligible set returns empty arrays.
- [ ] Result ordering is deterministic.
- [ ] API follows Richardson level 2.

## Tests

- [ ] Tests are integration tests only.
- [ ] Tests exercise the API through HTTP.
- [ ] Tests validate returned data.
- [ ] Minimum tie is tested.
- [ ] Maximum tie is tested.
- [ ] Multiple producers are tested.
- [ ] One-win producer is tested.
- [ ] Unordered years are tested.
- [ ] Consecutive-interval correctness is tested.
- [ ] Alternative datasets are tested.

## Documentation and delivery

- [ ] README explains setup.
- [ ] README explains running the application.
- [ ] README explains running integration tests.
- [ ] README documents the API.
- [ ] AI interaction record exists.
- [ ] Repository is Git-ready.
