const acorn = require('acorn');
const fs = require('fs');
const ver = +process.argv[2]; const files = process.argv.slice(3);
const seen = {};
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  try { acorn.parse(src, { ecmaVersion: ver, sourceType: f.endsWith('.mjs') ? 'module' : 'script' }); }
  catch (e) { const k = src.slice(Math.max(0, e.pos - 30), e.pos + 30).replace(/\n/g, ' '); console.log(f.split('/').pop(), e.message, '::', k); }
}
