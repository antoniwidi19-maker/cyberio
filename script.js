/* ==========================================================
   Digital Citizen — script.js
   ========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Reading progress & hero parallax ---------- */
  var bar = document.getElementById('progress');
  var parallax = document.getElementById('parallax');

  function onScroll() {
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    if (bar) bar.style.transform = 'scaleX(' + (h.scrollTop / max) + ')';

    if (parallax && !reduceMotion.matches) {
      parallax.style.transform = 'translate3d(0,' + (window.scrollY * 0.25) + 'px,0)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .flow').forEach(function (el) {
    revealIO.observe(el);
  });

  /* ---------- Active nav highlighting ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('nav a'));
  var sectionIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('section[id]').forEach(function (s) {
    sectionIO.observe(s);
  });

  /* ---------- Tabs (Section 7 submateri) ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('aria-controls');

      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', String(t === tab));
      });
      document.querySelectorAll('.panel').forEach(function (panel) {
        panel.hidden = panel.id !== target;
      });
    });
  });
})();
