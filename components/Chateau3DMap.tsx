"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Minus, Plus, RotateCcw } from "lucide-react";

export type ChateauMapPlace = {
  id: string;
  ar: string;
  fr: string;
  open: boolean;
};

type Props = {
  places: ChateauMapPlace[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

type MapBuilding = {
  id: string;
  position: [number, number];
  scale: number;
  color: number;
  roof: number;
  style: "castle" | "civic" | "campus" | "market" | "tower" | "transport" | "stadium" | "nature" | "vehicles";
};

const BUILDINGS: MapBuilding[] = [
  { id: "palace", position: [0, -1], scale: 1.42, color: 0xd8c28b, roof: 0x425c48, style: "castle" },
  { id: "university", position: [-15, -13], scale: 1.05, color: 0xcdbb91, roof: 0x304d42, style: "campus" },
  { id: "library", position: [-7, -15], scale: 0.88, color: 0xb8a77c, roof: 0x594a38, style: "civic" },
  { id: "court", position: [9, -14], scale: 0.98, color: 0xd6c59c, roof: 0x4b4b44, style: "civic" },
  { id: "hospital", position: [17, -10], scale: 1.02, color: 0xe2dfd1, roof: 0x477462, style: "tower" },
  { id: "police", position: [18, -2], scale: 0.9, color: 0xb7c3c8, roof: 0x344f63, style: "civic" },
  { id: "market", position: [-18, -3], scale: 1.13, color: 0xd7b779, roof: 0x7f3d32, style: "market" },
  { id: "cafe", position: [-17, 5], scale: 0.82, color: 0xd0a978, roof: 0x6c4534, style: "market" },
  { id: "restaurant", position: [-10, 10], scale: 0.9, color: 0xd6b07e, roof: 0x734338, style: "market" },
  { id: "hotel", position: [-2, 14], scale: 1.08, color: 0xd8c7a4, roof: 0x536454, style: "tower" },
  { id: "zoo", position: [16, 13], scale: 1.15, color: 0xb5a16b, roof: 0x49623a, style: "nature" },
  { id: "stadium", position: [20, 5], scale: 1.2, color: 0xb7ad87, roof: 0x364e3d, style: "stadium" },
  { id: "station", position: [8, 17], scale: 1.08, color: 0xc3af81, roof: 0x3b4b4c, style: "transport" },
  { id: "vehicles", position: [18, 21], scale: 1.12, color: 0xb8b4a8, roof: 0x273f4a, style: "vehicles" },
  { id: "airport", position: [-13, 22], scale: 1.18, color: 0xc9cbc4, roof: 0x3c545c, style: "transport" }
];

const palette = {
  gold: 0xd5b86a,
  window: 0x9ad8cf,
  darkWindow: 0x345b5a,
  stone: 0xcab98e,
  wood: 0x5e3c29,
  greenery: [0x1f5b37, 0x2e7545, 0x487f43, 0x315d38]
};

const material = (color: number, roughness = 0.78, metalness = 0.04) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function shadow(mesh: THREE.Mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function box(
  width: number,
  height: number,
  depth: number,
  color: number,
  x = 0,
  y = height / 2,
  z = 0,
  roughness = 0.78
) {
  const mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, roughness)));
  mesh.position.set(x, y, z);
  return mesh;
}

function roof(width: number, depth: number, color: number, y: number) {
  const mesh = shadow(new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * 0.72, 1.55, 4), material(color, 0.7)));
  mesh.position.y = y;
  mesh.rotation.y = Math.PI / 4;
  mesh.scale.z = depth / width;
  return mesh;
}

function addWindows(group: THREE.Group, width: number, floors: number, frontZ: number, color = palette.window) {
  const windowMaterial = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18, roughness: 0.3 });
  for (let floor = 0; floor < floors; floor += 1) {
    for (const x of [-width * 0.27, 0, width * 0.27]) {
      const pane = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.54, 0.08), windowMaterial);
      pane.position.set(x, 1.05 + floor * 0.92, frontZ);
      group.add(pane);
    }
  }
}

function tower(color: number, roofColor: number, x: number, z: number, height = 4.8, radius = 1.15) {
  const group = new THREE.Group();
  const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 12), material(color)));
  body.position.y = height / 2;
  group.add(body);
  const crown = shadow(new THREE.Mesh(new THREE.ConeGeometry(radius * 1.35, 2.2, 12), material(roofColor, 0.68)));
  crown.position.y = height + 1;
  group.add(crown);
  group.position.set(x, 0, z);
  return group;
}

