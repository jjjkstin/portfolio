// Pixel tiger buddy: a tiny tiger that walks along the line under the navbar.
// Loaded site-wide via `footer_text` in _config.yml; styles live in _sass/_custom.scss.
(function () {
  "use strict";
  if (window.__tigerBuddy) return;
  window.__tigerBuddy = true;

  var STORAGE_KEY = "buddyHidden";
  var LINES = ["Rawr! 🐯", "Hi there! 👋", "Side quest?", "∞ things left to learn", "Check out Koread!", "Go Tigers!"];
  var SPEED = 40; // px per second
  var PX = 2; // screen pixels per art pixel
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Pixel art (16x11, facing right) --------------------------------------
  var COLORS = { O: "#F28C28", K: "#1E1E1E", W: "#FFF3DC", E: "#1E1E1E", P: "#E8707A" };
  var BODY = [
    "..........K...K.",
    "..........OO.OO.",
    "K.........OKOKOO",
    "O.........OOOOEO",
    "OO..OKOOKOOOOWWP",
    ".OOOOKOOKOOOOWW.",
    "..OOOKOOKOOOOOO.",
    "..OOOOOOOOOOOO..",
    "...WWWWWWWWWW...",
  ];
  var LEGS_A = ["..OO...OO.OO....", "..KK...KK..KK..."];
  var LEGS_B = ["...OO.OO...OO...", "...KK.KK...KK..."];

  function svg(rows, cls) {
    var rects = "";
    rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = COLORS[row[x]];
        if (c) rects += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + c + '"/>';
      }
    });
    return (
      '<svg class="' +
      cls +
      '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      rows[0].length +
      " " +
      rows.length +
      '" width="' +
      rows[0].length * PX +
      '" height="' +
      rows.length * PX +
      '" shape-rendering="crispEdges" aria-hidden="true">' +
      rects +
      "</svg>"
    );
  }
  var FRAME_A = svg(BODY.concat(LEGS_A), "tiger-frame tiger-frame-a");
  var FRAME_B = svg(BODY.concat(LEGS_B), "tiger-frame tiger-frame-b");
  var FACE = svg(["K...K", "OO.OO", "OKOKO", "OOOEO", "OOWWP", "OOWW.", "OOOO."], "tiger-face");

  function storageGet() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }
  function storageSet(v) {
    try {
      if (v) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  var nav = document.getElementById("navbar") || document.querySelector("nav.navbar");
  if (!nav) return;

  // ---- Elements -------------------------------------------------------------
  var root = document.createElement("div");
  root.className = "tiger";

  var body = document.createElement("button");
  body.type = "button";
  body.className = "tiger-body";
  body.setAttribute("aria-label", "Say hi to the tiger");
  body.innerHTML = '<span class="tiger-sprite">' + FRAME_A + FRAME_B + "</span>";

  var bubble = document.createElement("span");
  bubble.className = "tiger-bubble";
  bubble.setAttribute("role", "status");

  var hideBtn = document.createElement("button");
  hideBtn.type = "button";
  hideBtn.className = "tiger-hide";
  hideBtn.setAttribute("aria-label", "Hide the tiger");
  hideBtn.textContent = "×";

  root.appendChild(body);
  root.appendChild(hideBtn);
  root.appendChild(bubble);

  var restore = document.createElement("button");
  restore.type = "button";
  restore.className = "tiger-restore";
  restore.setAttribute("aria-label", "Bring back the tiger");
  restore.title = "Bring back the tiger";
  restore.innerHTML = FACE;

  // ---- State ----------------------------------------------------------------
  var W = 16 * PX;
  var x = 0;
  var target = 0;
  var facing = 1;
  var walking = false;
  var lastT = null;
  var rafId = null;
  var idleTimer = null;
  var bubbleTimer = null;

  function maxX() {
    return Math.max(0, nav.clientWidth - W - 8);
  }
  function render() {
    root.style.transform = "translateX(" + Math.round(x) + "px)";
    body.style.setProperty("--tiger-facing", facing);
  }
  function setWalking(on) {
    walking = on;
    root.classList.toggle("is-walking", on);
  }

  function pickTarget() {
    var m = maxX();
    var next = 8 + Math.random() * Math.max(0, m - 8);
    if (Math.abs(next - x) < 80) next = x > m / 2 ? Math.max(8, x - 160) : Math.min(m, x + 160);
    target = next;
    facing = target >= x ? 1 : -1;
    setWalking(true);
    lastT = null;
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  function step(t) {
    rafId = null;
    if (!walking) return;
    if (lastT === null) lastT = t;
    var dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;
    var dir = target >= x ? 1 : -1;
    x += dir * SPEED * dt;
    if ((dir > 0 && x >= target) || (dir < 0 && x <= target)) {
      x = target;
      render();
      arrive();
      return;
    }
    render();
    rafId = requestAnimationFrame(step);
  }

  function arrive() {
    setWalking(false);
    if (Math.random() < 0.3) hop();
    idleTimer = setTimeout(pickTarget, 2500 + Math.random() * 5000);
  }

  function hop(big) {
    root.classList.remove("is-hopping", "is-jumping");
    void root.offsetWidth;
    root.classList.add(big ? "is-jumping" : "is-hopping");
  }
  root.addEventListener("animationend", function (e) {
    if (e.animationName === "tiger-hop" || e.animationName === "tiger-jump") root.classList.remove("is-hopping", "is-jumping");
  });

  function stop() {
    setWalking(false);
    clearTimeout(idleTimer);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }
  function start() {
    stop();
    if (reduceMotion) return;
    idleTimer = setTimeout(pickTarget, 1200);
  }

  // ---- Interactions ---------------------------------------------------------
  body.addEventListener("click", function () {
    var line = LINES[Math.floor(Math.random() * LINES.length)];
    if (line === bubble.textContent) line = LINES[(LINES.indexOf(line) + 1) % LINES.length];
    bubble.textContent = line;
    var mid = x + W / 2;
    root.classList.toggle("bubble-left", mid > nav.clientWidth - 110);
    root.classList.toggle("bubble-right", mid < 110);
    root.classList.add("is-talking");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      root.classList.remove("is-talking");
    }, 2200);
    if (!reduceMotion) hop(true);
  });

  function hide() {
    stop();
    root.classList.remove("is-talking");
    root.hidden = true;
    restore.hidden = false;
    storageSet(true);
    restore.focus();
  }
  function show() {
    root.hidden = false;
    restore.hidden = true;
    storageSet(false);
    x = Math.min(x, maxX());
    render();
    start();
  }
  hideBtn.addEventListener("click", hide);
  restore.addEventListener("click", show);

  document.addEventListener("visibilitychange", function () {
    if (root.hidden) return;
    if (document.hidden) stop();
    else start();
  });
  window.addEventListener("resize", function () {
    var m = maxX();
    if (x > m) x = m;
    if (target > m) target = m;
    render();
  });

  // ---- Init -----------------------------------------------------------------
  nav.appendChild(root);
  nav.appendChild(restore);
  x = reduceMotion ? maxX() : 8 + Math.random() * Math.max(0, maxX() - 8);
  facing = reduceMotion ? -1 : Math.random() < 0.5 ? -1 : 1;
  render();
  if (storageGet()) {
    root.hidden = true;
    restore.hidden = false;
  } else {
    restore.hidden = true;
    start();
  }
})();
