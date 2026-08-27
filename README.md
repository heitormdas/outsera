# Golden Raspberry Awards API

REST API for calculating the shortest and longest intervals between consecutive wins by producer in the Golden Raspberry Awards dataset.

## Requirements

- Node.js 18 or newer
- npm

## Setup

Install dependencies:

```bash
npm install
```

The application uses `Movielist.csv` by default. Override the dataset or port with environment variables:

```bash
CSV_PATH=Movielist.csv PORT=3000 npm start
```

## Run

For development with automatic TypeScript reload:

```bash
npm run dev
```

For a compiled build:

```bash
npm run build
npm start
```

The server listens on port `3000` by default.

## Tests and checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Tests exercise the API through HTTP using integration test datasets.

## API

### `GET /producers/intervals`

Returns all results tied for the shortest and longest intervals between consecutive winning years for each producer.

Example response:

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

When no producer has multiple winning years, both arrays are empty.