function createBuilding(spec: MapBuilding) {
  const root = new THREE.Group();
  root.userData.placeId = spec.id;
  root.position.set(spec.position[0], 0.3, spec.position[1]);
  root.scale.setScalar(spec.scale);

  const base = box(6.8, 0.42, 5.5, 0x8f8568, 0, 0.21, 0);
  root.add(base);

  if (spec.style === "castle") {
    const keep = box(6.2, 5.6, 4.7, spec.color, 0, 2.8, 0);
    root.add(keep);
    addWindows(root, 6, 4, 2.4, 0xf0d78c);
    for (const [x, z] of [[-3.2, -2.5], [3.2, -2.5], [-3.2, 2.5], [3.2, 2.5]] as [number, number][]) {
      root.add(tower(spec.color, spec.roof, x, z, 6.2, 1.25));
    }
    const gate = box(1.55, 2.65, 0.2, palette.wood, 0, 1.33, 2.47);
    root.add(gate);
    const spire = shadow(new THREE.Mesh(new THREE.ConeGeometry(2.3, 2.8, 8), material(spec.roof)));
    spire.position.y = 7;
    root.add(spire);
  } else if (spec.style === "stadium") {
    const bowl = shadow(new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 2, 40, 1, true), material(spec.color)));
    bowl.position.y = 1.3;
    root.add(bowl);
    const pitch = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.14, 2.7), material(0x2e8747));
    pitch.position.y = 0.46;
    root.add(pitch);
    for (const x of [-3.2, 3.2]) for (const z of [-2.4, 2.4]) {
      const mast = box(0.12, 5, 0.12, 0x828b86, x, 2.5, z);
      const light = box(0.75, 0.4, 0.16, 0xf3d98d, x, 5, z);
      root.add(mast, light);
    }
  } else if (spec.style === "nature") {
    const lodge = box(4.8, 2.4, 3.8, spec.color, 0, 1.2, 0);
    root.add(lodge, roof(5.1, 4.1, spec.roof, 3.25));
    const arch = shadow(new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.28, 10, 30, Math.PI), material(palette.stone)));
    arch.position.set(0, 1.25, 2.05);
    root.add(arch);
  } else if (spec.style === "vehicles") {
    const hangar = box(7.6, 3.2, 5.6, spec.color, 0, 1.6, 0);
    root.add(hangar);
    const hangarRoof = shadow(new THREE.Mesh(new THREE.CylinderGeometry(3.85, 3.85, 5.7, 28, 1, false, 0, Math.PI), material(spec.roof, 0.62)));
    hangarRoof.rotation.set(0, 0, Math.PI / 2);
    hangarRoof.position.y = 3.15;
    root.add(hangarRoof);
    for (const x of [-2.25, 0, 2.25]) root.add(box(1.75, 2.35, 0.18, 0x263c43, x, 1.28, 2.89, 0.45));
    const sign = box(4.6, 0.5, 0.18, palette.gold, 0, 3.45, 2.96, 0.45);
    root.add(sign);
    for (const x of [-2.1, 2.1]) {
      const wheel = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18), material(0x151a19)));
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.58, -3.2);
      root.add(wheel);
    }
  } else if (spec.style === "transport") {
    const main = box(7.2, 3.4, 4.8, spec.color, 0, 1.7, 0);
    root.add(main, roof(7.4, 5, spec.roof, 4.2));
    addWindows(root, 6.8, 2, 2.44);
    const clock = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.14, 24), material(0xe3cf91)));
    clock.rotation.x = Math.PI / 2;
    clock.position.set(0, 3.15, 2.47);
    root.add(clock);
  } else {
    const height = spec.style === "tower" ? 5.2 : spec.style === "campus" ? 3.7 : 3.2;
    const width = spec.style === "campus" ? 7.4 : 6.2;
    const main = box(width, height, 4.6, spec.color, 0, height / 2, 0);
    root.add(main, roof(width + 0.25, 4.9, spec.roof, height + 0.85));
    addWindows(root, width, Math.max(2, Math.floor(height - 0.7)), 2.34);
    if (spec.style === "civic" || spec.style === "campus") {
      for (const x of [-2.1, -0.7, 0.7, 2.1]) root.add(box(0.28, 2.7, 0.28, 0xe0d1a9, x, 1.35, 2.55));
      root.add(box(5.4, 0.35, 0.85, palette.gold, 0, 2.8, 2.52));
    }
    if (spec.style === "market") {
      for (const x of [-2.2, 0, 2.2]) {
        const awning = box(1.7, 0.16, 0.8, 0xe6d5a3, x, 1.55, 2.65);
        awning.rotation.x = -0.2;
        root.add(awning);
      }
    }
  }

  root.traverse((child) => {
    child.userData.placeId = spec.id;
  });
  return root;
}

