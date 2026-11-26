// ==========================================
// 0. LUXURY SMOOTH INERTIAL SCROLL (LENIS)
// ==========================================
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.3,
  });

  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);
  window.lenis = lenis;
}

/**
 * JIMMY JANI & PALAK NAYAK | WEDDING INVITATION SCRIPT
 * Target Date: February 27 - 28, 2027
 * Venue: Fairfield by Marriott Hotel, Andheri East, Mumbai
 */

// Target Wedding Commencement Date: February 27, 2027, 18:00:00 (Sangeet Sandhya, 6:00 PM)
const weddingDate = new Date("2027-02-27T18:00:00");

// ==========================================
// 1. REALISTIC FESTIVE WEDDING FIREWORKS SIMULATION
// Pinpoint sparkling dot ascent (NOT a huge ball), crisp realistic blast
// Rich darker tones (Crimson, Deep Orange, Royal Sapphire Blue)
// Fully responsive with time-based delta-time physics
// ==========================================
const canvas = document.getElementById('fireworksCanvas') || document.getElementById('lanternCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let width = 0;
let height = 0;
let dpr = 1;

function resizeFireworksCanvas() {
  if (!canvas) return;
  const isMobile = window.innerWidth < 768;
  // Clamped DPR on mobile avoids rendering millions of extra pixels while maintaining high-DPI clarity
  dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2);
  const hero = document.getElementById('hero');
  width = hero ? hero.clientWidth : window.innerWidth;
  height = hero ? hero.clientHeight : window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

window.addEventListener('resize', resizeFireworksCanvas);
resizeFireworksCanvas();

// Rich, Darker Festive Palettes (Ruby Red, Deep Orange, Royal Sapphire Blue, Bronze)
const FIREWORK_PALETTES = [
  // 1. Deep Crimson & Ruby Red
  { name: 'ruby', colors: ['#d00000', '#9d0208', '#dc2f02', '#6a040f', '#b7094c'], core: '#ffccd5' },
  // 2. Deep Burnt Orange & Saffron
  { name: 'orange', colors: ['#e85d04', '#dc2f02', '#ca6702', '#bb3e03', '#9b2226'], core: '#ffe6a7' },
  // 3. Deep Royal Sapphire & Midnight Blue
  { name: 'sapphire', colors: ['#0077b6', '#023e8a', '#03045e', '#1d3557', '#0096c7'], core: '#caf0f8' },
  // 4. Regal Jewel Blend: Dark Crimson Red & Sapphire Blue
  { name: 'jewel', colors: ['#d00000', '#023e8a', '#9d0208', '#0077b6', '#dc2f02'], core: '#ffd166' },
  // 5. Deep Copper & Antique Bronze
  { name: 'bronze', colors: ['#c1440e', '#9c6644', '#7f5539', '#e85d04', '#b08968'], core: '#fff3b0' }
];

// Active Rockets and Sparks Collections
const activeRockets = [];
const activeSparks = [];

// Rocket Launch Class: Sleek, visible golden sparkle shooting gracefully upward (Always golden!)
class FireworkRocket {
  constructor(targetX, targetY, startX = null, options = {}) {
    const isMobile = width < 768;
    this.startX = startX !== null ? startX : targetX + (Math.random() - 0.5) * 35;
    this.startY = height + 10;
    this.x = this.startX;
    this.y = this.startY;
    this.targetX = targetX;
    this.targetY = targetY;

    // Palette & Shape selection for the blast
    const paletteIndex = options.paletteIndex !== undefined 
      ? options.paletteIndex 
      : Math.floor(Math.random() * FIREWORK_PALETTES.length);
    this.palette = FIREWORK_PALETTES[paletteIndex];
    this.type = options.type || (Math.random() < 0.38 ? 'willow' : (Math.random() < 0.55 ? 'ring' : 'peony'));

    // Normal, responsive ascent flight duration (1.05s to 1.25s)
    this.duration = 1.05 + Math.random() * 0.2;
    this.elapsed = 0;

    // Sleek continuous golden streamer trail
    this.trail = [];
    this.trailLength = isMobile ? 14 : 20;
    // Fizzy micro-sparks shedding from tail
    this.fizzSparks = [];
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update(dt) {
    this.elapsed += dt;
    const progress = Math.min(1, this.elapsed / this.duration);
    
    // Natural ease-out deceleration towards apex
    const ease = 1 - Math.pow(1 - progress, 2.15);
    this.x = this.startX + (this.targetX - this.startX) * ease;
    this.y = this.startY + (this.targetY - this.startY) * ease;

    // Record position for sleek continuous comet streamer
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    // Shed 1 tiny golden fizz spark along the ascent
    const isMobile = width < 768;
    const maxFizz = isMobile ? 5 : 9;
    if (this.fizzSparks.length < maxFizz && Math.random() < (isMobile ? 0.45 : 0.75)) {
      this.fizzSparks.push({
        x: this.x + (Math.random() - 0.5) * 2.5,
        y: this.y + Math.random() * 3.0,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.6 + Math.random() * 1.0,
        alpha: 0.92,
        size: 0.8 + Math.random() * 0.6
      });
    }

    // Update fizzy sparks
    for (let i = this.fizzSparks.length - 1; i >= 0; i--) {
      const sp = this.fizzSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= dt * 3.4;
      if (sp.alpha <= 0.05) {
        this.fizzSparks.splice(i, 1);
      }
    }

    // Explode right at apex
    if (progress >= 1) {
      this.explode();
      return false;
    }
    return true;
  }

  draw(time) {
    if (!ctx) return;
    
    // 1. Sleek Tapered Golden Comet Streamer (Continuous ribbon drawn in 2 passes)
    const len = this.trail.length;
    if (len > 1) {
      // Pass A: Soft warm golden halo streamer
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#ff9e00';
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < len; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.stroke();

      // Pass B: Intense radiant golden core streamer
      ctx.globalAlpha = 0.92;
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < len; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.stroke();
    }

    // 2. Fizzy shedding golden sparks
    for (let i = 0; i < this.fizzSparks.length; i++) {
      const sp = this.fizzSparks[i];
      ctx.globalAlpha = sp.alpha * 0.9;
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Rising Head: Sleek, luminous golden sparkle (Fixed golden color!)
    const flicker = 0.88 + Math.sin(this.elapsed * 42 + this.twinklePhase) * 0.12;

    // Outer warm gold halo
    ctx.globalAlpha = 0.35 * flicker;
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Brilliant golden sparkle body
    ctx.globalAlpha = 0.92 * flicker;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Piercing hot white spark center
    ctx.globalAlpha = 1.0 * flicker;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Sleek 4-point sparkle cross star glint
    ctx.globalAlpha = 0.85 * flicker;
    ctx.strokeStyle = '#fff8e7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(this.x - 5.5, this.y);
    ctx.lineTo(this.x + 5.5, this.y);
    ctx.moveTo(this.x, this.y - 5.5);
    ctx.lineTo(this.x, this.y + 5.5);
    ctx.stroke();
  }

  explode() {
    createBurst(this.x, this.y, this.palette, this.type);
  }
}

// Burst Particle Class (Time-based graceful lingering embers)
class FireworkSpark {
  constructor(x, y, vx, vy, color, secondaryColor = '#ffffff', options = {}) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.secondaryColor = secondaryColor;

    this.isWillow = options.isWillow || false;
    this.size = options.size || (1.3 + Math.random() * 0.8);
    this.alpha = 1;
    
    // Normal energetic lifespan: 1.6s to 2.2s
    this.lifespan = options.lifespan || (1.6 + Math.random() * 0.5);
    this.decayRate = 1.0 / this.lifespan;
    
    this.drag = options.drag || 0.958;
    this.gravity = options.gravity || (this.isWillow ? 0.075 : 0.042);

    this.flickerSpeed = 8 + Math.random() * 8;
    this.flickerOffset = Math.random() * Math.PI * 2;
  }

  update(dt, time) {
    this.prevX = this.x;
    this.prevY = this.y;

    const step = dt * 60;
    const currentDrag = Math.pow(this.drag, step);
    this.vx *= currentDrag;
    this.vy = this.vy * currentDrag + this.gravity * step;
    this.x += this.vx * step;
    this.y += this.vy * step;

    this.alpha -= this.decayRate * dt;
    return this.alpha > 0.02;
  }

  draw(time) {
    if (!ctx) return;
    const flicker = Math.sin(time * this.flickerSpeed + this.flickerOffset) * 0.12;
    const currentAlpha = Math.max(0.08, Math.min(1, this.alpha + flicker));

    // 1. Sleek trailing motion streak (clean 60fps single-stroke trail)
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = currentAlpha * 0.5;
    ctx.lineWidth = this.size * 0.9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.prevX, this.prevY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // 2. Spark Core
    ctx.globalAlpha = currentAlpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // 3. Hot center sparkle for bright sparks
    if (currentAlpha > 0.38) {
      ctx.fillStyle = this.secondaryColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Function to Create Authentic Festive Fireworks Bursts (NO HUGE BALL FLASH)
function createBurst(x, y, palette, type = 'peony') {
  const isMobile = width < 768;

  // Tiny pop spark at explosion center (Only ~1.8px micro-flash)
  activeSparks.push({
    x: x, y: y, alpha: 0.9, decayRate: 14.0,
    update: function(dt) { this.alpha -= this.decayRate * dt; return this.alpha > 0; },
    draw: function() {
      if (!ctx) return;
      ctx.globalAlpha = this.alpha * 0.8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Guard active spark pool on mobile to eliminate any frame lag
  const maxPool = isMobile ? 55 : 95;
  if (activeSparks.length > maxPool) {
    activeSparks.splice(0, activeSparks.length - maxPool + 12);
  }

  if (type === 'willow') {
    // Elegant Willow: Sparks arc out then cascade down with glowing trails
    const sparkCount = isMobile ? 18 : 30;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.pow(Math.random(), 0.6) * 3.0;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 0.4;
      const col = palette.colors[i % palette.colors.length];
      activeSparks.push(new FireworkSpark(x, y, vx, vy, col, palette.core, {
        isWillow: true,
        lifespan: 1.9 + Math.random() * 0.5,
        drag: 0.965,
        gravity: 0.072
      }));
    }
  } else if (type === 'ring') {
    // Symmetrical Royal Ring with contrasting center stars
    const count = isMobile ? 16 : 26;
    const ringSpeed = 2.3 + Math.random() * 0.4;
    const mainColor = palette.colors[0];
    const secondColor = palette.colors[Math.min(2, palette.colors.length - 1)];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const vx = Math.cos(angle) * ringSpeed;
      const vy = Math.sin(angle) * ringSpeed;
      const col = i % 2 === 0 ? mainColor : secondColor;
      activeSparks.push(new FireworkSpark(x, y, vx, vy, col, palette.core, { lifespan: 1.7 + Math.random() * 0.4 }));
    }
    const centerCount = isMobile ? 4 : 8;
    for (let i = 0; i < centerCount; i++) {
      const speed = Math.random() * 1.0;
      const angle = Math.random() * Math.PI * 2;
      activeSparks.push(new FireworkSpark(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, palette.colors[1], '#ffffff', { lifespan: 1.4 }));
    }
  } else {
    // Classic Peony burst
    const sparkCount = isMobile ? 20 : 34;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.pow(Math.random(), 0.5) * 2.8;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const col = palette.colors[Math.floor(Math.random() * palette.colors.length)];
      activeSparks.push(new FireworkSpark(x, y, vx, vy, col, palette.core, { lifespan: 1.7 + Math.random() * 0.5 }));
    }
  }
}

// Responsive Launch Coordinator
function launchFirework(targetX, targetY, options = {}) {
  const isMobile = width < 768;
  const maxRockets = isMobile ? 2 : 3;
  if (activeRockets.length >= maxRockets) return;

  // Frame bursts cleanly in the upper dusk sky
  const maxSkyY = isMobile ? height * 0.42 : height * 0.56;
  const minSkyY = height * 0.12;
  const clampedY = Math.max(minSkyY, Math.min(targetY, maxSkyY));
  
  const startX = targetX + (Math.random() - 0.5) * (isMobile ? 30 : 60);
  activeRockets.push(new FireworkRocket(targetX, clampedY, startX, options));
}
window.launchFirework = launchFirework;

// Interactive click & tap trigger: Launch fireworks on click!
let clickCount = 0;
let lastClickTime = 0;

function handleInteractiveFirework(clientX, clientY, target) {
  if (target && (target.closest('button') || target.closest('a') || target.closest('.audio-pill') || target.closest('input') || target.closest('textarea') || target.closest('select'))) {
    return;
  }

  const now = Date.now();
  if (now - lastClickTime < 950) {
    clickCount++;
  } else {
    clickCount = 1;
  }
  lastClickTime = now;

  // 1. Primary firework directed to the tap location
  launchFirework(clientX, clientY);

  // 2. Cascading show on repeated clicks (desktop only to keep mobile 60fps solid)
  const isMobile = width < 768;
  if (clickCount >= 2 && !isMobile) {
    setTimeout(() => {
      const offsetX = clientX + (Math.random() - 0.5) * 160;
      const offsetY = Math.max(80, clientY + (Math.random() - 0.5) * 60);
      launchFirework(offsetX, offsetY, { type: 'willow' });
    }, 200);
  }
  if (clickCount >= 3 && !isMobile) {
    setTimeout(() => {
      const offsetX = clientX + (Math.random() - 0.5) * 220;
      const offsetY = Math.max(70, clientY - 50 - Math.random() * 60);
      launchFirework(offsetX, offsetY, { type: 'peony' });
    }, 400);
    clickCount = 0; // reset sequence
  }
}

// Add click & touch listener across the hero section
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('click', (e) => {
    handleInteractiveFirework(e.clientX, e.clientY, e.target);
  });

  heroSection.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      handleInteractiveFirework(touch.clientX, touch.clientY, e.target);
    }
  }, { passive: true });
}

// Viewport visibility trackers to pause off-screen canvas loops
let isHeroVisible = true;
let isWinterVisible = false;

// Ambient Automatic Festive Fireworks Show
let lastAmbientTime = 0;
let nextAmbientInterval = 2400;

function checkAmbientFireworks(timestamp) {
  // Only launch ambient fireworks when user is viewing the hero sky (never in footer or cards)
  if (!isHeroVisible || window.scrollY > height * 0.45) return;

  if (timestamp - lastAmbientTime > nextAmbientInterval) {
    lastAmbientTime = timestamp;
    nextAmbientInterval = 3400 + Math.random() * 2600; // 3.4s - 6.0s

    const skyMinX = width * 0.15;
    const skyMaxX = width * 0.85;
    const targetX = skyMinX + Math.random() * (skyMaxX - skyMinX);
    const targetY = height * 0.14 + Math.random() * (height * 0.28);

    launchFirework(targetX, targetY);
  }
}

// Main Animation Loop with Time-Based Delta-Time (60Hz, 90Hz, 120Hz consistency)
let fireworkAnimFrameId = null;
let lastFrameTimestamp = 0;

function animateFireworks(timestamp) {
  fireworkAnimFrameId = requestAnimationFrame(animateFireworks);

  // If hero is scrolled out of viewport, skip rendering
  if (!isHeroVisible) {
    lastFrameTimestamp = timestamp;
    return;
  }

  if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
  let dt = (timestamp - lastFrameTimestamp) / 1000;
  lastFrameTimestamp = timestamp;
  
  // Guard against tab switching lag spikes
  if (dt > 0.05) dt = 0.05;
  if (dt < 0.002) dt = 0.002;

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    const time = timestamp * 0.001;

    // Check automatic ambient show
    checkAmbientFireworks(timestamp);

    // Update and draw active rockets
    for (let i = activeRockets.length - 1; i >= 0; i--) {
      const rocket = activeRockets[i];
      if (!rocket.update(dt)) {
        activeRockets.splice(i, 1);
      } else {
        rocket.draw(time);
      }
    }

    // Update and draw active sparks
    for (let i = activeSparks.length - 1; i >= 0; i--) {
      const spark = activeSparks[i];
      if (!spark.update(dt, time)) {
        activeSparks.splice(i, 1);
      } else {
        spark.draw(time);
      }
    }
  }
}

