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
