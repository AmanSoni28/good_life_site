"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { FOCUS } from "@/lib/floors";
import { A } from "@/lib/site";

/*
 * Scroll-driven "exploded building". The club's three gym floors are glass modules whose fronts
 * glow with each floor's real facade photo. progress (0..1, from the pinned ScrollTrigger) drives:
 *   0.00–0.12  stacked building, low street-level angle
 *   0.12–0.20  floors pull apart
 *   per floor  the floor slides out toward the camera, turns red, scan line sweeps; camera orbits
 *   0.88–1.00  floors re-stack and the whole building lights up
 */
const W = 6.8;
const D = 3.6;
const H = 1.7;
const BASE = 1.2; // podium (lower storeys of other tenants)
const GAP = 1.25;
const GH = H - 0.5; // glass height

const ss = THREE.MathUtils.smoothstep;
const focusOf = (p: number, c: number) => ss(p, c - 0.14, c - 0.06) * (1 - ss(p, c + 0.06, c + 0.14));
const explodeOf = (p: number) => ss(p, 0.1, 0.2) * (1 - ss(p, 0.88, 0.97));
const finaleOf = (p: number) => ss(p, 0.88, 0.97);
const floorY = (i: number, e: number) => BASE + i * H + e * i * GAP;

const KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0, pos: [8.6, 1.6, 13.6], look: [0, 4.1, 0] },
  { p: 0.12, pos: [8.5, 3.5, 15], look: [0, 4.6, 0] },
  { p: 0.2, pos: [5.6, 2.8, 8.8], look: [0, 2.05, 1.6] },
  { p: 0.32, pos: [4.6, 2.4, 8.1], look: [0, 2.05, 1.6] },
  { p: 0.48, pos: [-4.4, 5.9, 10.6], look: [0, 5, 1.6] },
  { p: 0.6, pos: [-3.8, 5.5, 9.9], look: [0, 5, 1.6] },
  { p: 0.74, pos: [5.6, 8.9, 8.8], look: [0, 7.95, 1.6] },
  { p: 0.86, pos: [4.6, 8.4, 8.1], look: [0, 7.95, 1.6] },
  { p: 1, pos: [-10, 6.5, 19], look: [0, 5, 0] },
];
const _b = new THREE.Vector3();
function sample(p: number, pos: THREE.Vector3, look: THREE.Vector3) {
  let k = 0;
  while (k < KEYS.length - 2 && p > KEYS[k + 1].p) k++;
  const a = KEYS[k];
  const b = KEYS[k + 1];
  const t = ss(p, a.p, b.p);
  pos.set(...a.pos).lerp(_b.set(...b.pos), t);
  look.set(...a.look).lerp(_b.set(...b.look), t);
}

// ---------- textures generated once ----------
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.35, "rgba(255,255,255,.35)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function signTexture(level: number) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 112;
  const g = c.getContext("2d")!;
  g.fillStyle = "#060606";
  g.fillRect(0, 0, c.width, c.height);
  const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-oswald").trim() || "Arial";
  g.font = `600 70px ${fam}`;
  g.textBaseline = "middle";
  const parts: [string, string][] = [["GOOD  ", "#fff"], ["LIFE  ", "#ED251E"], ["FITNESS  ", "#fff"], ["CLUB", "#ED251E"]];
  const total = parts.reduce((s, [t]) => s + g.measureText(t).width, 0);
  let x = (c.width - total) / 2;
  for (const [t, col] of parts) {
    g.fillStyle = col;
    g.fillText(t, x, 60);
    x += g.measureText(t).width;
  }
  g.font = `500 54px ${fam}`;
  g.fillStyle = "#c9a45c";
  g.fillText(`LEVEL 0${level}`, 70, 60);
  g.fillText(`0${level}`, c.width - 70 - g.measureText(`0${level}`).width, 60);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const frameMat = new THREE.MeshStandardMaterial({ color: "#121212", metalness: 0.85, roughness: 0.35 });
