// Optimize approved local artwork; originals stay untouched outside public/.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '..');
const source = path.resolve(root, '../output/castle-icons-green-gold');
const target = path.join(root, 'public/castle-hall-icons');
fs.mkdirSync(target, { recursive: true });
Promise.all(Object.entries({
  'grand-hall': 'grand-hall-v2.png',
  library: 'library-v2.png',
  conjugation: 'conjugation.png',
  grammar: 'grammar.png',
  tests: 'tests.png',
}).map(async ([name, input]) => {
  await sharp(path.join(source, input)).resize(256, 256).webp({ quality: 90 }).toFile(path.join(target, `${name}.webp`));
  console.log(name, fs.statSync(path.join(target, `${name}.webp`)).size);
})).catch(error => { console.error(error); process.exitCode = 1; });
