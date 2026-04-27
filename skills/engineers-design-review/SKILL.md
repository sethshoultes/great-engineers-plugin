---
name: engineers-design-review
description: Dispatch one or more engineering personas to review existing code, architecture, or a draft spec. Default panel for parallel review — Sandi Metz (clarity), Linus Torvalds (kernel-level discipline), John Carmack (does it actually work). Override with --personas. Reads the project specification + the target file/directory + relevant adjacent code, produces a consolidated review with per-persona verdicts and a single highest-leverage recommendation. Output saves to engineering/reviews/<slug>.md.
---

# /engineers-design-review <path> [--personas <list>]

Review existing code, architecture, or a draft spec.

## What this does

Dispatches engineering personas to review the artifact at `<path>`. Default panel runs three personas in parallel (Sandi Metz, Torvalds, Carmack), each with a different lens. Output is a consolidated review — per-persona verdicts marked up, then a single recommended highest-leverage change.

## When to use

- A pull request needs review and you want the constellation's discipline applied.
- An architecture proposal (a spec or design doc) needs scrutiny before commitment.
- A module has grown unwieldy and you want a refactor read.
- A design is "working but feels wrong" and you need named diagnoses.

Not for: line-level style nits (most projects have linters); auto-generated documentation; QA / test design (cross-dispatch `great-minds:margaret-hamilton-qa` instead).

## Instructions for Claude

When this skill is invoked with a `<path>` argument and optional `--personas`:

1. **Resolve the project root** the same way `/engineers-project-init` does. Verify `CLAUDE.md` exists or warn that the engineering bible is missing.

2. **Read the project specification:**
   - `CLAUDE.md`, `README.md`, the manifest, `ARCHITECTURE.md`, `ADR/`
   - `.great-authors/project.md` if cross-craft project

3. **Read the target.** `<path>` may be:
   - A single file (a spec, a module, a draft RFC)
   - A directory (a module, a subsystem)
   - A glob (`src/auth/*.ts`)

   Read the target file(s) in full. Read adjacent context — sibling files, the imports, the tests if present, any inline TODOs or FIXMEs. The reviewer can't review what they can't see.

4. **Resolve the panel.** If `--personas` is given (comma-separated), use those. Otherwise default panel:

   - `sandi-metz-engineer` — design clarity, refactor leverage, OO design quality
   - `linus-torvalds-engineer` — kernel-level discipline, performance cost, what does this actually do
   - `john-carmack-engineer` — minimum working solution, where does the time go, ship-readiness

   Common alternative panels:

   - **Algorithm review:** `don-knuth-engineer` + `edsger-dijkstra-engineer` — correctness and complexity proof
   - **API / type-system review:** `anders-hejlsberg-engineer` + `sandi-metz-engineer` — composability and clarity
   - **Web platform review:** `brendan-eich-engineer` + `linus-torvalds-engineer` — backwards compat and performance
   - **Refactor review:** `sandi-metz-engineer` + `dhh-engineer` — clarity vs pragmatism debate
   - **Documentation / accessibility review:** `grace-hopper-engineer` + `sandi-metz-engineer` — who can read this in five years

5. **Dispatch the panel in parallel** via the Agent tool. Each persona gets:
   - The full target content (file or directory contents)
   - The bible context (CLAUDE.md, manifest, ADRs)
   - Specific instruction to produce a review in their voice with: **Verdict** (one sentence top-line), **Marked passages** (3-8 quoted excerpts with strikethroughs for cuts and `[→ replacement]` for substitutions), **Hand-off** (if a different persona would serve better).

6. **Consolidate the parallel returns.** The output is a single review file:

```markdown
---
title: Design review of <path>
slug: <slug>
panel: [<persona-1>, <persona-2>, <persona-3>]
created: YYYY-MM-DD
target: <path>
target_lines: <N>
---

# Design review: <path>

## Per-persona verdicts

### <persona-1>
**Verdict:** <one sentence top-line reaction>

**Marked passages:**
- <quoted excerpt 1>
- <quoted excerpt 2>
- ...

**Hand-off:** <if a different persona would serve better; or omit>

### <persona-2>
[same structure]

### <persona-3>
[same structure]

## Where they agree

<1-3 points where the panel converges. The strongest signal — when independent reviewers with different lenses flag the same thing, it's almost certainly real.>

## Where they disagree

<1-2 points where the panel diverges. Often the most useful section — disagreement reveals the genuine trade-off the implementer or author is making.>

## Highest-leverage change

<ONE recommendation. The single change that, if made, would make the work meaningfully better. Not a list. The orchestrator's job is to pick the highest-leverage move; this skill picks it for them.>

## Suggested next step

<One of: implement the change, escalate to author, request a v2 from the spec author, run /engineers-debate <topic> <persona-A> <persona-B> if the disagreement is structural.>
```

7. **Save the review** to `engineering/reviews/<slug>.md`. Slug derived from the target path or from `CLAUDE.md`'s `Current spec:` field.

8. **Report:**
   ```
   📝 Saved to engineering/reviews/<slug>.md (review of <path>, <word-count> words).

   Panel:           <persona-1>, <persona-2>, <persona-3>
   Convergence:     <one-line summary of the agreement>
   Highest-leverage change: <one-line summary>

   Next:
   - Address the highest-leverage change
   - Or run /engineers-debate <topic> <a> <b> if the disagreement is structural
   ```

## What the skill does NOT do

- Does not modify the target. It reviews; the implementer (human or AI) edits.
- Does not approve or reject. It surfaces the review's findings; the orchestrator decides.
- Does not run tests. (For QA verification, dispatch `great-minds:margaret-hamilton-qa`.)
- Does not auto-pick the panel based on opaque heuristics. The default panel is documented; alternatives are documented; the user can override explicitly.

## Notes

- Parallel dispatch means the personas don't see each other's reviews when forming their own. This is intentional — independent verdicts produce stronger signal at consolidation time. (The marketers persona writes used the same pattern.)
- For very large targets (>2000 lines), the dispatch brief should ask each persona to focus on the most-critical sections only — pick a sample, don't try to review the whole thing. Better to do three high-quality 500-line reviews than three shallow 2000-line ones.
- Review fatigue is real. Don't run `/engineers-design-review` on every PR; use it for non-trivial changes where the consolidated lens is worth the dispatch cost.
