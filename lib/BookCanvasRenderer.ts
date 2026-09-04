import * as T from "three";

type Face = { p:T.Vector3[]; uv:T.Vector2[]; depth:number; color:string; image:CanvasImageSource|null; opacity:number; rgb:number[]; q:number[] };

/** CPU projection of the same book meshes for browsers without WebGL2. */
export class BookCanvasRenderer {
  readonly domElement = document.createElement("canvas");
  private ctx = this.domElement.getContext("2d")!;
  private width = 1;
  private height = 1;
  private ratio = 1;
  private frame = 0;
  private callback: ((time: number) => void) | null = null;
  private samples = new WeakMap<object,ImageData>();
  constructor(private depthBuffered = false) { if (!this.ctx) throw new Error("Canvas unavailable"); }
  setPixelRatio(value: number) { this.ratio = Math.min(value, 1.5); }
  setSize(width: number, height: number, _updateStyle = false) {
    this.width = width; this.height = height;
    this.domElement.width = Math.round(width*this.ratio); this.domElement.height = Math.round(height*this.ratio);
  }
  setAnimationLoop(callback: ((time: number) => void) | null) {
    cancelAnimationFrame(this.frame); this.callback = callback;
    let last = -Infinity;
    const tick = (time: number) => {
      if (!this.callback) return;
      this.frame = requestAnimationFrame(tick);
      if (time-last < 30) return;
      last = time; this.callback(time);
    };
    if (callback) this.frame = requestAnimationFrame(tick);
  }
  render(scene: T.Scene, camera: T.Camera) {
    scene.updateMatrixWorld(); camera.updateMatrixWorld();
    const projection = new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    const faces:Face[]=[];
    const light = new T.Vector3(-.4,.7,1).normalize();
    scene.traverse(object => {
      if (!(object instanceof T.Mesh) || !object.visible) return;
      const material = object.material as T.MeshStandardMaterial;
      if (!material.visible) return;
      const geometry=object.geometry, position=geometry.getAttribute("position"), uv=geometry.getAttribute("uv"), index=geometry.index;
      const count=index ? index.count : position.count;
      for(let i=0;i<count;i+=3){
        const ids=[0,1,2].map(j=>index ? index.getX(i+j) : i+j);
        const world=ids.map(id=>new T.Vector3().fromBufferAttribute(position,id).applyMatrix4(object.matrixWorld));
        const p=world.map(vertex=>vertex.clone().applyMatrix4(projection));
        if(p.some(v=>v.z < -1 || v.z > 1)) continue;
        p.forEach(v=>{v.x=(v.x+1)*this.width/2;v.y=(1-v.y)*this.height/2;});
        if((p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x)>=0) continue;
        const normal=world[1].clone().sub(world[0]).cross(world[2].clone().sub(world[0])).normalize();
        // Desktop CPU rendering has no environment lighting: compensate for
        // that missing ambient light instead of darkening the approved leather.
        const illumination = this.depthBuffered ? .96+.24*Math.max(0,normal.dot(light)) : .62+.38*Math.max(0,normal.dot(light));
        const unlit = (material as unknown as T.MeshBasicMaterial).isMeshBasicMaterial;
        const color=material.color.clone().multiplyScalar(unlit ? 1 : illumination);
        const rgb=color.clone().convertLinearToSRGB();
        faces.push({p,uv:ids.map(id=>uv ? new T.Vector2().fromBufferAttribute(uv,id) : new T.Vector2()),depth:(p[0].z+p[1].z+p[2].z)/3,color:color.getStyle(),image:(material.map?.image as CanvasImageSource | undefined) ?? null,opacity:material.opacity,rgb:[rgb.r*255,rgb.g*255,rgb.b*255],q:world.map(v=>-1/v.clone().applyMatrix4(camera.matrixWorldInverse).z)});
      }
    });
    if(this.depthBuffered){ this.renderDepthBuffered(faces); return; }
    faces.sort((a,b)=>b.depth-a.depth);
    const ctx=this.ctx; ctx.setTransform(this.ratio,0,0,this.ratio,0,0); ctx.clearRect(0,0,this.width,this.height);
    for(const face of faces){
      const [a,b,c]=face.p; ctx.save(); ctx.globalAlpha=face.opacity;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();
      if(face.image){
        const img=face.image as HTMLCanvasElement;
        const [u,v,w]=face.uv.map(point=>({x:point.x*img.width,y:(1-point.y)*img.height}));
        const det=u.x*(v.y-w.y)+v.x*(w.y-u.y)+w.x*(u.y-v.y);
        if(Math.abs(det)>.001){
          const solve=(x:number,y:number,z:number)=>[(x*(v.y-w.y)+y*(w.y-u.y)+z*(u.y-v.y))/det,(x*(w.x-v.x)+y*(u.x-w.x)+z*(v.x-u.x))/det,(x*(v.x*w.y-w.x*v.y)+y*(w.x*u.y-u.x*w.y)+z*(u.x*v.y-v.x*u.y))/det];
          const x=solve(a.x,b.x,c.x),y=solve(a.y,b.y,c.y);ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(img,0,0);
        }
      }else{ctx.fillStyle=face.color;ctx.fill();ctx.strokeStyle=face.color;ctx.lineWidth=.45;ctx.stroke();}
      ctx.restore();
    }
  }
  // Per-pixel depth prevents large cover triangles from painting over nearer
  // pages, gold borders or lettering when the CPU-rendered book turns.
  private renderDepthBuffered(faces:Face[]){
    const width=this.domElement.width,height=this.domElement.height;
    const output=this.ctx.createImageData(width,height),pixels=output.data;
    const depth=new Float32Array(width*height);depth.fill(Infinity);
    for(const face of faces){
      const [a,b,c]=face.p.map(v=>({x:v.x*this.ratio,y:v.y*this.ratio,z:v.z}));
      const area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
      if(Math.abs(area)<.00001)continue;
      let sample:ImageData|undefined;
      if(face.image){
        sample=this.samples.get(face.image);
        if(!sample){
          const image=face.image as HTMLCanvasElement;
          sample=image.getContext("2d")?.getImageData(0,0,image.width,image.height);
          if(sample)this.samples.set(face.image,sample);
        }
      }
      const minX=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),maxX=Math.min(width-1,Math.ceil(Math.max(a.x,b.x,c.x)));
      const minY=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),maxY=Math.min(height-1,Math.ceil(Math.max(a.y,b.y,c.y)));
      for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
        const px=x+.5,py=y+.5;
        const wa=((b.x-px)*(c.y-py)-(b.y-py)*(c.x-px))/area;
        const wb=((c.x-px)*(a.y-py)-(c.y-py)*(a.x-px))/area,wc=1-wa-wb;
        if(wa<-.000001||wb<-.000001||wc<-.000001)continue;
        const z=wa*a.z+wb*b.z+wc*c.z,offset=y*width+x;
        if(z>depth[offset]+.0000001)continue;
        let [r,g,bl]=face.rgb,alpha=255*face.opacity;
        if(sample){
          const weights=[wa*face.q[0],wb*face.q[1],wc*face.q[2]],sum=weights[0]+weights[1]+weights[2];
          const u=weights.reduce((v,w,i)=>v+w*face.uv[i].x,0)/sum;
          const v=weights.reduce((v,w,i)=>v+w*face.uv[i].y,0)/sum;
          const sx=Math.max(0,Math.min(sample.width-1,Math.floor(u*sample.width))),sy=Math.max(0,Math.min(sample.height-1,Math.floor((1-v)*sample.height)));
          const tex=(sy*sample.width+sx)*4;r=sample.data[tex];g=sample.data[tex+1];bl=sample.data[tex+2];alpha=sample.data[tex+3]*face.opacity;
          if(alpha<16)continue;
        }
        depth[offset]=z;const p=offset*4;
        pixels[p]=r;pixels[p+1]=g;pixels[p+2]=bl;pixels[p+3]=alpha;
      }
    }
    this.ctx.putImageData(output,0,0);
  }
  dispose(){ this.setAnimationLoop(null); }
}