// Start fireworks animation
requestAnimationFrame(animateFireworks);

// ==========================================
// 1.5. MAGICAL WINTER SNOWFALL SIMULATION (EVENTS & VENUE CARDS)
// Beautiful, delicate drifting snowflakes across Pages 2 & 3
// ==========================================
const snowCanvas = document.getElementById('snowCanvas');
const snowCtx = snowCanvas ? snowCanvas.getContext('2d') : null;
const winterZone = document.getElementById('cardsWinterZone');

let snowWidth = 0;
let snowHeight = 0;

function resizeSnowCanvas() {
  if (!snowCanvas || !winterZone) return;
  snowWidth = snowCanvas.width = winterZone.offsetWidth;
  snowHeight = snowCanvas.height = winterZone.offsetHeight;
}

window.addEventListener('resize', resizeSnowCanvas);
if (window.ResizeObserver && winterZone) {
  new ResizeObserver(resizeSnowCanvas).observe(winterZone);
}
resizeSnowCanvas();

class Snowflake {
  constructor(initialY = null, initialX = null, isUserSpawned = false) {
    this.reset(initialY, initialX, isUserSpawned);
  }

  reset(initialY = null, initialX = null, isUserSpawned = false) {
    this.x = initialX !== null ? initialX : Math.random() * (snowWidth || window.innerWidth);
    this.y = initialY !== null ? initialY : -20 - Math.random() * 50;
    
    // Depth scaling (0: distant small flurry, 1: near sparkling crystal)
    this.depth = isUserSpawned ? (0.65 + Math.random() * 0.35) : Math.random();
    this.radius = 3.2 + this.depth * 5.8; // Flake size (prominent on mobile screens)
    
    this.speedY = 0.65 + this.depth * 1.05;
    this.swaySpeed = 0.009 + Math.random() * 0.015;
    this.swayAmount = 14 + this.depth * 26;
    this.swayOffset = Math.random() * Math.PI * 2;
    
    this.rotation = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.025;
    
    // 0: Soft snow flurry orb, 1: 6-pointed branching crystal dendrite, 2: 6-star diamond flake
    this.type = isUserSpawned ? 1 : (Math.random() < 0.55 ? 1 : (Math.random() < 0.85 ? 2 : 0));
    
    this.baseAlpha = 0.72 + this.depth * 0.28; // Bright, high-contrast visibility on mobile
    this.flickerSpeed = 0.03 + Math.random() * 0.05;
    this.flickerOffset = Math.random() * Math.PI * 2;
    
    // User spawned burst physics
    this.isUserSpawned = isUserSpawned;
    this.vx = isUserSpawned ? (Math.random() - 0.5) * 4.5 : 0;
    this.vy = isUserSpawned ? -1.8 - Math.random() * 2.5 : 0;
    this.life = 1;
    this.decay = 0.005 + Math.random() * 0.004;
  }

