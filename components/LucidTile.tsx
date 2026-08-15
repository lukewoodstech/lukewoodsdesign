'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import TileFooter from './TileFooter'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * Hyper-real glass pyramid, raytraced in a WebGL2 fragment shader.
 *
 * Each pixel fires a ray at an analytic square pyramid (intersection of five
 * half-spaces). At the surface it splits: a fresnel-weighted reflection of a
 * procedural studio environment, plus a refracted ray traced *through* the
 * body — bouncing on total internal reflection — and refracted again on exit.
 * The three colour channels use slightly different IORs, so edges and caustic
 * regions disperse into warm/cool fringes like real glass. The camera orbits
 * slowly, which reads as the pyramid spinning under fixed studio lights.
 */

const VERT = `#version 300 es
void main() {
  // Fullscreen triangle from gl_VertexID — no buffers needed
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
out vec4 outColor;

const float PI = 3.14159265;

// Pyramid: apex (0, AY, 0), square base at y = -BY with half-width W
const float AY = 0.70;
const float BY = 0.50;
const float W  = 0.56;

vec4 planes[5];

void initPlanes() {
  float h = AY + BY;
  vec3 n;
  n = normalize(vec3( h, W, 0.0)); planes[0] = vec4(n, n.y * AY);
  n = normalize(vec3(-h, W, 0.0)); planes[1] = vec4(n, n.y * AY);
  n = normalize(vec3(0.0, W,  h)); planes[2] = vec4(n, n.y * AY);
  n = normalize(vec3(0.0, W, -h)); planes[3] = vec4(n, n.y * AY);
  planes[4] = vec4(0.0, -1.0, 0.0, BY);
}

// Ray vs convex polyhedron (slab method over the 5 planes).
// Entry at tN with normal nN, exit at tF with normal nF.
bool intersect(vec3 ro, vec3 rd, out float tN, out float tF, out vec3 nN, out vec3 nF) {
  tN = -1e9; tF = 1e9; nN = vec3(0.0); nF = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    vec3 n = planes[i].xyz;
    float denom = dot(n, rd);
    float dist = planes[i].w - dot(n, ro);
    if (abs(denom) < 1e-7) { if (dist < 0.0) return false; continue; }
    float t = dist / denom;
    if (denom < 0.0) { if (t > tN) { tN = t; nN = n; } }
    else             { if (t < tF) { tF = t; nF = n; } }
  }
  return tN < tF;
}

// Procedural studio: graded blue backdrop, bright floor bounce, a big soft
// cool key light upper-front-left, and a warm amber practical low behind-right.
vec3 env(vec3 d) {
  vec3 col = mix(vec3(0.20, 0.26, 0.40), vec3(0.02, 0.03, 0.055),
                 smoothstep(-0.45, 0.55, d.y));
  col += vec3(0.42, 0.50, 0.68) * pow(max(-d.y, 0.0), 1.6) * 0.5;

  vec3 keyDir = normalize(vec3(-0.45, 0.60, 0.66));
  float k = max(dot(d, keyDir), 0.0);
  col += vec3(1.05, 1.10, 1.20) * pow(k, 3.0) * 0.55;
  col += vec3(1.5) * pow(k, 28.0) * 1.8;

  vec3 warmDir = normalize(vec3(0.55, -0.28, -0.78));
  float wl = max(dot(d, warmDir), 0.0);
  col += vec3(1.30, 0.44, 0.10) * pow(wl, 3.5) * 1.9;
  col += vec3(1.70, 0.75, 0.22) * pow(wl, 24.0) * 2.2;

  vec3 rimDir = normalize(vec3(0.6, 0.4, -0.4));
  col += vec3(0.35, 0.55, 0.95) * pow(max(dot(d, rimDir), 0.0), 8.0) * 0.5;
  return col;
}

float schlick(float cosT) {
  return 0.04 + 0.96 * pow(1.0 - cosT, 5.0);
}

vec4 shade(vec3 ro, vec3 rd) {
  float tN, tF; vec3 nN, nF;
  if (!intersect(ro, rd, tN, tF, nN, nF) || tN < 0.001) return vec4(0.0);

  vec3 p = ro + rd * tN;
  vec3 n = nN;
  float F = schlick(clamp(dot(-rd, n), 0.0, 1.0));
  vec3 reflCol = env(reflect(rd, n));
  vec3 col = reflCol * F;

  // Beer–Lambert absorption; passes blue slightly more — cool glass
  vec3 sigma = vec3(0.22, 0.12, 0.07);

  // Trace transmission per channel with dispersed IORs
  for (int c = 0; c < 3; c++) {
    float ior = 1.470 + 0.024 * float(c);
    vec3 dir = refract(rd, n, 1.0 / ior);
    vec3 pp = p + dir * 1e-4;
    float pathLen = 0.0;
    vec3 escaped = reflCol; // fallback if trapped after max bounces

    for (int b = 0; b < 4; b++) {
      float t0, t1; vec3 m0, m1;
      intersect(pp, dir, t0, t1, m0, m1);
      pathLen += t1;
      pp += dir * t1;
      vec3 outN = m1;
      vec3 rf = refract(dir, -outN, ior);
      if (dot(rf, rf) > 0.0) {
        rf = normalize(rf);
        float F2 = schlick(clamp(dot(rf, outN), 0.0, 1.0));
        escaped = env(rf) * (1.0 - F2);
        break;
      }
      dir = reflect(dir, outN); // total internal reflection
      pp += dir * 1e-4;
    }

    vec3 chan = c == 0 ? vec3(1.0, 0.0, 0.0)
              : c == 1 ? vec3(0.0, 1.0, 0.0)
              :          vec3(0.0, 0.0, 1.0);
    float atten = exp(-pathLen * dot(sigma, chan));
    col += chan * dot(escaped, chan) * (1.0 - F) * atten;
  }

  return vec4(col, 1.0);
}

void main() {
  initPlanes();

  // Orbit the camera — visually the pyramid spins under fixed lights
  float ang = uTime * (2.0 * PI / 22.0);
  float ca = cos(ang), sa = sin(ang);
  vec3 roBase = vec3(0.0, 0.34, 3.3);
  vec3 ro = vec3(roBase.z * sa, roBase.y, roBase.z * ca);
  vec3 target = vec3(0.0, 0.10, 0.0);
  vec3 fw = normalize(target - ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  const float FL = 1.425; // 75% of 1.9 — pyramid renders 25% smaller

  // 2×2 supersampling for clean edges
  vec4 acc = vec4(0.0);
  for (int s = 0; s < 4; s++) {
    vec2 off = vec2(float(s & 1), float((s >> 1) & 1)) * 0.5 + 0.25;
    vec2 uv = (gl_FragCoord.xy + off - 0.5 * uRes) / uRes.y;
    vec3 rd = normalize(fw * FL + uv.x * rt + uv.y * up);
    acc += shade(ro, rd);
  }
  acc *= 0.25;

  // Unpremultiply → tonemap → gamma → premultiply for canvas compositing
  vec3 c = acc.a > 0.0 ? acc.rgb / acc.a : vec3(0.0);
  c = 1.0 - exp(-c * 1.5);
  c = pow(c, vec3(1.0 / 2.2));
  outColor = vec4(c * acc.a, acc.a);
}`

