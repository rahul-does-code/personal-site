/* THE DEVELOPER'S MAP: plain JS, no dependencies. */
(() => {
  const S = window.SITE;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const session = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch {} },
  };
  let uid = 0;
  const id = (p) => `${p}-${++uid}`;

  /* ---------------- the words the walls are made of ---------------- */
  const WALL = "codicem scribere est audere · omnibus codicem scribentibus bonum · nocte lucet machina · ";
  const BAND = "CODICEM SCRIBERE EST AVDERE · OMNIBVS CODICEM SCRIBENTIBVS BONVM · ";
  const WORDS = "codex scriptum machina functio variabilis error bonum audere nocte lux silicium rete servus fabrica memoria ratio ordo clavis signum numerus lingua caput iter porta mensa liber opus manus ferrum ignis aqua tempus".split(" ");
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const latin = (n) => {
    let out = [];
    for (let i = 0; i < n; i++) {
      let w = WORDS[Math.floor(rnd() * WORDS.length)];
      if (i === 0 || out[out.length - 1].endsWith(".")) w = w[0].toUpperCase() + w.slice(1);
      out.push(w + (rnd() < 0.12 ? "." : rnd() < 0.08 ? "," : ""));
    }
    return out.join(" ") + ".";
  };
  const repeatTo = (str, chars) => str.repeat(Math.ceil(chars / str.length) + 1).slice(0, chars);

  /* ---------------- paper grain, generated once ---------------- */
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 240;
    const g = c.getContext("2d");
    for (let i = 0; i < 3200; i++) {
      const a = Math.random() * 0.08;
      g.fillStyle = Math.random() < 0.55 ? `rgba(100,66,28,${a})` : `rgba(255,248,228,${a * 1.3})`;
      g.fillRect(Math.random() * 240, Math.random() * 240, Math.random() * 1.7 + 0.3, Math.random() * 1.7 + 0.3);
    }
    root.style.setProperty("--grain", `url(${c.toDataURL()})`);
  } catch {}

  /* ---------------- decorative text: dense blocks, rulers, bands ---------------- */
  $$("[data-dense]").forEach((d) => {
    const n = +d.dataset.dense;
    d.innerHTML = Array.from({ length: n }, () => `<p>${latin(18 + Math.floor(rnd() * 26))}</p>`).join("");
  });
  $$(".ruler").forEach((r) => {
    const from = +r.dataset.from;
    r.innerHTML = Array.from({ length: 7 }, (_, i) => `<span>${from - i}</span>`).join("");
  });
  $$(".band").forEach((b, k) => {
    const from = 299 - k * 7;
    b.innerHTML = `<div class="band-ruler">${Array.from({ length: 9 }, (_, i) => `<span>${from - i}</span>`).join("")}</div><div class="band-text">${BAND.repeat(8)}</div>`;
  });

  /* ---------------- rooms: double walls with lettering between them ---------------- */
  const T = 11;
  function drawWalls(room) {
    let svg = $(":scope > .walls", room);
    if (!svg) {
      svg = el("svg", { class: "walls", "aria-hidden": "true" });
      room.prepend(svg);
      if (room.dataset.label) {
        const lab = document.createElement("span");
        lab.className = "room-label";
        lab.setAttribute("aria-hidden", "true");
        lab.textContent = room.dataset.label;
        room.prepend(lab);
      }
    }
    const w = room.clientWidth, h = room.clientHeight;
    if (!w || !h) return;
    const inked = svg.classList.contains("inked");
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const pid = id("wall");
    const rect = (i) => `M${i} ${i} H${w - i} V${h - i} H${i} Z`;
    el("path", { class: "w-line", d: rect(0.5), pathLength: 1 }, svg);
    el("path", { class: "w-line", d: rect(T), pathLength: 1 }, svg);
    el("path", { id: pid, d: rect(T / 2 + 0.2), fill: "none" }, svg);
    const t = el("text", { dy: "2.4" }, svg);
    const tp = el("textPath", { href: `#${pid}` }, t);
    tp.textContent = repeatTo(WALL, Math.floor((2 * (w + h)) / 3.7));
    [[0, 0], [w - T, 0], [w - T, h - T], [0, h - T]].forEach(([x, y]) => el("rect", { class: "w-pillar", x: x + 0.5, y: y + 0.5, width: T - 0.5, height: T - 0.5 }, svg));
    if (inked) svg.classList.add("inked");
  }
  const wallRO = new ResizeObserver((entries) => entries.forEach((e) => drawWalls(e.target)));
  const watchRoom = (r) => { drawWalls(r); wallRO.observe(r); };

  /* ---------------- content ---------------- */
  const LEGEND = [
    ["#library", "The Library", "where it all started"],
    ["#workshop", "The Workshop", "things I've built"],
    ["#armory", "The Armory", "the suit, piece by piece"],
    ["#cabinet", "The Cabinet", "curiosities and odd ends"],
    ["#owlery", "The Owlery", "send word"],
  ];
  $("#legendList").innerHTML = LEGEND.map(([href, name, desc]) => `
    <li><a href="${href}" data-walk>
      <span class="l-name">${name}</span>
      <span class="l-desc">${desc}</span>
      <svg class="l-steps" viewBox="0 0 46 22" aria-hidden="true">
        <use href="#foot" transform="translate(6 14) rotate(90) scale(.8)" /><use href="#foot" transform="translate(16 8) rotate(90) scale(-.8 .8)" />
        <use href="#foot" transform="translate(27 14) rotate(90) scale(.8)" /><use href="#foot" transform="translate(38 8) rotate(90) scale(-.8 .8)" />
      </svg>
    </a></li>`).join("");

  const stepsSvg = () => {
    const pts = [[8, 50], [24, 40], [38, 46], [54, 34], [68, 40], [84, 28]];
    return `<svg class="room-steps" viewBox="0 0 120 60" aria-hidden="true">${pts.map(([x, y], i) =>
      `<use href="#foot" transform="translate(${x} ${y}) rotate(62) scale(${i % 2 ? -0.9 : 0.9} .9)" />`).join("")}</svg>`;
  };
  $("#wing").innerHTML = S.projects.map((p, i) => `
    <article class="room proj-room" data-label="${esc(p.title)}">
      <p class="proj-meta">${esc([p.year, p.kind].filter(Boolean).join(" · "))}</p>
      <h3>${esc(p.title)}</h3>
      <p class="proj-blurb">${esc(p.blurb)}</p>
      <ul class="proj-stack" aria-label="Built with">${(p.stack || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="proj-actions">
        ${p.detail ? `<button class="enter" type="button" aria-expanded="false" aria-controls="pm-${i}">Step inside</button>` : ""}
        ${(p.links || []).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}
      </div>
      ${p.detail ? `<div class="proj-more" id="pm-${i}"><div><p>${esc(p.detail)}</p></div></div>` : ""}
      ${stepsSvg()}
    </article>`).join("");
  $("#wing").addEventListener("click", (e) => {
    const b = e.target.closest(".enter");
    if (!b) return;
    const room = b.closest(".proj-room");
    const open = room.classList.toggle("is-open");
    b.setAttribute("aria-expanded", String(open));
    b.textContent = open ? "Step back out" : "Step inside";
  });

  $("#cabinetList").innerHTML = S.cabinet.map((c) => `
    <article class="room" data-label="${esc(c.tag || "")}">
      <h3 class="curio-title" style="font-size:1.6rem;line-height:1.1;margin-bottom:6px">${esc(c.title)}</h3>
      <p>${esc(c.body)}</p>
    </article>`).join("");

  $("#mailLink").href = `mailto:${S.email}`;
  $("#mailLink").textContent = S.email;
  $("#socials").innerHTML = S.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("");
  $("#yr").textContent = new Date().getFullYear();

  $$(".room").forEach(watchRoom);

  /* ---------------- the castle on the cover ---------------- */
  (function castle() {
    const svg = $("#castle");
    const g = el("g", {}, svg);
    const T_ = [210, 92], R_ = [356, 168], B_ = [210, 244], L_ = [64, 168], WH = 46;
    const down = ([x, y], d = WH) => [x, y + d];
    const pts = (...p) => p.map((q) => q.join(",")).join(" ");
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

    function tower(cx, baseY, topY, r, roofH, opts = {}) {
      const t = el("g", {}, g);
      const ry = r * 0.36;
      const body = `M${cx - r} ${topY} V${baseY} A${r} ${ry} 0 0 0 ${cx + r} ${baseY} V${topY} Z`;
      el("path", { class: "c-face", d: body }, t);
      el("path", { class: "c-brick", d: body }, t);
      el("ellipse", { class: "c-face", cx, cy: topY, rx: r, ry }, t);
      for (let k = -r + 3; k < r - 2; k += 6) el("rect", { class: "c-face", x: cx + k, y: topY - 5 + Math.abs(k) * 0.12, width: 3.4, height: 5 }, t);
      if (roofH) {
        el("path", { class: "c-roof", d: `M${cx - r - 3} ${topY - 2} L${cx} ${topY - roofH} L${cx + r + 3} ${topY - 2} Q${cx} ${topY + ry} ${cx - r - 3} ${topY - 2} Z` }, t);
        if (opts.flag) {
          const tip = topY - roofH;
          el("path", { class: "c-line", d: `M${cx} ${tip} V${tip - 16}` }, t);
          el("path", { class: "c-flag", d: `M${cx} ${tip - 16} q8 2 14 -1 q-4 4 0 7 q-7 2 -14 0 Z` }, t);
        }
      }
      const wy = topY + (baseY - topY) * 0.38;
      el("path", { class: "c-dark", d: `M${cx - 2} ${wy + 9} V${wy + 2} Q${cx} ${wy - 1} ${cx + 2} ${wy + 2} V${wy + 9} Z` }, t);
      if (baseY - topY > 70) el("path", { class: "c-dark", d: `M${cx - 2} ${wy + 37} V${wy + 30} Q${cx} ${wy + 27} ${cx + 2} ${wy + 30} V${wy + 37} Z` }, t);
    }
    function crenel(a, b, up = 6) {
      const n = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 9);
      let d = "";
      for (let i = 0; i < n; i += 2) {
        const p = lerp(a, b, i / n), q = lerp(a, b, (i + 1) / n);
        d += `M${p[0]} ${p[1]} V${p[1] - up} L${q[0]} ${q[1] - up} V${q[1]} `;
      }
      el("path", { class: "c-line", d }, g);
    }
    function windows(a, b, y0) {
      for (let i = 1; i < 8; i++) {
        if (i === 4) continue;
        const [x, y] = lerp(a, b, i / 8);
        const s = (b[1] - a[1]) / (b[0] - a[0]);
        el("path", { class: "c-dark", d: `M${x - 2} ${y + y0 + 10 - 2 * s} L${x - 2} ${y + y0 + 2 - 2 * s} Q${x} ${y + y0 - 2} ${x + 2} ${y + y0 + 2 + 2 * s} L${x + 2} ${y + y0 + 10 + 2 * s} Z` }, g);
      }
    }
    // back towers
    tower(137, 140, 74, 11, 34, { flag: true });
    tower(283, 140, 74, 11, 34, { flag: true });
    tower(210, 98, 22, 15, 46, { flag: true });
    // back parapets
    el("polygon", { class: "c-face", points: pts(L_, T_, [T_[0], T_[1] - 12], [L_[0], L_[1] - 12]) }, g);
    el("polygon", { class: "c-face", points: pts(T_, R_, [R_[0], R_[1] - 12], [T_[0], T_[1] - 12]) }, g);
    crenel([L_[0], L_[1] - 12], [T_[0], T_[1] - 12]);
    crenel([T_[0], T_[1] - 12], [R_[0], R_[1] - 12]);
    // courtyard, with the title's blood-dark diamond
    el("polygon", { class: "c-face", points: pts(T_, R_, B_, L_) }, g);
    el("polygon", { class: "c-diamond", points: pts([210, 104], [330, 168], [210, 232], [90, 168]) }, g);
    // front walls
    el("polygon", { class: "c-face", points: pts(L_, B_, down(B_), down(L_)) }, g);
    el("polygon", { class: "c-brick", points: pts(L_, B_, down(B_), down(L_)) }, g);
    el("polygon", { class: "c-face", points: pts(B_, R_, down(R_), down(B_)) }, g);
    el("polygon", { class: "c-brick", points: pts(B_, R_, down(R_), down(B_)) }, g);
    crenel(L_, B_); crenel(B_, R_);
    windows(L_, B_, 12); windows(B_, R_, 12);
    const gate = lerp(L_, B_, 0.5);
    el("path", { class: "c-dark", d: `M${gate[0] - 8} ${gate[1] + WH - 4} V${gate[1] + 30} Q${gate[0]} ${gate[1] + 18} ${gate[0] + 8} ${gate[1] + 34} V${gate[1] + WH + 4} Z` }, g);
    // front towers
    tower(64, 222, 120, 14, 40, { flag: false });
    tower(356, 222, 120, 14, 40, { flag: true });
    tower(137, 262, 214, 10, 22);
    tower(283, 262, 214, 10, 22);
    // a banner on a pole, like an old surveyor's mark
    el("path", { class: "c-line", d: "M30 230 V70" }, g);
    el("path", { class: "c-flag", d: "M30 74 C52 66 78 84 104 74 L98 88 L106 100 C80 108 54 92 30 100 Z" }, g);
    const ft = el("text", { class: "c-flag-text", x: 34, y: 92, transform: "rotate(-3 34 92)" }, g);
    ft.textContent = "R · D · C";
  })();

  /* ---------------- a river of words below the castle ---------------- */
  (function river() {
    const svg = $("#river");
    for (let i = 0; i < 7; i++) {
      const pid = id("riv");
      const y = 8 + i * 15, spread = 40 + i * 26, sag = 10 + i * 3;
      el("path", { id: pid, d: `M${210 - spread} ${y + sag} Q${210 - spread / 2} ${y - 4} 210 ${y + 6} T${210 + spread} ${y - 2}`, fill: "none" }, svg);
      const t = el("text", {}, svg);
      el("textPath", { href: `#${pid}` }, t).textContent = latin(4 + i * 3).toUpperCase();
    }
  })();

  /* ---------------- the floor plan ---------------- */
  const plan = $("#plan");
  const HUB = [220, 350];
  const ROOMS = {
    library: { label: "The Library", go: "#library", shape: ["rect", 30, 40, 170, 150], c: [115, 115], door: [115, 190, "h"],
      path: [[115, 115], [115, 240], [220, 240], HUB] },
    workshop: { label: "The Workshop", go: "#workshop", shape: ["rect", 240, 30, 175, 175], c: [327, 117], door: [327, 205, "h"],
      path: [[327, 117], [327, 240], [220, 240], HUB] },
    hall: { label: "Great Hall", go: "#top", shape: ["rect", 130, 290, 180, 120], c: HUB, door: null, path: [HUB] },
    armory: { label: "The Armory", go: "#armory", shape: ["oct", 105, 562, 74], c: [105, 562], door: [105, 488, "h"],
      path: [[105, 562], [105, 450], [220, 450], HUB] },
    cabinet: { label: "The Cabinet", go: "#cabinet", shape: ["rect", 255, 490, 160, 140], c: [335, 560], door: [335, 490, "h"],
      path: [[335, 560], [335, 450], [220, 450], HUB] },
    owlery: { label: "Owlery", go: "#owlery", shape: ["circle", 220, 690, 44], c: [220, 690], door: [220, 646, "h"],
      path: [[220, 690], [220, 450], HUB] },
  };
  function shapePath(s, inset = 0) {
    const [k, a, b, c, d] = s;
    if (k === "rect") return `M${a + inset} ${b + inset} H${a + c - inset} V${b + d - inset} H${a + inset} Z`;
    if (k === "circle") { const r = c - inset; return `M${a - r} ${b} A${r} ${r} 0 1 0 ${a + r} ${b} A${r} ${r} 0 1 0 ${a - r} ${b} Z`; }
    if (k === "oct") {
      const r = c - inset / Math.cos(Math.PI / 8);
      return "M" + Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i * Math.PI) / 4 - Math.PI / 2; return `${(a + r * Math.cos(t)).toFixed(1)} ${(b + r * Math.sin(t)).toFixed(1)}`; }).join(" L") + " Z";
    }
  }
  (function buildPlan() {
    const W = 9;
    const plan_ = document.getElementById("plan");
    const art = el("g", { id: "planArt" }, plan_);
    const plan = art;
    // courtyards of quatrefoils
    const clovers = el("g", { class: "fill-in" }, plan);
    const clover = (x, y) => el("path", { class: "clover", d: `M${x} ${y - 3} a3 3 0 1 1 3 3 a3 3 0 1 1 -3 3 a3 3 0 1 1 -3 -3 a3 3 0 1 1 3 -3 Z M${x - 1} ${y} h2` }, clovers);
    for (let y = 296; y <= 420; y += 30) { clover(40, y); clover(80, y); clover(355, y); clover(395, y); }
    for (let x = 270; x <= 410; x += 28) clover(x, 668), clover(x, 710);
    for (let x = 30; x <= 160; x += 28) clover(x, 690), clover(x + 14, 720);
    // corridors: a wide ink stroke under a narrower floor stroke leaves two walls
    const corr = "M115 190 V240 H327 V205 M220 240 V290 M105 488 V450 H335 V490 M220 410 V646";
    el("path", { class: "corr fill-in", d: corr, "stroke-width": 21, "stroke-linecap": "square", "stroke-linejoin": "miter" }, plan);
    el("path", { class: "fill-in", d: corr, fill: "none", stroke: "var(--parch)", "stroke-width": 18.8, "stroke-linecap": "square", "stroke-linejoin": "miter" }, plan);
    const cid = id("corr");
    el("path", { id: cid, d: "M115 190 V240 H327 M220 240 V290 M105 488 V450 H335 M220 410 V646", fill: "none" }, plan);
    const ct = el("text", { class: "wall-text", dy: "2" }, plan);
    el("textPath", { href: `#${cid}` }, ct).textContent = repeatTo(WALL, 260);

    // rooms
    Object.entries(ROOMS).forEach(([key, r]) => {
      const g = el("g", { class: "plan-room", "data-room": key, tabindex: 0, role: "link", "aria-label": `${r.label}` }, plan);
      el("path", { class: "floor fill-in", d: shapePath(r.shape) }, g);
      el("path", { class: "w-line", d: shapePath(r.shape), pathLength: 1 }, g);
      el("path", { class: "w-line", d: shapePath(r.shape, W), pathLength: 1 }, g);
      const pid = id("rw");
      el("path", { id: pid, d: shapePath(r.shape, W / 2), fill: "none" }, g);
      const t = el("text", { class: "wall-text", dy: "2" }, g);
      el("textPath", { href: `#${pid}` }, t).textContent = repeatTo(WALL, 300);
      if (r.door) {
        const [x, y] = r.door;
        el("rect", { class: "fill-in", x: x - 9.4, y: y - W - 1, width: 18.8, height: W * 2 + 2, fill: "var(--parch)" }, g);
      }
      // furniture
      const deco = el("g", { class: "fill-in" }, g);
      const D = (d) => el("path", { class: "deco", d }, deco);
      if (key === "library") { for (let y = 58; y <= 104; y += 9) D(`M44 ${y} H80 M150 ${y} H186`); D("M88 100 h54 v22 h-54 z"); }
      if (key === "workshop") { D("M256 52 h70 v16 h-70 z M256 162 h70 v16 h-70 z M380 50 v100 M392 50 v100"); D("M380 60 h12 M380 72 h12 M380 84 h12 M380 96 h12 M380 108 h12 M380 120 h12 M380 132 h12"); }
      if (key === "hall") { D("M150 308 h140 v8 h-140 z M150 384 h140 v8 h-140 z"); for (let x = 156; x < 290; x += 10) D(`M${x} 322 v4 M${x} 374 v4`); }
      if (key === "armory") { D(shapePath(["oct", 105, 562, 46])); }
      if (key === "cabinet") { for (let x = 270; x < 400; x += 26) D(`M${x} 506 h20 v14 h-20 z M${x} 526 h20 v14 h-20 z`); D("M300 554 h70 v20 h-70 z"); }
      if (key === "owlery") { for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; D(`M${220 + Math.cos(a) * 14} ${690 + Math.sin(a) * 14} L${220 + Math.cos(a) * 30} ${690 + Math.sin(a) * 30}`); } }
      const name = el("text", { class: `room-name${key === "owlery" ? " room-name--sm" : ""}`, x: r.c[0], y: { hall: 356, owlery: 694, library: 160, workshop: 124, armory: 567, cabinet: 608 }[key] }, g);
      name.textContent = r.label;
    });
  })();
  el("g", { id: "planSteps" }, plan);
  $$(".spread").forEach((s, i) => {
    const g = el("svg", { class: "ghost-plan", viewBox: "0 0 440 740", "aria-hidden": "true" });
    const copy = document.getElementById("planArt").cloneNode(true);
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    copy.querySelectorAll("[tabindex]").forEach((n) => { n.removeAttribute("tabindex"); n.removeAttribute("role"); n.removeAttribute("aria-label"); });
    g.appendChild(copy);
    g.style.setProperty("--rot", `${i % 2 ? 7 : -6}deg`);
    g.classList.add(i % 2 ? "ghost-plan--l" : "ghost-plan--r");
    s.prepend(g);
  });
  const planSteps = $("#planSteps");

  /* ---------------- amphitheatre + spiral stair drawings ---------------- */
  (function amphi() {
    const svg = $("#amphi");
    const g = el("g", { class: "ink-draw" }, svg);
    for (let r = 40; r <= 120; r += 12) el("path", { d: `M${150 - r} 200 A${r} ${r} 0 0 1 ${150 + r} 200`, pathLength: 1 }, g);
    for (let i = 0; i <= 14; i++) { const a = Math.PI + (i / 14) * Math.PI; el("path", { d: `M${150 + Math.cos(a) * 40} ${200 + Math.sin(a) * 40} L${150 + Math.cos(a) * 120} ${200 + Math.sin(a) * 120}`, pathLength: 1 }, g); }
    el("path", { d: "M18 200 H282", pathLength: 1 }, g);
    const pid = id("amp");
    el("path", { id: pid, d: "M24 200 A126 126 0 0 1 276 200", fill: "none" }, svg);
    const t = el("text", { dy: "-3" }, svg);
    el("textPath", { href: `#${pid}` }, t).textContent = repeatTo(WALL, 150);
  })();
  (function stair() {
    const svg = $(".stair");
    if (!svg) return;
    const g = el("g", { class: "ink-draw" }, svg);
    for (const r of [90, 80, 20]) el("circle", { cx: 100, cy: 160, r, pathLength: 1 }, g);
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; el("path", { d: `M${100 + Math.cos(a) * 20} ${160 + Math.sin(a) * 20} L${100 + Math.cos(a) * 80} ${160 + Math.sin(a) * 80}`, pathLength: 1 }, g); }
    const pid = id("st");
    el("path", { id: pid, d: "M15 160 A85 85 0 1 1 185 160 A85 85 0 1 1 15 160", fill: "none" }, svg);
    const t = el("text", { dy: "2" }, svg);
    el("textPath", { href: `#${pid}` }, t).textContent = repeatTo(WALL, 150);
  })();

  /* ---------------- footsteps ---------------- */
  function Walker(layer, name, cls = "", opts = {}) {
    const stride = opts.stride || 15, pace = opts.pace || 170, scale = opts.scale || 1;
    let tag = null;
    if (name) {
      tag = el("g", { class: `name-tag ${cls ? "name-tag--" + cls : ""}`, opacity: 0 }, layer);
      el("text", { y: 0 }, tag).textContent = name;
    }
    let timer = 0, side = 1, alive = true;
    function print(x, y, ang) {
      const u = el("use", { href: "#foot", class: `print ${opts.printCls || ""}` }, layer);
      const rad = (ang * Math.PI) / 180, off = 4.5 * scale * side;
      u.setAttribute("transform", `translate(${(x + Math.cos(rad) * off).toFixed(1)} ${(y + Math.sin(rad) * off).toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(side < 0 ? -scale : scale).toFixed(2)} ${scale})`);
      u.addEventListener("animationend", () => u.remove());
      side = -side;
    }
    function walk(points, done) {
      clearTimeout(timer);
      const segs = []; let total = 0;
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i], len = Math.hypot(x2 - x1, y2 - y1);
        if (len) { segs.push({ x1, y1, x2, y2, len, start: total }); total += len; }
      }
      let s = 0;
      const step = () => {
        if (!alive) return;
        if (!segs.length) return done && done();
        const seg = segs.find((q) => s <= q.start + q.len) || segs[segs.length - 1];
        const t = Math.min(1, (s - seg.start) / seg.len);
        const x = seg.x1 + (seg.x2 - seg.x1) * t, y = seg.y1 + (seg.y2 - seg.y1) * t;
        const ang = (Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1) * 180) / Math.PI + 90;
        print(x, y, ang);
        if (tag) { tag.setAttribute("transform", `translate(${(x + 14).toFixed(1)} ${(y - 14).toFixed(1)})`); tag.setAttribute("opacity", 1); }
        s += stride;
        timer = setTimeout(s <= total ? step : () => done && done(), pace);
      };
      step();
    }
    return {
      walk, print,
      place(x, y) { if (tag) { tag.setAttribute("transform", `translate(${x + 14} ${y - 14})`); tag.setAttribute("opacity", 1); } },
      hide() { if (tag) tag.setAttribute("opacity", 0); },
      stop() { clearTimeout(timer); },
      revive() { alive = true; },
      kill() { alive = false; clearTimeout(timer); },
    };
  }

  /* routes on the plan: follow each room's path to the hall, trimmed where two paths meet */
  const key = (p) => p.join(",");
  function route(a, b) {
    const A = ROOMS[a].path, B = ROOMS[b].path;
    const inB = new Set(B.map(key));
    const meet = A.findIndex((p) => inB.has(key(p)));
    const j = B.findIndex((p) => key(p) === key(A[meet]));
    return [...A.slice(0, meet + 1), ...B.slice(0, j).reverse()];
  }

  const NAMES = Object.keys(ROOMS);
  const rahul = Walker(planSteps, "Rahul", "", { stride: 10, scale: 0.55 });
  const bug = Walker(planSteps, "A Stray Bug", "", { stride: 6, pace: 120, scale: 0.36 });
  const roamers = [
    { w: rahul, here: "workshop", rest: 2400 },
    { w: bug, here: "cabinet", rest: 900 },
  ];
  let roaming = false, planVisible = true;
  function roam(r) {
    if (!roaming) return;
    const next = NAMES.filter((n) => n !== r.here)[Math.floor(Math.random() * (NAMES.length - 1))];
    r.w.walk(route(r.here, next), () => { r.here = next; r.t = setTimeout(() => roam(r), r.rest + Math.random() * 1200); });
  }
  function startRoam() {
    if (root.classList.contains("is-closed") || !planVisible || document.hidden) return;
    if (reduce) { roamers.forEach((r) => { const [x, y] = ROOMS[r.here].c; r.w.place(x, y - 20); }); return; }
    if (roaming) return;
    roaming = true;
    roamers.forEach((r, i) => { r.w.revive(); setTimeout(() => roam(r), i * 700); });
  }
  function stopRoam() { roaming = false; roamers.forEach((r) => { clearTimeout(r.t); r.w.stop(); }); }
  new IntersectionObserver(([e]) => { planVisible = e.isIntersecting; planVisible ? startRoam() : stopRoam(); }).observe(plan);
  document.addEventListener("visibilitychange", () => (document.hidden ? stopRoam() : startRoam()));

  // your own footsteps follow the pointer across the plan
  const you = Walker(planSteps, "you", "you", { printCls: "print--you", scale: 0.55 });
  let lastP = null, youIdle = 0;
  const toPlan = (cx, cy) => { const p = plan.createSVGPoint(); p.x = cx; p.y = cy; const m = plan.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : null; };
  plan.addEventListener("pointermove", (e) => {
    if (reduce || e.pointerType !== "mouse" || root.classList.contains("is-closed")) return;
    const p = toPlan(e.clientX, e.clientY);
    if (!p) return;
    if (!lastP) { lastP = p; return; }
    if (Math.hypot(p.x - lastP.x, p.y - lastP.y) < 11) return;
    const ang = (Math.atan2(p.y - lastP.y, p.x - lastP.x) * 180) / Math.PI + 90;
    you.print(p.x, p.y, ang); you.place(p.x, p.y);
    lastP = p;
    clearTimeout(youIdle); youIdle = setTimeout(() => you.hide(), 1400);
  });
  plan.addEventListener("pointerleave", () => { lastP = null; you.hide(); });

  // rooms on the plan are links; Rahul heads there first
  function goTo(hash) {
    const t = document.querySelector(hash);
    if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$(".plan-room", plan).forEach((g) => {
    const k = g.dataset.room;
    const go = () => {
      const r = roamers[0];
      if (!reduce && r.here !== k) { clearTimeout(r.t); r.w.walk(route(r.here, k), () => { r.here = k; r.t = setTimeout(() => roam(r), r.rest); }); r.here = k; }
      setTimeout(() => goTo(ROOMS[k].go), reduce ? 0 : 500);
    };
    g.addEventListener("click", go);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* ---------------- links walk you toward their room ---------------- */
  const walkLayer = $("#walkLayer");
  let guide = null;
  function walkToward(link) {
    if (reduce || root.classList.contains("is-closed")) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    walkLayer.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
    if (guide) guide.kill();
    walkLayer.querySelectorAll(".name-tag").forEach((n) => n.remove());
    guide = Walker(walkLayer, "this way", "", { stride: 22, pace: 110, printCls: "print--slow" });
    const a = link.getBoundingClientRect(), b = target.getBoundingClientRect();
    const sx = a.left + a.width / 2, sy = a.bottom + 12;
    const ex = Math.min(innerWidth - 40, Math.max(40, b.left + Math.min(160, b.width / 3)));
    const ey = Math.min(innerHeight - 30, Math.max(90, b.top + 40));
    const mx = (sx + ex) / 2 + (sx < ex ? -60 : 60), my = (sy + ey) / 2;
    guide.walk([[sx, sy], [mx, my], [ex, ey]], () => setTimeout(() => guide && guide.hide(), 900));
  }
  document.addEventListener("pointerover", (e) => {
    const a = e.target.closest && e.target.closest("a[data-walk]");
    if (a && !a.contains(e.relatedTarget)) walkToward(a);
  });
  document.addEventListener("focusin", (e) => { if (e.target.matches && e.target.matches("a[data-walk]") && e.target.matches(":focus-visible")) walkToward(e.target); });

  /* ---------------- footsteps circling the folded map ---------------- */
  const edge = $("#edgeSteps"), stage = $(".stage");
  const edgeWalkers = [];
  function edgeLoop() {
    if (reduce || !root.classList.contains("is-closed") || innerWidth < 900) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    edge.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const fold = $("#fold").getBoundingClientRect(), sr = stage.getBoundingClientRect();
    const coverL = fold.left - sr.left + fold.width / 3, coverR = coverL + fold.width / 3;
    const lanes = [
      [[coverL - 70, h - 30], [coverL - 110, h * 0.62], [coverL - 60, h * 0.34], [coverL - 120, 40]],
      [[coverR + 80, 40], [coverR + 120, h * 0.4], [coverR + 70, h * 0.7], [coverR + 110, h - 30]],
    ];
    lanes.forEach((lane, i) => {
      const w8 = edgeWalkers[i] || (edgeWalkers[i] = Walker(edge, "", "", { stride: 26, pace: 260, printCls: "print--slow" }));
      w8.revive();
      setTimeout(() => w8.walk(lane, () => setTimeout(() => edgeLoop.lane(i), 1500)), i * 1800);
    });
  }
  edgeLoop.lane = () => {}; // lanes restart together below
  let edgeTimer = 0;
  function startEdge() { stopEdge(); edgeLoop(); edgeTimer = setInterval(edgeLoop, 16000); }
  function stopEdge() { clearInterval(edgeTimer); edgeWalkers.forEach((w) => w.kill()); }

  /* ---------------- ink: draw things when they come into view ---------------- */
  const inkIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("inked"); inkIO.unobserve(e.target); }
  }), { threshold: 0.2 });
  const heroInk = () => [...$$(".fold .walls"), plan, $(".compass"), $("#amphi"), $(".cover-ribbon")];
  $$("main .walls, .stair, #armor").forEach((n) => inkIO.observe(n));
  $(".cover-ribbon").classList.add("inked");

  /* ---------------- the fold ---------------- */
  const faces = { inner: $$(".face--front"), cover: $("#cover") };
  function setInert() {
    const closed = root.classList.contains("is-closed");
    faces.inner.forEach((f) => (f.inert = closed));
    faces.cover.inert = !closed;
    $("#main").inert = false;
  }
  function inkHero(delayBase) {
    heroInk().forEach((n) => { if (n) { n.style.setProperty("--d", `${delayBase}s`); n.classList.add("inked"); } });
  }
  function openMap() {
    if (!root.classList.contains("is-closed")) return;
    session.set("map-open", "1");
    root.classList.remove("is-closed");
    setInert();
    stopEdge();
    $$(".print", edge).forEach((p) => p.remove());
    inkHero(reduce ? 0 : 0.9);
    setTimeout(startRoam, reduce ? 0 : 2200);
  }
  function closeMap() {
    stopRoam();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const finish = () => {
      root.classList.add("is-closed");
      setInert();
      session.set("map-open", null);
      $$(".print", planSteps).forEach((p) => p.remove());
      heroInk().forEach((n) => n && n !== $(".cover-ribbon") && n.classList.remove("inked"));
      setTimeout(() => { $("#swearBtn").focus({ preventScroll: true }); startEdge(); }, reduce ? 0 : 1500);
    };
    if (reduce) return finish();
    const wait = () => (scrollY < 30 ? finish() : requestAnimationFrame(wait));
    wait();
  }
  $("#swearBtn").addEventListener("click", openMap);
  $("#managedBtn").addEventListener("click", closeMap);
  setInert();
  if (root.classList.contains("is-closed")) startEdge();
  else { inkHero(0.2); startRoam(); }
  addEventListener("resize", () => { if (root.classList.contains("is-closed")) startEdge(); }, { passive: true });

  /* ---------------- the armory ---------------- */
  const armor = $("#armor");
  const mirror = (pts) => pts.map(([x, y]) => [320 - x, y]).reverse();
  const P = (pts) => pts.map((p) => p.join(",")).join(" ");
  const ARMOR = {
    helm: { label: "Helm", anchor: [200, 64], end: [312, 64],
      plates: [[[160, 22], [198, 36], [206, 104], [160, 124], [114, 104], [122, 36]]],
      lines: ["M126 70 H194", "M130 82 H190", "M160 24 V120"], rivets: [[176, 98], [184, 94], [176, 108], [184, 104]] },
    breastplate: { label: "Breastplate", anchor: [210, 190], end: [312, 190],
      plates: [[[116, 130], [204, 130], [214, 190], [198, 256], [122, 256], [106, 190]]],
      lines: ["M160 134 V252", "M124 142 L160 156 L196 142", "M118 214 H202"], rivets: [[122, 138], [198, 138]] },
    gauntlets: { label: "Gauntlets", anchor: [254, 330], end: [312, 330],
      plates: (() => { const L = [[[114, 128], [78, 134], [62, 170], [70, 192], [106, 180]], [[72, 198], [100, 188], [98, 252], [70, 258]], [[70, 280], [98, 274], [96, 336], [66, 340]], [[64, 344], [98, 340], [102, 372], [84, 388], [62, 378]]]; return [...L, ...L.map(mirror)]; })(),
      lines: ["M70 152 L108 146", "M66 168 L104 162", "M68 360 H98", "M70 370 H96", "M250 152 L212 146", "M254 168 L216 162", "M252 360 H222", "M250 370 H224"],
      circles: [[84, 266, 11], [236, 266, 11]] },
    belt: { label: "Sword belt", anchor: [204, 267], end: [312, 250],
      plates: [[[120, 258], [200, 258], [204, 276], [116, 276]], [[116, 280], [158, 280], [156, 318], [110, 312]], mirror([[116, 280], [158, 280], [156, 318], [110, 312]]), [[210, 272], [219, 270], [256, 432], [247, 434]]],
      lines: ["M150 261 h20 v12 h-20 z", "M198 270 L232 262", "M118 296 H157", "M202 296 H163"] },
    greaves: { label: "Greaves", anchor: [186, 450], end: [312, 450],
      plates: (() => { const L = [[[118, 322], [156, 322], [154, 392], [122, 392]], [[122, 420], [154, 420], [152, 486], [126, 486]], [[124, 490], [156, 490], [160, 508], [112, 508]]]; return [...L, ...L.map(mirror)]; })(),
      lines: ["M138 426 V480", "M182 426 V480"], circles: [[138, 405, 13], [182, 405, 13]] },
  };
  const ORDER = ["helm", "breastplate", "gauntlets", "belt", "greaves"];
  ORDER.forEach((k, i) => {
    const a = ARMOR[k], part = S.suit.parts[k];
    const g = el("g", { class: "piece", "data-part": k, tabindex: 0, role: "button", "aria-label": part ? part.name : a.label }, armor);
    g.style.setProperty("--d", `${i * 0.18}s`);
    a.plates.forEach((pts) => { el("polygon", { class: "plate", points: P(pts), pathLength: 1 }, g); el("polygon", { class: "hatchfill", points: P(pts) }, g); });
    (a.circles || []).forEach(([cx, cy, r]) => { el("circle", { class: "plate", cx, cy, r, pathLength: 1 }, g); el("circle", { class: "hatchfill", cx, cy, r }, g); });
    (a.lines || []).forEach((d) => el("path", { class: "line", d, pathLength: 1 }, g));
    (a.rivets || []).forEach(([cx, cy]) => el("circle", { class: "rivet", cx, cy, r: 1.8 }, g));
  });
  const leader = el("path", { class: "leader", pathLength: 1 }, armor);
  const leaderDot = el("circle", { class: "leader-dot", r: 3 }, armor);
  const tabs = $("#armorTabs"), panel = $("#armorPanel");
  tabs.innerHTML = ORDER.filter((k) => S.suit.parts[k]).map((k) =>
    `<button type="button" role="tab" id="tab-${k}" data-part="${k}" aria-selected="false" aria-controls="armorPanel" tabindex="-1">${esc(ARMOR[k].label)}</button>`).join("");
  function selectPart(k, focusTab) {
    const p = S.suit.parts[k], a = ARMOR[k];
    if (!p) return;
    $$(".piece", armor).forEach((g) => g.classList.toggle("is-active", g.dataset.part === k));
    $$("button", tabs).forEach((b) => { const on = b.dataset.part === k; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; if (on && focusTab) b.focus(); });
    panel.setAttribute("aria-labelledby", `tab-${k}`);
    panel.innerHTML = `<h3>${esc(p.name)}</h3><p class="armor-role">${esc(p.role)}</p>
      <ul class="gear">${p.gear.map((g) => `<li><div class="gear-row"><span>${esc(g.name)}</span><span class="gear-lvl">${Math.round(g.level)}</span></div>
      <div class="gauge" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${g.level}" aria-label="${esc(g.name)}"><i style="--lvl:${Math.max(0.02, g.level / 100)}"></i></div></li>`).join("")}</ul>`;
    panel.classList.remove("is-fresh"); void panel.offsetWidth; panel.classList.add("is-fresh");
    leader.setAttribute("d", `M${a.anchor[0]} ${a.anchor[1]} L${a.end[0]} ${a.end[1]}`);
    leaderDot.setAttribute("cx", a.anchor[0]); leaderDot.setAttribute("cy", a.anchor[1]);
    leader.classList.remove("on"); requestAnimationFrame(() => requestAnimationFrame(() => leader.classList.add("on")));
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectPart(b.dataset.part); });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const ks = $$("button", tabs).map((b) => b.dataset.part), i = ks.indexOf(document.activeElement.dataset.part);
    selectPart(ks[e.key === "Home" ? 0 : e.key === "End" ? ks.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + ks.length) % ks.length], true);
  });
  $$(".piece", armor).forEach((g) => {
    g.addEventListener("click", () => selectPart(g.dataset.part));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPart(g.dataset.part); } });
  });
  selectPart("breastplate");

  /* ---------------- the letter ---------------- */
  const postWrap = $("#postWrap"), wax = $("#waxBtn");
  postWrap.classList.add("letter-sealed");
  wax.setAttribute("aria-expanded", "false");
  wax.addEventListener("click", () => {
    postWrap.classList.remove("letter-sealed");
    wax.setAttribute("aria-expanded", "true");
    setTimeout(() => $("#mailLink").focus({ preventScroll: true }), reduce ? 0 : 700);
  });

  /* ---------------- mark the room you're standing in ---------------- */
  const navLinks = $$(".legend-bar a[data-walk]");
  const secIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${e.target.id}`)));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main .spread").forEach((s) => secIO.observe(s));
})();
