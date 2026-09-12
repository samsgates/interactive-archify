# Architecture

The central rule is that all intelligence compiles to the **Interactive Architecture Model (IAM)**. Renderers, AI providers, repository analysers, story playback, narration and exports are adapters around IAM.

```text
Prompt / Repository
      |
      v
AI Architect / Repo Analyzer
      |
      v
     IAM
  /   |    \
Story Review Renderer Adapter
  |            |
Narration      SVG / Archify
  \           /
 Interactive Runtime
```

The optional Archify adapter is isolated in `packages/archify-adapter`; the application is fully functional using the built-in SVG renderer if the external CLI is not installed.
