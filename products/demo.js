// Looping product demos. A page calls sdDemo(root, steps), where steps is a list of
// [delayBeforeMs, fn(root)]. The loop runs only while the demo is on screen. Under
// prefers-reduced-motion every step runs at once and the final state stays put.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sdDemo(root, steps, hold) {
    var initial = root.innerHTML, i = 0, timer = null, visible = false;
    hold = hold || 4500;
    if (reduce || !('IntersectionObserver' in window)) {
      steps.forEach(function (s) { s[1](root); });
      return;
    }
    function next() { return i < steps.length ? steps[i][0] : hold; }
    function schedule(ms) { if (!timer) timer = setTimeout(tick, ms); }
    function tick() {
      timer = null;
      if (!visible) return;
      if (i >= steps.length) { root.innerHTML = initial; i = 0; schedule(700); return; }
      steps[i][1](root);
      i++;
      schedule(next());
    }
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule(next());
      else { clearTimeout(timer); timer = null; }
    }, { threshold: 0.3 }).observe(root);
  }

  // Helpers shared by the demo scripts on each product page.
  sdDemo.on = function (root, sel) {
    root.querySelectorAll(sel).forEach(function (el) { el.classList.add('on'); });
  };
  sdDemo.text = function (root, sel, s) { var el = root.querySelector(sel); if (el) el.textContent = s; };
  // Count a number up into el. fmt turns the number into display text.
  sdDemo.count = function (root, sel, to, ms, fmt) {
    var el = root.querySelector(sel);
    fmt = fmt || function (n) { return String(n); };
    if (!el) return;
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = performance.now();
    (function frame(t) {
      var p = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1 && el.isConnected) requestAnimationFrame(frame);
    })(t0);
  };
  // Type s into el one character at a time.
  sdDemo.type = function (root, sel, s, ms) {
    var el = root.querySelector(sel), n = 0;
    if (!el) return;
    if (reduce) { el.textContent = s; return; }
    var iv = setInterval(function () {
      n++;
      el.textContent = s.slice(0, n);
      if (n >= s.length || !el.isConnected) clearInterval(iv);
    }, ms / s.length);
  };
  sdDemo.money = function (n) { return '$' + n.toLocaleString('en-US'); };

  window.sdDemo = sdDemo;
})();
