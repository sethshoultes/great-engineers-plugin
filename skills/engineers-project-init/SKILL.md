---
name: engineers-project-init
description: Scaffold an engineering/ directory at the project root, sibling to manuscript/, film/, publishers/, marketing/. Adds an Engineering section to CLAUDE.md (or creates one if absent) so engineering-stage commands know where to write. Use when starting the engineering work for a project — software-only or cross-craft.
---

# /engineers-project-init

Scaffold the `engineering/` directory and register it in the project's `CLAUDE.md`.

## What this does

Creates an `engineering/` folder at the current working directory's project root with three subdirectories:

```
engineering/
├── specs/         # Technical specs, design docs, RFCs, ADRs
├── reviews/       # Code reviews, design reviews, audits
└── runbooks/      # Production runbooks (filed for v1.0; directory created now for forward-compat)
```

Then adds (or creates) a `## Engineering` section in `CLAUDE.md`:

```markdown
## Engineering

**Path:** `engineering/` (at project root)
**Current spec:** `<user-chosen-slug>` (the spec or feature you're actively working on)

Commands that generate engineering artifacts (`/engineers-channel` save behavior, `/engineers-write-spec`, `/engineers-design-review`) write to `engineering/<subdir>/<current-spec>.md` by default. Update `Current spec` when moving to a different feature or system.

The engineering personas read this file plus the project's `README.md`, the manifest (`package.json`, `pyproject.toml`, etc.), any `ADR/` directory, and `ARCHITECTURE.md` if present, before deciding. For cross-craft projects (writing or film with software components), they also read `.great-authors/project.md`.
```

## When to use

- Starting engineering work on a software project (or the engineering side of a cross-craft project).
- Extending an existing project (great-authors / great-filmmakers / great-publishers / great-marketers) with engineering-stage work — for example, building a custom render pipeline for a film project, or building a SaaS tool that complements a book.
- Before invoking `/engineers-channel` with save triggers (which need to know where to write).

## Instructions for Claude

When this skill is invoked:

1. **Resolve the project root.** Use the current working directory unless the user specifies otherwise.

2. **Check for existing `engineering/` directory.** If it exists, ask: "An `engineering/` directory already exists. Overwrite the scaffold (destroys existing content) or skip (leaves it alone)? (overwrite/skip)" — default skip.

3. **Read existing project context.** Look for these files and read them if present:
   - `README.md`
   - `CLAUDE.md`
   - The manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.)
   - `ARCHITECTURE.md`
   - `ADR/` directory (architecture decision records)
   - `.great-authors/project.md` (if cross-craft project)

   This context informs which engineering personas the user should know about (e.g., if it's a TypeScript codebase, mention Hejlsberg by name in the next-steps; if it's a Rails monolith, mention DHH).

4. **Ask the spec-slug question.** One question:
   - "What's the slug for the spec or feature you're starting with? Default: based on what's in the project. Accept any kebab-case identifier (e.g., `auth-token-refresh`, `payments-rebuild`, `migration-2026-q2`)."

5. **Create the directory tree.** Three empty subdirectories under `engineering/`:
   - `specs/`
   - `reviews/`
   - `runbooks/`

6. **Update `CLAUDE.md`.** Read the existing file. If it doesn't exist, create one with a minimal header plus the `## Engineering` section. If it exists and has an `## Engineering` section, ask whether to overwrite. If it exists without one, append the `## Engineering` block documented above.

7. **Report:**
   ```
   Created engineering/ with subdirs:
     specs/  reviews/  runbooks/

   Updated CLAUDE.md with ## Engineering section.
   Current spec: <slug>

   Detected project context:
   - <Language/framework summary based on manifest>
   - <Key files present: ARCHITECTURE.md, ADR/, etc.>

   Next:
   - /engineers-channel <persona> for direct collaboration. The personas best-fit to this codebase are <list 2-3 based on project signals>.
   - /engineers-write-spec <feature> to draft a technical spec.
   - /engineers-design-review <path> to review existing code or architecture.

   For QA / test design / pre-flight checks, dispatch margaret-hamilton-qa from great-minds:
     Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})
   ```

## Notes

- This skill does not commit to git. The user owns their repository.
- The `engineering/` directory is for ARTIFACTS at the engineering stage. The actual code lives in `src/` (or wherever the project conventions place it). Engineering artifacts describe, review, and decide; they don't replace the code.
- For software-only projects, no `.great-authors/` is needed. For cross-craft projects, `.great-authors/` is the bible spine and engineers personas read it alongside the engineering context.
- The `current-spec` slug names "what we're working on right now." Update it when you move to a different feature or system within the same project.
