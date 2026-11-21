// HERCOSS — rotating Earth for the home page hero.
// WebGL1 fragment shader: textured sphere, day/night terminator, ocean glint,
// drifting clouds, atmospheric glow and a static star field. No dependencies.
(function () {
  var canvas = document.querySelector("canvas[data-earth]");
  if (!canvas) return;
  var hero = canvas.closest(".hero-earth");

  var gl = null;
  try {
    gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" }) ||
         canvas.getContext("experimental-webgl");
  } catch (e) { gl = null; }
  if (!gl) { if (hero) hero.classList.add("no-webgl"); return; }

  var VS = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  var FS = [
    "precision highp float;",
    "uniform vec2 uRes; uniform vec2 uCenter; uniform float uRadius;",
    "uniform float uRot; uniform float uCloudRot; uniform float uTilt;",
    "uniform vec3 uSun; uniform sampler2D uEarth; uniform sampler2D uClouds;",
    "const vec3 BG = vec3(0.051, 0.063, 0.078);",
    "float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }",
    "void main(){",
    "  vec2 px = gl_FragCoord.xy;",
    "  vec2 d = (px - uCenter) / uRadius;",
    "  float r2 = dot(d, d); float rr = sqrt(r2);",
    "  vec3 col = BG;",
    // stars (static in screen space, a few twinkle-free points)
    "  vec2 cell = floor(px / 3.0);",
    "  float h = hash(cell);",
    "  if (h > 0.9965) { float b = (h - 0.9965) / 0.0035; col += vec3(0.55, 0.6, 0.7) * b * b; }",
    "  float cover = 0.0;",
    "  if (r2 < 1.0) {",
    "    vec3 n = vec3(d, sqrt(1.0 - r2));",
    "    float ct = cos(uTilt), st = sin(uTilt);",
    "    vec3 m = vec3(ct * n.x - st * n.y, st * n.x + ct * n.y, n.z);",
    "    float lon = atan(m.x, m.z) + uRot;",
    "    float lat = asin(clamp(m.y, -1.0, 1.0));",
    "    vec2 uv = vec2(fract(lon / 6.2831853 + 0.5), 0.5 - lat / 3.1415927);",
    "    vec3 tex = texture2D(uEarth, uv).rgb;",
    "    float ocean = smoothstep(0.02, 0.10, tex.b - max(tex.r, tex.g) * 0.9);",
    "    vec2 cuv = vec2(fract((lon + uCloudRot) / 6.2831853 + 0.5), uv.y);",
    "    float cl = texture2D(uClouds, cuv).r;",
    "    float ndl = dot(n, uSun);",
    "    float day = smoothstep(-0.15, 0.22, ndl);",
    "    float diff = max(ndl, 0.0);",
    "    vec3 surf = tex * (0.10 + 1.15 * diff);",
    "    vec3 hv = normalize(uSun + vec3(0.0, 0.0, 1.0));",
    "    float spec = pow(max(dot(n, hv), 0.0), 160.0) * 0.55 + pow(max(dot(n, hv), 0.0), 18.0) * 0.08;",
    "    spec *= ocean;",
    "    surf += vec3(1.0, 0.93, 0.82) * spec * 0.85 * day * (1.0 - cl);",
    "    surf *= 1.0 - 0.3 * cl * day;",
    "    vec3 c = mix(surf, vec3(1.0) * (0.06 + 1.05 * diff), cl * 0.9);",
    "    vec3 night = tex * 0.03 + vec3(0.004, 0.008, 0.02);",
    "    c = mix(night, c, day);",
    "    float rim = pow(1.0 - n.z, 2.2);",
    "    vec3 atm = vec3(0.32, 0.58, 1.0) * (0.15 + 0.95 * clamp(ndl + 0.3, 0.0, 1.0));",
    "    c = mix(c, atm, rim * 0.7);",
    "    cover = smoothstep(1.0, 1.0 - 1.6 / uRadius, rr);",
    "    col = mix(col, c, cover);",
    "  }",
    // atmospheric glow outside the disc
    "  if (rr > 0.97) {",
    "    float g = exp(-max(rr - 1.0, 0.0) * 30.0) * smoothstep(0.97, 1.0, rr);",
    "    vec2 dn = d / max(rr, 1e-4);",
    "    float lit = clamp(dot(vec3(dn, 0.25), uSun) * 0.9 + 0.35, 0.0, 1.0);",
    "    col += vec3(0.30, 0.55, 1.0) * g * lit * 0.85 * (1.0 - cover * 0.6);",
    "  }",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { hero && hero.classList.add("no-webgl"); return; }
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hero && hero.classList.add("no-webgl"); return; }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  ["uRes", "uCenter", "uRadius", "uRot", "uCloudRot", "uTilt", "uSun", "uEarth", "uClouds"].forEach(function (k) {
    U[k] = gl.getUniformLocation(prog, k);
  });

  function texture(unit, url, done) {
    var t = gl.createTexture(), img = new Image();
    img.onload = function () {
      gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      done();
    };
    img.onerror = function () { hero && hero.classList.add("no-webgl"); };
    img.src = url;
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sun = [0.60, 0.40, 0.69];
  var sl = Math.hypot(sun[0], sun[1], sun[2]); sun = sun.map(function (v) { return v / sl; });
  var W = 0, H = 0, dpr = 1;

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    gl.viewport(0, 0, W, H);
    var cx, cy, R;
    if (r.width < 800) { R = r.width * 0.92; cx = r.width * 0.58; cy = r.height + R * 0.22; }  // mobile: Earth rises below the text
    else { R = Math.max(r.height * 0.74, r.width * 0.31); cx = r.width * 0.79; cy = r.height * 0.64; } // desktop: Earth on the right
    gl.uniform2f(U.uRes, W, H);
    gl.uniform2f(U.uCenter, cx * dpr, (r.height - cy) * dpr);   // GL origin is bottom-left
    gl.uniform1f(U.uRadius, R * dpr);
  }

  var t0 = performance.now(), running = false, visible = true, ready = 0, raf = 0;
  var ROT = 2 * Math.PI / 100;    // one turn every 100 s
  var CLOUD = 2 * Math.PI / 600;  // clouds drift slowly relative to the ground

  function frame(now) {
    var t = (now - t0) / 1000 + 40;
    gl.uniform1f(U.uRot, t * ROT);
    gl.uniform1f(U.uCloudRot, t * CLOUD);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (running) raf = requestAnimationFrame(frame);
  }
  function start() {
    if (ready < 2 || running || reduce || !visible || document.hidden) return;
    running = true; raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function init() {
    gl.uniform1i(U.uEarth, 0); gl.uniform1i(U.uClouds, 1);
    gl.uniform1f(U.uTilt, 0.41);
    gl.uniform3f(U.uSun, sun[0], sun[1], sun[2]);
    layout(); frame(performance.now());
    canvas.classList.add("ready");
    start();
  }
  texture(0, canvas.dataset.tex, function () { if (++ready === 2) init(); });
  texture(1, canvas.dataset.clouds, function () { if (++ready === 2) init(); });

  window.addEventListener("resize", function () { if (ready === 2) { layout(); frame(performance.now()); } });
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting; visible ? start() : stop();
    }).observe(canvas);
  }
})();
