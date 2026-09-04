const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app/kingdom-concept/page.tsx', 'utf8');
const css = fs.readFileSync('app/kingdom-concept/concept.css', 'utf8');
const start = source.indexOf('    let received = false;');
const end = source.indexOf('  }, [compassAuthorized, compassEnabled]);', start);
const code = source.slice(start, end)
  .replace('let frame: number | null', 'let frame')
  .replace('(rawEvent: Event)', '(rawEvent)')
  .replace('rawEvent as CompassOrientationEvent', 'rawEvent');
let listener, pending, cleanup, heading;
let updates = 0;
const windowMock = {
  requestAnimationFrame(fn) { pending = fn; return 1; },
  cancelAnimationFrame() { pending = null; },
  addEventListener(name, fn) { listener = fn; },
  removeEventListener() { listener = null; },
  setTimeout() { return 2; }, clearTimeout() {},
};
cleanup = vm.runInNewContext(`(() => { ${code} })()`, {
  window: windowMock,
  setCompassStatus() {},
  setCompassHeading(value) { heading = value; updates++; },
});
const flush = () => { const fn = pending; pending = null; fn?.(); };
listener({ webkitCompassHeading: 90 });
listener({ webkitCompassHeading: 120 });
assert.equal(updates, 0);
flush();
assert.equal(heading, 120, 'latest reading reaches next frame without lag');
assert.equal(updates, 1, 'sensor bursts coalesce');
for (const value of [359, 1, 0, 270]) {
  listener({ webkitCompassHeading: value }); flush();
  assert.equal(heading, value);
}
listener({ absolute: true, alpha: 90 }); flush();
assert.equal(heading, 270);
listener({ absolute: false, alpha: 90 });
listener({ webkitCompassHeading: NaN });
assert.equal(pending, null, 'invalid/relative readings ignored');
listener({ webkitCompassHeading: 45 }); cleanup();
assert.equal(pending, null, 'queued frame cancelled on disable/unmount');
assert.equal(listener, null);
assert.match(source, /concept-compass-rotor[\s\S]*concept-compass-cardinals[\s\S]*concept-compass-needle[\s\S]*<\/i>\s*<\/span>/);
assert.match(css, /\.concept-compass-rotor\{[^}]*transition:none/);
assert.doesNotMatch(css, /\.concept-compass-needle\{[^}]*transition:/);
console.log('Compass checks passed: fresh frame, wraparound, sensor validation, cleanup, shared N/needle rotor.');
