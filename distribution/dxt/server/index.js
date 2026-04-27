#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PERSONAS_DIR = join(__dirname, "personas");

// Load all bundled persona files. Filenames carry an -engineer suffix
// which is stripped from the lookup key.
const PERSONAS = Object.fromEntries(
  readdirSync(PERSONAS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "").replace(/-engineer$/, "");
      const body = readFileSync(join(PERSONAS_DIR, f), "utf8");
      return [slug, body];
    })
);

const ENGINEER_BLURBS = {
  "john-carmack": "Game-engine programmer (id, Oculus, AGI). Read everything before changing anything; the binary is the argument.",
  "grace-hopper": "Compiler pioneer (Mark I, A-0, COBOL). Programs as machine-readable language for humans; teaching is part of engineering.",
  "don-knuth": "TAOCP, TeX, literate programming. Rigor; pay $2.56 for your errors.",
  "linus-torvalds": "Linux kernel, Git. We do not break userspace. Show me the code.",
  "dhh": "Rails, 37signals. Convention over configuration; the majestic monolith; sustainable pace.",
  "anders-hejlsberg": "Turbo Pascal, C#, TypeScript. Language design as thought experiment; backwards compatibility as a kept promise.",
  "brendan-eich": "JavaScript, Mozilla, Brave. Constraints are the design; don't break the web.",
  "edsger-dijkstra": "GOTO considered harmful, semaphores. Programs derived alongside their proofs.",
  "sandi-metz": "Practical Object-Oriented Design. The cost of ugly code is paid by future programmers.",
};

const ENGINEER_ALIASES = {
  "carmack": "john-carmack",
  "john": "john-carmack",
  "hopper": "grace-hopper",
  "grace": "grace-hopper",
  "knuth": "don-knuth",
  "don": "don-knuth",
  "torvalds": "linus-torvalds",
  "linus": "linus-torvalds",
  "david": "dhh",
  "david-heinemeier-hansson": "dhh",
  "hejlsberg": "anders-hejlsberg",
  "anders": "anders-hejlsberg",
  "eich": "brendan-eich",
  "brendan": "brendan-eich",
  "dijkstra": "edsger-dijkstra",
  "edsger": "edsger-dijkstra",
  "metz": "sandi-metz",
  "sandi": "sandi-metz",
};

function resolveEngineer(input) {
  if (!input) {
    throw new Error("Persona name is required.");
  }
  const normalized = input.toLowerCase().trim();
  // Margaret Hamilton lives in great-minds (cross-dispatchable for QA).
  if (normalized === "margaret" || normalized === "hamilton" || normalized === "margaret-hamilton") {
    throw new Error(
      `Margaret Hamilton lives in great-minds as the QA persona. Cross-dispatch via Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...}).`
    );
  }
  const slug = ENGINEER_ALIASES[normalized] || normalized;
  if (!PERSONAS[slug]) {
    const valid = Object.keys(ENGINEER_BLURBS).join(", ");
    throw new Error(
      `Unknown persona "${input}". Valid: ${valid} (short forms: carmack, hopper, knuth, linus, anders, brendan, edsger, sandi).`
    );
  }
  return { slug, body: PERSONAS[slug] };
}

const server = new Server(
  { name: "great-engineers", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// ---------- Tool listing ----------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_engineers",
      description:
        "List the nine engineering personas with one-line descriptions.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "engineers_channel",
      description:
        "Load a named engineering persona into the conversation for direct collaboration. Substantive output (specs, reviews, technical proposals) auto-saves to engineering/<artifact-type>/<slug>.md. Valid: john-carmack, grace-hopper, don-knuth, linus-torvalds, dhh, anders-hejlsberg, brendan-eich, edsger-dijkstra, sandi-metz (short forms accepted). For QA / test design, dispatch great-minds:margaret-hamilton-qa instead.",
      inputSchema: {
        type: "object",
        properties: {
          persona: {
            type: "string",
            description: "Persona slug or short form.",
          },
        },
        required: ["persona"],
      },
    },
    {
      name: "engineers_project_init",
      description:
        "Scaffold an engineering/ directory at the project root, sibling to manuscript/, film/, publishers/, marketing/. Subdirs: specs/, reviews/, runbooks/. Updates CLAUDE.md with an ## Engineering section. Reads the project specification (README, CLAUDE.md, manifest, ADRs) to import context.",
      inputSchema: {
        type: "object",
        properties: {
          target_dir: {
            type: "string",
            description: "Optional target directory. If omitted, uses the current working directory.",
          },
          slug: {
            type: "string",
            description: "Optional starting spec slug. Defaults to project-derived.",
          },
        },
      },
    },
    {
      name: "engineers_write_spec",
      description:
        "Produce a technical spec / design doc for a feature or system change. Default persona auto-selected by signal; override available. Saves to engineering/specs/<slug>.md. Format: Problem → Constraints → Proposal → Alternatives → Trade-offs → Decision → Open questions.",
      inputSchema: {
        type: "object",
        properties: {
          feature: {
            type: "string",
            description: "The feature or system change to spec. Required.",
          },
          persona: {
            type: "string",
            description: "Optional persona override. Default auto-selected by signal in the feature description: hejlsberg (language/API), carmack (performance), knuth (algorithm correctness), eich (web platform), dhh (pragmatic web app), sandi-metz (refactor), torvalds (kernel-level), grace-hopper (documentation/accessibility), dijkstra (formal correctness).",
          },
        },
        required: ["feature"],
      },
    },
    {
      name: "engineers_design_review",
      description:
        "Dispatch one or more engineering personas to review existing code, architecture, or a draft spec. Default panel for parallel review: Sandi Metz (clarity), Linus Torvalds (kernel-level discipline), John Carmack (does it actually work). Override with --personas. Output: consolidated review with per-persona verdicts and a single highest-leverage recommendation. Saves to engineering/reviews/<slug>.md.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Path to review — file, directory, or glob. Required.",
          },
          personas: {
            type: "array",
            items: { type: "string" },
            description: "Optional comma-separated persona slugs. Default: sandi-metz, linus-torvalds, john-carmack.",
          },
        },
        required: ["path"],
      },
    },
  ],
}));

