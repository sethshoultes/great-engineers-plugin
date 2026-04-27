# Great Engineers — User Manual

Complete reference for the `great-engineers` Claude Code plugin. For the executive summary, see [README.md](./README.md). For orchestration patterns, see [ORCHESTRATING.md](./ORCHESTRATING.md).

## 1. Install

```
/plugin marketplace add sethshoultes/great-engineers-plugin
/plugin install great-engineers@sethshoultes
```

For Claude Desktop, build the DXT bundle:
```bash
cd distribution/dxt && npm install && npx @anthropic-ai/dxt pack
```

## 2. The nine personas

Personas are dispatched as sub-agents in clean contexts. Each persona file at `agents/<slug>.md` carries its own identity, voice, principles, before-decision protocol (read the project specification), and what it never does.

### Systems and performance

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `john-carmack-engineer` | id Software (Doom, Quake), Oculus, Keen Technologies | Performance work; ship-fast first-principles engineering; "what's the minimum working solution and how do we get there fastest" |
| `linus-torvalds-engineer` | Linux kernel, Git | Kernel-level architecture, code review with no patience for unnecessary abstraction; "we do not break userspace" |

### Languages and APIs

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `anders-hejlsberg-engineer` | Turbo Pascal, C#, TypeScript | Language design, API design, type-system questions; "will this compose, and will it last" |
| `brendan-eich-engineer` | JavaScript creator, Mozilla, Brave | Web platform, browser standards, backwards-compatibility math; "constraints are the design" |

### Rigor and correctness

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `don-knuth-engineer` | *The Art of Computer Programming*, TeX | Algorithm correctness, complexity analysis, literate programming; "where is the proof" |
| `edsger-dijkstra-engineer` | Semaphores, structured programming, "GOTO considered harmful" | Formal correctness, invariants; "a program without a proof is a conjecture in executable notation" |

### Design and craft

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `sandi-metz-engineer` | *Practical Object-Oriented Design* | Refactoring for clarity, OO design, the Single Responsibility Principle; "the cost of ugly code is paid by future programmers" |
| `dhh-engineer` | Rails, 37signals | Pragmatism, opinionated software, the majestic monolith; "convention over configuration" |

### Accessibility and teaching

| Persona | Real-world identity | Dispatch when |
|---|---|---|
| `grace-hopper-engineer` | Mark I, A-0 compiler, COBOL | Documentation, language accessibility, legacy code archaeology; "who can read it, maintain it, carry it forward" |

### Cross-dispatchable from `great-minds`

| Persona | Where | Dispatch when |
|---|---|---|
| `margaret-hamilton-qa` | `great-minds` | QA, test design, error recovery, pre-flight checks. Apollo guidance computer code; the original software-engineering-as-discipline. Use `Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})`. |

## 3. The four MVP skills

### `/engineers-channel <persona>`

Loads an engineering persona into the current conversation for direct collaboration. Substantive output (specs, reviews, technical proposals) auto-saves.

```
/engineers-channel hejlsberg
/engineers-channel sandi-metz
```

Output paths by artifact type:

| Artifact type | Path |
|---|---|
| Technical spec / design doc | `engineering/specs/<slug>.md` |
| Code review / design review | `engineering/reviews/<slug>.md` |
| ADR (architecture decision record) | `engineering/specs/<slug>-adr.md` |
| Runbook (production ops) | `engineering/runbooks/<slug>.md` |

Save triggers (explicit) and opt-out flags work the same as `/authors-channel`. See `skills/engineers-channel/SKILL.md`.

### `/engineers-project-init`

Scaffolds an `engineering/` directory at the project root. Reads the project's specification (`README.md`, `CLAUDE.md`, manifest) to import context. Creates the subdirs `specs/`, `reviews/`, `runbooks/`. Updates `CLAUDE.md` (or creates one if absent) to note the engineering directory's existence and the `Current spec:` field.

### `/engineers-write-spec <feature> [--persona <name>]`

Produces a technical spec / design doc. Default persona by signal:

| Signal | Default persona |
|---|---|
| Language or type-system question | `anders-hejlsberg-engineer` |
| Performance-critical or systems-level | `john-carmack-engineer` |
| Algorithm with complexity claims | `don-knuth-engineer` |
| Web platform / browser API | `brendan-eich-engineer` |
| Pragmatic web app feature | `dhh-engineer` |
| OO refactor / design quality | `sandi-metz-engineer` |
| Otherwise | `don-knuth-engineer` (the rigorous default) |

Output: `engineering/specs/<slug>.md`. Format: problem → constraints → proposal → alternatives → trade-offs → decision → open questions.

