<script>
  import { onMount } from 'svelte';

  let hoveredDrawer = $state(null);
  let animatedIn = $state(false);
  let isMobile = $state(false);

  const tools = [
    { id: 'brew-ratio', name: 'Brew Ratio', desc: 'Dial in your coffee-to-water ratio for any method', href: '/tools/brew-ratio/' },
    { id: 'fix-my-coffee', name: 'Fix My Coffee', desc: 'Diagnose and fix common brewing problems', href: '/tools/fix-my-coffee/' },
    { id: 'caffeine', name: 'Caffeine Calc', desc: 'Track your daily caffeine intake by method', href: '/tools/caffeine/' },
    { id: 'freshness', name: 'Freshness Tracker', desc: 'Know when your beans are at their best', href: '/tools/freshness/' },
    { id: 'drink-builder', name: 'Drink Builder', desc: 'Build espresso drinks with the right proportions', href: '/tools/drink-builder/' },
    { id: 'grind-guide', name: 'Grind Guide', desc: 'Match your grind size to your brew method', href: '/tools/grind-guide/' },
  ];

  let activeDesc = $derived(
    hoveredDrawer
      ? tools.find(t => t.id === hoveredDrawer)?.desc ?? ''
      : 'Pull open a drawer to explore'
  );

  onMount(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);

    requestAnimationFrame(() => {
      setTimeout(() => { animatedIn = true; }, 150);
    });

    return () => mq.removeEventListener('change', handler);
  });
</script>

