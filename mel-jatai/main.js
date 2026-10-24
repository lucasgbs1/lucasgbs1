/* Mel Nativo. Animações com GSAP + ScrollTrigger e rolagem suave com Lenis.
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

  const FOTOS = DATA.fotos || {};
  const MAPAS = new Set(["jatai", "mandacaia", "urucu-nordestina", "jandaira", "tiuba", "urucu-amarela", "manduri", "guaraipo", "boca-de-renda", "bora", "irai", "moca-branca"]);
  const credit = (id) => !FOTOS[id] ? "" : FOTOS[id].propria ? esc(FOTOS[id].autor) : `Foto: ${esc(FOTOS[id].autor)}, ${esc(FOTOS[id].licenca)}, via ${esc(FOTOS[id].fonte || "iNaturalist")}`;

  // foto real da espécie; sem foto livre disponível, mostra o mapa de ocorrência
  function mediaHTML(sp, i, sting) {
    const has = !!FOTOS[sp.id];
    const src = has ? `img/especies/${sp.id}.webp` : `img/mapas/${sp.id}.webp`;
    const alt = has ? `${sp.nome} (${sp.cientifico})` : `Mapa de ocorrência de ${sp.nome} no Brasil`;
    return `<figure class="card__photo${has ? "" : " card__photo--map"}">
        <img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" width="1200" height="900">
        <span class="card__tag${sting ? " card__tag--sting" : ""}">${esc(sp.grupo)}</span>
        <span class="card__no">${String(i + 1).padStart(2, "0")}</span>
      </figure>`;
  }

  function cardHTML(sp, i) {
    const sting = sp.grupo === "Com ferrão";
    return `
      <article class="card" data-id="${sp.id}">
        ${mediaHTML(sp, i, sting)}
        <h3 class="card__name">${esc(sp.nome)}</h3>
        <p class="card__sci">${esc(sp.cientifico)}</p>
        <div class="regions" aria-label="Regiões: ${sp.regioes.map((r) => DATA.regioes[r]).join(", ")}">
          ${REG_KEYS.map((r) => `<span class="${sp.regioes.includes(r) ? "on" : ""}" aria-hidden="true">${r}</span>`).join("")}
        </div>
        <p class="card__mel">${esc(sp.mel)}</p>
        <span class="card__swatch"><i style="--c:${sp.cor}"></i>Cor típica do mel</span>
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
      <div class="sheet__head">
        <h2 class="sheet__title" id="sheet-title">${esc(sp.nome)}</h2>
        <p class="sheet__sci">${esc(sp.cientifico)}</p>
      </div>
      <div class="sheet__media${FOTOS[sp.id] && MAPAS.has(sp.id) ? "" : " sheet__media--single"}">
        ${FOTOS[sp.id] ? `<figure><img src="img/especies/${sp.id}.webp" alt="${esc(sp.nome)}"><figcaption>${credit(sp.id)}${FOTOS[sp.id].nota ? `. ${esc(FOTOS[sp.id].nota)}` : ""}</figcaption></figure>` : ""}
        ${MAPAS.has(sp.id) ? `<figure class="sheet__map"><img src="img/mapas/${sp.id}.webp" alt="Mapa de ocorrência de ${esc(sp.nome)} no Brasil"><figcaption>Ocorrência por estado. Mapa: Luisgabriel007, CC0</figcaption></figure>` : ""}
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
      <div class="flower__photo"><img src="img/floradas/${f.id}.webp" alt="Flor de ${esc(f.nome.replace("Melato de ", ""))}" loading="lazy" decoding="async" width="1200" height="1200"></div>
      <h3><i style="--c:${f.cor}" aria-hidden="true"></i>${esc(f.nome)}</h3>
      <p>${esc(f.nota)}</p>
    </article>`).join("");

  const names = DATA.floradas.map((f) => `<span>${esc(f.nome)}</span>`).join("");
  $("[data-marquee]").innerHTML = names + names;

  $("[data-ig]").innerHTML = DATA.indicacoes.map((ig, i) => `
    <li style="--r:${[-2, 1.5, -1][i % 3]}deg" data-reveal><b>${esc(ig.nome)}</b><span>${esc(ig.tipo)}</span></li>`).join("");

  renderCards(false);

  /* Créditos das fotos */
  const LIC = { "CC BY": "https://creativecommons.org/licenses/by/4.0/", "CC0": "https://creativecommons.org/publicdomain/zero/1.0/" };
  const nomes = Object.fromEntries([...DATA.especies.map((s) => [s.id, s.nome]), ...DATA.floradas.map((f) => [f.id, `Florada: ${f.nome}`])]);
  $("[data-credits]").innerHTML = [
    ...(DATA.cenas || []).map((c) => `<li>${esc(c.item)}: <a href="${c.url}" rel="noopener" target="_blank">${esc(c.autor)}</a>, ${esc(c.licenca)}, Wikimedia Commons</li>`),
    ...Object.entries(FOTOS).map(([id, f]) => f.propria ? `<li>${esc(nomes[id] || id)}: ${esc(f.autor)}</li>` : `<li>${esc(nomes[id] || id)}: <a href="${f.url}" rel="noopener" target="_blank">${esc(f.autor)}</a>, ${LIC[f.licenca] ? `<a href="${LIC[f.licenca]}" rel="noopener" target="_blank">${f.licenca}</a>` : esc(f.licenca)}, ${esc(f.fonte || "iNaturalist")}</li>`),
  ].join("");

  /* ---------------------------------------------------------------------
     Loja
     ------------------------------------------------------------------- */
  // preços de exemplo por mel e tamanho
  const HONEYS = {
    jatai: { nome: "Jataí", precos: { 100: 89, 250: 189 }, filtro: "brightness(1.12) saturate(.8)" },
    mandacaia: { nome: "Mandaçaia", precos: { 100: 69, 250: 149 }, filtro: "brightness(1)" },
    "urucu-nordestina": { nome: "Uruçu-nordestina", precos: { 100: 59, 250: 129 }, filtro: "brightness(.94) saturate(1.1)" },
    jandaira: { nome: "Jandaíra", precos: { 100: 79, 250: 169 }, filtro: "brightness(1.18) saturate(.7)" },
  };
  const SIZES = {
    100: { label: "100 g", scale: .9, preorder: false },
    250: { label: "250 g", scale: 1.08, preorder: true },
  };
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const shop = $("[data-shop]");
  const shopJar = $("[data-shop-jar]");
  let qty = 1;
  let bag = parseInt(storage.get("mj-bag") || "0", 10) || 0;



  function renderBag() {
    const badge = $("[data-bag-count]");
    badge.hidden = bag === 0;
    badge.textContent = String(bag);
    $("[data-bag]").setAttribute("aria-label", `Sacola, ${bag} ${bag === 1 ? "item" : "itens"}`);
  }

  function renderShop() {
    const fd = new FormData(shop);
    const p = SIZES[fd.get("size")];
    const honey = HONEYS[fd.get("honey")];
    $$("[data-price-for]").forEach((el) => { el.textContent = brl.format(honey.precos[el.dataset.priceFor]); });
    const total = honey.precos[fd.get("size")] * qty;
    $("[data-sum-name]").textContent = `Mel de ${honey.nome}, ${p.label}${qty > 1 ? `, ${qty} potes` : ""}`;
    $("[data-sum-total]").textContent = brl.format(total);
    $("[data-sum-sub]").textContent = `ou 3x de ${brl.format(Math.round(total / 3 * 100) / 100)} sem juros`;
    $("[data-shop-cta]").textContent = p.preorder ? "Reservar" : "Comprar";
    $("[data-shop-tag]").textContent = p.preorder ? "Pré-venda" : "Pronta entrega";
    $("[data-qty-value]").textContent = String(qty);
    $$("[data-qty]").forEach((b) => { b.disabled = (+b.dataset.qty < 0 && qty <= 1) || (+b.dataset.qty > 0 && qty >= 6); });
    shopJar.style.setProperty("--s", p.scale);
    shopJar.style.setProperty("--honey", honey.filtro);
  }

  shop.addEventListener("change", renderShop);
  $$("[data-qty]").forEach((b) => b.addEventListener("click", () => {
    qty = Math.min(6, Math.max(1, qty + +b.dataset.qty));
    renderShop();
  }));
  shop.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = SIZES[new FormData(shop).get("size")];
    bag += qty;
    storage.set("mj-bag", String(bag));
    renderBag();
    toast(p.preorder ? "Reserva na sacola" : "Pote na sacola");
    if (animate) {
      shopJar.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 900, easing: "cubic-bezier(.34, 1.56, .64, 1)" });
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
  const lid = $("[data-lid]");
  const scenes = $$(".scene", journey);
  const mm = gsap.matchMedia();

  mm.add({ wide: "(min-width: 761px)", narrow: "(max-width: 760px)" }, (ctx) => {
    const wide = ctx.conditions.wide;
    const k = wide ? 1 : .35;
    const W = () => innerWidth, H = () => innerHeight;
    // estado do pote quando cada cena chega ao topo da tela
    const states = [
      { x: () => (wide ? 0 : W() * .2), y: () => H() * (wide ? .2 : .26), s: 1, r: 0 },
      { x: () => -W() * .06 * k, y: () => H() * .08, s: .8, r: 160 },
      { x: 0, y: () => -H() * (wide ? .2 : .1), s: .9, r: -14 },
      { x: () => W() * .12 * k, y: () => -H() * (wide ? .06 : .2), s: .95, r: 90 },
      { x: () => W() * .04 * k, y: () => -H() * (wide ? 0 : .18), s: .8, r: 8 },
      { x: () => W() * .18 * k, y: () => -H() * .22, s: .85, r: 125 },
    ];

    gsap.set(jar, { x: states[0].x, y: states[0].y, scale: 1 });

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
        .to(rot, { rotate: st.r, duration: dur }, at);
    }
    // a tampa (camada separada da foto) sai na cena "Abra o pote"
    const d1 = startOf(2) - startOf(1);
    tl.to(lid, { yPercent: -55, xPercent: 22, rotate: 24, opacity: 0, transformOrigin: "50% 8%", duration: d1 * .6, ease: "power2.in" }, startOf(1) + d1 * .4);

    // o palco some quando o catálogo cobre a tela
    gsap.to("[data-stage]", {
      autoAlpha: 0, ease: "none",
      scrollTrigger: { trigger: "#meis", start: "top bottom", end: "top 55%", scrub: true },
    });

    // leve flutuação contínua, separada da rolagem
    const bob = gsap.to(rot, { yPercent: -2.5, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => bob.kill();
  });

  // Fotos das cenas: abrem de baixo para cima e a imagem desacelera por dentro
  $$("[data-shot]").forEach((fig) => {
    const img = fig.querySelector("img");
    gsap.fromTo(fig, { clipPath: "inset(100% 0% 0% 0% round 30px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 30px)", ease: "power3.out",
      scrollTrigger: { trigger: fig, start: "top 95%", end: "top 45%", scrub: 1 },
    });
    gsap.fromTo(img, { scale: 1.3, yPercent: -6 }, {
      scale: 1, yPercent: 6, ease: "none",
      scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // Última cena: a foto do mel escorrendo cresce até ocupar a tela
  gsap.to("[data-pour-photo]", {
    clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut",
    scrollTrigger: { trigger: ".scene--pour", start: "top 80%", end: "top top", scrub: 1 },
  });
  gsap.fromTo("[data-pour-photo] img", { scale: 1.25 }, {
    scale: 1, ease: "none", scrollTrigger: { trigger: ".scene--pour", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  // o pote sai de cena enquanto a foto do mel toma a tela
  gsap.to(jar, { opacity: 0, ease: "none", scrollTrigger: { trigger: ".scene--pour", start: "top 55%", end: "top 5%", scrub: true } });

  // Faixa de foto em tela cheia com parallax
  gsap.fromTo("[data-band]", { yPercent: -8 }, {
    yPercent: 8, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Entrada do hero
  gsap.from(jar, { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", delay: .2 });
  gsap.from(".nav__group li", { y: -30, opacity: 0, duration: .8, ease: "back.out(2)", stagger: .05 });

  gsap.to(".marquee", { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".floradas", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