const shellMat = new THREE.MeshStandardMaterial({ color: "#070707", metalness: 0.4, roughness: 0.8 });
const AMBER = new THREE.Color("#ffb066");
const RED = new THREE.Color("#ff2a1f");

type Shared = { progress: RefObject<number>; built: RefObject<number> };
type Ready = { ready: RefObject<boolean> };

function Floor({ i, tex, sign, glow, progress, built }: Shared & { i: number; tex: THREE.Texture; sign: THREE.Texture; glow: THREE.Texture }) {
  const g = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.Mesh>(null);
  const m = useMemo(
    () => ({
      glass: new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffffff", emissiveIntensity: 0, roughness: 0.15, metalness: 0.3 }),
      strip: new THREE.MeshBasicMaterial({ color: AMBER.clone(), toneMapped: false }),
      halo: new THREE.MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      scan: new THREE.MeshBasicMaterial({ map: glow, color: RED.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      sweep: new THREE.MeshBasicMaterial({ map: glow, color: "#fff1dc", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      sign: new THREE.MeshBasicMaterial({ map: sign, toneMapped: false }),
    }),
    [tex, sign, glow],
  );
  const col = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const p = progress.current ?? 0;
    const e = explodeOf(p);
    const fi = focusOf(p, FOCUS[i]);
    const any = Math.max(...FOCUS.map((c) => focusOf(p, c)));
    const fin = finaleOf(p);
    const a = THREE.MathUtils.clamp((built.current ?? 1) * 1.8 - i * 0.4, 0, 1);
    const ease = 1 - (1 - a) ** 3;

    const grp = g.current!;
    grp.position.set(0, floorY(i, e) + (1 - ease) * 7, fi * 2);
    grp.rotation.y = fi * (i === 1 ? 0.24 : -0.24);
    grp.scale.setScalar(1 + fi * 0.04);

    m.glass.emissiveIntensity = Math.max(0.05, 0.5 + fi * 1.1 - (any - fi) * 0.3 + fin * 0.45) * ease;
    col.copy(AMBER).lerp(RED, Math.max(fi, fin * 0.3));
    m.strip.color.copy(col).multiplyScalar((0.7 + fi * 2.6 + fin) * ease);
    m.halo.color.copy(col);
    m.halo.opacity = (0.18 + fi * 0.8 + fin * 0.35) * ease;
    m.sign.color.setScalar(0.35 + 0.65 * ease * Math.max(0.5, 1 - (any - fi)));
    if (scan.current) {
      scan.current.position.y = 0.12 + ((clock.elapsedTime * 0.45) % 1) * GH;
      m.scan.opacity = fi * 0.9;
    }
    if (sweep.current) {
      const k = (((clock.elapsedTime + 3 - i * 0.25) / 8) % 1) / 0.35; // one pass every 8s, cascading across the floors
      sweep.current.position.x = THREE.MathUtils.lerp(-W / 2 - 0.6, W / 2 + 0.6, Math.min(k, 1));
      m.sweep.opacity = k <= 1 ? Math.sin(k * Math.PI) * 0.6 * (1 - e) * ease : 0;
    }
  });

  const front = D / 2;
  return (
    <group ref={g}>
      <mesh material={frameMat} position={[0, 0.06, 0]}>
        <boxGeometry args={[W + 0.3, 0.12, D + 0.3]} />
      </mesh>
      <mesh material={frameMat} position={[0, H - 0.06, 0]}>
        <boxGeometry args={[W + 0.3, 0.12, D + 0.3]} />
      </mesh>
      <mesh material={shellMat} position={[0, H / 2, -0.06]}>
        <boxGeometry args={[W, H - 0.24, D - 0.1]} />
      </mesh>
      {/* glowing glass front = real facade photo of this floor */}
      <mesh material={m.glass} position={[0, 0.12 + GH / 2, front + 0.01]}>
        <planeGeometry args={[W - 0.1, GH]} />
      </mesh>
      {Array.from({ length: 8 }, (_, k) => (
        <mesh key={k} material={frameMat} position={[-W / 2 + 0.05 + (k * (W - 0.1)) / 7, 0.12 + GH / 2, front + 0.04]}>
          <boxGeometry args={[0.04, GH, 0.04]} />
        </mesh>
      ))}
      {/* fascia signage */}
      <mesh material={frameMat} position={[0, H - 0.25, front + 0.04]}>
        <boxGeometry args={[W + 0.1, 0.26, 0.08]} />
      </mesh>
      <mesh material={m.sign} position={[0, H - 0.25, front + 0.085]}>
        <planeGeometry args={[W, 0.22]} />
      </mesh>
      {/* LED outline + halo */}
      <mesh material={m.strip} position={[0, 0.12, front + 0.17]}>
        <boxGeometry args={[W + 0.3, 0.03, 0.03]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.strip} position={[s * (W / 2 + 0.15), H / 2, front + 0.17]}>
          <boxGeometry args={[0.03, H - 0.12, 0.03]} />
        </mesh>
      ))}
      <mesh material={m.halo} position={[0, 0.12, front + 0.22]}>
        <planeGeometry args={[W + 2.4, 0.9]} />
      </mesh>
      <mesh ref={sweep} material={m.sweep} position={[0, 0.12 + GH / 2, front + 0.07]}>
        <planeGeometry args={[1.1, GH * 1.25]} />
      </mesh>
      <mesh ref={scan} material={m.scan} position={[0, 0.5, front + 0.06]}>
        <planeGeometry args={[W + 0.6, 0.22]} />
      </mesh>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let k = 0; k < count; k++) {
      a[k * 3] = (Math.random() - 0.5) * 22;
      a[k * 3 + 1] = Math.random() * 13;
      a[k * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let k = 0; k < count; k++) {
      let y = attr.getY(k) + dt * 0.12;
      if (y > 13) y = 0;
      attr.setY(k, y);
    }
    attr.needsUpdate = true;
    if (pts.current) pts.current.rotation.y += dt * 0.01;
  });
  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial size={0.035} color="#ffd9c2" transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Rig({ progress }: { progress: RefObject<number> }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(0, 4, 0));
  const tp = useMemo(() => new THREE.Vector3(), []);
  const tl = useMemo(() => new THREE.Vector3(), []);
  const aspect = size.width / size.height;
  const dist = aspect >= 1.4 ? 1 : aspect >= 1 ? 1.3 : 2.5;

  // shift the frame: building sits right of the copy on wide screens, above it on phones
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (aspect > 1.1) cam.setViewOffset(size.width, size.height, -size.width * 0.15, 0, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, 0, size.height * 0.17, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size, aspect]);

  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useFrame(({ pointer, clock }, dt) => {
    const p = progress.current ?? 0;
    sample(p, tp, tl);
    tp.sub(tl).multiplyScalar(dist).add(tl);
    tp.x += pointer.x * 0.7;
    tp.y += pointer.y * 0.4;
    if (!still) {
      const hero = 1 - ss(p, 0, 0.1);
      tp.y += Math.sin(clock.elapsedTime * 0.45) * 0.18 * hero;
      tp.x += Math.sin(clock.elapsedTime * 0.3) * 0.25 * hero;
    }
    const k = 1 - Math.pow(0.0015, dt);
    camera.position.lerp(tp, k);
    look.current.lerp(tl, k);
    camera.lookAt(look.current);
  });
  return null;
}

