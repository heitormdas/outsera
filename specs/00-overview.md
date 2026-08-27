# Specification — Golden Raspberry Awards API

## Purpose

Build a RESTful backend API to process the Golden Raspberry Awards category "Pior Filme" dataset and expose producers with the shortest and longest intervals between consecutive wins.

## Explicit assessment requirements

The application must:

- read the CSV dataset when the application starts;
- insert the data into an embedded in-memory database;
- expose a RESTful API;
- provide the producer with the longest interval between two consecutive awards;
- provide the producer with the shortest interval between two consecutive awards;
- follow Richardson maturity level 2;
- contain integration tests only;
- ensure tests validate returned data against the supplied data;
- require no external infrastructure;
- include README instructions;
- keep an AI interaction record in the repository.

## Dataset

The example dataset format is:

`year;title;studios;producers;winner`

The source example uses `;` as delimiter.

The `producers` field can represent multiple producers.

## Non-goals

Unless required by the implementation or added by a later specification change, do not add:

- authentication;
- authorization;
- generic CRUD;
- pagination;
- remote dataset retrieval;
- persistent storage between executions;
- HATEOAS.

## Source of truth

Explicit requirements come from the assessment PDF.

Detailed project behavior is captured in the specifications in this directory.
