/* RAHUL DOES CODE: the enchanted map. Plain JS, no dependencies. */
(() => {
  const S = window.SITE;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const svgEl = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const session = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch {} },
  };
  root.classList.add("js");

  /* ---------------- parchment grain, generated once ---------------- */
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 220;
    const g = c.getContext("2d");
    for (let i = 0; i < 2600; i++) {
      const a = Math.random() * 0.07;
      g.fillStyle = Math.random() < 0.5 ? `rgba(90,58,24,${a})` : `rgba(255,248,225,${a * 1.4})`;
      g.fillRect(Math.random() * 220, Math.random() * 220, Math.random() * 1.6 + 0.4, Math.random() * 1.6 + 0.4);
    }
    document.body.style.setProperty("--noise", `url(${c.toDataURL()})`);
  } catch {}

  /* ---------------- content ---------------- */
  $("#ledger").innerHTML = S.projects.map((p, i) => `
    <li class="entry">
      <span class="entry-year">${esc(p.year || "")}</span>
      <div>
        <h3>${esc(p.title)}</h3><span class="entry-kind">${esc(p.kind || "")}</span>
        <p class="entry-blurb">${esc(p.blurb)}</p>
      </div>
      <div class="entry-actions">
        <button class="unfold" type="button" aria-expanded="false" aria-controls="more-${i}">Unfold</button>
      </div>
      <div class="entry-more" id="more-${i}"><div><div class="entry-sheet">
        ${p.detail ? `<p>${esc(p.detail)}</p>` : ""}
        <ul class="entry-stack" aria-label="Built with">${(p.stack || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <ul class="entry-links">${(p.links || []).map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>
      </div></div></div>
    </li>`).join("");
  $("#ledger").addEventListener("click", (e) => {
    const b = e.target.closest(".unfold");
    if (!b) return;
    const entry = b.closest(".entry");
    const open = entry.classList.toggle("is-open");
    b.setAttribute("aria-expanded", String(open));
    b.textContent = open ? "Fold it back" : "Unfold";
  });

  $("#cabinetList").innerHTML = S.cabinet.map((c) => `
    <article class="curio">
      <h3>${esc(c.title)}<span class="curio-tag">${esc(c.tag ? "· " + c.tag.toLowerCase() : "")}</span></h3>
      <p>${esc(c.body)}</p>
    </article>`).join("");

  $("#mailLink").href = `mailto:${S.email}`;
  $("#mailLink").textContent = S.email;
  $("#socials").innerHTML = S.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("");
  $("#yr").textContent = new Date().getFullYear();

  /* ---------------- the map ---------------- */
  const map = $("#map");
  const stepsLayer = $("#steps");
  const HUB = [600, 385];
  const TO_HUB = {
    library: [[230, 185], [600, 185], HUB],
    workshop: [[950, 185], [600, 185], HUB],
    hall: [HUB],
    armory: [[240, 575], [600, 575], HUB],
    cabinet: [[950, 575], [600, 575], HUB],
    post: [[1080, 385], HUB],
  };
  const ROOMS = Object.keys(TO_HUB);
  function route(a, b) {
    const A = TO_HUB[a], B = TO_HUB[b];
    if (A.length > 2 && B.length > 2 && A[1] === B[1]) return [A[0], A[1], B[0]];   // share a junction
    return [...A, ...B.slice(0, -1).reverse()];
  }
  function toSvg(clientX, clientY) {
    const pt = map.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = map.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : { x: 600, y: 380 };
  }

  const roomEls = Object.fromEntries($$(".room", map).map((g) => [g.dataset.room, g]));
  $$(".ribbon", map).forEach((r, i) => (r.dataset.room = ROOMS[i]));
  const ribbon = (k) => $(`.ribbon[data-room="${k}"]`, map);
  /* size each ribbon to its lettering once the face has loaded */
  const fitRibbons = () => $$(".ribbon", map).forEach((r) => {
    const w = $("text", r).getComputedTextLength() / 2 + 26, n = 12;
    $("path", r).setAttribute("d", `M${-w} -15 H${w} L${w - n} 0 L${w} 15 H${-w} L${-w + n} 0 Z`);
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitRibbons);
  /* on narrow screens the map pans; start it centred */
  const pan = $(".map-scroll");
  requestAnimationFrame(() => { pan.scrollLeft = (pan.scrollWidth - pan.clientWidth) / 2; });

  function makeTag(text, cls) {
    const g = svgEl("g", { class: `tag ${cls}`, opacity: 0 }, stepsLayer);
    const w = text.length * 8 + 20;
    svgEl("rect", { x: -w / 2, y: -13, width: w, height: 24, rx: 2 }, g);
    const t = svgEl("text", { y: 5 }, g);
    t.textContent = text;
    return g;
  }
  function placePrint(x, y, angleDeg, side, cls) {
    const u = svgEl("use", { href: "#foot", class: `print ${cls || ""}` }, stepsLayer);
    const rad = (angleDeg * Math.PI) / 180;
    const ox = Math.cos(rad) * 5 * side, oy = Math.sin(rad) * 5 * side;
    u.setAttribute("transform", `translate(${(x + ox).toFixed(1)} ${(y + oy).toFixed(1)}) rotate(${(angleDeg + 0).toFixed(1)}) scale(${side < 0 ? -1.25 : 1.25} 1.25)`);
    u.addEventListener("animationend", () => u.remove());
    return u;
  }

  /* a walker leaves alternating prints along a polyline */
  function Walker(name, cls) {
    const tag = makeTag(name, `tag--${cls}`);
    let timer = 0, side = 1, here = "workshop";
    const STRIDE = 17, PACE = 170;
    function walk(points, done) {
      clearTimeout(timer);
      const segs = [];
      let total = 0;
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (len) { segs.push({ x1, y1, x2, y2, len, start: total }); total += len; }
      }
      let s = 0;
      const step = () => {
        if (!segs.length) return done && done();
        const seg = segs.find((g) => s <= g.start + g.len) || segs[segs.length - 1];
        const t = Math.min(1, (s - seg.start) / seg.len);
        const x = seg.x1 + (seg.x2 - seg.x1) * t, y = seg.y1 + (seg.y2 - seg.y1) * t;
        const ang = (Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1) * 180) / Math.PI + 90;
        placePrint(x, y, ang, (side = -side), `print--${cls}`);
        tag.setAttribute("transform", `translate(${x.toFixed(1)} ${(y - 30).toFixed(1)})`);
        tag.setAttribute("opacity", 1);
        s += STRIDE;
        if (s <= total) timer = setTimeout(step, PACE);
        else timer = setTimeout(() => done && done(), PACE);
      };
      step();
    }
    return {
      tag,
      get here() { return here; },
      goTo(room, done) {
        const from = here;
        here = room;
        Object.values(roomEls).forEach((r) => r.classList.remove("is-here"));
        if (from === room) { roomEls[room].classList.add("is-here"); return done && done(); }
        walk(route(from, room), () => { roomEls[room].classList.add("is-here"); done && done(); });
      },
      stop() { clearTimeout(timer); },
    };
  }

  const rahul = Walker("Rahul", "rahul");
  let wandering = false, wanderTimer = 0, heroVisible = true;
  function wander() {
    if (!wandering) return;
    const next = ROOMS.filter((r) => r !== rahul.here)[Math.floor(Math.random() * (ROOMS.length - 1))];
    rahul.goTo(next, () => { wanderTimer = setTimeout(wander, 2200); });
  }
  function startWander() {
    if (reduce) { // a still figure instead of a walk
      const [x, y] = TO_HUB.workshop[0];
      rahul.tag.setAttribute("transform", `translate(${x} ${y - 30})`);
      rahul.tag.setAttribute("opacity", 1);
      roomEls.workshop.classList.add("is-here");
      return;
    }
    if (wandering || root.classList.contains("is-sealed") || !heroVisible || document.hidden) return;
    wandering = true;
    wander();
  }
  function stopWander() { wandering = false; clearTimeout(wanderTimer); rahul.stop(); }

  new IntersectionObserver(([e]) => {
    heroVisible = e.isIntersecting;
    heroVisible ? startWander() : stopWander();
  }).observe(map);
  document.addEventListener("visibilitychange", () => (document.hidden ? stopWander() : startWander()));

  /* you: prints follow the wand across the map */
  const you = makeTag("you", "tag--you");
  let last = null, youSide = 1, youIdle = 0;
  map.addEventListener("pointermove", (e) => {
    if (root.classList.contains("is-sealed") || reduce || e.pointerType !== "mouse") return;
    const p = toSvg(e.clientX, e.clientY);
    if (!last) { last = p; return; }
    const d = Math.hypot(p.x - last.x, p.y - last.y);
    if (d < 20) return;
    const ang = (Math.atan2(p.y - last.y, p.x - last.x) * 180) / Math.PI + 90;
    placePrint(p.x, p.y, ang, (youSide = -youSide), "print--you");
    you.setAttribute("transform", `translate(${p.x.toFixed(1)} ${(p.y - 30).toFixed(1)})`);
    you.setAttribute("opacity", 1);
    last = p;
    clearTimeout(youIdle);
    youIdle = setTimeout(() => you.setAttribute("opacity", 0), 1400);
  });
  map.addEventListener("pointerleave", () => { last = null; you.setAttribute("opacity", 0); });

  function blot(x, y, r = 12) {
    if (reduce) return;
    const c = svgEl("circle", { cx: x, cy: y, r: 1, class: "blot" }, stepsLayer);
    c.animate([{ r: 1, opacity: 0.85 }, { r, opacity: 0 }], { duration: 900, easing: "cubic-bezier(0.16,1,0.3,1)" }).onfinish = () => c.remove();
  }

  /* rooms are links */
  function goRoom(g) {
    const target = document.querySelector(g.dataset.go);
    if (!reduce && g.dataset.room !== rahul.here) { stopWander(); rahul.goTo(g.dataset.room, () => { wandering = false; startWander(); }); wandering = true; }
    setTimeout(() => target && target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), reduce ? 0 : 450);
  }
  Object.values(roomEls).forEach((g) => {
    g.addEventListener("click", (e) => {
      if (root.classList.contains("is-sealed")) return;
      const p = toSvg(e.clientX, e.clientY);
      blot(p.x, p.y);
      goRoom(g);
    });
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goRoom(g); } });
    const hot = (on) => ribbon(g.dataset.room)?.classList.toggle("is-hot", on);
    g.addEventListener("pointerenter", () => hot(true));
    g.addEventListener("pointerleave", () => hot(false));
    g.addEventListener("focus", () => hot(true));
    g.addEventListener("blur", () => hot(false));
  });

  /* ---------------- the reveal: ink spreads from where you tap ---------------- */
  const draws = $$(".map .draw");
  draws.forEach((el) => el.setAttribute("pathLength", "1"));
  const labelBits = $$(".map .labels > *");
  const centerOf = (el) => { const b = el.getBBox(); return [b.x + b.width / 2, b.y + b.height / 2]; };

  function reveal(clientX, clientY) {
    if (!root.classList.contains("is-sealed")) return;
    const r = map.getBoundingClientRect();
    const inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    const o = inside ? toSvg(clientX, clientY) : { x: 600, y: 380 };
    const delay = (el, extra = 0) => {
      const [cx, cy] = centerOf(el);
      el.style.setProperty("--d", `${(Math.hypot(cx - o.x, cy - o.y) / 1300 * 1.5 + extra).toFixed(3)}s`);
    };
    root.classList.add("is-drawing");
    root.classList.remove("is-sealed");
    draws.forEach((el) => delay(el));
    labelBits.forEach((el) => delay(el, 0.7));
    void map.getBoundingClientRect();
    requestAnimationFrame(() => {
      root.classList.add("is-drawn");
      blot(o.x, o.y, 70);
    });
    session.set("map-open", "1");
    setTimeout(() => {
      root.classList.remove("is-drawing", "is-drawn");
      startWander();
    }, 3600);
  }
  $(".hero").addEventListener("click", (e) => reveal(e.clientX, e.clientY));
  $("#revealBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    const r = map.getBoundingClientRect();
    reveal(r.left + r.width / 2, r.top + r.height / 2);
  });

  /* folding the map away replays the whole thing */
  $("#foldBtn").addEventListener("click", () => {
    stopWander();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const finish = () => {
      root.classList.add("is-folding");
      setTimeout(() => {
        root.classList.remove("is-folding");
        root.classList.add("is-sealed");
        $$(".print", stepsLayer).forEach((p) => p.remove());
        session.set("map-open", null);
        $("#revealBtn").focus({ preventScroll: true });
      }, reduce ? 0 : 750);
    };
    if (reduce) return finish();
    const wait = () => (scrollY < 40 ? finish() : requestAnimationFrame(wait));
    wait();
  });

  if (!root.classList.contains("is-sealed")) startWander();

  /* ---------------- flourishes ink themselves in ---------------- */
  const inkIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-drawn"); inkIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$(".flourish").forEach((f) => { $$("path", f).forEach((p) => p.setAttribute("pathLength", "1")); inkIO.observe(f); });

  /* ---------------- the armory ---------------- */
  const armor = $("#armor");
  const mirror = (pts) => pts.map(([x, y]) => [320 - x, y]).reverse();
  const P = (pts) => pts.map((p) => p.join(",")).join(" ");
  const ARMOR = {
    helm: {
      label: "Helm", anchor: [200, 64], end: [306, 64],
      plates: [[[160, 22], [198, 36], [206, 104], [160, 124], [114, 104], [122, 36]]],
      lines: ["M126 70 H194", "M130 82 H190", "M160 24 V120"],
      rivets: [[176, 98], [184, 94], [176, 108], [184, 104]],
    },
    breastplate: {
      label: "Breastplate", anchor: [210, 190], end: [306, 190],
      plates: [[[116, 130], [204, 130], [214, 190], [198, 256], [122, 256], [106, 190]]],
      lines: ["M160 134 V252", "M124 142 L160 156 L196 142", "M118 214 H202"],
      rivets: [[122, 138], [198, 138]],
    },
    gauntlets: {
      label: "Gauntlets", anchor: [254, 330], end: [306, 330],
      plates: (() => {
        const L = [
          [[114, 128], [78, 134], [62, 170], [70, 192], [106, 180]],
          [[72, 198], [100, 188], [98, 252], [70, 258]],
          [[70, 280], [98, 274], [96, 336], [66, 340]],
          [[64, 344], [98, 340], [102, 372], [84, 388], [62, 378]],
        ];
        return [...L, ...L.map(mirror)];
      })(),
      lines: ["M70 152 L108 146", "M66 168 L104 162", "M68 360 H98", "M70 370 H96", "M250 152 L212 146", "M254 168 L216 162", "M252 360 H222", "M250 370 H224"],
      circles: [[84, 266, 11], [236, 266, 11]],
    },
    belt: {
      label: "Sword belt", anchor: [204, 267], end: [306, 250],
      plates: [
        [[120, 258], [200, 258], [204, 276], [116, 276]],
        [[116, 280], [158, 280], [156, 318], [110, 312]],
        mirror([[116, 280], [158, 280], [156, 318], [110, 312]]),
        [[210, 272], [219, 270], [256, 432], [247, 434]],
      ],
      lines: ["M150 261 h20 v12 h-20 z", "M198 270 L232 262", "M118 296 H157", "M202 296 H163"],
    },
    greaves: {
      label: "Greaves", anchor: [186, 450], end: [306, 450],
      plates: (() => {
        const L = [
          [[118, 322], [156, 322], [154, 392], [122, 392]],
          [[122, 420], [154, 420], [152, 486], [126, 486]],
          [[124, 490], [156, 490], [160, 508], [112, 508]],
        ];
        return [...L, ...L.map(mirror)];
      })(),
      lines: ["M138 426 V480", "M182 426 V480"],
      circles: [[138, 405, 13], [182, 405, 13]],
    },
  };
  const ORDER = ["helm", "breastplate", "gauntlets", "belt", "greaves"];
  ORDER.forEach((key, i) => {
    const a = ARMOR[key];
    const part = S.suit.parts[key];
    const g = svgEl("g", { class: "piece", "data-part": key, tabindex: 0, role: "button", "aria-label": `${part ? part.name : a.label}` }, armor);
    g.style.setProperty("--d", `${i * 0.18}s`);
    a.plates.forEach((pts) => {
      svgEl("polygon", { class: "plate", points: P(pts), pathLength: 1 }, g);
      svgEl("polygon", { class: "hatchfill", points: P(pts) }, g);
    });
    (a.circles || []).forEach(([cx, cy, r]) => {
      svgEl("circle", { class: "plate", cx, cy, r, pathLength: 1 }, g);
      svgEl("circle", { class: "hatchfill", cx, cy, r }, g);
    });
    (a.lines || []).forEach((d) => svgEl("path", { class: "line", d, pathLength: 1 }, g));
    (a.rivets || []).forEach(([cx, cy]) => svgEl("circle", { class: "rivet", cx, cy, r: 1.8 }, g));
  });
  const leader = svgEl("path", { class: "leader", pathLength: 1 }, armor);
  const leaderDot = svgEl("circle", { class: "leader-dot", r: 3.2 }, armor);

  new IntersectionObserver((entries, io) => {
    entries.forEach((e) => { if (e.isIntersecting) { armor.classList.add("is-drawn"); io.disconnect(); } });
  }, { threshold: 0.25 }).observe(armor);

  const tabs = $("#armorTabs");
  tabs.innerHTML = ORDER.filter((k) => S.suit.parts[k]).map((k) =>
    `<button type="button" role="tab" id="tab-${k}" data-part="${k}" aria-selected="false" aria-controls="armorPanel" tabindex="-1">${esc(ARMOR[k].label)}</button>`
  ).join("");
  const panel = $("#armorPanel");
  function selectPart(key, focusTab) {
    const p = S.suit.parts[key], a = ARMOR[key];
    if (!p) return;
    $$(".piece", armor).forEach((g) => g.classList.toggle("is-active", g.dataset.part === key));
    $$("button", tabs).forEach((b) => {
      const on = b.dataset.part === key;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focusTab) b.focus();
    });
    panel.setAttribute("aria-labelledby", `tab-${key}`);
    panel.innerHTML = `
      <h3>${esc(p.name)}</h3>
      <p class="armor-role">${esc(p.role)}</p>
      <ul class="gear">${p.gear.map((g) => `
        <li>
          <div class="gear-row"><span>${esc(g.name)}</span><span class="gear-lvl">${Math.round(g.level)}</span></div>
          <div class="gauge" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${g.level}" aria-label="${esc(g.name)}"><i style="--lvl:${Math.max(0.02, g.level / 100)}"></i></div>
        </li>`).join("")}
      </ul>`;
    panel.classList.remove("is-fresh"); void panel.offsetWidth; panel.classList.add("is-fresh");
    leader.setAttribute("d", `M${a.anchor[0]} ${a.anchor[1]} L${a.end[0]} ${a.end[1]}`);
    leaderDot.setAttribute("cx", a.anchor[0]); leaderDot.setAttribute("cy", a.anchor[1]);
    leader.classList.remove("on"); void leader.getBBox(); requestAnimationFrame(() => leader.classList.add("on"));
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectPart(b.dataset.part); });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const keys = $$("button", tabs).map((b) => b.dataset.part);
    const i = keys.indexOf(document.activeElement.dataset.part);
    const n = e.key === "Home" ? 0 : e.key === "End" ? keys.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    selectPart(keys[n], true);
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

  /* ---------------- legend: mark the room you're in ---------------- */
  const navLinks = $$(".legend ul a");
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${e.target.id}`)));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main .section").forEach((s) => secIO.observe(s));

  /* ---------------- footstep trail: how far you've walked ---------------- */
  const trail = $(".trail");
  let prints = [];
  function buildTrail() {
    trail.innerHTML = "";
    const N = 34, h = innerHeight;
    trail.setAttribute("viewBox", `0 0 44 ${h}`);
    prints = Array.from({ length: N }, (_, i) => {
      const y = 40 + (i * (h - 80)) / (N - 1);
      const side = i % 2 ? 1 : -1;
      const x = 22 + Math.sin(i * 0.45) * 7 + side * 5;
      const u = svgEl("use", { href: "#foot", transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${180 + Math.cos(i * 0.45) * 12}) scale(${side} 1)` }, trail);
      return u;
    });
    updateTrail();
  }
  function updateTrail() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const k = Math.round((max > 0 ? scrollY / max : 0) * prints.length);
    prints.forEach((u, i) => { u.classList.toggle("on", i < k); u.classList.toggle("fresh", i === k - 1); });
  }
  if (matchMedia("(min-width: 1240px)").matches) buildTrail();
  addEventListener("resize", () => { if (matchMedia("(min-width: 1240px)").matches) buildTrail(); }, { passive: true });
  addEventListener("scroll", () => prints.length && updateTrail(), { passive: true });
})();
