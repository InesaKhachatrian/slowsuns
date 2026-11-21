/* site.js · behaviour for the design-system templates (Version 4B).
   Each part runs only if its markup is on the page.
   1. Menu sheet (phones, home hero)          6. Contents list follows the reading position
   2. Prototype language toggle (EN ⇄ ՀՅ)      7. Island map: pin ⇄ legend highlight
   3. Home place cards: stack + parallax       8. Places filters (region, best month)
   4. Explore reveal (country shape → photo)   9. Did you know? wheel, one spin a day
   5. Month map (months, zoom, pan, lists)
   All motion respects prefers-reduced-motion. */
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function raf(fn) { var busy = false; return function () { if (busy) return; busy = true; requestAnimationFrame(function () { busy = false; fn(); }); }; }

  /* 1. Menu sheet ------------------------------------------------------ */
  var sheet = $("#menu-sheet");
  $$("[data-menu-open]").forEach(function (b) {
    b.addEventListener("click", function () { sheet.hidden = false; b.setAttribute("aria-expanded", "true"); $("[data-menu-close]", sheet).focus(); });
  });
  $$("[data-menu-close]").forEach(function (b) {
    b.addEventListener("click", function () { sheet.hidden = true; $$("[data-menu-open]").forEach(function (o) { o.setAttribute("aria-expanded", "false"); o.focus(); }); });
  });

  /* 2. Prototype language toggle: elements with data-hy swap their text.
        The live site will serve one language per URL. */
  $$("[data-toggle-lang]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var toHy = doc.documentElement.lang !== "hy";
      doc.documentElement.lang = toHy ? "hy" : "en";
      $$("[data-hy]").forEach(function (el) {
        if (!el.dataset.en) el.dataset.en = el.innerHTML;
        el.innerHTML = toHy ? el.dataset.hy : el.dataset.en;
      });
    });
  });

  /* 3. Home place cards: each sticks; the next slides over it.
        The covered card shrinks 7 %, rounds +8 px, dims up to 55 %. Photo parallax up to 9 %. */
  var panels = $$(".place-panel");
  if (panels.length && !reduce) {
    var stack = raf(function () {
      var vh = window.innerHeight || 1;
      panels.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var next = panels[i + 1];
        var k = 0;
        if (next) k = Math.max(0, Math.min(1, 1 - (next.getBoundingClientRect().top - r.top) / (el.offsetHeight || 1)));
        el.style.transform = "scale(" + (1 - 0.07 * k).toFixed(3) + ")";
        el.style.borderRadius = (20 + Math.round(k * 8)) + "px";
        var dim = $(".place-panel__dim", el); if (dim) dim.style.opacity = (0.55 * k).toFixed(3);
        var y = Math.max(-1, Math.min(1, r.top / vh));
        var img = $(".place-panel__shape img", el); if (img) img.style.transform = "translateY(" + (-y * 9).toFixed(2) + "%)";
      });
    });
    window.addEventListener("scroll", stack, { passive: true });
    window.addEventListener("resize", stack);
    stack();
  }

  /* 4. Explore reveal: an SVG mask made from the country shape is blurred and re-thresholded
        each frame, so its outline swells from where it sits until the whole photo shows.
        900 ms in, 650 ms out; photo zooms 3 %; dark fade on the left; text turns white. */
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs, parent) { var n = doc.createElementNS(NS, name); for (var a in attrs) n.setAttribute(a, attrs[a]); if (parent) parent.appendChild(n); return n; }
  function buildReveal(card, i) {
    var shapeBox = $(".place-panel__shape", card), img = $("img", shapeBox);
    var m = (getComputedStyle(shapeBox).getPropertyValue("--shape") || "").match(/url\(["']?(.*?)["']?\)\s*$/);
    if (!m) return null;
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var cb = card.getBoundingClientRect(), sb = shapeBox.getBoundingClientRect(), sc = cb.width / cw || 1;
    var w = Math.min(sb.width, sb.height) / sc;
    var x = (sb.left - cb.left) / sc + (sb.width / sc - w) / 2, y = (sb.top - cb.top) / sc + (sb.height / sc - w) / 2;
    var old = $(".place-panel__reveal", card); if (old) old.remove();
    var svg = svgEl("svg", { "class": "place-panel__reveal", viewBox: "0 0 " + cw + " " + ch, preserveAspectRatio: "none", "aria-hidden": "true" });
    var defs = svgEl("defs", {}, svg);
    var f = svgEl("filter", { id: "pf" + i, filterUnits: "userSpaceOnUse", x: 0, y: 0, width: cw, height: ch, "color-interpolation-filters": "sRGB" }, defs);
    var blur = svgEl("feGaussianBlur", { stdDeviation: 2 }, f);
    var ct = svgEl("feComponentTransfer", {}, f);
    var fa = svgEl("feFuncA", { type: "linear", slope: 3.333, intercept: -1.167 }, ct);
    var mask = svgEl("mask", { id: "pm" + i, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: cw, height: ch, style: "mask-type:alpha" }, defs);
    svgEl("image", { href: m[1], x: x, y: y, width: w, height: w, filter: "url(#pf" + i + ")" }, mask);
    var lg = svgEl("linearGradient", { id: "pg" + i, x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    [[0, .75], [.45, .45], [1, .08]].forEach(function (s) { svgEl("stop", { offset: s[0], "stop-color": "currentColor", "stop-opacity": s[1] }, lg); });
    var g = svgEl("g", {}, svg);
    var photo = svgEl("image", { href: img.currentSrc || img.src, x: 0, y: -0.14 * ch, width: cw, height: 1.28 * ch, preserveAspectRatio: "xMidYMid slice", mask: "url(#pm" + i + ")" }, g);
    var solid = svgEl("image", { href: img.currentSrc || img.src, x: 0, y: -0.14 * ch, width: cw, height: 1.28 * ch, preserveAspectRatio: "xMidYMid slice", opacity: 0 }, g);
    var dark = svgEl("rect", { x: 0, y: 0, width: cw, height: ch, fill: "url(#pg" + i + ")", opacity: 0 }, svg);
    svg.style.color = getComputedStyle(card).getPropertyValue("--panel-reveal-shade");
    card.insertBefore(svg, $(".place-panel__dim", card));
    return { blur: blur, fa: fa, solid: solid, dark: dark, g: g, cx: x + w / 2, cy: y + w / 2, p: 0 };
  }
  var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;
  panels.forEach(function (card, i) {
    var btn = $(".place-panel__explore", card); if (!btn) return;
    var R = null, id = 0;
    function to(target, done) {
      if (!R || R.stale) { R = buildReveal(card, i); if (!R) { if (done) done(); return; } }
      var from = R.p, dur = reduce ? 0 : (target > from ? 900 : 650) * Math.abs(target - from), t0 = performance.now();
      var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
      cancelAnimationFrame(id);
      card.classList.toggle("is-open", target === 1);
      (function step(now) {
        var k = dur <= 0 ? 1 : Math.min(1, (now - t0) / dur), p = from + (target - from) * ease(k);
        R.p = p;
        var t = 0.5 * Math.pow(0.004 / 0.5, p), w = Math.max(t * 0.6, 0.002);
        R.blur.setAttribute("stdDeviation", (2 + 400 * p * p).toFixed(2));
        R.fa.setAttribute("slope", (1 / w).toFixed(3));
        R.fa.setAttribute("intercept", (-(t - w / 2) / w).toFixed(3));
        R.solid.setAttribute("opacity", Math.max(0, (p - .8) / .2).toFixed(3));
        R.dark.setAttribute("opacity", Math.max(0, (p - .25) / .75).toFixed(3));
        var z = 1 + 0.03 * p;
        R.g.setAttribute("transform", "translate(" + R.cx + " " + R.cy + ") scale(" + z.toFixed(4) + ") translate(" + (-R.cx) + " " + (-R.cy) + ")");
        if (k < 1) id = requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    if (noHover) {
      /* No hover on touch: play the reveal first, then go to the guide. */
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        to(1, function () { window.location.href = btn.href; });
      });
    } else {
      btn.addEventListener("mouseenter", function () { to(1); });
      btn.addEventListener("focus", function () { to(1); });
      btn.addEventListener("mouseleave", function () { to(0); });
      btn.addEventListener("blur", function () { to(0); });
    }
    window.addEventListener("resize", function () { if (R) R.stale = true; });
  });

  /* 5. Month map ------------------------------------------------------- */
  var mapSec = $("[data-month-map]");
  if (mapSec) {
    var data;
    try { data = JSON.parse($("#month-data").textContent); }
    catch (err) {
      var failed = $("[data-map-failed]", mapSec), mapBox = $(".month-map", mapSec);
      if (failed) failed.hidden = false;
      if (mapBox) mapBox.hidden = true;
      data = { places: {}, months: [] };
    }
    var map = $(".month-map", mapSec), land = $(".month-map__land", mapSec), layer = $(".month-map__marks", mapSec);
    var empty = $(".month-map__empty", mapSec);
    var view = { z: 1, cx: 50, cy: 50 }, steps = [1, 1.5, 2, 3, 4], month = new Date().getMonth();
    var marks = [];
    function place() {
      land.style.left = (50 - view.cx * view.z) + "%";
      land.style.top = (50 - view.cy * view.z) + "%";
      land.style.width = land.style.height = (100 * view.z) + "%";
      marks.forEach(function (m) {
        var sx = 50 + (m.x - view.cx) * view.z, sy = 50 + (m.y - view.cy) * view.z;
        var inView = sx >= 0 && sx <= 100 && sy >= 0 && sy <= 100;
        [m.dot, m.card].forEach(function (el) { el.style.left = sx + "%"; el.style.top = sy + "%"; el.hidden = !inView; });
      });
      map.classList.toggle("is-zoomed", view.z > 1);
      $("[data-zoom='in']", mapSec).disabled = view.z >= 4;
      $("[data-zoom='out']", mapSec).disabled = $("[data-zoom='reset']", mapSec).disabled = view.z <= 1;
    }
    function setView(z, cx, cy) { var h = 50 / z; view.z = z; view.cx = Math.max(h, Math.min(100 - h, cx)); view.cy = Math.max(h, Math.min(100 - h, cy)); place(); }
    function render() {
      var m = data.months[month] || { visited: [], plain: [] };
      $$("[data-month-name]", mapSec).forEach(function (el) { el.textContent = MONTHS[month]; });
      $$(".month-pill", mapSec).forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === month)); });
      layer.replaceChildren(); marks = [];
      m.visited.forEach(function (p) {
        var P = data.places[p.id];
        var dot = doc.createElement("span"); dot.className = "map-dot"; dot.setAttribute("aria-hidden", "true");
        var card = doc.createElement("a"); card.className = "map-card"; card.href = P.href; card.draggable = false;
        card.style.setProperty("--t", P.t);
        card.setAttribute("aria-label", "Open the " + P.name + " guide");
        card.innerHTML = '<img src="' + P.img + '" alt="" draggable="false"><span>' + P.name + "</span>";
        layer.appendChild(dot); layer.appendChild(card);
        marks.push({ x: P.x, y: P.y, dot: dot, card: card });
      });
      empty.hidden = m.visited.length > 0;
      $("[data-month-empty]", mapSec).textContent = "No guides for " + MONTHS[month] + " yet.";
      var visitedList = $("[data-list='visited']", mapSec), plainList = $("[data-list='plain']", mapSec);
      visitedList.innerHTML = m.visited.map(function (p) {
        var P = data.places[p.id];
        return '<li><a href="' + P.href + '"><span>' + P.name + '</span><span class="temp">' + (p.temp || "") + '<span class="icon icon--chevron-right" aria-hidden="true"></span></span></a></li>';
      }).join("") || '<li class="is-plain">[No guide this month yet]</li>';
      plainList.innerHTML = m.plain.map(function (p) {
        return '<li class="is-plain"><span>' + p.name + '</span><span class="temp">' + (p.temp || "") + "</span></li>";
      }).join("") || '<li class="is-plain">[Places for ' + MONTHS[month] + "]</li>";
      setView(1, 50, 50);
    }
    $$(".month-pill", mapSec).forEach(function (b, i) { b.addEventListener("click", function () { month = i; render(); }); });
    $("[data-zoom='in']", mapSec).addEventListener("click", function () { var i = steps.indexOf(view.z); setView(steps[Math.min(steps.length - 1, i + 1)], view.cx, view.cy); });
    $("[data-zoom='out']", mapSec).addEventListener("click", function () { var i = steps.indexOf(view.z); setView(steps[Math.max(0, i - 1)], view.cx, view.cy); });
    $("[data-zoom='reset']", mapSec).addEventListener("click", function () { setView(1, 50, 50); });
    var pan = null;
    map.addEventListener("pointerdown", function (e) {
      if (view.z === 1 || e.target.closest("button, a")) return;
      var r = map.getBoundingClientRect();
      pan = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, w: r.width, h: r.height };
      map.setPointerCapture(e.pointerId); map.classList.add("is-dragging");
    });
    map.addEventListener("pointermove", function (e) {
      if (!pan) return;
      setView(view.z, pan.cx - (e.clientX - pan.x) / pan.w * 100 / view.z, pan.cy - (e.clientY - pan.y) / pan.h * 100 / view.z);
    });
    ["pointerup", "pointercancel"].forEach(function (t) { map.addEventListener(t, function () { pan = null; map.classList.remove("is-dragging"); }); });
    var pills = $(".months", mapSec);
    render();
    var on = $(".month-pill[aria-pressed='true']", mapSec);
    if (on && pills) pills.scrollLeft = on.offsetLeft - pills.offsetLeft - 16;
  }

  /* 6. Contents list follows the section you are reading --------------- */
  var tocLinks = $$(".toc a");
  if (tocLinks.length) {
    var secs = tocLinks.map(function (a) { return doc.getElementById(a.hash.slice(1)); });
    var spy = raf(function () {
      var active = 0;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 160) active = i; });
      tocLinks.forEach(function (a, i) {
        if (i === active) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      });
      var row = $(".toc ol"); var cur = tocLinks[active];
      if (row && row.scrollWidth > row.clientWidth) row.scrollLeft = cur.offsetLeft - 16;
    });
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* 7. Island map: hovering a stop lights its pin and its legend row ---- */
  $$("[data-stop]").forEach(function (el) {
    var id = el.dataset.stop;
    function set(on) { $$("[data-stop='" + id + "']").forEach(function (x) { x.classList.toggle("is-on", on); }); }
    el.addEventListener("mouseenter", function () { set(true); });
    el.addEventListener("mouseleave", function () { set(false); });
  });

  /* 8. Places filters ---------------------------------------------------- */
  var grid = $("[data-place-grid]");
  if (grid) {
    var region = "all", best = -1;
    var cards = $$(".place-card", grid), count = $("[data-count]"), none = $("[data-empty]");
    var chips = $$("[data-region]"), select = $("#best-month");
    function apply() {
      var n = 0;
      cards.forEach(function (c) {
        var ok = (region === "all" || c.dataset.region === region) && (best < 0 || c.dataset.best.split(",").indexOf(String(best)) >= 0);
        c.hidden = !ok; if (ok) n++;
      });
      chips.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.region === region)); });
      count.textContent = n + (n === 1 ? " place" : " places") + (best >= 0 ? " good in " + MONTHS[best] : "");
      none.hidden = n > 0; grid.hidden = n === 0;
    }
    chips.forEach(function (b) { b.addEventListener("click", function () { region = b.dataset.region; apply(); }); });
    select.addEventListener("change", function () { best = Number(select.value); apply(); });
    $("[data-clear]").addEventListener("click", function () { region = "all"; best = -1; select.value = "-1"; apply(); });
    apply();
  }

  /* 9. Did you know? ------------------------------------------------------ */
  var game = $("[data-game]");
  if (game) {
    var facts = JSON.parse($("#fact-data").textContent);
    var disc = $(".wheel__disc", game), hub = $(".wheel__hub", game), status = $(".game__status", game);
    var wait = $(".fact-wait", game), card = $(".fact-card", game), soundBtn = $(".sound", game);
    var limit = game.dataset.dailyLimit !== "false";
    var TOPICS = ["Countries & cities", "Nature & sky", "Food & drinks", "Culture & traditions"];
    var TOPIC_CLASS = ["topic--cities", "topic--nature", "topic--food", "topic--culture"];
    var KEY = "dyk-last-spin", rot = 0, sound = false, last = -1, timer = 0, ctx = null;
    function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
    function saved() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
    function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
    function countdown() {
      var now = new Date(), mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var s = Math.max(0, Math.floor((mid - now) / 1000)), pad = function (n) { return String(n).padStart(2, "0"); };
      status.innerHTML = "Next spin in <b>" + pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60)) + ":" + pad(s % 60) + "</b>";
    }
    function lock() {
      hub.disabled = true; hub.textContent = "Done"; hub.setAttribute("aria-label", "Come back tomorrow for a new fact");
      clearInterval(timer); countdown(); timer = setInterval(countdown, 1000);
    }
    function chime() {
      if (!sound) return;
      try {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
        ctx = ctx || new C(); var t = ctx.currentTime;
        [659.25, 783.99, 1046.5].forEach(function (f, i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle"; o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t + i * .12);
          g.gain.exponentialRampToValueAtTime(0.18, t + i * .12 + .02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + i * .12 + .5);
          o.connect(g); g.connect(ctx.destination); o.start(t + i * .12); o.stop(t + i * .12 + .55);
        });
      } catch (e) {}
    }
    function confetti() {
      if (reduce) return;
      var box = doc.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
      var colours = getComputedStyle(game).getPropertyValue("--confetti").split(",");
      for (var i = 0; i < 44; i++) {
        var k = Math.random(), b = doc.createElement("i");
        b.style.left = (4 + (i * 37) % 92) + "%"; b.style.background = (colours[i % colours.length] || "").trim();
        b.style.animationDelay = (k * .5).toFixed(2) + "s";
        b.style.setProperty("--dx", Math.round((k - .5) * 220) + "px"); b.style.setProperty("--rot", Math.round(360 + k * 540) + "deg");
        box.appendChild(b);
      }
      game.appendChild(box); setTimeout(function () { box.remove(); }, 2600);
    }
    function show(idx, animate) {
      var f = facts[idx]; last = idx;
      wait.hidden = true; card.hidden = false;
      var chip = $(".topic-chip", card); chip.className = "topic-chip " + TOPIC_CLASS[f.topic]; chip.textContent = TOPICS[f.topic];
      $(".photo img", card).src = f.img; var lbl = $(".photo__label", card), drawn = /\.svg$/.test(f.img); lbl.textContent = drawn ? "[Photo: " + f.place + "]" : ""; lbl.hidden = !drawn;
      $(".fact-card__flag", card).innerHTML = f.flag || "";
      $(".fact-card__place", card).textContent = f.place;
      $(".fact-card__title", card).textContent = f.title;
      $(".fact-card__text", card).textContent = f.text;
      var guide = $(".fact-card__guide", card);
      guide.hidden = !f.guide; if (f.guide) { guide.href = f.guide; $("span", guide).textContent = "Read my " + f.guideName + " guide"; }
      $(".fact-card__toast", card).hidden = true;
      if (animate) { card.classList.remove("is-new"); void card.offsetWidth; card.classList.add("is-new"); }
    }
    hub.addEventListener("click", function () {
      if (hub.disabled) return;
      if (ctx && ctx.state === "suspended") ctx.resume();
      var slice = Math.floor(Math.random() * 8), topic = slice % 4;
      var pool = facts.map(function (f, i) { return i; }).filter(function (i) { return facts[i].topic === topic && i !== last; });
      var idx = pool[Math.floor(Math.random() * pool.length)];
      var delta = ((-slice * 45 - rot) % 360 + 360) % 360, dur = reduce ? 400 : 4600;
      rot += (reduce ? 0 : 360 * 6) + delta;
      disc.style.transition = "transform " + dur / 1000 + "s var(--motion-wheel-ease)";
      disc.style.transform = "rotate(" + rot + "deg)";
      hub.disabled = true; hub.textContent = "…"; status.textContent = "Spinning…";
      setTimeout(function () {
        show(idx, true); chime(); confetti();
        if (limit) { save({ day: today(), idx: idx, rot: rot }); lock(); }
        else { hub.disabled = false; hub.textContent = "Again"; status.textContent = "Today’s topic: " + TOPICS[topic]; }
        if (window.innerWidth < 1080) card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }, dur + 80);
    });
    soundBtn.addEventListener("click", function () {
      sound = !sound; soundBtn.setAttribute("aria-pressed", String(sound));
      $(".icon", soundBtn).className = "icon " + (sound ? "icon--sound" : "icon--sound-off");
    });
    $(".fact-card__share", card).addEventListener("click", function () {
      var f = facts[last]; if (!f) return;
      var text = "Did you know? " + f.text, toast = $(".fact-card__toast", card);
      function say(msg) { toast.textContent = msg; toast.hidden = false; setTimeout(function () { toast.hidden = true; }, 2500); }
      function copy() {
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { say("Link copied. Sharing didn’t open on this device, so the fact is ready to paste."); }, function () { say("Could not copy."); });
      }
      if (navigator.share) navigator.share({ title: "Did you know?", text: text }).catch(function (err) { if (!err || err.name !== "AbortError") copy(); });
      else { copy(); return; }
    });
    // Came back the same day: show today's fact and the countdown.
    var s = saved();
    if (limit && s && s.day === today() && facts[s.idx]) {
      rot = s.rot || 0; disc.style.transform = "rotate(" + rot + "deg)"; show(s.idx, false); lock();
    }
  }
})();

