<script lang="ts">
  import { onMount } from 'svelte';
  import { TOOLS, TOOL_GROUPS } from '../../data/tools.ts';
  import type { ToolGroup } from '../../data/tools.ts';
  import ToolMini from './art/ToolMini.svelte';
  import GalleryMini from './art/GalleryMini.svelte';
  import type { MiniId } from './art/ToolMini.svelte';
  import { decodeBrew } from '../../lib/coffee/share.ts';
  import { METHODS } from '../../lib/coffee/methods.ts';
  import { noteById } from '../../lib/coffee/flavors.ts';

  // The toolkit as a working bench: every tool is a card with a live miniature of what it draws,
  // grouped by the job you're doing. What you've saved on this device comes first, so you can
  // pick up where you left off. Every card is a plain link, so the bench works without JS.
  const GROUP_LINE: Record<ToolGroup, string> = {
    make: 'Set up a cup: the recipe, the grind, the water and the drink.',
    fix: 'When a cup tastes wrong: find the cause and the one change to try.',
    know: 'What\'s in your cup and your bag: caffeine through the day, and freshness from roast.',
    choose: 'Before you buy: a machine that fits how you drink, pods that fit your machine.',
    explore: 'The gallery: where coffee grows, how brewers differ and how to taste it.',
  };

  interface Resume { href: string; label: string; detail: string; tool: MiniId }
  let resume = $state<Resume[]>([]);
  let live = $state<string | null>(null);
  let seen = $state<Set<string>>(new Set());
  let touch = $state(false);
  let month = $state(10);
  const PIECE: Record<string, 'origins' | 'methods' | 'flavors'> = { origins: 'origins', methods: 'methods', flavors: 'flavors' };

  const pretty = (id: string) => id.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bC(\d+)\b/, 'C$1');
  const fmtDate = (iso: string) => { const d = new Date(`${iso}T12:00:00`); return Number.isNaN(d.valueOf()) ? null : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };

  onMount(() => {
    touch = matchMedia('(hover: none)').matches;
    month = new Date().getMonth() + 1;
    const out: Resume[] = [];
    const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
    try {
      const b = JSON.parse(get('jayarr-brew-guide-v1') ?? 'null');
      if (b?.last) {
        const d = decodeBrew(b.last);
        if (d.ok) {
          const m = METHODS.find((x) => x.id === d.value.method);
          const t = d.value.target as Record<string, number>;
          const amount = 'cupMl' in t ? `${Math.round(t.cupMl)} ml cup` : 'doseG' in t ? `${t.doseG} g of coffee` : `${t.waterG} g of water`;
          out.push({ href: `/tools/brew-ratio/?${b.last}`, label: 'Your last recipe', detail: `${m?.label ?? 'Brew'} · ${amount}${b.saved?.length ? ` · ${b.saved.length} saved` : ''}`, tool: 'brew' });
        }
      }
    } catch { /* ignore a damaged save */ }
    const fresh = get('jayarr-freshness-v1');
    if (fresh) { const q = new URLSearchParams(fresh); const r = q.get('roast'); const day = r && fmtDate(r); if (day) out.push({ href: `/tools/freshness/?${fresh}`, label: 'Your bag', detail: `Roasted ${day}`, tool: 'freshness' }); }
    const grinder = get('jayarr-grinder');
    if (grinder) out.push({ href: '/deep-brew/calibrator/', label: 'Your grinder', detail: pretty(grinder), tool: 'calibrator' });
    const line = get('jayarr-pods-machine');
    if (line === 'original' || line === 'vertuo') {
      let n = 0; try { n = (JSON.parse(get('jayarr-pods-flight') ?? '[]') as unknown[]).length; } catch { /* ignore */ }
      out.push({ href: `/tools/nespresso-pods/?line=${line}`, label: 'Your Nespresso', detail: `${line === 'vertuo' ? 'Vertuo' : 'Original'}${n ? ` · ${n} in your tasting flight` : ''}`, tool: 'pods' });
    }
    try {
      const card = JSON.parse(get('jayarr-tasting-card-v1') ?? 'null');
      const pins = (card?.current?.pins ?? []).map((p: string) => noteById(p)?.label).filter(Boolean);
      if (pins.length) out.push({ href: `/explore/flavors/?pins=${card.current.pins.join(',')}`, label: 'Your tasting card', detail: pins.join(', '), tool: 'flavors' });
    } catch { /* ignore */ }
    // The caffeine diary is health data: say it's there, never what's in it.
    if (get('jayarr-caffeine-log-v2')) out.push({ href: '/tools/caffeine/', label: 'Your caffeine day', detail: 'Kept on this device', tool: 'caffeine' });
    resume = out;

    // On touch screens there's no hover: each miniature plays once as it scrolls into view.
    if (touch && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        for (const e of es) if (e.isIntersecting) { const id = (e.target as HTMLElement).dataset.tool!; seen = new Set([...seen, id]); setTimeout(() => { seen = new Set([...seen].filter((x) => x !== id)); }, 5200); io.unobserve(e.target); }
      }, { threshold: 0.6 });
      document.querySelectorAll('.tcard[data-tool]').forEach((el) => io.observe(el));
      return () => io.disconnect();
    }
  });
</script>

