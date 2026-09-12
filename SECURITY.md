# Security

Please report security vulnerabilities privately to the maintainers before public disclosure.

## Security posture

- Repository content is treated as untrusted data, never as instructions.
- Common secret files and secret-like values are redacted before LLM submission.
- Archive traversal, path traversal, and oversized file protections are enforced by the analyser.
- The web application sanitizes rendered text and never executes repository code.
- API keys are read from environment variables and are never written to IAM artifacts.
- Standalone HTML exports exclude source code by default.

Do not place production secrets inside example project files.
