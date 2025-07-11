const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.resolve(__dirname, '../tokens');
const OUTPUT_DIR = path.resolve(__dirname, '../build/tailwind');

// Recursively reduce .value wrappers
function flattenValues(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if ('value' in obj && Object.keys(obj).length === 1) {
    return obj.value;
  }

  const result = {};
  for (const key in obj) {
    result[key] = flattenValues(obj[key]);
  }
  return result;
}

function transformTokens() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file.replace(/\.json$/, '.js'));

    const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    const flattened = flattenValues(raw);

    const jsExport = `export default ${JSON.stringify(flattened, null, 2)};\n`;

    fs.writeFileSync(outputPath, jsExport, 'utf-8');
    console.log(`✅ Transformed ${file} → ${path.basename(outputPath)}`);
  });
}

transformTokens();
