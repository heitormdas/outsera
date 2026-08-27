---
applyTo: "src/**/*.ts"
---

# Backend Instructions

Keep route handlers thin.

Keep business rules outside HTTP handlers.

Keep persistence operations inside infrastructure/repository code.

Use explicit TypeScript types.

Avoid unnecessary abstractions and dependencies.

Do not expose SQLite-specific objects through application or API layers.

Prefer deterministic behavior.

Do not introduce unrelated endpoints or features.

When changing public behavior, update the relevant specification or documentation only when the change is actually required and justified.
