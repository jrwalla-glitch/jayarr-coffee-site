# Measurement on jayarr.coffee

What the site measures, what it deliberately doesn't, how to read the numbers given the bot traffic its sister sites see, and how to check that the events work. The code is in `src/components/BaseHead.astro` and `public/js/outbound.js`; the local checks are in `makeover-2026-10/tools/tool_wave_f_check.mjs`.

## What is measured

**Google Analytics 4** (`G-1N7FMBHFWV`), only when the page's hostname is exactly `jayarr.coffee`. Local builds, `*.vercel.app` previews and any other host load nothing from Google and send nothing.

- **Page views.** `page_location` is the page's origin and path with the query string removed. `page_referrer` also has its query string removed, so a link from a tool page (for example `/tools/brew-ratio/?method=espresso&dose=18`) doesn't carry its settings into analytics. gtag.js is loaded after the page's `load` event.
- **`outbound_click`**: one event when a reader clicks (or middle-clicks) a link to a merchant:
  - any link with `rel~="sponsored"` (today, the Amazon links); or
  - a link to Amazon (its main regional stores), or to a host on the `MAKERS` list in `public/js/outbound.js` (loaded only on `jayarr.coffee`): Nespresso and the equipment makers and stores the tools and articles link to (grinders, espresso machines, brewers, scales and kettles: Breville, Baratza, Fellow, Hario, Acaia, De'Longhi, Rancilio, Seattle Coffee Gear, Whole Latte Love and so on, 84 hosts). A maker counts even where an article cites it for a spec, because the reader lands in its store. Add a host there when a new buying link goes to a store that isn't on the list.

  It carries exactly two parameters:

  | Parameter | Example | Notes |
  |---|---|---|
  | `merchant_host` | `amazon.com`, `nespresso.com` | The link's hostname without `www.`. Never the path or query, so never the product, the Amazon search words or the affiliate tag. |
  | `page_path` | `/tools/nespresso-pods/` | The path of the page the click came from, without its query string. |

**Vercel Web Analytics**, loaded only on `jayarr.coffee` and `*.vercel.app` (the script exists only where Vercel serves the site). The site sends it no custom events. Per Vercel's privacy page, each page view can store the URL, the referrer, filtered query parameters, rough geolocation, device OS, browser and device type, with visitors told apart by a hash that's discarded after 24 hours and no cookies.

- **The address goes without its query string or hash.** Before the script loads, BaseHead registers a `beforeSend` hook through the queue Vercel documents for a plain script tag (`window.va('beforeSend', …)`, queued in `window.vaq`). It rewrites every event's `url` to the page's origin and path: `https://jayarr.coffee/tools/brew-ratio/?method=espresso&dose=18#steps` is sent as `https://jayarr.coffee/tools/brew-ratio/`. So a shared tool link's settings don't reach Vercel through the page address.
- **The referrer is a separate field, and `beforeSend` can't change it.** When a reader moves from one jayarr.coffee page to another, the browser's referrer is the previous page's full address, query string included, and Vercel can store it. So a tool's settings can still reach Vercel as the *next* page's referrer. Closing that needs a referrer policy that sends only the origin within the site (for example `<meta name="referrer" content="strict-origin">` in BaseHead). That also trims the internal referrers GA sees; it's a decision for John and hasn't been made.

## What isn't measured

- No query strings in the page addresses sent to GA (`page_location`, `page_referrer`) or to Vercel (`url`), or in `outbound_click`. Two exceptions remain until they're dealt with: the GA settings below, and Vercel's referrer field above.
- No tool inputs or results in anything the site's own code sends: no recipes, doses, roast dates, grinder choices, capsules, tasting notes or caffeine entries, and nothing about pregnancy.
- No site-search text.
- Nothing kept in the browser's local storage (saved recipes, the caffeine diary, the tasting card, the pod flight) ever leaves the device.
- No user IDs, emails or other personal data.
- No clicks on internal links, research sources (doi.org, the SCA, USDA and so on), roasters, sister sites or YouTube.
- Nothing from local or preview builds to GA, and nothing from local builds to Vercel.

## Required GA admin steps (John)

GA4's enhanced measurement runs inside gtag.js, outside the site's code, and three of its settings send full addresses. **Until they're off, query strings and tool settings do reach GA**, whatever the site's code strips. In GA Admin → Data streams → Web stream → Enhanced measurement:

1. **Page views → Show advanced settings → turn off "Page changes based on browser history events".** Every tool rewrites the address as it's used (`history.replaceState`, with its settings in the query string); with this on, GA can log those as extra page views with the full address.
2. **Turn off "Outbound clicks".** It sends its own `click` event with the full `link_url`, query string included (for Amazon, the search words and the tag). `outbound_click` replaces it.
3. **Turn off user-provided data collection** (Admin → Data collection and modification → Data collection). The site collects no such data and doesn't want GA trying to.

"Site search" reads search parameters from the address; the site's search doesn't put the query in the address, so it records nothing either way. This file can't see the property's settings: none of the three has been checked.

## Reading the numbers: bots

- **GA4 drops known bots and spiders automatically.** That exclusion can't be turned off, and GA doesn't say how much it removed. It catches declared crawlers, not headless browsers that run JavaScript and pretend to be people.
- **The sister sites show how much gets through.** In July 2026, jayarrbread.com's GA4 sessions were roughly 45–60% bots and jayarrchocolate.com's roughly a third, with raw search click-through rates distorted the same way. The signatures: `Android Webview` sessions with near-zero engagement and no conversions, `(not set)` and datacenter cities (Council Bluffs, Ashburn, The Dalles, Singapore), a few seconds per session, and far fewer scroll events than page views. jayarr.coffee should be assumed to be the same until shown otherwise.
- **So read these, not raw sessions or click-through rate:**
  - engaged sessions and engagement rate;
  - event counts, above all `outbound_click`, which a page-view bot doesn't fire;
  - `outbound_click` per engaged session for a page, rather than per session.
- **Compare with Vercel Web Analytics.** Two independent counters that disagree sharply on a page or a day point to bot traffic in one of them.
- **Segment before concluding.** Exclude `Android Webview`, `(not set)` geography and sub-10-second sessions before comparing pages or periods.

## Validating the events

1. On production, open `jayarr.coffee` with Google's Tag Assistant (tagassistant.google.com) connected, or with the Google Analytics Debugger extension on, so the hits show in **GA Admin → DebugView**. (A `debug_mode` parameter in the address won't work: the site strips query strings before GA sees them.)
2. Open the Nespresso Pods tool, pick a capsule and click **Buy from Nespresso**, then the **search Amazon** link.
3. DebugView should show two `outbound_click` events, with `merchant_host` `nespresso.com` and `amazon.com`, and `page_path` `/tools/nespresso-pods/`, and nothing else in their parameters.
4. A link to a source (a doi.org reference in an article) should send no event.
5. To report on the parameters, register `merchant_host` and `page_path` as event-scoped custom dimensions (**Admin → Custom definitions**). Until they're registered, GA keeps the events but doesn't show those parameters in standard reports.
6. In Vercel → the project → Analytics, open a tool page through a shared link (for example the Brew Guide with `?method=espresso&dose=18`); after a few minutes the page list should show `/tools/brew-ratio/` with no query parameters.

Locally, `tool_wave_f_check.mjs` asserts that on `127.0.0.1` a click on a sponsored link sends no request and creates no `dataLayer`, and that on a simulated `jayarr.coffee` the same click records exactly one `outbound_click` with the merchant host and the page path, while a source link and an internal link record nothing. A stand-in for Vercel's script runs the page's `beforeSend` and checks that the page view's `url` has no query string or hash; nothing is sent to Vercel from a local run.

## What the events can and can't attribute

**They can:**
- count merchant clicks per merchant and per page, so you can see which tools and articles send readers to buy;
- compare pages and periods by clicks per engaged session.

**They can't:**
- see purchases or revenue. Amazon Associates reports orders and earnings on its own, for the one tag `jayarrcoffee-20`, with no page attached. Nespresso links aren't affiliate links and earn nothing.
- tell which product was clicked: by design the event has no URL or product.
- see clicks that don't fire JavaScript events: right-click → "Open in new tab", copied links, or readers whose content blocker stops gtag.js. Treat the counts as a floor.
- separate humans from bots that run JavaScript and click. That is rare for outbound links, but it is why the counts are read alongside engagement.
