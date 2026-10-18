<script lang="ts">
  import { onMount } from 'svelte';
  import { TOOLS, TOOL_GROUPS } from '../../data/tools.ts';
  import type { ToolGroup } from '../../data/tools.ts';
  import ToolMini from './art/ToolMini.svelte';
  import GalleryMini from './art/GalleryMini.svelte';
  import type { MiniId } from './art/ToolMini.svelte';
  import { decodeBrew } from '../../lib/coffee/share.ts';
  import { buildRecipe } from '../../lib/coffee/brew.ts';
  import { freshness } from '../../lib/coffee/freshness.ts';
  import type { FreshUse, Storage } from '../../lib/coffee/freshness.ts';
  import { METHODS } from '../../lib/coffee/methods.ts';
  import { noteById } from '../../lib/coffee/flavors.ts';

  // The toolkit as a working bench: every tool is a card with a live miniature of what it draws,
  // grouped by the job you're doing. What you've saved on this device comes first, with its answer,
  // so you can pick up where you left off. Every card is a plain link, so the bench works without JS.
  const GROUP_LINE: Record<ToolGroup, string> = {
    make: 'Set up a cup: the recipe, the grind, the water and the drink.',
    fix: 'Why a cup tastes wrong, and what to change.',
    know: 'What\'s in your cup and your bag.',
    choose: 'Before you buy: a machine, and pods that fit it.',
    explore: 'The gallery: where coffee grows, how brewers differ and how to taste it.',
  };
  const TRIO: ToolGroup[] = ['fix', 'know', 'choose'];

  type Icon = 'brew' | 'bag' | 'dial' | 'pod' | 'flower' | 'night';
  interface Resume { href: string; label: string; detail: string; icon: Icon }
  // A figure and its unit (and "day 15") never split across lines.
  const keep = (t: string) => t.replace(/(\d) (g|ml|oz|mg)\b/g, '$1\u00a0$2').replace(/\b(g|ml|oz) (coffee|water)\b/g, '$1\u00a0$2').replace(/\b(day|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep) (\d)/g, '$1\u00a0$2');
  let resume = $state<Resume[]>([]);
  let live = $state<string | null>(null);
  let seen = $state<Set<string>>(new Set());
  let month = $state(10);
  const PIECE: Record<string, 'origins' | 'methods' | 'flavors'> = { origins: 'origins', methods: 'methods', flavors: 'flavors' };

  const pretty = (id: string) => id.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bC(\d+)\b/, 'C$1');
  const fmtDate = (iso: string) => { const d = new Date(`${iso}T12:00:00`); return Number.isNaN(d.valueOf()) ? null : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
  const g1 = (x: number) => (Math.round(x * 10) / 10).toLocaleString('en-US');
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  onMount(() => {
    month = new Date().getMonth() + 1;
    const out: Resume[] = [];
    const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
    try {
      const b = JSON.parse(get('jayarr-brew-guide-v1') ?? 'null');
      if (b?.last) {
        const d = decodeBrew(b.last);
        const r = d.ok ? buildRecipe(d.value) : null;
        if (d.ok && r?.ok) {
          const m = METHODS.find((x) => x.id === d.value.method);
          const rc = r.value;
          const amounts = rc.yieldG ? `${g1(rc.doseG)} g in, ${g1(rc.yieldG)} g out` : `${g1(rc.doseG)} g coffee, ${Math.round(rc.waterG ?? 0)} g water`;
          out.push({ href: `/tools/brew-ratio/?${b.last}`, label: 'Your last recipe', detail: `${m?.label ?? 'Brew'}: ${amounts}`, icon: 'brew' });
        }
      }
    } catch { /* ignore a damaged save */ }
    const fresh = get('jayarr-freshness-v1');
    if (fresh) {
      const q = new URLSearchParams(fresh); const roast = q.get('roast'); const day = roast && fmtDate(roast);
      if (roast && day) {
        const use = (q.get('use') === 'espresso' ? 'espresso' : 'filter') as FreshUse;
        const st = q.get('storage'); const storage = (st === 'sealed-bag' || st === 'frozen' ? st : 'opened') as Storage;
        const f = storage === 'frozen' ? null : freshness({ roastDate: roast, today: todayIso(), use, storage });
        const where = f?.ok ? ` · day ${f.value.daysSinceRoast}, ${f.value.stage.label.toLowerCase()}` : '';
        // A date the tool itself rejects (one in the future) is flagged, not quoted as a reading.
        if (roast > todayIso()) out.push({ href: `/tools/freshness/?${fresh}`, label: 'Your bag', detail: `Roasted ${day}? That date is in the future`, icon: 'bag' });
        else if (!f || f.ok) out.push({ href: `/tools/freshness/?${fresh}`, label: 'Your bag', detail: `Roasted ${day}${where}`, icon: 'bag' });
      }
    }
    const grinder = get('jayarr-grinder');
    if (grinder) out.push({ href: `/deep-brew/calibrator/?grinder=${encodeURIComponent(grinder)}`, label: 'Your grinder', detail: pretty(grinder), icon: 'dial' });
    const line = get('jayarr-pods-machine');
    if (line === 'original' || line === 'vertuo') {
      let n = 0; try { n = (JSON.parse(get('jayarr-pods-flight') ?? '[]') as unknown[]).length; } catch { /* ignore */ }
      out.push({ href: `/tools/nespresso-pods/?line=${line}`, label: 'Your Nespresso', detail: `${line === 'vertuo' ? 'Vertuo' : 'Original'}${n ? ` · ${n} in your tasting flight` : ' machine'}`, icon: 'pod' });
    }
    try {
      const card = JSON.parse(get('jayarr-tasting-card-v1') ?? 'null');
      const pins = (card?.current?.pins ?? []).map((p: string) => noteById(p)?.label).filter(Boolean);
      // No pins in the link: the Bloom reopens your own card, bag notes included, from this device.
      if (pins.length) out.push({ href: '/explore/flavors/', label: 'Your tasting card', detail: pins.join(', '), icon: 'flower' });
    } catch { /* ignore */ }
    // The caffeine diary is health data: say it's there, never what's in it.
    if (get('jayarr-caffeine-log-v2')) out.push({ href: '/tools/caffeine/', label: 'Your caffeine day', detail: 'Kept on this device', icon: 'night' });
    resume = out;

    // On touch screens there's no hover: each miniature plays once as it scrolls into view.
    if (matchMedia('(hover: none)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        for (const e of es) if (e.isIntersecting) { const id = (e.target as HTMLElement).dataset.tool!; seen = new Set([...seen, id]); setTimeout(() => { seen = new Set([...seen].filter((x) => x !== id)); }, 5200); io.unobserve(e.target); }
      }, { threshold: 0.6 });
      document.querySelectorAll('.tcard[data-tool]').forEach((el) => io.observe(el));
      return () => io.disconnect();
    }
  });
