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

  var pagefind = null, opener = null, madeInert = [], seq = 0, timer, run = null;
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
      // Ranking (Wave F r2): where the words sit (titles and tool names weigh 10, the deck 3, headings by level)
      // counts, not how often "coffee" or "water" recurs in a long page; and an exact word beats a longer one
      // it starts ("coffee" over "CoffeeSock"). Chosen on queries with known answers (the post-pass polish report).
      pagefind = import('/pagefind/pagefind.js').then(function (pf) {
        return Promise.resolve(pf.options && pf.options({ ranking: { termFrequency: 0, pageLength: 0, termSaturation: 1.4, termSimilarity: 3 } }))
          .then(function () { return pf.init && pf.init(); }).then(function () { return pf; });
      });
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
    run = null;
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

  // ── Which results count, and in what order (Wave F r2) ──
  // Words are compared without case or accents, and without the punctuation around them.
  var fold = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var norm = function (s) { return fold(s).replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ''); };
  // When a word isn't in the index, Pagefind falls back to the longest prefix it has, so "zzqxv" matched every
  // "Z." initial and "espreso" every "ESP". A word of the query is really matched by a word that starts with
  // it, or that shares enough of its start to be a stem or a near miss ("brewing" and "brew", "studies" and
  // "study"); a one- or two-letter fallback doesn't count.
  function near(t, w) {
    if (!w) return false;
    if (w.indexOf(t) === 0) return true;
    var need = t.length <= 3 ? t.length : Math.max(3, Math.min(t.length - 2, 4)), i = 0;
    while (i < t.length && i < w.length && t[i] === w[i]) i++;
    return i >= need;
  }
  var hits = function (t, word) { var w = norm(word); return near(t, w) || w.split(/[-/–—.]/).some(function (p) { return near(t, norm(p)); }); };
  // A result counts when every word of the query is really matched somewhere on the page. Without match
  // positions (not a Pagefind result) there's nothing to judge by, so it stays.
  function realMatch(item, terms) {
    if (!item.locations || item.content == null) return true;
    var words = String(item.content).split(/\s+/), found = item.locations.map(function (l) { return words[l]; });
    return terms.every(function (t) { return found.some(function (w) { return w && hits(t, w); }); });
  }
  // A page whose title (or, for a tool, its name) says what was typed comes first: the whole query as a phrase,
  // then every word of it; then the rest, in Pagefind's order.
  var flat = function (s) { return fold(s).replace(/[^a-z0-9]+/g, ' ').trim(); };
  function tier(item, terms, phrase) {
    var m = item.meta || {}, name = flat((m.title || '') + ' ' + (m.name || ''));
    if (phrase && (' ' + name + ' ').indexOf(' ' + phrase + ' ') >= 0) return 0;
    var words = name.split(' ');
    return terms.every(function (t) { return words.some(function (w) { return hits(t, w); }); }) ? 1 : 2;
  }

  // Eight at a time; "Show more results" adds the next eight. The first 24 Pagefind results are read up front,
  // so a title match ranked a little lower by Pagefind can still come first.
  var PAGE = 8, FIRST = 24;
  function hitHtml(item) {
    return '<a class="so-hit" href="' + esc(item.url) + '"><span class="so-kind">' + kind(item.url) + '</span>'
      + '<span class="so-title">' + esc(item.meta && item.meta.title ? item.meta.title : 'Untitled') + '</span>'
      // Pagefind's excerpt is escaped by Pagefind, with <mark> around the matches.
      + '<span class="so-excerpt">' + item.excerpt + '</span></a>';
  }
  // The next `count` Pagefind results, read, with the fallback-only ones dropped.
  function readNext(r, count) {
    var batch = r.all.slice(r.next, r.next + count);
    r.next += batch.length;
    return Promise.all(batch.map(function (x) { return x.data(); })).then(function (items) {
      return items.filter(function (it) { return realMatch(it, r.terms); });
    });
  }
  // Moves results from the waiting list to the shown list until `want` are shown, reading more as needed.
  function fill(r, want) {
    while (r.waiting.length && r.shown.length < want) r.shown.push(r.waiting.shift());
    if (r.shown.length >= want || r.next >= r.all.length) return Promise.resolve(r);
    return readNext(r, PAGE).then(function (got) { r.waiting = r.waiting.concat(got); return fill(r, want); });
  }
  function render(r, focusFrom) {
    if (r.shown.length === 0) {
      results.innerHTML = '<div class="so-msg"><p>No results found. Try a brewer, a drink or an origin.</p></div>';
      announce('No results');
      return;
    }
    var more = r.waiting.length > 0 || r.next < r.all.length;
    results.innerHTML = r.shown.map(hitHtml).join('') + (more ? '<button type="button" class="so-more">Show more results</button>' : '');
    var btn = results.querySelector('.so-more');
    if (btn) btn.addEventListener('click', function () { showMore(r); });
    // After "Show more", focus goes to the first new result, so the keyboard carries on where the list grew.
    if (focusFrom != null) { var all = results.querySelectorAll('a.so-hit'), to = all[focusFrom] || btn || all[all.length - 1]; if (to) to.focus(); }
    announce(r.shown.length === 1 ? '1 result' : r.shown.length + ' results');
  }
  function showMore(r) {
    if (r !== run) return;
    var from = r.shown.length, btn = results.querySelector('.so-more');
    if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
    fill(r, from + PAGE).then(function () { if (r === run) render(r, from); }).catch(function () { if (r === run) showFailure(); });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var query = input.value.trim(), mine = ++seq;
      run = null;
      if (!query) { results.innerHTML = ''; if (status) status.textContent = ''; return; }
      var terms = query.split(/\s+/).map(norm).filter(Boolean), phrase = flat(query);
      initPagefind()
        .then(function (pf) {
          // Pagefind loads only the index chunk the typed word falls in, so a word whose shorter forms sit in the
          // chunk before it loses those matches: fresh, "recipes" found 16 pages, not the 150 that say "recipe".
          // Loading the chunks for the word less its last one to three letters first gets them all back.
          if (!pf.preload) return pf.search(query);
          var pre = [];
          terms.forEach(function (t) { for (var n = Math.max(3, t.length - 3); n < t.length; n++) pre.push(t.slice(0, n)); });
          return Promise.all(pre.map(function (x) { return pf.preload(x); })).then(function () { return pf.search(query); });
        })
        .then(function (search) {
          if (mine !== seq) return null;
          var r = { all: search.results, next: 0, shown: [], waiting: [], terms: terms };
          run = r;
          return readNext(r, FIRST).then(function (got) {
            // A stable sort by tier: Pagefind's order is kept within each.
            r.waiting = got.map(function (it, i) { return { it: it, t: tier(it, terms, phrase), i: i }; })
              .sort(function (a, b) { return a.t - b.t || a.i - b.i; }).map(function (x) { return x.it; });
            return fill(r, PAGE);
          });
        })
        .then(function (r) { if (r && mine === seq && r === run) render(r, null); })
        .catch(function () { if (mine === seq) showFailure(); });
    }, 200);
  });

  window.jaSearch = { open: open, close: close, toggle: function (from) { return isOpen() ? close() : open(from); } };
})();
