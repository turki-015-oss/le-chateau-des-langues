"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
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
  { id: "palace", position: [0, -1], scale: 1.18, color: 0xd8c28b, roof: 0x425c48, style: "castle" },
  { id: "university", position: [-15, -13], scale: 0.92, color: 0xcdbb91, roof: 0x304d42, style: "campus" },
  { id: "library", position: [-7, -15], scale: 0.78, color: 0xb8a77c, roof: 0x594a38, style: "civic" },
  { id: "court", position: [9, -14], scale: 0.86, color: 0xd6c59c, roof: 0x4b4b44, style: "civic" },
  { id: "hospital", position: [17, -10], scale: 0.88, color: 0xe2dfd1, roof: 0x477462, style: "tower" },
  { id: "police", position: [18, -2], scale: 0.78, color: 0xb7c3c8, roof: 0x344f63, style: "civic" },
  { id: "market", position: [-18, -3], scale: 0.98, color: 0xd7b779, roof: 0x7f3d32, style: "market" },
  { id: "cafe", position: [-17, 5], scale: 0.72, color: 0xd0a978, roof: 0x6c4534, style: "market" },
  { id: "restaurant", position: [-10, 10], scale: 0.78, color: 0xd6b07e, roof: 0x734338, style: "market" },
  { id: "hotel", position: [-2, 14], scale: 0.94, color: 0xd8c7a4, roof: 0x536454, style: "tower" },
  { id: "zoo", position: [16, 13], scale: 0.98, color: 0xb5a16b, roof: 0x49623a, style: "nature" },
  { id: "stadium", position: [20, 5], scale: 1.02, color: 0xb7ad87, roof: 0x364e3d, style: "stadium" },
  { id: "station", position: [8, 17], scale: 0.94, color: 0xc3af81, roof: 0x3b4b4c, style: "transport" },
  { id: "vehicles", position: [18, 21], scale: 0.96, color: 0xb8b4a8, roof: 0x273f4a, style: "vehicles" },
  { id: "airport", position: [-13, 22], scale: 1.0, color: 0xc9cbc4, roof: 0x3c545c, style: "transport" }
];

const palette = {
  gold: 0xd5b86a,
  window: 0x9ad8cf,
  darkWindow: 0x345b5a,
  stone: 0xcab98e,
  wood: 0x5e3c29,
  greenery: [0x1f5b37, 0x2e7545, 0x487f43, 0x315d38]
};

const wallColors = new Set(BUILDINGS.map((building) => building.color));
const roofColors = new Set(BUILDINGS.map((building) => building.roof));
let surfaceTextures: { stone: THREE.Texture; slate: THREE.Texture; meadow: THREE.Texture; facadeChateau: THREE.Texture; facadeCivic: THREE.Texture } | null = null;

const material = (color: number, roughness = 0.78, metalness = 0.04) => {
  const baseColor = new THREE.Color(color);
  let map: THREE.Texture | undefined;
  if (surfaceTextures && wallColors.has(color)) {
    map = surfaceTextures.stone;
    baseColor.lerp(new THREE.Color(0xf4ead1), 0.28);
    roughness = 0.88;
  } else if (surfaceTextures && roofColors.has(color)) {
    map = surfaceTextures.slate;
    baseColor.lerp(new THREE.Color(0xffffff), 0.08);
    roughness = 0.72;
  }
  return new THREE.MeshStandardMaterial({ color: baseColor, map, roughness, metalness });
};

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
  const radius = Math.min(0.09, width * 0.025, depth * 0.025);
  const mesh = shadow(new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 3, radius), material(color, roughness)));
  mesh.position.set(x, y, z);
  return mesh;
}

