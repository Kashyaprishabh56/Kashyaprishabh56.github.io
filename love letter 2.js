$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");

  envelope.click(function () {
    open();
  });
  btn_open.click(function () {
    open();
  });
  btn_reset.click(function () {
    close();
  });

  function open() {
    envelope.addClass("open").removeClass("close");
  }
  function close() {
    envelope.addClass("close").removeClass("open");
  }
});

// Put this in love letter 2.js (after your existing code or at the end of the file)
(function () {
  const audio = document.getElementById('envelope-audio');
  const openBtn = document.getElementById('open');
  const resetBtn = document.getElementById('reset');
  const envelope = document.getElementById('envelope');

  if (!audio || !envelope) return;

  // Set defaults
  audio.loop = true;         // keep playing until closed; remove if you want one-shot
  audio.volume = 0.8;        // default volume (0.0 - 1.0)

  // play helper (handles promise returned by play())
  function safePlay() {
    // play from start
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        // Autoplay might be blocked in some browsers; this will fail silently
        console.warn('Audio play failed (user gesture required?):', err);
      });
    }
  }

  // stop helper with a quick fade-out
  function stopWithFade(duration = 400) {
    const startVol = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVol = Math.max(0, startVol * (1 - currentStep / steps));
      audio.volume = newVol;
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVol; // restore volume for next play
      }
    }, stepTime);
  }

  // If you prefer immediate stop (no fade), replace stopWithFade with:
  // function immediateStop() { audio.pause(); audio.currentTime = 0; }

  // Button event listeners (user gesture, so play will generally be allowed)
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // your existing open logic probably toggles envelope classes;
      // ensure the envelope gets opened in your code too (if not, do it here)
      envelope.classList.remove('close');
      envelope.classList.add('open');

      safePlay();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      envelope.classList.remove('open');
      envelope.classList.add('close');

      stopWithFade(350); // fade in 350ms; change to 0 for immediate stop
    });
  }

  // MutationObserver to catch any other code that toggles envelope's classes
  const mo = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.attributeName === 'class') {
        const cls = envelope.className;
        if (cls.includes('open')) {
          // start playing (if not already playing)
          if (audio.paused) safePlay();
        } else if (cls.includes('close')) {
          // envelope closed -> stop
          if (!audio.paused) stopWithFade(300);
        }
      }
    });
  });

  mo.observe(envelope, { attributes: true, attributeFilter: ['class'] });

  // Optional: stop audio when page hidden (user switches tab)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) {
      audio.pause();
    } else if (!document.hidden && envelope.className.includes('open') && audio.paused) {
      // don't auto-play on tab return unless envelope is open and it's a user gesture earlier
      // safePlay(); // <-- uncomment if you want resume on tab focus
    }
  });
})();

