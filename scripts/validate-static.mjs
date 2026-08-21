import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const htmlFiles = [
  "index.html",
  "servicos/index.html",
  "produtos/index.html",
  "faq/index.html",
  "o-espaco/index.html",
];
const failures = [];

for (const relativeFile of htmlFiles) {
  const absoluteFile = resolve(projectRoot, relativeFile);
  const source = readFileSync(absoluteFile, "utf8");
  const h1Count = (source.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) failures.push(`${relativeFile}: esperado 1 h1, encontrado ${h1Count}`);

  for (const match of source.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(reference)) continue;
    if (reference.startsWith("/")) {
      failures.push(`${relativeFile}: caminho absoluto incompatível com GitHub Pages: ${reference}`);
      continue;
    }
    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) continue;
    const target = resolve(dirname(absoluteFile), cleanReference);
    if (!existsSync(target)) failures.push(`${relativeFile}: arquivo ausente: ${reference}`);
  }
}

const cssSource = readFileSync(resolve(projectRoot, "styles.css"), "utf8");
for (const match of cssSource.matchAll(/url\("([^"]+)"\)/g)) {
  const reference = match[1];
  if (/^(?:https?:|data:)/i.test(reference)) continue;
  const target = resolve(projectRoot, reference);
  if (!existsSync(target)) failures.push(`styles.css: arquivo ausente: ${reference}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validação estática concluída: ${htmlFiles.length} páginas e caminhos locais íntegros.`);
