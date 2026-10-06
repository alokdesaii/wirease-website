"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const R = 1;
const HK: [number, number] = [22.3, 114.17];
// Decorative corridors out of Hong Kong.
const DESTS: [number, number][] = [
  [51.5, -0.12], [-37.81, 144.96], [19.07, 72.88], [14.6, 120.98], [25.2, 55.27],
  [1.35, 103.82], [43.65, -79.38], [-6.2, 106.85], [27.7, 85.32], [23.81, 90.41],
  [6.52, 3.38], [40.71, -74.0], [-33.87, 151.21], [35.68, 139.69],
];

function toVec(lat: number, lon: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function Dots({ color, size }: { color: string; size: number }) {
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    fetch("/globe-dots.json")
      .then((r) => r.json())
      .then((d: number[]) => {
        const pos = new Float32Array((d.length / 2) * 3);
        for (let i = 0; i < d.length; i += 2) toVec(d[i], d[i + 1]).toArray(pos, (i / 2) * 3);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        setGeo(g);
      });
  }, []);
  if (!geo) return null;
  return (
    <points geometry={geo}>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

const arcVert = /* glsl */ `
  varying float vT;
  void main() { vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const arcFrag = /* glsl */ `
  uniform float uHead;
  uniform vec3 uA; uniform vec3 uB;
  varying float vT;
  void main() {
    // Faint permanent route, plus a bright comet travelling from Hong Kong outwards.
    float tail = 0.35;
    float d = uHead - vT;
    float comet = (d < 0.0 || d > tail) ? 0.0 : pow(1.0 - d / tail, 1.5);
    float a = 0.7 + 0.3 * comet;
    gl_FragColor = vec4(mix(uA, uB, comet), a);
  }
`;

function Arc({ to, delay }: { to: [number, number]; delay: number }) {
  const { line, mat } = useMemo(() => {
    const a = toVec(...HK);
    const b = toVec(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.setLength(R + a.distanceTo(b) * 0.38);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const g = new THREE.TubeGeometry(curve, 160, 0.0016, 5, false);
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uHead: { value: 0 },
        uA: { value: new THREE.Color("#14bdb7") },
        uB: { value: new THREE.Color("#b8f1ee") },
      },
      vertexShader: arcVert,
      fragmentShader: arcFrag,
      transparent: true,
      depthWrite: false,
    });
    return { line: new THREE.Mesh(g, m), mat: m };
  }, [to]);

  const matRef = useRef(mat);
  useFrame(({ clock }) => {
    // 4.2s loop per corridor: head travels 0 to 1.45 so the tail fully clears.
    const p = ((clock.elapsedTime + delay) % 4.2) / 4.2;
    matRef.current.uniforms.uHead.value = p * 1.35;
  });

  return <primitive object={line} />;
}

type Offset = [number, number];

function Scene({ dot, sphere, dotSize, reduced, offset, mobileOffset }: { dot: string; sphere: string; dotSize: number; reduced: boolean; offset: Offset; mobileOffset: Offset }) {
  // The canvas fills its whole section. To place the globe off-centre without perspective
  // squashing it, keep it on the camera axis and shift the frame instead (a lens shift).
  const { camera, size } = useThree();
  const [ox, oy] = size.width < 768 ? mobileOffset : offset;
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(size.width, size.height, -ox * size.width, oy * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, ox, oy]);
  const group = useRef<THREE.Group>(null);

  // Face Hong Kong toward the camera.
  const hkLocal = toVec(...HK);
  // Y rotation that brings HK onto the +z axis (facing the camera).
  const baseY = Math.atan2(-hkLocal.x, hkLocal.z);
  // Natural spin: starts facing Hong Kong and turns slowly west to east, like the Earth
  // (one full turn roughly every two minutes). Fixed tilt, no reaction to the pointer.
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || reduced) return;
    g.rotation.y += dt * 0.05;
  });

  const hk = toVec(...HK, R * 1.003);
  return (
    <group ref={group} rotation={[0.22, baseY, 0]}>
      <mesh>
        <sphereGeometry args={[R * 0.995, 64, 64]} />
        <meshBasicMaterial color={sphere} />
      </mesh>
      <Dots color={dot} size={dotSize} />
      {DESTS.map((d, i) => (
        <Arc key={i} to={d} delay={i * 0.61} />
      ))}
      {DESTS.map((d, i) => (
        <Landing key={`l${i}`} at={toVec(d[0], d[1], R * 1.002)} delay={i * 0.61} reduced={reduced} />
      ))}
      <HkPulse at={hk} reduced={reduced} />
    </group>
  );
}

// Where a route lands: a dot flat on the surface with a faint static ring for depth,
// and a ripple that fires as the comet arrives (head reaches the end at ~74% of its 4.2s cycle).
function Landing({ at, delay, reduced }: { at: THREE.Vector3; delay: number; reduced: boolean }) {
  const ripple = useRef<THREE.Mesh>(null);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), at.clone().normalize()), [at]);
  useFrame(({ clock }) => {
    const m = ripple.current;
    if (!m) return;
    const p = ((clock.elapsedTime + delay) % 4.2) / 4.2;
    const q = reduced ? 0 : p >= 0.72 ? (p - 0.72) / 0.28 : -1;
    m.visible = q >= 0 && !reduced;
    m.scale.setScalar(1 + q * 3.5);
    (m.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - q);
  });
  return (
    <group position={at} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.008, 20]} />
        <meshBasicMaterial color="#7fe0dc" />
      </mesh>
      <mesh>
        <ringGeometry args={[0.014, 0.017, 40]} />
        <meshBasicMaterial color="#14bdb7" transparent opacity={0.45} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple}>
        <ringGeometry args={[0.012, 0.015, 40]} />
        <meshBasicMaterial color="#b8f1ee" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Hong Kong: a small solid core with two transparent rings that pulse outward and fade.
function HkPulse({ at, reduced }: { at: THREE.Vector3; reduced: boolean }) {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  // Lay the rings flat on the globe surface at Hong Kong.
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), at.clone().normalize()), [at]);
  useFrame(({ clock }) => {
    rings.current.forEach((m, i) => {
      if (!m) return;
      const p = reduced ? 0.35 : ((clock.elapsedTime / 2.4 + i * 0.5) % 1);
      m.scale.setScalar(1 + p * 4);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - p);
    });
  });
  return (
    <group position={at} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.011, 24]} />
        <meshBasicMaterial color="#14bdb7" />
      </mesh>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }}>
          <ringGeometry args={[0.012, 0.015, 48]} />
          <meshBasicMaterial color="#14bdb7" transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe({ dotColor, sphereColor, distance = 3.2, dotSize = 0.014, offset = [0, 0], mobileOffset }: { dotColor?: string; sphereColor?: string; distance?: number; dotSize?: number; offset?: Offset; mobileOffset?: Offset }) {
  // Client-only (loaded with ssr: false), so reading the DOM at init is safe.
  const [dot] = useState(() => dotColor ?? cssVar("--globe-dot", "#9aa3ad"));
  const [sphere] = useState(() => sphereColor ?? cssVar("--bg-2", "#eef0f3"));
  const [reduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <Canvas camera={{ position: [0, 0, distance], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} aria-hidden>
      <Scene dot={dot} sphere={sphere} dotSize={dotSize} reduced={reduced} offset={offset} mobileOffset={mobileOffset ?? offset} />
    </Canvas>
  );
}
