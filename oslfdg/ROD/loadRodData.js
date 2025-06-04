// loadRodData.js

const fs   = require('fs').promises;
const path = require('path');

const DATA_ROOT = path.resolve(__dirname); // or replace with "C:/path/to/your/project"

async function loadAllJson(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let out = {};
  for (let ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const nested = await loadAllJson(full);
      out = { ...out, ...nested };
    } else if (ent.isFile() && ent.name.endsWith('.json')) {
      const relativeKey = path
        .relative(DATA_ROOT, full)
        .replace(/\\/g, '/')
        .replace(/\.json$/, '');
      try {
        const txt = await fs.readFile(full, 'utf8');
        out[relativeKey] = JSON.parse(txt);
      } catch (err) {
        console.error(`⚠️  Failed parsing ${full}:`, err.message);
      }
    }
  }
  return out;
}

(async () => {
  const rodData = await loadAllJson(DATA_ROOT);
  console.log('Loaded files:\n', Object.keys(rodData).join('\n  • '));
  
  // Example lookup:
  console.log('\nSample “aliens/anthromorph”:');
  console.log(JSON.stringify(rodData['aliens/anthromorph'], null, 2));
  
  // Now you’ve got everything in `rodData`—just index into it whenever you need!
})();
