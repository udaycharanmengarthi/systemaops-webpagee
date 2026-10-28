import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/astroid.svg';

/* SystemaOps teal → cyan → aqua ramp for the navbar Book a Call mark. */
const DEFAULT_COLORS = ['#087F8C', '#00B8B0', '#22D3EE', '#5EEAD4'];

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
#define PI 3.14159265359
#define TAU 6.28318530718
#define MATERIAL_OUTSIDE true
#define MATERIAL_REACH 0.3200
uniform sampler2D uField;
uniform sampler2D uSurf;
uniform vec2 uFieldScale;
uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uMatP[8];
uniform vec4 uMatC[16];
uniform vec4 uSurface;
out vec4 outColor;
#define C_colors(k) uMatC[0 + (k)]
#define N_colors uMatP[0].x
#define P_innerGlow uMatP[0].y
#define P_outerGlow uMatP[0].z
#define P_contour uMatP[0].w
#define P_angle uMatP[1].x
#define P_speed uMatP[1].y

struct Surface {
  vec2 p;
  vec2 uv;
  vec2 frag;
  vec2 res;
  float unit;
  float px;
  float d;
  float aa;
  float cov;
  vec2 n;
  float slope;
  float time;
};

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

float smin(float a, float b, float k) {
  if (k <= 0.0) return min(a, b);
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

vec4 over(vec4 base, vec4 top) {
  return top + base * (1.0 - top.a);
}

vec3 toLinear(vec3 c) {
  return pow(c, vec3(2.2));
}

vec3 toDisplay(vec3 c) {
  return pow(max(c, 0.0), vec3(1.0 / 2.2));
}

float shapeAt(vec2 q) {
  return texture(uField, q * uFieldScale + 0.5).r;
}

vec4 backdropAt(vec2 q) {
  return vec4(0.0);
}

float surfaceRim(Surface s, float width) {
  return clamp(1.0 + s.d / max(width, 1e-4), 0.0, 1.0);
}

vec3 domeNormal(Surface s, float width) {
  float x = min(surfaceRim(s, width), 0.985) * smoothstep(0.15, 0.85, s.slope);
  return normalize(vec3(s.n * x, sqrt(1.0 - x * x)));
}

float domeHeight(Surface s, float width) {
  float x = surfaceRim(s, width);
  return sqrt(max(1.0 - x * x, 0.0));
}


float m_hash(vec2 p) {
  uvec2 u = floatBitsToUint(p * vec2(141421356.0, 2718281828.0));
  return float((u.x ^ u.y) * 3141592653u) / 4294967295.0;
}

float m_value(vec2 p) {
  vec2 i = floor(p);
  vec2 f = p - i;
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(m_hash(i), m_hash(i + vec2(1.0, 0.0)), f.x),
    mix(m_hash(i + vec2(0.0, 1.0)), m_hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float m_front(float a, float b, float tk, float phase) {
  float pos = mix(-0.6, 0.6, tk);
  float wob = m_value(vec2(b * 4.0 + phase * 13.7, tk * 3.0 + phase * 7.1)) - 0.5;
  float e = a - pos + wob * 0.12;
  float band = exp(-e * e / 0.0256);
  float gate = smoothstep(0.0, 0.15, tk) * (1.0 - smoothstep(0.85, 1.0, tk));
  return clamp(band * gate, 0.0, 1.0);
}

vec3 m_toLab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = sign(l) * pow(abs(l), 1.0 / 3.0);
  m = sign(m) * pow(abs(m), 1.0 / 3.0);
  s = sign(s) * pow(abs(s), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  );
}

vec3 m_fromLab(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec4 m_ramp(float t) {
  float n = max(N_colors, 1.0);
  vec4 c0 = C_colors(0);
  vec3 lab = m_toLab(toLinear(c0.rgb));
  float alpha = c0.a;
  for (int i = 1; i < 8; i++) {
    if (float(i) >= n) break;
    float a = float(i - 1) / (n - 1.0);
    float b = float(i) / (n - 1.0);
    float seg = clamp((t - a) / max(b - a, 1e-6), 0.0, 1.0);
    vec4 ci = C_colors(i);
    float wa = alpha * (1.0 - seg);
    float wb = ci.a * seg;
    lab = (lab * wa + m_toLab(toLinear(ci.rgb)) * wb) / max(wa + wb, 0.001);
    alpha = wa + wb;
  }
  return vec4(toDisplay(m_fromLab(lab)), alpha);
}

vec4 material(Surface s) {
  float t = s.time * P_speed;
  float depth = clamp(-s.d, 0.0, 0.7);
  float f = s.d > 0.0 ? s.d * 0.5 : -0.5 * sqrt(max(depth * (1.4 - depth), 0.0));
  float inside = s.cov;
  vec2 rel = s.p * 0.5;
  float ang = P_angle * PI / 180.0;
  vec2 along = vec2(cos(ang), sin(ang));
  vec2 across = vec2(-along.y, along.x);
  float a = dot(rel, along);
  float b = -dot(rel, across);
  float base = 0.1 * t - 0.3;

  float innerBlur = exp(-max(-f, 0.0) / 0.12);
  float inner = 0.8 + 0.8 * innerBlur;
  inner = mix(inner, 0.0, m_front(a, b, fract(base), 1.0));
  inner = mix(inner, 0.0, m_front(a, b, fract(base + 1.0 / 3.0), 2.0));
  inner = mix(inner, 0.0, m_front(a, b, fract(base + 2.0 / 3.0), 3.0));
  inner *= 2.0 * P_innerGlow;
  inner += P_contour * 2.0 * exp(-abs(f) / 0.03);
  inner = min(inner, 1.0) * inside;
  inner = pow(max(inner, 0.0), 1.2);

  float reach = 0.05 + 0.15 * P_outerGlow;
  float outerBlur = exp(-max(f, 0.0) / reach);
  if (s.d > 0.0) {
    float r = reach * 1.2;
    float k = 0.5 / reach;
    outerBlur += exp(-max(shapeAt(s.p + vec2(r, 0.0)), 0.0) * k);
    outerBlur += exp(-max(shapeAt(s.p - vec2(r, 0.0)), 0.0) * k);
    outerBlur += exp(-max(shapeAt(s.p + vec2(0.0, r)), 0.0) * k);
    outerBlur += exp(-max(shapeAt(s.p - vec2(0.0, r)), 0.0) * k);
    outerBlur *= 0.2;
  }
  vec2 edge = smoothstep(vec2(-0.06), vec2(0.1), s.uv) * (1.0 - smoothstep(vec2(0.9), vec2(1.06), s.uv));
  float sweep = fract(base * 3.0 - 0.1);
  float y = fract(a * 1.2 - sweep);
  float mask = 0.5 + smoothstep(0.3, 0.65, y) * (1.0 - smoothstep(0.65, 1.0, y));
  float outer = 0.9 * pow(outerBlur, 0.8) * mask * 5.0 * P_outerGlow * P_outerGlow * (1.0 - inside) * edge.x * edge.y;

  float heat = clamp(inner + outer, 0.0, 1.0);
  heat += 0.005 * (m_hash(s.frag * vec2(1.7, 1.3)) - 0.5);
  heat = clamp(heat, 0.0, 1.0);
  float cover = clamp(inside + outer, 0.0, 1.0);
  vec4 ramp = m_ramp(heat);
  return vec4(clamp(ramp.rgb, 0.0, 1.0), ramp.a * cover);
}


void main() {

  float unit = min(uResolution.x, uResolution.y) * 0.5;
  vec2 frag = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 p = (frag - uResolution * 0.5) / unit;
  float px = 1.0 / unit;
  float bw = max(uSurface.x, px);
  float e = clamp(bw * 0.2, px * 1.5, max(bw * 0.5, px * 1.5));
  float d = shapeAt(p);
  float aa = clamp(length(vec2(dFdx(d), dFdy(d))), px * 0.5, px * 1.5);
  vec2 g = vec2(0.0);
  Surface s;
  s.p = p;
  s.uv = frag / uResolution;
  s.frag = frag;
  s.res = uResolution;
  s.unit = unit;
  s.px = px;
  s.d = d;
  s.aa = aa;
  s.cov = clamp(0.5 - d / aa, 0.0, 1.0);
  s.slope = length(g);
  s.n = s.slope > 1e-5 ? g / s.slope : vec2(0.0);
  s.time = uTime;

  vec4 m = material(s);
  float reach = 1.0 - smoothstep(MATERIAL_REACH * 0.55, MATERIAL_REACH, d);
  float a = clamp(MATERIAL_OUTSIDE ? m.a * max(reach, s.cov) : m.a * s.cov, 0.0, 1.0);
  outColor = vec4(clamp(m.rgb, 0.0, 1.0) * a, a);
}
`;

const toRgba = value => {
  const hex = String(value || '#ffffff').replace('#', '');
  const full = hex.length <= 4 ? hex.split('').map(char => char + char).join('') : hex;
  const channel = index => parseInt(full.slice(index, index + 2), 16) / 255;
  return [channel(0), channel(2), channel(4), full.length >= 8 ? channel(6) : 1];
};

const solve = (grid, offset, stride, length, f, v, z) => {
  for (let i = 0; i < length; i++) f[i] = grid[offset + i * stride];
  let k = 0;
  v[0] = 0;
  z[0] = -1e20;
  z[1] = 1e20;
  for (let q = 1; q < length; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = 1e20;
  }
  k = 0;
  for (let q = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    grid[offset + q * stride] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
};

const distances = (grid, width, height) => {
  const size = Math.max(width, height);
  const f = new Float64Array(size);
  const v = new Int32Array(size);
  const z = new Float64Array(size + 1);
  for (let x = 0; x < width; x++) solve(grid, x, width, height, f, v, z);
  for (let y = 0; y < height; y++) solve(grid, y * width, 1, width, f, v, z);
};

const loadField = src =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const long = 640;
      const ratio = image.width / image.height || 1;
      const width = Math.round(ratio >= 1 ? long : long * ratio);
      const height = Math.round(ratio >= 1 ? long / ratio : long);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height).data;
      const outer = new Float64Array(width * height);
      const inner = new Float64Array(width * height);
      for (let i = 0; i < width * height; i++) {
        const a = pixels[i * 4 + 3] / 255;
        const edge = 0.5 - a;
        outer[i] = a >= 1 ? 0 : a <= 0 ? 1e20 : edge > 0 ? edge * edge : 0;
        inner[i] = a <= 0 ? 0 : a >= 1 ? 1e20 : edge < 0 ? edge * edge : 0;
      }
      distances(outer, width, height);
      distances(inner, width, height);
      const unit = Math.min(width, height) / 2;
      const data = new Float32Array(width * height);
      for (let i = 0; i < data.length; i++) data[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / unit;
      resolve({ data, width, height });
    };
    image.onerror = reject;
    image.src = src;
  });


const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export default function AstroidMark({
  src = logo,
  className,
  style,
  colors = DEFAULT_COLORS,
  innerGlow = 1,
  outerGlow = 0,
  contour = 0.5,
  angle = 90,
  speed = 1
}) {
  const canvasRef = useRef(null);
  const [useStaticMark, setUseStaticMark] = useState(true);
  const settings = useRef({ colors, innerGlow, outerGlow, contour, angle, speed });

  useEffect(() => {
    settings.current = { colors, innerGlow, outerGlow, contour, angle, speed };
  }, [colors, innerGlow, outerGlow, contour, angle, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const gl = canvas?.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return undefined;

    const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return undefined;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    const surface = gl.createTexture();
    if (!buffer || !texture || !surface) {
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      if (surface) gl.deleteTexture(surface);
      gl.deleteProgram(program);
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uniform = name => gl.getUniformLocation(program, name);
    let field = null;
    let frame = 0;
    let alive = true;
    let contextLost = false;
    const started = performance.now();

    const handleContextLost = event => {
      event.preventDefault();
      contextLost = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setUseStaticMark(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    const pack = ({ colors, innerGlow, outerGlow, contour, angle, speed }) => {
      const floats = new Float32Array(32);
      const colorData = new Float32Array(64);
  const colorsList = (Array.isArray(colors) ? colors : [colors]).slice(0, 8);
  colorsList.forEach((value, index) => colorData.set(toRgba(value), (0 + index) * 4));
  floats[0] = colorsList.length;
  floats[1] = Number(innerGlow) || 0;
  floats[2] = Number(outerGlow) || 0;
  floats[3] = Number(contour) || 0;
  floats[4] = Number(angle) || 0;
  floats[5] = Number(speed) || 0;
      return { floats, colors: colorData };
    };

    const render = now => {
      frame = 0;
      if (!alive || contextLost || !field) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const { floats, colors } = pack(settings.current);
      const fieldUnit = Math.min(field.width, field.height) / 2;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uniform('uResolution'), width, height);
      gl.uniform2f(uniform('uFieldScale'), fieldUnit / field.width, fieldUnit / field.height);
      gl.uniform1f(uniform('uTime'), (now - started) / 1000);
      gl.uniform4fv(uniform('uMatP'), floats);
      gl.uniform4fv(uniform('uMatC'), colors);
      gl.uniform4f(uniform('uSurface'), 0.04, 0, 0, 0);
      gl.uniform1i(uniform('uField'), 0);
      gl.uniform1i(uniform('uSurf'), 1);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };

    loadField(src)
      .then(result => {
        if (!alive || contextLost) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, result.width, result.height, 0, gl.RED, gl.FLOAT, result.data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        field = result;
        setUseStaticMark(false);
        frame = requestAnimationFrame(render);
      })
      .catch(() => {
        if (alive) setUseStaticMark(true);
      });

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      gl.deleteTexture(texture);
      gl.deleteTexture(surface);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [src]);

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ display: 'block', position: 'relative', width: '100%', aspectRatio: '1 / 1', ...style }}
    >
      <img
        src={src}
        alt=""
        draggable="false"
        style={{ display: useStaticMark ? 'block' : 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <canvas
        ref={canvasRef}
        className="astroid-mark__canvas"
        style={{ display: useStaticMark ? 'none' : 'block', width: '100%', aspectRatio: '1 / 1' }}
      />
    </span>
  );
}

AstroidMark.credits = 'Material adapted from Shaders.com by Shader Effects Inc., MIT License, https://github.com/shader-effects-inc/shaders';