  update(time) {
    if (this.isUserSpawned) {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy += 0.07; // gentle gravity
      this.rotation += this.spinSpeed * 2.5;
      this.life -= this.decay;
      return (this.life > 0 && this.y < snowHeight + 30);
    }

    this.y += this.speedY;
    this.rotation += this.spinSpeed;
    this.currentX = this.x + Math.sin(time * this.swaySpeed + this.swayOffset) * this.swayAmount;

    // Reset when reaching bottom of winter zone
    if (this.y > (snowHeight || 1800) + 25) {
      this.reset();
      this.y = -20;
    }
    return true;
  }

  draw(time) {
    if (!snowCtx) return;
    const drawX = this.isUserSpawned ? this.x : this.currentX;
    const drawY = this.y;

    snowCtx.save();
    snowCtx.translate(drawX, drawY);
    snowCtx.rotate(this.rotation);

    const flicker = Math.sin(time * this.flickerSpeed + this.flickerOffset) * 0.12;
    const alpha = Math.max(0.12, Math.min(1, (this.baseAlpha + flicker) * this.life));
    snowCtx.globalAlpha = alpha;

    const r = this.radius;

    if (this.type === 1 && r >= 3.2) {
      // 1. Ornate 6-pointed Dendrite Crystal Snowflake (Fast, zero-overhead crisp strokes)
      snowCtx.strokeStyle = '#ffffff';
      snowCtx.lineWidth = Math.max(1.5, r * 0.22);
      snowCtx.lineCap = 'round';

      const rotStep = Math.PI / 3;
      const b1 = r * 0.55;
      const b2 = r * 0.85;

      for (let i = 0; i < 6; i++) {
        snowCtx.rotate(rotStep);

        // Main axis
        snowCtx.beginPath();
        snowCtx.moveTo(0, 0);
        snowCtx.lineTo(0, -r);
        snowCtx.stroke();

        // Upper chevrons
        snowCtx.beginPath();
        snowCtx.moveTo(-r * 0.28, -b1 + r * 0.18);
        snowCtx.lineTo(0, -b1);
        snowCtx.lineTo(r * 0.28, -b1 + r * 0.18);
        snowCtx.stroke();

        // Lower chevrons
        snowCtx.beginPath();
        snowCtx.moveTo(-r * 0.2, -b2 + r * 0.14);
        snowCtx.lineTo(0, -b2);
        snowCtx.lineTo(r * 0.2, -b2 + r * 0.14);
        snowCtx.stroke();
      }

      // Center glowing nucleus
      snowCtx.fillStyle = '#ffffff';
      snowCtx.beginPath();
      snowCtx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
      snowCtx.fill();

    } else if (this.type === 2 && r >= 2.8) {
      // 2. 6-Pointed Star Crystal
      snowCtx.strokeStyle = '#ffffff';
      snowCtx.lineWidth = Math.max(1.4, r * 0.2);
      snowCtx.lineCap = 'round';

      const rotStep = Math.PI / 3;
      for (let i = 0; i < 6; i++) {
        snowCtx.rotate(rotStep);
        snowCtx.beginPath();
        snowCtx.moveTo(0, 0);
        snowCtx.lineTo(0, -r);
        snowCtx.stroke();
      }
      snowCtx.fillStyle = '#ffffff';
      snowCtx.beginPath();
      snowCtx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      snowCtx.fill();

    } else {
      // 3. Soft Glowing Snow Flurry Orb (Clean, high-performance bokeh)
      snowCtx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      snowCtx.beginPath();
      snowCtx.arc(0, 0, r, 0, Math.PI * 2);
      snowCtx.fill();
    }

    snowCtx.restore();
  }
}

