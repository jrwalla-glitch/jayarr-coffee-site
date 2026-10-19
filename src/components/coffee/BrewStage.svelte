<script lang="ts">
  // The Brew Guide's live drawing. Pure presentation: every level comes from the engine's
  // simulate() frame, so the picture can never disagree with the recipe.
  import type { Frame, MethodId } from '../../lib/coffee/index.ts';

  interface Props {
    method: MethodId;
    frame: Frame;
    doseG: number;
    waterG: number;
    cupMl: number;
    /** 0..1 progress of the steep, for colour (immersion). */
    steep?: number;
    label: string;
  }
  let { method, frame, doseG, waterG, cupMl, steep = 0, label }: Props = $props();

  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  // Common rig: brewer above, cup or server below, scale at the bottom.
  const SCALE_Y = 420;

  // Cone geometry (V60 / Kalita) — interior of the filter.
  const cone = { topY: 112, tipY: 250, topL: 122, topR: 298, tipL: method === 'kalita' ? 184 : 199, tipR: method === 'kalita' ? 236 : 221 };
  const coneW = (y: number) => {
    const f = (y - cone.topY) / (cone.tipY - cone.topY);
    return [cone.topL + (cone.tipL - cone.topL) * f, cone.topR + (cone.tipR - cone.topR) * f];
  };
  const coneArea = (y: number) => { const [l, r] = coneW(y); return ((r - l) + (cone.tipR - cone.tipL)) / 2 * (cone.tipY - y); };
  const CONE_FULL = coneArea(cone.topY);
  function coneYFor(frac: number) {
    let lo = cone.topY, hi = cone.tipY;
    for (let i = 0; i < 28; i++) { const m = (lo + hi) / 2; coneArea(m) / CONE_FULL > frac ? (lo = m) : (hi = m); }
    return (lo + hi) / 2;
  }

  // A cone holds about 1.3× the brew water at the rim in this drawing (illustrative).
  let coneCap = $derived(Math.max(300, waterG * 0.75));
  let bedFrac = $derived(clamp((doseG * 2.2) / coneCap));
  let bedY = $derived(coneYFor(bedFrac));
  let slurryY = $derived(coneYFor(clamp(bedFrac + (frame.brewerG / coneCap))));
  let slurryEdge = $derived(coneW(slurryY));

  // Server / mug: interior from y=300 to 404; capacity scales so the target sits at ~70%.
  const CUP_TOP = 300, CUP_BOT = 404;
  let cupCap = $derived(Math.max(cupMl / 0.7, 120));
  let cupY = $derived(CUP_BOT - (CUP_BOT - CUP_TOP) * clamp(frame.cupG / cupCap));
  let targetY = $derived(CUP_BOT - (CUP_BOT - CUP_TOP) * clamp(cupMl / cupCap));

  // Immersion vessels (press / AeroPress / jar): interior from 150 to 392.
  const VES_TOP = 150, VES_BOT = 392;
  let vesCap = $derived(Math.max(waterG / 0.82, 150));
  let vesY = $derived(VES_BOT - (VES_BOT - VES_TOP) * clamp((frame.brewerG + doseG * 0.8) / vesCap));
  let plungerY = $derived(method === 'french-press' || method === 'aeropress'
    ? (frame.dripping || frame.cupG > 0 ? VES_TOP - 22 + (VES_BOT - 30 - (VES_TOP - 22)) * clamp(frame.cupG / Math.max(1, cupMl)) : VES_TOP - 22)
    : 0);
  // Slurry darkens as it steeps.
  let brewTone = $derived(`hsl(26 ${44 - 8 * steep}% ${46 - 22 * steep}%)`);

  const fmt = (g: number) => (g >= 1000 ? (g / 1000).toFixed(2) + ' kg' : g.toFixed(1));
  let showKettle = $derived(frame.pouring && method !== 'drip-machine' && method !== 'espresso' && method !== 'moka');
</script>

