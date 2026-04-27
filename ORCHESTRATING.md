# Orchestrating great-engineers

Notes for AI agents (or humans) running an engineering project that uses this plugin's skills as sub-agents.

## The core distinction

The engineer personas in this plugin are *specialists at the engineering threshold.* They bring craft for systems design, code review, language and API choices, technical specs, the trade-offs that working programmers make every day.

The orchestrator (you, when you are running a project) is *not a specialist.* The orchestrator coordinates: reads the codebase, the manifest, the docs, briefs the right engineering persona for the question at hand, integrates the output, ships.

**The single most consequential mistake an orchestrator can make is to write the spec / review / technical proposal yourself.** Carmack doesn't think the way Knuth thinks doesn't think the way Sandi Metz thinks. Generic engineering prose is generic. The fix is always to dispatch the right persona.

If you find yourself reaching for the Write tool to put a spec in `engineering/specs/`, stop. Have you dispatched the right persona for this? If not, that's the next move.

## Who handles what

| Question | Persona to dispatch |
|---|---|
| What does this need to do, and what's the minimum working solution? | `john-carmack-engineer` |
| Who can read this code in five years? Is it documented? | `grace-hopper-engineer` |
| Is this algorithm correct? What's the complexity proof? | `don-knuth-engineer` |
| Will this break userspace? What does the kernel actually do? | `linus-torvalds-engineer` |
| Is this the simplest solution? Are we adding complexity for status? | `dhh-engineer` |
| Is this language/API/type design composable and stable? | `anders-hejlsberg-engineer` |
| Will this run in every browser? What's the platform-effect cost? | `brendan-eich-engineer` |
| Where's the proof of correctness? What invariant does this violate? | `edsger-dijkstra-engineer` |
| Is this code refactorable? What will future programmers thank us for? | `sandi-metz-engineer` |
| Are the tests catching the right things? What pre-flight checks are missing? | `great-minds:margaret-hamilton-qa` (cross-plugin) |

When two personas would honestly answer differently, that's a debate (filed for v1.0 as `/engineers-debate`).

## A typical orchestration flow

For a feature design:

```
1. Read the project — README, CLAUDE.md, manifest, ADRs, the relevant existing code
2. Read the project bible at .great-authors/ if this is a cross-craft project
3. /engineers-project-init   (if engineering/ doesn't already exist)
4. /engineers-write-spec <feature> [--persona <name>]
   → produces engineering/specs/<slug>.md
5. /engineers-design-review engineering/specs/<slug>.md
   → produces engineering/reviews/<slug>.md (default panel: Metz + Torvalds + Carmack)
6. Iterate on the spec based on review
7. Commit incrementally
```

For a code review of an existing PR or directory:

```
1. /engineers-design-review src/auth/  --personas torvalds,metz
   → reviews/auth-2026-04-27.md
2. Read the review; address findings
3. Re-review if substantial changes
```

For a language / API design question:

```
1. Read the existing language or API surface
2. /engineers-channel hejlsberg
3. Discuss the design directly; substantive proposals save to engineering/specs/
4. Optionally /engineers-channel knuth for a rigor check
```

## Brief-writing as leverage

The single best investment you can make as an orchestrator is writing better briefs.

**A thin brief:**
> "Review this code."

**A self-contained brief:**
> "Review the authentication module at `src/auth/` for clarity, correctness, and refactor leverage. Read these files in order: `src/auth/index.ts` (entry), `src/auth/session.ts` (the load-bearing module), `src/auth/__tests__/`, `ARCHITECTURE.md`'s authentication section, the `package.json` for runtime versions. The module was authored two years ago by a developer who has left; recent maintenance has added three new auth providers without refactoring. Specific concerns: (1) the `Session` type has grown to 14 fields and is being passed through every layer; (2) error handling in the OAuth callback path returns `null` in three places that should raise. What to focus on: structural design, not line-level style. What to leave alone: test naming conventions, indentation. Save to `engineering/reviews/auth-module-2026-04-27.md`. Report under 300 words on the highest-leverage refactor."

The thin brief produces generic review. The self-contained brief produces a review that can be acted on.

## When to write code yourself

Two narrow cases:

1. **Mechanical edits.** Surgical fixes — a typo, a renamed variable, a one-line null check, an import update. Surgical, not creative.
2. **The user explicitly asks you to.** *"Just write me the function here."* Honor that.

In all other cases: dispatch.

## The bible is the spine

For software-only projects, the "bible" is the project's own specification:

- `README.md` — what the project does, who uses it, how to run it
- `CLAUDE.md` — orchestrator-mode notes for AI agents working in the project
- The manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.) — declared dependencies and runtime versions
- `ADR/` (architecture decision records) — the project's history of decided architecture choices
- `ARCHITECTURE.md` — the system's structure and load-bearing assumptions

For cross-craft projects (a writing project that produces software, a film project that produces a custom render pipeline), `.great-authors/project.md` is also part of the bible. Engineers personas read both.

When the bible is missing, the FIRST move on any new engineering project is to scaffold one — at minimum a CLAUDE.md and an ADR-0001-bootstrap.md. The bible is the constellation's coordination layer.

## Cross-plugin orchestration

The engineers plugin compose with the rest of the constellation:

- `great-minds:margaret-hamilton-qa` — QA, test design, error recovery, pre-flight checks. Cross-dispatchable.
- `great-minds:steve-jobs-visionary` — product / vision questions when "should we build this" matters more than "how do we build it"
- `great-minds:elon-musk-persona` — first-principles when the conventional answer is wrong
- `great-authors:hemingway-persona` — when a tech blog post needs muscle (Carmack's voice in DHH-style writing register)
- `great-marketers:rory-sutherland-behavioral` — when the product question is behavioral (why aren't users adopting this)
- `great-publishers:bob-silvers-editor` — when the engineering doc is a long-form essay aimed at the literary engineering audience

The dispatch syntax: `Agent({subagent_type: "<plugin>:<persona>-persona", ...})`. The orchestrator routes; the personas speak.

## What this plugin does NOT do

- **Run code.** This plugin produces specs, reviews, technical proposals. The actual building is the user's. (For agency-style autonomous code execution, use `/agency-execute` in `great-minds`.)
- **Replace QA.** Margaret Hamilton handles that, in great-minds. Cross-dispatch when needed.
- **Write product copy.** That's `great-marketers`. When the spec needs a user-facing description, dispatch back.
- **Design the cover for the docs site.** That's `great-publishers:chip-kidd-designer`. When the engineering work needs a visual identity, dispatch.

When a question reaches into a different craft, surface it explicitly: *"This is a marketing question — let me dispatch Sutherland in great-marketers."* Don't paper over the gap.

## Anti-patterns

These all produce generic engineering artifacts:

- Writing the spec / review yourself instead of dispatching
- Pattern-matching a persona's voice in your own context (Carmack's compression, Knuth's rigor, Torvalds's bluntness) without dispatching the actual persona
- Skipping the read of the bible / codebase before dispatching
- Thin briefs ("write a spec")
- Letting the persona choice get made silently — surface why you picked Hejlsberg over Knuth, or Carmack over DHH
- Writing code (beyond the two narrow cases above)

The anti-pattern that catches most orchestrators is the first one. Watch for it.
