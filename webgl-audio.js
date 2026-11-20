// ==========================================================================
// UKUSA — WEBGL SHADER ENGINE & WEB AUDIO SYNTHESIZER
// ==========================================================================

// 1. PROCEDURAL WEB AUDIO ENGINE (Soft UI clicks, tactile pops, café vinyl warmth)
class UkusaSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.ambientGain = null;
    this.ambientNodes = [];
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.startAmbient();
      this.playConfirm();
    } else {
      this.stopAmbient();
    }
    return this.enabled;
  }

  startAmbient() {
    if (!this.ctx || this.ambientNodes.length > 0) return;

    // Warm vinyl crackle + low espresso bar room resonance chord
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.001, this.ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 1.5);
    master.connect(this.ctx.destination);
    this.ambientGain = master;

    // Warm sub drone (D2 + A2 + F#3 warm analog pad)
    const freqs = [73.42, 110.0, 185.0];
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      filter.type = "lowpass";
      filter.frequency.value = 240;
      g.gain.value = 0.28;
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      osc.start();
      this.ambientNodes.push(osc);
    });

    // Subtle filtered pink-noise vinyl room air
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.02;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 420;
    bandpass.Q.value = 0.7;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.45;

    whiteNoise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(master);
    whiteNoise.start();
    this.ambientNodes.push(whiteNoise);
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        this.ambientNodes.forEach((n) => {
          try { n.stop(); } catch (e) {}
        });
        this.ambientNodes = [];
      }, 450);
    } catch (e) {}
  }

  playHover() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.065);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playConfirm() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 659.25].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.05, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }
}

window.ukusaSound = new UkusaSoundEngine();

// 2. THREE.JS WEBGL LIQUID ESPRESSO & CREMA SHADER PLAYGROUND
window.initUkusaWebGL = function (container) {
  if (!container || !window.THREE) return () => {};

  const THREE = window.THREE;
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 3.4;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
  } catch (e) {
    return () => {};
  }

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Custom GLSL Simplex Noise & Liquid Crema Shader
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uPulse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    // 3D Simplex-like harmonic wave function for organic espresso viscosity
    float gyroid(vec3 p) {
      return dot(sin(p), cos(p.zxy));
    }

    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * gyroid(p);
        p = p * 2.08 + vec3(1.7, 2.3, 0.9);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vNormal = normal;
      vec3 pos = position;

      // Distance from cursor in normalized space
      vec2 mouseWorld = uMouse * 1.65;
      float distToMouse = length(pos.xy - mouseWorld);
      float mouseInfluence = smoothstep(1.45, 0.0, distToMouse);

      // Organic liquid distortion
      float slowTime = uTime * 0.55;
      float n = fbm(pos * 1.85 + vec3(slowTime, -slowTime * 0.7, slowTime * 0.4));
      float ripple = sin(distToMouse * 9.0 - uTime * 5.0) * exp(-distToMouse * 2.2) * (0.14 + uPulse * 0.25);

      float displacement = n * 0.22 + mouseInfluence * 0.24 + ripple;
      vDisplacement = displacement;

      vec3 newPos = pos + normal * displacement;
      vPosition = newPos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPulse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      // Palette: Deep Charcoal Espresso (#0B0B0C), Roasted Bean (#2D1A12),
      // Burnt Terracotta (#C85A32), Golden Crema (#D9B382), Warm Bone (#F4F3EF)
      vec3 obsidian = vec3(0.043, 0.043, 0.047);
      vec3 espresso = vec3(0.18, 0.095, 0.06);
      vec3 terracotta = vec3(0.784, 0.353, 0.196);
      vec3 crema = vec3(0.87, 0.72, 0.53);
      vec3 bone = vec3(0.957, 0.953, 0.937);

      vec3 norm = normalize(vNormal);
      vec3 lightDir1 = normalize(vec3(uMouse.x * 2.5, uMouse.y * 2.5, 2.0));
      vec3 lightDir2 = normalize(vec3(-1.5, -1.2, 1.2));

      float diff1 = max(dot(norm, lightDir1), 0.0);
      float diff2 = max(dot(norm, lightDir2), 0.0);

      // Fresnel rim light for silky liquid glass / crema sheen
      vec3 viewDir = normalize(vec3(0.0, 0.0, 3.4) - vPosition);
      float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 2.8);

      // Swirl pattern based on displacement
      float band = smoothstep(-0.22, 0.32, vDisplacement);
      float tigerStripe = sin((vDisplacement * 16.0) + uTime * 0.8) * 0.5 + 0.5;

      vec3 col = mix(obsidian, espresso, smoothstep(0.0, 0.45, band));
      col = mix(col, terracotta, smoothstep(0.35, 0.78, band) * (0.65 + uPulse * 0.35));
      col = mix(col, crema, smoothstep(0.62, 0.95, band) * tigerStripe);

      // Specular highlight
      vec3 halfVec = normalize(lightDir1 + viewDir);
      float spec = pow(max(dot(norm, halfVec), 0.0), 36.0);

      col += diff1 * crema * 0.25;
      col += diff2 * terracotta * 0.14;
      col += fresnel * mix(terracotta, bone, 0.55) * 0.65;
      col += spec * bone * 0.45;

      gl_FragColor = vec4(col, 0.94);
    }
  `;

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 },
    uPulse: { value: 0 }
  };

  // Main central organic liquid espresso torus-knot / metaball blob
  const geometry = new THREE.IcosahedronGeometry(1.18, 64);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true
  });

  const blobMesh = new THREE.Mesh(geometry, material);
  scene.add(blobMesh);

  // Outer floating orbital crema ring
  const ringGeo = new THREE.TorusGeometry(1.75, 0.012, 16, 180);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xc85a32,
    transparent: true,
    opacity: 0.32
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI * 0.35;
  scene.add(ringMesh);

  // Floating crema micro-particles around the espresso core
  const particleCount = 260;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 1.6 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xd9b382,
    size: 0.022,
    transparent: true,
    opacity: 0.55
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse tracking with smooth lerp
  const targetMouse = { x: 0, y: 0 };
  const currentMouse = { x: 0, y: 0 };
  let pulseTarget = 0;

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const onPointerDown = () => {
    pulseTarget = 1.25;
    if (window.ukusaSound) window.ukusaSound.playClick();
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  container.addEventListener("pointerdown", onPointerDown);

  const onResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);

  let rafId;
  const clock = new THREE.Clock();

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.075;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.075;
    pulseTarget += (0 - pulseTarget) * 0.06;

    uniforms.uTime.value = elapsed;
    uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
    uniforms.uPulse.value = pulseTarget;

    blobMesh.rotation.y = elapsed * 0.18 + currentMouse.x * 0.45;
    blobMesh.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - currentMouse.y * 0.35;

    ringMesh.rotation.z = elapsed * 0.12;
    ringMesh.rotation.y = currentMouse.x * 0.35;
    ringMesh.rotation.x = Math.PI * 0.35 - currentMouse.y * 0.25;

    particles.rotation.y = -elapsed * 0.05 + currentMouse.x * 0.18;
    particles.rotation.x = currentMouse.y * 0.18;

    renderer.render(scene, camera);
  };

  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    container.removeEventListener("pointerdown", onPointerDown);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
};
