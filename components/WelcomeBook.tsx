"use client";

import { useEffect, useRef, useState } from "react";

/** A real, closed volume: independent covers, spine and ivory page block. */
export default function WelcomeBook() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [software, setSoftware] = useState(false);
  useEffect(() => {
    let disposed = false;
    let destroy: (() => void) | undefined;
    void Promise.all([
      import("three"),
      import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
      import("@/lib/BookCanvasRenderer"),
    ]).then(([T, { RoundedBoxGeometry }, { RoomEnvironment }, { BookCanvasRenderer }]) => {
      if (disposed || !host.current) return;
      const container = host.current;
      let renderer: InstanceType<typeof T.WebGLRenderer> | InstanceType<typeof BookCanvasRenderer>;
      try {
        if (software) throw new Error("Use CPU renderer");
        renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "default" });
      } catch { renderer = new BookCanvasRenderer(window.matchMedia("(hover: hover) and (pointer: fine)").matches); }
      const gpu = renderer instanceof T.WebGLRenderer;
      const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      if (renderer instanceof T.WebGLRenderer) {
        renderer.setClearColor(0, 0);
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
      }
      container.dataset.renderer = gpu ? "webgl" : "canvas";
      container.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block;pointer-events:none";
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, .1, 30);
      camera.position.set(0, .3, 7.7);
      camera.lookAt(0, 0, 0);
      let env: { texture: InstanceType<typeof T.Texture>; dispose: () => void } | undefined;
      if (renderer instanceof T.WebGLRenderer) {
        const environment = new RoomEnvironment();
        const pmrem = new T.PMREMGenerator(renderer);
        try { env = pmrem.fromScene(environment, .04); scene.environment = env.texture; }
        catch { /* Direct lights still illuminate the book without an environment map. */ }
        finally { environment.dispose(); pmrem.dispose(); }
      }
      scene.add(new T.HemisphereLight(0xffedcf, 0x172e23, 2));
      const key = new T.DirectionalLight(0xffdeb2, 4); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new T.DirectionalLight(0xf8d998, 2); rim.position.set(4, 1, -3); scene.add(rim);
      const book = new T.Group(); scene.add(book);
      // Deterministic fine leather grain, used as surface relief, not a flat book image.
      const grain = new Uint8Array(128 * 128 * 4);
      let seed = 913;
      for (let i = 0; i < grain.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const value = 90 + (seed % 120);
        grain[i] = grain[i + 1] = grain[i + 2] = value; grain[i + 3] = 255;
      }
      const texture = new T.DataTexture(grain, 128, 128);
      texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(3, 4); texture.needsUpdate = true;
      const leather = new T.MeshStandardMaterial({ color: desktop ? 0xb78454 : 0x593019, roughness: .72, bumpMap: texture, bumpScale: .022 });
      const spineLeather = new T.MeshStandardMaterial({ color: desktop ? 0x93633e : 0x3b1d10, roughness: .67, bumpMap: texture, bumpScale: .018 });
      const gold = new T.MeshStandardMaterial({ color: 0xc49a4b, metalness: .78, roughness: .35 });
      const paper = new T.MeshStandardMaterial({ color: 0xddc59a, roughness: .92 });
      const pageLine = new T.MeshStandardMaterial({ color: 0xb49a70, roughness: 1 });
      const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: InstanceType<typeof T.Material>, radius = .018) => {
        const mesh = new T.Mesh(gpu ? new RoundedBoxGeometry(w, h, d, 2, radius) : new T.BoxGeometry(w,h,d), material);
        mesh.position.set(x,y,z); book.add(mesh); return mesh;
      };
      box(1.95, 2.75, .49, .035, 0, 0, paper);
      box(2.16, 2.96, .105, 0, 0, .30, leather, .035);
      box(2.16, 2.96, .105, 0, 0, -.30, leather, .035);
      box(.20, 2.95, .69, -1.025, 0, 0, spineLeather, .065);
      for (let i = 0; i < 30; i++) {
        const z = -.235 + i * .016;
        box(.006, 2.70, .0025, 1.009, 0, z, pageLine, .001);
        box(1.90, .004, .0025, .045, 1.376, z, pageLine, .001);
        box(1.90, .004, .0025, .045, -1.376, z, pageLine, .001);
      }
      for (const y of [-1.17, -.73, .73, 1.17]) {
        box(.235, .074, .715, -1.025, y, 0, leather, .028);
        box(.244, .012, .724, -1.025, y, 0, gold, .005);
      }
      // Embossed gilt frames and corner ornaments on both covers.
      for (const z of [-.359, .359]) {
        for (const inset of [0, .065]) {
          for (const x of [-.89 + inset, .89 - inset]) box(.014, 2.52 - inset * 2, .012, x, 0, z, gold, .004);
          for (const y of [-1.26 + inset, 1.26 - inset]) box(1.79 - inset * 2, .014, .012, 0, y, z, gold, .004);
        }
        for (const x of [-.78, .78]) for (const y of [-1.14, 1.14]) {
          const ornament = box(.10, .10, .014, x, y, z, gold, .012); ornament.rotation.z = Math.PI / 4;
        }
        if (!desktop) {
          const emblem = new T.Mesh(new T.TorusGeometry(.32, .009, 6, 48), gold);
          emblem.position.set(0, .22, z); book.add(emblem);
        }
      }
      const titleCanvas = document.createElement("canvas"); titleCanvas.width = 1024; titleCanvas.height = 512;
      const ctx = titleCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#10294d"; ctx.textAlign = "center";
        ctx.font = "bold 100px Georgia"; ctx.fillText("LE CHÂTEAU",512,190);
        ctx.font = "bold 70px Georgia"; ctx.fillText("DES LANGUES",512,300);
      }
      const titleTexture = new T.CanvasTexture(titleCanvas); titleTexture.colorSpace = T.SRGBColorSpace;
      const titleMaterial = new T.MeshBasicMaterial({ map: titleTexture, transparent: true, depthWrite: false });
      for (const side of [1, -1]) {
        const title = new T.Mesh(new T.PlaneGeometry(1.65,.825), titleMaterial);
        title.position.set(0,-.61,side * .374);
        title.rotation.y = side === 1 ? 0 : Math.PI;
        book.add(title);
      }
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width,height,false); camera.aspect = width/height; camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize); observer.observe(container); resize();
      let angle = -.35, last = 0;
      let pointer: number | null = null, previousX = 0, resumeAt = 0;
      const beginDrag = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0) return;
        pointer = event.pointerId; previousX = event.clientX;
        container.setPointerCapture(event.pointerId);
        container.style.cursor = "grabbing";
      };
      const drag = (event: PointerEvent) => {
        if (pointer !== event.pointerId) return;
        const width = Math.max(container.clientWidth, 1);
        angle += (event.clientX - previousX) / width * Math.PI * 2;
        previousX = event.clientX;
        book.rotation.set(.08, angle, -.07);
        renderer.render(scene,camera);
      };
      const endDrag = (event: PointerEvent) => {
        if (pointer !== event.pointerId) return;
        pointer = null; resumeAt = performance.now() + 350;
        container.style.cursor = "grab";
        if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
      };
      const keyTurn = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        angle += (event.key === "ArrowRight" ? 1 : -1) * Math.PI / 8;
        resumeAt = performance.now() + 350;
      };
      container.addEventListener("pointerdown",beginDrag);
      container.addEventListener("pointermove",drag);
      container.addEventListener("pointerup",endDrag);
      container.addEventListener("pointercancel",endDrag);
      container.addEventListener("lostpointercapture",endDrag);
      container.addEventListener("keydown",keyTurn);
      renderer.setAnimationLoop((time: number) => {
        const delta = last ? Math.min((time-last)/1000,.05) : 0; last = time;
        if (document.hidden) return;
        if (pointer === null && performance.now() >= resumeAt) angle += delta * Math.PI * 2 / 18;
        book.rotation.set(.08, angle, -.07);
        renderer.render(scene,camera);
      });
      setReady(true);
      const lost = (event: Event) => { event.preventDefault(); setReady(false); renderer.setAnimationLoop(null); setSoftware(true); };
      renderer.domElement.addEventListener("webglcontextlost",lost);
      destroy = () => {
        renderer.setAnimationLoop(null); observer.disconnect();
        container.removeEventListener("pointerdown",beginDrag);
        container.removeEventListener("pointermove",drag);
        container.removeEventListener("pointerup",endDrag);
        container.removeEventListener("pointercancel",endDrag);
        container.removeEventListener("lostpointercapture",endDrag);
        container.removeEventListener("keydown",keyTurn);
        renderer.domElement.removeEventListener("webglcontextlost",lost);
        book.traverse(object => { if (object instanceof T.Mesh) object.geometry.dispose(); });
        [leather,spineLeather,gold,paper,pageLine,titleMaterial].forEach(material => material.dispose());
        texture.dispose(); titleTexture.dispose(); env?.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { /* Keep the static fallback if graphics cannot initialize. */ });
    return () => { disposed = true; destroy?.(); };
  }, [software]);
  return <div style={{ position:"absolute", inset:0 }}>
    <div ref={host} role="group" aria-label="كتاب بني عتيق: اسحب يمينًا ويسارًا لتدويره، أو استخدم سهمي لوحة المفاتيح" tabIndex={ready ? 0 : -1} style={{ position:"absolute", inset:0, opacity:ready ? 1 : 0, cursor:"grab", touchAction:"pan-y", userSelect:"none" }} />
    {!ready && <img src="/kingdom-portal-assets/open-book-realistic-v1.webp" alt="" style={{ width:"100%",height:"100%",objectFit:"contain" }} />}
  </div>;
}
