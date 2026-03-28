/* ============================================================
   BEATAGAIN — Premium Jingle Configurator
   Interactive Logic, Animations, Jingle Aura
   ============================================================ */

(function () {
  'use strict';

  // ─── STATE ────────────────────────────────────────────────
  const state = {
    path: null,        // 'business' | 'personal'
    phrase: '',
    moods: [],
    style: null,
    customStyle: '',
    usecase: null,
    prefs: { vocals: true, instrumental: false, female: false, male: false, sweet: false, choir: false, exact: true, improve: false, surprise: false },
    notes: '',
    addons: [],
    currentStep: 0
  };

  // ─── CONTENT DATA ─────────────────────────────────────────
  const data = {
    business: {
      phraseSuggestions: ['Your brand name', 'Your slogan', 'Campaign line', 'Product phrase', 'Intro line', 'Tagline'],
      moods: ['Trustworthy', 'Premium', 'Bold', 'Friendly', 'Modern', 'Elegant', 'Luxury', 'Energetic', 'Warm', 'Playful', 'Serious', 'Family-friendly', 'Custom'],
      usecases: ['Social media', 'Brand intro', 'Store identity', 'Ad / campaign', 'Podcast / video', 'Event', 'App / startup', 'Product promo', 'Other'],
      basePrice: 97,
      moodReactions: {
        'Trustworthy': 'This direction feels more brand-ready and memorable.',
        'Premium': 'Beautiful choice — this elevates your sonic identity.',
        'Bold': 'Strong choice — this will sound more distinctive.',
        'Friendly': 'That warmth will make your jingle instantly approachable.',
        'Modern': 'Clean and current — a timeless foundation.',
        'Elegant': 'Refined taste — this gives your jingle a luxury feel.',
        'Luxury': 'Exquisite direction — this will sound truly high-end.',
        'Energetic': 'This energy will make your jingle impossible to ignore.',
        'Warm': 'This gives your jingle a warmer emotional pull.',
        'Playful': 'Fun and memorable — people will smile hearing this.',
        'Serious': 'Professional gravitas — this will command attention.',
        'Family-friendly': 'Welcoming and inclusive — a sound everyone can connect to.',
        'Custom': 'Your unique direction — we love creative freedom.'
      }
    },
    personal: {
      phraseSuggestions: ['A funny sentence', 'A loving message', 'A family phrase', 'A birthday line', 'A name', 'A motivational line'],
      moods: ['Loving', 'Joyful', 'Funny', 'Warm', 'Emotional', 'Magical', 'Calm', 'Uplifting', 'Cute', 'Proud', 'Nostalgic', 'Celebratory', 'Custom'],
      usecases: ['Gift', 'Birthday', 'Family moment', 'Wedding / love', 'Funny saying', 'Motivation', 'Keepsake', 'Celebration', 'Other'],
      basePrice: 18,
      moodReactions: {
        'Loving': 'This gives your jingle a deeper emotional pull.',
        'Joyful': 'Beautiful — this will radiate pure happiness.',
        'Funny': 'This will bring a smile every single time.',
        'Warm': 'Like a musical hug — soft and unforgettable.',
        'Emotional': 'This direction will truly move the heart.',
        'Magical': 'Enchanting choice — this will feel like a little miracle.',
        'Calm': 'Peaceful and gentle — a beautiful sonic moment.',
        'Uplifting': 'This energy lifts the spirit — powerful choice.',
        'Cute': 'Adorable — this will melt hearts.',
        'Proud': 'This will sound like a celebration of someone special.',
        'Nostalgic': 'A melody that brings back beautiful memories.',
        'Celebratory': 'This will feel like confetti in sound form.',
        'Custom': 'Your unique feeling — we\'ll capture it perfectly.'
      }
    }
  };

  const catchierVariants = {
    business: {
      cleaner: (p) => {
        const words = p.trim().split(/\s+/);
        if (words.length <= 3) return p.trim() + ' — simply better.';
        return words.slice(0, Math.ceil(words.length * 0.7)).join(' ') + '.';
      },
      catchier: (p) => {
        const t = p.trim().replace(/[.!?]+$/, '');
        const endings = ['. Every time.', '. Always.', '. No question.', '. That\'s it.', '. Feel it.'];
        return t + endings[Math.floor(Math.random() * endings.length)];
      },
      premium: (p) => {
        const t = p.trim().replace(/[.!?]+$/, '');
        return 'The ' + t.toLowerCase() + ' experience.';
      }
    },
    personal: {
      cleaner: (p) => {
        const t = p.trim().replace(/[.!?]+$/, '');
        return t + '.';
      },
      catchier: (p) => {
        const t = p.trim().replace(/[.!?]+$/, '');
        const endings = [' — forever.', ' — always.', ', always and forever.', ' — that\'s us.'];
        return t + endings[Math.floor(Math.random() * endings.length)];
      },
      emotional: (p) => {
        const t = p.trim().replace(/[.!?]+$/, '');
        return 'Dear heart, ' + t.charAt(0).toLowerCase() + t.slice(1) + '.';
      }
    }
  };

  // ─── DOM REFS ─────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ─── PARTICLE CANVAS ─────────────────────────────────────
  const particleCanvas = $('#particleCanvas');
  const pCtx = particleCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() > 0.5 ? 330 : 180 // magenta or cyan
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`;
      pCtx.fill();
    }
    requestAnimationFrame(drawParticles);
  }

  resizeParticleCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeParticleCanvas(); });

  // ─── HERO WAVEFORM ───────────────────────────────────────
  const wavePaths = $$('.wave-path');
  let waveTime = 0;

  function generateWavePath(offset, amplitude, frequency) {
    let d = 'M 0 100';
    for (let x = 0; x <= 800; x += 4) {
      const y = 100 + Math.sin((x * frequency + waveTime + offset) * 0.01) * amplitude
        + Math.sin((x * frequency * 0.5 + waveTime * 0.7 + offset * 2) * 0.015) * (amplitude * 0.5);
      d += ` L ${x} ${y}`;
    }
    return d;
  }

  function animateWaves() {
    waveTime += 0.8;
    if (wavePaths[0]) wavePaths[0].setAttribute('d', generateWavePath(0, 30, 3));
    if (wavePaths[1]) wavePaths[1].setAttribute('d', generateWavePath(100, 25, 2.5));
    if (wavePaths[2]) wavePaths[2].setAttribute('d', generateWavePath(200, 20, 3.5));
    requestAnimationFrame(animateWaves);
  }
  animateWaves();

  // ─── SCROLL OBSERVER ─────────────────────────────────────
  const sections = $$('.path-split, .how-it-works, .configurator, .examples, .testimonials, .faq');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach(s => observer.observe(s));

  // ─── NAV SCROLL ──────────────────────────────────────────
  const nav = $('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── STICKY CTA ──────────────────────────────────────────
  const stickyCta = $('#stickyCta');
  const stickyCtaBtn = $('#stickyCtaBtn');
  const configuratorEl = $('#configurator');
  let stickyVisible = false;

  function updateStickyCta() {
    if (window.innerWidth >= 768) { stickyCta.style.display = 'none'; return; }
    const rect = configuratorEl.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    const shouldShow = state.currentStep >= 2 && inView;
    if (shouldShow !== stickyVisible) {
      stickyVisible = shouldShow;
      stickyCta.style.display = shouldShow ? 'block' : 'none';
    }
  }
  window.addEventListener('scroll', updateStickyCta, { passive: true });
  window.addEventListener('resize', updateStickyCta, { passive: true });

  // ─── PATH SELECTION (HERO CARDS) ─────────────────────────
  $$('.path-card').forEach(card => {
    card.addEventListener('click', () => {
      selectPath(card.dataset.path);
      setTimeout(() => {
        document.getElementById('configurator').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    });
  });

  // ─── PATH SELECTION (CONFIGURATOR STEP 0) ────────────────
  $$('[data-select-path]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectPath(btn.dataset.selectPath);
      goToStep(1);
    });
  });

  function selectPath(path) {
    state.path = path;
    state.moods = [];
    state.usecase = null;

    // Update path card UI
    $$('.path-card').forEach(c => c.classList.toggle('selected', c.dataset.path === path));
    $$('.path-mini-btn').forEach(b => b.classList.toggle('selected', b.dataset.selectPath === path));

    // Populate path-dependent content
    populateSuggestions();
    populateMoods();
    populateUsecases();
    updatePackage();
    updateAura();

    // If on step 0, auto-advance
    if (state.currentStep === 0) goToStep(1);
  }

  function populateSuggestions() {
    const container = $('#phraseSuggestions');
    const items = data[state.path]?.phraseSuggestions || [];
    container.innerHTML = items.map(s => `<button class="phrase-chip">${s}</button>`).join('');
    container.querySelectorAll('.phrase-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = $('#phraseInput');
        input.value = chip.textContent;
        input.dispatchEvent(new Event('input'));
      });
    });
  }

  function populateMoods() {
    const container = $('#moodChips');
    const items = data[state.path]?.moods || [];
    container.innerHTML = items.map(m => `<button class="mood-chip" data-mood="${m}">${m}</button>`).join('');
    container.querySelectorAll('.mood-chip').forEach(chip => {
      chip.addEventListener('click', () => toggleMood(chip));
    });
  }

  function populateUsecases() {
    const container = $('#usecaseChips');
    const items = data[state.path]?.usecases || [];
    container.innerHTML = items.map(u => `<button class="usecase-chip" data-usecase="${u}">${u}</button>`).join('');
    container.querySelectorAll('.usecase-chip').forEach(chip => {
      chip.addEventListener('click', () => selectUsecase(chip));
    });
  }

  // ─── PHRASE INPUT ─────────────────────────────────────────
  const phraseInput = $('#phraseInput');
  const charCount = $('#charCount');
  const btnStep1Next = $('#btnStep1Next');
  const btnMakeCatchier = $('#btnMakeCatchier');

  phraseInput.addEventListener('input', () => {
    state.phrase = phraseInput.value;
    charCount.textContent = phraseInput.value.length;
    btnStep1Next.disabled = phraseInput.value.trim().length < 2;
    btnMakeCatchier.disabled = phraseInput.value.trim().length < 3;
    updateAura();
    updatePill();
  });

  // ─── MAKE IT CATCHIER ────────────────────────────────────
  btnMakeCatchier.addEventListener('click', () => {
    if (!state.phrase.trim() || !state.path) return;
    const panel = $('#catchierPanel');
    const container = $('#catchierOptions');
    const variants = catchierVariants[state.path];
    const labels = state.path === 'business'
      ? [['Cleaner', 'cleaner'], ['Catchier', 'catchier'], ['More premium', 'premium']]
      : [['Cleaner', 'cleaner'], ['Catchier', 'catchier'], ['More emotional', 'emotional']];

    container.innerHTML = labels.map(([label, key]) => {
      const text = variants[key](state.phrase);
      return `<button class="catchier-option" data-catchier="${text}"><span>${text}</span><small>${label}</small></button>`;
    }).join('');

    container.querySelectorAll('.catchier-option').forEach(opt => {
      opt.addEventListener('click', () => {
        phraseInput.value = opt.dataset.catchier;
        phraseInput.dispatchEvent(new Event('input'));
        panel.style.display = 'none';
      });
    });

    panel.style.display = 'block';
  });

  // ─── VOICE RECORDING ────────────────────────────────────
  const btnVoice = $('#btnVoice');
  let mediaRecorder = null;
  let isRecording = false;

  btnVoice.addEventListener('click', async () => {
    if (isRecording) {
      mediaRecorder?.stop();
      isRecording = false;
      btnVoice.classList.remove('recording');
      btnVoice.querySelector('span').textContent = 'Record your voice';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        btnVoice.querySelector('span').textContent = 'Voice recorded ✓';
      };
      mediaRecorder.start();
      isRecording = true;
      btnVoice.classList.add('recording');
      btnVoice.querySelector('span').textContent = 'Stop recording...';
    } catch {
      btnVoice.querySelector('span').textContent = 'Microphone not available';
      setTimeout(() => { btnVoice.querySelector('span').textContent = 'Record your voice'; }, 2000);
    }
  });

  // ─── MOOD SELECTION ──────────────────────────────────────
  function toggleMood(chip) {
    const mood = chip.dataset.mood;
    const idx = state.moods.indexOf(mood);
    if (idx >= 0) {
      state.moods.splice(idx, 1);
      chip.classList.remove('selected');
    } else {
      if (state.moods.length >= 2) {
        const oldChip = $$(`.mood-chip.selected`);
        if (oldChip[0]) { oldChip[0].classList.remove('selected'); state.moods.shift(); }
      }
      state.moods.push(mood);
      chip.classList.add('selected');
      chip.classList.add('glow-once');
      setTimeout(() => chip.classList.remove('glow-once'), 600);
    }

    // Show reaction
    const reaction = $('#moodReaction');
    const reactionText = $('#moodReactionText');
    if (state.moods.length > 0) {
      const lastMood = state.moods[state.moods.length - 1];
      reactionText.textContent = data[state.path]?.moodReactions[lastMood] || 'Beautiful choice.';
      reaction.style.display = 'flex';
      reaction.style.animation = 'none';
      requestAnimationFrame(() => { reaction.style.animation = ''; });
    } else {
      reaction.style.display = 'none';
    }

    $('#btnStep2Next').disabled = state.moods.length === 0;
    updateAura();
    updatePill();
  }

  // ─── STYLE SELECTION ─────────────────────────────────────
  $$('.style-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.style-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.classList.add('glow-once');
      setTimeout(() => card.classList.remove('glow-once'), 600);
      state.style = card.dataset.style;

      const customInput = $('#customStyleInput');
      customInput.style.display = card.dataset.style === 'custom' ? 'block' : 'none';

      $('#btnStep3Next').disabled = false;
      updateAura();
      updatePill();
    });
  });

  $('#customStyleText')?.addEventListener('input', (e) => {
    state.customStyle = e.target.value;
  });

  // ─── USECASE SELECTION ───────────────────────────────────
  function selectUsecase(chip) {
    $$('.usecase-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    state.usecase = chip.dataset.usecase;
    $('#btnStep4Next').disabled = false;
    updateAura();
    updatePill();
  }

  // ─── TOGGLE PREFERENCES ─────────────────────────────────
  $$('.toggle-input').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const pref = toggle.dataset.pref;
      state.prefs[pref] = toggle.checked;

      // Mutual exclusivity
      if (pref === 'vocals' && toggle.checked) {
        const inst = $('[data-pref="instrumental"]');
        if (inst) { inst.checked = false; state.prefs.instrumental = false; }
      }
      if (pref === 'instrumental' && toggle.checked) {
        const voc = $('[data-pref="vocals"]');
        if (voc) { voc.checked = false; state.prefs.vocals = false; }
      }
      if (pref === 'exact' && toggle.checked) {
        const imp = $('[data-pref="improve"]');
        if (imp) { imp.checked = false; state.prefs.improve = false; }
      }
      if (pref === 'improve' && toggle.checked) {
        const ex = $('[data-pref="exact"]');
        if (ex) { ex.checked = false; state.prefs.exact = false; }
      }

      updateAura();
    });
  });

  $('#extraNotes').addEventListener('input', (e) => { state.notes = e.target.value; });

  // ─── ADDONS ──────────────────────────────────────────────
  $$('.addon-input').forEach(addon => {
    addon.addEventListener('change', () => {
      if (addon.checked) {
        state.addons.push(addon.dataset.addon);
      } else {
        state.addons = state.addons.filter(a => a !== addon.dataset.addon);
      }
      updatePackage();
    });
  });

  // ─── STEP NAVIGATION ────────────────────────────────────
  $$('.btn-next, .btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.go);
      goToStep(target);
    });
  });

  function goToStep(step) {
    // If going to step 1+ and no path selected, redirect to step 0
    if (step > 0 && !state.path) { step = 0; }

    state.currentStep = step;

    $$('.config-step').forEach(s => s.classList.remove('active'));
    const target = $(`[data-config-step="${step}"]`);
    if (target) target.classList.add('active');

    updateProgress();
    updateStickyCta();

    // Show summary pill after step 2
    const pill = $('#summaryPill');
    if (pill) pill.style.display = step >= 2 ? 'flex' : 'none';

    // Update summary on step 7
    if (step === 7) updateSummary();

    // Scroll into view
    const configEl = $('#configurator');
    if (configEl) {
      setTimeout(() => {
        configEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    // Update sticky CTA text
    if (stickyCtaBtn) {
      stickyCtaBtn.querySelector('span').textContent =
        step >= 7 ? 'Create my jingle' : 'Continue your jingle';
    }
  }

  function updateProgress() {
    const totalSteps = 7;
    const pct = Math.min((state.currentStep / totalSteps) * 100, 100);
    const fill = $('#progressFill');
    const text = $('#progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = state.currentStep === 0 ? 'Getting started' : `Step ${state.currentStep} of ${totalSteps}`;
  }

  // ─── PACKAGE UPDATE ──────────────────────────────────────
  function updatePackage() {
    const base = data[state.path]?.basePrice || 97;
    let addonTotal = 0;
    $$('.addon-input:checked').forEach(a => { addonTotal += parseInt(a.dataset.cost) || 0; });
    const total = base + addonTotal;

    const pkgName = $('#pkgName');
    const pkgPrice = $('#pkgPrice');
    const pkgDesc = $('#pkgDesc');
    const pkgBadge = $('#pkgBadge');

    if (state.path === 'personal') {
      if (pkgName) pkgName.textContent = 'Personal Jingle';
      if (pkgPrice) pkgPrice.textContent = total + '€';
      if (pkgDesc) pkgDesc.textContent = 'Short, memorable custom jingle for private use.';
      if (pkgBadge) pkgBadge.textContent = 'Perfect gift';
    } else {
      if (pkgName) pkgName.textContent = 'Business Jingle';
      if (pkgPrice) pkgPrice.textContent = total + '€';
      if (pkgDesc) pkgDesc.textContent = 'Catchy custom jingle concept for business or brand use.';
      if (pkgBadge) pkgBadge.textContent = 'Most popular';
    }
  }

  // ─── SUMMARY ─────────────────────────────────────────────
  function updateSummary() {
    const base = data[state.path]?.basePrice || 97;
    let addonTotal = 0;
    $$('.addon-input:checked').forEach(a => { addonTotal += parseInt(a.dataset.cost) || 0; });

    const el = (id) => document.getElementById(id);
    el('sumPath').textContent = state.path === 'business' ? 'Business' : 'Personal';
    el('sumPhrase').textContent = `"${state.phrase}"`;
    el('sumMood').textContent = state.moods.join(', ') || '—';
    el('sumStyle').textContent = state.style === 'custom' ? (state.customStyle || 'Custom') : (state.style?.replace(/-/g, ' ') || '—');
    el('sumUsecase').textContent = state.usecase || '—';

    const prefs = [];
    if (state.prefs.vocals) prefs.push('Vocals');
    if (state.prefs.instrumental) prefs.push('Instrumental');
    if (state.prefs.female) prefs.push('Female voice');
    if (state.prefs.male) prefs.push('Male voice');
    if (state.prefs.sweet) prefs.push('Sweet voice');
    if (state.prefs.choir) prefs.push('Choir');
    if (state.prefs.surprise) prefs.push('Surprise me');
    el('sumPersonal').textContent = prefs.join(', ') || 'Default';

    const total = base + addonTotal;
    el('sumPrice').textContent = `from ${total}€`;
  }

  // ─── MINI SUMMARY PILL ──────────────────────────────────
  function updatePill() {
    const pillPhrase = $('#pillPhrase');
    const pillMeta = $('#pillMeta');
    const pillPrice = $('#pillPrice');
    if (pillPhrase) pillPhrase.textContent = state.phrase || 'Your jingle';
    if (pillMeta) pillMeta.textContent = state.moods.length ? state.moods.join(' · ') : '—';
    if (pillPrice) pillPrice.textContent = state.path ? `from ${data[state.path].basePrice}€` : '—';
  }

  // ─── CREATE JINGLE BUTTON ───────────────────────────────
  $('#btnCreateJingle').addEventListener('click', () => {
    $('#successModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  $('#modalClose').addEventListener('click', () => {
    $('#successModal').style.display = 'none';
    document.body.style.overflow = '';
  });

  // ─── JINGLE AURA ─────────────────────────────────────────
  const auraCanvas = $('#auraCanvas');
  const auraCtx = auraCanvas.getContext('2d');
  const AURA_SIZE = 360; // retina
  auraCanvas.width = AURA_SIZE;
  auraCanvas.height = AURA_SIZE;

  // Mini aura
  const auraCanvasMini = $('#auraCanvasMini');
  const auraCtxMini = auraCanvasMini?.getContext('2d');

  // Pill aura
  const pillAuraCanvas = $('#pillAuraCanvas');
  const pillAuraCtx = pillAuraCanvas?.getContext('2d');
  if (pillAuraCanvas) { pillAuraCanvas.width = 64; pillAuraCanvas.height = 64; }

  let auraTime = 0;

  // Color mappings for moods
  const moodColors = {
    'Trustworthy': [60, 130, 220],
    'Premium': [160, 100, 200],
    'Bold': [220, 60, 60],
    'Friendly': [255, 180, 80],
    'Modern': [100, 160, 240],
    'Elegant': [200, 170, 100],
    'Luxury': [180, 140, 220],
    'Energetic': [255, 100, 60],
    'Warm': [240, 150, 100],
    'Playful': [255, 140, 180],
    'Serious': [80, 90, 120],
    'Family-friendly': [120, 200, 160],
    'Loving': [230, 80, 150],
    'Joyful': [255, 200, 60],
    'Funny': [255, 160, 60],
    'Emotional': [180, 100, 200],
    'Magical': [160, 120, 240],
    'Calm': [100, 200, 200],
    'Uplifting': [255, 180, 100],
    'Cute': [255, 160, 200],
    'Proud': [200, 160, 80],
    'Nostalgic': [180, 140, 120],
    'Celebratory': [255, 200, 100],
    'Custom': [200, 140, 220]
  };

  // Style affects particle speed/pattern
  const styleEnergy = {
    'pop-catchy': 1.4,
    'soft-emotional': 0.5,
    'elegant-luxury': 0.7,
    'modern-clean': 0.9,
    'cinematic': 0.8,
    'playful-bright': 1.3,
    'minimal-classy': 0.6,
    'epic-memorable': 1.2,
    'retro-charm': 1.0,
    'corporate-premium': 0.8,
    'calm-beautiful': 0.4,
    'custom': 0.9
  };

  function getAuraColors() {
    if (state.moods.length === 0) {
      return state.path === 'personal'
        ? [[230, 80, 150], [200, 100, 220]]
        : [[80, 160, 220], [100, 200, 200]];
    }
    return state.moods.map(m => moodColors[m] || [180, 140, 220]);
  }

  function getAuraEnergy() {
    return styleEnergy[state.style] || 0.8;
  }

  function drawAura(ctx, size, time) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const colors = getAuraColors();
    const energy = getAuraEnergy();
    const hasPhrase = state.phrase.length > 0;
    const phraseLen = Math.min(state.phrase.length / 30, 1);

    ctx.clearRect(0, 0, size, size);

    // Background glow
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.6);
    const c1 = colors[0] || [180, 100, 220];
    const c2 = colors[1] || colors[0] || [100, 180, 220];
    bgGrad.addColorStop(0, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.15)`);
    bgGrad.addColorStop(0.5, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0.06)`);
    bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Orbiting rings
    const ringCount = 3 + Math.floor(phraseLen * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (time * 0.005 * energy + i * (Math.PI * 2 / ringCount));
      const ringR = r * (0.5 + i * 0.12);
      const wobble = Math.sin(time * 0.008 * energy + i) * 8;

      ctx.beginPath();
      ctx.ellipse(cx, cy, ringR + wobble, ringR * 0.7 + wobble * 0.5,
        angle, 0, Math.PI * 2);
      const col = colors[i % colors.length] || c1;
      ctx.strokeStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${0.12 + phraseLen * 0.08})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Central orb
    const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.5);
    const pulse = Math.sin(time * 0.015) * 0.1 + 0.9;
    orbGrad.addColorStop(0, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, ${0.3 * pulse})`);
    orbGrad.addColorStop(0.6, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, ${0.1 * pulse})`);
    orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Floating particles within the aura
    const particleCount = 8 + Math.floor(phraseLen * 12);
    for (let i = 0; i < particleCount; i++) {
      const a = (time * 0.003 * energy + i * 1.7);
      const dist = r * (0.2 + Math.sin(time * 0.004 + i * 0.5) * 0.3);
      const px = cx + Math.cos(a) * dist;
      const py = cy + Math.sin(a * 1.3) * dist * 0.8;
      const pSize = 1 + Math.sin(time * 0.01 + i) * 0.8;
      const col = colors[i % colors.length] || c1;
      const alpha = 0.3 + Math.sin(time * 0.008 + i * 2) * 0.2;

      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`;
      ctx.fill();
    }

    // Musical note waveform lines (when phrase exists)
    if (hasPhrase) {
      ctx.save();
      ctx.globalAlpha = 0.15 + phraseLen * 0.1;
      ctx.strokeStyle = `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = cx - r * 0.6; x < cx + r * 0.6; x += 2) {
        const normX = (x - (cx - r * 0.6)) / (r * 1.2);
        const amp = Math.sin(normX * Math.PI) * 12 * energy;
        const waveY = cy + Math.sin(normX * 8 + time * 0.02 * energy) * amp;
        if (x === cx - r * 0.6) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Vocal indicator (sparkle at top)
    if (state.prefs.vocals) {
      const sparkleAngle = time * 0.02;
      const sx = cx + Math.cos(sparkleAngle) * r * 0.15;
      const sy = cy - r * 0.35 + Math.sin(sparkleAngle * 1.5) * 3;
      drawSparkle(ctx, sx, sy, 4, `rgba(255, 255, 255, 0.6)`);
    }
  }

  function drawSparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * size, y + Math.sin(a) * size);
      ctx.lineTo(x + Math.cos(a + Math.PI / 4) * size * 0.3, y + Math.sin(a + Math.PI / 4) * size * 0.3);
    }
    ctx.fill();
    ctx.restore();
  }

  function animateAura() {
    auraTime++;
    drawAura(auraCtx, AURA_SIZE, auraTime);

    // Mini aura on summary
    if (auraCtxMini && state.currentStep === 7) {
      drawAura(auraCtxMini, 120, auraTime);
    }

    // Pill aura
    if (pillAuraCtx && state.currentStep >= 2) {
      drawAura(pillAuraCtx, 64, auraTime);
    }

    requestAnimationFrame(animateAura);
  }

  function updateAura() {
    // Aura updates automatically via animation loop
    // This function can trigger visual transitions if needed
  }

  animateAura();

  // ─── SMOOTH ANCHOR LINKS ─────────────────────────────────
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── INITIAL STATE ───────────────────────────────────────
  updateProgress();

})();