// Sparkle Particle Effect for Snow Burst
class FrostSparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3.5;
    this.vy = (Math.random() - 0.5) * 3.5 - 1;
    this.size = Math.random() * 2.8 + 1.2;
    this.life = 1;
    this.decay = Math.random() * 0.025 + 0.015;
    this.color = Math.random() < 0.65 ? '#ffffff' : '#ffd166'; // Frost white & ice-gold
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw() {
    if (!snowCtx) return;
    snowCtx.globalAlpha = Math.max(0, this.life);
    snowCtx.fillStyle = this.color;
    snowCtx.beginPath();
    snowCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    snowCtx.fill();
  }
}

const isMobileScreen = window.innerWidth < 768;
const SNOWFLAKE_COUNT = isMobileScreen ? 48 : 80; // Optimized count ensures silky 60fps across mobile GPUs
const ambientSnowflakes = [];
const spawnedSnowflakes = [];
const frostSparkles = [];

function initAmbientSnow() {
  resizeSnowCanvas();
  const initialH = snowHeight || 1800;
  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    ambientSnowflakes.push(new Snowflake(Math.random() * initialH));
  }
}

let snowAnimTimer = 0;
function animateWinterSnow() {
  requestAnimationFrame(animateWinterSnow);

  // If winter zone is not visible, pause rendering to save 100% CPU/GPU
  if (!isWinterVisible || !snowCtx) return;

  snowCtx.clearRect(0, 0, snowWidth, snowHeight);
  snowAnimTimer += 1;

  // 1. Ambient Falling Snow
  for (let i = 0; i < ambientSnowflakes.length; i++) {
    const flake = ambientSnowflakes[i];
    flake.update(snowAnimTimer);
    flake.draw(snowAnimTimer);
  }

  // 2. Interactive Spawned Snowflakes
  for (let i = spawnedSnowflakes.length - 1; i >= 0; i--) {
    const flake = spawnedSnowflakes[i];
    const isAlive = flake.update(snowAnimTimer);
    if (isAlive) {
      flake.draw(snowAnimTimer);
    } else {
      spawnedSnowflakes.splice(i, 1);
    }
  }

  // 3. Frost Sparkles
  for (let i = frostSparkles.length - 1; i >= 0; i--) {
    const sp = frostSparkles[i];
    sp.update();
    sp.draw();
    if (sp.life <= 0) {
      frostSparkles.splice(i, 1);
    }
  }
}

