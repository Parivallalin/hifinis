/* Light by default (owner 2026-11-21); dark only when the visitor picks it. Loaded in <head>, so
   the saved choice is on before the page draws (no dark flash). Adds the sun/moon button to the
   header nav of pages that have one. */
(function () {
  // The old GitHub copy (parivallalin.github.io/hifinis) keeps serving the files, so the app's
  // app.json and old links still load over https, but a person who opens a page there is sent to
  // the same page on hifinis.com, the real home (hosted on Cloudflare Pages since 2026-11-21).
  if (/\.github\.io$/i.test(location.hostname)) {
    var path = location.pathname.replace(/^\/hifinis(?=\/|$)/i, '') || '/';
    location.replace('https://hifinis.com' + path + location.search + location.hash);
    return;
  }
  var root = document.documentElement;
  // Opened from inside the app (?from=app): hide the tip/Support link for the whole visit, so the
  // Play build never leads anyone to an outside payment (Play payments policy).
  try {
    if (/[?&]from=app(&|$)/.test(location.search)) sessionStorage.setItem('hifinis-from-app', '1');
    if (sessionStorage.getItem('hifinis-from-app') === '1') {
      root.classList.add('from-app');
      var st = document.createElement('style');
      st.textContent = '.from-app a[href$="support.html"]{display:none!important}';
      document.head.appendChild(st);
    }
  } catch (e) {}
  var KEY = 'hifinis-theme';
  try { if (localStorage.getItem(KEY) === 'dark') root.setAttribute('data-theme', 'dark'); } catch (e) {}

  var MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><defs><linearGradient id="tg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fd2f5"/><stop offset="1" stop-color="#8b3dff"/></linearGradient></defs><path fill="url(#tg1)" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><defs><linearGradient id="tg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient></defs><circle cx="12" cy="12" r="4.6" fill="url(#tg2)"/><g stroke="url(#tg2)" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>';

  function isDark() { return root.getAttribute('data-theme') === 'dark'; }
  function paint(btn) {
    btn.innerHTML = isDark() ? SUN : MOON;
    btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = btn.getAttribute('aria-label');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark() ? '#0b0d14' : '#f7f7fb');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('header.top nav');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    btn.addEventListener('click', function () {
      if (isDark()) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem(KEY, isDark() ? 'dark' : 'light'); } catch (e) {}
      paint(btn);
    });
    paint(btn);
    nav.appendChild(btn);
  });
})();
