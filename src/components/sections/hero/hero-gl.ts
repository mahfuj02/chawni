/**
 * Plain WebGL 1 fullscreen-quad renderer for the Home hero (no three.js, ~2 KB gzipped).
 * Draws the current and next slide with a depth-displacement parallax, a crossfade and a slow
 * Ken Burns zoom. The shader is a direct port of chawni-hero/reference/hero-prototype.html.
 */

export interface GLSlide {
  image: string;
  imageSmall: string;
  depth: string;
  focusX: number;
  focusXMobile: number;
  focusY: number;
  zoom: number;
}

/** Shared, mutable state written by the React side and read every frame. */
export interface HeroSync {
  /** Slide that should be showing. */
  index: number;
  /** Milliseconds elapsed in the current slide (frozen while paused). */
  elapsed: number;
}

export interface HeroRenderer {
  setActive: (active: boolean) => void;
  destroy: () => void;
}

export const SLIDE_MS = 7000;
export const FADE_MS = 1600;

const VERT =
  "attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0,1);}";
const FRAG = `precision highp float;varying vec2 v;
uniform sampler2D ia,da,ib,db;uniform vec2 res,ra,rb,fa,fb,mouse;uniform float za,zb,mixv,scroll;
vec2 cover(vec2 uv,vec2 r,vec2 f,float z){
  float sa=res.x/res.y,ia=r.x/r.y;vec2 s=sa>ia?vec2(1.,ia/sa):vec2(sa/ia,1.);s/=z;
  vec2 off=(1.-s)*f;return uv*s+off;}
vec4 samp(sampler2D im,sampler2D dp,vec2 uv,float str){
  float d=texture2D(dp,uv).r;vec2 o=(mouse*vec2(1.,-.6))*(d-.35)*str+vec2(0.,scroll*.06*(d-.2));
  return texture2D(im,uv+o);}
void main(){
  vec2 a=cover(v,ra,fa,za),b=cover(v,rb,fb,zb);
  gl_FragColor=mix(samp(ia,da,a,.028),samp(ib,db,b,.028),mixv);}`;

interface Tex {
  t: WebGLTexture;
  w: number;
  h: number;
}

export function createHeroRenderer(
  canvas: HTMLCanvasElement,
  slides: GLSlide[],
  sync: HeroSync,
  onReady: () => void,
  onFail: () => void,
): HeroRenderer | null {
  const ctx = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!ctx) return null;
  const gl: WebGLRenderingContext = ctx;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(program, n);

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const small =
    innerWidth < 900 ||
    Boolean(nav.connection?.saveData) ||
    /^(slow-)?[23]g$/.test(nav.connection?.effectiveType ?? "");
  const touch = matchMedia("(pointer: coarse)").matches;

  let destroyed = false;
  const textures: WebGLTexture[] = [];
  const loaded: ([Tex, Tex] | undefined)[] = [];

  const loadTex = (src: string) =>
    new Promise<Tex>((resolve, reject) => {
      const im = new Image();
      im.onload = () => {
        if (destroyed) return reject(new Error("destroyed"));
        const t = gl.createTexture()!;
        textures.push(t);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        resolve({ t, w: im.naturalWidth, h: im.naturalHeight });
      };
      im.onerror = () => reject(new Error(src));
      im.src = src;
    });
  const loadSlide = (i: number) =>
    Promise.all([
      loadTex(small ? slides[i].imageSmall : slides[i].image),
      loadTex(slides[i].depth),
    ]).then((r) => {
      loaded[i] = r;
    });

  let cur = sync.index;
  let prev = cur;
  let switchAt = 0;
  let elapsedAtSwitch = 0;
  let mouse = [0, 0];
  let target = [0, 0];
  let scroll = 0;
  let raf = 0;
  let active = false;

  const onMove = (e: PointerEvent) => {
    target = [(e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1];
  };
  const onScroll = () => {
    scroll = Math.min(1, scrollY / innerHeight);
  };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio, innerWidth < 760 ? 1.5 : 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    destroy();
    onFail();
  };

  const bind = (unit: number, t: WebGLTexture, name: string) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.uniform1i(U(name), unit);
  };

  function frame(now: number) {
    if (destroyed || !active) return;
    // Switch slides as soon as the requested slide's textures are ready.
    if (sync.index !== cur && loaded[sync.index]) {
      elapsedAtSwitch = sync.elapsed;
      prev = cur;
      cur = sync.index;
      switchAt = now;
    }
    const since = now - switchAt;
    const fade = prev === cur ? 1 : Math.min(1, since / FADE_MS);
    const e = fade < 0.5 ? 2 * fade * fade : 1 - Math.pow(-2 * fade + 2, 2) / 2;
    if (touch) {
      const t = now / 1000;
      target = [Math.sin(t * 0.25) * 0.35, Math.cos(t * 0.2) * 0.2];
    }
    mouse = [mouse[0] + (target[0] - mouse[0]) * 0.05, mouse[1] + (target[1] - mouse[1]) * 0.05];

    const A = loaded[prev]!;
    const B = loaded[cur]!;
    const sa = slides[prev];
    const sb = slides[cur];
    const portrait = canvas.clientWidth < canvas.clientHeight;
    const kb = (ms: number) => 1 + 0.06 * Math.min(1, ms / (SLIDE_MS + FADE_MS));

    bind(0, A[0].t, "ia");
    bind(1, A[1].t, "da");
    bind(2, B[0].t, "ib");
    bind(3, B[1].t, "db");
    gl.uniform2f(U("res"), canvas.width, canvas.height);
    gl.uniform2f(U("ra"), A[0].w, A[0].h);
    gl.uniform2f(U("rb"), B[0].w, B[0].h);
    gl.uniform2f(U("fa"), portrait ? sa.focusXMobile : sa.focusX, sa.focusY);
    gl.uniform2f(U("fb"), portrait ? sb.focusXMobile : sb.focusX, sb.focusY);
    gl.uniform1f(U("za"), sa.zoom * kb(elapsedAtSwitch + since));
    gl.uniform1f(U("zb"), sb.zoom * kb(sync.elapsed));
    gl.uniform1f(U("mixv"), e);
    gl.uniform2f(U("mouse"), mouse[0], mouse[1]);
    gl.uniform1f(U("scroll"), scroll);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", onMove);
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", resize);
    canvas.removeEventListener("webglcontextlost", onLost);
    textures.forEach((t) => gl.deleteTexture(t));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", resize);
  canvas.addEventListener("webglcontextlost", onLost);
  resize();
  onScroll();

  // Current slide first; only then reveal the canvas. The rest load in the background, one by one.
  loadSlide(cur)
    .then(() => {
      if (destroyed) return;
      switchAt = performance.now();
      onReady();
      if (active && !raf) raf = requestAnimationFrame(frame);
      return slides.reduce(
        (chain, _s, i) =>
          i === cur ? chain : chain.then(() => (destroyed ? undefined : loadSlide(i))),
        Promise.resolve<void>(undefined),
      );
    })
    .catch(() => {
      if (!destroyed) {
        destroy();
        onFail();
      }
    });

  return {
    setActive(next: boolean) {
      active = next;
      if (!next) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && loaded[cur]) {
        raf = requestAnimationFrame(frame);
      }
    },
    destroy,
  };
}