if (snowCtx) {
  initAmbientSnow();
  animateWinterSnow();
}

// Interactive Tap / Click to Add Snowflakes (just like the lanterns)
function spawnSnowClusterAt(x, y) {
  // Spawn 7 delicate crystal snowflakes that burst and flutter down
  for (let i = 0; i < 7; i++) {
    spawnedSnowflakes.push(new Snowflake(y + (Math.random() - 0.5) * 16, x + (Math.random() - 0.5) * 16, true));
  }
  // Spawn 14 shimmering frost sparkles
  for (let i = 0; i < 14; i++) {
    frostSparkles.push(new FrostSparkle(x, y));
  }
}

if (winterZone) {
  winterZone.addEventListener('click', (e) => {
    // Avoid triggering on button/link interactions
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
    const rect = winterZone.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    spawnSnowClusterAt(clickX, clickY);
  });
}

// ==========================================
// 2. ROMANTIC WEDDING INSTRUMENTAL MUSIC PLAYER
// "Until I Found You" - Indian Classical Instrumental
// Trimmed starting from 0:30 with smooth loop
// Defaults to ON / Autoplay
// ==========================================
const weddingAudio = document.getElementById('weddingAudio') || new Audio('assets/wedding_song.mp3');
weddingAudio.loop = true;
weddingAudio.volume = 0.85;