<div class="bench">
  <nav class="jobs" aria-label="Jump to a job">
    <span class="lbl">What are you doing?</span>
    <ul>
      {#each TOOL_GROUPS as g (g.id)}<li><a href="#job-{g.id}">{g.label}</a></li>{/each}
    </ul>
  </nav>

  {#if resume.length}
    <section class="resume" aria-labelledby="resume-h">
      <h2 id="resume-h">Pick up where you left off</h2>
      <p class="quiet small">Saved on this device only.</p>
      <ul>
        {#each resume as r (r.label)}
          <li><a href={r.href}><span class="rmini"><ToolMini id={r.tool} /></span><span><b>{r.label}</b><span class="rd">{r.detail}</span></span></a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#each TOOL_GROUPS as g (g.id)}
    {@const tools = TOOLS.filter((t) => t.group === g.id)}
    <section class="group" class:gallery={g.id === 'explore'} id="job-{g.id}" aria-labelledby="job-h-{g.id}">
      <div class="ghead">
        <h2 id="job-h-{g.id}">{g.label}</h2>
        <p>{GROUP_LINE[g.id]}</p>
      </div>
      <ul class="cards">
        {#each tools as t (t.id)}
          <li>
            <a class="tcard" class:lit={live === t.id || seen.has(t.id)} href={t.href} data-tool={t.id}
              onmouseenter={() => (live = t.id)} onmouseleave={() => (live = null)} onfocus={() => (live = t.id)} onblur={() => (live = null)}>
              <span class="mini">{#if PIECE[t.id]}<GalleryMini id={PIECE[t.id]} month={month} names={false} />{:else}<ToolMini id={t.id as MiniId} live={live === t.id || seen.has(t.id)} />{/if}</span>
              <span class="tname">{t.name}{#if t.deepBrew}<span class="tag">Deep Brew</span>{/if}</span>
              <span class="tblurb">{t.blurb}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .bench { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema-deep: #8f5d22; color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; }
  .lbl { font: 500 11px/1.3 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }
  .jobs { display: flex; gap: 10px 14px; align-items: center; flex-wrap: wrap; margin: 4px 0 26px; }
  .jobs ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .jobs a { display: inline-block; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 16px; font: 500 15px 'IBM Plex Sans', sans-serif; color: var(--ink); text-decoration: none; }
  .jobs a:hover { border-color: var(--ink-3); background: #fffaf2; }

  .resume { background: #fbf8f3; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px 14px; margin-bottom: 30px; }
  .resume h2 { font: 400 28px/1.1 'Instrument Serif', Georgia, serif; margin: 0; }
  .resume p { margin: 2px 0 10px; }
  .resume ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; }
  .resume a { display: flex; gap: 12px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 8px 12px 8px 8px; text-decoration: none; color: var(--ink); }
  .resume a:hover { border-color: var(--ink-3); }
  .rmini { width: 72px; flex: none; }
  .rmini :global(svg) { width: 100%; height: auto; display: block; }
  .resume b { display: block; font: 600 15px 'IBM Plex Sans', sans-serif; }
  .rd { display: block; font-size: 13.5px; color: var(--ink-2); }

  .group { margin: 0 0 34px; scroll-margin-top: 90px; }
  .ghead { display: flex; align-items: baseline; gap: 6px 18px; flex-wrap: wrap; border-bottom: 1px solid var(--rule); padding-bottom: 8px; margin-bottom: 14px; }
  .ghead h2 { font: 400 34px/1.05 'Instrument Serif', Georgia, serif; margin: 0; }
  .ghead p { margin: 0; color: var(--ink-2); font-size: 15px; }
  .cards { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
  .tcard { display: grid; grid-template-rows: auto auto 1fr; gap: 4px; height: 100%; background: #fbf8f3; border: 1px solid var(--rule); border-radius: 16px; padding: 12px 14px 14px; text-decoration: none; color: var(--ink); box-shadow: 0 18px 30px -28px rgba(60, 35, 15, .45); transition: transform .25s cubic-bezier(.2, .7, .2, 1), border-color .2s, box-shadow .25s; }
  .tcard:hover, .tcard:focus-visible { transform: translateY(-3px); border-color: var(--ink-3); box-shadow: 0 22px 36px -26px rgba(60, 35, 15, .55); }
  .tcard:focus-visible { outline: 3px solid var(--crema-deep); outline-offset: 3px; }
  .mini { display: block; background: radial-gradient(120% 90% at 50% 0%, #fffdf9, #f4ece0); border-radius: 10px; padding: 4px 6px; margin-bottom: 6px; }
  .mini :global(svg) { width: 100%; height: auto; display: block; }
  .tname { font: 400 25px/1.1 'Instrument Serif', Georgia, serif; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
  .tag { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #efe6da; background: #2a2019; border-radius: 999px; padding: 3px 8px; }
  .tblurb { color: var(--ink-2); font-size: 15px; }
  /* The Explore pieces hang in the gallery: framed, with a brass edge. */
  .gallery .tcard { background: #f6efe4; border: 3px solid #2a2520; border-radius: 3px; box-shadow: inset 0 0 0 3px #f6efe4, inset 0 0 0 4px rgba(193, 122, 58, .6), 0 18px 30px -24px rgba(42, 29, 21, .55); }
  .gallery .mini { border-radius: 0; padding: 0; background: none; box-shadow: 0 0 0 1px rgba(42, 29, 21, .25); }

  @media (max-width: 640px) {
    .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .tcard { padding: 8px 9px 10px; border-radius: 12px; }
    .tname { font-size: 20px; }
    .tblurb { font-size: 13.5px; }
    .ghead h2 { font-size: 28px; }
    .resume ul { grid-template-columns: 1fr; }
    .jobs a { padding: 7px 12px; font-size: 14px; }
  }
  @media (prefers-reduced-motion: reduce) { .tcard { transition: none; } }
</style>
