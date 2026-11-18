import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = join(root, 'docs');
const backend = new URL(
  process.env.JOURNAL_BACKEND_ORIGIN ||
    'https://bringing-life-in-desolation.blondefir8.chatgpt.site',
);
if (backend.protocol !== 'https:' || backend.username || backend.password) {
  throw new Error('JOURNAL_BACKEND_ORIGIN must be an HTTPS origin.');
}

const [script, styleSource, template] = await Promise.all([
  build({
    absWorkingDir: root,
    entryPoints: ['pages/main.tsx'],
    bundle: true,
    jsx: 'automatic',
    platform: 'browser',
    format: 'esm',
    target: 'es2022',
    define: {
      'process.env.NODE_ENV': '"production"',
      JOURNAL_BACKEND_ORIGIN: JSON.stringify(backend.origin),
    },
    minify: true,
    legalComments: 'eof',
    write: false,
  }),
  readFile(join(root, 'styles/public.css'), 'utf8'),
  readFile(join(root, 'pages/index.html'), 'utf8'),
]);
const style = await transform(styleSource, { loader: 'css', minify: true });
const hash = (contents) =>
  createHash('sha256').update(contents).digest('hex').slice(0, 12);
const scriptBytes = script.outputFiles[0].contents;
const scriptPath = `assets/journal-${hash(scriptBytes)}.js`;
const stylePath = `assets/journal-${hash(style.code)}.css`;
const html = template
  .replaceAll('%BACKEND_ORIGIN%', backend.origin)
  .replace('%JOURNAL_SCRIPT%', `./${scriptPath}`)
  .replace('%JOURNAL_STYLE%', `./${stylePath}`);

await rm(output, { force: true, recursive: true });
await mkdir(join(output, 'assets'), { recursive: true });
await Promise.all([
  writeFile(join(output, 'index.html'), html),
  writeFile(join(output, '.nojekyll'), ''),
  writeFile(join(output, scriptPath), scriptBytes),
  writeFile(join(output, stylePath), style.code),
  cp(join(root, 'public/covers'), join(output, 'covers'), { recursive: true }),
]);
console.log(`Built GitHub Pages output in docs/ using ${backend.origin}.`);
