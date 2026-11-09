/**
 * Our Little Forever — Cosmic Journey & Cute FX Engine
 * 2-Year Anniversary Edition ♡
 */

(() => {
  'use strict';

  // --- Romantic Pastel Palette ---
  const CUTE_COLORS = [
    '#f472b6', // soft pink
    '#ec4899', // bright rose
    '#c084fc', // lavender
    '#a7f3d0', // mint pastel
    '#fde047', // star gold
    '#fed7aa', // warm peach
    '#ffffff'  // pure starlight
  ];

  const CUTE_ICONS = ['♡', '✧', '♥', '✦', '✿', '✨', '🌸', '💫', '🪐'];

  // =========================================================================
  // 1. ROMANTIC CURSOR & TOUCH PARTICLES
  // =========================================================================
  function initHeartCursorTrail() {
    let lastSpawn = 0;
    const spawnParticle = (x, y) => {
      const now = Date.now();
      if (now - lastSpawn < 55) return; // rate-limit for 60fps performance
      lastSpawn = now;

      const p = document.createElement('span');
      p.className = 'cursor-heart-particle';
      p.textContent = CUTE_ICONS[Math.floor(Math.random() * CUTE_ICONS.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.color = CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)];

      const dx = (Math.random() - 0.5) * 50;
      const rot = (Math.random() - 0.5) * 60;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    };

    window.addEventListener('pointermove', (e) => {
      if (e.clientX && e.clientY) spawnParticle(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (t) spawnParticle(t.clientX, t.clientY);
    }, { passive: true });
  }

  // =========================================================================
  // 2. ETHEREAL CELESTIAL SOUND SYNTHESIZER (Web Audio API)
  // =========================================================================
  let fxAudioCtx = null;

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!fxAudioCtx || fxAudioCtx.state === 'closed') {
      try { fxAudioCtx = new AudioContextClass({ latencyHint: 'interactive' }); }
      catch (_) { fxAudioCtx = new AudioContextClass(); }
    }
    if (fxAudioCtx && fxAudioCtx.state === 'suspended') {
      fxAudioCtx.resume().catch(() => {});
    }
    return fxAudioCtx;
  }

  // Majestic fairytale chime when the Heaven Gate opens
  function playGateAscendSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const notes = [
        { freq: 523.25, time: 0.05, dur: 0.8 },  // C5
        { freq: 659.25, time: 0.22, dur: 0.8 },  // E5
        { freq: 783.99, time: 0.38, dur: 0.9 },  // G5
        { freq: 987.77, time: 0.55, dur: 1.1 },  // B5
        { freq: 1174.66, time: 0.72, dur: 1.2 }, // D6
        { freq: 1567.98, time: 0.90, dur: 1.6 }  // G6 (celestial high chime)
      ];

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.1);
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
      master.connect(ctx.destination);

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + n.time;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(start + n.dur + 0.05);
      });
    } catch (e) {
      console.debug('Gate audio unavailable:', e);
    }
  }

  // Gentle soft chime when sliding through memories
  function playWarpChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const master = ctx.createGain();
      const now = ctx.currentTime + 0.02;
      master.gain.setValueAtTime(0.22, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(739.99, now); // F#5
      osc.frequency.exponentialRampToValueAtTime(1108.73, now + 0.18); // C#6

      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.76);
    } catch (_) {}
  }

  // =========================================================================
  // 3. 60FPS COSMIC VOYAGE CANVAS ENGINE
  // =========================================================================
  class CosmicVoyageCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.stars = [];
      this.shootingStars = [];
      this.floatingPlanets = [];
      this.animId = null;
      this.isRunning = false;
      this.warpProgress = 0;
      this.isWarping = false;
      this.lastShootingStar = 0;

      this.resize = this.resize.bind(this);
      this.loop = this.loop.bind(this);

      window.addEventListener('resize', this.resize, { passive: true });
      this.resize();
      this.initObjects();
    }

    resize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
    }

    initObjects() {
      // 160 parallax 3D stars
      this.stars = [];
      const count = window.innerWidth < 768 ? 95 : 170;
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: (Math.random() - 0.5) * this.width * 2.2,
          y: (Math.random() - 0.5) * this.height * 2.2,
          z: Math.random() * 1000 + 1,
          size: Math.random() * 1.8 + 0.6,
          color: CUTE_COLORS[Math.floor(Math.random() * CUTE_COLORS.length)],
          twinkleSpeed: Math.random() * 0.03 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // Cute floating celestial bodies (mini pastel planets, hearts)
      this.floatingPlanets = [
        { x: this.width * 0.15, y: this.height * 0.22, r: 18, color: '#f472b6', ringColor: '#fed7e8', angle: 0.3, speed: 0.004 },
        { x: this.width * 0.85, y: this.height * 0.35, r: 14, color: '#c084fc', ringColor: '#fbcfe8', angle: -0.4, speed: 0.003 },
        { x: this.width * 0.78, y: this.height * 0.82, r: 10, color: '#fed7aa', ringColor: '#fde047', angle: 0.2, speed: 0.005 }
      ];
    }

    triggerWarp() {
      this.isWarping = true;
      this.warpProgress = 1.0;
      playWarpChime();
    }

    spawnShootingStar() {
      const fromLeft = Math.random() > 0.5;
      this.shootingStars.push({
        x: fromLeft ? Math.random() * this.width * 0.4 : this.width * 0.6 + Math.random() * this.width * 0.4,
        y: Math.random() * (this.height * 0.35),
        length: Math.random() * 90 + 70,
        speed: Math.random() * 14 + 18,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        life: 1.0,
        decay: Math.random() * 0.018 + 0.016,
        color: Math.random() > 0.5 ? '#f472b6' : '#fde047',
        hasHeartSpark: true
      });
    }

    loop() {
      if (!this.isRunning) return;
      const ctx = this.ctx;
      const now = Date.now();

      // Clear with slight trail during warp
      ctx.clearRect(0, 0, this.width, this.height);

      // Handle Warp Speed physics
      let speedFactor = 1.2;
      if (this.isWarping) {
        speedFactor += this.warpProgress * 28;
        this.warpProgress -= 0.024;
        if (this.warpProgress <= 0) {
          this.warpProgress = 0;
          this.isWarping = false;
        }
      }

      // Draw Parallax 3D Stardust
      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.z -= speedFactor;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * this.width * 2.2;
          star.y = (Math.random() - 0.5) * this.height * 2.2;
        }

        const k = 400 / star.z;
        const px = star.x * k + this.centerX;
        const py = star.y * k + this.centerY;

        if (px < -20 || px > this.width + 20 || py < -20 || py > this.height + 20) continue;

        star.twinklePhase += star.twinkleSpeed;
        const alpha = Math.min(1, Math.max(0.3, (1 - star.z / 1000) * (0.6 + 0.4 * Math.sin(star.twinklePhase))));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;

        if (this.isWarping && this.warpProgress > 0.1) {
          // Lightspeed streak line pointing outward from center
          const prevK = 400 / (star.z + speedFactor * 3.5);
          const prevPx = star.x * prevK + this.centerX;
          const prevPy = star.y * prevK + this.centerY;

          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.max(1, star.size * k * 0.8);
          ctx.moveTo(px, py);
          ctx.lineTo(prevPx, prevPy);
          ctx.stroke();
        } else {
          // Soft circular star with mini aura
          const radius = Math.max(0.7, star.size * k * 0.6);
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();

          // Occasional sparkle cross on brighter stars
          if (star.size > 2.0 && star.z < 450) {
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(px - 3, py);
            ctx.lineTo(px + 3, py);
            ctx.moveTo(px, py - 3);
            ctx.lineTo(px, py + 3);
            ctx.stroke();
          }
        }
      }

      // Draw Floating Cute Planets
      for (const planet of this.floatingPlanets) {
        planet.angle += planet.speed;
        const floatY = planet.y + Math.sin(planet.angle) * 12;

        ctx.save();
        ctx.translate(planet.x, floatY);

        // Planet body
        ctx.globalAlpha = 0.85;
        const grad = ctx.createRadialGradient(-planet.r * 0.3, -planet.r * 0.3, planet.r * 0.1, 0, 0, planet.r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, planet.color);
        grad.addColorStop(1, '#3b0764');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, planet.r, 0, Math.PI * 2);
        ctx.fill();

        // Saturn-like cute ring
        ctx.strokeStyle = planet.ringColor;
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.r * 1.9, planet.r * 0.55, -0.3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Spawn periodic cute shooting stars
      if (now - this.lastShootingStar > 3200 && Math.random() < 0.4) {
        this.spawnShootingStar();
        this.lastShootingStar = now;
      }

      // Update and Draw Shooting Stars with Heart Trails
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        const vx = Math.cos(s.angle) * s.speed;
        const vy = Math.sin(s.angle) * s.speed;

        s.x += vx;
        s.y += vy;
        s.life -= s.decay;

        if (s.life <= 0 || s.x > this.width + 100 || s.y > this.height + 100) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.life;

        // Meteor trail gradient
        const trailX = s.x - Math.cos(s.angle) * s.length;
        const trailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(trailX, trailY, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, 'rgba(244, 114, 182, 0.4)');
        grad.addColorStop(1, s.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Glowing star head with mini heart
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '14px serif';
        ctx.fillStyle = '#ff80bf';
        ctx.fillText('♡', s.x + 4, s.y - 4);

        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      this.animId = requestAnimationFrame(this.loop);
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.loop();
    }

    stop() {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  // =========================================================================
  // 4. STARTER MEMORIES (FOR INSTANT DREAMY PREVIEW)
  // =========================================================================
  function getStarterMemories() {
    return [
      {
        id: 'starter-1',
        name: 'Ngày đầu tiên chúng mình có nhau ♡',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff1f6"/>
                <stop offset="45%" stop-color="#fed7e8"/>
                <stop offset="100%" stop-color="#ebd4fc"/>
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg1)"/>
            <circle cx="400" cy="230" r="160" fill="#ffffff" opacity="0.85" filter="url(#softGlow)"/>
            <g transform="translate(400,210) scale(3.2)">
              <path d="M0,12 C-18,-8 -36,4 -18,22 L0,40 L18,22 C36,4 18,-8 0,12 Z" fill="#ec4899" filter="drop-shadow(0 4px 10px rgba(236,72,153,0.45))"/>
            </g>
            <text x="400" y="380" font-family="'Playfair Display', serif" font-size="36" font-weight="700" fill="#831843" text-anchor="middle">25 · 11 · 2024</text>
            <text x="400" y="420" font-family="'Nunito', sans-serif" font-size="20" font-weight="700" fill="#9d174d" text-anchor="middle">Cột mốc mở ra câu chuyện đẹp nhất của hai đứa mình ♡</text>
            <text x="400" y="460" font-family="'Nunito', sans-serif" font-size="14" font-weight="600" fill="#be185d" text-anchor="middle">✦ Đăng nhập Quản trị để tải những bức ảnh kỷ niệm thật lên đây nhé ✦</text>
          </svg>
        `)
      },
      {
        id: 'starter-2',
        name: 'Những khoảnh khắc dịu dàng & đáng yêu ✧',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fdf4ff"/>
                <stop offset="50%" stop-color="#fae8ff"/>
                <stop offset="100%" stop-color="#e0e7ff"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg2)"/>
            <circle cx="400" cy="220" r="150" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="240" font-size="76" text-anchor="middle">🪐 ✨ 💖</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#581c87" text-anchor="middle">Từng ngày bên em là một món quà</text>
            <text x="400" y="415" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#6b21a8" text-anchor="middle">Nụ cười, tin nhắn, những cái ôm và điều bé xíu khiến anh nhớ mãi ♡</text>
          </svg>
        `)
      },
      {
        id: 'starter-3',
        name: 'Hành trình 2 năm & Mãi mãi về sau ✦',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef3c7"/>
                <stop offset="50%" stop-color="#fce7f3"/>
                <stop offset="100%" stop-color="#ede9fe"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg3)"/>
            <circle cx="400" cy="220" r="150" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="240" font-size="76" text-anchor="middle">🚀 💫 🌸</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#701a75" text-anchor="middle">Kỷ niệm 2 năm đong đầy yêu thương</text>
            <text x="400" y="415" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#86198f" text-anchor="middle">Đi qua một vòng ngân hà — chuyện mình vẫn luôn được viết tiếp ♡</text>
          </svg>
        `)
      }
    ];
  }

  // =========================================================================
  // 5. GLOBAL EXPORTS & INITIALIZATION
  // =========================================================================
  let cosmicCanvasInstance = null;

  window.OurLoveFX = {
    init() {
      initHeartCursorTrail();
      if (document.getElementById('journeyCanvas')) {
        cosmicCanvasInstance = new CosmicVoyageCanvas('journeyCanvas');
      }
    },
    startCosmicCanvas() {
      if (cosmicCanvasInstance) cosmicCanvasInstance.start();
    },
    stopCosmicCanvas() {
      if (cosmicCanvasInstance) cosmicCanvasInstance.stop();
    },
    triggerCosmicWarp() {
      if (cosmicCanvasInstance) cosmicCanvasInstance.triggerWarp();
    },
    playGateAscendSound,
    playWarpChime,
    getStarterMemories
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.OurLoveFX.init());
  } else {
    window.OurLoveFX.init();
  }
})();
