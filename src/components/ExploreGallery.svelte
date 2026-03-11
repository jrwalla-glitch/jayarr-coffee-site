<script>
  import { onMount } from 'svelte';

  let isMobile = $state(false);
  let hoveredFrame = $state(null);

  onMount(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  const frames = [
    {
      id: 'origins',
      href: '/explore/origins',
      title: 'The Coffee Origins',
      subtitle: 'An Interactive World Map',
      matColor: '#E8E1D4',
    },
    {
      id: 'methods',
      href: '/explore/methods',
      title: 'The Brewing Constellations',
      subtitle: 'An Interactive Star Chart',
      matColor: '#2A3040',
    },
    {
      id: 'flavors',
      href: '/explore/flavors',
      title: 'The Flavor Bloom',
      subtitle: 'A Botanical Tasting Guide',
      matColor: '#DDE4D6',
    }
  ];
</script>

<div class="gallery-page">
  <div class="gallery-header">
    <span class="gallery-overline">EXPLORE</span>
    <h1 class="gallery-title">The Coffee Collection</h1>
    <p class="gallery-sub">Three interactive studies in coffee science</p>
  </div>

  <div class="gallery-wall">
    {#each frames as frame, idx}
      <a
        href={frame.href}
        class="gallery-piece"
        class:dimmed={hoveredFrame !== null && hoveredFrame !== frame.id}
        class:center-piece={idx === 1}
        onmouseenter={() => hoveredFrame = frame.id}
        onmouseleave={() => hoveredFrame = null}
      >
        <div class="piece-frame" style="background: {frame.matColor}">
          {#if frame.id === 'origins'}
            <svg viewBox="0 0 300 180" class="piece-preview" aria-label="Coffee origin map preview">
              <!-- Ocean background -->
              <rect width="300" height="180" fill="#CBCFD5" rx="1"/>
              <!-- Grid lines -->
              <line x1="0" y1="90" x2="300" y2="90" stroke="#8B9BA8" stroke-width="0.3" stroke-dasharray="4,8" opacity="0.15"/>
              <line x1="0" y1="55" x2="300" y2="55" stroke="#8B9BA8" stroke-width="0.2" stroke-dasharray="3,8" opacity="0.08"/>
              <line x1="0" y1="125" x2="300" y2="125" stroke="#8B9BA8" stroke-width="0.2" stroke-dasharray="3,8" opacity="0.08"/>
              <line x1="100" y1="0" x2="100" y2="180" stroke="#8B9BA8" stroke-width="0.2" stroke-dasharray="3,8" opacity="0.08"/>
              <line x1="200" y1="0" x2="200" y2="180" stroke="#8B9BA8" stroke-width="0.2" stroke-dasharray="3,8" opacity="0.08"/>
              <!-- Continents scaled up 8% and centered vertically -->
              <g transform="translate(-12, 14) scale(1.08)">
                <!-- North America -->
                <path d="M47.6,43.1L43.8,40.7L37.1,27.5L35.5,29L32.5,26.7L32.5,7.9L36.2,9.8L43.2,6L45.2,8.5L46.3,6.8L46.4,8.7L54,9.8L55.4,12.6L59.3,13.2L61.5,10.1L65.5,12.7L68.6,10.6L69.9,13.4L70.6,2.3L77.2,13.6L78.7,7.5L82.3,9.2L82.2,13.8L78.5,15L71.5,25.7L73.1,31.8L81.5,34.7L83.4,40.2L83.5,35.4L86.2,32.7L84.9,23.2L88.5,23L93.6,30.1L96.2,26.6L98.5,33L103.5,37.4L90.8,45.8L95.8,42.8L96.3,46.5L100.2,46.9L94.9,49.6L96.3,47.6L92.3,45L81.3,51.8L79.9,46.2L71,42.6L47.6,43.1Z M47.6,43.1L76.4,44L81.2,47.6L81.1,51.8L92.3,45L94.2,48.2L85.8,55.5L86.9,58.3L82.2,62.4L83,68.3L78,63.4L71.1,64.3L68.7,67.7L61.2,62.1L49.5,59.3L46.3,53.3L47.6,43.1Z M32.5,7.9L32.5,26.7L35.5,29L37.1,27.5L41.2,35.3L38.3,30.2L32.6,27.6L27.4,25.7L23.6,28.6L24.5,25L18,33.5L12.7,35.8L19.1,29L15,29.4L12.2,26.3L16,18.6L12.5,19.2L9.9,16.8L15.3,15.9L11.5,9.9L19.5,3.8L32.5,7.9Z M52.4,61.3L65.3,64L69.1,67.7L70.1,74L77.5,71.6L76.8,74.6L73.1,77.8L63.8,74.5L55.7,62.7L58.8,70.1L54.1,66L52.4,61.3Z" fill="#C9B99A" opacity="0.65" stroke="#A89878" stroke-width="0.5"/>
                <!-- South America -->
                <path d="M105.5,119.9L102,116.4L105.3,112.5L101.7,108.9L101.5,103.7L95.6,98.2L91.2,99.2L88.4,96.3L91.8,93.6L91.8,88.6L95.4,89.3L97.2,88.2L96,86.6L99.8,85.6L100.8,88.9L107.3,86.5L108,90.1L116.7,92.4L121.1,96.1L115.9,108.7L110.3,111.4L105.5,119.9Z M102,116.4L102.7,123.1L95.7,127.6L97.1,129.2L93.9,132.7L95.3,134.7L93.2,141.3L90.1,140.9L88.8,137.3L93,111.1L97.6,108.8L101.9,111.7L101.2,113.5L104.9,112L102,116.4Z M94.3,89L91.8,88.6L91.8,93.6L84.3,88.9L85.5,82.7L90.5,79.6L88.9,82.4L93.9,84.9L94.3,89Z M91.8,93.6L88.4,96.3L92.8,100.5L91.4,105.5L86.7,102.3L82.2,94L87.2,90.1L91.8,93.6Z M92,104.9L94.2,109.7L88.8,137.3L90.1,140.9L92.9,141.3L90.5,143.4L87.5,141.2L87,134L89,131.4L92,104.9Z M99.4,85.7L94.7,89.4L93.9,84.9L90,84.2L89.3,81.2L98.4,81L99.4,85.7Z M92.1,99.2L95.6,98.2L101.5,103.7L101.8,107L93.5,109.6L92.1,99.2Z" fill="#C9B99A" opacity="0.65" stroke="#A89878" stroke-width="0.5"/>
                <!-- Europe -->
                <path d="M155.2,42.5L156.2,49.5L148.7,50.3L146.2,43.5L152.1,40.3L155.2,42.5Z M143.8,56.7L143.3,49.4L152.5,50.9L148.2,57.2L143.8,56.7Z M161.8,36.7L160.8,45L156.2,44.8L155,39.4L157.1,35L161.8,36.7Z M158.7,45.7L161.5,46.2L160.5,49L165.4,53.4L163.4,55.8L158.5,49.2L156.2,49.5L155.7,46.8L158.7,45.7Z M147.4,37.2L145.8,29.4L151.4,38.1L150.5,40.8L145.6,41.9L147.4,37.2Z M169.6,36.5L169,43.1L162.5,40.4L162.3,36.3L169.6,36.5Z M176.5,39L183.4,42.3L181.9,45.5L173.9,47.6L173.9,44.2L168.4,43.8L169.6,39.7L176.5,39Z M187.3,56.6L174.8,57.7L171.8,54.2L177.9,51.4L185.5,51.9L187.3,56.6Z M173.5,47.4L173.8,49.5L169.1,49.3L166.9,46.6L172.2,44.1L173.5,47.4Z M169.1,52.1L172.2,51.9L169,53.1L168.8,57.4L166.8,54L169.1,52.1Z M173.5,33.2L175.7,34.1L176.5,39L169.6,39.7L169.6,36.5L173.5,33.2Z" fill="#C9B99A" opacity="0.6" stroke="#A89878" stroke-width="0.5"/>
                <!-- Africa -->
                <path d="M142.8,66.3L148.9,61.6L149,58.1L156.1,56.7L160,69.9L152.6,73.8L142.8,66.3Z M170.8,71.2L169.9,73.4L158.6,69.1L159.6,60.8L165.9,63.5L167.9,61L170.8,62L170.8,71.2Z M180.7,71.2L170.8,71.2L171,62.3L178.6,62.6L178.5,65.9L176.9,64L180.7,71.2Z M170.5,83.1L168.3,79.4L170.8,71.2L180.7,71.2L182,74.8L178.3,82.7L177.3,79.7L170.5,83.1Z M174.5,93.8L174.8,101.1L168.5,99.3L168.1,96.1L160.1,94.8L163.4,92.9L166.2,85.8L174.8,86.2L174.5,93.8Z M163.6,114.8L166.6,114.7L166.6,111.3L168,113.1L174.5,108.9L177.4,113.1L173.5,118.9L166.4,121L163.6,114.8Z M152.3,84.8L153.6,78.5L162.2,79.9L157.1,86L152.3,84.8Z M182.7,93.9L178.3,90.8L179.4,85.4L184.9,86.7L182.7,93.9Z M178.3,90.8L182.7,93.9L182.9,99.1L178.8,99.7L174.7,95.4L175.4,90.9L178.3,90.8Z M189.8,83.3L183,87.2L177.5,83.5L181.6,77.4L189.8,83.3Z M191.3,100.5L187.8,112.1L186.6,104.7L191.3,100.5Z M148.2,58.7L148.9,61.6L135.8,71.7L145,58.1L148.2,58.7Z" fill="#C9B99A" opacity="0.65" stroke="#A89878" stroke-width="0.5"/>
                <!-- Asia -->
                <path d="M190.9,46.3L188.9,48.4L189.8,52.4L181.3,48.4L183.4,42.3L176.5,39L175.7,34.1L173.5,33.2L173.4,26.3L176.3,22.2L173.8,9.5L176.8,7.5L183.6,12L183.4,15.6L177.7,14.8L180.8,20.4L181,17.9L183,19.1L185.1,15.2L186.6,16L186.2,10.6L188.5,11.3L188.6,14.8L194.8,9.9L195.6,11.7L200,11.3L200.5,7.6L207.1,11.7L205.6,4.7L208.3,-0.8L210.7,1.5L210.4,15.8L212.6,12.4L213.6,4.4L214.7,1.4L217.9,2.8L222.4,-3.4L222.6,-7.1L234,-11.5L237,-16.3L239.4,-11.7L242.6,-12.5L245.1,-9.5L241.2,-4.1L249.2,-1L255.8,-2.3L259.4,5.3L260.2,2.6L266.6,3.5L267.1,-0.2L274.6,1.6L277.5,5.1L282.5,5.1L284.1,8.6L289.9,8.3L291.3,10.3L292.1,7L300,9.7L300,18.2L297.8,18.9L299.4,23.2L291.9,27.4L286.3,27.4L285.1,35.2L280.7,40.5L279.9,32.3L287.1,22.8L283.4,26.3L282.8,24.2L280.6,24.8L279.2,28.6L268.5,28.8L262.6,35.3L266.6,36.1L267.8,38.8L261.3,50.5L259,51.2L259.2,48L262.5,43.7L259.2,44.6L253,37.1L248.2,42.4L240.4,42.7L232.4,39.1L231.1,42.2L226.9,40.7L222.8,42.8L216.7,40.7L214.1,35.7L211.2,37.1L207.6,34.4L201.2,36.4L201.1,40.7L193.6,39.5L189.6,41.2L188.7,43.8L190.9,46.3Z M222.8,42.8L216.6,48.1L216.9,51L211.8,50L207.2,52.9L198.8,47.3L196.6,48L196.7,52.2L193.7,51.7L191.9,48.4L194.2,45.8L190.9,46.3L188.7,43.8L192.3,39.6L201.1,40.7L201.2,36.4L207.6,34.4L211.2,37.1L214.1,35.7L216.7,40.7L222.8,42.8Z M216.9,51L216.6,48.1L223.1,42.7L230.3,50.6L241.1,50.8L249.7,45.9L246.2,44.2L251.9,37.2L255,38.1L259.2,44.6L262.5,43.7L258.9,51L248,55L252,56.3L249.3,59L251.4,65.5L241.6,72.8L237.8,70L232.7,71.1L230.1,64.3L224,66.4L215.6,62.3L211.4,54.2L216.9,51Z M179.1,64.4L182.7,61.7L190.4,65.2L193.3,70.3L196,70.6L195.8,73L185.6,76.2L179.1,64.4Z M190.5,63.9L186.8,54.2L193.6,57.1L197.8,55.7L200.9,57.3L202.8,66.9L197.8,67.8L190.5,63.9Z" fill="#C9B99A" opacity="0.65" stroke="#A89878" stroke-width="0.5"/>
                <!-- Oceania -->
                <path d="M255.1,118.4L245.9,120.3L245.1,108.6L250.7,106.7L254.7,102L258,102.6L260.3,99.3L263.7,99.9L262.9,102.6L266.8,105L268.8,98.9L277.6,112.5L275,123.6L269.7,125.1L264,121.4L264.8,119L263.3,121L260.8,118.1L255.1,118.4Z" fill="#C9B99A" opacity="0.6" stroke="#A89878" stroke-width="0.5"/>
                <!-- Coffee belt highlights (over tropical regions) -->
                <ellipse cx="97" cy="97" rx="11" ry="9" fill="#C17A3A" opacity="0.45">
                  <animate attributeName="opacity" values="0.45;0.65;0.45" dur="4s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="170" cy="88" rx="9" ry="13" fill="#C17A3A" opacity="0.45">
                  <animate attributeName="opacity" values="0.45;0.65;0.45" dur="4s" begin="1.3s" repeatCount="indefinite"/>
                </ellipse>
                <ellipse cx="235" cy="72" rx="18" ry="8" fill="#C17A3A" opacity="0.38">
                  <animate attributeName="opacity" values="0.38;0.58;0.38" dur="4s" begin="2.6s" repeatCount="indefinite"/>
                </ellipse>
              </g>
            </svg>

          {:else if frame.id === 'methods'}
            <svg viewBox="0 0 300 180" class="piece-preview" aria-label="Brewing constellations preview">
              <defs>
                <linearGradient id="mini-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0B1525"/>
                  <stop offset="100%" stop-color="#1A2A3D"/>
                </linearGradient>
              </defs>
              <rect width="300" height="180" fill="url(#mini-sky)" rx="1"/>
              <!-- Field stars -->
              {#each [
                {x:22,y:18,r:0.7,o:0.3},{x:88,y:12,r:0.5,o:0.25},{x:178,y:22,r:0.6,o:0.3},
                {x:248,y:15,r:0.5,o:0.25},{x:268,y:55,r:0.6,o:0.2},{x:12,y:115,r:0.6,o:0.25},
                {x:138,y:152,r:0.5,o:0.3},{x:282,y:140,r:0.5,o:0.25},{x:55,y:150,r:0.4,o:0.2},
                {x:210,y:158,r:0.5,o:0.2},{x:120,y:10,r:0.4,o:0.2},{x:195,y:148,r:0.4,o:0.2},
              ] as s}
                <circle cx={s.x} cy={s.y} r={s.r} fill="#E8E0D0" opacity={s.o}/>
              {/each}
              <!-- Constellation 1: Percolation funnel (left) -->
              <line x1="40" y1="48" x2="82" y2="44" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="82" y1="44" x2="62" y2="78" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="40" y1="48" x2="62" y2="78" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="62" y1="78" x2="62" y2="115" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="62" y1="115" x2="48" y2="135" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <circle cx="40" cy="48" r="2.2" fill="#E8C36A" opacity="0.8"/>
              <circle cx="82" cy="44" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="62" cy="78" r="3" fill="#D4A44C" opacity="0.9"/>
              <circle cx="62" cy="115" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="48" cy="135" r="1.8" fill="#E8C36A" opacity="0.7"/>
              <!-- Constellation 2: Immersion vessel (center) -->
              <line x1="128" y1="48" x2="172" y2="48" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="128" y1="48" x2="122" y2="90" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="172" y1="48" x2="178" y2="90" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="122" y1="90" x2="150" y2="122" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="178" y1="90" x2="150" y2="122" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <circle cx="128" cy="48" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="172" cy="48" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="150" cy="85" r="3" fill="#D4A44C" opacity="0.9"/>
              <circle cx="122" cy="90" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="178" cy="90" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="150" cy="122" r="2" fill="#E8C36A" opacity="0.75"/>
              <!-- Constellation 3: Pressure arrow (right) -->
              <line x1="222" y1="45" x2="258" y2="80" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="258" y1="80" x2="222" y2="118" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <line x1="238" y1="62" x2="258" y2="80" stroke="#C9A84E" stroke-width="0.6" opacity="0.4"/>
              <circle cx="222" cy="45" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="258" cy="80" r="3" fill="#D4A44C" opacity="0.9"/>
              <circle cx="222" cy="118" r="2" fill="#E8C36A" opacity="0.75"/>
              <circle cx="238" cy="62" r="1.8" fill="#E8C36A" opacity="0.7"/>
              <!-- Twinkle on hub star -->
              <circle cx="150" cy="85" r="3" fill="#D4A44C" opacity="0">
                <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/>
              </circle>
            </svg>

          {:else if frame.id === 'flavors'}
            <svg viewBox="0 0 300 180" class="piece-preview" aria-label="Flavor bloom preview">
              <defs>
                {#each [
                  { id: 'mf', c: '#C17A3A', l: '#D4944F' },
                  { id: 'mfl', c: '#B8847A', l: '#CCACA4' },
                  { id: 'ms', c: '#8B6F47', l: '#A6895E' },
                  { id: 'mn', c: '#A69070', l: '#BBA98D' },
                  { id: 'msp', c: '#9B7653', l: '#B3926E' },
                  { id: 'me', c: '#7A7A60', l: '#96967E' },
                ] as g}
                  <radialGradient id={g.id} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color={g.c} stop-opacity="1"/>
                    <stop offset="55%" stop-color={g.c} stop-opacity="0.95"/>
                    <stop offset="85%" stop-color={g.l} stop-opacity="0.6"/>
                    <stop offset="100%" stop-color={g.l} stop-opacity="0.4"/>
                  </radialGradient>
                {/each}
              </defs>
              {#each [
                { fill: 'url(#mf)', angle: 0 },
                { fill: 'url(#mfl)', angle: 60 },
                { fill: 'url(#ms)', angle: 120 },
                { fill: 'url(#mn)', angle: 180 },
                { fill: 'url(#msp)', angle: 240 },
                { fill: 'url(#me)', angle: 300 },
              ] as petal}
                {@const rad = petal.angle * Math.PI / 180}
                {@const px = 150 + 26 * Math.sin(rad)}
                {@const py = 90 - 26 * Math.cos(rad)}
                <ellipse
                  cx={px} cy={py}
                  rx="24" ry="33"
                  fill={petal.fill}
                  transform={`rotate(${petal.angle}, ${px}, ${py})`}
                />
              {/each}
              <!-- Center -->
              <circle cx="150" cy="90" r="9" fill="#F5F0E8" stroke="#C17A3A" stroke-width="0.8"/>
              <g transform="translate(144, 84) scale(0.45)">
                <path d="M12.5 2C9.5 2 6 5 6 10c0 5.5 3.5 9 6.5 9s6.5-3.5 6.5-9c0-5-3.5-8-6.5-8zm0 1.5c0 3.5-1.5 6-1.5 7.5s1.5 4 1.5 7" stroke="#C17A3A" stroke-width="2" fill="none" stroke-linecap="round"/>
              </g>
              <!-- Breathing pulse -->
              <circle cx="150" cy="90" r="9" fill="none" stroke="#C17A3A" stroke-width="0.4" opacity="0">
                <animate attributeName="r" values="9;13;9" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          {/if}
        </div>

        <div class="piece-nameplate">
          <span class="nameplate-title">{frame.title}</span>
          <span class="nameplate-sub">{frame.subtitle}</span>
        </div>
      </a>
    {/each}
  </div>

  <p class="gallery-hint">Select a piece to begin exploring</p>
