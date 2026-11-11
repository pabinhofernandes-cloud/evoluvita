/* EvoluVita — interações e animações de rolagem (sem dependências) */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Títulos palavra por palavra ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); continue; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            w.append(inner);
            frag.append(w);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      }
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
    el.querySelectorAll('.w').forEach((w) => w.setAttribute('aria-hidden', 'true'));
  }

  /* ---------- Revelações ao entrar na tela ---------- */
  function setupReveals() {
    const items = Array.from(document.querySelectorAll('[data-reveal], [data-split]'));
    const showAll = () => items.forEach((el) => el.classList.add('is-visible'));
    if (reduce || !('IntersectionObserver' in window)) { showAll(); return; }

    document.querySelectorAll('[data-split]').forEach(splitWords);

    // cascata suave entre irmãos (listas, cartões, galeria)
    const groups = new Map();
    items.forEach((el) => {
      if (!el.parentElement) return;
      const list = groups.get(el.parentElement) || [];
      list.push(el);
      groups.set(el.parentElement, list);
    });
    groups.forEach((list) => {
      if (list.length < 2) return;
      list.forEach((el, n) => {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(n, 6) * 0.09}s`);
      });
    });

    root.classList.add('reveal-ready');

    // o hero entra assim que a página carrega
    document.querySelectorAll('.hero [data-split]').forEach((el) => requestAnimationFrame(() => el.classList.add('is-visible')));

    let fired = false;
    const io = new IntersectionObserver((entries) => {
      fired = true;
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));

    // segurança: se algo falhar, tudo aparece
    setTimeout(() => { if (!fired) { io.disconnect(); showAll(); } }, 3000);
  }

  /* ---------- Linha do tempo "Como funciona" ---------- */
  function setupSteps() {
    const list = document.querySelector('[data-steps]');
    if (!list) return;
    const steps = Array.from(list.querySelectorAll('[data-step]'));
    const fill = list.querySelector('.stem-fill');
    if (reduce) { steps.forEach((s) => s.classList.add('is-on')); fill && fill.style.setProperty('--progress', 1); return; }
    list.classList.add('steps-ready');

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const anchor = vh * 0.6; // a linha "chega" a cada etapa nesta altura da tela
      const r = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      fill.style.setProperty('--progress', progress.toFixed(4));
      steps.forEach((s) => {
        const top = s.getBoundingClientRect().top;
        s.classList.toggle('is-on', top < anchor);
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Topo: fundo ao rolar e versão clara sobre seções escuras ---------- */
  function setupHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
    const darks = Array.from(document.querySelectorAll('[data-surface="dark"]'));
    let ticking = false;
    const update = () => {
      ticking = false;
      header.toggleAttribute('data-scrolled', window.scrollY > 24);
      const mid = header.offsetHeight / 2;
      header.toggleAttribute('data-dark', darks.some((d) => {
        const r = d.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      }));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Botão flutuante do WhatsApp ---------- */
  function setupWhatsFloat() {
    const btn = document.querySelector('[data-wa]');
    const hero = document.querySelector('.hero');
    const contact = document.querySelector('#contato');
    const footer = document.querySelector('.footer');
    if (!btn || !('IntersectionObserver' in window)) return;
    const state = { hero: true, end: false };
    const apply = () => btn.toggleAttribute('data-hidden', state.hero || state.end);
    new IntersectionObserver(([e]) => { state.hero = e.isIntersecting && e.intersectionRatio > 0.35; apply(); }, { threshold: [0, 0.35, 1] }).observe(hero);
    const endIO = new IntersectionObserver((entries) => {
      state.end = entries.some((e) => e.isIntersecting) || [contact, footer].some((el) => {
        const r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0;
      });
      apply();
    });
    [contact, footer].forEach((el) => el && endIO.observe(el));
    apply();
  }

  /* ---------- Menu do celular ---------- */
  function setupMenu() {
    const menu = document.querySelector('[data-menu]');
    const open = document.querySelector('[data-menu-open]');
    if (!menu || !open || typeof menu.showModal !== 'function') return;
    open.addEventListener('click', () => { menu.showModal(); open.setAttribute('aria-expanded', 'true'); });
    menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()));
    menu.addEventListener('close', () => { open.setAttribute('aria-expanded', 'false'); });
  }

  /* ---------- Cartões de "Atendimento": pulam uma vez e assentam ---------- */
  document.querySelectorAll('[data-card]').forEach((card) => {
    // ordem de entrada dentro do próprio grupo (um após o outro)
    const siblings = Array.from(card.parentElement.querySelectorAll(':scope > [data-card]'));
    card.style.setProperty('--n', siblings.indexOf(card));
    card.addEventListener('animationend', (e) => {
      if (e.animationName === 'card-bounce') card.classList.add('is-settled');
    });
  });

  /* ---------- Quadrados interativos: inclinação + brilho seguindo o cursor ---------- */
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('[data-card]').forEach((card) => {
    if (fine && !reduce) {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        if (!card.classList.contains('is-settled')) return;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    }
    if (!reduce) {
      card.addEventListener('pointerdown', () => {
        card.classList.remove('is-pressed');
        void card.offsetWidth;
        card.classList.add('is-pressed');
      });
    }
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  setupReveals();
  setupSteps();
  setupHeader();
  setupWhatsFloat();
  setupMenu();
})();
