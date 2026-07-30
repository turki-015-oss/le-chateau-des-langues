const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const SOURCE_WIDTH = 808;
const SOURCE_HEIGHT = 1114;
const LOGICAL_TILE_SIZE = 256;
const LEVELS = [
  { name: "2x", scale: 2, quality: 90 },
  { name: "4x", scale: 4, quality: 92 }
];

const root = path.resolve(__dirname, "..");
const source = path.join(root, "public", "maps", "kingdom-approved.webp");
const outputRoot = path.join(root, "public", "maps", "kingdom-tiles");

async function generateLevel({ name, scale, quality }) {
  const width = SOURCE_WIDTH * scale;
  const height = SOURCE_HEIGHT * scale;
  const physicalTileSize = LOGICAL_TILE_SIZE * scale;
  const columns = Math.ceil(width / physicalTileSize);
  const rows = Math.ceil(height / physicalTileSize);
  const outputDirectory = path.join(outputRoot, name);

  await fs.mkdir(outputDirectory, { recursive: true });

  const { data, info } = await sharp(source)
    .resize(width, height, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({ sigma: scale === 4 ? 1.15 : 0.9 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const jobs = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = column * physicalTileSize;
      const top = row * physicalTileSize;
      const tileWidth = Math.min(physicalTileSize, width - left);
      const tileHeight = Math.min(physicalTileSize, height - top);
      const output = path.join(outputDirectory, `tile-${row}-${column}.webp`);

      jobs.push(
        sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: info.channels
          }
        })
          .extract({ left, top, width: tileWidth, height: tileHeight })
          .webp({ quality, effort: 6, smartSubsample: true })
          .toFile(output)
      );
    }
  }

  await Promise.all(jobs);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = column * physicalTileSize;
      const top = row * physicalTileSize;
      const expectedWidth = Math.min(physicalTileSize, width - left);
      const expectedHeight = Math.min(physicalTileSize, height - top);
      const output = path.join(outputDirectory, `tile-${row}-${column}.webp`);
      const tileMetadata = await sharp(output).metadata();

      if (
        tileMetadata.width !== expectedWidth ||
        tileMetadata.height !== expectedHeight
      ) {
        throw new Error(
          `Invalid tile ${name}/${row}-${column}: ` +
          `${tileMetadata.width}x${tileMetadata.height}; ` +
          `expected ${expectedWidth}x${expectedHeight}.`
        );
      }
    }
  }

  return { name, width, height, columns, rows };
}

async function main() {
  const metadata = await sharp(source).metadata();

  if (metadata.width !== SOURCE_WIDTH || metadata.height !== SOURCE_HEIGHT) {
    throw new Error(
      `Unexpected map dimensions: ${metadata.width}x${metadata.height}. ` +
      `Expected ${SOURCE_WIDTH}x${SOURCE_HEIGHT}; refusing to generate shifted tiles.`
    );
  }

  const generated = [];
  for (const level of LEVELS) {
    generated.push(await generateLevel(level));
  }

  console.log(JSON.stringify({ source: path.relative(root, source), generated }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