function roof(width: number, depth: number, color: number, y: number) {
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const inset = Math.min(width, depth) * 0.23;
  const roofHeight = Math.min(width, depth) * 0.34;
  const vertices = new Float32Array([
    -halfWidth, 0, -halfDepth, halfWidth, 0, -halfDepth, halfWidth, 0, halfDepth, -halfWidth, 0, halfDepth,
    -halfWidth + inset, roofHeight, -halfDepth + inset, halfWidth - inset, roofHeight, -halfDepth + inset,
    halfWidth - inset, roofHeight, halfDepth - inset, -halfWidth + inset, roofHeight, halfDepth - inset,
    -halfWidth + inset, roofHeight + 0.34, 0, halfWidth - inset, roofHeight + 0.34, 0
  ]);
  const indices = [
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    4, 5, 9, 4, 9, 8,
    5, 6, 9,
    6, 7, 8, 6, 8, 9,
    7, 4, 8
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute([
    0, 0, 1, 0, 1, 1, 0, 1,
    0.18, 0.18, 0.82, 0.18, 0.82, 0.82, 0.18, 0.82,
    0.18, 0.5, 0.82, 0.5
  ], 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const roofMaterial = material(color, 0.65);
  roofMaterial.side = THREE.DoubleSide;
  const mesh = shadow(new THREE.Mesh(geometry, roofMaterial));
  mesh.position.y = y;
  return mesh;
}

function addWindows(group: THREE.Group, width: number, floors: number, frontZ: number, color = 0xf2bd68) {
  const windowMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd6b477, emissive: color, emissiveIntensity: 0.42, roughness: 0.16, metalness: 0.08, transparent: true, opacity: 0.9 });
  const frameMaterial = material(0xd3c49f, 0.82);
  const columns = width > 6.5 ? 5 : 4;
  for (let floor = 0; floor < floors; floor += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = -width * 0.34 + (column / (columns - 1)) * width * 0.68;
      if (floor === 0 && Math.abs(x) < 0.7) continue;
      const pane = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.64, 0.08, 2, 0.035), windowMaterial);
      pane.position.set(x, 1.05 + floor * 0.92, frontZ);
      group.add(pane);
      const sill = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.08, 0.14, 2, 0.025), frameMaterial);
      sill.position.set(x, 0.69 + floor * 0.92, frontZ + 0.02);
      const lintel = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.09, 0.14, 2, 0.025), frameMaterial);
      lintel.position.set(x, 1.42 + floor * 0.92, frontZ + 0.02);
      const centerBar = new THREE.Mesh(new RoundedBoxGeometry(0.045, 0.62, 0.1, 2, 0.012), frameMaterial);
      centerBar.position.set(x, 1.05 + floor * 0.92, frontZ + 0.055);
      group.add(sill, lintel, centerBar);
    }
  }
}

function tower(color: number, roofColor: number, x: number, z: number, height = 4.8, radius = 1.15) {
  const group = new THREE.Group();
  const body = shadow(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 12), material(color)));
  body.position.y = height / 2;
  group.add(body);
  for (const bandY of [1.15, 2.65, height - 0.45]) {
    const band = shadow(new THREE.Mesh(new THREE.TorusGeometry(radius * 1.025, 0.075, 8, 32), material(0xc4b58e, 0.9)));
    band.rotation.x = Math.PI / 2;
    band.position.y = bandY;
    group.add(band);
  }
  const towerGlass = new THREE.MeshStandardMaterial({ color: 0xd5ae67, emissive: 0xf1b95e, emissiveIntensity: 0.45, roughness: 0.18 });
  for (let floor = 0; floor < 3; floor += 1) {
    for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
      const pane = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.48, 0.06, 2, 0.025), towerGlass);
      pane.position.set(Math.sin(angle) * (radius + 0.015), 1.1 + floor * 1.15, Math.cos(angle) * (radius + 0.015));
      pane.rotation.y = angle;
      group.add(pane);
    }
  }
  const crown = shadow(new THREE.Mesh(new THREE.ConeGeometry(radius * 1.35, 2.2, 12), material(roofColor, 0.68)));
  crown.position.y = height + 1;
  group.add(crown);
  group.position.set(x, 0, z);
  return group;
}

function dormer(color: number, roofColor: number, x: number, y: number, z: number) {
  const group = new THREE.Group();
  group.add(box(0.62, 0.72, 0.5, color, 0, 0.36, 0));
  const dormerRoof = roof(0.78, 0.72, roofColor, 0.94);
  dormerRoof.scale.y = 0.55;
  group.add(dormerRoof);
  const glass = box(0.3, 0.36, 0.08, 0x667d7c, 0, 0.4, 0.29, 0.18);
  group.add(glass);
  group.position.set(x, y, z);
  return group;
}

