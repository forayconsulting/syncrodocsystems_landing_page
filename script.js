// SyncroDoc Systems — Landing Page Interactions

(function () {
  'use strict';

  // ---- Accordion expand/collapse ----
  document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
    var header = accordion.querySelector('.accordion-header');
    header.addEventListener('click', function () {
      var expanded = header.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-header').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
      });
      if (!expanded) header.setAttribute('aria-expanded', 'true');
    });
  });

  // ---- Login modal ----
  var loginBtn = document.getElementById('loginBtn');
  var requestAccessBtn = document.getElementById('requestAccessBtn');
  var modal = document.getElementById('loginModal');

  function openModal(e) { e.preventDefault(); modal.setAttribute('aria-hidden', 'false'); }
  function closeModal() { modal.setAttribute('aria-hidden', 'true'); }

  loginBtn.addEventListener('click', openModal);
  requestAccessBtn.addEventListener('click', openModal);
  modal.querySelectorAll('[data-close-modal]').forEach(function (el) { el.addEventListener('click', closeModal); });

  // ---- Screenshot lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');

  function closeLightbox() { lightbox.setAttribute('aria-hidden', 'true'); }

  document.querySelectorAll('[data-lightbox]').forEach(function (img) {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightbox.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.getAttribute('aria-hidden') === 'false') closeModal();
      if (lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
    }
  });

  // ---- Animated tagline counters ----
  //
  // Realistic pension fund document counts.
  //
  // Plan docs: 3-12. A fund manages a handful of governing documents.
  //   Rarely changes. Jumps only on a merger (acquiring another fund's plans).
  //
  // Amendments: 4-32. Each plan gets 1-3 SMMs per year. Steady accumulation.
  //
  // Minutes: 12-58. Board meets quarterly, committees meet 6-8x/year.
  //   ~10-12 new sets per year. Steady drip.
  //
  // Invoices: 6-40. 3-4 vendors billing quarterly = 12-16/year. Steady.
  //
  // Numbers plateau at realistic ceilings and stop. The effect is always:
  // cursor appears -> backspace old number -> pause -> type new number -> cursor disappears.

  var counters = {
    plans: {
      current: 0, el: null, ceiling: 11,
      // Plans barely move. Long gaps, +1 at a time, rare +2-3 merger jumps.
      getIncrement: function () {
        if (this.current >= this.ceiling) return 0;
        if (Math.random() < 0.15) return Math.random() < 0.3 ? 2 : 1;
        return 0; // Most ticks: no change
      },
      interval: function () { return 9000 + Math.random() * 6000; }
    },
    amendments: {
      current: 0, el: null, ceiling: 32,
      // Amendments tick up steadily. +1 most of the time, sometimes +2.
      getIncrement: function () {
        if (this.current >= this.ceiling) return 0;
        return Math.random() < 0.7 ? 1 : 2;
      },
      interval: function () { return 6000 + Math.random() * 5000; }
    },
    minutes: {
      current: 0, el: null, ceiling: 58,
      // Minutes accumulate fastest. +1 to +3 per tick.
      getIncrement: function () {
        if (this.current >= this.ceiling) return 0;
        var r = Math.random();
        if (r < 0.5) return 1;
        if (r < 0.85) return 2;
        return 3;
      },
      interval: function () { return 5000 + Math.random() * 4000; }
    },
    invoices: {
      current: 0, el: null, ceiling: 40,
      // Invoices tick up at a medium pace. +1, sometimes +2.
      getIncrement: function () {
        if (this.current >= this.ceiling) return 0;
        return Math.random() < 0.65 ? 1 : 2;
      },
      interval: function () { return 7000 + Math.random() * 5000; }
    }
  };

  // Backspace, pause, retype effect
  function backspaceAndRetype(el, newVal, callback) {
    var oldStr = el.textContent;
    var newStr = String(newVal);

    // Phase 1: show cursor, start backspacing
    el.classList.add('typing');
    var i = oldStr.length;

    function backspaceNext() {
      if (i <= 0) {
        // Phase 2: pause with blinking cursor on empty
        el.textContent = '';
        el.classList.remove('typing');
        el.classList.add('cursor-blink');
        var pause = 300 + Math.random() * 400;
        setTimeout(function () {
          // Phase 3: type new number
          el.classList.remove('cursor-blink');
          el.classList.add('typing');
          typeForward(0);
        }, pause);
        return;
      }
      i--;
      el.textContent = oldStr.substring(0, i);
      setTimeout(backspaceNext, 60 + Math.random() * 50);
    }

    function typeForward(j) {
      if (j >= newStr.length) {
        // Done, remove cursor
        el.classList.remove('typing');
        if (callback) callback();
        return;
      }
      el.textContent = newStr.substring(0, j + 1);
      setTimeout(function () { typeForward(j + 1); }, 80 + Math.random() * 60);
    }

    // Small delay before starting to backspace
    setTimeout(backspaceNext, 200);
  }

  // Type in initial number (no backspace needed)
  function typeInitial(el, val, callback) {
    var str = String(val);
    el.classList.add('typing');
    var j = 0;
    function next() {
      if (j >= str.length) {
        el.classList.remove('typing');
        if (callback) callback();
        return;
      }
      el.textContent = str.substring(0, j + 1);
      j++;
      setTimeout(next, 80 + Math.random() * 60);
    }
    next();
  }

  function tickCounter(type) {
    var c = counters[type];
    if (!c.el) return;

    var inc = c.getIncrement();

    if (inc === 0) {
      // No change this tick, try again later
      setTimeout(function () { tickCounter(type); }, c.interval());
      return;
    }

    var newVal = Math.min(c.current + inc, c.ceiling);
    c.current = newVal;

    backspaceAndRetype(c.el, newVal, function () {
      setTimeout(function () { tickCounter(type); }, c.interval());
    });
  }

  function initCounters() {
    document.querySelectorAll('.counter-word').forEach(function (word) {
      var type = word.dataset.type;
      if (counters[type]) {
        counters[type].el = word.querySelector('.counter-num');
      }
    });

    var types = ['plans', 'amendments', 'minutes', 'invoices'];
    var startVals = { plans: 3, amendments: 4, minutes: 12, invoices: 6 };
    var delays = [2500, 3800, 5200, 6500];

    types.forEach(function (type, i) {
      setTimeout(function () {
        var c = counters[type];
        if (!c.el) return;
        c.current = startVals[type];
        typeInitial(c.el, startVals[type], function () {
          // First update after a longer initial pause
          var firstPause = c.interval() + 2000 + Math.random() * 3000;
          setTimeout(function () { tickCounter(type); }, firstPause);
        });
      }, delays[i]);
    });
  }

  if (document.readyState === 'complete') {
    initCounters();
  } else {
    window.addEventListener('load', initCounters);
  }
})();