let isPlaying = false;

function updateAudioUI(playing) {
  const pill = document.getElementById('audioPill');
  if (!pill) return;
  if (playing) {
    pill.classList.add('playing');
    pill.setAttribute('title', 'Pause Romantic Wedding Music');
  } else {
    pill.classList.remove('playing');
    pill.setAttribute('title', 'Play Romantic Indian Classical - Until I Found You');
  }
}

// Keep UI in lockstep with native audio state
weddingAudio.addEventListener('play', () => {
  isPlaying = true;
  updateAudioUI(true);
});
weddingAudio.addEventListener('playing', () => {
  isPlaying = true;
  updateAudioUI(true);
});
weddingAudio.addEventListener('pause', () => {
  isPlaying = false;
  updateAudioUI(false);
});

function startMusic() {
  const playPromise = weddingAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      updateAudioUI(true);
    }).catch(err => {
      console.log('Autoplay deferred pending user interaction:', err);
      // Modern browsers require a user interaction before unmuted audio plays.
      // Attach one-time listeners across all user interactions to immediately start audio!
      const unlockAudio = () => {
        weddingAudio.play().then(() => {
          isPlaying = true;
          updateAudioUI(true);
        }).catch(() => {});
        ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll', 'wheel'].forEach(evt => {
          window.removeEventListener(evt, unlockAudio);
          document.removeEventListener(evt, unlockAudio);
        });
      };
      ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll', 'wheel'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
        document.addEventListener(evt, unlockAudio, { once: true, passive: true });
      });
    });
  }
}