// ---------- Tool calls ----------

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  if (name === "list_engineers") {
    const lines = Object.entries(ENGINEER_BLURBS).map(
      ([k, v]) => `- **${k}** — ${v}`
    );
    const text = `# Great Engineers Roster\n\n## Nine personas\n\n${lines.join("\n")}\n\nDispatch any of them via \`engineers_channel\` (Claude Desktop) or \`/engineers-channel <name>\` (Claude Code). Short forms accepted: carmack, hopper, knuth, linus, anders, brendan, edsger, sandi.\n\n## Cross-dispatchable from great-minds\n\n- **margaret-hamilton-qa** — Apollo guidance computer code; the original software-engineering-as-discipline. For QA / test design / pre-flight checks. Dispatch via \`Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})\`.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "engineers_channel") {
    const { slug, body } = resolveEngineer(args.persona);
    const text = `You are now channeling the following engineering persona. Read the persona body carefully, then adopt this voice for the rest of the conversation. The user will collaborate with you as this persona on engineering-stage work — systems design, code review, technical specs, language and API choices, refactor proposals.\n\n---PERSONA: ${slug}---\n${body}\n---END PERSONA---\n\nIf the user says "drop the persona," "exit persona," or "back to Claude," return to normal voice.\n\nWhen you produce a substantive artifact (technical spec, code review, design proposal, ADR, runbook), save it to disk before showing it to the user. Path conventions:\n\n| Artifact | Path |\n|---|---|\n| Technical spec / design doc | engineering/specs/<slug>.md |\n| ADR (architecture decision record) | engineering/specs/<slug>-adr.md |\n| Code review | engineering/reviews/<slug>.md |\n| Design review | engineering/reviews/<slug>-design.md |\n| Runbook | engineering/runbooks/<slug>.md |\n\nResolve <slug> from CLAUDE.md's ## Engineering section's Current spec field. If the user says "preview only" or "don't save this one" before you produce the artifact, skip the save for that one block.\n\nRead the project specification before producing substantive work: README.md, CLAUDE.md, the manifest (package.json, pyproject.toml, etc.), any ADR/ records, ARCHITECTURE.md if present. For cross-craft projects (writing or film with software components), also read .great-authors/project.md.\n\nFor QA / test design / pre-flight checks, dispatch margaret-hamilton-qa from great-minds via Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...}) — Margaret stays in great-minds and is cross-dispatchable.\n\nBegin as ${slug} now.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "engineers_project_init") {
    const target = args.target_dir || "<user's current working directory>";
    const slug = args.slug || "<project-derived spec slug>";
    const text = `You are scaffolding the engineering/ directory for a project. Target directory: ${target}.\n\n1. Use the current working directory unless the user specifies otherwise.\n2. Check whether engineering/ already exists. If it does, ask whether to overwrite the scaffold (default skip).\n3. Read existing project context: README.md, CLAUDE.md, the manifest (package.json, pyproject.toml, Cargo.toml, go.mod, etc.), ARCHITECTURE.md, ADR/ directory, .great-authors/project.md (if cross-craft project). Note language/framework signals for the next-steps recommendations.\n4. Ask one question: "What's the slug for the spec or feature you're starting with? Default: ${slug}." Accept any kebab-case identifier.\n5. Create engineering/ at the target with three subdirectories: specs/, reviews/, runbooks/.\n6. Update CLAUDE.md by appending an ## Engineering section (or creating CLAUDE.md if absent):\n\n   ## Engineering\n\n   **Path:** engineering/ (at project root)\n   **Current spec:** <slug>\n\n   Commands that generate engineering artifacts (engineers_channel save behavior, engineers_write_spec, engineers_design_review) write to engineering/<subdir>/<current-spec>.md by default.\n\n   The engineering personas read this file plus the project's README.md, the manifest, any ADR/ directory, and ARCHITECTURE.md if present. For cross-craft projects, they also read .great-authors/project.md.\n\n7. Report what was created, the detected project context, and suggest next steps:\n   - Best-fit personas based on the project signals (e.g., Hejlsberg for TypeScript, DHH for Rails, Carmack for game engines, Knuth for algorithm-heavy)\n   - engineers_write_spec to draft a technical spec\n   - engineers_design_review to review existing code\n   - For QA: Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "engineers_write_spec") {
    const feature = args.feature;
    const personaOverride = args.persona ? `\nUser-specified persona: ${args.persona}` : "";
    const text = `You are producing a technical spec for a feature or system change.\n\nFeature: ${feature}${personaOverride}\n\n1. Resolve the project root (current working directory unless otherwise stated). Verify CLAUDE.md or README.md exists and engineering/ is present. If engineering/ is missing, recommend running engineers_project_init first; do not auto-create.\n\n2. Read the project specification:\n   - CLAUDE.md\n   - README.md\n   - The manifest (package.json, pyproject.toml, etc.)\n   - ARCHITECTURE.md if present\n   - ADR/ directory if present\n   - .great-authors/project.md if cross-craft project\n   - The relevant existing code\n\n3. Resolve the persona to dispatch. If --persona was given, use it. Otherwise auto-select by signal in the feature description:\n   - "type system", "API design", "language feature", TypeScript → anders-hejlsberg\n   - "performance", "throughput", "memory", "latency", systems-level → john-carmack\n   - "algorithm", "complexity", "correctness", "proof", math → don-knuth\n   - "web platform", "browser API", "JavaScript", backwards compat → brendan-eich\n   - "Rails", "monolith", "convention", pragmatic web app → dhh\n   - "refactor", "OO design", "responsibility", clarity → sandi-metz\n   - "kernel", "OS", "syscall", "ABI", low-level → linus-torvalds\n   - "documentation", "legacy", "accessibility" → grace-hopper\n   - "invariant", "concurrent", "formal", correctness proof → edsger-dijkstra\n   - Otherwise → don-knuth (rigorous default)\n\n4. Dispatch the persona via the Agent tool (subagent_type great-engineers:<persona-slug>-engineer). Brief includes: feature description, paths to bible files read, paths to relevant code, prior ADRs, output target engineering/specs/<slug>.md, structure (Problem / Constraints / Proposal / Alternatives / Trade-offs / Decision / Open questions), length target 600-1200 words.\n\n5. Save to engineering/specs/<slug>.md. If the file exists, ask whether to overwrite, save as -v2, or skip.\n\n6. Report path, word count, persona, problem one-liner, decision one-liner, next steps (engineers_design_review on the spec; engineers_channel <other-persona> for refinement).\n\nDo NOT write code. The spec describes; the implementer builds. Do NOT invent constraints — every constraint must trace to manifest, ADRs, existing code, or stated requirements. Do NOT auto-decide between alternatives — present, name trade-offs, recommend.\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "engineers_design_review") {
    const path = args.path;
    const personas = Array.isArray(args.personas) && args.personas.length > 0
      ? args.personas.map((p) => resolveEngineer(p).slug)
      : ["sandi-metz", "linus-torvalds", "john-carmack"];
    const text = `You are dispatching a design-review panel against ${path}. Panel: ${personas.join(", ")}.\n\n1. Resolve the project root. Read the project specification (CLAUDE.md, README.md, manifest, ARCHITECTURE.md, ADR/, .great-authors/ if cross-craft).\n\n2. Read the target at ${path}. May be a single file, a directory, or a glob. Read in full — adjacent context, sibling files, imports, tests if present, inline TODOs.\n\n3. Dispatch the panel in parallel via the Agent tool. Each persona (subagent_type great-engineers:<persona>-engineer) gets:\n   - Full target content\n   - Bible context\n   - Instruction to produce: Verdict (one sentence top-line), Marked passages (3-8 quoted excerpts with strikethroughs / [→ replacement]), Hand-off (if a different persona would serve better).\n\n4. Consolidate the parallel returns into one review file at engineering/reviews/<slug>.md:\n   - Per-persona verdicts (each persona's Verdict + Marked passages + Hand-off)\n   - Where they agree (1-3 points; convergence = strongest signal)\n   - Where they disagree (1-2 points; reveals the genuine trade-off)\n   - Highest-leverage change (ONE recommendation, not a list)\n   - Suggested next step (implement / escalate / request v2 / engineers_debate if structural disagreement)\n\n5. Save to engineering/reviews/<slug>.md. Slug from CLAUDE.md's Current spec field, or derived from the target path.\n\n6. Report path, panel, convergence one-liner, highest-leverage change one-liner, next step.\n\nDo NOT modify the target. Reviews don't edit; the implementer (human or AI) edits. Do NOT auto-pick the panel based on hidden heuristics — the default panel is sandi-metz + linus-torvalds + john-carmack; alternatives documented in the SKILL.md; user can override explicitly.\n\nBegin.`;
    return { content: [{ type: "text", text }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// ---------- Boot ----------

const transport = new StdioServerTransport();
await server.connect(transport);