<svg viewBox="0 0 420 470" role="img" aria-label={label} class="rig">
  <defs>
    <linearGradient id="bs-brew" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4e30" /><stop offset="1" stop-color="#3f2416" /></linearGradient>
    <linearGradient id="bs-slurry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98d5d" stop-opacity=".9" /><stop offset="1" stop-color="#6e4428" /></linearGradient>
    <linearGradient id="bs-glass" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85" /><stop offset=".45" stop-color="#fff" stop-opacity=".15" /><stop offset="1" stop-color="#fff" stop-opacity=".7" /></linearGradient>
    <linearGradient id="bs-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc1ca" /><stop offset="1" stop-color="#3f8796" /></linearGradient>
    <clipPath id="bs-cone"><path d={`M${cone.topL} ${cone.topY} L${cone.topR} ${cone.topY} L${cone.tipR} ${cone.tipY} L${cone.tipL} ${cone.tipY} Z`} /></clipPath>
    <clipPath id="bs-cup"><path d="M146 296 L146 392 Q146 406 160 406 L260 406 Q274 406 274 392 L274 296 Z" /></clipPath>
    <clipPath id="bs-ves"><rect x="150" y={VES_TOP} width="120" height={VES_BOT - VES_TOP} rx="4" /></clipPath>
  </defs>

  <!-- Kettle: a gooseneck, only while pouring -->
  <g class="kettle" class:on={showKettle} transform={method === 'french-press' ? 'translate(-46 34)' : method === 'aeropress' || method === 'cold-brew' ? 'translate(-6 34)' : method === 'phin' ? 'translate(14 20)' : ''}>
    <!-- gooseneck kettle, body partly off the left edge -->
    <path d="M-60 34 Q -58 22 -40 20 L 40 20 Q 58 22 60 34 L 70 98 Q 72 110 58 112 L -58 112 Z" fill="#efe7dc" stroke="#2a1d15" stroke-width="2" stroke-linejoin="round" />
    <path d="M-30 20 Q -28 8 0 6 Q 28 8 30 20" fill="#e2d8ca" stroke="#2a1d15" stroke-width="2" />
    <circle cx="0" cy="3" r="4" fill="#2a1d15" />
    <path d="M64 90 C 92 98, 98 62, 112 50 C 126 38, 140 52, 146 72 L 150 96" fill="none" stroke="#2a1d15" stroke-width="5" stroke-linecap="round" />
    <path d="M64 90 C 92 98, 98 62, 112 50 C 126 38, 140 52, 146 72 L 150 96" fill="none" stroke="#efe7dc" stroke-width="2" stroke-linecap="round" />
    <path d="M151 100 Q 156 116 168 140" fill="none" stroke="#3f8796" stroke-width="2.4" stroke-linecap="round" class="stream" />
  </g>

  {#if method === 'v60' || method === 'kalita'}
    <g>
      <path d={`M${cone.topL} ${cone.topY} L${cone.topR} ${cone.topY} L${cone.tipR} ${cone.tipY} L${cone.tipL} ${cone.tipY} Z`} fill="#fbf9f4" stroke="#d9cdbd" />
      <g clip-path="url(#bs-cone)">
        <rect x="100" y={bedY} width="220" height={cone.tipY - bedY + 2} fill="#5a3822" />
        <rect x="100" y={slurryY} width="220" height={Math.max(0, bedY - slurryY + 1)} fill="url(#bs-slurry)" />
        {#if frame.brewerG > 2}<line x1={slurryEdge[0]} x2={slurryEdge[1]} y1={slurryY} y2={slurryY} stroke="#e2c39b" stroke-width="1.2" />{/if}
      </g>
      <path d={`M110 104 L310 104 L${cone.tipR + 9} ${cone.tipY + 6} L${cone.tipL - 9} ${cone.tipY + 6} Z`} fill="none" stroke="#2a1d15" stroke-width="2" stroke-linejoin="round" />
      <path d="M104 104 L316 104" stroke="#2a1d15" stroke-width="3" stroke-linecap="round" />
      {#if method === 'v60'}
        <g stroke="#2a1d15" stroke-width=".8" opacity=".22" fill="none">
          <path d="M128 108 C 152 162, 176 210, 200 252" /><path d="M162 108 C 180 162, 196 210, 207 252" />
          <path d="M260 108 C 246 162, 230 210, 213 252" /><path d="M292 108 C 268 162, 244 210, 220 252" />
        </g>
      {:else}
        <g stroke="#2a1d15" stroke-width=".8" opacity=".25" fill="none">
          {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as i}<path d={`M${126 + i * 15} 108 L${188 + i * 4.3} 252`} />{/each}
        </g>
      {/if}
      <path d="M298 134 C 344 130, 346 190, 280 192" fill="none" stroke="#2a1d15" stroke-width="2" />
      <rect x="150" y="256" width="120" height="10" rx="2" fill="#f6f1ea" stroke="#2a1d15" stroke-width="2" />
      {#if frame.dripping}<circle cx="210" cy={274 + ((frame.tS * 36) % 22)} r="2.2" fill="#4a2c19" />{/if}
    </g>
    <!-- glass server -->
    <g>
      <g clip-path="url(#bs-cup)">
        <rect x="140" y={cupY} width="140" height={CUP_BOT - cupY + 4} fill="url(#bs-brew)" />
        {#if frame.cupG > 3}<line x1="146" x2="274" y1={cupY} y2={cupY} stroke="#c3873a" stroke-width="1.2" />{/if}
      </g>
      <path d="M144 272 L276 272 L276 392 Q276 408 260 408 L160 408 Q144 408 144 392 Z" fill="url(#bs-glass)" fill-opacity=".3" stroke="#2a1d15" stroke-width="2" />
      <path d="M276 302 C 306 302, 308 358, 276 360" fill="none" stroke="#2a1d15" stroke-width="2" />
      <line x1="138" x2="150" y1={targetY} y2={targetY} stroke="#3f8796" stroke-width="1.4" />
      <text x="134" y={targetY + 4} text-anchor="end" class="mark">target</text>
    </g>
  {:else if method === 'chemex'}
    <g>
      <!-- top cone (filter) and bottom bulb as one flask -->
      <path d="M118 110 L302 110 L232 236 L188 236 Z" fill="#fbf9f4" stroke="#d9cdbd" />
      <g clip-path="url(#bs-cone)">
        <rect x="100" y={bedY} width="220" height={cone.tipY - bedY + 2} fill="#5a3822" />
        <rect x="100" y={slurryY} width="220" height={Math.max(0, bedY - slurryY + 1)} fill="url(#bs-slurry)" />
      </g>
      <clipPath id="bs-bulb"><path d="M186 262 C 120 300, 118 400, 176 406 L244 406 C 302 400, 300 300, 234 262 Z" /></clipPath>
      <g clip-path="url(#bs-bulb)"><rect x="100" y={cupY} width="220" height={CUP_BOT - cupY + 6} fill="url(#bs-brew)" /></g>
      <path d="M108 102 L312 102 L234 240 L234 262 C 302 300, 304 404, 246 410 L174 410 C 116 404, 118 300, 186 262 L186 240 Z" fill="url(#bs-glass)" fill-opacity=".25" stroke="#2a1d15" stroke-width="2" stroke-linejoin="round" />
      <!-- wooden collar and tie -->
      <path d="M180 226 L240 226 L250 262 L170 262 Z" fill="#b48a5c" stroke="#2a1d15" stroke-width="1.6" />
      <path d="M210 262 l -6 18 m 6 -18 l 6 18" stroke="#6e4428" stroke-width="1.6" />
      <line x1="300" x2="312" y1={targetY} y2={targetY} stroke="#3f8796" stroke-width="1.4" />
      {#if frame.dripping}<circle cx="210" cy={246 + ((frame.tS * 36) % 18)} r="2" fill="#4a2c19" />{/if}
    </g>
  {:else if method === 'french-press' || method === 'cold-brew'}
    <g transform={method === 'french-press' ? 'translate(-46 0)' : ''}>
      <g clip-path="url(#bs-ves)">
        {#if frame.scaleG > 1}
          <rect x="140" y={vesY} width="140" height={VES_BOT - vesY + 2} fill={brewTone} />
          {#if method === 'french-press' && frame.cupG <= 0}<rect x="140" y={vesY} width="140" height="12" fill="#5a3822" opacity=".75" />{/if}
        {/if}
        <rect x="140" y={VES_BOT - (method === 'cold-brew' ? 50 : 22)} width="140" height="60" fill="#4a2c19" opacity={frame.scaleG > 1 ? 0.3 : 0.9} />
      </g>
      {#if method === 'cold-brew'}
        <path d="M150 140 L150 384 Q150 396 162 396 L258 396 Q270 396 270 384 L270 140" fill="url(#bs-glass)" fill-opacity=".25" stroke="#2a1d15" stroke-width="2" />
        <rect x="144" y="122" width="132" height="20" rx="3" fill="#c9b9a3" stroke="#2a1d15" stroke-width="2" />
        <text x="210" y="270" text-anchor="middle" class="mark">steep {Math.round(steep * 12)} h</text>
      {:else}
        <rect x="150" y={VES_TOP} width="120" height={VES_BOT - VES_TOP} rx="4" fill="url(#bs-glass)" fill-opacity=".25" stroke="#2a1d15" stroke-width="2" />
        <line x1="210" x2="210" y1={plungerY - 80} y2={plungerY} stroke="#2a1d15" stroke-width="3" />
        <rect x="154" y={plungerY} width="112" height="6" rx="2" fill="#8a786a" stroke="#2a1d15" stroke-width="1.4" />
        <circle cx="210" cy={plungerY - 84} r="7" fill="#2a1d15" />
        <rect x="146" y={VES_TOP - 10} width="128" height="10" rx="2" fill="#8a786a" stroke="#2a1d15" stroke-width="1.6" />
        <path d="M270 190 C 306 190, 306 300, 270 300" fill="none" stroke="#2a1d15" stroke-width="2.4" />
      {/if}
    </g>
    {#if method === 'french-press'}
      <g>
        <clipPath id="bs-mug"><rect x="292" y="330" width="78" height="72" rx="6" /></clipPath>
        <g clip-path="url(#bs-mug)"><rect x="286" y={402 - 72 * clamp(frame.cupG / cupCap)} width="90" height="80" fill="url(#bs-brew)" /></g>
        <rect x="292" y="330" width="78" height="72" rx="6" fill="none" stroke="#2a1d15" stroke-width="2" />
        <path d="M370 346 c 22 0, 22 40, 0 40" fill="none" stroke="#2a1d15" stroke-width="2" />
      </g>
    {/if}
  {:else if method === 'aeropress'}
    <!-- AeroPress standing on a mug: chamber 166–254 wide, 150–300 tall -->
    <g>
      <clipPath id="bs-aero"><rect x="168" y="152" width="84" height="146" /></clipPath>
      <g clip-path="url(#bs-aero)">
        {#if frame.brewerG > 1}<rect x="160" y={298 - 146 * clamp(frame.brewerG / 260)} width="100" height="160" fill={brewTone} />{/if}
        <rect x="160" y="282" width="100" height="20" fill="#4a2c19" opacity={frame.scaleG > 1 ? 0.35 : 0.9} />
      </g>
      <rect x="166" y="150" width="88" height="150" rx="3" fill="url(#bs-glass)" fill-opacity=".3" stroke="#2a1d15" stroke-width="2" />
      <g stroke="#2a1d15" stroke-width=".8" opacity=".35">{#each [0, 1, 2, 3] as i}<line x1="240" x2="252" y1={170 + i * 30} y2={170 + i * 30} />{/each}</g>
      <rect x="156" y="300" width="108" height="10" rx="2" fill="#2a1d15" />
      <!-- plunger rides down as it presses -->
      <rect x="170" y={136 + 146 * clamp(frame.cupG > 0 ? frame.cupG / Math.max(1, cupMl) : 0) - 0} width="80" height="10" rx="2" fill="#8a786a" stroke="#2a1d15" stroke-width="1.4" opacity={frame.cupG > 0 || frame.dripping ? 1 : 0} />
      <clipPath id="bs-amug"><rect x="166" y="316" width="88" height="86" rx="6" /></clipPath>
      <g clip-path="url(#bs-amug)"><rect x="160" y={402 - 86 * clamp(frame.cupG / cupCap)} width="100" height="90" fill="url(#bs-brew)" /></g>
      <rect x="166" y="312" width="88" height="90" rx="6" fill="none" stroke="#2a1d15" stroke-width="2" />
      <path d="M254 330 c 24 0, 24 44, 0 44" fill="none" stroke="#2a1d15" stroke-width="2" />
      {#if frame.dripping}<circle cx="210" cy={314 + ((frame.tS * 30) % 10)} r="2" fill="#4a2c19" />{/if}
    </g>
  {:else if method === 'drip-machine'}
    <g>
      <rect x="110" y="70" width="200" height="40" rx="8" fill="#2a1d15" />
      <rect x="250" y="112" width="60" height="230" rx="6" fill="#efe7dc" stroke="#2a1d15" stroke-width="2" />
      <rect x="256" y={118 + 216 * clamp(frame.scaleG / Math.max(1, waterG))} width="48" height={216 * (1 - clamp(frame.scaleG / Math.max(1, waterG)))} fill="url(#bs-water)" opacity=".85" />
      <path d="M140 112 L240 112 L222 178 L158 178 Z" fill="#f6f1ea" stroke="#2a1d15" stroke-width="2" />
      <rect x="160" y={170 - 50 * clamp(frame.brewerG / 400)} width="60" height={8 + 50 * clamp(frame.brewerG / 400)} fill="url(#bs-slurry)" opacity=".9" />
      {#if frame.pouring}<g stroke="#3f8796" stroke-width="1.2">{#each [170, 190, 210] as x}<line x1={x} x2={x} y1="114" y2="132" />{/each}</g>{/if}
      <g clip-path="url(#bs-cup)"><rect x="140" y={cupY} width="140" height={CUP_BOT - cupY + 4} fill="url(#bs-brew)" /></g>
      <path d="M144 272 L276 272 L276 392 Q276 408 260 408 L160 408 Q144 408 144 392 Z" fill="url(#bs-glass)" fill-opacity=".3" stroke="#2a1d15" stroke-width="2" />
      <path d="M276 302 C 306 302, 308 358, 276 360" fill="none" stroke="#2a1d15" stroke-width="2" />
    </g>
  {:else if method === 'espresso'}
    <g>
      <rect x="90" y="60" width="240" height="130" rx="10" fill="#d9d2c7" stroke="#2a1d15" stroke-width="2" />
      <rect x="170" y="190" width="80" height="22" rx="4" fill="#8a786a" stroke="#2a1d15" stroke-width="2" />
      <path d="M176 212 h 68 l -8 20 h -52 z" fill="#2a1d15" />
      <path d="M244 220 h 70 a 8 8 0 0 1 0 16 h -70" fill="#2a1d15" />
      {#if frame.dripping}<g fill="#5a3822"><rect x="198" y="232" width="3" height={300 - 232} /><rect x="219" y="232" width="3" height={300 - 232} /></g>{/if}
      <clipPath id="bs-demi"><path d="M168 318 L252 318 L244 382 Q242 392 232 392 L188 392 Q178 392 176 382 Z" /></clipPath>
      <g clip-path="url(#bs-demi)">
        <rect x="160" y={392 - 74 * clamp(frame.cupG / Math.max(20, cupMl / 0.62))} width="100" height="90" fill="#3b2214" />
        <rect x="160" y={392 - 74 * clamp(frame.cupG / Math.max(20, cupMl / 0.62))} width="100" height={frame.cupG > 2 ? 6 : 0} fill="#b77a3c" />
      </g>
      <path d="M168 318 L252 318 L244 382 Q242 392 232 392 L188 392 Q178 392 176 382 Z" fill="none" stroke="#2a1d15" stroke-width="2" />
      <path d="M250 330 c 18 0, 18 28, -2 28" fill="none" stroke="#2a1d15" stroke-width="2" />
      <rect x="120" y="398" width="180" height="10" rx="2" fill="#8a786a" />
    </g>
  {:else if method === 'phin'}
    <!-- Phin on a glass: a metal chamber with its press over the bed, a wide plate, the coffee dripping into the glass. -->
    <g>
      <clipPath id="bs-phin"><rect x="176" y="174" width="68" height="84" /></clipPath>
      <g clip-path="url(#bs-phin)">
        <rect x="170" y="240" width="80" height="20" fill="#5a3822" />
        {#if frame.brewerG > 0.5}<rect x="170" y={240 - 62 * clamp(frame.brewerG / Math.max(1, waterG))} width="80" height={62 * clamp(frame.brewerG / Math.max(1, waterG)) + 1} fill="url(#bs-slurry)" />{/if}
      </g>
      <rect x="180" y="236" width="60" height="4" rx="1" fill="#8a786a" stroke="#2a1d15" stroke-width="1.2" />
      <rect x="174" y="172" width="72" height="88" rx="3" fill="none" stroke="#2a1d15" stroke-width="2" />
      <rect x="170" y="162" width="80" height="10" rx="3" fill="#c9c0b3" stroke="#2a1d15" stroke-width="2" />
      <rect x="140" y="260" width="140" height="8" rx="3" fill="#c9c0b3" stroke="#2a1d15" stroke-width="2" />
      {#if frame.dripping}<circle cx="210" cy={276 + ((frame.tS * 30) % 20)} r="2" fill="#4a2c19" />{/if}
      <g clip-path="url(#bs-cup)">
        <rect x="140" y={cupY} width="140" height={CUP_BOT - cupY + 4} fill="url(#bs-brew)" />
        {#if frame.cupG > 3}<line x1="146" x2="274" y1={cupY} y2={cupY} stroke="#c3873a" stroke-width="1.2" />{/if}
      </g>
      <path d="M144 272 L276 272 L276 392 Q276 408 260 408 L160 408 Q144 408 144 392 Z" fill="url(#bs-glass)" fill-opacity=".3" stroke="#2a1d15" stroke-width="2" />
      <line x1="138" x2="150" y1={targetY} y2={targetY} stroke="#3f8796" stroke-width="1.4" />
      <text x="134" y={targetY + 4} text-anchor="end" class="mark">target</text>
    </g>
  {:else if method === 'moka'}
    <g>
      <path d="M160 256 L260 256 L272 392 L148 392 Z" fill="#d9d2c7" stroke="#2a1d15" stroke-width="2" />
      <clipPath id="bs-mokabase"><path d="M162 260 L258 260 L268 388 L152 388 Z" /></clipPath>
      <g clip-path="url(#bs-mokabase)"><rect x="140" y={388 - 128 * clamp((frame.scaleG - frame.cupG) / Math.max(1, waterG))} width="140" height="140" fill="url(#bs-water)" opacity=".8" /></g>
      <rect x="154" y="244" width="112" height="14" fill="#8a786a" stroke="#2a1d15" stroke-width="2" />
      <path d="M164 244 L176 120 L244 120 L256 244 Z" fill="#d9d2c7" stroke="#2a1d15" stroke-width="2" />
      <clipPath id="bs-mokatop"><path d="M168 240 L178 124 L242 124 L252 240 Z" /></clipPath>
      <g clip-path="url(#bs-mokatop)"><rect x="160" y={240 - 116 * clamp(frame.cupG / Math.max(1, cupMl / 0.8))} width="100" height="130" fill="url(#bs-brew)" /></g>
      <path d="M256 150 c 34 0, 40 70, 6 80" fill="none" stroke="#2a1d15" stroke-width="4" />
      <path d="M170 120 L250 120 L238 104 L182 104 Z" fill="#c9c0b3" stroke="#2a1d15" stroke-width="2" />
      {#if frame.dripping}<path d="M210 230 q -4 -40 0 -80" stroke="#7a4e30" stroke-width="3" fill="none" opacity=".7" />{/if}
      <rect x="130" y="392" width="160" height="10" rx="3" fill="#2a1d15" />
    </g>
  {/if}

  {#if method !== 'moka'}
    <g class="scale">
      <rect x="96" y={SCALE_Y - 4} width="228" height="34" rx="8" fill="#2a1d15" />
      <rect x="112" y={SCALE_Y + 30} width="196" height="6" rx="3" fill="#1c130d" />
      <rect x="236" y={SCALE_Y + 3} width="76" height="20" rx="3" fill="#0f2a2f" />
      <text x="306" y={SCALE_Y + 18} text-anchor="end" class="lcd">{fmt(frame.scaleG)}</text>
      <circle cx="116" cy={SCALE_Y + 13} r="5" fill="none" stroke="#8a786a" stroke-width="1.4" />
      <circle cx="134" cy={SCALE_Y + 13} r="5" fill="none" stroke="#8a786a" stroke-width="1.4" />
    </g>
  {/if}
</svg>

<style>
  .rig { width: 100%; height: auto; display: block; max-height: 480px; }
  @media (max-width: 880px) { .rig { max-height: 290px; } }
  .kettle { opacity: 0; transition: opacity .35s ease; }
  .kettle.on { opacity: 1; }
  .stream { stroke-dasharray: 4 3; animation: flow .5s linear infinite; }
  @keyframes flow { to { stroke-dashoffset: -14; } }
  .lcd { font: 500 13px/1 var(--cf-mono, ui-monospace, monospace); fill: #7fd0dc; }
  .mark { font: 500 10px/1 var(--cf-mono, ui-monospace, monospace); fill: #3f8796; letter-spacing: .06em; text-transform: uppercase; }
  @media (prefers-reduced-motion: reduce) { .stream { animation: none; } .kettle { transition: none; } }
</style>
