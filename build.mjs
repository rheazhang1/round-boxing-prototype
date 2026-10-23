import { mkdir, copyFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const output = new URL('./dist/', root);
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'data.js', 'app.js']) {
  await copyFile(new URL(file, root), new URL(file, output));
}
console.log('ROUND static site ready in dist/ (4 files, no external dependencies).');