function createPediment(width: number, height: number, depth: number, color: number, x: number, y: number, z: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(0, height);
  shape.lineTo(width / 2, 0);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.055, bevelSegments: 2 });
  geometry.center();
  const pediment = shadow(new THREE.Mesh(geometry, material(color, 0.84)));
  pediment.position.set(x, y + height / 2, z);
  return pediment;
}

function createBalustrade(width: number, x: number, y: number, z: number) {
  const group = new THREE.Group();
  const stone = material(0xc9bb96, 0.86);
  const rail = new THREE.Mesh(new RoundedBoxGeometry(width, 0.1, 0.16, 2, 0.025), stone);
  rail.position.set(x, y + 0.48, z);
  group.add(rail);
  for (let offset = -width / 2 + 0.18; offset <= width / 2 - 0.18; offset += 0.34) {
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.46, 8), stone);
    spindle.position.set(x + offset, y + 0.23, z);
    group.add(spindle);
  }
  return group;
}

function createFacadePanel(texture: THREE.Texture | undefined, width: number, height: number, x: number, y: number, z: number) {
  if (!texture) return new THREE.Group();
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({ map: texture, color: 0xffffff, roughness: 0.74, metalness: 0.02, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
  );
  panel.position.set(x, y, z);
  panel.castShadow = false;
  panel.receiveShadow = true;
  return panel;
}

function addArchitecturalFront(group: THREE.Group, width: number, height: number, frontZ: number, wallColor: number, roofColor: number) {
  group.add(box(width + 0.28, 0.18, 0.42, 0xb9aa83, 0, height - 0.08, frontZ + 0.08));
  group.add(box(1.05, 1.75, 0.16, 0x493325, 0, 0.88, frontZ + 0.18, 0.7));
  const arch = shadow(new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.1, 12, 32, Math.PI), material(0xc8b78c)));
  arch.position.set(0, 1.7, frontZ + 0.21);
  group.add(arch);
  for (let step = 0; step < 3; step += 1) {
    group.add(box(1.8 + step * 0.34, 0.12, 0.52, 0xa79c7d, 0, 0.06 + step * 0.08, frontZ + 0.5 + step * 0.2));
  }
  for (const x of [-width * 0.27, width * 0.27]) {
    group.add(dormer(wallColor, roofColor, x, height + 0.35, 0.55));
  }
  for (const x of [-width * 0.36, width * 0.36]) {
    group.add(box(0.32, 1.35, 0.38, 0x9b8d6d, x, height + 0.62, -0.75));
    group.add(box(0.44, 0.12, 0.5, 0xb9aa83, x, height + 1.3, -0.75));
  }
  group.add(createPediment(Math.min(3.25, width * 0.52), 0.92, 0.22, 0xcabb95, 0, height + 0.38, frontZ + 0.02));
  group.add(createBalustrade(Math.min(3.6, width * 0.56), 0, height - 0.15, frontZ + 0.36));
}

function createDriveway(points: [number, number][], color = 0xa99b77) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0.48, z)), false, "catmullrom", 0.55);
  const group = new THREE.Group();
  const samples = curve.getPoints(96);
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  samples.forEach((point, index) => {
    const previous = samples[Math.max(0, index - 1)];
    const next = samples[Math.min(samples.length - 1, index + 1)];
    const tangent = next.clone().sub(previous).normalize();
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(1.02);
    vertices.push(point.x + side.x, 0.65, point.z + side.z, point.x - side.x, 0.65, point.z - side.z);
    uvs.push(0, index / 8, 1, index / 8);
    if (index < samples.length - 1) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  });
  const roadGeometry = new THREE.BufferGeometry();
  roadGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  roadGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  roadGeometry.setIndex(indices);
  roadGeometry.computeVertexNormals();
  const road = new THREE.Mesh(roadGeometry, material(color, 0.92));
  road.receiveShadow = true;
  group.add(road);
  const glowMaterial = new THREE.MeshStandardMaterial({ color: 0xffd47a, emissive: 0xffb542, emissiveIntensity: 1.25, roughness: 0.35 });
  for (let i = 3; i < 48; i += 5) {
    const point = curve.getPoint(i / 48);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), glowMaterial);
    lamp.position.set(point.x, 0.75, point.z);
    group.add(lamp);
  }
  return group;
}

