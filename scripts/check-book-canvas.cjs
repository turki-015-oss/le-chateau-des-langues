const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),T=require('three'),assert=require('node:assert/strict');
const src=fs.readFileSync('lib/BookCanvasRenderer.ts','utf8');
let points=[], images=0,queued=null;
const ctx={setTransform(){},clearRect(){points=[];images=0;},save(){},restore(){},beginPath(){},moveTo(x,y){points.push([x,y]);},lineTo(){},closePath(){},fill(){},stroke(){},clip(){},transform(){},drawImage(){images++;}};
const moduleExports={};
vm.runInNewContext(ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{
 exports:moduleExports,require:()=>T,document:{createElement:()=>({getContext:()=>ctx})},requestAnimationFrame:fn=>{queued=fn;return 1;},cancelAnimationFrame:()=>{queued=null;},
});
const renderer=new moduleExports.BookCanvasRenderer(); renderer.setSize(400,350);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,400/350,.1,30);camera.position.z=7;
const book=new T.Group();scene.add(book);book.add(new T.Mesh(new T.BoxGeometry(2,3,.6),new T.MeshStandardMaterial({color:0x593019})));
for(const side of [1,-1]){const title=new T.Mesh(new T.PlaneGeometry(1,.5),new T.MeshBasicMaterial({map:new T.CanvasTexture({width:100,height:50}),transparent:true}));title.position.z=side*.31;title.rotation.y=side===1?0:Math.PI;book.add(title);}
renderer.render(scene,camera);assert.ok(points.length>0);assert.ok(images>0,'front title rendered');const initial=JSON.stringify(points);
book.rotation.y=.6;renderer.render(scene,camera);assert.notEqual(JSON.stringify(points),initial,'3D rotation changes projection');
book.rotation.y=Math.PI;renderer.render(scene,camera);assert.ok(images>0,'rear title rendered');
let frames=0;renderer.setAnimationLoop(()=>frames++);queued(0);queued(40);assert.equal(frames,2);renderer.dispose();assert.equal(queued,null);
console.log('CPU book rendering passed without WebGL: 3D rotation, front/back titles, animation, disposal.');
let raster;
ctx.createImageData=(w,h)=>({width:w,height:h,data:new Uint8ClampedArray(w*h*4)});
ctx.putImageData=data=>{raster=data;};
const desktop=new moduleExports.BookCanvasRenderer(true);desktop.setSize(150,150);
const solid=new T.Scene(),volume=new T.Mesh(new T.BoxGeometry(2,3,.6),new T.MeshStandardMaterial({color:0x593019}));solid.add(volume);camera.aspect=1;camera.updateProjectionMatrix();
for(const angle of [0,.4,1.1,1.57,2.3,3.14,4.3]){
 volume.rotation.y=angle;desktop.render(solid,camera);let filled=0;
 for(let y=0;y<150;y++){
  const row=[];for(let x=0;x<150;x++)if(raster.data[(y*150+x)*4+3])row.push(x);
  if(row.length){filled+=row.length;assert.equal(row.length,row[row.length-1]-row[0]+1,'no holes within solid volume scanline');}
 }
 assert.ok(filled>100,'visible closed volume at each angle');
}
desktop.dispose();console.log('Desktop depth buffer passed: closed silhouette without triangle gaps across seven angles.');
