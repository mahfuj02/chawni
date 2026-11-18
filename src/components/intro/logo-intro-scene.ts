import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three";

/*
 * Port of chawni-design/reference/intro.js. Same stroke coordinates, timeline, camera path, materials
 * and colours. The only differences: it is typed, it is driven by the React component (skip, keys and
 * focus live there), and it disposes everything it creates.
 */

type Pt = [number, number];

// Chawni mark: single-weight strokes in an 850 x 800 SVG space (same as brand/chawni-icon-*.svg)
const MARK_LINES: Pt[][] = [
  [
    [285, 635],
    [285, 320],
    [150, 185],
    [55, 270],
    [55, 525],
  ],
  [
    [55, 525],
    [140, 440],
  ],
  [
    [100, 335],
    [225, 470],
    [60, 635],
    [155, 728],
  ],
  [
    [300, 45],
    [232, 100],
    [405, 265],
    [405, 505],
    [480, 412],
    [545, 470],
    [385, 635],
    [320, 560],
  ],
  [
    [500, 45],
    [427, 105],
    [580, 255],
    [580, 635],
  ],
  [
    [560, 45],
    [800, 270],
    [800, 665],
  ],
  [
    [800, 470],
    [745, 415],
    [635, 510],
    [725, 600],
  ],
];
const TAG: Pt[] = [
  [210, 700],
  [805, 700],
  [805, 800],
  [300, 800],
];
const S = 0.01; // px -> world
const W = (p: Pt) => new Vector2((p[0] - 430) * S, -(p[1] - 420) * S);

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

// Timeline (seconds)
export const T_DRAW: [number, number] = [0.15, 1.05];
export const T_EXTRUDE: [number, number] = [0.95, 1.75];
export const T_ORBIT: [number, number] = [0.9, 2.05];
export const T_TAG: [number, number] = [1.25, 1.75];
export const T_FLY: [number, number] = [1.95, 2.75];
export const TOTAL = 2.8;

export interface IntroCallbacks {
  /** 0 → 1 while the intro fades out; the page scales the hero from 1.08 → 1 with it. */
  onReveal: (k: number) => void;
  /** Everything is disposed and the layer can be removed. */
  onDone: () => void;
}

export interface IntroHandle {
  /** Fade out over 0.35 s and finish. Safe to call more than once. */
  finish: () => void;
  /** Dispose immediately, without the fade (component unmounted). */
  destroy: () => void;
}