// love letter 2.js — particles + bursts + emoji + trails + 3D + heartbeat-synced glow
(function () {
  /* ---------- Elements ---------- */
  const container = document.querySelector('.heart-particles');
  const envelope = document.getElementById('envelope');
  const layer3d = document.querySelector('.particle-3d-layer');
  const bgHeartbeat = document.querySelector('.bg-heartbeat');
  const audioEl = document.getElementById('envelope-audio');

  if (!envelope) return;

  /* ---------- Audio / WebAudio setup for heartbeat + burst sound ---------- */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  let sourceNode = null;

  // call this after a user gesture (open button) to ensure audio context allowed
  function ensureAudioContext() {
    if (!AudioCtx) return;
    if (audioCtx) return;
    try {
      audioCtx = new AudioCtx();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      // connect audio element if present
      if (audioEl) {
        sourceNode = audioCtx.createMediaElementSource(audioEl);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
    } catch (e) {
      // may be blocked until user gesture; ignore silently
      // console.warn('AudioContext init failed', e);
    }
  }

  // small burst beep using WebAudio (triangle sweeps)
  function playBurstBeep() {
    try {
      if (!audioCtx) ensureAudioContext();
      if (!audioCtx) return;
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(420, t + 0.18);
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + 0.2);
    } catch (e) {}
  }

  /* ---------- Utilities ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Existing heart system (pooled) ---------- */
  const heartPool = [];
  const maxHearts = 20;
  let spawnTimer = null;
  let spawnInterval = 700;
  let spawnProb = 0.9;
  const spawnIntervalHover = 180;

  // create pooled heart element (keeps core + frag holder)
  function createHeartElement() {
    const el = document.createElement('div');
    el.className = 'hp';
    const core = document.createElement('div');
    core.className = 'heart-shape';
    el.appendChild(core);
    const fragHolder = document.createElement('div');
    fragHolder.className = 'frag-holder';
    el.appendChild(fragHolder);
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      burstSparkles(el);
    });
    el._baseTransform = '';
    container.appendChild(el);
    return el;
  }

  function getPooledHeart() {
    if (heartPool.length < maxHearts) {
      const h = createHeartElement();
      heartPool.push(h);
      return h;
    }
    return heartPool[Math.floor(Math.random() * heartPool.length)];
  }

  function spawnHeart() {
    if (!container) return;
    const el = getPooledHeart();
    const core = el.querySelector('.heart-shape');
    const fragHolder = el.querySelector('.frag-holder');

    el.classList.remove('size-s','size-m','size-l');
    const r = Math.random();
    if (r < 0.35) el.classList.add('size-s');
    else if (r < 0.85) el.classList.add('size-m');
    else el.classList.add('size-l');

    const vw = window.innerWidth, vh = window.innerHeight;
    const startX = Math.floor(vw * (0.45 + Math.random() * 0.2) + (Math.random() - 0.5) * vw * 0.1);
    const startY = Math.floor(vh * (0.55 + Math.random() * 0.25));

    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.opacity = 0;

    const scaleStart = rand(0.6, 1.2);
    const rotStart = rand(-12, 12);
    el._baseTransform = `translateY(0) scale(${scaleStart}) rotate(${rotStart}deg)`;
    el.style.transform = el._baseTransform;

    // color core
    const cr1 = 200 + Math.floor(Math.random() * 55);
    const cr2 = 120 + Math.floor(Math.random() * 135);
    core.style.background = `linear-gradient(135deg, rgba(${cr1},60,100,1), rgba(${cr2},110,150,1))`;

    const duration = rand(6000, 11000);
    const driftX = rand(-45, 45);
    const finalY = - (vh * rand(0.8, 1.2));

    void el.offsetWidth;
    el.style.animation = `hpFloat ${duration}ms cubic-bezier(.22,.9,.43,1) forwards`;
    el.style.opacity = 1;

    // store final base for interactive offset
    setTimeout(() => {
      el._finalBaseTransform = `translateY(${finalY}px) translateX(${driftX}px) scale(${rand(0.8,1.3)}) rotate(${rand(-40,40)}deg)`;
    }, 30);

    // cleanup
    setTimeout(() => {
      el.style.opacity = 0;
      el.style.animation = '';
      el.style.left = '-9999px';
      el.style.top = '-9999px';
      if (fragHolder) fragHolder.innerHTML = '';
    }, duration + 300);
  }

  /* ---------- Explosion: hearts + emojis when envelope opens ---------- */
  function envelopeExplosion() {
    // small burst of 20-40 particles
    const count = 18 + Math.floor(Math.random() * 12);
    for (let i=0;i<count;i++) {
      spawnExplosionParticle();
    }
    // also spawn some large emojis
    const emojiChoices = ['❤️','🥺','✨','💕','😍'];
    const emCount = 6 + Math.floor(Math.random()*6);
    for (let j=0;j<emCount;j++) {
      spawnEmojiBig(emojiChoices[Math.floor(Math.random()*emojiChoices.length)]);
    }
    // play loudish burst beep
    playBurstBeep();
  }

  function spawnExplosionParticle() {
    // small heart or emoji flying out from envelope center
    const el = document.createElement('div');
    el.className = 'explosion-particle';
    const vw = window.innerWidth, vh = window.innerHeight;
    const envRect = envelope.getBoundingClientRect();
    const startX = Math.floor(envRect.left + envRect.width/2 + rand(-20,20));
    const startY = Math.floor(envRect.top + envRect.height/2 + rand(-8,12));
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    // choose heart or emoji
    if (Math.random() < 0.6) {
      // CSS heart (small div with rotated square + pseudo circles would be heavy — use simple colored dot)
      el.innerHTML = '<div style=\"width:14px;height:14px;border-radius:4px;background:linear-gradient(135deg,#ff5a84,#ff8aa8);box-shadow:0 6px 12px rgba(0,0,0,0.18);\"></div>';
      el.style.transform = `translate(-50%,-50%)`;
    } else {
      const emojis = ['❤️','🥺','✨','💕','😍'];
      const e = document.createElement('div');
      e.className = 'emoji';
      e.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      e.style.left = '0'; e.style.top = '0';
      el.innerHTML = '';
      el.appendChild(e);
    }
    document.body.appendChild(el);
    // animate outward
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random()*220;
    const tx = Math.cos(angle)*dist, ty = Math.sin(angle)*dist * -1;
    el.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(${rand(0.6,1.2)})`, opacity: 0 }
    ], { duration: 900 + Math.random()*800, easing: 'cubic-bezier(.22,.9,.43,1)' });
    // cleanup
    setTimeout(()=> el.remove(), 1800);
  }

  function spawnEmojiBig(emoji) {
    const el = document.createElement('div');
    el.className = 'emoji big';
    const envRect = envelope.getBoundingClientRect();
    el.style.left = (envRect.left + envRect.width/2 + rand(-30,30)) + 'px';
    el.style.top = (envRect.top + envRect.height/2 + rand(-20,20)) + 'px';
    el.textContent = emoji;
    document.body.appendChild(el);

    const tx = rand(-80,80), ty = - (150 + Math.random()*200);
    el.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(${0.8 + Math.random()*0.6}) rotate(${rand(-40,40)}deg)`, opacity: 0 }
    ], { duration: 1400 + Math.random()*800, easing: 'cubic-bezier(.22,.9,.43,1)' });
    setTimeout(()=> el.remove(), 2000);
  }

  /* ---------- Burst sparkles function (replaces heart frag) ---------- */
  function burstSparkles(el) {
    // play small sound
    playBurstBeep();
    // create 10-16 sparkles
    const fragHolder = el.querySelector('.frag-holder') || el;
    const fragCount = 10 + Math.floor(Math.random()*8);
    for (let i=0;i<fragCount;i++) {
      const frag = document.createElement('div');
      frag.className = 'hp-frag';
      const size = rand(4,12);
      frag.style.width = frag.style.height = `${size}px`;
      frag.style.left = '50%'; frag.style.top = '50%';
      frag.style.borderRadius = '50%';
      frag.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,200,230,0.95), rgba(255,120,160,0.6))`;
      frag.style.boxShadow = `0 0 ${rand(4,12)}px rgba(255,120,160,0.55)`;

      const angle = Math.random()*Math.PI*2;
      const d = rand(30,120);
      frag.style.setProperty('--tx', (Math.cos(angle)*d)+'px');
      frag.style.setProperty('--ty', (Math.sin(angle)*d * -1)+'px');
      frag.style.setProperty('--rot', `${rand(-90,90)}deg`);

      fragHolder.appendChild(frag);
      void frag.offsetWidth;
      frag.style.animation = `fragFly ${520 + Math.random()*700}ms cubic-bezier(.22,.9,.43,1) forwards`;
      // cleanup
      setTimeout(()=> { try{frag.remove();}catch(e){} }, 1400);
    }
    // hide clicked heart
    el.style.opacity = 0;
    el.style.animation = '';
    el.style.left = '-9999px';
    el.style.top = '-9999px';
  }

  /* ---------- Cursor trail hearts (throttled) ---------- */
  let lastTrail = 0;
  const trailThrottle = 40; // ms between trail spawns
  function spawnTrail(x,y) {
    const now = Date.now();
    if (now - lastTrail < trailThrottle) return;
    lastTrail = now;
    const el = document.createElement('div');
    el.className = 'trail-heart';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    const inner = document.createElement('div');
    inner.className = 'tshape';
    el.appendChild(inner);
    document.body.appendChild(el);
    requestAnimationFrame(()=> {
      el.style.transform = 'translate(-50%,-50%) scale(1.4) rotate(-35deg)';
      el.style.opacity = 1;
    });
    setTimeout(()=> {
      el.style.opacity = 0;
      el.style.transform = 'translate(-50%,-50%) scale(0.6) rotate(-35deg)';
    }, 220);
    setTimeout(()=> el.remove(), 700);
  }

  // track mouse to spawn trails
  document.addEventListener('mousemove', (e) => {
    spawnTrail(e.clientX, e.clientY);
  });

  /* ---------- 3D floating hearts (simple pooled) ---------- */
  const p3dPool = [];
  const maxP3d = 10;
  function spawn3DHeart(x,y) {
    const el = (p3dPool.length < maxP3d) ? create3D() : p3dPool[Math.floor(Math.random()*p3dPool.length)];
    el.classList.remove('small','large');
    if (Math.random() < 0.4) el.classList.add('small'); else if (Math.random() < 0.3) el.classList.add('large');
    el.style.left = (x - 20) + 'px';
    el.style.top = (y - 20) + 'px';
    layer3d.appendChild(el);
    el.style.opacity = 1;
    const tz = rand(-120,250);
    const rx = rand(-40,40);
    const ry = rand(-60,60);
    const ty = - (200 + Math.random()*400);
    el.animate([
      { transform: `translateZ(${tz}px) translateY(0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1)`, opacity: 1 },
      { transform: `translateZ(${tz + 80}px) translateY(${ty}px) rotateX(${rx+60}deg) rotateY(${ry+90}deg) scale(0.7)`, opacity: 0 }
    ], { duration: 1800 + Math.random()*1600, easing: 'cubic-bezier(.22,.9,.43,1)' });
    setTimeout(()=> { try{ el.remove(); } catch(e){} }, 3600);
  }

  function create3D() {
    const el = document.createElement('div');
    el.className = 'p3d';
    const face = document.createElement('div');
    face.className = 'face';
    el.appendChild(face);
    p3dPool.push(el);
    return el;
  }

  /* ---------- Heartbeat background sync ---------- */
  function updateHeartbeat() {
    if (!analyser || !dataArray) return requestAnimationFrame(updateHeartbeat);
    analyser.getByteTimeDomainData(dataArray);
    // compute RMS-ish volume
    let sum = 0;
    for (let i=0;i<dataArray.length;i++) {
      const v = (dataArray[i] - 128) / 128;
      sum += v*v;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    // map rms (0..~0.6 typical) to opacity/scale
    const glow = clamp(rms * 4.0, 0, 1); // amplified mapping
    bgHeartbeat.style.opacity = 0.25 * glow; // subtle
    bgHeartbeat.style.transform = `scale(${1 + glow*0.06})`;
    const after = bgHeartbeat.querySelector('::after');
    // request next frame
    requestAnimationFrame(updateHeartbeat);
  }

  /* ---------- Spawning control (start/stop) ---------- */
  function startSpawning() {
    if (!container) return;
    if (spawnTimer) return;
    container.classList.add('active');
    spawnTimer = setInterval(() => { if (Math.random() < spawnProb) spawnHeart(); }, spawnInterval);
  }
  function stopSpawning() {
    if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; }
    if (container) container.classList.remove('active');
  }

  /* ---------- Hover behavior (envelope) ---------- */
  envelope.addEventListener('mouseenter', () => {
    spawnProb = 0.98;
    if (spawnTimer) {
      clearInterval(spawnTimer);
    }
    spawnInterval = spawnIntervalHover;
    spawnTimer = setInterval(() => { if (Math.random() < spawnProb) spawnHeart(); }, spawnInterval);
  });
  envelope.addEventListener('mouseleave', () => {
    spawnProb = 0.9;
    if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; }
    spawnInterval = 700;
    spawnTimer = setInterval(() => { if (Math.random() < spawnProb) spawnHeart(); }, spawnInterval);
  });

  /* ---------- Envelope open observer: start spawn & explosion ---------- */
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.attributeName === 'class') {
        const cls = envelope.className;
        if (cls.includes('open')) {
          // ensure audio context available (user gesture likely occurred)
          ensureAudioContext();
          // resume audio if available and paused
          if (audioEl && audioEl.paused) {
            audioEl.play().catch(()=>{});
          }
          // start particle spawn & heartbeat visual
          startSpawning();
          if (analyser) requestAnimationFrame(updateHeartbeat);
          // small explosion
          envelopeExplosion();
          // spawn a few 3D hearts from envelope center
          const rect = envelope.getBoundingClientRect();
          for (let i=0;i<6;i++) spawn3DHeart(rect.left + rect.width/2 + rand(-30,30), rect.top + rect.height/2 + rand(-30,30));
        } else {
          stopSpawning();
        }
      }
    });
  });
  mo.observe(envelope, { attributes: true, attributeFilter: ['class'] });

  // init if already open
  if (envelope.classList.contains('open')) {
    ensureAudioContext();
    startSpawning();
    envelopeExplosion();
  }

  // accessibility: init audioContext on first user click anywhere (for mobile/autoplay)
  function firstGesture() {
    ensureAudioContext();
    document.removeEventListener('click', firstGesture);
  }
  document.addEventListener('click', firstGesture, { once: true });

  // polite cleanup on tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSpawning();
    else if (envelope.classList.contains('open')) startSpawning();
  });

})();
