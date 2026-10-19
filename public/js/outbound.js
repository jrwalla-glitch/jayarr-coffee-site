// Outbound clicks to a merchant send one GA4 event, outbound_click, with only the merchant's host and this
// page's path: no query strings, tool inputs, search text or anything about the reader (Wave F r1, A7).
// A merchant link is an affiliate link (rel~="sponsored"), Amazon in its main regions, or one of the equipment
// makers and stores below, which the tools and articles link to for buying. A maker counts even when it's cited
// for a spec, since the reader lands in its store. BaseHead loads this only on jayarr.coffee, after gtag is set
// up, so no other host and no page up front pays for it. docs/MEASUREMENT.md has the plan. Plain JS from public/.
(function () {
  if (location.hostname !== 'jayarr.coffee' || typeof window.gtag !== 'function') return;
  var AMAZON = /^amazon\.(?:com|ca|co\.uk|de|fr|it|es|com\.au|co\.jp)$/;
  var MAKERS = [
    '1zpresso.coffee', 'acaia.co', 'aeropress.com', 'ascaso-usa.com', 'ascaso.com', 'atago.net', 'baratza.com',
    'behmor.com', 'bellmanespresso.com', 'bialetti.com', 'blackanddeckerappliances.com', 'breville.com',
    'cafeappliances.com', 'capresso.com', 'chemexcoffeemaker.com', 'cimbali.com', 'cleverbrewing.coffee',
    'clivecoffee.com', 'coffeesock.com', 'comandantegrinder.com', 'cosori.com', 'crateandbarrel.com',
    'cuisinart.com', 'decentespresso.com', 'delonghi.com', 'ecm.de', 'ember.com', 'espressoparts.com', 'espro.com',
    'etekcity.com', 'eureka.co.it', 'fellowproducts.com', 'flairespresso.com', 'gaggia-na.com', 'gaggia.com',
    'geappliances.com', 'global.hario.com', 'gourmia.com', 'hario-europe.com', 'hario-usa.com', 'hario.com',
    'harioaustralia.com.au', 'homeroastingsupplies.com', 'instantpot.com', 'kalita.co.jp', 'kalitausa.com',
    'kingrinder.com', 'kinugrinders.com', 'krupsusa.com', 'kruveinc.com', 'lamarzocco.com', 'lelit.com',
    'loveramics.com', 'nespresso.com', 'nichecoffee.co.uk', 'normcorewares.com', 'notneutral.com', 'oxo.com',
    'ozeri.com', 'profitec-espresso.com', 'puckpuck.me', 'ranciliogroup.com', 'ranciliogroupna.com',
    'rocket-espresso.com', 'seattlecoffeegear.com', 'shop.greatergoods.com', 'shopjura.com',
    'shoponline.melitta.com', 'slowpoursupply.co', 'steepshot.com', 'subminimal.com', 'timemore.cn',
    'timemore.com', 'toddycafe.com', 'turingrinders.com', 'us.jura.com', 'us.moccamaster.com', 'usa.philips.com',
    'wacaco.com', 'walmart.com', 'weberworkshops.com', 'webstaurantstore.com', 'wholelattelove.com',
    'williams-sonoma.com'
  ];
  function outbound(e) {
    if (e.type === 'auxclick' && e.button !== 1) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^https?:$/.test(u.protocol) || u.hostname === location.hostname) return;
    var host = u.hostname.replace(/^www\./, '');
    var sponsored = /(^|\s)sponsored(\s|$)/i.test(a.getAttribute('rel') || '');
    if (!sponsored && !AMAZON.test(host) && MAKERS.indexOf(host) < 0) return;
    window.gtag('event', 'outbound_click', { merchant_host: host, page_path: location.pathname });
  }
  document.addEventListener('click', outbound, true);
  document.addEventListener('auxclick', outbound, true);
})();