/* Error and empty states (DESIGN.md §6.6): offline bar, photo fallback, Armenian note */
(function () {
  // 05 · You're offline: show the bar while there is no connection
  var bar = document.querySelector("[data-offline-bar]");
  if (bar) {
    var syncOnline = function () { bar.hidden = navigator.onLine; };
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    syncOnline();
    var retry = bar.querySelector("button");
    if (retry) retry.addEventListener("click", function () { location.reload(); });
  }

  // 03 · Photo didn't load: keep the box and its corners, show the photo's description
  var failPhoto = function (img) {
    var box = img.parentElement;
    if (!box || box.classList.contains("photo-failed")) return;
    box.classList.add("photo-failed");
    var text = document.createElement("span");
    text.className = "photo-failed__text";
    text.textContent = img.alt || "";
    box.appendChild(text);
  };
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete && img.getAttribute("src") && img.naturalWidth === 0) failPhoto(img);
    else img.addEventListener("error", function () { failPhoto(img); });
  });

  // 04 · Not in Armenian yet: on a page marked <body data-en-only>, show .lang-note after switching to ՀՅ
  var note = document.querySelector(".lang-note");
  if (note && document.body.hasAttribute("data-en-only")) {
    var syncNote = function () { note.hidden = document.documentElement.lang !== "hy"; };
    document.querySelectorAll("[data-toggle-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setTimeout(syncNote, 0); });
    });
    syncNote();
  }
})();
