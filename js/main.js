/* Hayat Tourism homepage interactions. No dependencies. */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Nav: transparent over hero, solid after ---------- */
(() => {
  const nav = document.querySelector('[data-nav]');
  const hero = document.querySelector('[data-hero]');
  if (!nav) return;

  if (hero) {
    const io = new IntersectionObserver(
      ([entry]) => nav.classList.toggle('is-solid', !entry.isIntersecting),
      { rootMargin: `-${nav.offsetHeight}px 0px 0px 0px` }
    );
    io.observe(hero);
  } else {
    nav.classList.add('is-solid');
  }

  // Dropdowns (click/keyboard; hover handled in CSS on desktop)
  const items = [...nav.querySelectorAll('.has-dropdown')];
  const closeAll = (except) => items.forEach((item) => {
    if (item === except) return;
    item.classList.remove('is-open');
    item.querySelector('.nav__link').setAttribute('aria-expanded', 'false');
  });
  items.forEach((item) => {
    const btn = item.querySelector('.nav__link');
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) closeAll(); });

  // Mobile drawer
  const burger = nav.querySelector('[data-burger]');
  const toggleDrawer = (force) => {
    const open = force ?? !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.querySelector('i').className = open ? 'ph ph-x' : 'ph ph-list';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger?.addEventListener('click', () => toggleDrawer());
  window.matchMedia('(min-width: 75em)').addEventListener('change', (e) => { if (e.matches) toggleDrawer(false); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = items.find((i) => i.classList.contains('is-open'));
    closeAll();
    if (open) open.querySelector('.nav__link').focus();
    if (nav.classList.contains('is-open')) { toggleDrawer(false); burger.focus(); }
  });
})();

/* ---------- Theme toggle: data-theme="dark" on <html>, saved as hayat-theme (applied early by an inline <head> script) ---------- */
(() => {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => btn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  sync();
  btn.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('hayat-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage blocked: theme still applies for this page */ }
    sync();
  });
})();

/* ---------- Hero scroll: floating card -> full bleed + video parallax (rAF-throttled scroll) ---------- */
(() => {
  const hero = document.querySelector('[data-hero]');
  const video = document.querySelector('[data-hero-video]');
  if (!hero) return;
  if (reduceMotion) { hero.style.setProperty('--hs', '1'); return; } // static end state

  const PARALLAX = 0.3;
  const REVEAL = 0.5; // corners/gap finish closing after scrolling half the hero's height
  let heroH = hero.offsetHeight;
  let ticking = false;
  let done = false; // past the hero: final state written once, then skip work

  const update = () => {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    if (y > heroH) {
      if (done) return;
      done = true;
    } else {
      done = false;
    }
    const p = Math.min(1, y / (heroH * REVEAL));
    hero.style.setProperty('--hs', p.toFixed(4));
    if (video) video.style.transform = `translate3d(0, ${(Math.min(y, heroH) * PARALLAX).toFixed(1)}px, 0)`;
  };

  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { heroH = hero.offsetHeight; done = false; request(); });
  update();
})();

/* ---------- Hero video: respect reduced motion, pause control ---------- */
(() => {
  const video = document.querySelector('[data-hero-video]');
  const btn = document.querySelector('[data-video-toggle]');
  if (!video || !btn) return;

  const setState = (paused) => {
    btn.setAttribute('aria-pressed', String(paused));
    btn.querySelector('i').className = paused ? 'ph-fill ph-play' : 'ph-fill ph-pause';
    btn.querySelector('.sr-only').textContent = paused ? 'Play background video' : 'Pause background video';
  };
  if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); setState(true); }

  btn.addEventListener('click', () => {
    if (video.paused) { video.play().catch(() => {}); setState(false); }
    else { video.pause(); setState(true); }
  });
  // Control starts hidden; it only appears once there is real video to pause
  // (stays hidden if the file fails to load).
  const reveal = () => { btn.hidden = false; };
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reveal();
  else video.addEventListener('loadeddata', reveal, { once: true });
})();

/* ---------- Discover gallery: drag-to-scroll, scroll-in, lightbox ---------- */
(() => {
  const section = document.querySelector('[data-gallery]');
  if (!section) return;
  const strip = section.querySelector('[data-drag-scroll]');

  // Mouse drag to scroll (touch/pen keep native scrolling). A drag past 5px suppresses the click.
  let startX = 0, startScroll = 0, dragging = false, moved = false;
  strip.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = false;
    startX = e.clientX; startScroll = strip.scrollLeft;
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) { moved = true; strip.classList.add('is-dragging'); }
    if (moved) { e.preventDefault(); strip.scrollLeft = startScroll - dx; }
  });
  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    strip.classList.remove('is-dragging');
  });
  strip.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  // Staggered scroll-in
  if (!reduceMotion) {
    section.setAttribute('data-animate', '');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('is-in');
      io.disconnect();
    }, { threshold: 0.2 });
    io.observe(strip);
  }

  // Lightbox (native <dialog>: Esc closes, focus returns to the card)
  const dialog = document.querySelector('[data-lightbox-dialog]');
  if (!dialog) return;
  // Image element is added by JS (src set on open) so the markup never ships an empty src
  const img = document.createElement('img');
  img.className = 'lightbox__img';
  dialog.querySelector('.lightbox__figure').prepend(img);
  const title = dialog.querySelector('[data-lightbox-title]');
  const desc = dialog.querySelector('[data-lightbox-desc]');
  let opener = null;

  strip.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lightbox]');
    if (!btn) return;
    img.src = btn.dataset.lightbox;
    img.alt = btn.dataset.title;
    title.textContent = btn.dataset.title;
    desc.textContent = btn.dataset.desc;
    opener = btn;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // backdrop
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    opener?.focus({ preventScroll: true });
  });
})();