function createTree(x: number, z: number, scale = 1) {
  const group = new THREE.Group();
  const trunk = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 1.25, 8), material(0x64432b)));
  trunk.position.y = 0.65;
  const crown = shadow(new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), material(palette.greenery[Math.abs(Math.round(x * 7 + z * 3)) % palette.greenery.length])));
  crown.position.y = 1.65;
  group.add(trunk, crown);
  group.position.set(x, 0.15, z);
  group.scale.setScalar(scale);
  return group;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(72, 56, 72, 56);
  const positions = geometry.attributes.position;
  const colors: number[] = [];
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getY(i);
    const ridge = 3.2 * Math.exp(-((x - 25) ** 2) / 150 - ((z + 20) ** 2) / 55);
    const hills = 1.5 * Math.exp(-((x + 28) ** 2) / 180 - ((z + 17) ** 2) / 100);
    const coast = -1.4 * Math.exp(-((x + 31) ** 2) / 50 - ((z - 15) ** 2) / 300);
    const detail = Math.sin(x * 0.55) * Math.cos(z * 0.44) * 0.18 + Math.sin((x + z) * 0.8) * 0.09;
    const height = 0.25 + ridge + hills + coast + detail;
    positions.setZ(i, height);
    if (height > 2.6) color.set(0x647357);
    else if (height > 1.2) color.set(0x426943);
    else if (x < -25 && z > 5) color.set(0x9d9a69);
    else if (z > 13) color.set(0x47734a);
    else color.set(i % 3 === 0 ? 0x467344 : 0x3f6b3f);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96 }));
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  return terrain;
}

