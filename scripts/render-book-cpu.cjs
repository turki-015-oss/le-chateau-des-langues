// Render the actual desktop fallback model without a browser or WebGL.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript'),T=require('three');
const {createCanvas}=require(require.resolve('@napi-rs/canvas',{paths:['C:/Users/VICTUS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules']}));
const document={createElement:()=>createCanvas(1,1)};
const out={};
const compile=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(compile(fs.readFileSync('lib/BookCanvasRenderer.ts','utf8')),{exports:out,require:()=>T,document,cancelAnimationFrame(){}});
const renderer=new out.BookCanvasRenderer(true);renderer.setPixelRatio(1.5);renderer.setSize(440,440);
const src=fs.readFileSync('components/WelcomeBook.tsx','utf8');
const block=src.slice(src.indexOf('      const scene ='),src.indexOf('      const resize ='));
const sandbox={T,renderer,document,gpu:false,desktop:true};
vm.runInNewContext(compile(block)+'\nglobalThis.model={scene,camera,book};',sandbox);
const {scene,camera,book}=sandbox.model;camera.aspect=1;camera.updateProjectionMatrix();
const sheet=createCanvas(1320,660),ctx=sheet.getContext('2d');ctx.fillStyle='#102f26';ctx.fillRect(0,0,1320,660);
[-.35,-1.25].forEach((angle,i)=>{book.rotation.set(.08,angle,-.07);renderer.render(scene,camera);ctx.drawImage(renderer.domElement,i*660,0);});
const target=path.join(process.env.TEMP,'chateau-desktop-book.png');fs.writeFileSync(target,sheet.toBuffer('image/png'));console.log(target);
