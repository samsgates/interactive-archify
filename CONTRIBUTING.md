# Contributing

1. Fork and create a feature branch.
2. Keep changes inside the correct package boundary.
3. Add tests for schema, graph, AI grounding, story, or renderer changes.
4. Run `pnpm typecheck`, `pnpm test`, and `pnpm build`.
5. For AI changes, include a deterministic fixture and describe grounding/failure behaviour.
6. For UI changes, include dark and light screenshots when possible.

Core IAM schema changes require maintainer review because they affect every adapter.
