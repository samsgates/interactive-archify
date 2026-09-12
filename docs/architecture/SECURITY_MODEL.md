# Repository security model

1. File inventory ignores `.git`, dependencies, build artifacts and common environments.
2. Secret-like files are skipped.
3. Secret-like values are redacted from inspected text.
4. Repository contents are never concatenated into system instructions.
5. Static extraction happens before any optional LLM reasoning.
6. Shared HTML excludes evidence excerpts and full local paths by default.
