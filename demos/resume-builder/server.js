const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const { execFile } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', async (_req, res) => {
  const pdflatex = await detectPdfLatex();
  res.json({
    ok: true,
    compiler: {
      available: pdflatex.available,
      command: 'pdflatex',
      message: pdflatex.message
    }
  });
});

app.get('/api/template', (_req, res) => {
  const templatePath = path.join(__dirname, 'main.tex');
  res.sendFile(templatePath);
});

app.post('/api/compile', upload.none(), async (req, res) => {
  const latex = req.body.latex;

  if (!latex || typeof latex !== 'string') {
    return res.status(400).json({ error: 'LaTeX input is required.' });
  }

  const pdflatex = await detectPdfLatex();
  if (!pdflatex.available) {
    return res.status(503).json({
      error:
        'PDF compilation is unavailable because pdflatex is not installed or not on PATH. Install TeX Live/MacTeX and restart the server.'
    });
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-builder-'));
  const texPath = path.join(tempDir, 'resume.tex');
  const pdfPath = path.join(tempDir, 'resume.pdf');

  try {
    fs.writeFileSync(texPath, latex, 'utf8');

    await runPdfLatex(tempDir, texPath);

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: 'PDF generation failed. No PDF output file was produced.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(fs.readFileSync(pdfPath));
  } catch (error) {
    res.status(500).json({ error: error.message || 'LaTeX compilation failed.' });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

function detectPdfLatex() {
  return new Promise((resolve) => {
    execFile('pdflatex', ['--version'], (error) => {
      if (error) {
        resolve({ available: false, message: 'pdflatex is missing.' });
        return;
      }
      resolve({ available: true, message: 'pdflatex is available.' });
    });
  });
}

function runPdfLatex(cwd, texPath) {
  return new Promise((resolve, reject) => {
    execFile(
      'pdflatex',
      ['-interaction=nonstopmode', '-halt-on-error', '-output-directory', cwd, texPath],
      { cwd },
      (error, stdout, stderr) => {
        if (error) {
          const logOutput = (stderr || stdout || 'pdflatex execution failed.').trim();
          reject(new Error(`LaTeX compilation failed: ${logOutput}`));
          return;
        }
        resolve();
      }
    );
  });
}

app.listen(port, () => {
  console.log(`Resume Builder running on http://localhost:${port}`);
});
