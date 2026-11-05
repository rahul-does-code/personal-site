/* RAHUL DOES CODE: interactions. Plain JS, no dependencies. */
(() => {
  const S = window.SITE;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();

  /* ---------------- dimensions (color variants) ---------------- */
  const VARIANTS = [
    { id: "classic", name: "Classic", earth: "EARTH-1337", sw: ["#e8173f", "#1b1f6b", "#00d9ff", "#ffe14d"] },
    { id: "noir", name: "Noir", earth: "EARTH-1933", sw: ["#000", "#3a3a3a", "#9a9a9a", "#e9e6df"] },
    { id: "2099", name: "2099", earth: "EARTH-2099", sw: ["#1636d8", "#ff2b4e", "#00f0ff", "#02041c"] },
    { id: "punk", name: "Punk", earth: "EARTH-1977", sw: ["#ff2f9a", "#2a62ff", "#fff200", "#21e06b"] },
  ];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  const shiftEl = $(".shift");
  function dimensionShift(cb) {
    if (reduceMotion) { cb && cb(); return; }
    shiftEl.classList.remove("go");
    void shiftEl.offsetWidth;
    shiftEl.classList.add("go");
    $(".title")?.classList.add("is-glitching");
    setTimeout(() => cb && cb(), 230);
    setTimeout(() => { shiftEl.classList.remove("go"); $(".title")?.classList.remove("is-glitching"); }, 600);
  }

  const variantRow = $("#variantRow");
  variantRow.innerHTML = VARIANTS.map((v) => `
    <button class="variant" type="button" data-variant="${v.id}" aria-pressed="false">
      <span class="variant-sw" aria-hidden="true">${v.sw.map((c) => `<span style="background:${c}"></span>`).join("")}</span>
      <span class="variant-name">${v.name}</span>
      <span class="variant-earth">${v.earth}</span>
    </button>`).join("");

  function setVariant(id, animate = true) {
    const v = VARIANTS.find((x) => x.id === id) || VARIANTS[0];
    const apply = () => {
      root.dataset.variant = v.id;
      $(".dim-label").textContent = v.name.toUpperCase();
      variantRow.querySelectorAll(".variant").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.variant === v.id)));
      $('meta[name="theme-color"]').setAttribute("content", css("--dark"));
      dots.recolor();
      store.set("rdc-variant", v.id);
    };
    animate ? dimensionShift(apply) : apply();
  }
  variantRow.addEventListener("click", (e) => {
    const b = e.target.closest(".variant");
    if (b) setVariant(b.dataset.variant);
  });
  $("#dimBtn").addEventListener("click", () => {
    const i = VARIANTS.findIndex((v) => v.id === root.dataset.variant);
    setVariant(VARIANTS[(i + 1) % VARIANTS.length].id);
  });

  /* ---------------- nav: glitch-jump between sections ---------------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-shift]");
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    dimensionShift(() => {
      target.scrollIntoView({ behavior: "instant", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });
  $(".title").addEventListener("click", () => dimensionShift());

  /* ---------------- projects ---------------- */
  const PAIRS = [["--hot", "--violet"], ["--cyan", "--violet"], ["--yellow", "--hot"], ["--violet", "--cyan"], ["--hot", "--yellow"], ["--cyan", "--hot"]];
  $("#projects").innerHTML = S.projects.map((p, i) => {
    const [c1, c2] = PAIRS[i % PAIRS.length];
    return `
    <article class="panel proj reveal" style="--c1:var(${c1});--c2:var(${c2})">
      <div class="proj-head"><span>${esc(p.earth)}</span><span class="tag">${esc(p.tag)}</span></div>
      <div class="proj-art" aria-hidden="true">
        <span class="glyph">${String(i + 1).padStart(2, "0")}</span>
        <span class="sfx">${esc(p.sfx || "POW!")}</span>
      </div>
      <div class="proj-body">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.blurb)}</p>
        <ul class="chips">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="proj-links">${(p.links || []).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>
      </div>
    </article>`;
  }).join("");

  /* ---------------- the suit ---------------- */
  const ORDER = ["helmet", "core", "gauntlets", "belt", "boots"];
  const parts = S.suit.parts;
  $("#suitDesignation").textContent = S.suit.designation;
  const tabs = $("#suitTabs");
  tabs.innerHTML = ORDER.filter((k) => parts[k]).map((k) =>
    `<button type="button" role="tab" id="tab-${k}" data-part="${k}" aria-selected="false" aria-controls="suitReadout">${esc(parts[k].slot)}</button>`
  ).join("");

  function selectPart(key) {
    const p = parts[key];
    if (!p) return;
    document.querySelectorAll(".part").forEach((g) => g.classList.toggle("is-active", g.dataset.part === key));
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.part === key)));
    $("#suitReadout").setAttribute("aria-labelledby", `tab-${key}`);
    $("#suitReadout").innerHTML = `
      <div class="readout-head">
        <span class="readout-slot">SLOT // ${esc(p.slot)}</span>
        <h3 class="readout-name">${esc(p.name)}</h3>
        <p class="readout-role">${esc(p.role)}</p>
      </div>
      <ul class="gear">${p.gear.map((g) => `
        <li>
          <span class="gear-top"><span>${esc(g.name)}</span><span>${Math.round(g.level)}%</span></span>
          <span class="bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${g.level}" aria-label="${esc(g.name)}"><i style="--lvl:${g.level / 100}"></i></span>
        </li>`).join("")}
      </ul>`;
  }
  $("#suitReadout").setAttribute("role", "tabpanel");
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectPart(b.dataset.part); });
  tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const btns = [...tabs.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    const n = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
    n.focus(); selectPart(n.dataset.part);
  });
  document.querySelectorAll(".part").forEach((g) => {
    g.addEventListener("click", () => selectPart(g.dataset.part));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPart(g.dataset.part); } });
  });
  selectPart("core");

  /* ---------------- lab + contact ---------------- */
  $("#labGrid").innerHTML = S.lab.map((l) => `
    <article class="panel lab-card reveal">
      <span class="kicker">${esc(l.kicker)}</span>
      <h3>${esc(l.title)}</h3>
      <p>${esc(l.body)}</p>
    </article>`).join("");
  $("#emailBtn").href = `mailto:${S.email}`;
  $("#socials").innerHTML = [`<li><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>`]
    .concat(S.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`)).join("");
  $("#yr").textContent = new Date().getFullYear();

  /* ---------------- reveal fallback (no scroll-driven animations) ---------------- */
  if (!CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) {
    root.classList.add("no-sda");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }
  if (!CSS.supports("animation-timeline: scroll()")) {
    const bar = $("#progress");
    addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    }, { passive: true });
  }

  /* ---------------- cursor: updates on twos ---------------- */
  const cursor = $(".cursor");
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = -100, my = -100, frame = 0;
    addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.toggle("is-hot", !!e.target.closest("a, button, .part, .proj"));
    }, { passive: true });
    const tick = () => {
      if (frame++ % 2 === 0 || reduceMotion) cursor.style.transform = `translate(${mx}px, ${my}px)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------------- hero halftone dot field (12fps, on purpose) ---------------- */
  const dots = (() => {
    const cv = $("#dotfield");
    const ctx = cv.getContext("2d");
    const GAP = 18;
    let w = 0, h = 0, dpr = 1, px = -9999, py = -9999, t = 0, running = false, last = 0, colA = "", colB = "";
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const recolor = () => { colA = css("--cyan"); colB = css("--hot"); draw(); };
    function layer(color, ox) {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let y = GAP / 2, row = 0; y < h + GAP; y += GAP, row++) {
        for (let x = (row % 2 ? GAP / 2 : 0); x < w + GAP; x += GAP) {
          const d = Math.hypot(x - px, y - py);
          const near = Math.max(0, 1 - d / 220);
          const wave = (Math.sin(x * 0.012 + t) + Math.cos(y * 0.015 - t * 0.8)) * 0.5;
          const fade = y / h; // dots grow toward the bottom like a comic gradient
          const r = Math.max(0, 0.6 + fade * 3 + wave * 1.2 + near * 6);
          if (r < 0.4) continue;
          ctx.moveTo(x + ox + r, y);
          ctx.arc(x + ox, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }
    function draw() {
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.35;
      layer(colA, -2);
      ctx.globalCompositeOperation = "lighter";
      layer(colB, 2);
      ctx.globalAlpha = 1;
    }
    function loop(now) {
      if (!running) return;
      if (now - last > 1000 / 12) { last = now; t += 0.18; draw(); }
      requestAnimationFrame(loop);
    }
    const start = () => { if (!running && !reduceMotion) { running = true; requestAnimationFrame(loop); } };
    const stop = () => { running = false; };
    addEventListener("resize", resize);
    cv.parentElement.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
      if (reduceMotion) draw();
    }, { passive: true });
    cv.parentElement.addEventListener("pointerleave", () => { px = py = -9999; });
    new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(cv);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    return { resize, recolor };
  })();

  setVariant(store.get("rdc-variant") || "classic", false);
  dots.resize();
})();
