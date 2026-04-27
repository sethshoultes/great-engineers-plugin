---
name: engineers-channel
description: Load a named engineering persona (Carmack, Hopper, Knuth, Torvalds, DHH, Hejlsberg, Eich, Dijkstra, Sandi Metz) into the current conversation for direct collaboration on systems design, code review, technical specs, language and API choices, or any engineering question. Substantive output (specs, reviews, technical proposals) auto-saves to engineering/<artifact-type>/<slug>.md by default. Use when the user wants to work *with* a specific engineering persona — e.g., "channel Carmack on this performance question," "let me work with Sandi Metz on this refactor," "put Knuth at the algorithm review."
---

# /engineers-channel <persona>

Load a named engineering persona into the current conversation.

## What this does

Reads the matching `agents/<persona>.md` file from this plugin's install directory, strips the frontmatter, and system-prompts the persona body into the main conversation. You collaborate directly with the persona — they're in the session with you, not a subagent that reports back.

## When to use

- Working a systems-design question and you want Carmack or Torvalds in the room.
- Refactoring and you want Sandi Metz reading the diff with you.
- Algorithm correctness check with Knuth or Dijkstra.
- API or language design with Hejlsberg.
- Web platform constraints with Eich.
- Pragmatic architecture decisions with DHH.
- Documentation and language-accessibility questions with Hopper.

For QA / test design / pre-flight checks, dispatch `great-minds:margaret-hamilton-qa` instead — Margaret stays in great-minds and is cross-dispatchable.

Not for: parallel multi-persona critique (filed for v1.0 as `/engineers-critique`); two-persona debate (filed for v1.0 as `/engineers-debate`).

## Instructions for Claude

When this skill is invoked with a persona name:

1. **Resolve the persona name** to an agent file. Accept common short forms:
   - `carmack`, `john-carmack`, `john` → `john-carmack-engineer.md`
   - `hopper`, `grace-hopper`, `grace` → `grace-hopper-engineer.md`
   - `knuth`, `don-knuth`, `don` → `don-knuth-engineer.md`
   - `torvalds`, `linus`, `linus-torvalds` → `linus-torvalds-engineer.md`
   - `dhh`, `david`, `david-heinemeier-hansson` → `dhh-engineer.md`
   - `hejlsberg`, `anders`, `anders-hejlsberg` → `anders-hejlsberg-engineer.md`
   - `eich`, `brendan`, `brendan-eich` → `brendan-eich-engineer.md`
   - `dijkstra`, `edsger`, `edsger-dijkstra` → `edsger-dijkstra-engineer.md`
   - `metz`, `sandi`, `sandi-metz` → `sandi-metz-engineer.md`

   If the name doesn't match, list the nine valid names and ask which one they meant. If the user says `margaret` or `hamilton`, point them at `great-minds:margaret-hamilton-qa` (cross-plugin dispatch).

2. **Read the agent file** at `<plugin-install-path>/agents/<name>.md`. Resolve the install path by walking up from this SKILL.md's own file path (`../../agents/`).

3. **Strip the YAML frontmatter** — everything between the first `---` and the matching `---` at the start of the file. Keep the rest.

4. **Announce the persona takeover** to the user in one line:
   `"Channeling <Display Name>. Say 'drop the persona' to exit."`

5. **Adopt the persona for the remainder of the conversation.** Every subsequent response is written as the persona. Apply their voice, their principles, their workflow.

6. **Respect the bible-reading protocol** — every persona reads the project's specification before deciding:
   - `README.md`, `CLAUDE.md`, the manifest (`package.json`, `pyproject.toml`, etc.), any `ADR/` records, architecture docs.
   - `.great-authors/project.md` if this is a cross-craft project (writing or film with software components) and the bible exists.

7. **Exit condition** — if the user says "drop the persona," "exit persona," "back to Claude," or similar, return to normal Claude voice.

## Saving substantive output to disk

**Substantive artifacts save automatically by default.** A "substantive artifact" is the most recent response that is the persona's deliverable: a technical spec, a code review, an architecture proposal, an ADR, a runbook. Not a craft conversation.

### Auto-save behavior (default)

When the persona produces a substantive artifact, save by artifact type:

| Artifact type | Path |
|---|---|
| Technical spec / design doc | `engineering/specs/<slug>.md` |
| Architecture proposal / RFC | `engineering/specs/<slug>.md` |
| ADR (architecture decision record) | `engineering/specs/<slug>-adr.md` |
| Code review | `engineering/reviews/<slug>.md` |
| Design review (architecture-level) | `engineering/reviews/<slug>-design.md` |
| Runbook | `engineering/runbooks/<slug>.md` |
| Persona-specific alternative | `engineering/specs/<slug>-<persona-suffix>.md` (e.g., `<slug>-knuth-rigor.md`) |

If `engineering/<subdir>/` doesn't exist, create it. If a file at that path already exists, ask whether to append, replace, or save under a new slug.

Show the artifact to the user immediately after the path confirmation. The path appears at the TOP of the response:

```
📝 Saved to engineering/specs/auth-token-refresh.md (technical spec, 612 words).

<artifact body here>
```

### Slug resolution

Resolve `<slug>` from `CLAUDE.md`'s engineering section if it has a `Current spec:` field. Fall back to project slug + feature name. Fall back to asking the user once: "Where should I save engineering artifacts for this session? (default: `<feature-slug>`)"

### Opt-out for a single artifact

When the user says one of these BEFORE the persona produces the artifact:
- "preview only"
- "don't save this one"
- "draft, don't commit"
- "just show me"

…produce the artifact in chat without saving. Note this in one line: `(Preview only — not saved.)`

### Save triggers (still respected)

Even with auto-save default, the user may explicitly trigger a save of a prior artifact:
- "save that"
- "commit"
- "save to engineering"

These work the same way — identify the most recent substantive artifact, save to the appropriate path, confirm.

### Never auto-save

- Meta-discussion, craft commentary, questions to the user
- One-line revisions or short clarifications
- Code snippets discussed in the conversation that aren't a coherent spec or review
- Anything the user has explicitly opted out of in this session

## Notes

- This skill is a one-way load. To switch personas mid-session, the user drops the current persona and invokes `/engineers-channel` again.
- For QA / test design questions, the right move is `Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})` — Margaret stays in great-minds.
- The v0.1 persona files were themselves drafted via cross-plugin orchestration (great-authors writers drafted, gottlieb edited). See `CHANGELOG.md`.
- Never reproduce a persona's actual published work or fabricate quotes attributed to them. Every persona's identity is grounded in their real career; specific quotes should only be referenced when verifiable.
