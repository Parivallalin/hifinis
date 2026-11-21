/* Hifinis motion helpers (owner 2026-11-21). Small, no libraries; does nothing for
   people who turn motion off, except the reading progress line and the contents highlight. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    // 1. Reading progress line.
    var bar = document.createElement('div');
    bar.className = 'hf-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function progress() {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h) : 0);
      ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
    progress();

    // 2. Contents list: highlight the section being read (guide + legal pages).
    var links = Array.prototype.slice.call(document.querySelectorAll('aside a[href^="#"]'));
    if (links.length && 'IntersectionObserver' in window) {
      var map = {};
      links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && map[e.target.id]) {
            links.forEach(function (a) { a.classList.remove('hf-on'); });
            map[e.target.id].classList.add('hf-on');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    }

    // Stars become separate spans so they can light one by one.
    document.querySelectorAll('.quote .stars').forEach(function (s) {
      s.innerHTML = s.textContent.trim().split('').map(function (c) { return '<span>' + c + '</span>'; }).join('');
    });
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.quote').forEach(function (q) { q.classList.add('in'); });
      return;
    }

    // 3. Reveals, staggered inside their group.
    var groups = [
      '.why li', '.feature .copy', '.feature .shot', '.feature ul.points li', '.grid .card', '.quotes .quote',
      'ol.steps li', 'details', '.paper h2', '.paper > p', '.formats span', 'main h2', 'main h3',
    ];
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.classList.contains('path')) e.target.classList.add('run');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    groups.forEach(function (sel) {
      var seen = new Map();
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest('.hero') || el.classList.contains('rv')) return;
        var parent = el.parentElement, n = seen.get(parent) || 0;
        seen.set(parent, n + 1);
        el.classList.add('rv');
        el.style.setProperty('--d', Math.min(n, 8) * 0.07 + 's');
        io.observe(el);
      });
    });
    document.querySelectorAll('.path').forEach(function (p) { io.observe(p); });

    // 4. Numbers count up when they come into view.
    var counter = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        counter.unobserve(e.target);
        var el = e.target, m = el.textContent.match(/^(\D*)(\d+)(.*)$/);
        if (!m) return;
        var to = +m[2], t0 = null, dur = 1100;
        function step(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          el.textContent = m[1] + v + m[3];
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stats b').forEach(function (b) { if (/\d/.test(b.textContent)) counter.observe(b); });

    // 5. Pointer effects (desktop only): screenshots tilt, cards glow where the pointer is.
    if (fine) {
      document.querySelectorAll('.feature .shot img, .hero .phone').forEach(function (el) {
        el.addEventListener('pointermove', function (ev) {
          var r = el.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
          el.style.transform = 'perspective(900px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 8) + 'deg)';
        });
        el.addEventListener('pointerleave', function () { el.style.transform = ''; });
      });
      document.querySelectorAll('.card').forEach(function (c) {
        c.addEventListener('pointermove', function (ev) {
          var r = c.getBoundingClientRect();
          c.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
          c.style.setProperty('--my', (ev.clientY - r.top) + 'px');
        });
      });
    }
  });
})();
