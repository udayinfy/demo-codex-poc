const latexInput = document.getElementById('latex-input');
const statusEl = document.getElementById('status');
const loadDefaultBtn = document.getElementById('load-default');
const downloadPdfBtn = document.getElementById('download-pdf');

const sampleLatex = `% Paste your LaTeX resume template here`; 

loadDefaultBtn.addEventListener('click', async () => {
  status('Loading sample template...');
  try {
    const response = await fetch('/api/template');
    const text = await response.text();
    latexInput.value = text;
    status('Sample template loaded.', 'ok');
  } catch (error) {
    latexInput.value = sampleLatex;
    status('Could not fetch template file. You can still paste LaTeX manually.', 'error');
  }
});

downloadPdfBtn.addEventListener('click', async () => {
  const latex = latexInput.value.trim();
  if (!latex) {
    status('Please provide LaTeX content first.', 'error');
    return;
  }

  status('Compiling PDF...');

  const formData = new FormData();
  formData.append('latex', latex);

  try {
    const response = await fetch('/api/compile', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Compilation failed');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    status('PDF generated successfully.', 'ok');
  } catch (error) {
    status(error.message, 'error');
  }
});

function status(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}
