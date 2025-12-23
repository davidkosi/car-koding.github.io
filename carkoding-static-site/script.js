// CarKoding — minimal JS for menu + language dropdown + form UX
(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const lang = document.querySelector('.lang');
  const langBtn = document.querySelector('.lang-btn');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on link click (mobile)
  nav?.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLAnchorElement) closeNav();
  });

  // Smooth scroll for in-page anchors (respects reduced motion)
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeNav();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', href);
  });

  // Language dropdown (UI only). Keep SI as default like your screenshot.
  function closeLang() {
    lang?.classList.remove('open');
    langBtn?.setAttribute('aria-expanded', 'false');
  }
  langBtn?.addEventListener('click', () => {
    const isOpen = lang.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!lang) return;
    if (e.target instanceof Node && !lang.contains(e.target)) closeLang();
  });

  // Form: create a WhatsApp message from fields (no backend needed).
  const form = document.getElementById('compat-form');
  const hint = document.getElementById('form-hint');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const interests = [];
    form.querySelectorAll('input[name="interest"]:checked').forEach((el) => {
      interests.push(el.value);
    });

    const msgLines = [
      'Pozdravljeni!',
      '',
      'Želim preveriti kompatibilnost:',
      `Ime: ${fd.get('name') || ''}`,
      `Telefon: ${fd.get('phone') || ''}`,
      `E-pošta: ${fd.get('email') || ''}`,
      `Vozilo: ${fd.get('brand') || ''} ${fd.get('model') || ''} (${fd.get('year') || ''})`,
      `Infotainment: ${fd.get('infotainment') || ''}`,
      `Zanima me: ${interests.join(', ') || '—'}`,
      `Sporočilo: ${fd.get('message') || '—'}`,
    ];

    const text = encodeURIComponent(msgLines.join('\n'));
    const waUrl = `https://wa.me/386XXXXXXXX?text=${text}`;

    if (hint) {
      hint.textContent = 'Odpiram WhatsApp z vašimi podatki…';
    }
    window.open(waUrl, '_blank', 'noopener');

    // Optional: clear form
    // form.reset();
  });
})();