/** Starts the intro inside `layer`. Returns null when WebGL is unavailable (the caller then skips). */
export function startLogoIntro(
  layer: HTMLElement,
  stage: HTMLElement,
  { onReveal, onDone }: IntroCallbacks,
): IntroHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  stage.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  scene.add(new HemisphereLight(0xffffff, 0x2a2c30, 1.6));
  const key = new DirectionalLight(0xffffff, 2.6);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new DirectionalLight(0xffc49a, 1.4);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const logo = new Group();
  scene.add(logo);
  const white = new MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.55, metalness: 0.0 });
  const edgeMat = new LineBasicMaterial({ color: 0xf47c24, transparent: true, opacity: 0 });
  const thick = 0.19;
  const maxDepth = 1.6;

  // Each stroke segment is a bar that grows along its length (x) and in depth (z).
  const bars: { mesh: Mesh; start: number; span: number }[] = [];
  let total = 0;
  MARK_LINES.forEach((line) => {
    for (let i = 0; i < line.length - 1; i++) total += W(line[i]).distanceTo(W(line[i + 1]));
  });
  let acc = 0;
  MARK_LINES.forEach((line, li) => {
    for (let i = 0; i < line.length - 1; i++) {
      const a = W(line[i]);
      const b = W(line[i + 1]);
      const len = a.distanceTo(b);
      const g = new BoxGeometry(len + thick, thick, 1);
      g.translate((len + thick) / 2 - thick / 2, 0, 0.5);
      const mesh = new Mesh(g, white);
      mesh.add(new LineSegments(new EdgesGeometry(g), edgeMat));
      const holder = new Group();
      holder.position.set(a.x, a.y, 0);
      holder.rotation.z = Math.atan2(b.y - a.y, b.x - a.x);
      holder.add(mesh);
      logo.add(holder);
      // Interleave lines so all strokes progress together, with a small offset per line.
      bars.push({ mesh, start: (acc / total) * 0.55 + li * 0.04, span: 0.28 + len / total });
      acc += len;
    }
  });

  // Orange tag (extruded parallelogram)
  const tagGeo = new ExtrudeGeometry(new Shape(TAG.map((p) => W(p))), {
    depth: 0.5,
    bevelEnabled: false,
  });
  const tagMat = new MeshStandardMaterial({ color: 0xf47c24, roughness: 0.5 });
  const tag = new Mesh(tagGeo, tagMat);
  tag.position.z = -0.25;
  logo.add(tag);

  logo.position.y = -0.1;
  const bgTop = new Color(0x15171a);
  const bgBottom = new Color(0x0e0f11);
  layer.style.background = `radial-gradient(120% 90% at 50% 40%, #${bgTop.getHexString()} 0%, #${bgBottom.getHexString()} 70%)`;

  const fit = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", fit);

  const camFront = new Vector3(0, 0, window.innerWidth < window.innerHeight ? 30 : 20);
  const camSide = new Vector3(7.5, 3.2, 12.5);
  const camIn = new Vector3(0.6, 0.4, 1.2);
  const look = new Vector3(0, 0, -0.4);
  const lookIn = new Vector3(0.2, 0.2, -6);
  const cp = new Vector3();
  const lp = new Vector3();

  let start: number | null = null;
  let done = false;
  let raf = 0;
  let disposeTimer = 0;

  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.removeEventListener("resize", fit);
    scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
    });
    [white, edgeMat, tagMat].forEach((mat: Material) => mat.dispose());
    renderer.dispose();
    canvas.remove();
    onDone();
  };

  const finish = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    layer.style.transition = "opacity .35s ease";
    layer.style.opacity = "0";
    onReveal(1);
    disposeTimer = window.setTimeout(dispose, 380);
  };

  function frame(now: number) {
    if (start === null) start = now;
    const t = (now - start) / 1000;
    const draw = seg(t, ...T_DRAW);
    const ext = ease(seg(t, ...T_EXTRUDE));
    const orbit = ease(seg(t, ...T_ORBIT));
    const tagK = easeOut(seg(t, ...T_TAG));
    const fly = seg(t, ...T_FLY);

    bars.forEach(({ mesh, start: s0, span }) => {
      const k = easeOut(clamp((draw - s0) / span));
      mesh.scale.x = Math.max(k, 0.0001);
      mesh.visible = k > 0.001;
      mesh.scale.z = 0.04 + ext * maxDepth;
      mesh.position.z = -mesh.scale.z * 0.5 + 0.02;
    });
    edgeMat.opacity = ext * 0.95;
    tag.scale.set(1, 1, Math.max(0.05, tagK));
    tag.position.x = (1 - tagK) * -2.5;
    tagMat.opacity = tagK;
    tagMat.transparent = tagK < 1;
    tag.visible = tagK > 0.01;

    // Camera: front → three-quarter orbit → fly in through the logo.
    cp.lerpVectors(camFront, camSide, orbit);
    lp.copy(look);
    const f = ease(fly);
    if (fly > 0) {
      cp.lerp(camIn, f);
      lp.lerp(lookIn, f);
    }
    camera.position.copy(cp);
    camera.lookAt(lp);
    logo.rotation.y = -0.15 * orbit + Math.sin(t * 0.8) * 0.02;

    // Reveal: fade the layer while flying in, and let the page scale the hero from 1.08 → 1.
    const reveal = easeOut(seg(t, T_FLY[0] + 0.15, TOTAL));
    layer.style.opacity = String(1 - reveal);
    onReveal(reveal);

    renderer.render(scene, camera);
    if (t >= TOTAL) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    finish,
    destroy: () => {
      // Unmounted mid-intro (e.g. client navigation): free everything now.
      cancelAnimationFrame(raf);
      window.clearTimeout(disposeTimer);
      done = true;
      dispose();
    },
  };
}
