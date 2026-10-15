<script lang="ts">
  import { onMount } from 'svelte';
  import ExtractionMap from './ExtractionMap.svelte';
  import { METHODS, SYMPTOMS, ZONES, nextQuestion, questionsFor, diagnose, methodById } from '../../lib/coffee/index.ts';
  import type { MethodId, SymptomId, ZoneId, QuestionId } from '../../lib/coffee/index.ts';

  // Taste "waveforms": shape is the taste, weight is the intensity (kept from the original tool).
  const WAVE: Record<SymptomId, { d: string; w: number }> = {
    sour: { d: 'M0 10 L5 3 L10 17 L15 3 L20 17 L25 3 L30 17 L35 3 L40 10', w: 1.6 },
    bitter: { d: 'M0 10 Q10 0 20 10 Q30 20 40 10', w: 3 },
    weak: { d: 'M0 10 Q10 8 20 10 Q30 12 40 10', w: 1 },
    'harsh-mixed': { d: 'M0 10 L4 4 L8 16 L13 5 L17 15 L22 3 L26 17 L31 6 L35 14 L40 10', w: 1.8 },
    flat: { d: 'M0 10 L40 10', w: 1.4 },
    muddy: { d: 'M0 10 Q5 15 10 10 T20 10 T30 10 T40 10', w: 3.4 },
    gushing: { d: 'M0 4 L40 16', w: 1.6 },
    choking: { d: 'M0 10 L12 10 M18 10 L22 10 M28 10 L30 10', w: 2.6 },
    strong: { d: 'M0 10 Q10 -2 20 10 Q30 22 40 10', w: 4 },
    bright: { d: 'M0 12 Q5 4 10 12 Q15 4 20 12 Q25 4 30 12 Q35 4 40 12', w: 1.6 },
    off: { d: 'M0 10 L8 10 L12 4 L16 16 L20 10 L40 10', w: 1.6 },
  };
  const ZONE_XY = (z: ZoneId) => {
    const [e, s] = z.split('-');
    return { x: e === 'under' ? 1 / 6 : e === 'over' ? 5 / 6 : 0.5, y: s === 'weak' ? 1 / 6 : s === 'strong' ? 5 / 6 : 0.5 };
  };
  const GUESS: Record<SymptomId, ZoneId> = { sour: 'under-ideal', bitter: 'over-ideal', weak: 'ideal-weak', 'harsh-mixed': 'under-strong', flat: 'ideal-weak', muddy: 'over-strong', gushing: 'under-weak', choking: 'over-strong', strong: 'ideal-strong', bright: 'ideal-ideal', off: 'ideal-ideal' };
  const TOOL_LINK: Record<string, { href: string; label: string }> = {
    'grind-guide': { href: '/tools/grind-guide/', label: 'See what the grind should look like' },
    freshness: { href: '/tools/freshness/', label: 'Check how fresh your beans are' },
    water: { href: '/deep-brew/water/', label: 'Find a water recipe' },
  };

  let method = $state<MethodId | null>(null);
  let symptom = $state<SymptomId | null>(null);
  let answers = $state<Partial<Record<QuestionId, string>>>({});
  let mounted = $state(false);

  let isEsp = $derived(method === 'espresso');
  let symptoms = $derived(SYMPTOMS.filter((s) => (isEsp ? s.espresso : s.filter)));
  let dstate = $derived(method && symptom ? { method, symptom, answers } : null);
  let qs = $derived(dstate ? questionsFor(dstate) : []);
  let current = $derived(dstate ? nextQuestion(dstate) : null);
  let result = $derived(dstate && !current ? diagnose(dstate) : null);
  let dx = $derived(result && result.ok ? result.value : null);
  let zone = $derived<ZoneId>(dx ? dx.zone : symptom ? GUESS[symptom] : 'ideal-ideal');
  let pos = $derived(ZONE_XY(zone));
  let answeredCount = $derived(qs.filter((q) => answers[q.id] !== undefined).length);
  let step = $derived(!method ? 'method' : !symptom ? 'symptom' : current ? 'questions' : 'result');
  let brewLink = $derived.by(() => {
    if (!dx || !method) return null;
    const q = new URLSearchParams({ method });
    if (method === 'espresso' || method === 'moka') q.set('dose', method === 'espresso' ? '18' : '15'); else q.set('cup', method === 'cold-brew' || method === 'drip-machine' ? '946' : method === 'aeropress' ? '237' : '355');
    if (dx.next.strength) q.set('strength', dx.next.strength);
    // The roast travels too, so the Brew Guide's temperature starts from the same coffee.
    if (answers.roast === 'light' || answers.roast === 'dark') q.set('roast', answers.roast);
    const adj = dx.next.grind ?? dx.next.temp;
    if (adj) q.set('adjust', adj);
    return `/tools/brew-ratio/?${q}`;
  });

  function pickMethod(id: MethodId) { method = id; if (symptom && !SYMPTOMS.find((s) => s.id === symptom && (id === 'espresso' ? s.espresso : s.filter))) symptom = null; answers = {}; }
  function pickSymptom(id: SymptomId) { symptom = id; answers = {}; }
  function answer(qid: QuestionId, v: string) { answers = { ...answers, [qid]: v }; }
  function back() {
    if (step === 'result' || (step === 'questions' && answeredCount > 0)) {
      const last = [...qs].reverse().find((q) => answers[q.id] !== undefined);
      if (last) { const { [last.id]: _drop, ...rest } = answers; answers = rest; return; }
    }
    if (symptom) { symptom = null; answers = {}; return; }
    method = null;
  }
  function restart() { method = null; symptom = null; answers = {}; }

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const m = q.get('method') as MethodId | null, s = q.get('symptom') as SymptomId | null;
    if (m && methodById(m)) {
      method = m;
      if (s && SYMPTOMS.some((x) => x.id === s && (m === 'espresso' ? x.espresso : x.filter))) {
        symptom = s;
        const a: Partial<Record<QuestionId, string>> = {};
        for (const qq of questionsFor({ method: m, symptom: s, answers: {} })) { const v = q.get(qq.id); if (v && qq.options.some((o) => o.id === v)) a[qq.id] = v; }
        answers = a;
      }
    }
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (method) q.set('method', method);
    if (symptom) q.set('symptom', symptom);
    for (const [k, v] of Object.entries(answers)) if (v) q.set(k, v);
    const qs2 = q.toString();
    history.replaceState(history.state, '', qs2 ? `${location.pathname}?${qs2}` : location.pathname);
  });

  let copied = $state(false);
  async function share() { try { await navigator.clipboard.writeText(location.href); copied = true; setTimeout(() => (copied = false), 2200); } catch { prompt('Copy this link:', location.href); } }
  let panelEl = $state<HTMLElement | null>(null);
  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  $effect(() => { void step; void answeredCount; if (!mounted) return; queueMicrotask(() => panelEl?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true })); });
