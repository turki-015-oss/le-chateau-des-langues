const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('components/WelcomeBook.tsx','utf8');
const block = source.slice(source.indexOf('      let angle ='),source.indexOf('      setReady(true);'));
const events = {};
let frame, now = 0, yaw = 0, capture = null;
const container = {
  clientWidth: 400, style: {},
  addEventListener(name,fn) { events[name] = fn; },
  setPointerCapture(id) { capture = id; },
  hasPointerCapture(id) { return capture === id; },
  releasePointerCapture() { capture = null; },
};
vm.runInNewContext(ts.transpileModule(block,{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText, {
  container, performance:{now:()=>now}, document:{hidden:false}, scene:{}, camera:{},
  renderer:{setAnimationLoop(fn){frame=fn;},render(){}},
  book:{rotation:{set(x,y){yaw=y;}}},
});
frame(0); now=50; frame(50); now=100; frame(100);
assert.ok(yaw>-.35,'automatic rotation advances');
const before=yaw;
events.pointerdown({isPrimary:true,button:0,pointerId:1,clientX:100});
events.pointermove({pointerId:1,clientX:200});
assert.ok(Math.abs(yaw-before-Math.PI/2)<1e-9,'quarter-width drag produces quarter turn');
now=150; frame(150); assert.equal(yaw,before+Math.PI/2,'auto rotation pauses while dragging');
events.pointerup({pointerId:1}); assert.equal(capture,null);
now=300; frame(300); assert.equal(yaw,before+Math.PI/2,'brief hold after release');
now=501; frame(501); assert.ok(yaw>before+Math.PI/2,'automatic rotation resumes after 350ms');
assert.ok(!source.includes('const diamond ='),'central diamond removed');
let prevented=false; events.keydown({key:'ArrowLeft',preventDefault(){prevented=true;}});
assert.equal(prevented,true);
const page=fs.readFileSync('app/page.tsx','utf8');
assert.ok(!page.includes('styles.halo') && !page.includes('styles.groundLight'));
assert.ok(source.includes('touchAction:"pan-y"'),'vertical mobile scrolling retained');
console.log('Book controls passed: automatic rotation, drag, release, resume, keyboard, halo removal.');
