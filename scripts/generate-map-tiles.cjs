const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const SOURCE_WIDTH = 808;
const SOURCE_HEIGHT = 1114;
const LOGICAL_TILE_SIZE = 256;

const root = path.resolve(__dirname, "..");
const source = path.join(root, "public", "maps", "kingdom-approved.webp");
const hdSource = path.join(root, "public", "maps", "kingdom-approved-hd.webp");
const outputRoot = path.join(root, "public", "maps", "kingdom-tiles");
const regionOutputRoot = path.join(root, "public", "maps", "kingdom-regions");
const LEVELS = [
  {
    name: "base",
    directory: "base-2x",
    scale: 2,
    quality: 90,
    input: source,
    sharpen: { sigma: 0.75 }
  },
  {
    name: "detail",
    directory: "detail-4x",
    scale: 4,
    quality: 93,
    input: hdSource
  }
];
const REGIONS = [
  {
    name: "central",
    scale: 4,
    left: 160,
    top: 80,
    width: 490,
    height: 620,
    feather: 64,
    input: hdSource,
    output: path.join(regionOutputRoot, "central-detail-4x.webp")
  }
];

async function generateLevel({
  name,
  directory,
  scale,
  quality,
  input,
  sharpen
}) {
  const width = SOURCE_WIDTH * scale;
  const height = SOURCE_HEIGHT * scale;
  const physicalTileSize = LOGICAL_TILE_SIZE * scale;
  const columns = Math.ceil(width / physicalTileSize);
  const rows = Math.ceil(height / physicalTileSize);
  const outputDirectory = path.join(outputRoot, directory);

  await fs.mkdir(outputDirectory, { recursive: true });

  let pipeline = sharp(input).resize(width, height, {
    fit: "fill",
    kernel: sharp.kernel.lanczos3
  });

  if (sharpen) {
    pipeline = pipeline.sharpen(sharpen);
  }

  const { data, info } = await pipeline
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

  return {
    name,
    directory,
    input: path.relative(root, input),
    width,
    height,
    columns,
    rows
  };
}

async function generateRegion({
  name,
  scale,
  left,
  top,
  width,
  height,
  feather,
  input,
  output
}) {
  const physicalWidth = width * scale;
  const physicalHeight = height * scale;
  const physicalLeft = left * scale;
  const physicalTop = top * scale;
  const innerWidth = physicalWidth - feather * 2;
  const innerHeight = physicalHeight - feather * 2;
  const alphaMask = Buffer.from(`
    <svg width="${physicalWidth}" height="${physicalHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feather">
          <feGaussianBlur stdDeviation="${feather / 2}" />
        </filter>
      </defs>
      <rect
        x="${feather}"
        y="${feather}"
        width="${innerWidth}"
        height="${innerHeight}"
        rx="${feather / 2}"
        fill="white"
        filter="url(#feather)"
      />
    </svg>
  `);

  await fs.mkdir(path.dirname(output), { recursive: true });

  const enhanced = await sharp(input)
    .extract({
      left: physicalLeft,
      top: physicalTop,
      width: physicalWidth,
      height: physicalHeight
    })
    .modulate({ brightness: 1.012, saturation: 1.035 })
    .sharpen({ sigma: 0.82, m1: 0.55, m2: 1.15 })
    .ensureAlpha()
    .png()
    .toBuffer();

  await sharp(enhanced)
    .composite([{ input: alphaMask, blend: "dest-in" }])
    .webp({ quality: 94, effort: 6, smartSubsample: true })
    .toFile(output);

  const metadata = await sharp(output).metadata();

  if (
    metadata.width !== physicalWidth ||
    metadata.height !== physicalHeight ||
    metadata.hasAlpha !== true
  ) {
    throw new Error(
      `Invalid region ${name}: ${metadata.width}x${metadata.height}, ` +
      `alpha=${metadata.hasAlpha}; expected ${physicalWidth}x${physicalHeight} with alpha.`
    );
  }

  return {
    name,
    input: path.relative(root, input),
    output: path.relative(root, output),
    logicalBounds: { left, top, width, height },
    physicalSize: { width: physicalWidth, height: physicalHeight },
    feather
  };
}

async function main() {
  const metadata = await sharp(source).metadata();
  const hdMetadata = await sharp(hdSource).metadata();

  if (metadata.width !== SOURCE_WIDTH || metadata.height !== SOURCE_HEIGHT) {
    throw new Error(
      `Unexpected map dimensions: ${metadata.width}x${metadata.height}. ` +
      `Expected ${SOURCE_WIDTH}x${SOURCE_HEIGHT}; refusing to generate shifted tiles.`
    );
  }

  if (
    hdMetadata.width !== SOURCE_WIDTH * 4 ||
    hdMetadata.height !== SOURCE_HEIGHT * 4
  ) {
    throw new Error(
      `Unexpected HD map dimensions: ${hdMetadata.width}x${hdMetadata.height}. ` +
      `Expected ${SOURCE_WIDTH * 4}x${SOURCE_HEIGHT * 4}; refusing to generate shifted tiles.`
    );
  }

  const generated = [];
  for (const level of LEVELS) {
    generated.push(await generateLevel(level));
  }

  const regions = [];
  for (const region of REGIONS) {
    regions.push(await generateRegion(region));
  }

  console.log(
    JSON.stringify(
      { source: path.relative(root, source), generated, regions },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