export default function LucidTile() {
  const router = useRouter()
  const reducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const tileRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<{
    gl: WebGL2RenderingContext
    uTime: WebGLUniformLocation | null
    uRes: WebGLUniformLocation | null
  } | null>(null)
  const rafRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const el = tileRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // One-time WebGL setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    })
    if (!gl) return // no WebGL2 — tile stays quietly dark

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('LucidTile shader:', gl.getShaderInfoLog(sh))
      }
      return sh
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('LucidTile link:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)
    gl.bindVertexArray(gl.createVertexArray())

    glRef.current = {
      gl,
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uRes: gl.getUniformLocation(prog, 'uRes'),
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      ro.disconnect()
      glRef.current = null
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  // Render loop while in view
  useEffect(() => {
    if (!isInView) return

    const draw = (elapsedSeconds: number) => {
      const ctx = glRef.current
      if (!ctx) return
      const { gl, uTime, uRes } = ctx
      const c = gl.canvas as HTMLCanvasElement
      gl.viewport(0, 0, c.width, c.height)
      gl.uniform1f(uTime, elapsedSeconds)
      gl.uniform2f(uRes, c.width, c.height)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    /*
     * Reduced motion: paint one frame of the pyramid and stop. This is also
     * the heaviest thing on the page — a per-pixel raytrace with three-channel
     * dispersion — so not looping it is a real power saving too.
     */
    if (reducedMotion) {
      draw(0)
      return
    }

    const frame = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      draw((ts - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [isInView, reducedMotion])

  return (
    <div
      ref={tileRef}
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push('/work/lucid-ai')}
    >
      <div className="tile-stage">
        {/* Dark hover overlay (paints behind the pyramid, so the glass stays lit) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.72)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="workgrid__item__content">
          <canvas
            ref={canvasRef}
            className="tile-svg"
            aria-hidden="true"
            style={{
              display: 'block',
              opacity: isInView ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        </div>
      </div>

      <TileFooter
        slug="lucid-ai"
        logoSrc="/logos/lucid.png"
        companyHref="https://lucid.co"
        hovered={hovered}
      />
    </div>
  )
}
