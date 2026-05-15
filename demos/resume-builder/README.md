# Resume Builder Demo

This demo provides a browser-based LaTeX editor and PDF export flow for resumes.

## Run

```bash
cd demos/resume-builder
npm install
npm start
```

Open `http://localhost:3000`.

## Checks

```bash
npm run check
```

## PDF Compiler Requirement

The server uses `pdflatex` to generate PDFs. If missing, the UI shows a disabled generate action and the API returns an actionable error message.

Install a TeX distribution such as:

- **Linux**: `texlive-latex-base` / full TeX Live
- **macOS**: MacTeX
- **Windows**: MiKTeX or TeX Live