function Building({ progress, built, lite, ready }: Shared & Ready & { lite: boolean }) {
  const texs = useLoader(THREE.TextureLoader, [1, 2, 3].map((n) => `${A}/floors/floor-${n}.jpg`));
  const glow = useMemo(glowTexture, []);
  const signs = useMemo(() => [1, 2, 3].map(signTexture), []);
  const light = useRef<THREE.PointLight>(null);
  const groundGlow = useRef<THREE.MeshBasicMaterial>(null);
  const beam = useMemo(
    () => new THREE.MeshBasicMaterial({ map: glow, color: "#ffcf8f", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    [glow],
  );
  // spotlight targets must live in the scene or three.js ignores their position
  const aims = useMemo(
    () =>
      [-1, 1].map((s) => {
        const o = new THREE.Object3D();
        o.position.set(s * (W / 2 - 0.2), 6, D / 2); // position is read-only, so set it rather than assign
        return o;
      }),
    [],
  );

  useMemo(() => {
    for (const t of texs) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      // cover-fit the photo onto the glass panel
      const img = t.image as HTMLImageElement;
      const ratio = img.width / img.height / ((W - 0.1) / GH);
      if (ratio < 1) {
        t.repeat.set(1, ratio);
        t.offset.set(0, (1 - ratio) / 2);
      } else {
        t.repeat.set(1 / ratio, 1);
        t.offset.set((1 - 1 / ratio) / 2, 0);
      }
    }
  }, [texs]);

  useFrame((_, dt) => {
    if (ready.current) built.current = Math.min(1, (built.current ?? 0) + dt / 2.6);
    const p = progress.current ?? 0;
    const e = explodeOf(p);
    let w = 0;
    let y = 0;
    FOCUS.forEach((c, i) => {
      const f = focusOf(p, c);
      w += f;
      y += f * (floorY(i, e) + H / 2);
    });
    if (light.current) {
      light.current.intensity = w * 30;
      if (w > 0.01) light.current.position.y = y / w;
    }
    if (groundGlow.current) groundGlow.current.opacity = 0.35 + finaleOf(p) * 0.4;
    // facade uplights belong to the stacked building; they dim while the floors pull apart
    beam.opacity = 0.32 * (1 - e) * Math.min(1, (built.current ?? 1) * 1.5);
  });

  return (
    <>
      <pointLight ref={light} position={[0, 3, 5.5]} distance={10} color="#ff2a1f" intensity={0} />
      {/* warm architectural uplights washing the front corners, like a luxury facade at night */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <primitive object={aims[(s + 1) / 2]} />
          <spotLight position={[s * (W / 2 + 0.6), 0.05, D / 2 + 1.2]} target={aims[(s + 1) / 2]} angle={0.32} penumbra={0.9} distance={11} intensity={26} color="#ffc07a" />
          <mesh material={beam} position={[s * (W / 2 + 0.25), 3.4, D / 2 + 0.45]}>
            <planeGeometry args={[1.3, 7.4]} />
          </mesh>
        </group>
      ))}
      {/* podium: lower storeys of the building (other tenants) */}
      <mesh material={shellMat} position={[0, BASE / 2, 0]}>
        <boxGeometry args={[W + 0.3, BASE, D + 0.3]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <Floor key={i} i={i} tex={texs[i]} sign={signs[i]} glow={glow} progress={progress} built={built} />
      ))}
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#050505" metalness={0.85} roughness={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]}>
        <planeGeometry args={[20, 12]} />
        <meshBasicMaterial ref={groundGlow} map={glow} color="#ed251e" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {!lite && <Dust count={220} />}
    </>
  );
}

export default function BuildingScene({ progress, running, lite, ready }: Ready & { progress: RefObject<number>; running: boolean; lite: boolean }) {
  const built = useRef(lite ? 1 : 0);
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={lite ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 32, position: [8.6, 1.6, 13.6], near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        scene.fog = new THREE.Fog("#080808", 18, 46);
      }}
    >
      <color attach="background" args={["#080808"]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#9fb0ff", "#100404", 0.35]} />
      <directionalLight position={[-8, 14, 10]} intensity={0.7} color="#cdd6ff" />
      {/* gold rim light from behind picks out the building's edges */}
      <directionalLight position={[7, 9, -10]} intensity={1.6} color="#e9c98f" />
      <Rig progress={progress} />
      <Suspense fallback={null}>
        <Building progress={progress} built={built} lite={lite} ready={ready} />
      </Suspense>
    </Canvas>
  );
}
