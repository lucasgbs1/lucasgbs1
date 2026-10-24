/* Mel Jataí. JavaScript puro, sem dependências. */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch { /* armazenamento indisponível */ } },
  };

  /* Clona o pote do hero com ids únicos, para que cada cópia tenha os próprios gradientes. */
  const source = document.querySelector("[data-jar-source] svg");
  let jarCount = 0;
  function cloneJar(target) {
    if (!source || !target) return null;
    const suffix = `-${++jarCount}`;
    const html = source.outerHTML
      .replace(/id="j-([a-z]+)"/g, `id="j-$1${suffix}"`)
      .replace(/url\(#j-([a-z]+)\)/g, `url(#j-$1${suffix})`);
    target.innerHTML = html;
    const svg = target.querySelector("svg");
    svg.setAttribute("aria-hidden", "true");
    svg.removeAttribute("role");
    return svg;
  }

  /* Entrada do hero */
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-loaded")));

  /* Revelação por IntersectionObserver */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: .12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Navegação local muda de tema conforme a seção abaixo dela */
  const localnav = document.querySelector("[data-localnav]");
  const lightSections = [...document.querySelectorAll(".theme-light, .footer")];

  /* História com sticky: escala, posição e opacidade guiadas pela rolagem */
  const story = document.querySelector("[data-story]");
  const storyJar = document.querySelector("[data-story-jar]");
  const storyBar = document.querySelector("[data-story-bar]");
  const panels = [...document.querySelectorAll("[data-panel]")];
  cloneJar(storyJar);

  // Quadros-chave do pote: [progresso, escala, deslocamento x em vw, rotação]
  const keyframesWide = [[0, 1, 12, 0], [.24, 1, 12, -2], [.36, .42, -14, 0], [.5, .42, -14, 0], [.62, .9, 14, 3], [.76, .9, 14, 0], [.88, 1.22, -12, 0], [1, 1.22, -12, 0]];
  const keyframesNarrow = [[0, 1, 0, 0], [.24, 1, 0, 0], [.36, .5, 0, 0], [.5, .5, 0, 0], [.62, .9, 0, 2], [.76, .9, 0, 0], [.88, 1.08, 0, 0], [1, 1.08, 0, 0]];

  function sample(frames, p) {
    for (let i = 1; i < frames.length; i++) {
      if (p <= frames[i][0]) {
        const a = frames[i - 1], b = frames[i];
        const t = ease(clamp((p - a[0]) / (b[0] - a[0] || 1)));
        return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
      }
    }
    const last = frames[frames.length - 1];
    return [last[1], last[2], last[3]];
  }

  function updateStory() {
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const span = story.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / span);
    const narrow = window.innerWidth <= 834;
    const [s, x, r] = sample(narrow ? keyframesNarrow : keyframesWide, p);

    storyJar.style.setProperty("--s", s.toFixed(4));
    storyJar.style.setProperty("--x", `${x.toFixed(3)}vw`);
    storyJar.style.setProperty("--r", `${r.toFixed(3)}deg`);
    storyBar.style.setProperty("--p", p.toFixed(4));

    panels.forEach((panel) => {
      const from = +panel.dataset.from, to = +panel.dataset.to;
      const len = to - from;
      const local = (p - from) / len;
      const fadeIn = clamp(local / .28);
      const fadeOut = to > 1 ? 1 : clamp((1 - local) / .22);
      const o = local < 0 || local > 1 ? 0 : Math.min(fadeIn, fadeOut);
      const ty = local < .5 ? (1 - fadeIn) * 40 : -(1 - fadeOut) * 40;
      panel.style.setProperty("--o", o.toFixed(3));
      panel.style.setProperty("--ty", `${ty.toFixed(2)}px`);
      panel.setAttribute("aria-hidden", o < .05 ? "true" : "false");
    });
  }

  function updateNav() {
    if (!localnav) return;
    const probe = localnav.getBoundingClientRect().bottom;
    const onLight = lightSections.some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    localnav.classList.toggle("is-light", onLight);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateStory();
      updateNav();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Sensorial: vídeo real se houver, senão animação em canvas */
  const media = document.querySelector("[data-media]");
  const toggle = document.querySelector("[data-media-toggle]");
  const canvas = document.querySelector("[data-pour]");
  let player = null;

  if (media && media.dataset.video) {
    const video = document.createElement("video");
    Object.assign(video, { src: media.dataset.video, muted: true, loop: true, playsInline: true, autoplay: !reducedMotion.matches });
    video.setAttribute("aria-hidden", "true");
    media.prepend(video);
    canvas.remove();
    player = {
      play: () => video.play().catch(() => {}),
      pause: () => video.pause(),
    };
  } else if (canvas) {
    player = createPour(canvas);
  }

  let paused = reducedMotion.matches;
  function setPaused(value) {
    paused = value;
    media.classList.toggle("is-paused", paused);
    toggle.setAttribute("aria-label", paused ? "Reproduzir animação" : "Pausar animação");
    if (paused) player.pause(); else player.play();
  }
  if (player) {
    toggle.addEventListener("click", () => setPaused(!paused));
    // Só anima quando a mídia está visível
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (paused) return;
        if (entry.isIntersecting) player.play(); else player.pause();
      }, { threshold: .15 }).observe(media);
    }
    setPaused(paused);
    if (paused && player.drawOnce) player.drawOnce();
  }

  function createPour(cv) {
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, t = 0, last = 0;
    const ripples = [];
    let nextRipple = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      // Luz ambiente quente, muito baixa
      const bg = ctx.createRadialGradient(w * .5, h * .78, 0, w * .5, h * .78, Math.max(w, h) * .7);
      bg.addColorStop(0, "rgba(120, 66, 12, .32)");
      bg.addColorStop(.5, "rgba(40, 20, 4, .18)");
      bg.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const poolY = h * .8;
      const cx = w * .5;
      const poolRx = Math.min(w * .36, h * .62);
      const poolRy = poolRx * .14;

      // Poça
      const pool = ctx.createRadialGradient(cx, poolY - poolRy * .3, poolRy * .2, cx, poolY, poolRx);
      pool.addColorStop(0, "#e9a53a");
      pool.addColorStop(.35, "#b8680f");
      pool.addColorStop(.8, "#5e2c04");
      pool.addColorStop(1, "rgba(40, 18, 2, 0)");
      ctx.fillStyle = pool;
      ctx.beginPath();
      ctx.ellipse(cx, poolY, poolRx, poolRy, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ondas concêntricas
      for (const r of ripples) {
        const k = r.age / r.life;
        const a = (1 - k) * .45;
        ctx.strokeStyle = `rgba(255, 214, 140, ${a.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, poolY, poolRx * .08 + poolRx * .82 * ease(k), (poolRx * .08 + poolRx * .82 * ease(k)) * .14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Fio de mel: afina de cima para baixo e balança devagar
      const sway = Math.sin(t * .6) * w * .006;
      const topW = Math.max(10, w * .018), botW = Math.max(4, w * .007);
      const steps = 28;
      const left = [], right = [];
      for (let i = 0; i <= steps; i++) {
        const k = i / steps;
        const y = lerp(-10, poolY - poolRy * .2, k);
        const x = cx + sway * Math.sin(k * Math.PI) + Math.sin(t * 1.3 + k * 6) * .6;
        const half = lerp(topW, botW, Math.pow(k, .6)) / 2 * (1 + Math.sin(t * 2 + k * 9) * .03);
        left.push([x - half, y]);
        right.push([x + half, y]);
      }
      const streamGrad = ctx.createLinearGradient(cx - topW, 0, cx + topW, 0);
      streamGrad.addColorStop(0, "#7a3b05");
      streamGrad.addColorStop(.4, "#e7a43a");
      streamGrad.addColorStop(.6, "#f6c56a");
      streamGrad.addColorStop(1, "#8a4507");
      ctx.fillStyle = streamGrad;
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      left.forEach(([x, y]) => ctx.lineTo(x, y));
      for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
      ctx.closePath();
      ctx.fill();

      // Reflexo especular no fio
      ctx.strokeStyle = "rgba(255, 238, 200, .55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      left.forEach(([x, y], i) => {
        const hx = x + (right[i][0] - x) * .62;
        if (i === 0) ctx.moveTo(hx, y); else ctx.lineTo(hx, y);
      });
      ctx.stroke();

      // Pequeno acúmulo onde o fio toca a poça
      const mound = ctx.createRadialGradient(cx, poolY - poolRy * .25, 0, cx, poolY - poolRy * .25, poolRx * .12);
      mound.addColorStop(0, "rgba(250, 200, 110, .85)");
      mound.addColorStop(1, "rgba(250, 200, 110, 0)");
      ctx.fillStyle = mound;
      ctx.beginPath();
      ctx.ellipse(cx, poolY - poolRy * .2, poolRx * .12, poolRy * .45, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function frame(now) {
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      t += dt;
      if (t >= nextRipple) {
        ripples.push({ age: 0, life: 4.2 });
        nextRipple = t + 1.4;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += dt;
        if (ripples[i].age >= ripples[i].life) ripples.splice(i, 1);
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(cv);
    else window.addEventListener("resize", resize);
    resize();

    return {
      play() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } },
      pause() { cancelAnimationFrame(raf); raf = 0; },
      drawOnce() { ripples.push({ age: 1.2, life: 4.2 }, { age: 2.6, life: 4.2 }); draw(); },
    };
  }

  /* Loja */
  const PRODUCTS = {
    100: { price: 89, label: "100 g", scale: 1, preorder: false },
    250: { price: 189, label: "250 g", scale: 1.22, preorder: true },
  };
  const INSTALLMENTS = 3;
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const form = document.querySelector("[data-buy-form]");
  const buyJarHost = document.querySelector("[data-buy-jar]");
  const buyJar = cloneJar(buyJarHost);
  const badge = document.querySelector("[data-buy-badge]");
  const qtyOut = document.querySelector("[data-qty-value]");
  const qtyButtons = document.querySelectorAll("[data-qty]");
  const elName = document.querySelector("[data-summary-name]");
  const elTotal = document.querySelector("[data-summary-total]");
  const elSub = document.querySelector("[data-summary-sub]");
  const cta = document.querySelector("[data-buy-cta]");
  const bagBadge = document.querySelector("[data-bag-count]");
  const bagLink = document.querySelector(".globalnav__bag");
  const toast = document.querySelector("[data-toast]");
  let qty = 1;
  let bag = parseInt(storage.get("mj-bag") || "0", 10) || 0;

  document.querySelectorAll("[data-price-for]").forEach((el) => {
    el.textContent = brl.format(PRODUCTS[el.dataset.priceFor].price);
  });

  function renderBag() {
    bagBadge.hidden = bag === 0;
    bagBadge.textContent = String(bag);
    bagLink.setAttribute("aria-label", `Sacola de compras, ${bag} ${bag === 1 ? "item" : "itens"}`);
  }

  function renderBuy() {
    const data = new FormData(form);
    const size = data.get("size");
    const biome = data.get("biome");
    const product = PRODUCTS[size];
    const total = product.price * qty;

    elName.textContent = `Mel Jataí ${product.label}, ${biome}${qty > 1 ? ` (${qty} potes)` : ""}`;
    elTotal.textContent = brl.format(total);
    elSub.textContent = `ou ${INSTALLMENTS}x de ${brl.format(Math.round((total / INSTALLMENTS) * 100) / 100)} sem juros`;
    cta.textContent = product.preorder ? "Reservar" : "Comprar";
    badge.textContent = product.preorder ? "Pré-venda" : "Pronta entrega";
    badge.classList.toggle("is-preorder", product.preorder);
    qtyOut.textContent = String(qty);
    qtyButtons.forEach((b) => { b.disabled = (+b.dataset.qty < 0 && qty <= 1) || (+b.dataset.qty > 0 && qty >= 6); });

    if (buyJar) {
      buyJarHost.style.setProperty("--jar-scale", product.scale);
      buyJarHost.classList.toggle("is-light-honey", biome === "Mata Atlântica");
      const weight = buyJar.querySelector(".jar__weight");
      if (weight) weight.textContent = product.label;
    }
  }

  if (form) {
    form.addEventListener("change", renderBuy);
    qtyButtons.forEach((b) => b.addEventListener("click", () => {
      qty = clamp(qty + +b.dataset.qty, 1, 6);
      renderBuy();
    }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const product = PRODUCTS[new FormData(form).get("size")];
      bag += qty;
      storage.set("mj-bag", String(bag));
      renderBag();
      showToast(product.preorder ? "Reserva adicionada à sacola." : "Adicionado à sacola.");
    });
    renderBuy();
    renderBag();
  }

  let toastTimer = 0;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2400);
  }

  /* Rodapé: colunas recolhidas no celular */
  const mobileFooter = window.matchMedia("(max-width: 734px)");
  const footerCols = document.querySelectorAll(".footer__col");
  function syncFooter() { footerCols.forEach((d) => { d.open = !mobileFooter.matches; }); }
  footerCols.forEach((d) => d.querySelector("summary").addEventListener("click", (e) => {
    if (!mobileFooter.matches) e.preventDefault();
  }));
  mobileFooter.addEventListener("change", syncFooter);
  syncFooter();

  /* Seletor de região */
  const regionToggle = document.querySelector("[data-region-toggle]");
  const regionList = document.getElementById("region-list");
  regionToggle.addEventListener("click", () => {
    const open = regionToggle.getAttribute("aria-expanded") === "true";
    regionToggle.setAttribute("aria-expanded", String(!open));
    regionList.hidden = open;
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".region") && !regionList.hidden) {
      regionList.hidden = true;
      regionToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* Cookies (LGPD) */
  const cookieBar = document.querySelector("[data-cookie-bar]");
  const dialog = document.querySelector("[data-cookie-dialog]");
  const saved = storage.get("mj-cookies");
  if (!saved) cookieBar.hidden = false;

  function saveConsent(consent) {
    storage.set("mj-cookies", JSON.stringify({ ...consent, date: new Date().toISOString() }));
    cookieBar.hidden = true;
  }
  document.querySelector("[data-cookie-accept]").addEventListener("click", () => saveConsent({ analytics: true, marketing: true }));
  document.querySelectorAll("[data-open-cookies]").forEach((btn) => btn.addEventListener("click", () => {
    let current = {};
    try { current = JSON.parse(storage.get("mj-cookies") || "{}"); } catch { /* valor inválido */ }
    dialog.querySelector('[name="analytics"]').checked = !!current.analytics;
    dialog.querySelector('[name="marketing"]').checked = !!current.marketing;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }));
  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "save") return;
    saveConsent({
      analytics: dialog.querySelector('[name="analytics"]').checked,
      marketing: dialog.querySelector('[name="marketing"]').checked,
    });
    showToast("Preferências salvas.");
  });

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
})();