<div class="toolbox">
  <div class="scene" class:scene--mobile={isMobile}>
    <!-- Warm atmospheric glow -->
    {#if !isMobile}
      <div class="scene-glow"></div>
    {/if}

    <!-- Isometric assembly -->
    <div class="cabinet-iso" class:cabinet-iso--flat={isMobile}>
      <!-- Top surface (decorative) -->
      <div class="iso-top"></div>

      <!-- Front face (interactive) -->
      <div class="cabinet">
        <!-- Handle -->
        <div class="cabinet-handle">
          <div class="handle-strap"></div>
          <div class="handle-rivet handle-rivet--left"></div>
          <div class="handle-rivet handle-rivet--right"></div>
        </div>

        <!-- Copper corner brackets -->
        <div class="corner-bracket corner-bracket--tl"></div>
        <div class="corner-bracket corner-bracket--tr"></div>
        <div class="corner-bracket corner-bracket--bl"></div>
        <div class="corner-bracket corner-bracket--br"></div>

        <!-- Top molding -->
        <div class="cabinet-molding"></div>

        <!-- Interior -->
        <div class="cabinet-interior">
          <div class="drawer-grid" class:single-col={isMobile}>
            {#each tools as tool, i}
              <a
                class="drawer"
                class:drawer--in={animatedIn}
                class:drawer--hovered={hoveredDrawer === tool.id}
                href={tool.href}
                style:--delay="{i * 120}ms"
                onmouseenter={() => hoveredDrawer = tool.id}
                onmouseleave={() => hoveredDrawer = null}
                onfocus={() => hoveredDrawer = tool.id}
                onblur={() => hoveredDrawer = null}
              >
                <div class="drawer-face">
                  <div class="nameplate">
                    <span class="nameplate-text">{tool.name}</span>
                  </div>
                  <div class="knob-assembly">
                    <div class="knob-ring"></div>
                    <div class="knob"></div>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>

        <!-- Bottom molding -->
        <div class="cabinet-molding"></div>
      </div>

      <!-- Right side face (decorative) -->
      <div class="iso-right"></div>
    </div>

    <!-- Scene props (desktop only) -->
    {#if !isMobile}
      <!-- Table surface — grounds the whole scene -->
      <div class="scene-surface">
        <!-- Cabinet shadow on the surface -->
        <div class="scene-cabinet-shadow"></div>
      </div>

      <!-- French press — on surface, right of cabinet -->
      <svg class="scene-kettle" viewBox="0 0 120 185" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Contact shadow — thin line at base, not floating -->
        <rect x="12" y="170" width="80" height="3" rx="1.5" fill="rgba(0,0,0,0.08)"/>

        <!-- === GLASS CARAFE === -->
        <!-- Glass body — slight green tint like reference -->
        <rect x="18" y="42" width="68" height="120" rx="4" fill="#C8CDBA" opacity="0.45"/>
        <!-- Glass highlight — left side reflection -->
        <rect x="22" y="44" width="14" height="116" rx="2" fill="rgba(255,255,255,0.15)"/>
        <!-- Glass edge — right side darker -->
        <rect x="72" y="44" width="10" height="116" rx="2" fill="rgba(0,0,0,0.06)"/>

        <!-- === COFFEE INSIDE === -->
        <!-- Coffee fill — dark brown, ~60% of carafe height -->
        <rect x="20" y="90" width="64" height="70" rx="3" fill="#3D2518"/>
        <!-- Coffee surface — lighter top edge -->
        <rect x="20" y="88" width="64" height="5" rx="1" fill="#5C3A22"/>
        <!-- Coffee highlight — slight sheen -->
        <rect x="24" y="91" width="12" height="66" rx="2" fill="rgba(255,255,255,0.06)"/>

        <!-- === COPPER FRAME === -->
        <!-- Bottom band -->
        <rect x="14" y="156" width="76" height="8" rx="2" fill="url(#copperFrame)"/>
        <rect x="14" y="156" width="76" height="2" rx="1" fill="rgba(255,255,255,0.12)"/>
        <!-- Base plate — wider -->
        <rect x="10" y="164" width="84" height="6" rx="2" fill="url(#copperFrame)"/>
        <rect x="10" y="164" width="84" height="1.5" rx="1" fill="rgba(255,255,255,0.1)"/>
        <rect x="10" y="169" width="84" height="1" rx="0.5" fill="rgba(0,0,0,0.1)"/>

        <!-- Top band / rim -->
        <rect x="14" y="38" width="76" height="8" rx="2" fill="url(#copperFrame)"/>
        <rect x="14" y="38" width="76" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>

        <!-- Vertical frame bars — left and right -->
        <rect x="16" y="46" width="5" height="110" rx="1.5" fill="url(#copperBar)"/>
        <rect x="16" y="46" width="1.5" height="110" rx="0.5" fill="rgba(255,255,255,0.1)"/>
        <rect x="83" y="46" width="5" height="110" rx="1.5" fill="url(#copperBar)"/>
        <rect x="83" y="46" width="1.5" height="110" rx="0.5" fill="rgba(255,255,255,0.1)"/>

        <!-- Cross bar — horizontal mid-frame support -->
        <rect x="16" y="86" width="72" height="3" rx="1" fill="url(#copperBar)" opacity="0.7"/>

        <!-- === LID === -->
        <!-- Dome shape -->
        <path d="M18 40 Q18 24, 52 18 Q86 24, 86 40 Z" fill="url(#copperLid)"/>
        <!-- Dome highlight -->
        <path d="M28 36 Q28 28, 48 24" stroke="rgba(255,255,255,0.15)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Dome bottom edge -->
        <rect x="18" y="38" width="68" height="2" rx="1" fill="rgba(0,0,0,0.1)"/>

        <!-- === PLUNGER === -->
        <!-- Rod — visible through glass from lid down to filter plate -->
        <rect x="50" y="2" width="4" height="85" rx="1.5" fill="#A06828"/>
        <rect x="50" y="2" width="1.5" height="85" rx="0.5" fill="rgba(255,255,255,0.1)"/>
        <!-- Filter plate — horizontal disc at bottom of rod, inside carafe -->
        <rect x="24" y="84" width="56" height="3" rx="1" fill="#9A6428" opacity="0.6"/>
        <rect x="24" y="84" width="56" height="1" rx="0.5" fill="rgba(255,255,255,0.08)"/>
        <!-- Knob — square copper top piece -->
        <rect x="44" y="0" width="16" height="6" rx="2" fill="url(#copperFrame)"/>
        <rect x="44" y="0" width="16" height="1.5" rx="1" fill="rgba(255,255,255,0.2)"/>

        <!-- === HANDLE === -->
        <!-- Dark handle — right side, D-shape -->
        <path d="
          M86 52
          C96 48, 108 52, 112 66
          C116 80, 116 100, 112 114
          C108 128, 96 132, 86 128
        " stroke="#2A1A12" stroke-width="9" stroke-linecap="round" fill="none"/>
        <!-- Handle inner lighter stroke -->
        <path d="
          M86 52
          C96 48, 108 52, 112 66
          C116 80, 116 100, 112 114
          C108 128, 96 132, 86 128
        " stroke="#3D2B1F" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Handle highlight -->
        <path d="M108 60 C112 72, 112 88, 110 100" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-linecap="round"/>

        <defs>
          <linearGradient id="copperFrame" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#8B5A28"/>
            <stop offset="20%" stop-color="#C17A3A"/>
            <stop offset="50%" stop-color="#D4944F"/>
            <stop offset="80%" stop-color="#C17A3A"/>
            <stop offset="100%" stop-color="#8B5A28"/>
          </linearGradient>
          <linearGradient id="copperBar" x1="0" y1="46" x2="0" y2="156" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#C8883E"/>
            <stop offset="50%" stop-color="#B07030"/>
            <stop offset="100%" stop-color="#8B5A28"/>
          </linearGradient>
          <linearGradient id="copperLid" x1="18" y1="40" x2="86" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#8B5A28"/>
            <stop offset="30%" stop-color="#C17A3A"/>
            <stop offset="60%" stop-color="#D4944F"/>
            <stop offset="100%" stop-color="#B07030"/>
          </linearGradient>
        </defs>
      </svg>

      <!-- Scattered coffee beans — all on the surface -->
      <svg class="scene-bean scene-bean--1" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#3D2518"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="10" cy="6" rx="4" ry="2.5" fill="rgba(255,255,255,0.04)" transform="rotate(-15 10 6)"/>
      </svg>
      <svg class="scene-bean scene-bean--2" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#4A3020"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <svg class="scene-bean scene-bean--3" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#3D2518"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <svg class="scene-bean scene-bean--4" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#4A3020"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="10" cy="6" rx="4" ry="2.5" fill="rgba(255,255,255,0.04)" transform="rotate(-15 10 6)"/>
      </svg>
      <svg class="scene-bean scene-bean--5" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#3D2518"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <svg class="scene-bean scene-bean--6" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#4A3020"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <svg class="scene-bean scene-bean--7" viewBox="0 0 28 18" aria-hidden="true">
        <ellipse cx="14" cy="9" rx="12" ry="7.5" fill="#3D2518"/>
        <path d="M14 2 C12 5.5, 12 12.5, 14 16" stroke="#2A1810" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
    {/if}
  </div>

  <!-- Description bar -->
  <p class="desc-bar" class:desc-bar--active={hoveredDrawer !== null}>
    {activeDesc}
  </p>
</div>

<style>
  .toolbox {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding-top: 56px; /* space for handle + top surface */
  }

  /* ===== Scene Wrapper ===== */
  .scene {
    position: relative;
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    overflow: visible;
    padding-bottom: 50px;
  }
  .scene--mobile {
    max-width: 100%;
    padding-bottom: 0;
  }

  /* Warm atmospheric glow behind cabinet */
  .scene-glow {
    position: absolute;
    top: 40%;
    left: 48%;
    transform: translate(-50%, -50%);
    width: 650px;
    height: 550px;
    background: radial-gradient(
      ellipse at center,
      rgba(193, 122, 58, 0.07) 0%,
      rgba(193, 122, 58, 0.03) 40%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ===== Table Surface ===== */
  .scene-surface {
    position: absolute;
    bottom: 0;
    left: -10%;
    width: 120%;
    height: 60px;
    z-index: 0;
    /* Solid table surface — warm tan, clearly distinct from cream bg */
    background:
      linear-gradient(
        180deg,
        rgba(195, 175, 148, 0.15) 0%,
        rgba(195, 175, 148, 0.55) 8%,
        rgba(190, 168, 140, 0.6) 20%,
        rgba(188, 166, 138, 0.58) 60%,
        rgba(185, 164, 136, 0.45) 100%
      );
  }

  /* Crisp edge where wall meets surface — the shelf/table line */
  .scene-surface::before {
    content: '';
    position: absolute;
    top: 0;
    left: 2%;
    right: 2%;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(130, 110, 85, 0.35) 10%,
      rgba(130, 110, 85, 0.5) 50%,
      rgba(130, 110, 85, 0.35) 90%,
      transparent 100%
    );
  }

  /* Cabinet shadow on the surface */
  .scene-cabinet-shadow {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-46%);
    width: 50%;
    height: 40px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.14) 0%,
      rgba(0, 0, 0, 0.08) 40%,
      transparent 75%
    );
    border-radius: 50%;
  }

  /* ===== Scene Props — all grounded on surface ===== */
  .scene-kettle {
    position: absolute;
    right: -10px;
    bottom: 2px;
    width: 150px;
    height: 230px;
    z-index: 3;
    opacity: 0.9;
    filter: drop-shadow(3px 4px 10px rgba(0,0,0,0.2));
  }

  /* Coffee beans — scattered on the surface around the base */
  .scene-bean {
    position: absolute;
    width: 22px;
    height: 14px;
    z-index: 4;
    opacity: 0.8;
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.2));
  }
  /* Left side of cabinet */
  .scene-bean--1 { left: 30px; bottom: 20px; transform: rotate(-35deg); }
  .scene-bean--2 { left: 55px; bottom: 8px; transform: rotate(15deg); width: 18px; height: 12px; }
  .scene-bean--3 { left: 15px; bottom: 6px; transform: rotate(-65deg); width: 20px; height: 13px; }
  /* Front of cabinet */
  .scene-bean--4 { left: 38%; bottom: 12px; transform: rotate(25deg); }
  .scene-bean--5 { left: 45%; bottom: 2px; transform: rotate(-20deg); width: 20px; height: 13px; }
  /* Between cabinet and press */
  .scene-bean--6 { right: 185px; bottom: 16px; transform: rotate(40deg); width: 18px; height: 12px; }
  .scene-bean--7 { right: 165px; bottom: 4px; transform: rotate(-50deg); width: 19px; height: 12px; }

  /* ===== Isometric Assembly ===== */
  .cabinet-iso {
    position: relative;
    width: 100%;
    max-width: 500px;
    overflow: visible;
  }
  .cabinet-iso--flat {
    max-width: 100%;
  }
  .cabinet-iso--flat .iso-top,
  .cabinet-iso--flat .iso-right {
    display: none;
  }

  /* ===== Top Surface (parallelogram via clip-path) ===== */
  .iso-top {
    position: absolute;
    z-index: 1;
    left: 0;
    bottom: 100%;
    width: calc(100% + 65px);
    height: 42px;
    clip-path: polygon(
      0% 100%,
      calc(100% - 65px) 100%,
      100% 0%,
      65px 0%
    );
    background:
      repeating-linear-gradient(
        85deg,
        transparent,
        transparent 10px,
        rgba(0,0,0,0.03) 10px,
        rgba(0,0,0,0.03) 11px
      ),
      repeating-linear-gradient(
        87deg,
        transparent,
        transparent 28px,
        rgba(255,255,255,0.02) 28px,
        rgba(255,255,255,0.02) 29px
      ),
      linear-gradient(
        90deg,
        #5C4535 0%,
        #6B5242 15%,
        #7A6050 40%,
        #8A7060 55%,
        #7A6050 70%,
        #6B5242 85%,
        #5C4535 100%
      );
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
  }

  /* ===== Right Side (skewed parallelogram) ===== */
  .iso-right {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 100%;
    width: 65px;
    height: 100%;
    transform-origin: 0% 100%;
    transform: skewY(-33deg);
    border-radius: 0 4px 4px 0;
    background:
      repeating-linear-gradient(
        180deg,
        transparent,
        transparent 7px,
        rgba(0,0,0,0.04) 7px,
        rgba(0,0,0,0.04) 8px
      ),
      linear-gradient(
        90deg,
        #2E1E14 0%,
        #3D2B1F 25%,
        #362518 60%,
        #2A1C14 100%
      );
    box-shadow:
      inset 1px 0 0 rgba(255,255,255,0.04),
      inset -1px 0 0 rgba(0,0,0,0.3);
  }

  /* ===== Front Face (Cabinet) ===== */
  .cabinet {
    position: relative;
    z-index: 2;
    border-radius: 8px;
    overflow: visible;
    /* Walnut wood frame */
    background:
      repeating-linear-gradient(
        91deg,
        transparent,
        transparent 6px,
        rgba(0,0,0,0.06) 6px,
        rgba(0,0,0,0.06) 7px
      ),
      repeating-linear-gradient(
        93deg,
        transparent,
        transparent 18px,
        rgba(255,255,255,0.03) 18px,
        rgba(255,255,255,0.03) 19px
      ),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 35%, #4A3425 65%, #3D2B1F 100%);
    box-shadow:
      0 12px 40px rgba(0,0,0,0.3),
      0 4px 12px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(255,255,255,0.08),
      inset 0 -1px 0 rgba(0,0,0,0.3);
    padding: 14px;
    padding-top: 20px;
  }

  /* ===== Leather Handle ===== */
  .cabinet-handle {
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 34px;
    z-index: 10;
  }
  .handle-strap {
    position: absolute;
    top: 2px;
    left: 12px;
    right: 12px;
    height: 20px;
    background:
      linear-gradient(180deg, #6B4A3A 0%, #5C3D2E 30%, #4A3020 60%, #3D2518 100%);
    border-radius: 11px 11px 0 0;
    border: 1px solid rgba(0,0,0,0.4);
    border-bottom: none;
    box-shadow:
      inset 0 2px 0 rgba(255,255,255,0.1),
      inset 0 -1px 3px rgba(0,0,0,0.2),
      0 -3px 8px rgba(0,0,0,0.2);
  }
  .handle-rivet {
    position: absolute;
    bottom: 2px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, #D4944F 0%, #C17A3A 45%, #8B5A28 100%);
    box-shadow:
      0 1px 3px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .handle-rivet--left { left: 14px; }
  .handle-rivet--right { right: 14px; }

  /* ===== Copper Corner Brackets ===== */
  .corner-bracket {
    position: absolute;
    width: 18px;
    height: 18px;
    z-index: 3;
  }
  .corner-bracket::before,
  .corner-bracket::after {
    content: '';
    position: absolute;
    background: linear-gradient(180deg, #D4944F 0%, #C17A3A 50%, #A66830 100%);
    border-radius: 1px;
  }
  .corner-bracket::before { height: 3px; width: 14px; }
  .corner-bracket::after { width: 3px; height: 14px; }

  .corner-bracket--tl { top: 5px; left: 5px; }
  .corner-bracket--tl::before { top: 0; left: 0; }
  .corner-bracket--tl::after { top: 0; left: 0; }

  .corner-bracket--tr { top: 5px; right: 5px; }
  .corner-bracket--tr::before { top: 0; right: 0; }
  .corner-bracket--tr::after { top: 0; right: 0; }

  .corner-bracket--bl { bottom: 5px; left: 5px; }
  .corner-bracket--bl::before { bottom: 0; left: 0; }
  .corner-bracket--bl::after { bottom: 0; left: 0; }

  .corner-bracket--br { bottom: 5px; right: 5px; }
  .corner-bracket--br::before { bottom: 0; right: 0; }
  .corner-bracket--br::after { bottom: 0; right: 0; }

  /* ===== Molding Strips ===== */
  .cabinet-molding {
    height: 10px;
    margin: 0 -2px;
    background:
      linear-gradient(180deg, #6B4E3D 0%, #5C3D2E 20%, #4A3528 50%, #3D2B1F 100%);
    border-radius: 3px;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.08),
      inset 0 -1px 0 rgba(0,0,0,0.2),
      0 2px 4px rgba(0,0,0,0.15);
  }

  /* ===== Cabinet Interior ===== */
  .cabinet-interior {
    background: #100C09;
    margin: 8px 0;
    border-radius: 3px;
    padding: 12px;
    box-shadow:
      inset 0 4px 14px rgba(0,0,0,0.7),
      inset 0 0 30px rgba(0,0,0,0.4),
      inset 0 -2px 6px rgba(0,0,0,0.3);
  }

  /* ===== Drawer Grid ===== */
  .drawer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .drawer-grid.single-col {
    grid-template-columns: 1fr;
  }

  /* ===== Individual Drawer ===== */
  .drawer {
    display: block;
    text-decoration: none;
    transform: translateX(50px);
    opacity: 0;
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.4s ease;
    transition-delay: var(--delay);
    outline: none;
  }
  .drawer--in {
    transform: translateX(0);
    opacity: 1;
  }

  .drawer:focus-visible .drawer-face {
    outline: 2px solid #C17A3A;
    outline-offset: 3px;
  }

  .drawer-face {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px 14px 18px;
    border-radius: 4px;
    cursor: pointer;
    background:
      repeating-linear-gradient(
        88deg,
        transparent, transparent 5px,
        rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 6px
      ),
      repeating-linear-gradient(
        90deg,
        transparent, transparent 14px,
        rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 15px
      ),
      linear-gradient(180deg, #8A6E58 0%, #7A5E4A 30%, #6B4E3D 70%, #7A5E4A 100%);
    border-top: 1px solid rgba(255,255,255,0.14);
    border-bottom: 2px solid rgba(0,0,0,0.3);
    box-shadow:
      0 3px 6px rgba(0,0,0,0.4),
      0 1px 2px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.1),
      inset 2px 0 4px rgba(0,0,0,0.1),
      inset -2px 0 4px rgba(0,0,0,0.1),
      inset 0 -2px 4px rgba(0,0,0,0.12);
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.4s ease;
  }

  /* Drawer side edge on pull */
  .drawer-face::after {
    content: '';
    position: absolute;
    right: -9px;
    top: 2px;
    bottom: 2px;
    width: 9px;
    background: linear-gradient(180deg, #5C4535 0%, #4A3828 50%, #5C4535 100%);
    border-radius: 0 3px 3px 0;
    border-right: 1px solid rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Bottom thickness */
  .drawer-face::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 4px;
    right: 4px;
    height: 4px;
    background: linear-gradient(180deg, #4A3828 0%, #3D2B1F 100%);
    border-radius: 0 0 3px 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .drawer--hovered .drawer-face {
    transform: translateX(-36px) scale(1.02);
    box-shadow:
      22px 6px 32px -6px rgba(0,0,0,0.55),
      8px 3px 14px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.14),
      inset 2px 0 4px rgba(0,0,0,0.1),
      inset -2px 0 4px rgba(0,0,0,0.1);
  }
  .drawer--hovered .drawer-face::after {
    opacity: 1;
  }

  /* ===== Copper Nameplate ===== */
  .nameplate {
    padding: 5px 20px;
    border-radius: 2px;
    background: linear-gradient(180deg, #D4944F 0%, #C17A3A 30%, #B07030 60%, #C17A3A 85%, #D4944F 100%);
    border: 1px solid rgba(0,0,0,0.15);
    box-shadow:
      0 2px 4px rgba(0,0,0,0.35),
      inset 0 1px 0 rgba(255,255,255,0.25),
      inset 0 -1px 0 rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
  }
  .drawer--hovered .nameplate {
    box-shadow:
      0 2px 4px rgba(0,0,0,0.35),
      inset 0 1px 0 rgba(255,255,255,0.25),
      0 0 20px rgba(193,122,58,0.4);
  }

  .nameplate-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: #1A1210;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(255,255,255,0.15);
    white-space: nowrap;
  }

  /* ===== Copper Pull Knob ===== */
  .knob-assembly {
    position: relative;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .knob-ring {
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #A66830;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .knob {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 30%, #E0A860 0%, #D4944F 30%, #C17A3A 55%, #8B5A28 100%);
    box-shadow: 0 2px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
    transition: box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .drawer--hovered .knob {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 12px rgba(193,122,58,0.5);
  }
  .drawer--hovered .knob-ring {
    border-color: #C17A3A;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(193,122,58,0.3);
  }

  /* ===== Description Bar ===== */
  .desc-bar {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.875rem;
    color: #9B9590;
    text-align: center;
    transition: color 0.25s ease;
    min-height: 1.4em;
    margin: 0;
  }
  .desc-bar--active {
    color: #1A1A1A;
  }
</style>
