# PRD implementation map

This document maps the product specification to source modules.

| PRD capability | Implementation |
|---|---|
| Interactive Architecture Model | `packages/core/src/types.ts`, `defaults.ts`, `validate.ts` |
| Truth/topology validation | `packages/core/src/validate.ts`, `graph.ts` |
| Confidence and evidence | IAM types + repository analyser |
| Layer-by-layer reveal | IAM layers + `apps/web/app/page.tsx` |
| Progressive focus/context | built-in SVG renderer focus opacity |
| Runtime flows | IAM flows, flow validation, story generation |
| Scene/story engine | `packages/story-engine`, `packages/story-runtime` |
| Timeline events | IAM `TimelineEvent` + StoryRuntime |
| Narration | IAM narrations + browser speech UI |
| OpenAI TTS | `packages/narration` |
| ElevenLabs TTS | `packages/narration` |
| Azure Speech TTS | `packages/narration` |
| Google TTS | `packages/narration` |
| Ask the Architecture | `packages/ai/src/ask.ts`, `/api/ask` |
| Persona definitions | `packages/ai/src/personas.ts` |
| Prompt to architecture | `packages/ai/src/architect.ts` with offline fallback |
| Structured AI providers | OpenAI, Anthropic, Gemini, OpenAI-compatible adapters |
| Repository analysis | `packages/repo-analyzer` |
| Public GitHub repository clone | `packages/repo-analyzer/src/git.ts` |
| Secret redaction | repository analyser |
| Prompt injection separation | skill/security docs + data-only source pipeline |
| Source evidence | repository analyser + UI evidence inspector |
| Architecture review | `packages/ai/src/review.ts` + Review UI |
| Failure exploration | `packages/core/src/diff.ts::simulateFailure` |
| Architecture comparison | `diffArchitectures`, CLI/API compare |
| Archify adapter | `packages/archify-adapter` |
| Built-in renderer | `packages/renderer-runtime` |
| Interactive HTML export | `packages/exporters` |
| SVG export | `packages/exporters` |
| PNG export | browser canvas export in web app |
| JSON export | `packages/exporters` |
| CLI | `packages/cli` |
| AI Skill | `skills/interactive-archify` |
| MCP server | `packages/mcp-server` |
| Explore mode | web app |
| Learn mode | web app stories/timeline |
| Present mode | web app autoplay and narration |
| Review mode | web app review inspector |
| Dark/responsive UI | `apps/web/app/globals.css` |
| Local-first/offline fallback | deterministic generator, static repo analysis, SVG/export |
| GitHub CI | `.github/workflows/ci.yml` |
| Security docs | `SECURITY.md`, `docs/architecture/SECURITY_MODEL.md` |
| Example gallery source data | `examples/*` |

## External-runtime features

The following are implemented as adapters and require the corresponding external runtime or credentials:

- Cloud LLM generation needs the selected provider key or a local OpenAI-compatible endpoint.
- Cloud TTS needs the selected provider credentials. Browser speech does not need a key.
- The official Archify renderer path needs Archify installed separately and configured through `ARCHIFY_CLI_PATH`.
- Public GitHub URL analysis needs the local `git` executable and network access.

## Roadmap extension surfaces

The PRD's later hosted collaboration, IDE plugins, production telemetry overlays, GitHub App automation and full video encoding are intentionally extension points rather than mandatory dependencies of the local V1 core. The MCP server, architecture diff API and model/provider abstractions are included to support those additions without changing IAM.
