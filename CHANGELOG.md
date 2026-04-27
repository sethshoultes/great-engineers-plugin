# Changelog

All notable changes to `great-engineers` are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/) with [SemVer](https://semver.org/) versioning.

## [0.1.0] — 2026-04-27 — MVP

The initial release. Sixth plugin in the Caseproof persona constellation. Sibling to `great-minds`, `great-authors`, `great-filmmakers`, `great-publishers`, `great-marketers`. Closes the constellation's biggest acknowledged gap: the craft of code itself.

### Added

**Nine engineering personas** — `agents/`

- `john-carmack-engineer` — id Software, Oculus, AGI; ship-fast first-principles working code
- `grace-hopper-engineer` — Mark I, A-0 compiler, COBOL; programs as machine-readable language for humans
- `don-knuth-engineer` — *The Art of Computer Programming*, TeX, literate programming; rigor and humility
- `linus-torvalds-engineer` — Linux kernel, Git; "we do not break userspace"
- `dhh-engineer` — Rails, 37signals; convention over configuration, the majestic monolith
- `anders-hejlsberg-engineer` — Turbo Pascal, C#, TypeScript; language design as thought experiment
- `brendan-eich-engineer` — JavaScript, Mozilla, Brave; constraints are the design, don't break the web
- `edsger-dijkstra-engineer` — semaphores, "GOTO considered harmful"; programs derived alongside their proofs
- `sandi-metz-engineer` — *Practical Object-Oriented Design*; the cost of ugly code is paid by future programmers

**Drafted via cross-plugin orchestration.** Each persona file was drafted by a great-authors writer whose register fits the subject:

| Subject | Drafter | Lens |
|---|---|---|
| Carmack | Hemingway | Iceberg theory: the binary is what shows; the chip docs and assembly are below the waterline |
| Hopper | Morrison | Lyric register; technical work as a moral act about who is allowed to use computers |
| Knuth | McPhee | Architecture; sixty years on a multi-volume work as a chosen life-organizing principle |
| Torvalds | Orwell | Plain style; the kernel mailing list as Orwell's *Politics and the English Language* applied to engineering |
| DHH | King | Voice-driven popular narrative; the big-bet sensibility of refusing to scale 37signals |
| Hejlsberg | Le Guin | Speculative fiction is thought experiment; language design is thought experiment |
| Eich | Wallace | Self-aware essay register; honest about the ten-day window without revisionism |
| Dijkstra | Didion | Cool observational authority; the EWD as a column form |
| Sandi Metz | Baldwin | Moral urgency; the cost of ugly code is paid by future programmers — that's a Baldwin sentence in a Ruby book |

Final pass: `great-authors:gottlieb-persona` did a threshold edit across the corpus. Cuts applied surgically (the `.great-authors/` artifact reference removed from 4 files where it leaked from the marketers brief; per-file duplications and biographical filler trimmed). All nine personas land in 73-104 lines.

**Margaret Hamilton stays in great-minds** as `margaret-hamilton-qa` and is cross-dispatchable. Her engineering biography (Apollo, software-engineering-as-discipline) is referenced in this plugin's README under "see also." One Margaret.

**Four operational skills** — `skills/`

- `/engineers-channel <persona>` — load a persona into the conversation; substantive output auto-saves to `engineering/<artifact-type>/<slug>.md`
- `/engineers-project-init` — scaffold `engineering/` at the project root (sibling to `manuscript/`, `film/`, `publishers/`, `marketing/`)
- `/engineers-write-spec <feature>` — produces a technical spec / design doc; persona-driven register
- `/engineers-design-review <path>` — dispatches persona(s) to review code or architecture; default panel Sandi Metz + Torvalds + Carmack

**Distribution**

- Claude Code plugin (this repo)
- Claude Desktop DXT bundle at `distribution/dxt/`

### Architecture decisions

- **One Margaret.** Margaret Hamilton stays in great-minds as the QA persona. great-engineers references her cross-dispatchably rather than duplicating. Same person, different lens depending on the project — same principle that kept Sara Blakely in great-minds rather than duplicating into great-marketers.
- **Bible reading is engineering-aware.** Engineers personas read README, CLAUDE.md, manifests, ADRs FIRST. They read `.great-authors/project.md` only when the engineering work is part of a cross-craft project (writing, film) that already has a bible. Software-only projects don't need a fiction bible.
- **Cross-plugin orchestration as build pattern.** Second production use of the pattern (after great-marketers v0.1). Eight great-authors writers drafted nine engineer personas in parallel; gottlieb edited; cuts applied. The constellation pattern is the build pattern.

### Deferred to v1.0

- `/engineers-write-runbook` — production operations doc
- `/engineers-debate <topic> <a> <b>` — 2-round craft debate (mirror `/authors-debate`)
- `/engineers-critique <path>` — fast 3-bullet verdict from N personas
- `/engineers-write-adr <decision>` — architecture decision record
- `/engineers-edit <file>` — multi-persona marked-up review

Total at v1.0: ~12 skills. Matches the trilogy's breadth.
