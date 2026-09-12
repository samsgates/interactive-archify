# AI providers

Configure through `.env.local` or the process environment.

- OpenAI: `AI_PROVIDER=openai`, `OPENAI_API_KEY=...`
- Anthropic: `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY=...`
- Gemini: `AI_PROVIDER=gemini`, `GEMINI_API_KEY=...`
- OpenAI-compatible: `AI_PROVIDER=openai-compatible`, `OPENAI_COMPATIBLE_BASE_URL=http://localhost:8000/v1`

If no provider credentials are available, the application remains usable with deterministic architecture heuristics, local repository analysis, rendering, stories, review and export.
