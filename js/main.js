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

  /* ---------- Fio condutor: linha que se desenha com a rolagem ---------- */
  function setupThread() {
    const svg = document.querySelector('[data-thread]');
    if (!svg) return;
    const track = svg.querySelector('.thread-track');
    const line = svg.querySelector('.thread-line');
    const dot = svg.querySelector('.thread-dot');
    const glow = svg.querySelector('.thread-dot-glow');
    const hero = document.querySelector('.hero');
    const end = document.querySelector('#contato');
    const sections = Array.from(document.querySelectorAll('main > section')).filter((s) => s !== hero && s !== end && !s.classList.contains('hero'));
    let total = 0, table = [], startY = 0, endY = 0, ticking = false;

    const pageY = (el) => el.getBoundingClientRect().top + window.scrollY;

    function build() {
      const W = document.documentElement.clientWidth;
      const docH = document.documentElement.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${docH}`);
      svg.style.height = docH + 'px';
      const gutter = Math.max(14, Math.min(40, (W - 1240) / 2 + 22, W * 0.035));
      const L = gutter, R = W - gutter;
      const pad = W < 900 ? 46 : 70;

      // começa no fim do hero, no centro
      startY = pageY(hero) + hero.offsetHeight - 30;
      let d = `M ${W / 2} ${startY}`;
      let side = 0; // 0 = esquerda, 1 = direita
      let prevX = W / 2, prevY = startY;
      sections.forEach((sec) => {
        const top = pageY(sec), bottom = top + sec.offsetHeight;
        const x = side === 0 ? L : R;
        const y1 = top + pad, y2 = bottom - pad;
        // curva até a lateral desta seção (cruza no respiro entre seções)
        const my = (prevY + y1) / 2;
        d += ` C ${prevX} ${my}, ${x} ${my}, ${x} ${y1}`;
        d += ` L ${x} ${y2}`;
        prevX = x; prevY = y2; side = 1 - side;
      });
      // termina no início do contato, no centro
      endY = pageY(end) + 40;
      const my = (prevY + endY) / 2;
      d += ` C ${prevX} ${my}, ${W / 2} ${my}, ${W / 2} ${endY}`;

      track.setAttribute('d', d);
      line.setAttribute('d', d);
      total = line.getTotalLength();
      line.style.strokeDasharray = `${total} ${total}`;

      // tabela comprimento -> y para achar o ponto da linha na altura da tela
      table = [];
      const N = 600;
      for (let i = 0; i <= N; i++) {
        const len = (total * i) / N;
        table.push([len, line.getPointAtLength(len).y]);
      }
      update();
    }

    function lengthAtY(y) {
      if (y <= table[0][1]) return 0;
      let best = 0;
      for (let i = 0; i < table.length; i++) {
        if (table[i][1] <= y) best = table[i][0];
        else if (table[i][1] > y + 400) break;
      }
      return best;
    }

    function update() {
      ticking = false;
      if (!total) return;
      const anchorY = window.scrollY + window.innerHeight * (reduce ? 10 : 0.62);
      const len = reduce ? total : lengthAtY(anchorY);
      line.style.strokeDashoffset = String(total - len);
      const pt = line.getPointAtLength(Math.max(0.01, len));
      const visible = len > 2 && len < total - 1;
      [dot, glow].forEach((c) => { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = visible ? '' : '0'; });
      // linha mais clara quando atravessa seções escuras
      const darkHere = Array.from(document.querySelectorAll('main [data-surface="dark"]')).some((s) => {
        const t = pageY(s); return pt.y >= t && pt.y <= t + s.offsetHeight;
      });
      svg.classList.toggle('is-dark-zone', darkHere);
    }

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    let rT; const onResize = () => { clearTimeout(rT); rT = setTimeout(build, 150); };
    window.addEventListener('resize', onResize);
    window.addEventListener('load', build);
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(document.body);
    build();
  }
  setupThread();

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  setupReveals();
  setupSteps();
  setupHeader();
  setupWhatsFloat();
  setupMenu();
})();