### `/engineers-design-review <path> [--personas <list>]`

Dispatches persona(s) to review code or architecture.

Default panel (parallel review):
- `sandi-metz-engineer` — design clarity, refactor leverage
- `linus-torvalds-engineer` — kernel-level discipline, performance cost
- `john-carmack-engineer` — does it actually work, where does the time go

Override with `--personas torvalds,knuth` (etc.). Output: `engineering/reviews/<slug>.md`. Format: per-persona verdict + marked passages, then consolidated highest-leverage change.

## 4. Project structure

```
.great-authors/                 # the bible (when project is cross-craft)
README.md                       # the spec for software-only projects
CLAUDE.md                       # orchestrator-mode notes
ADR/                            # architecture decision records
ARCHITECTURE.md                 # system structure
src/                            # the code
engineering/                    # great-engineers writes here (this plugin)
├── specs/                      #   technical specs, design docs, RFCs
├── reviews/                    #   code reviews, design reviews
└── runbooks/                   #   production runbooks (v1.0)
```

For software-only projects, `.great-authors/` is optional. For cross-craft projects, it's the shared spine across all six plugins.

## 5. Conventions

These are encoded across the constellation. Engineers inherits all of them.

1. **Orchestrator vs. specialist.** Personas are dispatched. The orchestrator never produces the artifact in-context.
2. **Default-save behavior.** Every generative skill saves to disk before showing in chat.
3. **Bible reading.** Every persona reads the project specification before deciding (README, CLAUDE.md, manifest, ADRs; `.great-authors/` for cross-craft).
4. **Honest claim discipline.** No specs that promise what the implementation cannot deliver. No reviews that soften the verdict to be liked.
5. **Cross-plugin dispatch.** When a question reaches into another craft, dispatch the right plugin's persona. The constellation composes.
6. **No code-writing.** This plugin produces specs, reviews, proposals — not running code. (For agency-style autonomous code execution, use `/agency-execute` in `great-minds`.)

## 6. Cross-plugin orchestration

The engineers plugin sits within the full constellation:

| Plugin | Role |
|---|---|
| `great-minds` | Strategy, board reviews, agency swarm pattern (and `margaret-hamilton-qa` for QA work cross-dispatched) |
| `great-authors` | Prose, manuscript editing |
| `great-filmmakers` | Storyboards, shot lists, render manifests |
| `great-publishers` | Publication form (book covers, jacket copy, magazine register) |
| `great-marketers` | Marketing — positioning, ad copy, demand generation |
| `great-engineers` | Software-engineering craft (this plugin) |

Dispatch syntax: `Agent({subagent_type: "<plugin>:<persona>-persona", ...})`.

The v0.1 personas of this plugin were drafted via cross-plugin orchestration — each engineer drafted by a great-authors writer whose register fits the subject. The constellation pattern is the build pattern.

## 7. What's deferred to v1.0

- `/engineers-write-runbook <service>` — production operations doc
- `/engineers-write-adr <decision>` — architecture decision record (currently a `--persona` option on `engineers-write-spec`; will get its own skill at v1.0)
- `/engineers-debate <topic> <persona-A> <persona-B>` — 2-round craft debate (mirror `/authors-debate`)
- `/engineers-critique <path>` — fast 3-bullet verdict from N personas in parallel
- `/engineers-edit <file>` — multi-persona marked-up review

## 8. Smoke tests

Run before tagging a release:

```bash
bash tests/smoke.sh
```

Validates: SKILL.md frontmatter, persona frontmatter, persona-count alignment between `agents/` and `distribution/dxt/server/personas/`, version coherence across `package.json` / `plugin.json` / DXT manifest, DXT tool definitions matched by handlers.

## 9. The constellation context

| Plugin | Domain | Status |
|---|---|---|
| [great-minds](https://github.com/sethshoultes/great-minds-plugin) | Strategy + constellation entry point | v1.4 |
| [great-authors](https://github.com/sethshoultes/great-authors-plugin) | Prose | v1.6 |
| [great-filmmakers](https://github.com/sethshoultes/great-filmmakers-plugin) | Film | v1.10 |
| [great-publishers](https://github.com/sethshoultes/great-publishers-plugin) | Publication form | v0.1 |
| [great-marketers](https://github.com/sethshoultes/great-marketers-plugin) | Marketing | v0.1 |
| **great-engineers** (this) | Software-engineering craft | **v0.1** |
| great-designers | Product, UX | Future |
| great-operators | Finance, ops | Future |

The constellation roadmap lives in the brain vault at `projects/caseproof-ai-company-constellation.md`. Each plugin owns one craft. Cross-plugin dispatch composes them.
