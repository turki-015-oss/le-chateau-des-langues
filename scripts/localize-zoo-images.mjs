import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = await readFile(path.join(root, "app", "zoo", "page.tsx"), "utf8");
const mappingBlock = source.match(/const animalImageFiles:[\s\S]*?=\{([\s\S]*?)\};/);

if (!mappingBlock) throw new Error("Could not find animalImageFiles in the zoo page.");

const entries = [...mappingBlock[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)].map(([, slug, file]) => [slug, file]);
const outputDirectory = path.join(root, "public", "zoo", "animals");
await mkdir(outputDirectory, { recursive: true });

async function download(slug, file) {
  const output = path.join(outputDirectory, `${slug}.webp`);
  try {
    const existing = await stat(output);
    if (existing.size > 10_000) return { slug, status: "cached" };
  } catch {}

  const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${file}?width=1100`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "LeChateauDesLangues/1.0 educational-site" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await sharp(buffer)
        .rotate()
        .resize(900, 675, { fit: "cover", position: sharp.strategy.attention })
        .webp({ quality: 84 })
        .toFile(output);
      return { slug, status: "downloaded" };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 3500));
    }
  }
  throw new Error(`${slug}: ${lastError?.message ?? "download failed"}`);
}

const results = [];
for (const [slug, file] of entries) {
  results.push(await download(slug, file));
  process.stdout.write(`\r${results.length}/${entries.length} ${slug}`);
  await new Promise((resolve) => setTimeout(resolve, 650));
}

console.log(`\nLocalized ${results.length} zoo images.`);