function stopMusic() {
  isPlaying = false;
  weddingAudio.pause();
  updateAudioUI(false);
}

function toggleMusic() {
  if (weddingAudio.paused) {
    startMusic();
  } else {
    stopMusic();
  }
}

// Attempt immediate autoplay on page load
startMusic();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMusic);
}
window.addEventListener('load', startMusic);
window.addEventListener('pageshow', startMusic);

// ==========================================
// 3. LIVE WEDDING COUNTDOWN TIMER
// ==========================================
function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDate.getTime() - now;

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const daysElem = document.getElementById('cDays');
  const hoursElem = document.getElementById('cHours');
  const minutesElem = document.getElementById('cMinutes');
  const secondsElem = document.getElementById('cSeconds');

  if (diff < 0) {
    if (daysElem) daysElem.innerText = '00';
    if (hoursElem) hoursElem.innerText = '00';
    if (minutesElem) minutesElem.innerText = '00';
    if (secondsElem) secondsElem.innerText = '00';
    return;
  }

  if (daysElem) daysElem.innerText = String(Math.max(0, d)).padStart(2, '0');
  if (hoursElem) hoursElem.innerText = String(Math.max(0, h)).padStart(2, '0');
  if (minutesElem) minutesElem.innerText = String(Math.max(0, m)).padStart(2, '0');
  if (secondsElem) secondsElem.innerText = String(Math.max(0, s)).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 4. SMOOTH SCROLL HELPER