export default function Chateau3DMap({ places, selectedId, onSelect }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const focusRef = useRef<{ target: THREE.Vector3; camera: THREE.Vector3; progress: number } | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelect);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9eb7aa);
    scene.fog = new THREE.FogExp2(0x9eb7aa, 0.012);
    sceneRef.current = scene;

    const compactView = mount.clientWidth < 700;
    const camera = new THREE.PerspectiveCamera(compactView ? 48 : 42, mount.clientWidth / mount.clientHeight, 0.1, 180);
    camera.position.set(compactView ? 45 : 29, compactView ? 48 : 34, compactView ? 61 : 41);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.target.set(0, 0, 1);
    controls.minDistance = 18;
    controls.maxDistance = 75;
    controls.minPolarAngle = 0.48;
    controls.maxPolarAngle = 1.25;
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    controls.maxTargetRadius = 20;
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight(0xdce8df, 0x31412f, 2.2));
    const sun = new THREE.DirectionalLight(0xffedc1, 3.8);
    sun.position.set(-24, 42, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -42;
    sun.shadow.camera.right = 42;
    sun.shadow.camera.top = 38;
    sun.shadow.camera.bottom = -38;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    scene.add(createTerrain());

    const water = new THREE.Mesh(
      new THREE.CircleGeometry(8.2, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x2f8790, roughness: 0.22, metalness: 0.08, transmission: 0.08, transparent: true, opacity: 0.9 })
    );
    water.rotation.x = -Math.PI / 2;
    water.scale.set(1.75, 0.72, 1);
    water.position.set(-28, -0.05, 15);
    scene.add(water);

    const courtyard = new THREE.Mesh(new THREE.CylinderGeometry(10.8, 11.5, 0.34, 64), material(0x9a926d));
    courtyard.position.set(0, 0.34, -1);
    courtyard.receiveShadow = true;
    scene.add(courtyard);

    for (const spec of BUILDINGS) scene.add(createBuilding(spec));

    const treePositions: [number, number, number][] = [];
    for (let i = 0; i < 92; i += 1) {
      const angle = i * 2.399;
      const radius = 12 + (i % 12) * 1.85;
      const x = Math.cos(angle) * radius + (i % 5) * 0.33;
      const z = Math.sin(angle) * radius + ((i * 3) % 7) * 0.25;
      if (BUILDINGS.some((building) => Math.hypot(x - building.position[0], z - building.position[1]) < 5.2)) continue;
      if (x < -22 && z > 7) continue;
      treePositions.push([x, z, 0.75 + (i % 5) * 0.08]);
    }
    treePositions.forEach(([x, z, scale]) => scene.add(createTree(x, z, scale)));

    for (let i = 0; i < 15; i += 1) {
      const mountain = shadow(new THREE.Mesh(new THREE.ConeGeometry(2.2 + (i % 3) * 0.65, 5.2 + (i % 4), 7), material(i % 2 ? 0x596553 : 0x687260)));
      mountain.position.set(21 + (i % 5) * 4.2, 2.5, -26 + Math.floor(i / 5) * 4.2);
      mountain.rotation.y = i * 0.6;
      scene.add(mountain);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown = { x: 0, y: 0 };
    const findPlace = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        let object: THREE.Object3D | null = hit.object;
        while (object) {
          if (typeof object.userData.placeId === "string") return object.userData.placeId as string;
          object = object.parent;
        }
      }
      return null;
    };

    const onPointerMove = (event: PointerEvent) => {
      const id = findPlace(event);
      if (id === hoveredRef.current) return;
      hoveredRef.current = id;
      setHovered(id);
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
    };
    const onPointerDown = (event: PointerEvent) => { pointerDown = { x: event.clientX, y: event.clientY }; };
    const onPointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 7) return;
      const id = findPlace(event);
      if (id) onSelectRef.current(id);
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const resize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const startedAt = performance.now();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startedAt) / 1000;
      water.position.y = -0.03 + Math.sin(elapsed * 0.85) * 0.035;
      if (focusRef.current) {
        const focus = focusRef.current;
        focus.progress = Math.min(1, focus.progress + 0.035);
        const eased = 1 - Math.pow(1 - focus.progress, 3);
        controls.target.lerp(focus.target, eased * 0.12);
        camera.position.lerp(focus.camera, eased * 0.1);
        if (focus.progress >= 1 && camera.position.distanceTo(focus.camera) < 0.18) focusRef.current = null;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    setReady(true);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedId || !cameraRef.current || !controlsRef.current) return;
    const spec = BUILDINGS.find((building) => building.id === selectedId);
    if (!spec) return;
    const target = new THREE.Vector3(spec.position[0], 2, spec.position[1]);
    const camera = new THREE.Vector3(spec.position[0] + 11, 12, spec.position[1] + 14);
    focusRef.current = { target, camera, progress: 0 };
  }, [selectedId]);

  const zoom = (direction: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const vector = camera.position.clone().sub(controls.target).multiplyScalar(direction);
    camera.position.copy(controls.target.clone().add(vector));
    controls.update();
  };

  const reset = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    focusRef.current = null;
    const compactView = (mountRef.current?.clientWidth || 900) < 700;
    cameraRef.current.position.set(compactView ? 45 : 29, compactView ? 48 : 34, compactView ? 61 : 41);
    controlsRef.current.target.set(0, 0, 1);
    controlsRef.current.update();
  };

  const hoveredPlace = places.find((place) => place.id === hovered);

  return (
    <div
      className="chateau-3d-stage"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerMove={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <div ref={mountRef} className="chateau-3d-canvas" aria-label="خريطة القلعة ثلاثية الأبعاد" />
      {!ready && <div className="chateau-3d-loading"><span /><strong>جارٍ بناء القلعة ثلاثية الأبعاد</strong></div>}
      <div className="chateau-3d-atmosphere" aria-hidden="true" />
      <div className="chateau-3d-zones" aria-hidden="true">
        <span className="zone-education">حي التعليم والثقافة</span>
        <span className="zone-services">حي الخدمات</span>
        <span className="zone-life">حي الحياة اليومية</span>
        <span className="zone-transport">حي النقل والآليات</span>
      </div>
      {hoveredPlace && (
        <div className="chateau-3d-tooltip">
          <strong>{hoveredPlace.ar}</strong>
          <span>{hoveredPlace.fr}</span>
          <small>{hoveredPlace.open ? "اضغط لاكتشاف المبنى" : "قريبًا"}</small>
        </div>
      )}
      <div className="chateau-3d-controls">
        <button type="button" onClick={() => zoom(0.82)} aria-label="تقريب"><Plus /></button>
        <button type="button" onClick={() => zoom(1.2)} aria-label="إبعاد"><Minus /></button>
        <button type="button" onClick={reset} aria-label="إعادة ضبط المشهد"><RotateCcw /></button>
      </div>
      <div className="chateau-3d-quality"><i /> 3D مباشر <span>WebGL</span></div>
    </div>
  );
}
