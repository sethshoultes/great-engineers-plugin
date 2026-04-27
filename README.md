# Great Engineers

Nine engineering personas (John Carmack, Grace Hopper, Don Knuth, Linus Torvalds, DHH, Anders Hejlsberg, Brendan Eich, Edsger Dijkstra, Sandi Metz) and four operational skills for technical specs, design reviews, and project initialization. A Claude Code plugin. Sixth in the Caseproof persona constellation:

- [`great-minds-plugin`](https://github.com/sethshoultes/great-minds-plugin) — strategic decision-makers
- [`great-authors-plugin`](https://github.com/sethshoultes/great-authors-plugin) — prose craft
- [`great-filmmakers-plugin`](https://github.com/sethshoultes/great-filmmakers-plugin) — film craft
- [`great-publishers-plugin`](https://github.com/sethshoultes/great-publishers-plugin) — publication form
- [`great-marketers-plugin`](https://github.com/sethshoultes/great-marketers-plugin) — marketing
- **`great-engineers-plugin`** (this repo) — software-engineering craft

> **New to the Caseproof persona constellation?** Start with [`/constellation-start`](https://github.com/sethshoultes/great-minds-plugin) in `great-minds` — it asks 2-3 questions about your project shape and routes to the right plugin.

## Install

**Claude Code:**
```
/plugin marketplace add sethshoultes/great-engineers-plugin
/plugin install great-engineers@sethshoultes
```

**Claude Desktop** (DXT bundle):
```bash
cd distribution/dxt && npm install && npx @anthropic-ai/dxt pack
```

## What's in v0.1

### 9 Personas — at the engineering threshold

| Persona | Strength |
|---|---|
| `john-carmack-engineer` | Game-engine programmer (id Software, Oculus, AGI). Read everything before changing anything; the binary is the argument. |
| `grace-hopper-engineer` | Compiler pioneer (Mark I, A-0, COBOL). Programs as machine-readable language for humans; teaching is part of engineering. |
| `don-knuth-engineer` | The author of *The Art of Computer Programming*. Rigor; literate programming; pay $2.56 for your errors. |
| `linus-torvalds-engineer` | Linux kernel and Git. We do not break userspace. Talk is cheap, show me the code. |
| `dhh-engineer` | Rails creator, 37signals. Convention over configuration; the majestic monolith; sustainable pace. |
| `anders-hejlsberg-engineer` | Turbo Pascal, C#, TypeScript. Language design as thought experiment; backwards compatibility as a kept promise. |
| `brendan-eich-engineer` | JavaScript creator; Mozilla; Brave. The constraints are the design; don't break the web. |
| `edsger-dijkstra-engineer` | Structured programming, semaphores, "GOTO considered harmful". Programs derived alongside their proofs. |
| `sandi-metz-engineer` | *Practical Object-Oriented Design*. The cost of ugly code is paid by future programmers. Refactor for clarity. |

### How the personas were drafted

The v0.1 persona files were drafted via cross-plugin orchestration — each engineer written by a great-authors persona whose register fits the subject (Hemingway on Carmack, Morrison on Hopper, McPhee on Knuth, Orwell on Torvalds, King on DHH, Le Guin on Hejlsberg, Wallace on Eich, Didion on Dijkstra, Baldwin on Sandi Metz). Then `great-authors:gottlieb-persona` did a threshold pass and named cuts. The constellation pattern as build pattern, second production use after great-marketers v0.1.

### See also: `great-minds:margaret-hamilton-qa`

Margaret Hamilton — Apollo guidance computer code, the original software-engineer-as-discipline — lives in [`great-minds`](https://github.com/sethshoultes/great-minds-plugin) as the QA persona. She's cross-dispatchable for any engineering project that needs error-recovery design, pre-flight checks, or test-suite review:

```
Agent({
  subagent_type: "great-minds:margaret-hamilton-qa",
  prompt: "<self-contained QA brief>"
})
```

We didn't duplicate her here. One Margaret.

### 4 MVP Skills

| Skill | What it does |
|---|---|
| `/engineers-channel <persona>` | Load an engineering persona into your current conversation. Substantive output (specs, reviews, technical proposals) auto-saves to `engineering/<artifact-type>/<slug>.md`. Mirrors `/authors-channel`. |
| `/engineers-project-init` | Scaffold an `engineering/` directory at the project root, sibling to `manuscript/`, `film/`, `publishers/`, `marketing/`. Subdirs: `specs/`, `reviews/`, `runbooks/`. |
| `/engineers-write-spec <feature>` | Produces a technical spec / design doc, persona-driven register. Default Hejlsberg for language/API; Knuth for academic rigor; DHH for pragmatic; override available. Output: `engineering/specs/<slug>.md`. |
| `/engineers-design-review <path>` | Dispatches persona(s) to review code or architecture. Default panel for parallel review: Sandi Metz (clarity), Torvalds (kernel-level discipline), Carmack (performance). Override available. Output: `engineering/reviews/<slug>.md`. |

## Why this plugin

The constellation as it stood produced creative artifacts and their publication form, plus marketing and strategy — but not the **craft of code itself**. Caseproof is a software shop. The single biggest gap in the constellation was a plugin for the actual practice of engineering: design, code review, technical specs, language and API choices, the trade-offs that working programmers make every day.

great-engineers fills that gap. The roster covers a wide range of engineering registers — Carmack's ship-fast first-principles, Hopper's accessibility-as-discipline, Knuth's mathematical rigor, Torvalds's kernel pragmatism, DHH's productivity-pragmatism, Hejlsberg's language-design discipline, Eich's platform-effect thinking, Dijkstra's formal correctness, Sandi Metz's teaching-craft. No one persona covers every kind of engineering question; the right dispatch depends on the shape of the question.

## Conventions inherited from the constellation

- **Orchestrator vs. specialist.** Personas are dispatched as sub-agents in clean contexts. The orchestrator never produces the artifact in-context.
- **Default-save.** Every generative skill saves output to disk before showing it in chat. Save to `engineering/<subdir>/<slug>.md`. Document the path in the response.
- **Bible reading.** Every persona reads the project's specification before deciding — `README.md`, `CLAUDE.md`, the manifest (`package.json`, `pyproject.toml`, etc.), any `ADR/` records, architecture docs. For cross-craft projects (writing or film with software components), the persona also reads `.great-authors/project.md` if it exists.
- **Cross-plugin orchestration.** When an engineering question reaches into another craft (positioning the launch, drafting the launch copy, designing the cover for the docs site), the orchestrator dispatches the right plugin's persona. The constellation composes; this plugin doesn't replicate.

## Project structure

```
.great-authors/                 # the bible — shared with great-authors (when present)
manuscript/                     # great-authors writes here (when present)
film/                           # great-filmmakers writes here (when present)
publishers/                     # great-publishers writes here (when present)
marketing/                      # great-marketers writes here (when present)
engineering/                    # great-engineers writes here (this plugin)
├── specs/                      #   technical specs, design docs, RFCs
├── reviews/                    #   code reviews, design reviews, audits
└── runbooks/                   #   production runbooks (v1.0)
```

For software-only projects (no creative artifacts), only `engineering/` and the project's own conventions (README, CLAUDE.md, package.json, etc.) are required.

## Roadmap

- **v0.1** (this release) — nine personas, four MVP skills, DXT bundle.
- **v1.0** — Add `/engineers-write-runbook` (production operations doc), `/engineers-debate <topic> <a> <b>` (two-round craft debate; mirror `/authors-debate`), `/engineers-critique <path>` (fast 3-bullet verdict from N personas), `/engineers-write-adr <decision>` (architecture decision record), `/engineers-edit <file>` (multi-persona marked-up review). ~12 skills total. Matches the breadth of the trilogy.

## License

MIT. See [LICENSE](./LICENSE).
