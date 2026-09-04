const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript'), assert = require('node:assert/strict');
const source = fs.readFileSync('components/SlideToEnter.tsx','utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports:exportsObject, require(name) {
  if (name === 'react') return {useRef:value=>({current:value}),useState:value=>[value,()=>{}]};
  if (name === 'react/jsx-runtime') return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
  if (name === 'lucide-react') return {ArrowLeft:'arrow',Check:'check'};
  return {default:{}};
}});
function setup(){
  let count=0,captured=false;
  const button=exportsObject.default({onEnter:()=>count++});
  const target={clientWidth:400,setPointerCapture(){captured=true;},hasPointerCapture(){return captured;},releasePointerCapture(){captured=false;}};
  const event=x=>({isPrimary:true,button:0,pointerId:1,clientX:x,currentTarget:target});
  return {props:button.props,event,count:()=>count};
}
let t=setup(); t.props.onPointerDown(t.event(360)); t.props.onPointerUp(t.event(360)); t.props.onClick({detail:1}); assert.equal(t.count(),0,'tap must not navigate');
t=setup(); t.props.onPointerDown(t.event(360)); t.props.onPointerMove(t.event(160)); t.props.onPointerUp(t.event(160)); assert.equal(t.count(),0,'short drag resets');
t=setup(); t.props.onPointerDown(t.event(360)); t.props.onPointerMove(t.event(60)); t.props.onPointerUp(t.event(60)); assert.equal(t.count(),1,'left drag unlocks'); t.props.onClick({detail:0}); assert.equal(t.count(),1,'no double navigation');
t=setup(); t.props.onPointerDown(t.event(100)); t.props.onPointerMove(t.event(380)); t.props.onPointerUp(t.event(380)); assert.equal(t.count(),0,'right drag does not unlock');
t=setup(); t.props.onPointerDown(t.event(360)); t.props.onPointerMove(t.event(20)); t.props.onPointerCancel(t.event(20)); assert.equal(t.count(),0,'cancel never unlocks');
t=setup(); t.props.onClick({detail:0}); assert.equal(t.count(),1,'keyboard and assistive activation supported');
console.log('Slide entry passed: tap, short swipe, left swipe, wrong direction, cancel, keyboard, duplicate protection.');
