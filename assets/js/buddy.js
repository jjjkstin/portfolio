// Smiley buddy: a small avatar that roams along the bottom of every page.
// Loaded site-wide via `footer_text` in _config.yml; styles live in _sass/_custom.scss.
(function () {
  "use strict";
  if (window.__smileyBuddy) return;
  window.__smileyBuddy = true;

  var ICON = "/portfolio/assets/img/favicon.svg";
  var STORAGE_KEY = "buddyHidden";
  var LINES = ["Hi! 👋", "Side quest?", "∞ things left to learn", "Check out Koread!", "Go Tigers! 🐯"];
  var SPEED = 60; // px per second
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // ---- Elements -----------------------------------------------------------
  var root = document.createElement("div");
  root.className = "buddy";

  var body = document.createElement("button");
  body.type = "button";
  body.className = "buddy-body";
  body.setAttribute("aria-label", "Say hi to the smiley buddy");
  body.innerHTML =
    '<span class="buddy-figure"><img src="' +
    ICON +
    '" alt="" width="44" height="44" draggable="false">' +
    '<span class="buddy-leg buddy-leg-l"></span><span class="buddy-leg buddy-leg-r"></span></span>';

  var bubble = document.createElement("span");
  bubble.className = "buddy-bubble";
  bubble.setAttribute("role", "status");

  var hideBtn = document.createElement("button");
  hideBtn.type = "button";
  hideBtn.className = "buddy-hide";
  hideBtn.setAttribute("aria-label", "Hide the smiley buddy");
  hideBtn.textContent = "×";

  root.appendChild(bubble);
  root.appendChild(body);
  root.appendChild(hideBtn);

  var restore = document.createElement("button");
  restore.type = "button";
  restore.className = "buddy-restore";
  restore.setAttribute("aria-label", "Bring back the smiley buddy");
  restore.title = "Bring back the smiley buddy";
  restore.innerHTML = '<img src="' + ICON + '" alt="" width="18" height="18">';

  // ---- Layout helpers -----------------------------------------------------
  function footerHeight() {
    var f = document.querySelector("footer.fixed-bottom");
    return f ? f.getBoundingClientRect().height : 0;
  }
  function placeVertically() {
    var b = Math.round(footerHeight()) + "px";
    root.style.bottom = b;
    restore.style.bottom = "calc(" + b + " + 8px)";
  }
  function width() {
    return root.offsetWidth || 44;
  }
  function maxX() {
    return Math.max(0, document.documentElement.clientWidth - width() - 8);
  }

  // ---- State --------------------------------------------------------------
  var x = 0;
  var target = 0;
  var facing = 1; // 1 = right, -1 = left
  var walking = false;
  var lastT = null;
  var rafId = null;
  var idleTimer = null;
  var bubbleTimer = null;

  function render() {
    root.style.transform = "translateX(" + Math.round(x) + "px)";
    body.style.setProperty("--buddy-facing", facing);
  }

  function setWalking(on) {
    walking = on;
    root.classList.toggle("is-walking", on);
  }

  function pickTarget() {
    var m = maxX();
    var next = 8 + Math.random() * (m - 8);
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
    if (Math.random() < 0.35) hop();
    idleTimer = setTimeout(pickTarget, 2000 + Math.random() * 4000);
  }

  function hop(big) {
    root.classList.remove("is-hopping", "is-jumping");
    void root.offsetWidth; // restart the animation
    root.classList.add(big ? "is-jumping" : "is-hopping");
  }
  root.addEventListener("animationend", function (e) {
    if (e.animationName === "buddy-hop" || e.animationName === "buddy-jump") root.classList.remove("is-hopping", "is-jumping");
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

  // ---- Interactions -------------------------------------------------------
  body.addEventListener("click", function () {
    var line = LINES[Math.floor(Math.random() * LINES.length)];
    if (line === bubble.textContent) line = LINES[(LINES.indexOf(line) + 1) % LINES.length];
    bubble.textContent = line;
    // keep the bubble on screen near the edges
    var mid = x + width() / 2;
    var vw = document.documentElement.clientWidth;
    root.classList.toggle("bubble-left", mid > vw - 110);
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
    placeVertically();
    var m = maxX();
    if (x > m) x = m;
    if (target > m) target = m;
    render();
  });

  // ---- Init ---------------------------------------------------------------
  function init() {
    document.body.appendChild(root);
    document.body.appendChild(restore);
    placeVertically();
    if (reduceMotion) {
      x = maxX();
      root.classList.add("is-still");
    } else {
      x = 8 + Math.random() * Math.max(0, maxX() - 8);
      facing = Math.random() < 0.5 ? -1 : 1;
    }
    render();
    if (storageGet()) {
      root.hidden = true;
      restore.hidden = false;
    } else {
      restore.hidden = true;
      start();
    }
    // footer height can change once fonts load
    window.addEventListener("load", placeVertically);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