function createFormalGarden() {
  const group = new THREE.Group();
  const hedgeMaterial = material(0x244d2d, 0.98);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i += 1) {
      const hedge = shadow(new THREE.Mesh(new RoundedBoxGeometry(2.4, 0.48, 0.5, 3, 0.14), hedgeMaterial));
      hedge.position.set(side * (4.7 + i * 1.08), 0.55, 6.1 + i * 0.38);
      hedge.rotation.y = side * (0.18 + i * 0.02);
      group.add(hedge);
    }
  }
  const basin = shadow(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.45, 0.45, 48), material(0xb8aa85, 0.9)));
  basin.position.set(0, 0.38, 7.8);
  group.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.08, 48), new THREE.MeshPhysicalMaterial({ color: 0x3d8790, roughness: 0.12, metalness: 0.06, transparent: true, opacity: 0.9 }));
  water.position.set(0, 0.63, 7.8);
  group.add(water);
  const fountain = box(0.18, 1.6, 0.18, 0xd0c19c, 0, 1.32, 7.8);
  group.add(fountain);
  const flowerColors = [0xb65d76, 0x9b6aac, 0xe6c17b];
  for (let ring = 0; ring < 3; ring += 1) {
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2 + ring * 0.18;
      const radius = 3.2 + ring * 1.15;
      const flower = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.24 + ring * 0.035, 12, 8), material(flowerColors[(index + ring) % flowerColors.length], 0.9)));
      flower.position.set(Math.cos(angle) * radius, 0.52, 7.8 + Math.sin(angle) * radius * 0.56);
      group.add(flower);
    }
  }
  for (const side of [-1, 1]) {
    for (let row = 0; row < 5; row += 1) {
      const tree = createTree(side * (6.6 + row * 1.28), 11.8 + row * 0.18, 0.52 + (row % 2) * 0.06);
      group.add(tree);
    }
  }
  return group;
}

function createReflectingPool(x: number, z: number, width: number, depth: number) {
  const group = new THREE.Group();
  const border = shadow(new THREE.Mesh(new RoundedBoxGeometry(width + 0.65, 0.24, depth + 0.65, 4, 0.22), material(0xbeb391, 0.88)));
  border.position.set(x, 0.43, z);
  group.add(border);
  const water = new THREE.Mesh(
    new RoundedBoxGeometry(width, 0.12, depth, 5, 0.26),
    new THREE.MeshPhysicalMaterial({ color: 0x427f80, emissive: 0x163d40, emissiveIntensity: 0.14, roughness: 0.08, metalness: 0.12, transmission: 0.12, transparent: true, opacity: 0.94 })
  );
  water.position.set(x, 0.61, z);
  group.add(water);
  return group;
}

