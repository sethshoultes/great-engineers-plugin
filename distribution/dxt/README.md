# Great Engineers — DXT Bundle

Claude Desktop extension for `great-engineers`. Same nine personas and four MVP tools as the Claude Code plugin, packaged as a Desktop Extension (DXT) for double-click install.

## Build the bundle

```bash
cd distribution/dxt
npm install
npx @anthropic-ai/dxt pack
```

The pack command produces `great-engineers.dxt` in this directory. Share that file with collaborators — they double-click it to install.

## Tools exposed

The MCP server in `server/index.js` exposes five tools:

| Tool | Maps to |
|---|---|
| `list_engineers` | Browse the nine personas with one-line blurbs |
| `engineers_channel` | The Claude Code skill `/engineers-channel <persona>` |
| `engineers_project_init` | The Claude Code skill `/engineers-project-init` |
| `engineers_write_spec` | The Claude Code skill `/engineers-write-spec <topic>` |
| `engineers_design_review` | The Claude Code skill `/engineers-design-review <path>` |

`engineers_project_init`, `engineers_write_spec`, and `engineers_design_review` require Claude Desktop's filesystem access to be configured for the user's project directory. Without filesystem access, the tools still return useful guidance text but cannot actually scaffold or save artifacts.

## Margaret Hamilton (cross-dispatched)

Margaret Hamilton lives in the `great-minds` plugin as the QA persona — not duplicated here. If a user asks `engineers_channel` to load Margaret/Hamilton, the server raises a clear error directing the caller to `Agent({subagent_type: "great-minds:margaret-hamilton-qa", ...})` instead. One Margaret, cross-craft addressable.

## Persona files

Each tool that loads a persona reads from `server/personas/`. These are byte-for-byte copies of the persona files in `agents/` at the plugin root. The smoke test (`tests/smoke.sh`) verifies the two directories stay in sync — if you edit a persona, run:

```bash
cp agents/*.md distribution/dxt/server/personas/
```

then re-run `tests/smoke.sh` to confirm the counts match.

## Versioning

The DXT version must match `package.json` and `.claude-plugin/plugin.json`. The smoke test validates this. To bump versions, update all four:

```
.claude-plugin/plugin.json
package.json
distribution/dxt/manifest.json
distribution/dxt/package.json
```

Then run `bash tests/smoke.sh` to confirm coherence.

## Notes

- The DXT bundle is intentionally a thin wrapper over the persona files and the skill prompts. The MCP server returns prompt text; Claude Desktop interprets it the same way Claude Code interprets the SKILL.md files.
- Filesystem-touching tools (`project_init`, `write_spec`, `design_review`) return prompt text that *describes* what should happen on disk; the actual filesystem work happens through Claude Desktop's filesystem MCP integration. This pattern matches the great-authors, great-filmmakers, great-publishers, and great-marketers DXT bundles.
- For the Claude Code experience, install the plugin instead: `/plugin install great-engineers@sethshoultes`.