</div>

<style>
  .gallery-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 2rem 3rem;
    text-align: center;
  }

  .gallery-header {
    margin-bottom: 3rem;
  }

  .gallery-overline {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: #C17A3A;
    display: block;
    margin-bottom: 0.35rem;
  }

  .gallery-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    font-size: 3rem;
    color: #1A1A1A;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .gallery-sub {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.95rem;
    color: #6B6B5E;
    font-style: italic;
  }

  .gallery-wall {
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    align-items: flex-end;
  }

  .gallery-piece {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.4s ease, opacity 0.4s ease;
    outline: none;
  }

  .gallery-piece:hover {
    transform: translateY(-8px);
  }

  .gallery-piece.center-piece:hover {
    transform: translateY(-8px);
  }

  .gallery-piece.dimmed {
    opacity: 0.55;
    transform: scale(0.97);
  }

  .gallery-piece.dimmed.center-piece {
    transform: scale(0.97);
  }

  .piece-frame {
    border: 2.5px solid #2A2520;
    border-radius: 2px;
    padding: 12px 14px 18px;
    position: relative;
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.09),
      inset 0 -2px 6px rgba(0, 0, 0, 0.05),
      inset 3px 0 8px rgba(0, 0, 0, 0.06),
      inset -3px 0 8px rgba(0, 0, 0, 0.06),
      0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.4s ease;
  }

  .gallery-piece:hover .piece-frame {
    box-shadow:
      inset 0 3px 8px rgba(0, 0, 0, 0.09),
      inset 0 -2px 6px rgba(0, 0, 0, 0.05),
      inset 3px 0 8px rgba(0, 0, 0, 0.06),
      inset -3px 0 8px rgba(0, 0, 0, 0.06),
      0 8px 28px rgba(0, 0, 0, 0.14),
      0 0 30px rgba(193, 122, 58, 0.12);
  }

  /* Copper accent line */
  .piece-frame::after {
    content: '';
    position: absolute;
    inset: 3px;
    border: 0.5px solid rgba(193, 122, 58, 0.6);
    border-radius: 1px;
    pointer-events: none;
  }

  /* Inner border */
  .piece-frame::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 0.6px solid #6B5D4E;
    border-radius: 1px;
    pointer-events: none;
  }

  .piece-preview {
    display: block;
    width: 300px;
    height: 180px;
    border-radius: 1px;
  }

  /* Nameplate */
  .piece-nameplate {
    margin-top: 0.85rem;
    background: linear-gradient(180deg, #C5A55A 0%, #B8963E 50%, #A8893E 100%);
    padding: 0.4rem 1.5rem 0.35rem;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border: 0.5px solid #8B7530;
  }

  .nameplate-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.72rem;
    font-weight: 600;
    color: #2A2520;
    display: block;
    line-height: 1.4;
  }

  .nameplate-sub {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.52rem;
    color: #4A3F2F;
    letter-spacing: 0.04em;
    display: block;
    opacity: 0.8;
  }

  .gallery-hint {
    font-family: 'Inter', system-ui, sans-serif;
    color: #9B9590;
    font-size: 0.875rem;
    margin-top: 2.5rem;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .gallery-page { padding: 1.5rem 1rem 2rem; }
    .gallery-header { margin-bottom: 2rem; }
    .gallery-title { font-size: 2.25rem; }
    .gallery-sub { font-size: 0.85rem; }
    .gallery-wall {
      flex-direction: column;
      gap: 2rem;
      align-items: center;
    }
    .gallery-piece.center-piece:hover { transform: translateY(-8px); }
    .piece-preview { width: 280px; height: 168px; }
    .gallery-hint { margin-top: 1.5rem; }
  }
</style>