function createSky() {
  const geometry = new THREE.SphereGeometry(130, 48, 28);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x4f7180) },
      horizonColor: { value: new THREE.Color(0xd9ad6c) },
      bottomColor: { value: new THREE.Color(0x849171) }
    },
    vertexShader: "varying vec3 vWorldPosition; void main(){ vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 bottomColor; varying vec3 vWorldPosition; void main(){ float h = normalize(vWorldPosition).y; vec3 color = h > 0.0 ? mix(horizonColor, topColor, smoothstep(0.0, 0.72, h)) : mix(horizonColor, bottomColor, smoothstep(0.0, -0.35, h)); gl_FragColor = vec4(color, 1.0); }"
  });
  return new THREE.Mesh(geometry, material);
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
    root.add(createFacadePanel(surfaceTextures?.facadeChateau, 5.92, 5.18, 0, 2.86, 2.405));
    addWindows(root, 6, 4, 2.4, 0xf0d78c);
    root.add(createPediment(3.9, 1.22, 0.3, 0xcdbf9b, 0, 5.72, 2.48));
    root.add(createBalustrade(3.4, 0, 3.25, 2.72));
    for (const x of [-2.46, 2.46]) {
      for (let level = 0; level < 4; level += 1) {
        root.add(box(0.26, 0.28, 0.28, 0xe0d2ad, x, 0.32 + level * 1.55, 2.48));
      }
    }
    for (const [x, z] of [[-3.2, -2.5], [3.2, -2.5], [-3.2, 2.5], [3.2, 2.5]] as [number, number][]) {
      root.add(tower(spec.color, spec.roof, x, z, 6.2, 1.25));
    }
    const gate = box(1.55, 2.65, 0.2, palette.wood, 0, 1.33, 2.47);
    root.add(gate);
    const keepRoof = roof(6.65, 5.15, spec.roof, 5.55);
    root.add(keepRoof);
    for (const side of [-1, 1]) {
      root.add(box(4.6, 3.6, 3.4, spec.color, side * 5.05, 1.8, 0.35));
      const wingRoof = roof(4.85, 3.7, spec.roof, 4.45);
      wingRoof.position.x = side * 5.05;
      root.add(wingRoof);
      for (let floor = 0; floor < 3; floor += 1) {
        for (const offset of [-0.92, 0, 0.92]) {
          root.add(box(0.34, 0.5, 0.08, 0x718987, side * 5.05 + offset, 0.95 + floor * 0.86, 2.08, 0.18));
        }
      }
      root.add(tower(spec.color, spec.roof, side * 7.05, 0.3, 4.7, 0.82));
      root.add(createPediment(2.5, 0.72, 0.2, 0xc8ba95, side * 5.05, 3.88, 2.08));
      root.add(createBalustrade(2.5, side * 5.05, 2.65, 2.26));
    }
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
    const hangarRoof = roof(7.9, 5.9, spec.roof, 4.15);
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
    const main = box(7.6, 2.25, 5.4, spec.color, 0, 1.13, 0);
    root.add(main);
    const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8eb8b3, roughness: 0.12, metalness: 0.12, transmission: 0.42, transparent: true, opacity: 0.68, envMapIntensity: 1.35, side: THREE.DoubleSide });
    const vault = shadow(new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 7.25, 36, 1, true, 0, Math.PI), glassMaterial));
    vault.rotation.z = Math.PI / 2;
    vault.position.y = 2.16;
    root.add(vault);
    const steel = material(0x33484a, 0.46, 0.62);
    for (const x of [-3.45, -2.3, -1.15, 0, 1.15, 2.3, 3.45]) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.055, 8, 30, Math.PI), steel);
      rib.rotation.set(0, Math.PI / 2, 0);
      rib.position.set(x, 2.18, 0);
      root.add(rib);
    }
    for (const z of [-2.3, 2.3]) root.add(box(7.45, 0.09, 0.09, 0x33484a, 0, 3.55, z, 0.45));
    addWindows(root, 6.8, 1, 2.74);
    const clock = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.14, 24), material(0xe3cf91)));
    clock.rotation.x = Math.PI / 2;
    clock.position.set(0, 3.15, 2.47);
    root.add(clock);
    const canopy = box(5.4, 0.16, 1.25, 0x6c8585, 0, 2.05, 3.15, 0.2);
    canopy.rotation.x = -0.13;
    root.add(canopy);
  } else {
    const height = spec.style === "tower" ? 5.2 : spec.style === "campus" ? 3.7 : 3.2;
    const width = spec.style === "campus" ? 7.4 : 6.2;
    const main = box(width, height, 4.6, spec.color, 0, height / 2, 0);
    root.add(main, roof(width + 0.25, 4.9, spec.roof, height + 0.85));
    if (spec.style === "civic" || spec.style === "campus" || spec.style === "tower") {
      root.add(createFacadePanel(surfaceTextures?.facadeCivic, width * 0.96, height * 0.93, 0, height * 0.5, 2.335));
    }
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
      if (spec.id === "market") {
        const arcadeGlass = new THREE.MeshPhysicalMaterial({ color: 0x91b8ad, roughness: 0.14, transmission: 0.38, transparent: true, opacity: 0.72, metalness: 0.12, side: THREE.DoubleSide });
        for (const side of [-1, 1]) {
          const gallery = shadow(new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 4.8, 28, 1, true, 0, Math.PI), arcadeGlass));
          gallery.rotation.z = Math.PI / 2;
          gallery.scale.set(1, 1, 0.72);
          gallery.position.set(side * 4.35, 1.78, 0);
          root.add(gallery);
        }
      }
    }
    addArchitecturalFront(root, width, height, 2.34, spec.color, spec.roof);
  }

  root.traverse((child) => {
    child.userData.placeId = spec.id;
  });
  return root;
}

