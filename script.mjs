const $ = (s) => document.querySelector(s);

// const addStripButton = $('#addStrip');
const strips = $('#strips');
const width = $('#width');

const settings = {
  strips: ['powderblue', 'pink', 'white', 'pink', 'powderblue'],
  width: 10,
};

strips.value = settings.strips.join('\n');
strips.addEventListener('input', updateTASize);
updateTASize();
updateCSS();

width.addEventListener('change', (e) => {
  settings.width = parseFloat(e.target.value, 10);
  updateCSS();
});

strips.addEventListener('input', (e) => {
  const color = e.target.value;
  const index = e.target.id.replace(/(textC|c)olor/, '') - 1;
  settings.strips[index] = color;

  if (e.target.id.startsWith('textColor')) {
    $(`#color${index + 1}`).value = color;
  }
  if (e.target.id.startsWith('color')) {
    $(`#textColor${index + 1}`).value = color;
  }
  updateCSS();
});

function isValidCssColor(str) {
  const s = new Option().style;
  s.color = str;
  return s.color !== '';
}

function updateTASize() {
  strips.style.height = 'auto';
  strips.style.height = `${strips.scrollHeight}px`;

  settings.strips = strips.value
    .split('\n')
    .map((color) => color.trim())
    .filter((color) => color.length > 0)
    .filter((color) => isValidCssColor(color));
}

function updateCSS() {
  const css = generateCSS();
  $('#cssPreview').textContent = css;
  $('#previewStyle').textContent = css;
}

function copyCSS() {
  // if navigator.clipboard is available, use it
  const cssPreview = $('#cssPreview').textContent;
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(cssPreview)
      .then(() => {
        alert('CSS copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
    return;
  }
}

window.copyCSS = copyCSS;

function generateCSS() {
  const width = settings.width / (settings.strips.length * 2);

  const css = `html:after {
  --flag:
    ${settings.strips
      .map(
        (color, index) => `${color} ${width * index}em ${width * (index + 1)}em`
      )
      .join(',\n    ')},
    transparent ${width * settings.strips.length}em;
  background-image: linear-gradient(-0.375turn, var(--flag));
  pointer-events: none;
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: ${settings.width}em;
  height: ${settings.width}em;
}`;

  return css;
}
