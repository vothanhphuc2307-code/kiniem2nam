/**
 * Our Little Forever — Dual-Engine (PC Elaborate & Mobile Lag-Free 60fps)
 * 2-Year Anniversary Edition ♡
 */

(() => {
  'use strict';

  const CUTE_COLORS = [
    '#f472b6', // soft pink
    '#ec4899', // bright rose
    '#c084fc', // lavender
    '#a7f3d0', // mint pastel
    '#fde047', // star gold
    '#fed7aa', // warm peach
    '#ffffff'  // pure starlight
  ];

  const CUTE_ICONS = ['♡', '✧', '♥', '✦', '✿', '✨', '🌸'];

  // =========================================================================
  // 1. DEVICE MODE MANAGER (DEDICATED MOBILE MODE vs ELABORATE PC MODE)
  // =========================================================================
  let currentMode = 'pc'; // 'mobile' | 'pc'
  let manualOverride = null;

  function detectNaturalMode() {
    const isSmallScreen = window.matchMedia('(max-width: 820px)').matches;
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    return (isSmallScreen || isMobileUA) ? 'mobile' : 'pc';
  }

  function applyDeviceMode(mode, notifyUser = false) {
    currentMode = mode;
    const isMobile = mode === 'mobile';
    document.body.classList.toggle('is-mobile-mode', isMobile);
    document.body.classList.toggle('is-pc-mode', !isMobile);
    document.documentElement.dataset.viewMode = mode;

    const btn = document.getElementById('deviceModeToggle');
    if (btn) {
      btn.innerHTML = isMobile
        ? '<span class="mode-dot mode-dot--mobile"></span>📱 Bản Mobile Mượt'
        : '<span class="mode-dot mode-dot--pc"></span>💻 Bản PC Cầu Kỳ';
      btn.setAttribute('aria-label', isMobile
        ? 'Đang ở Bản Mobile Mượt (Tối ưu chống lag). Nhấn để thử Bản PC Cầu Kỳ'
        : 'Đang ở Bản PC Cầu Kỳ (Đầy đủ hiệu ứng 3D). Nhấn để chuyển sang Bản Mobile Mượt');
    }

    if (cosmicCanvasInstance) {
      cosmicCanvasInstance.setProfile(mode);
    }

    if (notifyUser) {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = isMobile
          ? 'Đã bật Bản Mobile: Giao diện gọn đẹp & tối ưu 60fps siêu mượt ♡'
          : 'Đã bật Bản PC Cầu Kỳ: Hiệu ứng 3D thiên hà & khung viền tinh xảo ✦';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
      }
    }
  }

  function initDeviceModeManager() {
    try {
      const saved = sessionStorage.getItem('our-love-view-mode');
      if (saved === 'mobile' || saved === 'pc') manualOverride = saved;
    } catch (_) {}

    applyDeviceMode(manualOverride || detectNaturalMode(), false);

    window.matchMedia('(max-width: 820px)').addEventListener?.('change', () => {
      if (!manualOverride) applyDeviceMode(detectNaturalMode(), false);
    });

    const btn = document.getElementById('deviceModeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const nextMode = currentMode === 'mobile' ? 'pc' : 'mobile';
        manualOverride = nextMode;
        try { sessionStorage.setItem('our-love-view-mode', nextMode); } catch (_) {}
        applyDeviceMode(nextMode, true);
      });
    }
  }

  // =========================================================================
  // 2. LAG-FREE ROMANTIC CURSOR & TAP PARTICLES + PC 3D PARALLAX
  // =========================================================================
  function initHeartCursorTrail() {
    let lastSpawn = 0;
    let activeParticles = 0;
    const MAX_PARTICLES = 12;

    const spawnParticle = (x, y) => {
      if (activeParticles >= MAX_PARTICLES) return;
      const now = performance.now();
      const minInterval = currentMode === 'mobile' ? 180 : 95;
      if (now - lastSpawn < minInterval) return;
      lastSpawn = now;

      activeParticles++;
      const p = document.createElement('span');
      p.className = 'cursor-heart-particle';
      p.textContent = CUTE_ICONS[(Math.random() * CUTE_ICONS.length) | 0];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.color = CUTE_COLORS[(Math.random() * CUTE_COLORS.length) | 0];

      const dx = ((Math.random() - 0.5) * 44) | 0;
      const rot = ((Math.random() - 0.5) * 50) | 0;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(p);
      setTimeout(() => {
        p.remove();
        activeParticles = Math.max(0, activeParticles - 1);
      }, 950);
    };

    // PC: Subtle trail on pointer move + 3D parallax variables
    let rafTilt = null;
    let targetTiltX = 0;
    let targetTiltY = 0;

    window.addEventListener('pointermove', (e) => {
      if (currentMode === 'mobile' || e.pointerType === 'touch') return;
      if (e.clientX && e.clientY) {
        spawnParticle(e.clientX, e.clientY);
        // Lightweight 3D tilt for PC mode
        targetTiltX = ((e.clientX / window.innerWidth) - 0.5) * 2;
        targetTiltY = ((e.clientY / window.innerHeight) - 0.5) * 2;
        if (!rafTilt) {
          rafTilt = requestAnimationFrame(() => {
            rafTilt = null;
            document.documentElement.style.setProperty('--pc-tilt-x', `${(targetTiltX * 4.5).toFixed(2)}deg`);
            document.documentElement.style.setProperty('--pc-tilt-y', `${(-targetTiltY * 3.5).toFixed(2)}deg`);
            if (cosmicCanvasInstance) {
              cosmicCanvasInstance.setMouseOffset(targetTiltX * 22, targetTiltY * 16);
            }
          });
        }
      }
    }, { passive: true });

    // Mobile & PC: Spawn cute heart on tap/click (never during touch scroll!)
    window.addEventListener('pointerdown', (e) => {
      if (e.clientX && e.clientY) spawnParticle(e.clientX, e.clientY);
    }, { passive: true });
  }

  // =========================================================================
  // 3. ETHEREAL CELESTIAL SOUND SYNTHESIZER (Web Audio API)
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

  function playGateAscendSound() {
    try {
      if (localStorage.getItem('our-love-click-sound-v2') === 'off') return;
    } catch (_) {}
    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const notes = [
        { freq: 523.25, time: 0.04, dur: 0.75 },  // C5
        { freq: 659.25, time: 0.18, dur: 0.75 },  // E5
        { freq: 783.99, time: 0.32, dur: 0.85 },  // G5
        { freq: 987.77, time: 0.46, dur: 1.0 },   // B5
        { freq: 1174.66, time: 0.62, dur: 1.15 }, // D6
        { freq: 1567.98, time: 0.78, dur: 1.45 }  // G6
      ];

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.08);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      master.connect(ctx.destination);

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + n.time;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.22, start + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(start + n.dur + 0.04);
      });
    } catch (_) {}
  }

  function playWarpChime() {
    try {
      if (localStorage.getItem('our-love-click-sound-v2') === 'off') return;
    } catch (_) {}
    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state !== 'running') return;

      const master = ctx.createGain();
      const now = ctx.currentTime + 0.01;
      master.gain.setValueAtTime(0.16, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.16); // B5

      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.56);
    } catch (_) {}
  }

  // =========================================================================
  // 4. ZERO-LAG 60FPS COSMIC VOYAGE CANVAS ENGINE (NO SHADOWBLUR!)
  // =========================================================================
  class CosmicVoyageCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
      this.stars = [];
      this.shootingStars = [];
      this.floatingPlanets = [];
      this.animId = null;
      this.isRunning = false;
      this.warpProgress = 0;
      this.isWarping = false;
      this.lastShootingStar = 0;
      this.profile = currentMode;
      this.mouseOffsetX = 0;
      this.mouseOffsetY = 0;

      this.resize = this.resize.bind(this);
      this.loop = this.loop.bind(this);

      window.addEventListener('resize', this.resize, { passive: true });
      this.resize();
      this.initObjects();
    }

    setProfile(mode) {
      if (this.profile === mode) return;
      this.profile = mode;
      this.resize();
      this.initObjects();
    }

    setMouseOffset(ox, oy) {
      this.mouseOffsetX = ox;
      this.mouseOffsetY = oy;
    }

    resize() {
      if (!this.canvas) return;
      // Mobile uses dpr = 1 for ultra-fast fill rate; PC uses up to 1.5
      const maxDpr = this.profile === 'mobile' ? 1 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
    }

    initObjects() {
      this.stars = [];
      const isMob = this.profile === 'mobile';
      const count = isMob ? 48 : 135;
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: (Math.random() - 0.5) * this.width * 2.0,
          y: (Math.random() - 0.5) * this.height * 2.0,
          z: Math.random() * 1000 + 1,
          size: Math.random() * 1.7 + 0.7,
          color: CUTE_COLORS[(Math.random() * CUTE_COLORS.length) | 0],
          twinkleSpeed: Math.random() * 0.025 + 0.012,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      if (isMob) {
        this.floatingPlanets = [
          { x: this.width * 0.14, y: this.height * 0.18, r: 11, color: '#f472b6', ringColor: '#fed7e8', angle: 0.3, speed: 0.008 },
          { x: this.width * 0.86, y: this.height * 0.78, r: 9, color: '#c084fc', ringColor: '#fbcfe8', angle: -0.3, speed: 0.007 }
        ];
      } else {
        this.floatingPlanets = [
          { x: this.width * 0.11, y: this.height * 0.20, r: 18, color: '#f472b6', ringColor: '#fed7e8', angle: 0.3, speed: 0.008 },
          { x: this.width * 0.89, y: this.height * 0.24, r: 14, color: '#c084fc', ringColor: '#fbcfe8', angle: -0.4, speed: 0.006 },
          { x: this.width * 0.84, y: this.height * 0.80, r: 12, color: '#fed7aa', ringColor: '#fde047', angle: 0.2, speed: 0.009 },
          { x: this.width * 0.15, y: this.height * 0.78, r: 10, color: '#a7f3d0', ringColor: '#ffffff', angle: -0.2, speed: 0.007 }
        ];
      }
    }

    triggerWarp() {
      this.isWarping = true;
      this.warpProgress = 1.0;
      playWarpChime();
    }

    spawnShootingStar() {
      const fromLeft = Math.random() > 0.5;
      this.shootingStars.push({
        x: fromLeft ? Math.random() * this.width * 0.35 : this.width * 0.55 + Math.random() * this.width * 0.35,
        y: Math.random() * (this.height * 0.32),
        length: this.profile === 'mobile' ? 55 : 85,
        speed: this.profile === 'mobile' ? 12 : 16,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.18,
        life: 1.0,
        decay: 0.022,
        color: Math.random() > 0.5 ? '#f472b6' : '#fde047'
      });
    }

    loop() {
      if (!this.isRunning) return;
      const ctx = this.ctx;
      const now = performance.now();
      const isMob = this.profile === 'mobile';

      ctx.clearRect(0, 0, this.width, this.height);

      // Smooth gentle warp speed during photo transitions
      let speedFactor = isMob ? 0.9 : 1.15;
      if (this.isWarping) {
        speedFactor += this.warpProgress * (isMob ? 14 : 20);
        this.warpProgress -= 0.032;
        if (this.warpProgress <= 0) {
          this.warpProgress = 0;
          this.isWarping = false;
        }
      }

      const cx = this.centerX + (isMob ? 0 : this.mouseOffsetX);
      const cy = this.centerY + (isMob ? 0 : this.mouseOffsetY);

      // Draw Parallax 3D Stardust
      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];
        star.z -= speedFactor;
        if (star.z <= 1) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * this.width * 2.0;
          star.y = (Math.random() - 0.5) * this.height * 2.0;
        }

        const k = 400 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px < -10 || px > this.width + 10 || py < -10 || py > this.height + 10) continue;

        star.twinklePhase += star.twinkleSpeed;
        const alpha = Math.min(0.95, Math.max(0.25, (1 - star.z / 1000) * (0.65 + 0.35 * Math.sin(star.twinklePhase))));

        ctx.globalAlpha = alpha;

        if (this.isWarping && this.warpProgress > 0.12) {
          const prevK = 400 / (star.z + speedFactor * 2.6);
          const prevPx = star.x * prevK + cx;
          const prevPy = star.y * prevK + cy;

          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = Math.max(1, star.size * k * 0.65);
          ctx.moveTo(px, py);
          ctx.lineTo(prevPx, prevPy);
          ctx.stroke();
        } else {
          const radius = Math.max(0.8, star.size * k * 0.55);
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();

          // Soft halo circle without expensive shadowBlur
          if (!isMob && radius > 1.35) {
            ctx.globalAlpha = alpha * 0.25;
            ctx.beginPath();
            ctx.arc(px, py, radius * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Floating Cute Planets
      for (let i = 0; i < this.floatingPlanets.length; i++) {
        const planet = this.floatingPlanets[i];
        planet.angle += planet.speed;
        const floatY = planet.y + Math.sin(planet.angle) * 9;
        const floatX = planet.x + (isMob ? 0 : this.mouseOffsetX * -0.4);

        ctx.save();
        ctx.translate(floatX, floatY);

        // Soft outer glow circle (zero shadowBlur!)
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(0, 0, planet.r * 1.45, 0, Math.PI * 2);
        ctx.fill();

        // Planet core
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(0, 0, planet.r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight dot
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-planet.r * 0.32, -planet.r * 0.32, planet.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Saturn ring
        ctx.strokeStyle = planet.ringColor;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.r * 1.85, planet.r * 0.5, -0.28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Periodic Shooting Stars
      const shootInterval = isMob ? 4800 : 3200;
      if (now - this.lastShootingStar > shootInterval && Math.random() < 0.35) {
        this.spawnShootingStar();
        this.lastShootingStar = now;
      }

      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= s.decay;

        if (s.life <= 0 || s.x > this.width + 80 || s.y > this.height + 80) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.life;

        const trailX = s.x - Math.cos(s.angle) * s.length;
        const trailY = s.y - Math.sin(s.angle) * s.length;

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Star tip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      this.animId = requestAnimationFrame(this.loop);
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.resize();
      this.loop();
    }

    stop() {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  // =========================================================================
  // 5. 6 STARTER MEMORIES (SO ALL 5 ORBIT SLOTS SHOW UNIQUE ARTWORK)
  // =========================================================================
  function getStarterMemories() {
    return [
      {
        id: 'starter-1',
        name: '25.11.2024 · Ngày đầu tiên chúng mình có nhau ♡',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff1f6"/><stop offset="50%" stop-color="#fed7e8"/><stop offset="100%" stop-color="#ebd4fc"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg1)"/>
            <circle cx="400" cy="220" r="145" fill="#ffffff" opacity="0.88"/>
            <g transform="translate(400,200) scale(3.1)">
              <path d="M0,12 C-18,-8 -36,4 -18,22 L0,40 L18,22 C36,4 18,-8 0,12 Z" fill="#ec4899"/>
            </g>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="36" font-weight="700" fill="#831843" text-anchor="middle">25 · 11 · 2024</text>
            <text x="400" y="418" font-family="'Nunito', sans-serif" font-size="20" font-weight="700" fill="#9d174d" text-anchor="middle">Cột mốc mở ra câu chuyện đẹp nhất của hai đứa mình ♡</text>
            <text x="400" y="458" font-family="'Nunito', sans-serif" font-size="14" font-weight="600" fill="#be185d" text-anchor="middle">✦ Đăng nhập Quản trị để thêm những bức ảnh kỷ niệm thật nhé ✦</text>
          </svg>
        `)
      },
      {
        id: 'starter-2',
        name: 'Những buổi hẹn hò & tiếng cười trong veo ✧',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fdf4ff"/><stop offset="50%" stop-color="#fae8ff"/><stop offset="100%" stop-color="#e0e7ff"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg2)"/>
            <circle cx="400" cy="220" r="145" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="242" font-size="74" text-anchor="middle">🪐 ✨ 💖</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#581c87" text-anchor="middle">Từng ngày bên em là một món quà</text>
            <text x="400" y="418" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#6b21a8" text-anchor="middle">Nụ cười, tin nhắn và những điều bé xíu khiến anh nhớ mãi ♡</text>
          </svg>
        `)
      },
      {
        id: 'starter-3',
        name: 'Những chuyến đi & bầu trời của riêng hai đứa ✦',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#fce7f3"/><stop offset="100%" stop-color="#ede9fe"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg3)"/>
            <circle cx="400" cy="220" r="145" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="242" font-size="74" text-anchor="middle">🚀 💫 🌸</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#701a75" text-anchor="middle">Cùng nhau đi qua muôn nơi</text>
            <text x="400" y="418" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#86198f" text-anchor="middle">Dù ở đâu, chỉ cần có em bên cạnh đều là nhà ♡</text>
          </svg>
        `)
      },
      {
        id: 'starter-4',
        name: 'Những cái ôm dịu dàng sau ngày dài ✿',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffe4e6"/><stop offset="50%" stop-color="#fbcfe8"/><stop offset="100%" stop-color="#ddd6fe"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg4)"/>
            <circle cx="400" cy="220" r="145" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="242" font-size="74" text-anchor="middle">🌙 🌷 💌</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#881337" text-anchor="middle">Bình yên trong từng khoảnh khắc</text>
            <text x="400" y="418" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#9f1239" text-anchor="middle">Cảm ơn em vì luôn dịu dàng và thương anh thật nhiều ♡</text>
          </svg>
        `)
      },
      {
        id: 'starter-5',
        name: 'Kỷ niệm 2 năm & Ngàn vì sao phía trước ♥',
        kind: 'image',
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
            <defs>
              <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fae8ff"/><stop offset="50%" stop-color="#f5d0fe"/><stop offset="100%" stop-color="#fecdd3"/>
              </linearGradient>
            </defs>
            <rect width="800" height="560" rx="24" fill="url(#bg5)"/>
            <circle cx="400" cy="220" r="145" fill="#ffffff" opacity="0.9"/>
            <text x="400" y="242" font-size="74" text-anchor="middle">👑 💍 ✨</text>
            <text x="400" y="375" font-family="'Playfair Display', serif" font-size="34" font-weight="700" fill="#701a75" text-anchor="middle">Happy 2nd Anniversary</text>
            <text x="400" y="418" font-family="'Nunito', sans-serif" font-size="19" font-weight="700" fill="#86198f" text-anchor="middle">25.11.2024 — 25.11.2026 · Thương em bé của anh mãi mãi ♡</text>
          </svg>
        `)
      }
    ];
  }

  // =========================================================================
  // 6. GLOBAL EXPORTS & INITIALIZATION
  // =========================================================================
  let cosmicCanvasInstance = null;

  window.OurLoveFX = {
    init() {
      initDeviceModeManager();
      initHeartCursorTrail();
      if (document.getElementById('journeyCanvas')) {
        cosmicCanvasInstance = new CosmicVoyageCanvas('journeyCanvas');
      }
    },
    getMode() {
      return currentMode;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.OurLoveFX.init());
  } else {
    window.OurLoveFX.init();
  }
})();
