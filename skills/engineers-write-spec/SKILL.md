---
name: engineers-write-spec
description: Produce a technical spec / design doc for a feature or system change. Reads the project specification (README, CLAUDE.md, manifest, ADRs, architecture docs), then dispatches an engineering persona to draft the spec in their register. Default persona auto-selected by signal — Hejlsberg for language/API, Carmack for performance, Knuth for algorithm correctness, DHH for pragmatic web app, etc. Override with --persona. Output saves to engineering/specs/<slug>.md. Use when a feature or system change needs a structured proposal before implementation.
---

# /engineers-write-spec <feature> [--persona <name>]

Produce a technical spec for a feature or system change.

## What this does

This skill is the engineering equivalent of the publishers/marketers `write-positioning` skill — the upstream artifact that downstream work obeys. Before code is written, the spec establishes what's being built, what constraints apply, what alternatives were considered, what trade-offs were accepted, and what's still open.

The spec serves three downstream consumers:

1. The implementer (often a different person from the spec author) — they read the spec and build accordingly.
2. The reviewer — they read both spec and code and check whether the implementation matches the proposal.
3. The future maintainer — they read the spec years later to understand why a given choice was made.

## When to use

- A feature or system change is non-trivial enough that an explicit proposal makes the work easier to review and the future easier to navigate.
- Multiple implementations are possible and the team needs to decide between them.
- An ADR (architecture decision record) is needed to capture a load-bearing choice.

Not for: line-level code reviews (use `/engineers-design-review`); craft conversations about a single function (use `/engineers-channel <persona>`); auto-generated documentation (this is craft work, not extraction).

## Instructions for Claude

When this skill is invoked with a `<feature>` argument and optional `--persona`:

1. **Resolve the project root** the same way `/engineers-project-init` does. Verify `CLAUDE.md` (or `README.md`) exists and the `engineering/` directory is present. If `engineering/` is missing, recommend running `/engineers-project-init` first; do not auto-create.

2. **Read the project specification:**
   - `CLAUDE.md` — orchestrator-mode notes, current spec slug, conventions
   - `README.md` — what the project does
   - The manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.) — declared dependencies, runtime versions
   - `ARCHITECTURE.md` if present — system structure, load-bearing assumptions
   - `ADR/` if present — prior decisions that constrain or inform this one
   - `.great-authors/project.md` if cross-craft project
   - The relevant existing code (paths the user references, or modules adjacent to the feature)

3. **Resolve the persona to dispatch.** If `--persona` is given, use it. Otherwise auto-select by signal:

   | Signal in the feature description / project | Default persona |
   |---|---|
   | "type system", "API design", "language feature", TypeScript | `anders-hejlsberg-engineer` |
   | "performance", "throughput", "memory", "latency", systems-level | `john-carmack-engineer` |
   | "algorithm", "complexity", "correctness", "proof", math | `don-knuth-engineer` |
   | "web platform", "browser API", "JavaScript", backwards compat | `brendan-eich-engineer` |
   | "Rails", "monolith", "convention", pragmatic web app | `dhh-engineer` |
   | "refactor", "OO design", "responsibility", clarity | `sandi-metz-engineer` |
   | "kernel", "OS", "syscall", "ABI", low-level | `linus-torvalds-engineer` |
   | "documentation", "legacy", "accessibility", maintenance | `grace-hopper-engineer` |
   | "invariant", "concurrent", "formal", correctness proof | `edsger-dijkstra-engineer` |
   | None of the above | `don-knuth-engineer` (the rigorous default) |

   Document the choice in the spec's frontmatter.

4. **Dispatch the persona** via the Agent tool with `subagent_type: "great-engineers:<persona-slug>-engineer"`. The brief must include:
   - The feature description (the user's `<feature>` argument, plus any context the user provided)
   - All bible files read above (paths only — the persona reads them)
   - The relevant existing code (paths or excerpts)
   - The ADRs that inform this decision (paths)
   - The output target: `engineering/specs/<slug>.md`
   - The required structure (below)
   - Length target: 600-1,200 words

5. **The output structure:**

```markdown
---
title: <Feature name>
slug: <slug>
persona: <persona-slug>
created: YYYY-MM-DD
status: draft | proposed | accepted | implemented | superseded
---

# Spec: <Title>

## Problem

<One paragraph. What is the problem? Who has it? Why now?>

## Constraints

<Bulleted list. Real constraints — runtime versions, backwards compatibility, team size, deadlines, budget. The constraints are part of the design.>

## Proposal

<2-4 paragraphs. The proposed solution, described concretely enough that the implementer can build it. Include API shapes, data structures, key code snippets where they clarify.>

## Alternatives considered

<2-4 alternatives with one paragraph each. What was rejected and why. The rejections are part of the proposal's defense.>

## Trade-offs

<Bulleted list. What the proposal costs in exchange for what it buys. Honest accounting, not advocacy.>

## Decision

<One paragraph. The chosen path, the reasoning in one or two sentences, the criterion that would invalidate the decision.>

## Open questions

<Bulleted list. Things the spec does not yet answer. The implementer is allowed to make these calls; the spec author is acknowledging the gaps.>
```

6. **Save the doc** to `engineering/specs/<slug>.md`. If the file exists, ask the user whether to overwrite, save as `<slug>-v2.md`, or skip.

7. **Report:**
   ```
   📝 Saved to engineering/specs/<slug>.md (<word-count> words, drafted by <persona>).

   Problem:    <one-line summary>
   Decision:   <one-line summary>

   Next:
   - /engineers-design-review engineering/specs/<slug>.md to dispatch a panel for review
   - /engineers-channel <other-persona> to refine specific sections (e.g., Knuth on the algorithm proof, Sandi Metz on the API ergonomics)
   ```

## What the skill does NOT do

- Does not write code. The spec describes; the implementer builds. (For agency-style autonomous code execution, use `/agency-execute` in `great-minds`.)
- Does not deploy, ship, or run. It produces a doc.
- Does not auto-decide between alternatives — the persona presents alternatives, names trade-offs, recommends. The user (or the orchestrator) makes the call.
- Does not invent constraints. Every constraint in the spec must trace to the manifest, the ADRs, the existing code, or stated user requirements. No hallucinated browser-version requirements.

## Notes

- The spec is the contract. If the implementation diverges from the spec, fix the spec first; then continue. Don't let the code silently overwrite the design.
- A project may have multiple specs over time (one per feature or system change). Each gets its own slug — set via `CLAUDE.md`'s `Current spec:` field.
- For ADRs (architecture decision records — a more constrained format), use `--persona knuth` or `--persona dijkstra` and request the ADR format explicitly. Filed for v1.0 as its own skill.