// ==========================================
function scrollToSection(id) {
  const elem = document.getElementById(id);
  if (elem) {
    if (window.lenis) {
      window.lenis.scrollTo(elem, { offset: 0, duration: 1.4 });
    } else {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// ==========================================
// 5. CALENDAR INTEGRATIONS
// ==========================================
function addToGoogleCalendar() {
  const title = encodeURIComponent("Jimmy Jani & Palak Nayak - Wedding Celebrations");
  const details = encodeURIComponent(
    "You are cordially invited to celebrate the union of Jimmy Jani & Palak Nayak.\n\nEvents:\n• Sangeet Sandhya: Saturday 27th Feb 2027, 6:00 PM Onwards\n• The Marriage: Sunday 28th Feb 2027, 4:00 PM Onwards\n\nVenue: Fairfield by Marriott Hotel, Near Mumbai International Airport, Andheri East, Mumbai – 400099, India."
  );
  const location = encodeURIComponent("Fairfield by Marriott Hotel, Near Mumbai International Airport, Andheri East, Mumbai – 400099, India");
  // 20270227T123000Z (6:00 PM IST is 12:30 UTC) to 20270228T183000Z
  const dates = "20270227T123000Z/20270228T183000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

function addSangeetToCalendar() {
  const title = encodeURIComponent("The Rytham of Beats - Sangeet Sandhya (Jimmy & Palak)");
  const details = encodeURIComponent("Sangeet Sandhya celebration for Jimmy Jani & Palak Nayak.\nVenue: Fairfield by Marriott Hotel, Mumbai.");
  const location = encodeURIComponent("Fairfield by Marriott Hotel, Andheri East, Mumbai");
  // 20270227T123000Z (6:00 PM IST is 12:30 UTC) to 20270227T183000Z
  const dates = "20270227T123000Z/20270227T183000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

function addMarriageToCalendar() {
  const title = encodeURIComponent("The Marriage - Jimmy Jani & Palak Nayak");
  const details = encodeURIComponent("Sacred Vivah & Pheras Ceremony of Jimmy Jani & Palak Nayak.\nVenue: Fairfield by Marriott Hotel, Mumbai.");
  const location = encodeURIComponent("Fairfield by Marriott Hotel, Andheri East, Mumbai");
  const dates = "20270228T103000Z/20270228T183000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

function downloadICS() {
  const ics = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jimmy Jani & Palak Nayak Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Jimmy Jani & Palak Nayak Wedding Celebration
DESCRIPTION:The wedding festivities of Jimmy Jani & Palak Nayak at Fairfield by Marriott Hotel, Mumbai.
LOCATION:Fairfield by Marriott Hotel, Near Mumbai International Airport, Andheri East, Mumbai - 400099
DTSTART:20270227T180000
DTEND:20270228T230000
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', 'Jimmy_and_Palak_Wedding_Celebration.ics');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================
// 6. ORIGINAL CARD MODAL VIEW
// ==========================================
function openOriginalCardModal() {
  const modal = document.getElementById('cardModal');
  if (modal) modal.classList.add('open');
}

function closeOriginalCardModal() {
  const modal = document.getElementById('cardModal');
  if (modal) modal.classList.remove('open');
}

// ==========================================
// 7. 3D CARD FLIP FOR DRESS CODE
// ==========================================
function toggleCardFlip(wrapperId) {
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    wrapper.classList.toggle('flipped');
  }
}
window.toggleCardFlip = toggleCardFlip;