</script>

<div class="dr">
  <div class="stage">
    <ExtractionMap x={pos.x} y={pos.y} {zone} showArrow={step === 'result' && dx?.placement === 'likely'} empty={dx?.placement === 'other'} emptyText="not an extraction problem" uncertain={dx?.placement === 'uncertain'} label={dx?.placement === 'other' ? `Not placed on the extraction map: ${dx.placementNote}` : dx?.placement === 'uncertain' ? `Your cup's position is uncertain: ${dx.placementNote}` : `By taste, your cup probably sits in the ${ZONES[zone].label.toLowerCase()} zone.`} />
    <p class="mini-axes" aria-hidden="true">sour ← extraction → bitter · weak ↓ strength ↑ strong</p>
    <div class="zone">
      {#if symptom && dx && dx.placement !== 'likely'}
        <span class="lbl">{dx.placement === 'other' ? 'Not an extraction problem' : 'Position uncertain'}</span>
        <p class="zl small">{dx.placementNote}</p>
        <p class="zt">{dx.placement === 'other' ? 'Grind, time and ratio won\'t fix this one; the change below will.' : 'Taste and time can\'t place this one precisely, so the dot is a best guess.'}</p>
      {:else if symptom}
        <span class="lbl">{step === 'result' ? 'Your cup, probably' : 'Probably'}</span>
        <p class="zl">{ZONES[zone].label}</p>
        <p class="zt">{ZONES[zone].tastes}</p>
      {:else}
        <span class="lbl">The extraction map</span>
        <p class="zt">Sour cups sit to the left, bitter to the right; weak at the bottom, strong at the top. Tell us what's wrong and we'll place yours.</p>
      {/if}
    </div>
  </div>

  <div class="panel" bind:this={panelEl}>
    {#if step !== 'method'}
      <nav class="crumbs" aria-label="Your answers">
        <button type="button" class="back" onclick={back}>← Back</button>
        <span>{methodById(method!)?.label}</span>{#if symptom}<span>· {SYMPTOMS.find((s) => s.id === symptom)?.label}</span>{/if}
        {#if step === 'questions'}<span class="count">Question {answeredCount + 1} of {qs.length}</span>{/if}
      </nav>
    {/if}

    {#if step === 'method'}
      <h3 tabindex="-1">How did you brew it?</h3>
      <div class="grid3">
        {#each METHODS as m (m.id)}<button type="button" class="opt" onclick={() => pickMethod(m.id)}>{m.label}</button>{/each}
      </div>
    {:else if step === 'symptom'}
      <h3 tabindex="-1">What's wrong with it?</h3>
      <div class="sym">
        {#each symptoms as s (s.id)}
          <button type="button" class="card" onclick={() => pickSymptom(s.id)}>
            <svg viewBox="0 0 40 20" aria-hidden="true"><path d={WAVE[s.id].d} fill="none" stroke="currentColor" stroke-width={WAVE[s.id].w} stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="name">{s.label}</span><span class="tag">{s.tagline}</span>
          </button>
        {/each}
      </div>
    {:else if step === 'questions' && current}
      <h3 tabindex="-1">{current.text}</h3>
      <div class="opts">
        {#each current.options as o (o.id)}<button type="button" class="opt wide" onclick={() => answer(current!.id, o.id)}>{o.label}</button>{/each}
      </div>
    {:else if step === 'result' && dx}
      <p class="kick">Diagnosis</p>
      <h3 tabindex="-1" class="cause">{dx.cause}</h3>
      <p class="why">{dx.why}</p>
      <div class="rx">
        <div class="now"><span class="lbl">{dx.change ? `Change one thing: ${dx.change}` : 'Change this now'}</span><p>{dx.changeNow}</p>{#if dx.hold.length}<p class="hold">Keep the same: {dx.hold.join(', ')}.</p>{:else}<p class="hold">Keep your usual recipe the same, so you can tell whether this was the cause.</p>{/if}</div>
        <div><span class="lbl">Next time, try</span><p>{dx.nextExperiment}</p></div>
        {#if dx.ruleOut}<div><span class="lbl">How you'll know</span><p>{dx.ruleOut}</p></div>{/if}
      </div>
      <div class="actions">
        {#if brewLink}<a class="go" href={brewLink}>{dx.next.grind || dx.next.temp || dx.next.strength ? 'Brew it with this change →' : 'Open the Brew Guide →'}</a>{/if}
        {#if dx.next.tool && TOOL_LINK[dx.next.tool]}<a class="ghost" href={TOOL_LINK[dx.next.tool].href}>{TOOL_LINK[dx.next.tool].label}</a>{/if}
        <button type="button" class="ghost" onclick={share}>{copied ? 'Link copied' : 'Share'}</button>
        <button type="button" class="ghost" onclick={restart}>Start over</button>
      </div>
    {:else if result && !result.ok}
      <p>{result.errors[0].message}</p>
    {/if}
  </div>
</div>

<style>
  .dr {
    --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35);
  }
  .mini-axes { display: none; grid-column: 1; margin: -4px 0 0; font: 400 11px/1.3 'IBM Plex Mono', monospace; color: #75655a; text-align: center; }
  .stage { padding: 18px 18px 20px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f4ece0 80%); }
  .zl.small { font-size: 20px; line-height: 1.2; }
  .zone { padding: 6px 12px 0; min-height: 92px; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .zl { font: 400 26px/1.1 'Instrument Serif', Georgia, serif; margin: 6px 0 2px; }
  .zt { margin: 6px 0 0; color: var(--ink-2); font-size: 15px; }
  .panel { padding: 22px 26px 26px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  h3 { font: 400 30px/1.12 'Instrument Serif', Georgia, serif; margin: 0; outline: none; }
  h3.cause { font-size: 36px; }
  .crumbs { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font: 500 12px/1 'IBM Plex Mono', monospace; color: var(--ink-3); letter-spacing: .06em; text-transform: uppercase; }
  .crumbs .count { margin-left: auto; color: var(--crema-deep); }
  .back { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; font: 500 13px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; min-height: 34px; text-transform: none; letter-spacing: 0; }
  .grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .opt { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 12px 12px; min-height: 48px; font: 500 15px/1.2 'IBM Plex Sans', sans-serif; color: var(--ink); cursor: pointer; text-align: left; }
  .opt:hover, .card:hover { border-color: var(--ink-3); }
  .opts { display: flex; flex-direction: column; gap: 8px; }
  .sym { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .card { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 12px 14px; cursor: pointer; text-align: left; display: grid; grid-template-columns: 44px 1fr; grid-template-rows: auto auto; column-gap: 12px; align-items: center; color: var(--ink); min-height: 64px; }
  .card svg { grid-row: 1 / 3; width: 44px; height: 22px; color: var(--crema-deep); }
  .card .name { font: 600 15px/1.2 'IBM Plex Sans', sans-serif; }
  .card .tag { font-size: 13px; color: var(--ink-3); line-height: 1.3; }
  .kick { font: 500 12px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  .why { margin: 0; color: var(--ink-2); }
  .rx { display: flex; flex-direction: column; border-top: 1px solid var(--rule); }
  .rx > div { padding: 12px 0; border-bottom: 1px dashed var(--rule); }
  .rx p { margin: 6px 0 0; }
  .rx .now { background: linear-gradient(90deg, rgba(195, 135, 58, .13), transparent); padding-left: 10px; margin-left: -10px; border-radius: 6px; }
  .rx .now p { font: 400 22px/1.25 'Instrument Serif', Georgia, serif; }
  .rx .now p.hold { font: 400 14px/1.45 'IBM Plex Sans', system-ui, sans-serif; color: var(--ink-2); margin-top: 6px; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 13px 20px; font: 600 15px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 'IBM Plex Sans', sans-serif; cursor: pointer; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) {
    .dr { grid-template-columns: 1fr; }
    .stage { border-right: 0; border-bottom: 1px solid var(--rule); display: grid; grid-template-columns: 170px 1fr; gap: 10px; align-items: center; padding: 12px; }
    /* The thumbnail map is too small for its axis words (about 4 px), so they move into readable text. */
    .stage :global(.ax), .stage :global(.ax2), .stage :global(.sweet) { display: none; }
    .mini-axes { display: block; }
    .zone { min-height: 0; padding: 0; grid-column: 2; grid-row: 1 / span 2; }
    .zl { font-size: 21px; }
    .zt { font-size: 13.5px; }
    .panel { padding: 18px 16px 20px; }
    .grid3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sym { grid-template-columns: 1fr; }
    h3 { font-size: 26px; }
    h3.cause { font-size: 30px; }
  }
</style>
