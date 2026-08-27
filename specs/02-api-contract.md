# API Contract

## Endpoint

`GET /producers/intervals`

## Success

HTTP `200 OK`.

Response Content-Type:

`application/json`

## Response shape

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

## Result item

Fields:

- `producer`
- `interval`
- `previousWin`
- `followingWin`

## Semantics

`previousWin` is the earlier winning year for that producer.

`followingWin` is the immediately following winning year for that producer.

`interval` equals:

`followingWin - previousWin`

## Empty result

```json
{
  "min": [],
  "max": []
}
```

when no producer has multiple wins.

## REST maturity

Use HTTP resources, methods, and status codes consistent with Richardson maturity level 2.

HATEOAS is not required.
