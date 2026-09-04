const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '.next/server/app/grand-hall.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/grand-hall/page.tsx'), 'utf8');
const castle = fs.readFileSync(path.join(root, 'app/castle/page.tsx'), 'utf8');
assert.equal((html.match(/<details\b/g) || []).length, 5, 'Five guidance sections');
assert.equal((html.match(/name="grand-hall-guide"/g) || []).length, 5, 'Shared native accordion group');
assert.equal((html.match(/<li\b/g) || []).length, 15, 'Three bilingual tips per section');
assert.match(html, /<a\b(?=[^>]*href="\/castle")(?=[^>]*aria-label="العودة إلى قاعات القلعة")[^>]*>/, 'Explicit castle return');
assert.ok(!page.includes('data-portal-return'), 'Return must not trigger kingdom exit');
assert.match(castle, /desc: "كيف تتعلم ومن أين تبدأ", path: "\/grand-hall"/, 'Updated card description and destination');
assert.ok(fs.existsSync(path.join(root, 'app/family/page.tsx')), 'Existing family lesson preserved');
for (const route of ['/castle', '/university', '/library', '/grammar', '/conjugation']) {
  assert.ok(fs.existsSync(path.join(root, 'app', route.slice(1), 'page.tsx')), `Existing destination ${route}`);
}
console.log('Grand hall checks passed: 5 sections, 15 bilingual tips, castle return and card routing.');
