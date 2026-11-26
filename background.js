/* ==========================================================
   Cyberio — background.js
   Background 3D (Three.js). Jika WebGL atau CDN tidak tersedia,
   fallback gradient di index.html tetap tampil.
   ========================================================== */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const probe = document.createElement("canvas");
const gl = probe.getContext("webgl2") || probe.getContext("webgl");
if (gl) start();

function start() {
  const mobile = window.innerWidth < 720;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !mobile,
    powerPreference: "low-power"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);

  const cv = renderer.domElement;
  Object.assign(cv.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    zIndex: "-1", pointerEvents: "none", display: "block"
  });
  cv.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 14;

  const rig = new THREE.Group();
  scene.add(rig);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(5, 8, 10);
  scene.add(key);
  const glowA = new THREE.PointLight(0x5fd0b3, 2.2, 40);
  glowA.position.set(-6, 4, 6);
  scene.add(glowA);
  const glowB = new THREE.PointLight(0x1d6b58, 1.6, 40);
  glowB.position.set(6, -4, 4);
  scene.add(glowB);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x8ff0d2, transparent: true, opacity: 0.32,
    roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08,
    emissive: 0x0b4a3e, emissiveIntensity: 0.25, depthWrite: false
  });
  const solid = new THREE.MeshStandardMaterial({
    color: 0x1d6b58, transparent: true, opacity: 0.5, roughness: 0.35, metalness: 0.5
  });
  const wire = new THREE.MeshBasicMaterial({
    color: 0x5fd0b3, wireframe: true, transparent: true, opacity: 0.18
  });

  const items = [];
  function addItem(mesh, base) {
    rig.add(mesh);
    items.push({
      mesh, base,
      phase: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.35,
      spin: (Math.random() - 0.5) * 0.4
    });
  }

  const nSphere = mobile ? 4 : 7;
  for (let i = 0; i < nSphere; i++) {
    const r = rnd(0.5, 1.4);
    addItem(
      new THREE.Mesh(new THREE.SphereGeometry(r, mobile ? 24 : 40, mobile ? 16 : 28), glass),
      { x: rnd(-8, 8), y: rnd(-4.5, 4.5), z: rnd(-5, 1) }
    );
  }
  const nTorus = mobile ? 2 : 4;
  for (let i = 0; i < nTorus; i++) {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(rnd(0.7, 1.1), 0.16, 20, mobile ? 40 : 72), solid
    );
    m.rotation.set(rnd(0, 3), rnd(0, 3), 0);
    addItem(m, { x: rnd(-9, 9), y: rnd(-4, 4), z: rnd(-6, 0) });
  }
  const nIco = mobile ? 2 : 4;
  for (let i = 0; i < nIco; i++) {
    addItem(
      new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(0.6, 1), 0), wire),
      { x: rnd(-9, 9), y: rnd(-4, 4), z: rnd(-6, -1) }
    );
  }

  const nP = mobile ? 120 : 300;
  const pos = new Float32Array(nP * 3);
  for (let i = 0; i < nP; i++) {
    pos[i * 3] = rnd(-12, 12);
    pos[i * 3 + 1] = rnd(-7, 7);
    pos[i * 3 + 2] = rnd(-8, 3);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x5fd0b3, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false
  }));
  rig.add(points);

  const wGeo = new THREE.PlaneGeometry(40, 16, mobile ? 30 : 60, mobile ? 10 : 20);
  const wave = new THREE.Mesh(wGeo, new THREE.MeshStandardMaterial({
    color: 0x1d6b58, transparent: true, opacity: 0.22,
    roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide
  }));
  wave.rotation.x = -Math.PI * 0.42;
  wave.position.set(0, -7, -3);
  rig.add(wave);
  const wBase = wGeo.attributes.position.array.slice();

  function glowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(95,208,179,.55)");
    g.addColorStop(1, "rgba(95,208,179,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  const gt = glowTexture();
  const s1 = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, transparent: true, opacity: 0.5, depthWrite: false }));
  s1.scale.set(14, 14, 1);
  s1.position.set(-5, 2, -6);
  scene.add(s1);
  const s2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, transparent: true, opacity: 0.35, depthWrite: false }));
  s2.scale.set(12, 12, 1);
  s2.position.set(6, -3, -7);
  scene.add(s2);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = camera.aspect < 0.9 ? 18 : 14;
    camera.updateProjectionMatrix();
  }
  resize();

  let tx = 0, ty = 0;
  if (!reduce) {
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  const posAttr = wGeo.attributes.position;
  function renderFrame(t) {
    for (const it of items) {
      const m = it.mesh;
      m.position.x = it.base.x + Math.sin(t * it.speed + it.phase) * 0.35;
      m.position.y = it.base.y + Math.cos(t * it.speed * 0.8 + it.phase) * 0.45;
      m.position.z = it.base.z;
      m.rotation.x += it.spin * 0.005;
      m.rotation.y += it.spin * 0.008;
    }
    for (let i = 0; i < posAttr.count; i++) {
      const x = wBase[i * 3], y = wBase[i * 3 + 1];
      posAttr.setZ(i, Math.sin(x * 0.35 + t * 0.8) * 0.6 + Math.cos(y * 0.5 + t * 0.6) * 0.4);
    }
    posAttr.needsUpdate = true;
    points.rotation.y = t * 0.02;

    camera.position.x += (tx * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (-ty * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduce) renderFrame(0);
  });

  const clock = new THREE.Clock(false);
  let raf = 0;
  function loop() {
    renderFrame(clock.getElapsedTime());
    raf = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (reduce || raf) return;
    clock.start();
    loop();
  }
  function stopLoop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop(); else startLoop();
  });

  cv.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stopLoop();
    cv.remove();
    document.body.classList.remove("has-3d");
  });

  document.body.prepend(cv);
  document.body.classList.add("has-3d");

  if (reduce) renderFrame(0);
  else startLoop();
}
