// The site search dialog's behaviour (Wave F r1, A1). Search.astro holds the markup and a small inline opener
// that loads this file the first time a reader reaches for search, so no page carries it up front.
// While open, the rest of the page is inert and Tab stays inside; Escape, the close button and the backdrop
// close it and return focus to whatever opened it. If Pagefind can't load or a search throws, the results
// area says so and links the article and tool indexes. Plain JS, served as is from public/.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var overlay = $('search-overlay'), backdrop = $('search-backdrop'), input = $('search-input');
  var results = $('search-results'), status = $('search-status'), closeBtn = $('search-close');
  if (!overlay || !input || !results) return;

  var pagefind = null, opener = null, madeInert = [], seq = 0, timer;
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  // Which part of the site a result is from, as the pages' own kickers name it.
  var kind = function (u) { return /^\/tools\//.test(u) ? 'Tool' : /^\/deep-brew\//.test(u) ? 'Deep Brew' : /^\/explore\//.test(u) ? 'Explore' : /^\/blog\//.test(u) ? 'Article' : 'Page'; };

  function announce(text) {
    if (!status) return;
    status.textContent = '';
    setTimeout(function () { status.textContent = text; }, 50);
  }
  function initPagefind() {
    if (!pagefind) {
      pagefind = import('/pagefind/pagefind.js').then(function (pf) { return Promise.resolve(pf.init && pf.init()).then(function () { return pf; }); });
      // A failed load can be tried again on the next search.
      pagefind.catch(function () { pagefind = null; });
    }
    return pagefind;
  }
  function showFailure() {
    results.innerHTML = '<div class="so-msg so-fail"><p class="so-msg-h">Search couldn’t load.</p>'
      + '<p>Try reloading the page. Meanwhile, every article is on the <a href="/blog/">blog index</a> and every tool on the <a href="/tools/">tools page</a>.</p></div>';
    announce('Search couldn’t load. Try reloading the page.');
  }
  var isOpen = function () { return !overlay.hidden; };
  function focusables() {
    return Array.prototype.filter.call(overlay.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])'), function (el) {
      return !el.disabled && el.getClientRects().length > 0;
    });
  }

  function open(from) {
    if (isOpen()) return;
    opener = from || document.activeElement;
    // The dialog sits directly in <body>, so everything else can be made inert while it's open.
    if (overlay.parentElement !== document.body) document.body.appendChild(overlay);
    madeInert = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === overlay || el.inert || el.tagName === 'SCRIPT') return;
      el.inert = true;
      madeInert.push(el);
    });
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    input.focus();
    initPagefind().catch(showFailure);
  }
  function close() {
    if (!isOpen()) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    madeInert.forEach(function (el) { el.inert = false; });
    madeInert = [];
    clearTimeout(timer);
    seq++;
    input.value = '';
    results.innerHTML = '';
    if (status) status.textContent = '';
    var back = opener;
    opener = null;
    if (back && back.isConnected && typeof back.focus === 'function' && back !== document.body) back.focus();
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  // Escape and Tab act only while search is open; the opener in Search.astro handles Cmd/Ctrl+K.
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'Tab') {
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1], inside = overlay.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    }
  }, true);

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var query = input.value.trim(), mine = ++seq;
      if (!query) { results.innerHTML = ''; if (status) status.textContent = ''; return; }
      initPagefind()
        .then(function (pf) { return pf.search(query); })
        .then(function (search) { return Promise.all(search.results.slice(0, 8).map(function (r) { return r.data(); })); })
        .then(function (items) {
          if (mine !== seq) return;
          if (items.length === 0) {
            results.innerHTML = '<div class="so-msg"><p>No results found. Try a brewer, a drink or an origin.</p></div>';
            announce('No results');
            return;
          }
          results.innerHTML = items.map(function (item) {
            return '<a class="so-hit" href="' + esc(item.url) + '"><span class="so-kind">' + kind(item.url) + '</span>'
              + '<span class="so-title">' + esc(item.meta && item.meta.title ? item.meta.title : 'Untitled') + '</span>'
              // Pagefind's excerpt is escaped by Pagefind, with <mark> around the matches.
              + '<span class="so-excerpt">' + item.excerpt + '</span></a>';
          }).join('');
          announce(items.length === 1 ? '1 result' : items.length + ' results');
        })
        .catch(function () { if (mine === seq) showFailure(); });
    }, 200);
  });

  window.jaSearch = { open: open, close: close, toggle: function (from) { return isOpen() ? close() : open(from); } };
})();