</script>

<!-- Icon-sized drawings for the saved strip: one line weight, no text. -->
{#snippet icon(k: Icon)}
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <g fill="none" stroke="#2a1d15" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
      {#if k === 'brew'}
        <path d="M10 8 H30 L23.5 18 H16.5 Z" /><path d="M14 22 H26 V29 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4 -4 Z" fill="#c3873a" fill-opacity=".35" />
        <path d="M26 24 h2 a3 3 0 0 1 0 6 h-2" /><path d="M20 18 V21" stroke="#3f8fa0" />
      {:else if k === 'bag'}
        <path d="M12 13 L13.5 33 H26.5 L28 13 Z" fill="#c3873a" fill-opacity=".25" /><path d="M12 13 L15 8 H25 L28 13" /><circle cx="20" cy="21" r="2.6" />
      {:else if k === 'dial'}
        <circle cx="20" cy="21" r="11" /><path d="M20 21 L25 15" stroke="#c3873a" stroke-width="2" />
        {#each [-120, -60, 0, 60, 120] as a (a)}<path d="M{20 + Math.sin((a * Math.PI) / 180) * 8.5} {21 - Math.cos((a * Math.PI) / 180) * 8.5} L{20 + Math.sin((a * Math.PI) / 180) * 11} {21 - Math.cos((a * Math.PI) / 180) * 11}" />{/each}
        <path d="M18 6 h4 l-2 3 Z" fill="#2a1d15" />
      {:else if k === 'pod'}
        <ellipse cx="20" cy="12" rx="10" ry="3" /><path d="M10 12 L13 27 Q20 33 27 27 L30 12" fill="#7a5a8c" fill-opacity=".35" />
      {:else if k === 'flower'}
        {#each [0, 72, 144, 216, 288] as a (a)}<ellipse cx="20" cy="12" rx="4.6" ry="7" transform="rotate({a} 20 19)" fill={['#c1666b', '#9a7bb0', '#d9a441', '#8aa05a', '#b06a3b'][a / 72]} fill-opacity=".45" />{/each}
        <circle cx="20" cy="19" r="3" fill="#f6f1e8" />
      {:else}
        <path d="M11 18 H25 V26 a5 5 0 0 1 -5 5 H16 a5 5 0 0 1 -5 -5 Z" fill="#c3873a" fill-opacity=".3" /><path d="M25 20 h2 a3 3 0 0 1 0 6 h-2" />
        <path d="M31 6 a5 5 0 1 0 4 8 a4 4 0 1 1 -4 -8 Z" fill="#2a1d15" stroke="none" />
      {/if}
    </g>
  </svg>
{/snippet}

{#snippet card(t: (typeof TOOLS)[number], feature = false)}
  <a class="tcard" class:feature class:lit={live === t.id || seen.has(t.id)} href={t.href} data-tool={t.id}
    onmouseenter={() => (live = t.id)} onmouseleave={() => (live = null)} onfocus={() => (live = t.id)} onblur={() => (live = null)}>
    <span class="mini"><span class="art" aria-hidden="true"><ToolMini id={t.id as MiniId} live={live === t.id || seen.has(t.id)} /></span>{#if t.deepBrew}<span class="tag">Deep Brew</span>{/if}</span>
    <span class="tname">{t.name}</span>
    <span class="tblurb">{t.blurb}</span>
  </a>
{/snippet}

{#snippet ghead(g: { id: ToolGroup; label: string })}
  <div class="ghead">
    <h2 id="job-h-{g.id}">{g.label}</h2>
    <p>{GROUP_LINE[g.id]}</p>
  </div>
{/snippet}

<div class="bench">
  <nav class="jobs" aria-label="Jump to a job">
    <span class="lbl">What are you doing?</span>
    <ul>
      {#each TOOL_GROUPS as g (g.id)}<li><a href="#job-{g.id}">{g.label}</a></li>{/each}
    </ul>
  </nav>

  {#if resume.length}
    <section class="resume" aria-labelledby="resume-h">
      <div class="rhead"><h2 id="resume-h">Pick up where you left off</h2><p class="quiet small">Saved on this device only.</p></div>
      <ul>
        {#each resume as r (r.label)}
          <li><a href={r.href}><span class="ricon">{@render icon(r.icon)}</span><span class="rtext"><b>{r.label}</b><span class="rd">{keep(r.detail)}</span></span><span class="rgo" aria-hidden="true">→</span></a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#each TOOL_GROUPS.filter((g) => g.id === 'make') as g (g.id)}
    <section class="group" id="job-{g.id}" aria-labelledby="job-h-{g.id}">
      {@render ghead(g)}
      <ul class="cards make">
        {#each TOOLS.filter((t) => t.group === g.id) as t, i (t.id)}<li class:feature={i === 0}>{@render card(t, i === 0)}</li>{/each}
      </ul>
    </section>
  {/each}

  <div class="trio">
    {#each TRIO.map((id) => TOOL_GROUPS.find((g) => g.id === id)!) as g (g.id)}
      <section class="group" id="job-{g.id}" aria-labelledby="job-h-{g.id}">
        {@render ghead(g)}
        <ul class="cards stack">
          {#each TOOLS.filter((t) => t.group === g.id) as t (t.id)}<li>{@render card(t)}</li>{/each}
        </ul>
      </section>
    {/each}
  </div>

  {#each TOOL_GROUPS.filter((g) => g.id === 'explore') as g (g.id)}
    <section class="group gallery" id="job-{g.id}" aria-labelledby="job-h-{g.id}">
      {@render ghead(g)}
      <ul class="pieces">
        {#each TOOLS.filter((t) => t.group === g.id) as t (t.id)}
          <li>
            <a class="tcard piece" class:lit={live === t.id || seen.has(t.id)} href={t.href} data-tool={t.id}
              onmouseenter={() => (live = t.id)} onmouseleave={() => (live = null)} onfocus={() => (live = t.id)} onblur={() => (live = null)}>
              <span class="gp-frame pframe" style="--mat: #efe7d8; --matpad: 10px; --matpad-phone: 6px"><GalleryMini id={PIECE[t.id]} month={month} names={false} /></span>
              <span class="gp-plaque"><b>{t.name}</b></span>
              <span class="tblurb">{t.blurb}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .bench { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema-deep: #8f5d22; color: var(--ink); font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; }
  .lbl { font: 500 11px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-2); }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }
  .jobs { display: flex; gap: 10px 14px; align-items: center; flex-wrap: wrap; margin: 4px 0 26px; }
  .jobs ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .jobs a { display: inline-block; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 16px; font: 500 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink); text-decoration: none; }
  .jobs a:hover { border-color: var(--ink-3); background: #fffaf2; }

  .resume { background: #fbf8f3; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px; margin-bottom: 34px; }
  .rhead { display: flex; align-items: baseline; gap: 4px 14px; flex-wrap: wrap; margin-bottom: 12px; }
  .resume h2 { font: 400 28px/1.1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0; }
  .resume p { margin: 0; }
  .resume ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 10px; }
  .resume li { display: flex; }
  .resume a { flex: 1; display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 12px; align-items: start; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 10px 14px 10px 10px; text-decoration: none; color: var(--ink); min-height: 66px; }
  .resume a:hover, .resume a:focus-visible { border-color: var(--ink-3); background: #fffaf2; }
  .ricon { width: 44px; height: 44px; border-radius: 50%; background: #f4ece0; display: grid; place-items: center; align-self: center; }
  .ricon svg { width: 34px; height: 34px; }
  .resume b { display: block; font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .rd { display: block; font: 500 12.5px/1.45 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-2); text-wrap: pretty; }
  .rgo { font-size: 18px; color: var(--crema-deep); transition: transform .2s; align-self: center; }
  .resume a:hover .rgo { transform: translateX(3px); }

  .group { margin: 0 0 40px; scroll-margin-top: 90px; }
  .ghead { display: flex; align-items: baseline; gap: 4px 18px; flex-wrap: wrap; border-bottom: 1px solid var(--rule); padding-bottom: 8px; margin-bottom: 14px; }
  .ghead h2 { font: 400 34px/1.05 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0; }
  .ghead p { margin: 0; color: var(--ink-2); font-size: 15px; }
  .cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
  .cards li { display: flex; }
  /* Make a cup: the Brew Guide is where most cups start, so it gets the big card. */
  .cards.make { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .cards.make li.feature { grid-column: span 2; grid-row: span 2; }
  .trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 22px; }
  .trio .ghead { display: block; }
  .trio .ghead p { margin-top: 4px; }
  .cards.stack { grid-template-columns: 1fr; }

  .tcard { flex: 1; display: flex; flex-direction: column; gap: 4px; background: #fbf8f3; border: 1px solid var(--rule); border-radius: 16px; padding: 12px 14px 14px; text-decoration: none; color: var(--ink); box-shadow: 0 18px 30px -28px rgba(60, 35, 15, .45); transition: transform .25s cubic-bezier(.2, .7, .2, 1), border-color .2s, box-shadow .25s; }
  .tcard:hover, .tcard:focus-visible { transform: translateY(-3px); border-color: var(--ink-3); box-shadow: 0 22px 36px -26px rgba(60, 35, 15, .55); }
  .tcard:focus-visible { outline: 3px solid var(--crema-deep); outline-offset: 3px; }
  .mini { position: relative; display: block; background: radial-gradient(120% 90% at 50% 0%, #fffdf9, #f4ece0); border-radius: 10px; padding: 4px 6px; margin-bottom: 6px; }
  .mini :global(svg) { width: 100%; height: auto; display: block; }
  .art { display: contents; }
  .feature .mini { flex: 1; display: flex; align-items: center; padding: 10px 18px; }
  .tag { position: absolute; top: 8px; right: 8px; font: 500 10px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: #efe6da; background: #2a2019; border-radius: 999px; padding: 3px 8px; }
  .tname { font: 400 25px/1.1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; }
  .feature .tname { font-size: 34px; }
  .tblurb { color: var(--ink-2); font-size: 15px; }
  .feature .tblurb { font-size: 16px; }

  /* The Explore pieces hang as framed pictures, each with a brass plaque and a line beneath. */
  .pieces { list-style: none; margin: 0; padding: 6px 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
  .pieces li { display: flex; }
  .tcard.piece { background: none; border: 0; border-radius: 0; box-shadow: none; padding: 0; align-items: center; text-align: center; gap: 0; }
  .tcard.piece:hover, .tcard.piece:focus-visible { box-shadow: none; }
  .pframe { display: block; width: 100%; }
  .pframe::after { display: none; }
  .pframe :global(svg) { display: block; width: 100%; height: auto; }
  .piece .gp-plaque { margin-top: 12px; padding: 5px 18px; }
  .piece .gp-plaque b { font-size: 17px; }
  .piece .tblurb { margin-top: 8px; font-size: 14.5px; max-width: 30ch; text-wrap: balance; }

  @media (max-width: 1000px) {
    .trio { grid-template-columns: 1fr; }
    .cards.stack { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cards.make { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cards.make li.feature { grid-row: auto; }
  }
  @media (max-width: 640px) {
    .cards { gap: 10px; }
    .tcard { padding: 8px 9px 10px; border-radius: 12px; }
    .tname { font-size: 20px; }
    .feature .tname { font-size: 26px; }
    .tblurb { font-size: 13.5px; }
    /* On a narrow card the badge would sit on the drawing: it sits in a strip under it, and every
       card keeps that strip, so the names in a row still line up. */
    .mini { padding-bottom: 22px; }
    .tag { top: auto; right: auto; bottom: 5px; left: 6px; font-size: 9px; padding: 2px 6px; }
    .ghead h2 { font-size: 28px; }
    .resume { padding: 14px 12px; }
    .resume ul { grid-template-columns: 1fr; }
    .jobs a { padding: 7px 12px; font-size: 14px; }
    /* One picture across the top, two beneath. */
    .pieces { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 14px; }
    .pieces li:first-child { grid-column: span 2; }
    .pieces li:first-child .pframe { max-width: 420px; }
    .piece .gp-plaque b { font-size: 15px; }
    .piece .tblurb { font-size: 13.5px; }
  }
  @media (prefers-reduced-motion: reduce) { .tcard, .rgo { transition: none; } }
</style>
