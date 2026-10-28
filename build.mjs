import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
// Keep the existing v0.4 entry and its browser storage unchanged.
for (const file of ['index.html', 'styles.css', 'data.js', 'app.js']) {
  await copyFile(path.join(root, file), path.join(output, file));
}
// The UI v3 release is a static, hash-verified bundle, with no executable build hooks.
const parts = JSON.parse(await readFile(path.join(root, 'ui-v3-parts.json'), 'utf8'));
if (parts.format !== 'round-multipart/1') throw new Error('Invalid multipart manifest');
async function readParts(group) {
  const spec = parts.groups[group], chunks = [];
  for (const part of spec.parts) {
    if (!/^ui-v3-(release|design)-\d{2}\.part$/.test(part.path)) throw new Error('Unsafe multipart path');
    const data = await readFile(path.join(root, part.path));
    if (createHash('sha256').update(data).digest('hex') !== part.sha256) throw new Error('Multipart hash mismatch');
    chunks.push(data);
  }
  const bytes = Buffer.concat(chunks);
  if (createHash('sha256').update(bytes).digest('hex') !== spec.sha256) throw new Error('Bundle hash mismatch');
  return bytes;
}
const bundle = JSON.parse(gunzipSync(await readParts('release')).toString('utf8'));
if (bundle.format !== 'round-static-bundle/1' || !Array.isArray(bundle.files)) throw new Error('Invalid UI v3 release');
const preview = path.join(output, 'ui-v3');
const seen = new Set();
for (const entry of bundle.files) {
  if (typeof entry.path !== 'string' || entry.path.startsWith('/') || entry.path.includes('\\') || entry.path.split('/').some(p => !p || p === '.' || p === '..') || seen.has(entry.path)) throw new Error('Unsafe or duplicate path');
  const destination = path.resolve(preview, entry.path);
  if (!destination.startsWith(preview + path.sep)) throw new Error('Path outside preview');
  const bytes = Buffer.from(entry.base64, 'base64');
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error('Release hash mismatch: ' + entry.path);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  seen.add(entry.path);
}
await writeFile(path.join(preview, 'ROUND-UI-v3.zip'), await readParts('design'));
console.log(`ROUND v0.4 retained; UI v3 ready at /ui-v3/ (${seen.size} verified files plus design archive).`);