function createTree(x: number, z: number, scale = 1) {
  const group = new THREE.Group();
  const trunk = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1.35, 12), material(0x5b3a25)));
  trunk.position.y = 0.65;
  group.add(trunk);
  const crownColor = palette.greenery[Math.abs(Math.round(x * 7 + z * 3)) % palette.greenery.length];
  const crownMaterial = material(crownColor, 0.96);
  const crownParts: [number, number, number, number][] = [[0, 1.62, 0, .74], [-.37, 1.5, .05, .52], [.34, 1.52, -.08, .58], [.08, 1.98, .02, .53]];
  crownParts.forEach(([cx, cy, cz, radius]) => {
    const crown = shadow(new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 2), crownMaterial));
    crown.position.set(cx, cy, cz);
    crown.scale.set(1 + Math.abs(Math.sin(x + cx)) * 0.12, 1.08 + Math.abs(Math.cos(z + cz)) * 0.18, 0.92 + Math.abs(Math.sin(z - x)) * 0.14);
    crown.rotation.set(x * 0.07, z * 0.05, (x + z) * 0.03);
    group.add(crown);
  });
  group.position.set(x, 0.15, z);
  group.scale.setScalar(scale);
  return group;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(110, 86, 110, 86);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getY(i);
    const ridge = 3.2 * Math.exp(-((x - 25) ** 2) / 150 - ((z + 20) ** 2) / 55);
    const hills = 1.5 * Math.exp(-((x + 28) ** 2) / 180 - ((z + 17) ** 2) / 100);
    const coast = -1.4 * Math.exp(-((x + 31) ** 2) / 50 - ((z - 15) ** 2) / 300);
    const detail = Math.sin(x * 0.55) * Math.cos(z * 0.44) * 0.18 + Math.sin((x + z) * 0.8) * 0.09;
    const height = 0.25 + ridge + hills + coast + detail;
    positions.setZ(i, height);
  }
  geometry.computeVertexNormals();
  const terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: surfaceTextures?.meadow, color: 0x78956b, roughness: 0.98 }));
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
    scene.background = new THREE.Color(0x91a595);
    scene.fog = new THREE.FogExp2(0x9b9b7e, 0.0028);
    sceneRef.current = scene;

    const compactView = mount.clientWidth < 700;
    const camera = new THREE.PerspectiveCamera(compactView ? 48 : 42, mount.clientWidth / mount.clientHeight, 0.1, 180);
    camera.position.set(compactView ? 43 : 34, compactView ? 46 : 27, compactView ? 58 : 43);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.68;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const roomEnvironment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentTexture = pmremGenerator.fromScene(roomEnvironment, 0.03).texture;
    scene.environment = environmentTexture;

    const composer = new EffectComposer(renderer);
    composer.setSize(mount.clientWidth, mount.clientHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, compactView ? 1.35 : 1.7));
    composer.addPass(new RenderPass(scene, camera));
    if (!compactView) {
      const gtaoPass = new GTAOPass(scene, camera, mount.clientWidth, mount.clientHeight);
      gtaoPass.blendIntensity = 0.72;
      gtaoPass.updateGtaoMaterial({ radius: 0.22, distanceExponent: 1.5, thickness: 1.1, distanceFallOff: 1, samples: 12, screenSpaceRadius: true });
      gtaoPass.updatePdMaterial({ radius: 2, radiusExponent: 2, rings: 2, samples: 8 });
      composer.addPass(gtaoPass);
    }
    composer.addPass(new OutputPass());

    const textureLoader = new THREE.TextureLoader();
    const prepareTexture = (path: string, repeatX: number, repeatY: number) => {
      const texture = textureLoader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };
    const prepareFacade = (path: string) => {
      const texture = textureLoader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };
    const textures = {
      stone: prepareTexture("/maps/textures/limestone.webp", 2.2, 2.2),
      slate: prepareTexture("/maps/textures/slate.webp", 2.2, 2.8),
      meadow: prepareTexture("/maps/textures/meadow.webp", 13, 10),
      facadeChateau: prepareFacade("/maps/facades/chateau-facade.webp"),
      facadeCivic: prepareFacade("/maps/facades/civic-facade.webp")
    };
    surfaceTextures = textures;

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

    scene.add(createSky());
    scene.add(new THREE.HemisphereLight(0xf4ead2, 0x425241, 0.78));
    scene.add(new THREE.AmbientLight(0xffefd0, 0.12));
    const sun = new THREE.DirectionalLight(0xffbf67, 4.15);
    sun.position.set(-42, 34, 20);
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

    scene.add(createReflectingPool(-19.5, 11.8, 8.8, 3.4));
    scene.add(createReflectingPool(20.5, 15.8, 7.2, 2.8));

    const courtyardMaterial = new THREE.MeshStandardMaterial({ map: textures.stone, color: 0xb6ad91, roughness: 0.94 });
    const courtyard = new THREE.Mesh(new THREE.CylinderGeometry(10.8, 11.5, 0.34, 64), courtyardMaterial);
    courtyard.position.set(0, 0.34, -1);
    courtyard.receiveShadow = true;
    scene.add(courtyard);

    for (const spec of BUILDINGS) scene.add(createBuilding(spec));
    scene.add(createFormalGarden());
    scene.add(createDriveway([[-23, -4], [-15, -7], [-9, -5], [-7, 1], [-10, 8], [-4, 13]], 0x77756e));
    scene.add(createDriveway([[23, 5], [15, 4], [9, 1], [8, -5], [12, -11], [19, -10]], 0x77756e));
    scene.add(createDriveway([[-16, -13], [-9, -10], [-5, -7], [0, -9], [5, -10], [10, -14]], 0x77756e));
    scene.add(createDriveway([[-13, 22], [-6, 18], [0, 17], [8, 17], [14, 20], [18, 21]], 0x41433f));
    const centralRing = new THREE.Mesh(new THREE.RingGeometry(11.55, 12.65, 128), material(0x686760, 0.94));
    centralRing.rotation.x = -Math.PI / 2;
    centralRing.position.set(0, 0.65, -1);
    centralRing.receiveShadow = true;
    centralRing.castShadow = false;
    scene.add(centralRing);

    const treePositions: [number, number, number][] = [];
    for (let i = 0; i < 178; i += 1) {
      const angle = i * 2.399;
      const radius = 12 + (i % 22) * 1.45;
      const x = Math.cos(angle) * radius + (i % 5) * 0.33;
      const z = Math.sin(angle) * radius + ((i * 3) % 7) * 0.25;
      if (BUILDINGS.some((building) => Math.hypot(x - building.position[0], z - building.position[1]) < 4.3)) continue;
      if (x < -22 && z > 7) continue;
      treePositions.push([x, z, 0.75 + (i % 5) * 0.08]);
    }
    treePositions.forEach(([x, z, scale]) => scene.add(createTree(x, z, scale)));

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
      composer.setSize(mount.clientWidth, mount.clientHeight);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, mount.clientWidth < 700 ? 1.35 : 1.7));
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
      composer.render();
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
      textures.stone.dispose();
      textures.slate.dispose();
      textures.meadow.dispose();
      textures.facadeChateau.dispose();
      textures.facadeCivic.dispose();
      if (surfaceTextures === textures) surfaceTextures = null;
      composer.dispose();
      environmentTexture.dispose();
      roomEnvironment.dispose();
      pmremGenerator.dispose();
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
    cameraRef.current.position.set(compactView ? 43 : 34, compactView ? 46 : 27, compactView ? 58 : 43);
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
