# demo-codex-poc

Starter repository for building and sharing Codex demos.

## What's included

- A lightweight project overview
- Suggested workflow for demo development
- Basic repository hygiene files

## Quick start

1. Create a folder for your demo assets (for example, `demos/first-demo/`).
2. Add a short README in that folder with:
   - Objective
   - Setup steps
   - Commands to run
   - Expected output
3. Keep each demo self-contained so it can be reviewed independently.

## Recommended structure

```text
.
├── demos/
│   └── <demo-name>/
│       ├── README.md
│       └── assets/
├── scripts/
└── README.md
```

## Tips for Codex-driven demos

- Keep prompts and commands deterministic where possible.
- Include a `repro.md` file per demo if the flow is multi-step.
- Capture before/after outputs for clarity.

## License

Add a license before sharing publicly.
