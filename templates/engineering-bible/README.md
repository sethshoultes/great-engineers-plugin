# engineering/ — engineering-stage artifacts

This is the directory `/engineers-project-init` copies into a project's root, sibling to `manuscript/` (great-authors), `film/` (great-filmmakers), `publishers/` (great-publishers), `marketing/` (great-marketers).

## Subdirectories

| Subdir | Owner | Contents |
|---|---|---|
| `specs/` | Knuth, Hejlsberg, Carmack, DHH, etc. (persona-driven by signal) | Technical specs, design docs, RFCs, ADRs |
| `reviews/` | Default panel: Sandi Metz + Torvalds + Carmack (override available) | Code reviews, design reviews, audits |
| `runbooks/` | (filed for v1.0) | Production runbooks |

## Slug convention

Each artifact saves as `<slug>.md` under the appropriate subdir. The slug is set in `CLAUDE.md`'s `## Engineering` section's `Current spec` field. A single project may have multiple specs in flight (different features, different subsystems) — update the current-spec field as you move between them.

## Filename suffixes

Persona-specific alternatives use suffixes:

- `<slug>.md` — primary spec (auto-selected persona, default Knuth for rigor)
- `<slug>-adr.md` — ADR format (when used as architecture decision record)
- `<slug>-knuth-rigor.md`, `<slug>-dhh-pragmatic.md`, etc. — when the same feature gets multiple persona drafts for comparison
- `<slug>-design.md` — design-level review (vs line-level code review)

The orchestrator picks which to ship; the alternatives stay on disk as the engineering conversation.

## Why this lives at the project level

Engineering artifacts depend on the project's codebase, manifest, ADRs, and conventions. They cannot be project-agnostic. So they live at the project root, owned by the project, committed to the project's repo. The plugin scaffolds the directory; the project owns it from then on.
