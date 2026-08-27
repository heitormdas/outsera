# Startup and CSV Import

## Input

Format:

`year;title;studios;producers;winner`

Delimiter:

`;`

## Startup sequence

1. initialize the embedded in-memory database;
2. create schema;
3. resolve the configured CSV path;
4. read and parse the dataset;
5. normalize supported input details;
6. persist the records and producer relationships;
7. finish application initialization;
8. expose the HTTP application.

The HTTP application must not be considered ready before required initialization has completed.

## Import transaction

Persist the dataset transactionally so a failed import does not leave a partially imported dataset.

## Default configuration

A project default may be:

- `CSV_PATH=Movielist.csv`
- `PORT=3000`

Environment configuration can override these defaults.

## Failure behavior

Failure to read, parse, validate, or persist required startup data must fail startup explicitly.

Do not silently start with an incomplete dataset.

## Import library

Use a real CSV parser that supports quoted fields and the configured delimiter rather than implementing a naive line/field split.
