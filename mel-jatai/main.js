/* Jataí. Animações com GSAP + ScrollTrigger e rolagem suave com Lenis.
   Se as bibliotecas não carregarem, a página continua legível e funcional. */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");

  const DATA = window.MEIS || { regioes: {}, especies: [], floradas: [], indicacoes: [] };
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = hasGsap && !reduced;
  if (!animate) root.classList.add("no-gsap");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* indisponível */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------------------------------------------------------------
     Conteúdo gerado a partir de data.js
     ------------------------------------------------------------------- */
  const REG_KEYS = Object.keys(DATA.regioes);
  const LEVEL = ["", "Iniciante", "Intermediário", "Avançado"];
  const PROD = ["", "Pouca", "Média", "Boa"];
  const dots = (n) => [1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("");

  function cardHTML(sp, i) {
    const sting = sp.grupo === "Com ferrão";
    return `
      <article class="card" data-id="${sp.id}">
        <div class="card__top">
          <div class="card__meta">
            <span class="card__no">${String(i + 1).padStart(2, "0")}</span>
            <span class="card__tag${sting ? " card__tag--sting" : ""}">${esc(sp.grupo)}</span>
          </div>
          <span class="drop" style="--c:${sp.cor}" aria-hidden="true"></span>
        </div>
        <h3 class="card__name">${esc(sp.nome)}</h3>
        <p class="card__sci">${esc(sp.cientifico)}</p>
        <div class="regions" aria-label="Regiões: ${sp.regioes.map((r) => DATA.regioes[r]).join(", ")}">
          ${REG_KEYS.map((r) => `<span class="${sp.regioes.includes(r) ? "on" : ""}" aria-hidden="true">${r}</span>`).join("")}
        </div>
        <p class="card__mel">${esc(sp.mel)}</p>
        <div class="meters">
          <div><span class="meter__k">Produção</span><span class="meter__v" aria-label="Produção ${PROD[sp.producao]}">${dots(sp.producao)}</span></div>
          <div><span class="meter__k">Manejo</span><span class="meter__v">${LEVEL[sp.manejo]}</span></div>
        </div>
        <button class="card__more" type="button" data-open="${sp.id}" aria-label="Ver ficha de ${esc(sp.nome)}">Ver ficha</button>
      </article>`;
  }

  const cardsEl = $("[data-cards]");
  // cards entram em leque; a transição CSS fica desligada durante a animação para não brigar com o GSAP
  function dealCards(stagger, y, spin) {
    const cards = [...cardsEl.children];
    cards.forEach((c) => { c.style.transition = "none"; });
    gsap.fromTo(cards, { y, opacity: 0, rotate: () => gsap.utils.random(-spin, spin) }, {
      y: 0, opacity: 1, rotate: 0, duration: .75, ease: "back.out(1.4)", stagger, overwrite: true,
      onComplete: () => cards.forEach((c) => { c.style.transition = ""; gsap.set(c, { clearProps: "transform" }); }),
    });
  }
  const countEl = $("[data-count]");
  let region = "all";

  function renderCards(withAnim = true) {
    const list = DATA.especies.filter((sp) => region === "all" || sp.regioes.includes(region));
    cardsEl.innerHTML = list.map(cardHTML).join("");
    const nativas = list.filter((sp) => sp.grupo !== "Com ferrão").length;
    countEl.textContent = region === "all"
      ? `${list.length} abelhas no guia, ${nativas} nativas sem ferrão`
      : `${nativas} nativas sem ferrão no ${DATA.regioes[region]}, mais a Apis`;
    if (animate && withAnim) {
      dealCards(.05, 40, 3);
    }
  }

  $$("[data-region]").forEach((btn) => btn.addEventListener("click", () => {
    region = btn.dataset.region;
    $$("[data-region]").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    renderCards();
    if (animate) ScrollTrigger.refresh();
  }));

  /* Ficha da espécie */
  const sheet = $("[data-sheet]");
  const sheetBody = $("[data-sheet-body]");
  cardsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (!btn) return;
    const sp = DATA.especies.find((s) => s.id === btn.dataset.open);
    if (!sp) return;
    sheetBody.innerHTML = `
      <button class="sheet__close" type="button" data-close aria-label="Fechar">×</button>
      <div class="sheet__hero">
        <span class="drop" style="--c:${sp.cor}" aria-hidden="true"></span>
        <div>
          <h2 class="sheet__title" id="sheet-title">${esc(sp.nome)}</h2>
          <p class="sheet__sci">${esc(sp.cientifico)}</p>
        </div>
      </div>
      <div class="sheet__grid">
        <div><h3>Onde é nativa</h3><p>${sp.regioes.map((r) => DATA.regioes[r]).join(", ")}</p></div>
        <div><h3>Bioma</h3><p>${esc(sp.biomas)}</p></div>
        <div><h3>O mel</h3><p>${esc(sp.mel)}</p></div>
        <div><h3>Temperamento</h3><p>${esc(sp.temperamento)}</p></div>
        <div><h3>Tamanho da abelha</h3><p>${esc(sp.tamanho)}</p></div>
        <div><h3>Produção e manejo</h3><p>Produção ${PROD[sp.producao].toLowerCase()}. Nível ${LEVEL[sp.manejo].toLowerCase()}.</p></div>
        <div class="sheet__wide"><h3>Curiosidade</h3><p>${esc(sp.curiosidade)}</p></div>
      </div>`;
    if (typeof sheet.showModal === "function") sheet.showModal();
  });
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
  });

  /* Floradas, faixa corrida e indicações geográficas */
  const flowersEl = $("[data-floradas]");
  flowersEl.innerHTML = DATA.floradas.map((f) => `
    <article class="flower" data-reveal>
      <span class="drop" style="--c:${f.cor}" aria-hidden="true"></span>
      <h3>${esc(f.nome)}</h3>
      <p>${esc(f.nota)}</p>
    </article>`).join("");

  const names = DATA.floradas.map((f) => `<span>${esc(f.nome)}</span>`).join("");
  $("[data-marquee]").innerHTML = names + names;

  $("[data-ig]").innerHTML = DATA.indicacoes.map((ig, i) => `
    <li style="--r:${[-2, 1.5, -1][i % 3]}deg" data-reveal><b>${esc(ig.nome)}</b><span>${esc(ig.tipo)}</span></li>`).join("");

  renderCards(false);

  /* ---------------------------------------------------------------------
     Loja
     ------------------------------------------------------------------- */
  const PRODUCTS = {
    100: { price: 89, label: "100 g", scale: .9, preorder: false },
    250: { price: 189, label: "250 g", scale: 1.08, preorder: true },
  };
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const shop = $("[data-shop]");
  const shopJar = $("[data-shop-jar]");
  let qty = 1;
  let bag = parseInt(storage.get("mj-bag") || "0", 10) || 0;

  // copia o pote do palco com ids próprios, para os gradientes não colidirem
  const side = $("[data-jar-side]");
  if (side && shopJar) {
    shopJar.innerHTML = side.outerHTML
      .replace(/id="g-([a-z]+)"/g, 'id="s-$1"')
      .replace(/url\(#g-([a-z]+)\)/g, "url(#s-$1)")
      .replace(/data-jar-side|data-lid/g, "");
  }

  $$("[data-price-for]").forEach((el) => { el.textContent = brl.format(PRODUCTS[el.dataset.priceFor].price); });

  function renderBag() {
    const badge = $("[data-bag-count]");
    badge.hidden = bag === 0;
    badge.textContent = String(bag);
    $("[data-bag]").setAttribute("aria-label", `Sacola, ${bag} ${bag === 1 ? "item" : "itens"}`);
  }

  function renderShop() {
    const fd = new FormData(shop);
    const p = PRODUCTS[fd.get("size")];
    const biome = fd.get("biome");
    const total = p.price * qty;
    $("[data-sum-name]").textContent = `Jataí ${p.label}, ${biome}${qty > 1 ? `, ${qty} potes` : ""}`;
    $("[data-sum-total]").textContent = brl.format(total);
    $("[data-sum-sub]").textContent = `ou 3x de ${brl.format(Math.round(total / 3 * 100) / 100)} sem juros`;
    $("[data-shop-cta]").textContent = p.preorder ? "Reservar" : "Comprar";
    $("[data-shop-tag]").textContent = p.preorder ? "Pré-venda" : "Pronta entrega";
    $("[data-qty-value]").textContent = String(qty);
    $$("[data-qty]").forEach((b) => { b.disabled = (+b.dataset.qty < 0 && qty <= 1) || (+b.dataset.qty > 0 && qty >= 6); });
    shopJar.style.setProperty("--s", p.scale);
    shopJar.classList.toggle("is-light", biome === "Mata Atlântica");
    const w = shopJar.querySelector("text:last-of-type");
    if (w) w.textContent = `${p.label.toUpperCase()} · SEM FERRÃO`;
  }

  shop.addEventListener("change", renderShop);
  $$("[data-qty]").forEach((b) => b.addEventListener("click", () => {
    qty = Math.min(6, Math.max(1, qty + +b.dataset.qty));
    renderShop();
  }));
  shop.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = PRODUCTS[new FormData(shop).get("size")];
    bag += qty;
    storage.set("mj-bag", String(bag));
    renderBag();
    toast(p.preorder ? "Reserva na sacola" : "Pote na sacola");
    if (animate) {
      shopJar.querySelector("svg").animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 900, easing: "cubic-bezier(.34, 1.56, .64, 1)" });
      $("[data-bag] svg").animate([{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 420 });
    }
  });
  renderShop();
  renderBag();

  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.email;
    if (!input.checkValidity()) { input.focus(); toast("Confira o e-mail"); return; }
    input.value = "";
    toast("Inscrição feita");
  });

  let toastTimer = 0;
  function toast(msg) {
    const el = $("[data-toast]");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  /* Região do rodapé */
  const regionBtn = $("[data-region-toggle]");
  const regionList = $("#region-list");
  regionBtn.addEventListener("click", () => {
    const open = regionBtn.getAttribute("aria-expanded") === "true";
    regionBtn.setAttribute("aria-expanded", String(!open));
    regionList.hidden = open;
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".footer__region") && !regionList.hidden) {
      regionList.hidden = true;
      regionBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* Cookies (LGPD) */
  const bar = $("[data-cookie]");
  const dlg = $("[data-cookie-dialog]");
  if (!storage.get("mj-cookies")) bar.hidden = false;
  const saveConsent = (c) => { storage.set("mj-cookies", JSON.stringify({ ...c, date: new Date().toISOString() })); bar.hidden = true; };
  $("[data-cookie-accept]").addEventListener("click", () => saveConsent({ analytics: true, marketing: true }));
  $$("[data-open-cookies]").forEach((b) => b.addEventListener("click", () => {
    let cur = {};
    try { cur = JSON.parse(storage.get("mj-cookies") || "{}"); } catch { /* valor inválido */ }
    dlg.querySelector('[name="analytics"]').checked = !!cur.analytics;
    dlg.querySelector('[name="marketing"]').checked = !!cur.marketing;
    if (typeof dlg.showModal === "function") dlg.showModal();
  }));
  dlg.addEventListener("close", () => {
    if (dlg.returnValue !== "save") return;
    saveConsent({ analytics: dlg.querySelector('[name="analytics"]').checked, marketing: dlg.querySelector('[name="marketing"]').checked });
    toast("Preferências salvas");
  });

  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------------------------------------------------------------------
     Animação
     ------------------------------------------------------------------- */
  if (!animate) {
    $("[data-stage]").classList.add("is-static");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Rolagem suave
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: .1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    }));
    [sheet, dlg].forEach((d) => {
      new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ["open"] });
    });
  }

  // Títulos: cada letra sobe de trás de uma máscara
  $$("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${[...w].map((c) => `<span class="ch">${esc(c)}</span>`).join("")}</span>`).join(" ");
    const chars = el.querySelectorAll(".ch");
    gsap.from(chars, {
      yPercent: 110, rotate: 8, duration: 1, ease: "expo.out", stagger: .028,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Blocos menores entram de baixo
  gsap.set("[data-reveal]", { opacity: 0 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 92%",
    once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: .08 }),
  });
  // cards do catálogo entram em leque na primeira vez
  gsap.set(cardsEl.children, { opacity: 0 });
  ScrollTrigger.create({
    trigger: cardsEl, start: "top 85%", once: true,
    onEnter: () => dealCards(.06, 60, 4),
  });

  // Coreografia do pote ao longo da jornada
  const journey = $("[data-journey]");
  const jar = $("[data-jar]");
  const rot = $("[data-jar-rot]");
  const top = $("[data-jar-top]");
  const sideView = $("[data-jar-side]");
  const lid = $("[data-lid]");
  const pourPath = $("[data-pour-path]");
  const scenes = $$(".scene", journey);
  const mm = gsap.matchMedia();

  mm.add({ wide: "(min-width: 761px)", narrow: "(max-width: 760px)" }, (ctx) => {
    const k = ctx.conditions.wide ? 1 : .35;
    const W = () => innerWidth, H = () => innerHeight;
    // estado do pote quando cada cena chega ao topo da tela
    const states = [
      { x: () => (ctx.conditions.wide ? 0 : W() * .2), y: () => H() * (ctx.conditions.wide ? .36 : .3), s: 1, r: 0, top: 0 },
      { x: () => W() * .16 * k, y: () => H() * .04, s: .82, r: 200, top: 1 },
      { x: 0, y: () => -H() * .1, s: 1, r: -18, top: 0 },
      { x: () => -W() * .16 * k, y: () => -H() * .04, s: 1.05, r: 90, top: 0 },
      { x: () => W() * .22 * k, y: () => -H() * (ctx.conditions.wide ? 0 : .16), s: .86, r: 8, top: 0 },
      { x: () => W() * .02, y: () => -H() * .2, s: .9, r: 120, top: 0 },
    ];

    gsap.set(jar, { x: states[0].x, y: states[0].y, scale: 1 });
    gsap.set(pourPath, { strokeDashoffset: 1 });

    // linha do tempo medida em pixels de rolagem
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: { trigger: journey, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
    });

    const startOf = (i) => scenes[i].offsetTop - scenes[0].offsetTop;
    for (let i = 1; i < states.length; i++) {
      const at = startOf(i - 1), dur = startOf(i) - startOf(i - 1);
      const st = states[i];
      tl.to(jar, { x: st.x, y: st.y, scale: st.s, duration: dur }, at)
        .to(rot, { rotate: st.r, duration: dur }, at)
        .to(top, { opacity: st.top, duration: dur * .12, ease: "none" }, at + dur * (st.top ? .45 : .2))
        .to(sideView, { opacity: 1 - st.top, duration: dur * .12, ease: "none" }, at + dur * (st.top ? .45 : .2));
    }
    // a tampa sai na cena "Abra o pote"
    tl.to(lid, { y: -260, x: 60, rotate: 28, opacity: 0, svgOrigin: "150 60", duration: startOf(2) - startOf(1), ease: "power2.in" }, startOf(1) + (startOf(2) - startOf(1)) * .45);
    // o mel escorre na última cena
    const last = scenes.length - 1;
    const end = journey.offsetHeight - innerHeight;
    tl.to(pourPath, { strokeDashoffset: 0, duration: Math.max(1, end - startOf(last) + innerHeight * .3), ease: "none" }, startOf(last) - innerHeight * .3);

    // o palco some quando o catálogo cobre a tela
    gsap.to("[data-stage]", {
      autoAlpha: 0, ease: "none",
      scrollTrigger: { trigger: "#meis", start: "top bottom", end: "top 55%", scrub: true },
    });

    // leve flutuação contínua, separada da rolagem
    const bob = gsap.to(jar.querySelector(".stage__rot"), { yPercent: -2.5, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => bob.kill();
  });

  // Entrada do hero
  gsap.from(jar, { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", delay: .2 });
  gsap.from(".nav__group li", { y: -30, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .05 });

  // Parallax suave das folhagens de fundo nos blocos grandes
  gsap.to(".marquee", { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".floradas", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
