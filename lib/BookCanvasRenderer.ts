import * as T from "three";

/** CPU projection of the same book meshes for browsers without WebGL2. */
export class BookCanvasRenderer {
  readonly domElement = document.createElement("canvas");
  private ctx = this.domElement.getContext("2d")!;
  private width = 1;
  private height = 1;
  private ratio = 1;
  private frame = 0;
  private callback: ((time: number) => void) | null = null;
  constructor() { if (!this.ctx) throw new Error("Canvas unavailable"); }
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
    type Face = { p:T.Vector3[]; uv:T.Vector2[]; depth:number; color:string; image:CanvasImageSource|null; opacity:number };
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
        const color=material.color.clone().multiplyScalar(.62+.38*Math.max(0,normal.dot(light)));
        faces.push({p,uv:ids.map(id=>uv ? new T.Vector2().fromBufferAttribute(uv,id) : new T.Vector2()),depth:(p[0].z+p[1].z+p[2].z)/3,color:color.getStyle(),image:(material.map?.image as CanvasImageSource | undefined) ?? null,opacity:material.opacity});
      }
    });
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
  dispose(){ this.setAnimationLoop(null); }
}
