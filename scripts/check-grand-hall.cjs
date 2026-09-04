const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, '.next/server/app/grand-hall.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app/grand-hall/page.tsx'), 'utf8');
const client = fs.readFileSync(path.join(root, 'app/grand-hall/GrandHall.tsx'), 'utf8');
const castle = fs.readFileSync(path.join(root, 'app/castle/page.tsx'), 'utf8');
assert.equal((html.match(/data-guide="/g) || []).length, 5, 'Five app-like guide buttons');
assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 5, 'All buttons announce their dialog');
assert.equal((html.match(/<details\b/g) || []).length, 0, 'No accordion rows');
assert.match(html, /<dialog\b[^>]*id="guide-dialog"/, 'Native accessible modal');
assert.equal((page.match(/\{ ar: /g) || []).length, 15, 'Fifteen preserved bilingual tips');
assert.match(html, /<a\b(?=[^>]*href="\/castle")(?=[^>]*aria-label="العودة إلى قاعات القلعة")[^>]*>/, 'Explicit castle return');
assert.ok(!client.includes('data-portal-return'), 'Return must not trigger kingdom exit');
assert.ok(client.includes('element.showModal()'), 'Native focus containment');
assert.ok(client.includes('onCancel=') && client.includes('إغلاق التعليمات'), 'Escape and explicit close');
assert.ok(client.includes('window.scrollTo(0, scrollY)') && client.includes('preventScroll: true'), 'Scroll and focus restoration');
assert.ok(client.includes('onPointerUp={endDrag}') && client.includes('distance > 80'), 'Handle swipe threshold');
assert.ok(fs.existsSync(path.join(root, 'public/grand-hall-assets/guide-artwork.webp')), 'Local optimized artwork');
assert.match(castle, /desc: "كيف تتعلم ومن أين تبدأ", path: "\/grand-hall"/, 'Updated card description and destination');
assert.ok(fs.existsSync(path.join(root, 'app/family/page.tsx')), 'Existing family lesson preserved');
for (const route of ['/castle', '/university', '/library', '/grammar', '/conjugation']) {
  assert.ok(fs.existsSync(path.join(root, 'app', route.slice(1), 'page.tsx')), `Existing destination ${route}`);
}
console.log('Grand hall source/build checks passed: 5 app buttons, modal controls, preserved bilingual content, castle return.');