/* ---------- Scroll reveal: [data-reveal] sections fade + slide up once ---------- */
(() => {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || reduceMotion) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  els.forEach((el) => { el.classList.add('reveal-ready'); io.observe(el); });
})();

/* ---------- Inquiry form ---------- */
(() => {
  const form = document.querySelector('[data-inquiry]');
  if (!form) return;
  const error = form.querySelector('[data-form-error]');
  const done = form.querySelector('[data-form-done]');

  // Steppers
  const syncs = [];
  form.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const input = stepper.querySelector('input');
    const min = Number(stepper.dataset.min);
    const max = Number(stepper.dataset.max);
    const [dec, inc] = stepper.querySelectorAll('button');
    const sync = () => {
      dec.disabled = Number(input.value) <= min;
      inc.disabled = Number(input.value) >= max;
    };
    stepper.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-step]');
      if (!btn) return;
      input.value = Math.min(max, Math.max(min, Number(input.value) + Number(btn.dataset.step)));
      sync();
    });
    sync();
    syncs.push(sync);
  });

  // Dates: no past arrival, departure after arrival
  const arrive = form.querySelector('#f-arrive');
  const depart = form.querySelector('#f-depart');
  const today = new Date().toISOString().slice(0, 10);
  arrive.min = today;
  depart.min = today;
  arrive.addEventListener('change', () => { depart.min = arrive.value || today; });

  // Inline error slot under each required field, linked via aria-describedby
  const errorFor = (el) => {
    let p = document.getElementById(`${el.id}-error`);
    if (!p) {
      p = document.createElement('p');
      p.id = `${el.id}-error`;
      p.className = 'field__error';
      el.closest('.field').append(p);
      el.setAttribute('aria-describedby', p.id);
    }
    return p;
  };
  let submitted = false;

  const validate = () => {
    const problems = [];
    form.querySelectorAll('[aria-invalid]').forEach((f) => {
      f.removeAttribute('aria-invalid');
      errorFor(f).textContent = '';
    });
    const flag = (el, msg) => {
      el.setAttribute('aria-invalid', 'true');
      errorFor(el).textContent = msg;
      problems.push([el, msg]);
    };

    if (!form.destination.value) flag(form.destination, 'Choose a destination.');
    if (!arrive.value) flag(arrive, 'Add your arrival date.');
    if (!depart.value) flag(depart, 'Add your departure date.');
    else if (arrive.value && depart.value <= arrive.value) flag(depart, 'Departure needs to be after arrival.');
    if (!/^\+?[\d\s()-]{7,}$/.test(form.phone.value.trim())) flag(form.phone, 'Add a WhatsApp number, including country code.');
    return problems;
  };

  // After a failed submit, re-check as the user fixes fields
  form.addEventListener('change', () => { if (submitted) error.hidden = validate().length === 0; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitted = true;
    const problems = validate();
    if (problems.length) {
      error.textContent = problems.length === 1 ? 'Fix the highlighted field.' : `Fix the ${problems.length} highlighted fields.`;
      error.hidden = false;
      problems[0][0].focus();
      return;
    }
    error.hidden = true;
    // TODO(phase 2): send to the client's lead endpoint / WhatsApp Business number.
    done.hidden = false;
    done.focus();
  });

  form.querySelector('[data-form-reset]').addEventListener('click', () => {
    form.reset();
    submitted = false;
    syncs.forEach((s) => s());
    done.hidden = true;
    form.destination.focus();
  });
})();

/* ---------- Newsletter ---------- */
(() => {
  const form = document.querySelector('[data-subscribe]');
  const msg = document.querySelector('[data-subscribe-msg]');
  if (!form || !msg) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = form.email.validity.valid && form.email.value.trim() !== '';
    msg.classList.toggle('is-error', !ok);
    msg.textContent = ok
      ? 'Subscribed. Check your inbox to confirm.'
      : 'Enter a valid email address, like name@example.com.';
    if (ok) form.reset(); else form.email.focus();
  });
})();

/* ---------- Footer: planner availability on East Africa Time ---------- */
(() => {
  const box = document.querySelector('[data-status]');
  if (!box) return;
  const time = box.querySelector('[data-status-time]');
  const label = box.querySelector('[data-status-label]');
  const sub = box.querySelector('[data-status-sub]');
  // PLACEHOLDER hours: 08:00-20:00 EAT daily. Confirm with client.
  const OPEN = 8, CLOSE = 20;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

  const tick = () => {
    const now = new Date();
    const hhmm = fmt.format(now);
    const h = Number(hhmm.slice(0, 2));
    const online = h >= OPEN && h < CLOSE;
    time.textContent = `${hhmm} EAT`;
    time.dateTime = now.toISOString();
    box.classList.toggle('is-offline', !online);
    label.textContent = online ? 'Planners online' : 'Planners offline';
    sub.textContent = online ? 'Replies usually within the hour' : `Back at ${String(OPEN).padStart(2, '0')}:00 EAT. Leave a message anytime.`;
  };
  tick();
  setInterval(tick, 30_000);

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
