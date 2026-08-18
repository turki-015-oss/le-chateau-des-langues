const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");
const unityBuild = path.resolve(siteRoot, "..", "CastleMap_Prototype", "Builds", "WebGLPreview", "Build");
const publicBuild = path.join(siteRoot, "public", "unity-map", "Build");

if (!fs.existsSync(unityBuild)) {
  throw new Error(`Unity WebGL build was not found: ${unityBuild}`);
}

fs.mkdirSync(publicBuild, { recursive: true });
for (const file of fs.readdirSync(unityBuild)) {
  const source = path.join(unityBuild, file);
  if (!fs.statSync(source).isFile()) continue;
  fs.copyFileSync(source, path.join(publicBuild, file));
  console.log(`Synced ${file}`);
}

console.log("Unity map build synced without replacing the branded web player.");
