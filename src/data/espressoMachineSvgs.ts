export const machineSvgs: Record<string, string> = {
  "Breville Bambino": `<svg width="340" height="400" viewBox="0 0 340 400">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <!-- Convex head gradient (top-to-bottom for curved look) -->
    <linearGradient id="head-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <!-- Vertical body gradient for subtle depth -->
    <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C4C4C4"/>
      <stop offset="50%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#B0B0B0"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="155" cy="387" rx="115" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="52" y="360" width="196" height="22" rx="4" fill="#252525"/>
  <rect x="52" y="360" width="196" height="5" rx="2" fill="#333"/>

  <!-- ======== DRIP TRAY (wider, lozenge slots) ======== -->
  <rect x="54" y="292" width="192" height="68" rx="5" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Lozenge grid plate -->
  <rect x="66" y="300" width="168" height="44" rx="3" fill="#AAAAAA"/>
  <!-- Horizontal lozenge slots — row 1 -->
  <rect x="82" y="306" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="116" y="306" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="150" y="306" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="184" y="306" width="28" height="7" rx="3.5" fill="#949494"/>
  <!-- Row 2 (offset) -->
  <rect x="99" y="318" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="133" y="318" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="167" y="318" width="28" height="7" rx="3.5" fill="#949494"/>
  <!-- Row 3 -->
  <rect x="82" y="330" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="116" y="330" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="150" y="330" width="28" height="7" rx="3.5" fill="#949494"/>
  <rect x="184" y="330" width="28" height="7" rx="3.5" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="54" y="344" width="192" height="16" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (slightly tapered) ======== -->
  <path d="M66 122 L62 292 L246 292 L242 122 Z" fill="url(#steel)" stroke="#B0B0B0" stroke-width="0.3"/>
  <!-- Left shadow -->
  <path d="M66 122 L62 292 L68 292 L72 122 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Right highlight -->
  <path d="M236 122 L240 292 L246 292 L242 122 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Subtle vertical center highlight on body -->
  <path d="M140 130 L138 286 L170 286 L168 130 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== DARK GROUP HEAD CAVE (shadow under overhang) ======== -->
  <!-- Head/body seam shadow line -->
  <line x1="50" y1="124" x2="258" y2="124" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
  <rect x="62" y="122" width="184" height="28" fill="#555" rx="2"/>
  <rect x="62" y="122" width="184" height="12" fill="#4A4A4A" rx="2"/>
  <!-- INSERT / 1 MIN labels -->
  <text x="80" y="140" font-size="5" fill="#777" font-family="sans-serif" letter-spacing="1">INSERT</text>
  <text x="148" y="140" font-size="5" fill="#777" font-family="sans-serif" letter-spacing="1">1 MIN</text>

  <!-- ======== HEAD / BUTTON PANEL (wider than body, convex) ======== -->
  <!-- Head is wider than body — overhang on both sides -->
  <path d="M52 32 Q52 28 56 26 L252 26 Q256 28 256 32 L258 120 Q258 124 254 124 L54 124 Q50 124 50 120 Z" fill="url(#head-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Convex bulge effect (lighter center band) -->
  <path d="M58 58 Q155 52 252 58 L254 100 Q155 106 56 100 Z" fill="rgba(255,255,255,0.06)"/>
  <!-- Left edge shadow on head -->
  <path d="M52 32 L50 120 L58 120 L60 32 Z" fill="rgba(0,0,0,0.05)" rx="2"/>
  <!-- Right edge highlight on head -->
  <path d="M248 32 L250 120 L258 120 L256 32 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== CUP WARMING TRAY (domed top) ======== -->
  <!-- Slightly domed top surface -->
  <path d="M54 28 Q155 20 254 28 L254 32 Q155 26 54 32 Z" fill="#BABABA"/>
  <!-- Rail/fence hint at back -->
  <rect x="54" y="22" width="200" height="4" rx="2" fill="#A8A8A8"/>
  <!-- Ridges on cup tray -->
  <rect x="68" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="80" y="27" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="92" y="26" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="104" y="25.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="116" y="25" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="128" y="24.8" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="140" y="24.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="152" y="24.8" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="164" y="25" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="176" y="25.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="188" y="26" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="200" y="27" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="212" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="224" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="236" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== BREVILLE LOGO ======== -->
  <text x="154" y="62" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2.5">Breville</text>

  <!-- ======== 4 BUTTONS ======== -->
  <!-- Button recesses (subtle shadows behind buttons) -->
  <circle cx="98" cy="89" r="15" fill="rgba(0,0,0,0.08)"/>
  <circle cx="140" cy="89" r="15" fill="rgba(0,0,0,0.08)"/>
  <circle cx="182" cy="89" r="15" fill="rgba(0,0,0,0.08)"/>
  <circle cx="218" cy="89" r="11" fill="rgba(0,0,0,0.08)"/>
  <!-- 1 cup -->
  <circle cx="98" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="98" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <rect x="95" y="83" width="6" height="7" rx="1.5" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="92" y="89.5" width="12" height="1.5" rx="0.75" fill="#808080"/>

  <!-- 2 cup -->
  <circle cx="140" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="140" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <rect x="134" y="83" width="5" height="6" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="141" y="83" width="5" height="6" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="131" y="88.5" width="18" height="1.5" rx="0.75" fill="#808080"/>

  <!-- Steam -->
  <circle cx="182" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="182" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <path d="M179 82 Q176 87.5 179 93" fill="none" stroke="#808080" stroke-width="1" stroke-linecap="round"/>
  <path d="M182 82 Q179 87.5 182 93" fill="none" stroke="#808080" stroke-width="1" stroke-linecap="round"/>
  <path d="M185 82 Q182 87.5 185 93" fill="none" stroke="#808080" stroke-width="1" stroke-linecap="round"/>

  <!-- Hot water / power (smaller) -->
  <circle cx="218" cy="88" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <path d="M218 83 L218 88" stroke="#808080" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M213 85 Q218 80 223 85" fill="none" stroke="#808080" stroke-width="1" stroke-linecap="round"/>

  <!-- ======== PORTAFILTER (mounted under overhang, coming TOWARD viewer) ======== -->
  <!-- Chrome group head ring visible above basket -->
  <ellipse cx="154" cy="137" rx="25" ry="7" fill="#777" stroke="#999" stroke-width="0.8"/>
  <!-- Dark basket — viewed from front, prominent but not oversized -->
  <ellipse cx="154" cy="157" rx="27" ry="25" fill="#333" stroke="#666" stroke-width="1.5"/>
  <ellipse cx="154" cy="157" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="154" cy="157" rx="17" ry="15" fill="#1E1E1E"/>
  <!-- Basket bottom highlight -->
  <ellipse cx="149" cy="150" rx="9" ry="7" fill="rgba(255,255,255,0.06)"/>

  <!-- Spout connector — chrome piece linking basket to spouts -->
  <path d="M144 175 L144 183 Q144 187 148 187 L160 187 Q164 187 164 183 L164 175" fill="#777" stroke="#999" stroke-width="0.5"/>
  <!-- Spout housing — attached under connector -->
  <rect x="142" y="187" width="24" height="10" rx="3" fill="#2A2A2A"/>
  <!-- Dual spouts (chrome, angled slightly outward) -->
  <path d="M148 195 L146 208 Q146 210 149 210 Q152 210 152 208 L152 195 Z" fill="#888" stroke="#999" stroke-width="0.3"/>
  <path d="M157 195 L155 208 Q155 210 158 210 Q161 210 161 208 L163 195 Z" fill="#888" stroke="#999" stroke-width="0.3"/>
  <!-- Spout tip openings -->
  <ellipse cx="149" cy="209" rx="2" ry="1.5" fill="#666"/>
  <ellipse cx="160" cy="209" rx="2" ry="1.5" fill="#666"/>

  <!-- Handle — extends to the RIGHT, foreshortened (coming toward camera) -->
  <line x1="184" y1="157" x2="220" y2="160" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round"/>
  <line x1="184" y1="157" x2="220" y2="160" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <!-- Handle ring at end -->
  <circle cx="224" cy="160" r="7" fill="none" stroke="#2A2A2A" stroke-width="4"/>
  <circle cx="224" cy="160" r="7" fill="none" stroke="#333" stroke-width="2.5"/>

  <!-- ======== STEAM WAND ======== -->
  <!-- Ball joint (prominent sphere) -->
  <circle cx="242" cy="150" r="11" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="242" cy="150" r="6" fill="#A0A0A0"/>
  <circle cx="240" cy="148" r="2" fill="rgba(255,255,255,0.15)"/>

  <!-- Wand arm (thicker, curved down and slightly outward) -->
  <path d="M252 152 Q260 162 264 182 L267 232 L269 282" stroke="#B8B8B8" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M252 152 Q260 162 264 182 L267 232 L269 282" stroke="rgba(255,255,255,0.08)" stroke-width="3" fill="none" stroke-linecap="round"/>

  <!-- Cool-touch rubber sleeve (wraps around wand tube) -->
  <path d="M260 200 Q258 200 258 204 L257 222 Q257 226 260 226 L272 226 Q275 226 275 222 L274 204 Q274 200 272 200 Z" fill="#2A2A2A"/>
  <path d="M261 202 Q260 202 260 205 L259 221 Q259 224 261 224 L271 224 Q273 224 273 221 L272 205 Q272 202 271 202 Z" fill="#333"/>

  <!-- Wand tip (tapered, more pointed) -->
  <path d="M264 282 Q265 278 269 278 Q273 278 274 282 L273 290 Q273 294 269 295 Q265 294 265 290 Z" fill="#A8A8A8"/>
  <ellipse cx="269" cy="280" rx="4" ry="2" fill="#B8B8B8"/>
  <!-- Steam holes -->
  <circle cx="268" cy="293" r="1" fill="#888"/>
  <circle cx="270" cy="293" r="1" fill="#888"/>

  <!-- ======== MILK JUG (beside machine, right) ======== -->
  <path d="M280 352 L282 262 Q282 254 290 250 L304 250 Q312 254 312 262 L314 352 Q314 360 297 362 Q280 360 280 352 Z" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Jug handle -->
  <path d="M312 260 Q326 270 326 308 Q326 342 314 352" stroke="#B8B8B8" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <!-- Jug pour spout -->
  <path d="M284 254 Q280 246 276 242" stroke="#C8C8C8" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Jug highlight -->
  <line x1="288" y1="257" x2="288" y2="350" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <!-- Jug interior shadow -->
  <ellipse cx="297" cy="252" rx="12" ry="3" fill="rgba(0,0,0,0.1)"/>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="238" y="132" width="18" height="155" rx="4" fill="rgba(150,180,210,0.08)" stroke="rgba(150,180,210,0.1)" stroke-width="0.5"/>
</svg>`,
  "Breville Bambino Plus": `<svg width="340" height="400" viewBox="0 0 340 400">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <!-- Convex head gradient (top-to-bottom for curved look) -->
    <linearGradient id="head-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <!-- Auto-frother wand gradient -->
    <linearGradient id="wand-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="40%" stop-color="#B8B8B8"/>
      <stop offset="60%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="155" cy="385" rx="110" ry="12" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="52" y="358" width="196" height="22" rx="4" fill="#252525"/>
  <rect x="52" y="358" width="196" height="5" rx="2" fill="#333"/>

  <!-- ======== DRIP TRAY (dense horizontal ridges + smaller circular holes — Bambino Plus style) ======== -->
  <rect x="54" y="290" width="192" height="68" rx="5" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Grid plate background -->
  <rect x="66" y="298" width="168" height="44" rx="3" fill="#A8A8A8"/>
  <!-- Dense horizontal ridges (thinner, closer together) -->
  <line x1="70" y1="301" x2="230" y2="301" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="304" x2="230" y2="304" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="307" x2="230" y2="307" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="310" x2="230" y2="310" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="313" x2="230" y2="313" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="316" x2="230" y2="316" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="319" x2="230" y2="319" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="322" x2="230" y2="322" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="325" x2="230" y2="325" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="328" x2="230" y2="328" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="331" x2="230" y2="331" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="334" x2="230" y2="334" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="337" x2="230" y2="337" stroke="#9D9D9D" stroke-width="1"/>
  <line x1="70" y1="340" x2="230" y2="340" stroke="#9D9D9D" stroke-width="1"/>
  <!-- Circular drain holes (smaller, subtler) -->
  <circle cx="120" cy="324" r="6" fill="#929292"/>
  <circle cx="120" cy="324" r="4.5" fill="#989898"/>
  <circle cx="150" cy="324" r="6" fill="#929292"/>
  <circle cx="150" cy="324" r="4.5" fill="#989898"/>
  <circle cx="180" cy="324" r="6" fill="#929292"/>
  <circle cx="180" cy="324" r="4.5" fill="#989898"/>
  <circle cx="135" cy="310" r="5.5" fill="#929292"/>
  <circle cx="135" cy="310" r="4" fill="#989898"/>
  <circle cx="165" cy="310" r="5.5" fill="#929292"/>
  <circle cx="165" cy="310" r="4" fill="#989898"/>
  <!-- Tray front lip -->
  <rect x="54" y="342" width="192" height="16" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (slightly tapered, shorter) ======== -->
  <path d="M66 120 L62 290 L246 290 L242 120 Z" fill="url(#steel)" stroke="#B0B0B0" stroke-width="0.3"/>
  <!-- Left shadow -->
  <path d="M66 120 L62 290 L68 290 L72 120 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Right highlight -->
  <path d="M236 120 L240 290 L246 290 L242 120 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Diagonal reflection across body (characteristic Bambino Plus stainless reflection) -->
  <path d="M80 180 L120 290 L140 290 L100 180 Z" fill="rgba(255,255,255,0.04)"/>
  <path d="M100 180 L140 290 L145 290 L105 180 Z" fill="rgba(255,255,255,0.06)"/>
  <path d="M105 180 L145 290 L160 290 L120 180 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== DARK GROUP HEAD CAVE (shadow under overhang) ======== -->
  <rect x="62" y="120" width="184" height="28" fill="#555" rx="2"/>
  <rect x="62" y="120" width="184" height="12" fill="#4A4A4A" rx="2"/>
  <!-- INSERT / LOCK labels -->
  <text x="80" y="138" font-size="5" fill="#888" font-family="sans-serif" letter-spacing="1">INSERT</text>
  <text x="148" y="138" font-size="5" fill="#888" font-family="sans-serif" letter-spacing="1">LOCK</text>
  <!-- Small red indicator dot on left side -->
  <circle cx="72" cy="135" r="2" fill="#CC3333"/>
  <circle cx="72" cy="135" r="1" fill="#FF4444"/>

  <!-- ======== HEAD / BUTTON PANEL (wider than body, convex) ======== -->
  <!-- Head is wider than body — overhang on both sides -->
  <path d="M52 32 Q52 28 56 26 L252 26 Q256 28 256 32 L258 118 Q258 122 254 122 L54 122 Q50 122 50 118 Z" fill="url(#head-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Convex bulge effect (lighter center band) -->
  <path d="M58 60 Q155 55 252 60 L254 100 Q155 105 56 100 Z" fill="rgba(255,255,255,0.06)"/>
  <!-- Left edge shadow on head -->
  <path d="M52 32 L50 118 L58 118 L60 32 Z" fill="rgba(0,0,0,0.05)" rx="2"/>

  <!-- ======== CUP WARMING TRAY (domed top) ======== -->
  <!-- Slightly domed top surface -->
  <path d="M54 28 Q155 20 254 28 L254 32 Q155 26 54 32 Z" fill="#BABABA"/>
  <!-- Rail/fence hint at back -->
  <rect x="54" y="22" width="200" height="4" rx="2" fill="#A8A8A8"/>
  <!-- Ridges on cup tray -->
  <rect x="68" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="80" y="27" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="92" y="26" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="104" y="25.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="116" y="25" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="128" y="24.8" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="140" y="24.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="152" y="24.8" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="164" y="25" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="176" y="25.5" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="188" y="26" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="200" y="27" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="212" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="224" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="236" y="28" width="6" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== BREVILLE LOGO ======== -->
  <text x="154" y="62" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2.5">Breville</text>

  <!-- ======== 4 BUTTONS ======== -->
  <!-- 1 cup -->
  <circle cx="98" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="98" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <rect x="95" y="83" width="6" height="7" rx="1.5" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="92" y="89.5" width="12" height="1.5" rx="0.75" fill="#808080"/>

  <!-- 2 cup -->
  <circle cx="140" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="140" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <rect x="134" y="83" width="5" height="6" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="141" y="83" width="5" height="6" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="131" y="88.5" width="18" height="1.5" rx="0.75" fill="#808080"/>

  <!-- Steam / auto-froth -->
  <circle cx="182" cy="88" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="182" cy="88" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <path d="M182 81 Q178 87 182 93 Q186 87 182 81 Z" fill="none" stroke="#808080" stroke-width="1"/>

  <!-- LED indicator dot between steam and power -->
  <circle cx="200" cy="88" r="2.5" fill="#CC3333"/>
  <circle cx="200" cy="88" r="1.5" fill="#FF4444"/>

  <!-- Hot water / power (smaller) -->
  <circle cx="218" cy="88" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <path d="M218 83 L218 88" stroke="#808080" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M213 85 Q218 80 223 85" fill="none" stroke="#808080" stroke-width="1" stroke-linecap="round"/>

  <!-- ======== PORTAFILTER (mounted under overhang, coming TOWARD viewer) ======== -->
  <!-- Dark basket — viewed from front, prominent but not oversized -->
  <ellipse cx="154" cy="155" rx="26" ry="24" fill="#333" stroke="#666" stroke-width="1.5"/>
  <ellipse cx="154" cy="155" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="154" cy="155" rx="17" ry="15" fill="#1E1E1E"/>
  <!-- Basket bottom highlight -->
  <ellipse cx="149" cy="149" rx="9" ry="7" fill="rgba(255,255,255,0.06)"/>
  <!-- Chrome group head ring visible above basket -->
  <ellipse cx="154" cy="135" rx="24" ry="7" fill="#777" stroke="#999" stroke-width="0.8"/>

  <!-- Spout connector — chrome piece linking basket to spouts -->
  <path d="M144 172 L144 180 Q144 184 148 184 L160 184 Q164 184 164 180 L164 172" fill="#777" stroke="#999" stroke-width="0.5"/>
  <!-- Spout housing — attached under connector -->
  <rect x="142" y="184" width="24" height="10" rx="3" fill="#2A2A2A"/>
  <!-- Dual spouts -->
  <rect x="146" y="192" width="6" height="14" rx="2.5" fill="#222"/>
  <rect x="157" y="192" width="6" height="14" rx="2.5" fill="#222"/>

  <!-- Handle — extends to the LEFT (Bambino Plus front view) -->
  <line x1="124" y1="155" x2="86" y2="158" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round"/>
  <line x1="124" y1="155" x2="86" y2="158" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <!-- Handle ring at end -->
  <circle cx="82" cy="158" r="7" fill="none" stroke="#2A2A2A" stroke-width="4"/>
  <circle cx="82" cy="158" r="7" fill="none" stroke="#333" stroke-width="2.5"/>

  <!-- ======== AUTOMATIC STEAM WAND (Bambino Plus distinctive feature) ======== -->
  <!-- Wand mount — flush chrome fitting emerging from right side of body -->
  <rect x="238" y="136" width="12" height="18" rx="2" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Connection plate -->
  <rect x="240" y="140" width="14" height="10" rx="2" fill="#A0A0A0" stroke="#999" stroke-width="0.3"/>
  <!-- Small chrome selector dial -->
  <circle cx="248" cy="145" r="4" fill="#A8A8A8" stroke="#888" stroke-width="0.5"/>
  <circle cx="247" cy="144" r="1.2" fill="rgba(255,255,255,0.2)"/>

  <!-- Wand arm — straight vertical for auto-frother (key Bambino Plus identifier) -->
  <path d="M252 148 L254 170 L254 250" stroke="url(#wand-grad)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M252 148 L254 170 L254 250" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Auto-frother attachment — distinctive black cylindrical piece with ridged grip -->
  <rect x="246" y="248" width="16" height="34" rx="6" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Ridged texture bands on auto-frother -->
  <rect x="248" y="253" width="12" height="3" rx="1" fill="#383838"/>
  <rect x="248" y="259" width="12" height="3" rx="1" fill="#383838"/>
  <rect x="248" y="265" width="12" height="3" rx="1" fill="#383838"/>
  <rect x="248" y="271" width="12" height="3" rx="1" fill="#383838"/>
  <!-- Auto-frother nozzle tip -->
  <ellipse cx="254" cy="284" rx="5" ry="3" fill="#333"/>
  <circle cx="254" cy="285" r="1.5" fill="#444"/>

  <!-- ======== MILK JUG (positioned under auto wand, on drip tray — larger) ======== -->
  <path d="M264 354 L266 280 Q266 270 276 266 L296 266 Q306 270 306 280 L308 354 Q308 362 287 364 Q264 362 264 354 Z" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Jug handle -->
  <path d="M306 278 Q322 290 322 320 Q322 350 308 354" stroke="#B8B8B8" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <!-- Jug pour spout -->
  <path d="M268 270 Q264 262 260 258" stroke="#C8C8C8" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Jug highlight -->
  <line x1="274" y1="273" x2="274" y2="352" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <!-- Jug interior shadow -->
  <ellipse cx="287" cy="268" rx="14" ry="3.5" fill="rgba(0,0,0,0.1)"/>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="236" y="160" width="18" height="125" rx="4" fill="rgba(150,180,210,0.08)" stroke="rgba(150,180,210,0.1)" stroke-width="0.5"/>
</svg>`,
  "De'Longhi Dedica Deluxe": `<svg width="280" height="450" viewBox="0 0 280 450">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="head-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="30%" stop-color="#D4D4D4"/>
      <stop offset="60%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#AAAAAA"/>
    </linearGradient>
    <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#B8B8B8"/>
      <stop offset="30%" stop-color="#CCCCCC"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <radialGradient id="dial-grad" cx="0.45" cy="0.4" r="0.55">
      <stop offset="0%" stop-color="#E8E8E8"/>
      <stop offset="50%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </radialGradient>
    <linearGradient id="base-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#333"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="120" cy="430" rx="90" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE (curved) ======== -->
  <path d="M55 395 Q55 415 60 420 L60 425 Q120 435 180 425 L180 420 Q185 415 185 395 Z" fill="url(#base-grad)"/>
  <!-- Base top rim -->
  <path d="M55 395 Q120 388 185 395 Q120 402 55 395 Z" fill="#3A3A3A"/>
  <!-- DEDICA text on base -->
  <text x="120" y="418" text-anchor="middle" font-size="7" font-family="Arial, sans-serif" fill="#555" letter-spacing="3" font-weight="300">DEDICA</text>

  <!-- ======== DRIP TRAY ======== -->
  <rect x="62" y="348" width="116" height="50" rx="4" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Tray grid -->
  <rect x="72" y="354" width="96" height="30" rx="2" fill="#AAAAAA"/>
  <!-- Lozenge slots -->
  <rect x="80" y="360" width="20" height="6" rx="3" fill="#949494"/>
  <rect x="110" y="360" width="20" height="6" rx="3" fill="#949494"/>
  <rect x="140" y="360" width="20" height="6" rx="3" fill="#949494"/>
  <rect x="95" y="370" width="20" height="6" rx="3" fill="#949494"/>
  <rect x="125" y="370" width="20" height="6" rx="3" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="62" y="384" width="116" height="14" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY COLUMN (tall, narrow, slight taper) ======== -->
  <path d="M70 135 L66 348 L174 348 L170 135 Z" fill="url(#body-grad)" stroke="#B0B0B0" stroke-width="0.3"/>
  <!-- Left edge shadow -->
  <path d="M70 135 L66 348 L72 348 L76 135 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <path d="M164 135 L168 348 L174 348 L170 135 Z" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== GROUP HEAD AREA (dark recess under dome) ======== -->
  <rect x="66" y="130" width="108" height="24" fill="#555" rx="2"/>
  <rect x="66" y="130" width="108" height="10" fill="#4A4A4A" rx="2"/>

  <!-- ======== DOMED HEAD SECTION ======== -->
  <!-- The dome: wider than body, rounded top with pronounced dome arc -->
  <path d="M52 65 Q52 35 70 25 Q120 15 170 25 Q188 35 188 65 L188 128 Q188 134 184 134 L56 134 Q52 134 52 128 Z" fill="url(#head-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Convex bulge highlight -->
  <path d="M60 70 Q120 65 180 70 L182 110 Q120 115 58 110 Z" fill="rgba(255,255,255,0.05)"/>
  <!-- Left shadow on dome -->
  <path d="M52 65 L52 128 L60 128 L60 65 Z" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== CUP WARMING TRAY (domed top with ridges) ======== -->
  <path d="M65 27 Q120 16 175 27 L175 31 Q120 22 65 31 Z" fill="#BABABA"/>
  <!-- Back rail -->
  <rect x="70" y="14" width="100" height="5" rx="2" fill="#A8A8A8"/>
  <!-- Ridges -->
  <rect x="80" y="22" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="92" y="20" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="104" y="19" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="116" y="18" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="128" y="18" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="140" y="19" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="152" y="20" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="164" y="22" width="5" height="6" rx="1" fill="rgba(0,0,0,0.06)"/>

  <!-- ======== DE'LONGHI LOGO (oval badge) ======== -->
  <ellipse cx="120" cy="72" rx="32" ry="12" fill="#333" stroke="#666" stroke-width="0.8"/>
  <ellipse cx="120" cy="72" rx="29" ry="10" fill="#2A2A2A"/>
  <text x="120" y="75" text-anchor="middle" font-size="10" font-family="Georgia, serif" fill="#C0C0C0" font-weight="700" letter-spacing="0.5">De'Longhi</text>

  <!-- ======== 3 BUTTONS (1-cup, 2-cup, steam) ======== -->
  <!-- 1-cup button -->
  <circle cx="88" cy="100" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="88" cy="100" r="10" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.5"/>
  <circle cx="88" cy="100" r="7.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.4"/>
  <rect x="86" y="96" width="4" height="5" rx="1" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="84" y="101" width="8" height="1.2" rx="0.6" fill="#777"/>
  <!-- Button top highlight -->
  <ellipse cx="86" cy="96" rx="5" ry="3" fill="rgba(255,255,255,0.06)"/>

  <!-- 2-cup button -->
  <circle cx="120" cy="100" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="120" cy="100" r="10" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.5"/>
  <circle cx="120" cy="100" r="7.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.4"/>
  <rect x="116" y="96" width="3.5" height="4.5" rx="0.8" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="121" y="96" width="3.5" height="4.5" rx="0.8" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="114" y="100.5" width="12" height="1.2" rx="0.6" fill="#777"/>
  <ellipse cx="118" cy="96" rx="5" ry="3" fill="rgba(255,255,255,0.06)"/>

  <!-- Steam button -->
  <circle cx="152" cy="100" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="152" cy="100" r="10" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.5"/>
  <circle cx="152" cy="100" r="7.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.4"/>
  <path d="M152 94 Q149 100 152 106 Q155 100 152 94 Z" fill="none" stroke="#777" stroke-width="0.8"/>
  <ellipse cx="150" cy="96" rx="5" ry="3" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== STEAM DIAL KNOB (right side of head) ======== -->
  <!-- Knob shadow -->
  <circle cx="191" cy="82" r="12" fill="rgba(0,0,0,0.15)"/>
  <circle cx="190" cy="80" r="12" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="190" cy="80" r="9" fill="#999" stroke="#888" stroke-width="0.3"/>
  <!-- Inner circle detail -->
  <circle cx="190" cy="80" r="4" fill="#A8A8A8"/>
  <!-- Grip ridges (more prominent) -->
  <line x1="197" y1="72" x2="200" y2="74" stroke="#777" stroke-width="1"/>
  <line x1="199" y1="76" x2="202" y2="78" stroke="#777" stroke-width="1"/>
  <line x1="199" y1="81" x2="202" y2="83" stroke="#777" stroke-width="1"/>
  <line x1="197" y1="86" x2="200" y2="88" stroke="#777" stroke-width="1"/>
  <!-- Dial highlight -->
  <circle cx="187" cy="77" r="3" fill="rgba(255,255,255,0.12)"/>

  <!-- ======== GROUP HEAD CHROME RING ======== -->
  <!-- Shadow behind the chrome ring for depth -->
  <ellipse cx="120" cy="147" rx="30" ry="9" fill="rgba(0,0,0,0.2)"/>
  <ellipse cx="120" cy="145" rx="28" ry="8" fill="#777" stroke="#999" stroke-width="0.8"/>
  <!-- Chrome ring highlight -->
  <ellipse cx="115" cy="143" rx="14" ry="3" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== PORTAFILTER ======== -->
  <!-- Locking collar shadow -->
  <ellipse cx="120" cy="153" rx="26" ry="5" fill="rgba(0,0,0,0.15)"/>
  <!-- Basket front view -->
  <ellipse cx="120" cy="165" rx="24" ry="22" fill="#333" stroke="#666" stroke-width="1.5"/>
  <ellipse cx="120" cy="165" rx="20" ry="18" fill="#2A2A2A"/>
  <ellipse cx="120" cy="165" rx="15" ry="13" fill="#1E1E1E"/>
  <ellipse cx="116" cy="160" rx="8" ry="6" fill="rgba(255,255,255,0.05)"/>

  <!-- ======== LARGE PORTAFILTER DIAL (prominent, center body) ======== -->
  <circle cx="120" cy="250" r="20" fill="url(#dial-grad)" stroke="#AAA" stroke-width="0.8"/>
  <circle cx="120" cy="250" r="16" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.4"/>
  <circle cx="120" cy="250" r="6" fill="#BBB"/>
  <!-- Dial highlight -->
  <circle cx="116" cy="246" r="5" fill="rgba(255,255,255,0.08)"/>

  <!-- Spout area (minimal — barely visible from front) -->
  <path d="M114 183 L114 192 Q114 195 118 195 L122 195 Q126 195 126 192 L126 183" fill="#555" stroke="#777" stroke-width="0.4"/>
  <!-- Small dual spout tips -->
  <rect x="115" y="195" width="4" height="6" rx="1.5" fill="#333"/>
  <rect x="121" y="195" width="4" height="6" rx="1.5" fill="#333"/>

  <!-- ======== PORTAFILTER HANDLE (extends left) ======== -->
  <line x1="95" y1="165" x2="50" y2="170" stroke="#2A2A2A" stroke-width="10" stroke-linecap="round"/>
  <line x1="95" y1="165" x2="50" y2="170" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <!-- Handle end -->
  <circle cx="46" cy="170" r="6" fill="none" stroke="#2A2A2A" stroke-width="3.5"/>
  <circle cx="46" cy="170" r="6" fill="none" stroke="#333" stroke-width="2"/>

  <!-- ======== PANARELLO STEAM WAND (right side) ======== -->
  <!-- Black joint piece from head -->
  <path d="M188 95 Q196 100 200 120" stroke="#333" stroke-width="7" fill="none" stroke-linecap="round"/>

  <!-- Full chrome tube (continuous from joint through sleeve to tip) -->
  <path d="M200 118 L201 340" stroke="#B8B8B8" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M200 118 L201 340" stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Panarello black plastic sleeve (chunky, prominent, drawn OVER chrome tube) -->
  <rect x="191" y="140" width="20" height="60" rx="7" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- HOT MILK label area -->
  <rect x="194" y="150" width="14" height="12" rx="1.5" fill="#222"/>
  <text x="201" y="158" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">HOT</text>
  <text x="201" y="162" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">MILK</text>
  <!-- CAPPUCCINO label area -->
  <rect x="194" y="170" width="14" height="12" rx="1.5" fill="#222"/>
  <text x="201" y="178" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">CAPPU-</text>
  <text x="201" y="182" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">CCINO</text>

  <!-- Wand tip -->
  <ellipse cx="201" cy="343" rx="4" ry="5" fill="#A8A8A8"/>
  <circle cx="201" cy="345" r="1.2" fill="#888"/>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="168" y="145" width="12" height="195" rx="3" fill="rgba(150,180,210,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
</svg>`,
  "Gaggia Classic Pro": `<svg width="360" height="420" viewBox="0 0 360 420">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="175" cy="405" rx="120" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE / DRIP TRAY ======== -->
  <rect x="42" y="320" width="260" height="80" rx="4" fill="#1E1E1E"/>
  <!-- Base front lip -->
  <rect x="42" y="320" width="260" height="6" rx="2" fill="#333"/>
  <!-- Drip tray slot -->
  <rect x="56" y="335" width="230" height="55" rx="3" fill="#2A2A2A"/>
  <!-- Tray grid (thin horizontal lines) -->
  <rect x="66" y="342" width="210" height="3" rx="1" fill="#383838"/>
  <rect x="66" y="350" width="210" height="3" rx="1" fill="#383838"/>
  <rect x="66" y="358" width="210" height="3" rx="1" fill="#383838"/>
  <rect x="66" y="366" width="210" height="3" rx="1" fill="#383838"/>
  <rect x="66" y="374" width="210" height="3" rx="1" fill="#383838"/>

  <!-- ======== MAIN BODY (boxy, wide) ======== -->
  <rect x="52" y="38" width="240" height="284" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="52" y="38" width="6" height="284" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge -->
  <rect x="286" y="38" width="6" height="284" fill="rgba(255,255,255,0.04)"/>
  <!-- Top edge cap -->
  <rect x="50" y="34" width="244" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== CUP WARMING TRAY ======== -->
  <rect x="54" y="38" width="236" height="12" rx="2" fill="url(#steel-dark)"/>
  <!-- Ridges -->
  <rect x="65" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="76" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="87" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="98" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="109" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="120" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="131" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="142" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="153" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="164" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="175" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="186" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="197" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="208" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="219" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="230" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="241" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="252" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="263" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="274" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>

  <!-- ======== 3 ROCKER SWITCHES (vertical toggle, black — CHUNKY) ======== -->
  <!-- Switch 1 — Power -->
  <rect x="103" y="56" width="34" height="52" rx="5" fill="#1A1A1A" stroke="#444" stroke-width="0.8"/>
  <rect x="106" y="59" width="28" height="22" rx="3" fill="#2E2E2E"/>
  <rect x="106" y="83" width="28" height="22" rx="3" fill="#222"/>
  <!-- Power icon -->
  <circle cx="120" cy="69" r="5" fill="none" stroke="#666" stroke-width="1"/>
  <line x1="120" y1="64" x2="120" y2="69" stroke="#666" stroke-width="1"/>

  <!-- Switch 2 — Brew -->
  <rect x="149" y="56" width="34" height="52" rx="5" fill="#1A1A1A" stroke="#444" stroke-width="0.8"/>
  <rect x="152" y="59" width="28" height="22" rx="3" fill="#2E2E2E"/>
  <rect x="152" y="83" width="28" height="22" rx="3" fill="#222"/>
  <!-- Cup icon -->
  <rect x="162" y="66" width="8" height="7" rx="1.5" fill="none" stroke="#666" stroke-width="1"/>
  <rect x="159" y="72.5" width="14" height="2" rx="1" fill="#666"/>

  <!-- Switch 3 — Steam -->
  <rect x="195" y="56" width="34" height="52" rx="5" fill="#1A1A1A" stroke="#444" stroke-width="0.8"/>
  <rect x="198" y="59" width="28" height="22" rx="3" fill="#2E2E2E"/>
  <rect x="198" y="83" width="28" height="22" rx="3" fill="#222"/>
  <!-- Steam icon -->
  <path d="M210 66 Q207 72 210 78" fill="none" stroke="#666" stroke-width="1"/>
  <path d="M214 65 Q211 71 214 77" fill="none" stroke="#666" stroke-width="1"/>

  <!-- Red indicator lights -->
  <rect x="113" y="112" width="8" height="5" rx="1.5" fill="#CC2222" opacity="0.9"/>
  <rect x="162" y="112" width="8" height="5" rx="1.5" fill="#CC2222" opacity="0.9"/>
  <rect x="208" y="112" width="8" height="5" rx="1.5" fill="#CC2222" opacity="0.9"/>

  <!-- ======== GAGGIA CLASSIC LOGO ======== -->
  <text x="170" y="145" text-anchor="middle" font-size="16" font-family="serif" fill="#888" font-weight="700" letter-spacing="3" font-style="italic">GAGGIA</text>
  <line x1="120" y1="150" x2="222" y2="150" stroke="#888" stroke-width="0.8"/>
  <text x="170" y="162" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#888" letter-spacing="3">CLASSIC</text>

  <!-- ======== STEAM KNOB (right side, large round black dial) ======== -->
  <circle cx="295" cy="108" r="18" fill="#222" stroke="#444" stroke-width="1"/>
  <circle cx="295" cy="108" r="14" fill="#2A2A2A"/>
  <circle cx="295" cy="108" r="10" fill="#333"/>
  <!-- Knob grip ridges -->
  <circle cx="295" cy="108" r="16" fill="none" stroke="#3A3A3A" stroke-width="1" stroke-dasharray="3,3"/>
  <!-- Knob indicator dot -->
  <circle cx="295" cy="96" r="2" fill="#555"/>

  <!-- ======== GROUP HEAD AREA ======== -->
  <!-- Dark recessed area below logo -->
  <rect x="72" y="176" width="200" height="32" fill="#555" rx="2"/>

  <!-- Chrome group head -->
  <ellipse cx="160" cy="188" rx="22" ry="6" fill="#999" stroke="#AAA" stroke-width="0.8"/>
  <!-- Portafilter basket coming toward viewer -->
  <ellipse cx="160" cy="200" rx="24" ry="22" fill="#333" stroke="#555" stroke-width="1"/>
  <ellipse cx="160" cy="200" rx="20" ry="18" fill="#2A2A2A"/>
  <ellipse cx="160" cy="200" rx="15" ry="13" fill="#1E1E1E"/>
  <ellipse cx="155" cy="195" rx="7" ry="5" fill="rgba(255,255,255,0.05)"/>

  <!-- Chrome spout — visible below portafilter, more prominent -->
  <!-- Spout body (chrome, wider than PF basket) -->
  <path d="M145 218 Q148 222 150 230 L170 230 Q172 222 175 218" fill="#999" stroke="#AAA" stroke-width="0.5"/>
  <!-- Two spout tips -->
  <rect x="148" y="230" width="7" height="14" rx="3" fill="#888"/>
  <rect x="161" y="230" width="7" height="14" rx="3" fill="#888"/>
  <!-- Spout tip openings -->
  <circle cx="151.5" cy="243" r="2" fill="#666"/>
  <circle cx="164.5" cy="243" r="2" fill="#666"/>

  <!-- Handle extending LEFT (short, foreshortened) -->
  <line x1="136" y1="198" x2="98" y2="204" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round"/>
  <line x1="136" y1="198" x2="98" y2="204" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <!-- Handle ring -->
  <circle cx="94" cy="205" r="7" fill="none" stroke="#2A2A2A" stroke-width="4"/>
  <circle cx="94" cy="205" r="7" fill="none" stroke="#333" stroke-width="2.5"/>

  <!-- ======== STEAM WAND ======== -->
  <!-- Wand arm from right side of body, angling down -->
  <path d="M280 185 L285 200 L290 260 L292 290" stroke="#B0B0B0" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M280 185 L285 200 L290 260 L292 290" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/>
  <!-- Rubber grip on wand -->
  <rect x="286" y="220" width="10" height="20" rx="3" fill="#2A2A2A"/>
  <!-- Wand tip -->
  <ellipse cx="292" cy="293" rx="4" ry="5" fill="#A0A0A0"/>

  <!-- ======== WATER TANK (visible behind right side) ======== -->
  <rect x="282" y="100" width="22" height="200" rx="4" fill="rgba(40,40,40,0.5)" stroke="rgba(100,100,100,0.2)" stroke-width="0.5"/>
  <!-- MAX line -->
  <text x="290" y="160" font-size="4" fill="rgba(255,255,255,0.15)" font-family="sans-serif">MAX</text>
  <line x1="284" y1="162" x2="302" y2="162" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>

  <!-- ======== ESPRESSO CUPS (optional, adds life) ======== -->
  <!-- Left cup -->
  <path d="M120 310 L122 270 Q122 265 130 264 L148 264 Q156 265 156 270 L158 310 Q158 315 140 316 Q120 315 120 310 Z" fill="rgba(200,200,200,0.08)" stroke="rgba(200,200,200,0.12)" stroke-width="0.5"/>
  <!-- Right cup -->
  <path d="M170 310 L172 270 Q172 265 180 264 L198 264 Q206 265 206 270 L208 310 Q208 315 190 316 Q170 315 170 310 Z" fill="rgba(200,200,200,0.08)" stroke="rgba(200,200,200,0.12)" stroke-width="0.5"/>
  <!-- Coffee in cups -->
  <ellipse cx="139" cy="275" rx="12" ry="4" fill="rgba(140,100,50,0.15)"/>
  <ellipse cx="189" cy="275" rx="12" ry="4" fill="rgba(140,100,50,0.15)"/>
</svg>`,
  "Breville Barista Express": `<svg width="380" height="450" viewBox="0 0 380 450">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <linearGradient id="steel-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <radialGradient id="gauge-face" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#F0F0F0"/>
      <stop offset="80%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#C8C8C8"/>
    </radialGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="chrome-ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#D0D0D0"/>
      <stop offset="40%" stop-color="#ABABAB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="185" cy="438" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (stainless, wide) ======== -->
  <rect x="30" y="370" width="310" height="60" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <rect x="42" y="378" width="286" height="36" rx="2" fill="#AAAAAA"/>
  <!-- Grid lines -->
  <g stroke="#999" stroke-width="0.5">
    <line x1="50" y1="385" x2="320" y2="385"/>
    <line x1="50" y1="392" x2="320" y2="392"/>
    <line x1="50" y1="399" x2="320" y2="399"/>
    <line x1="50" y1="406" x2="320" y2="406"/>
  </g>
  <rect x="30" y="416" width="310" height="14" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (wide, boxy) ======== -->
  <rect x="38" y="72" width="296" height="300" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <rect x="38" y="72" width="8" height="300" fill="rgba(0,0,0,0.06)"/>
  <rect x="326" y="72" width="8" height="300" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== TOP EDGE ======== -->
  <rect x="36" y="68" width="300" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== CUP WARMING TRAY (right side of top) ======== -->
  <rect x="190" y="60" width="136" height="12" rx="2" fill="#B0B0B0" stroke="#999" stroke-width="0.3"/>
  <!-- Tray ridges -->
  <g stroke="#A0A0A0" stroke-width="0.4">
    <line x1="200" y1="63" x2="200" y2="69"/>
    <line x1="210" y1="63" x2="210" y2="69"/>
    <line x1="220" y1="63" x2="220" y2="69"/>
    <line x1="230" y1="63" x2="230" y2="69"/>
    <line x1="240" y1="63" x2="240" y2="69"/>
    <line x1="250" y1="63" x2="250" y2="69"/>
    <line x1="260" y1="63" x2="260" y2="69"/>
    <line x1="270" y1="63" x2="270" y2="69"/>
    <line x1="280" y1="63" x2="280" y2="69"/>
    <line x1="290" y1="63" x2="290" y2="69"/>
    <line x1="300" y1="63" x2="300" y2="69"/>
    <line x1="310" y1="63" x2="310" y2="69"/>
    <line x1="320" y1="63" x2="320" y2="69"/>
  </g>

  <!-- ======== BEAN HOPPER (top-LEFT, ~40% of machine width) ======== -->
  <!-- Hopper base (where it meets the body, left-aligned) -->
  <rect x="62" y="60" width="120" height="14" rx="4" fill="#333" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper cone (widens upward, left-aligned) -->
  <path d="M70 60 L48 20 Q46 6 66 4 L178 4 Q198 6 196 20 L174 60 Z" fill="url(#hopper-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper rim -->
  <ellipse cx="122" cy="6" rx="58" ry="7" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <!-- Coffee beans visible inside (dark brown fill) -->
  <path d="M68 54 L52 24 Q51 10 70 8 L174 8 Q193 10 192 24 L176 54 Z" fill="#3A2010" opacity="0.7"/>
  <!-- Bean texture (oval shapes) -->
  <g fill="#2A1808" opacity="0.8">
    <ellipse cx="90" cy="28" rx="7" ry="4.5" transform="rotate(-15 90 28)"/>
    <ellipse cx="122" cy="22" rx="6" ry="4" transform="rotate(10 122 22)"/>
    <ellipse cx="105" cy="38" rx="6" ry="4" transform="rotate(-5 105 38)"/>
    <ellipse cx="140" cy="30" rx="6" ry="4" transform="rotate(20 140 30)"/>
    <ellipse cx="80" cy="42" rx="5.5" ry="3.5" transform="rotate(-10 80 42)"/>
    <ellipse cx="135" cy="42" rx="5.5" ry="3.5" transform="rotate(5 135 42)"/>
    <ellipse cx="155" cy="36" rx="5" ry="3.5" transform="rotate(15 155 36)"/>
    <ellipse cx="110" cy="48" rx="5" ry="3" transform="rotate(-8 110 48)"/>
    <ellipse cx="150" cy="48" rx="5" ry="3" transform="rotate(12 150 48)"/>
  </g>
  <!-- Hopper lid (clear dome hint) -->
  <ellipse cx="122" cy="6" rx="54" ry="5" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== BREVILLE LOGO ======== -->
  <text x="186" y="88" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2">Breville</text>

  <!-- ======== CONTROL PANEL (horizontal row across upper face) ======== -->
  <!-- Power button (far left, small) -->
  <circle cx="55" cy="112" r="7" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="55" cy="112" r="4.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <text x="55" y="126" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">POWER</text>

  <!-- Grind Amount dial -->
  <circle cx="90" cy="112" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="90" cy="112" r="6.5" fill="#C0C0C0"/>
  <line x1="90" y1="112" x2="90" y2="105" stroke="#888" stroke-width="1" stroke-linecap="round"/>
  <text x="90" y="128" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">GRIND AMT</text>

  <!-- Filter Size dial -->
  <circle cx="125" cy="112" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="125" cy="112" r="6.5" fill="#C0C0C0"/>
  <line x1="125" y1="112" x2="121" y2="106" stroke="#888" stroke-width="1" stroke-linecap="round"/>
  <text x="125" y="128" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">FILTER SIZE</text>

  <!-- ===== PRESSURE GAUGE (center, THE defining visual feature) ===== -->
  <circle cx="178" cy="112" r="22" fill="#555" stroke="#777" stroke-width="1"/>
  <circle cx="178" cy="112" r="19" fill="url(#gauge-face)"/>
  <!-- Gauge markings (arc) -->
  <path d="M162 104 Q178 92 194 104" fill="none" stroke="#999" stroke-width="0.5"/>
  <!-- Pressure zones: green band in optimal espresso range -->
  <path d="M168 99 Q178 94 188 99" fill="none" stroke="#66AA66" stroke-width="3" stroke-linecap="round"/>
  <!-- Gauge tick marks -->
  <line x1="164" y1="106" x2="164" y2="103" stroke="#888" stroke-width="0.5"/>
  <line x1="170" y1="101" x2="171" y2="98" stroke="#888" stroke-width="0.5"/>
  <line x1="178" y1="98" x2="178" y2="95" stroke="#888" stroke-width="0.5"/>
  <line x1="186" y1="101" x2="185" y2="98" stroke="#888" stroke-width="0.5"/>
  <line x1="192" y1="106" x2="192" y2="103" stroke="#888" stroke-width="0.5"/>
  <!-- Needle (red, pointing into optimal range) -->
  <line x1="178" y1="118" x2="182" y2="100" stroke="#CC3333" stroke-width="1.2" stroke-linecap="round"/>
  <!-- Center cap -->
  <circle cx="178" cy="118" r="2.5" fill="#888"/>
  <!-- ESPRESSO RANGE text -->
  <text x="178" y="124" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">ESPRESSO RANGE</text>

  <!-- Program button -->
  <circle cx="228" cy="112" r="7" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="228" cy="112" r="4.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <text x="228" y="126" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">PROGRAM</text>

  <!-- Single shot button -->
  <circle cx="262" cy="108" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="262" cy="108" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <rect x="260" y="104" width="4" height="5" rx="1" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="258" y="109" width="8" height="1" rx="0.5" fill="#777"/>
  <text x="262" y="123" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">SINGLE</text>

  <!-- Double shot button -->
  <circle cx="292" cy="108" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="292" cy="108" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <rect x="288" y="104" width="3.5" height="4.5" rx="0.7" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="293" y="104" width="3.5" height="4.5" rx="0.7" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="286" y="108.5" width="12" height="1" rx="0.5" fill="#777"/>
  <text x="292" y="123" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">DOUBLE</text>

  <!-- Hot Water / Steam knob (far right) -->
  <circle cx="324" cy="112" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="324" cy="112" r="6.5" fill="#C0C0C0"/>
  <line x1="324" y1="112" x2="324" y2="105" stroke="#888" stroke-width="1" stroke-linecap="round"/>
  <text x="324" y="128" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">STEAM/WATER</text>

  <!-- ======== HORIZONTAL DIVIDER ======== -->
  <line x1="38" y1="138" x2="334" y2="138" stroke="#999" stroke-width="0.5"/>

  <!-- ======== GROUP HEAD AREA ======== -->
  <!-- Chrome overhang band across full width -->
  <rect x="44" y="140" width="284" height="14" rx="2" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>

  <!-- ======== LEFT ZONE: GRINDER CHUTE ======== -->
  <!-- Dark recess for grinder output -->
  <rect x="58" y="156" width="90" height="60" rx="3" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <!-- Grinder chute opening (dark rectangular slot) -->
  <rect x="72" y="162" width="60" height="16" rx="2" fill="#1E1E1E" stroke="#444" stroke-width="0.5"/>
  <!-- Chute interior shadow -->
  <rect x="76" y="165" width="52" height="10" rx="1" fill="#111"/>
  <!-- Grind label text -->
  <text x="103" y="190" text-anchor="middle" font-size="3" fill="#666" font-family="sans-serif" letter-spacing="0.3">AUTO - PUSH ONCE</text>
  <text x="103" y="195" text-anchor="middle" font-size="3" fill="#666" font-family="sans-serif" letter-spacing="0.3">MANUAL - PUSH &amp; HOLD</text>
  <text x="103" y="201" text-anchor="middle" font-size="3.5" fill="#777" font-family="sans-serif" font-weight="bold" letter-spacing="0.5">GRIND</text>
  <!-- Small chrome dial/knob near chute -->
  <circle cx="103" cy="212" r="8" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="103" cy="212" r="5" fill="#C0C0C0"/>
  <line x1="103" y1="212" x2="103" y2="206" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>

  <!-- ======== LARGE CHROME DIAL (center of body, between zones) ======== -->
  <circle cx="172" cy="200" r="16" fill="url(#btn-grad)" stroke="#B0B0B0" stroke-width="0.8"/>
  <circle cx="172" cy="200" r="11" fill="#C8C8C8"/>
  <circle cx="172" cy="200" r="7" fill="#B8B8B8" stroke="#A0A0A0" stroke-width="0.3"/>
  <line x1="172" y1="200" x2="172" y2="188" stroke="#888" stroke-width="1.2" stroke-linecap="round"/>

  <!-- ======== CENTER-RIGHT ZONE: GROUP HEAD ======== -->
  <!-- Dark recess for group head -->
  <rect x="196" y="156" width="128" height="60" rx="3" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>

  <!-- Group head chrome lock ring -->
  <ellipse cx="260" cy="178" rx="32" ry="8" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="260" cy="176" rx="30" ry="7.5" fill="url(#chrome-ring)" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="256" cy="174" rx="14" ry="3.5" fill="rgba(255,255,255,0.1)"/>
  <!-- Lock ring notches -->
  <g fill="#999" opacity="0.6">
    <rect x="234" y="174" width="3" height="4" rx="0.5"/>
    <rect x="283" y="174" width="3" height="4" rx="0.5"/>
  </g>

  <!-- ======== PORTAFILTER (basket + dual spouts) ======== -->
  <ellipse cx="260" cy="202" rx="28" ry="26" fill="#333" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="260" cy="202" rx="23" ry="21" fill="#2A2A2A"/>
  <ellipse cx="260" cy="202" rx="17" ry="16" fill="#1E1E1E"/>
  <ellipse cx="256" cy="197" rx="9" ry="7" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector -->
  <path d="M250 224 Q254 232 257 240 L263 240 Q266 232 270 224" fill="#AAA" stroke="#BBB" stroke-width="0.4"/>
  <!-- Dual spouts -->
  <rect x="254" y="240" width="5" height="12" rx="2" fill="#999"/>
  <rect x="262" y="240" width="5" height="12" rx="2" fill="#999"/>

  <!-- Handle extending RIGHT (not left) -->
  <line x1="288" y1="200" x2="340" y2="210" stroke="#2A2A2A" stroke-width="11" stroke-linecap="round"/>
  <line x1="288" y1="200" x2="340" y2="210" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <circle cx="344" cy="211" r="6.5" fill="none" stroke="#2A2A2A" stroke-width="3.5"/>
  <circle cx="344" cy="211" r="6.5" fill="none" stroke="#333" stroke-width="2"/>

  <!-- ======== MAGNETIC TAMPER CRADLE (far left side) ======== -->
  <!-- Cradle recess -->
  <rect x="40" y="160" width="14" height="48" rx="3" fill="#444" stroke="#555" stroke-width="0.3"/>
  <!-- Tamper handle (black, cylindrical) -->
  <rect x="42" y="148" width="10" height="16" rx="4.5" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Tamper body (chrome shaft) -->
  <rect x="44" y="164" width="6" height="34" rx="2" fill="#B0B0B0" stroke="#CCC" stroke-width="0.3"/>
  <line x1="45.5" y1="166" x2="45.5" y2="196" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <!-- Tamper base (chrome disc) -->
  <ellipse cx="47" cy="198" rx="7" ry="3" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>

  <!-- ======== STEAM WAND (right side, commercial style with ball joint) ======== -->
  <!-- Ball joint mount -->
  <circle cx="330" cy="170" r="9" fill="#A8A8A8" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="330" cy="170" r="5.5" fill="#B8B8B8"/>
  <circle cx="328" cy="168" r="2" fill="rgba(255,255,255,0.1)"/>
  <!-- Wand arm (angled down, commercial thickness) -->
  <path d="M334 176 Q340 210 342 270 L344 340" stroke="#C0C0C0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M334 176 Q340 210 342 270 L344 340" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Rubber grip -->
  <rect x="336" y="240" width="12" height="26" rx="4" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Wand tip -->
  <ellipse cx="344" cy="344" rx="5" ry="6" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>

  <!-- ======== LOWER BODY DETAIL ======== -->
  <!-- Subtle horizontal line below group head area -->
  <line x1="44" y1="230" x2="328" y2="230" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>

  <!-- Two espresso glasses hint on drip tray -->
  <g opacity="0.15">
    <rect x="240" y="382" width="20" height="28" rx="2" fill="none" stroke="#FFF" stroke-width="0.8"/>
    <rect x="270" y="382" width="20" height="28" rx="2" fill="none" stroke="#FFF" stroke-width="0.8"/>
  </g>
</svg>`,
  "Breville Barista Express Impress": `<svg width="380" height="450" viewBox="0 0 380 450">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <radialGradient id="gauge-face" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#F0F0F0"/>
      <stop offset="80%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#C8C8C8"/>
    </radialGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="impress-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#A8A8A8"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="steel-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="185" cy="438" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (stainless, wide) ======== -->
  <rect x="30" y="370" width="310" height="60" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <rect x="42" y="378" width="286" height="36" rx="2" fill="#AAAAAA"/>
  <!-- Grid lines -->
  <g stroke="#999" stroke-width="0.5">
    <line x1="50" y1="385" x2="320" y2="385"/><line x1="50" y1="392" x2="320" y2="392"/>
    <line x1="50" y1="399" x2="320" y2="399"/><line x1="50" y1="406" x2="320" y2="406"/>
  </g>
  <rect x="30" y="416" width="310" height="14" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (wide, boxy) ======== -->
  <rect x="38" y="72" width="296" height="300" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left shadow -->
  <rect x="38" y="72" width="8" height="300" fill="rgba(0,0,0,0.06)"/>
  <!-- Right highlight -->
  <rect x="326" y="72" width="8" height="300" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== TOP EDGE ======== -->
  <rect x="36" y="68" width="300" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== CUP WARMING TRAY (top-right, flat stainless area) ======== -->
  <rect x="200" y="58" width="128" height="14" rx="3" fill="#B0B0B0" stroke="#999" stroke-width="0.3"/>
  <!-- Tray ridge lines -->
  <line x1="210" y1="62" x2="320" y2="62" stroke="#A0A0A0" stroke-width="0.4"/>
  <line x1="210" y1="66" x2="320" y2="66" stroke="#A0A0A0" stroke-width="0.4"/>
  <line x1="210" y1="70" x2="320" y2="70" stroke="#A0A0A0" stroke-width="0.4"/>

  <!-- ======== BEAN HOPPER (top-LEFT, large smoked plastic conical hopper) ======== -->
  <!-- Grind size adjustment collar (ring at base of hopper) -->
  <ellipse cx="120" cy="70" rx="44" ry="5" fill="#555" stroke="#666" stroke-width="0.5"/>
  <!-- Collar tick marks -->
  <g stroke="#777" stroke-width="0.3">
    <line x1="80" y1="69" x2="80" y2="71"/><line x1="90" y1="68" x2="90" y2="72"/>
    <line x1="100" y1="67" x2="100" y2="73"/><line x1="110" y1="67" x2="110" y2="73"/>
    <line x1="120" y1="67" x2="120" y2="73"/><line x1="130" y1="67" x2="130" y2="73"/>
    <line x1="140" y1="67" x2="140" y2="73"/><line x1="150" y1="68" x2="150" y2="72"/>
    <line x1="160" y1="69" x2="160" y2="71"/>
  </g>
  <!-- Hopper base (where it meets the body) -->
  <rect x="76" y="58" width="88" height="16" rx="4" fill="#333" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper cone (widens upward, LEFT-positioned) -->
  <path d="M84 58 L62 18 Q60 6 80 4 L170 4 Q190 6 188 18 L166 58 Z" fill="url(#hopper-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper rim -->
  <ellipse cx="125" cy="6" rx="50" ry="7" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <!-- Coffee beans visible inside (dark brown fill through smoked plastic) -->
  <path d="M82 52 L66 22 Q65 10 82 8 L168 8 Q185 10 184 22 L168 52 Z" fill="#3A2010" opacity="0.7"/>
  <!-- Bean texture (oval shapes) -->
  <g fill="#2A1808" opacity="0.8">
    <ellipse cx="100" cy="28" rx="7" ry="4.5" transform="rotate(-15 100 28)"/>
    <ellipse cx="125" cy="22" rx="6" ry="4" transform="rotate(10 125 22)"/>
    <ellipse cx="110" cy="38" rx="6" ry="4" transform="rotate(-5 110 38)"/>
    <ellipse cx="140" cy="30" rx="6" ry="4" transform="rotate(20 140 30)"/>
    <ellipse cx="92" cy="42" rx="5.5" ry="3.5" transform="rotate(-10 92 42)"/>
    <ellipse cx="135" cy="42" rx="5.5" ry="3.5" transform="rotate(5 135 42)"/>
    <ellipse cx="155" cy="36" rx="5" ry="3.5" transform="rotate(15 155 36)"/>
    <ellipse cx="115" cy="48" rx="5" ry="3" transform="rotate(-8 115 48)"/>
    <ellipse cx="150" cy="48" rx="5" ry="3" transform="rotate(12 150 48)"/>
  </g>
  <!-- Hopper lid (clear dome hint) -->
  <ellipse cx="125" cy="6" rx="46" ry="5" fill="rgba(255,255,255,0.06)"/>
  <!-- Smoked plastic sheen -->
  <path d="M82 52 L66 22 Q65 10 82 8 L168 8 Q185 10 184 22 L168 52 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== BREVILLE LOGO (centered on body face) ======== -->
  <text x="186" y="88" text-anchor="middle" font-size="11" font-family="Arial, sans-serif" fill="#999" font-weight="400" letter-spacing="2">Breville</text>

  <!-- ======== CONTROL PANEL (horizontal row across upper face) ======== -->

  <!-- TAMP button (far left) -->
  <circle cx="56" cy="108" r="7" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="56" cy="108" r="4.8" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Down-arrow icon (tamp) -->
  <path d="M54 106 L56 110 L58 106" fill="none" stroke="#777" stroke-width="0.8" stroke-linecap="round"/>
  <line x1="56" y1="104" x2="56" y2="110" stroke="#777" stroke-width="0.7" stroke-linecap="round"/>
  <text x="56" y="121" text-anchor="middle" font-size="3.2" fill="#888" font-family="sans-serif">TAMP</text>

  <!-- FILTER button (next to tamp) -->
  <circle cx="78" cy="108" r="7" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="78" cy="108" r="4.8" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Filter basket icon -->
  <path d="M75 106 L75 110 Q78 112 81 110 L81 106" fill="none" stroke="#777" stroke-width="0.6"/>
  <text x="78" y="121" text-anchor="middle" font-size="3.2" fill="#888" font-family="sans-serif">FILTER</text>

  <!-- AUTO / MANUAL selector toggle -->
  <rect x="94" y="103" width="26" height="10" rx="5" fill="#555" stroke="#777" stroke-width="0.5"/>
  <!-- Toggle indicator (set to AUTO position) -->
  <circle cx="106" cy="108" r="4" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.4"/>
  <text x="100" y="121" text-anchor="middle" font-size="2.5" fill="#888" font-family="sans-serif">AUTO</text>
  <text x="114" y="121" text-anchor="middle" font-size="2.5" fill="#666" font-family="sans-serif">MAN</text>

  <!-- DOSE LEVEL rotary dial (larger/more prominent — key Impress feature) -->
  <circle cx="145" cy="108" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.7"/>
  <circle cx="145" cy="108" r="10" fill="#C0C0C0"/>
  <circle cx="145" cy="108" r="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
  <!-- Dial pointer -->
  <line x1="145" y1="108" x2="145" y2="99" stroke="#777" stroke-width="1.2" stroke-linecap="round"/>
  <!-- Dial notch marks around edge -->
  <g stroke="#999" stroke-width="0.4">
    <line x1="133" y1="102" x2="135" y2="104"/>
    <line x1="145" y1="95" x2="145" y2="97"/>
    <line x1="157" y1="102" x2="155" y2="104"/>
  </g>
  <text x="145" y="128" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">DOSE LEVEL</text>

  <!-- ===== PRESSURE GAUGE / DOSING INDICATOR (center area) ===== -->
  <circle cx="192" cy="108" r="20" fill="#555" stroke="#777" stroke-width="1"/>
  <circle cx="192" cy="108" r="17" fill="url(#gauge-face)"/>
  <!-- Gauge markings (arc) -->
  <path d="M178 101 Q192 91 206 101" fill="none" stroke="#999" stroke-width="0.5"/>
  <!-- Pressure zones: green band in optimal range -->
  <path d="M184 97 Q192 92 200 97" fill="none" stroke="#66AA66" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Gauge tick marks -->
  <line x1="180" y1="103" x2="180" y2="100" stroke="#888" stroke-width="0.5"/>
  <line x1="186" y1="98" x2="187" y2="95" stroke="#888" stroke-width="0.5"/>
  <line x1="192" y1="96" x2="192" y2="93" stroke="#888" stroke-width="0.5"/>
  <line x1="198" y1="98" x2="197" y2="95" stroke="#888" stroke-width="0.5"/>
  <line x1="204" y1="103" x2="204" y2="100" stroke="#888" stroke-width="0.5"/>
  <!-- Needle (red, pointing to optimal) -->
  <line x1="192" y1="115" x2="196" y2="97" stroke="#CC3333" stroke-width="1" stroke-linecap="round"/>
  <!-- Center cap -->
  <circle cx="192" cy="115" r="2.5" fill="#888"/>
  <!-- ESPRESSO RANGE text -->
  <text x="192" y="120" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">ESPRESSO RANGE</text>

  <!-- PROGRAM button -->
  <circle cx="228" cy="108" r="7" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="228" cy="108" r="4.8" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <text x="228" y="121" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif">PROGRAM</text>

  <!-- 1-cup shot button -->
  <circle cx="253" cy="106" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="253" cy="106" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Single cup icon -->
  <rect x="251" y="102" width="4" height="5" rx="1" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="249" y="107" width="8" height="1" rx="0.5" fill="#777"/>
  <text x="253" y="121" text-anchor="middle" font-size="3.2" fill="#888" font-family="sans-serif">SINGLE</text>

  <!-- 2-cup shot button -->
  <circle cx="279" cy="106" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="279" cy="106" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Double cup icon -->
  <rect x="275" y="102" width="3.5" height="4.5" rx="0.7" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="280" y="102" width="3.5" height="4.5" rx="0.7" fill="none" stroke="#777" stroke-width="0.7"/>
  <rect x="273" y="106.5" width="12" height="1" rx="0.5" fill="#777"/>
  <text x="279" y="121" text-anchor="middle" font-size="3.2" fill="#888" font-family="sans-serif">DOUBLE</text>

  <!-- STEAM knob (far right) -->
  <circle cx="312" cy="108" r="10" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.6"/>
  <circle cx="312" cy="108" r="6.5" fill="#C0C0C0"/>
  <line x1="312" y1="108" x2="312" y2="101" stroke="#888" stroke-width="1" stroke-linecap="round"/>
  <text x="312" y="124" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">STEAM</text>

  <!-- ======== HORIZONTAL DIVIDER ======== -->
  <line x1="38" y1="134" x2="334" y2="134" stroke="#999" stroke-width="0.5"/>

  <!-- ======== CHROME OVERHANG BAND (full width) ======== -->
  <rect x="42" y="136" width="288" height="14" rx="2" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>

  <!-- ================================================================ -->
  <!-- LEFT ZONE: GRINDER CHUTE + IMPRESS TAMPING SYSTEM               -->
  <!-- ================================================================ -->

  <!-- Dark recess for grinder/Impress area -->
  <rect x="48" y="150" width="120" height="34" rx="2" fill="#444"/>
  <rect x="48" y="180" width="120" height="4" rx="1" fill="#3A3A3A"/>

  <!-- Grind chute opening -->
  <rect x="78" y="154" width="52" height="12" rx="3" fill="#353535" stroke="#4A4A4A" stroke-width="0.3"/>
  <text x="104" y="162" text-anchor="middle" font-size="3" fill="#555" font-family="sans-serif" letter-spacing="0.5">GRIND</text>

  <!-- Dosing indicator panel with LED dots (shows optimal dose level) -->
  <rect x="54" y="168" width="100" height="12" rx="2" fill="#303030" stroke="#4A4A4A" stroke-width="0.3"/>
  <!-- LED indicator dots -->
  <circle cx="64" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="74" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="84" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="94" cy="174" r="2" fill="#55AA55" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="104" cy="174" r="2" fill="#66BB66" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="114" cy="174" r="2" fill="#55AA55" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="124" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="134" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <circle cx="144" cy="174" r="2" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>
  <!-- LED glow effects on active dots -->
  <circle cx="94" cy="174" r="4" fill="rgba(102,187,102,0.15)"/>
  <circle cx="104" cy="174" r="5" fill="rgba(102,187,102,0.2)"/>
  <circle cx="114" cy="174" r="4" fill="rgba(102,187,102,0.15)"/>
  <!-- DOSE label -->
  <text x="104" y="182" text-anchor="middle" font-size="2.8" fill="#777" font-family="sans-serif" letter-spacing="0.8">OPTIMAL DOSE</text>

  <!-- ======== IMPRESS TAMPING CRADLE (chrome U-shaped arms — KEY DIFFERENTIATOR) ======== -->
  <!-- Cradle mounting plate / top bar -->
  <rect x="62" y="184" width="90" height="8" rx="3" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>
  <rect x="64" y="185" width="86" height="2.5" rx="1" fill="rgba(255,255,255,0.06)"/>

  <!-- Left cradle arm (chrome, thick, extends down) -->
  <path d="M68 191 L68 232 Q68 248 84 252" fill="none" stroke="#A8A8A8" stroke-width="5.5" stroke-linecap="round"/>
  <!-- Right cradle arm (chrome, thick, extends down) -->
  <path d="M146 191 L146 232 Q146 248 130 252" fill="none" stroke="#A8A8A8" stroke-width="5.5" stroke-linecap="round"/>
  <!-- Cradle arm inner highlights -->
  <path d="M71 191 L71 232 Q71 246 85 250" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M143 191 L143 232 Q143 246 129 250" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Cradle bottom catch plate (where portafilter rests during tamping) -->
  <path d="M84 250 Q107 258 130 250" fill="none" stroke="#A0A0A0" stroke-width="3" stroke-linecap="round"/>

  <!-- Impress assisted tamping lever (left side of cradle, prominent) -->
  <rect x="50" y="195" width="14" height="34" rx="5" fill="url(#impress-grad)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Lever top cap highlight -->
  <rect x="51" y="196" width="12" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
  <!-- Lever grip ridges -->
  <line x1="53" y1="210" x2="61" y2="210" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <line x1="53" y1="213" x2="61" y2="213" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <line x1="53" y1="216" x2="61" y2="216" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <line x1="53" y1="219" x2="61" y2="219" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <line x1="53" y1="222" x2="61" y2="222" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <!-- Arrow down indicator (push to tamp) -->
  <path d="M57 226 L57 228" stroke="#777" stroke-width="1" stroke-linecap="round"/>
  <path d="M55 227 L57 230 L59 227" fill="none" stroke="#777" stroke-width="0.6" stroke-linecap="round"/>

  <!-- ================================================================ -->
  <!-- CENTER-RIGHT ZONE: GROUP HEAD + PORTAFILTER                     -->
  <!-- ================================================================ -->

  <!-- Dark recess for group head area -->
  <rect x="170" y="150" width="150" height="34" rx="2" fill="#444"/>
  <rect x="170" y="180" width="150" height="4" rx="1" fill="#3A3A3A"/>

  <!-- ======== GROUP HEAD CHROME RING ======== -->
  <ellipse cx="244" cy="192" rx="28" ry="7" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="244" cy="190" rx="26" ry="6.5" fill="#999" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="240" cy="188" rx="13" ry="3" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== PORTAFILTER ======== -->
  <ellipse cx="244" cy="212" rx="26" ry="24" fill="#333" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="244" cy="212" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="244" cy="212" rx="17" ry="15" fill="#1E1E1E"/>
  <ellipse cx="240" cy="207" rx="9" ry="7" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector (chrome, connecting basket to spouts) -->
  <path d="M234 231 Q238 240 241 248 L247 248 Q250 240 254 231" fill="#AAA" stroke="#BBB" stroke-width="0.4"/>
  <!-- Dual spouts (chrome) -->
  <rect x="238" y="248" width="5" height="13" rx="2" fill="#999"/>
  <rect x="244" y="248" width="5" height="13" rx="2" fill="#999"/>
  <!-- Spout tips -->
  <ellipse cx="240.5" cy="261" rx="2.5" ry="1.5" fill="#888"/>
  <ellipse cx="246.5" cy="261" rx="2.5" ry="1.5" fill="#888"/>

  <!-- Handle extending RIGHT (based on reference photo) -->
  <line x1="270" y1="210" x2="326" y2="216" stroke="#2A2A2A" stroke-width="11" stroke-linecap="round"/>
  <line x1="270" y1="210" x2="326" y2="216" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <!-- Handle end ring -->
  <circle cx="330" cy="217" r="6.5" fill="none" stroke="#2A2A2A" stroke-width="3.5"/>
  <circle cx="330" cy="217" r="6.5" fill="none" stroke="#333" stroke-width="2"/>

  <!-- ======== HOT WATER SPOUT (right side, small chrome nozzle) ======== -->
  <rect x="306" y="154" width="7" height="9" rx="2" fill="#999" stroke="#AAA" stroke-width="0.3"/>
  <rect x="307" y="161" width="5" height="7" rx="1.5" fill="#888"/>
  <text x="310" y="174" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif">HOT</text>

  <!-- ======== STEAM WAND (right side, commercial style) ======== -->
  <!-- Ball joint -->
  <circle cx="328" cy="182" r="10" fill="#A8A8A8" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="328" cy="182" r="6" fill="#B8B8B8"/>
  <circle cx="326" cy="180" r="2.5" fill="rgba(255,255,255,0.12)"/>
  <!-- Wand arm -->
  <path d="M334 190 Q340 214 342 272 L344 342" stroke="#C0C0C0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M334 190 Q340 214 342 272 L344 342" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Rubber grip (textured) -->
  <rect x="336" y="242" width="12" height="28" rx="4" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Grip texture lines -->
  <line x1="338" y1="248" x2="346" y2="248" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <line x1="338" y1="252" x2="346" y2="252" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <line x1="338" y1="256" x2="346" y2="256" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <line x1="338" y1="260" x2="346" y2="260" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <line x1="338" y1="264" x2="346" y2="264" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <!-- Wand tip (bulbous, with steam holes) -->
  <ellipse cx="344" cy="346" rx="5.5" ry="7" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>
  <circle cx="342" cy="348" r="1" fill="#888"/>
  <circle cx="344" cy="350" r="1" fill="#888"/>
  <circle cx="346" cy="348" r="1" fill="#888"/>
  <circle cx="344" cy="346" r="1" fill="#888"/>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="330" y="136" width="14" height="164" rx="4" fill="rgba(150,180,210,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
</svg>`,
  "Rancilio Silvia V6": `<svg width="340" height="420" viewBox="0 0 340 420">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <linearGradient id="tray-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="50%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#909090"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="165" cy="408" rx="120" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (stainless steel, wider than body) ======== -->
  <rect x="38" y="338" width="260" height="65" rx="3" fill="url(#tray-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Tray grid area -->
  <rect x="50" y="346" width="236" height="42" rx="2" fill="#A0A0A0"/>
  <!-- Perforated grid (dot pattern) -->
  <g fill="#909090">
    <!-- Row 1 -->
    <circle cx="68" cy="355" r="2"/><circle cx="82" cy="355" r="2"/><circle cx="96" cy="355" r="2"/>
    <circle cx="110" cy="355" r="2"/><circle cx="124" cy="355" r="2"/><circle cx="138" cy="355" r="2"/>
    <circle cx="152" cy="355" r="2"/><circle cx="166" cy="355" r="2"/><circle cx="180" cy="355" r="2"/>
    <circle cx="194" cy="355" r="2"/><circle cx="208" cy="355" r="2"/><circle cx="222" cy="355" r="2"/>
    <circle cx="236" cy="355" r="2"/><circle cx="250" cy="355" r="2"/><circle cx="264" cy="355" r="2"/>
    <!-- Row 2 -->
    <circle cx="75" cy="367" r="2"/><circle cx="89" cy="367" r="2"/><circle cx="103" cy="367" r="2"/>
    <circle cx="117" cy="367" r="2"/><circle cx="131" cy="367" r="2"/><circle cx="145" cy="367" r="2"/>
    <circle cx="159" cy="367" r="2"/><circle cx="173" cy="367" r="2"/><circle cx="187" cy="367" r="2"/>
    <circle cx="201" cy="367" r="2"/><circle cx="215" cy="367" r="2"/><circle cx="229" cy="367" r="2"/>
    <circle cx="243" cy="367" r="2"/><circle cx="257" cy="367" r="2"/>
    <!-- Row 3 -->
    <circle cx="68" cy="379" r="2"/><circle cx="82" cy="379" r="2"/><circle cx="96" cy="379" r="2"/>
    <circle cx="110" cy="379" r="2"/><circle cx="124" cy="379" r="2"/><circle cx="138" cy="379" r="2"/>
    <circle cx="152" cy="379" r="2"/><circle cx="166" cy="379" r="2"/><circle cx="180" cy="379" r="2"/>
    <circle cx="194" cy="379" r="2"/><circle cx="208" cy="379" r="2"/><circle cx="222" cy="379" r="2"/>
    <circle cx="236" cy="379" r="2"/><circle cx="250" cy="379" r="2"/><circle cx="264" cy="379" r="2"/>
  </g>
  <!-- Tray front lip -->
  <rect x="38" y="390" width="260" height="12" rx="2" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (boxy, rectangular, brushed steel) ======== -->
  <rect x="48" y="38" width="240" height="302" rx="3" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="48" y="38" width="8" height="302" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="280" y="38" width="8" height="302" fill="rgba(255,255,255,0.04)"/>
  <!-- Center vertical highlight (brushed steel reflection) -->
  <rect x="150" y="50" width="30" height="280" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== TOP EDGE CAP ======== -->
  <rect x="46" y="34" width="244" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== CUP WARMING TRAY (flat top) ======== -->
  <rect x="50" y="38" width="236" height="12" rx="2" fill="url(#steel-dark)"/>
  <!-- Ridges -->
  <rect x="62" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="74" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="86" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="98" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="110" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="122" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="134" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="146" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="158" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="170" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="182" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="194" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="206" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="218" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="230" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="242" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="254" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="266" y="40" width="5" height="8" rx="1" fill="rgba(0,0,0,0.06)"/>

  <!-- ======== RANCILIO LOGO BADGE (upper right) ======== -->
  <rect x="182" y="58" width="96" height="22" rx="2" fill="#1A1A1A" stroke="#444" stroke-width="0.5"/>
  <!-- Rancilio R logo mark -->
  <circle cx="197" cy="69" r="6" fill="none" stroke="#C0C0C0" stroke-width="1"/>
  <text x="197" y="72.5" text-anchor="middle" font-size="9" font-family="serif" fill="#C0C0C0" font-weight="700">R</text>
  <!-- RANCILIO text -->
  <text x="243" y="73" text-anchor="middle" font-size="9" font-family="Arial, sans-serif" fill="#C0C0C0" font-weight="600" letter-spacing="1.5">RANCILIO</text>

  <!-- ======== ROCKER SWITCHES (L-shape on LEFT side) ======== -->
  <!-- Top row: Brew (left) + Power (right) -->
  <!-- Brew switch -->
  <rect x="68" y="58" width="28" height="38" rx="3" fill="#1A1A1A" stroke="#444" stroke-width="0.7"/>
  <rect x="71" y="61" width="22" height="15" rx="2" fill="#2E2E2E"/>
  <rect x="71" y="78" width="22" height="15" rx="2" fill="#222"/>
  <!-- Cup icon -->
  <rect x="78" y="65" width="6" height="5.5" rx="1.2" fill="none" stroke="#666" stroke-width="0.8"/>
  <rect x="75" y="70" width="12" height="1.5" rx="0.75" fill="#666"/>
  <!-- Brew indicator light -->
  <rect x="100" y="68" width="8" height="4" rx="1.5" fill="#CC8822" opacity="0.9"/>
  <rect x="98" y="66" width="12" height="8" rx="3" fill="#CC8822" opacity="0.08"/>

  <!-- Power switch -->
  <rect x="114" y="58" width="32" height="38" rx="3" fill="#1A1A1A" stroke="#444" stroke-width="0.7"/>
  <rect x="117" y="61" width="26" height="15" rx="2" fill="#2E2E2E"/>
  <rect x="117" y="78" width="26" height="15" rx="2" fill="#222"/>
  <!-- Power icon -->
  <circle cx="130" cy="68" r="4.5" fill="none" stroke="#666" stroke-width="0.8"/>
  <line x1="130" y1="63.5" x2="130" y2="68" stroke="#666" stroke-width="0.8"/>
  <!-- Power indicator light -->
  <rect x="150" y="68" width="8" height="4" rx="1.5" fill="#CC8822" opacity="0.9"/>
  <rect x="148" y="66" width="12" height="8" rx="3" fill="#CC8822" opacity="0.08"/>

  <!-- Row 2: Hot water switch -->
  <rect x="68" y="102" width="28" height="38" rx="3" fill="#1A1A1A" stroke="#444" stroke-width="0.7"/>
  <rect x="71" y="105" width="22" height="15" rx="2" fill="#2E2E2E"/>
  <rect x="71" y="122" width="22" height="15" rx="2" fill="#222"/>
  <!-- Water drop icon -->
  <path d="M82 110 Q79 116 82 120 Q85 116 82 110 Z" fill="none" stroke="#666" stroke-width="0.8"/>
  <!-- Hot water indicator light -->
  <rect x="100" y="112" width="8" height="4" rx="1.5" fill="#CC8822" opacity="0.9"/>
  <rect x="98" y="110" width="12" height="8" rx="3" fill="#CC8822" opacity="0.08"/>

  <!-- Row 3: Steam switch -->
  <rect x="68" y="146" width="28" height="38" rx="3" fill="#1A1A1A" stroke="#444" stroke-width="0.7"/>
  <rect x="71" y="149" width="22" height="15" rx="2" fill="#2E2E2E"/>
  <rect x="71" y="166" width="22" height="15" rx="2" fill="#222"/>
  <!-- Steam icon -->
  <path d="M79 154 Q76 159 79 164" fill="none" stroke="#666" stroke-width="0.8"/>
  <path d="M83 153 Q80 158 83 163" fill="none" stroke="#666" stroke-width="0.8"/>
  <!-- Steam indicator light -->
  <rect x="100" y="156" width="8" height="4" rx="1.5" fill="#CC8822" opacity="0.9"/>
  <rect x="98" y="154" width="12" height="8" rx="3" fill="#CC8822" opacity="0.08"/>

  <!-- ======== HORIZONTAL DIVIDER (seam between control and group head area) ======== -->
  <line x1="48" y1="192" x2="288" y2="192" stroke="#999" stroke-width="0.5"/>

  <!-- ======== BLACK GROUP HEAD COVER (V6 matte black) ======== -->
  <rect x="68" y="194" width="200" height="40" rx="3" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Subtle brushed texture on cover -->
  <rect x="68" y="194" width="200" height="5" fill="rgba(255,255,255,0.03)" rx="2"/>
  <!-- Bottom edge highlight of cover -->
  <rect x="68" y="230" width="200" height="2" fill="rgba(255,255,255,0.04)" rx="1"/>

  <!-- ======== GROUP HEAD CHROME RING (more defined) ======== -->
  <!-- Visible chrome collar rim -->
  <ellipse cx="165" cy="232" rx="32" ry="8" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="165" cy="230" rx="30" ry="7" fill="#999" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="165" cy="228" rx="28" ry="6" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>
  <ellipse cx="160" cy="226" rx="14" ry="3" fill="rgba(255,255,255,0.1)"/>
  <!-- Locking collar shadow -->
  <ellipse cx="165" cy="236" rx="28" ry="4" fill="rgba(0,0,0,0.15)"/>

  <!-- ======== PORTAFILTER ======== -->
  <!-- Basket front view -->
  <ellipse cx="165" cy="248" rx="26" ry="24" fill="#333" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="165" cy="248" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="165" cy="248" rx="17" ry="15" fill="#1E1E1E"/>
  <ellipse cx="161" cy="243" rx="9" ry="7" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector (chrome, wider) -->
  <path d="M152 267 Q155 273 158 283 L172 283 Q175 273 178 267" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>
  <!-- Dual spouts (chrome, prominent) -->
  <rect x="155" y="283" width="8" height="16" rx="3" fill="#A0A0A0" stroke="#BBB" stroke-width="0.3"/>
  <rect x="167" y="283" width="8" height="16" rx="3" fill="#A0A0A0" stroke="#BBB" stroke-width="0.3"/>
  <!-- Spout openings -->
  <circle cx="159" cy="298" r="2.5" fill="#777"/>
  <circle cx="171" cy="298" r="2.5" fill="#777"/>
  <!-- Spout highlights -->
  <line x1="157" y1="285" x2="157" y2="297" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="169" y1="285" x2="169" y2="297" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Handle extending LEFT -->
  <line x1="139" y1="245" x2="78" y2="252" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round"/>
  <line x1="139" y1="245" x2="78" y2="252" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <!-- R logo on handle end -->
  <circle cx="74" cy="253" r="8" fill="#2A2A2A" stroke="#444" stroke-width="1"/>
  <circle cx="74" cy="253" r="5" fill="#333"/>
  <text x="74" y="256" text-anchor="middle" font-size="6" font-family="serif" fill="#555" font-weight="700">R</text>

  <!-- ======== STEAM KNOB (right side, large CHROME dial) ======== -->
  <!-- Shadow -->
  <circle cx="272" cy="122" r="22" fill="rgba(0,0,0,0.15)"/>
  <!-- Outer chrome ring -->
  <circle cx="270" cy="120" r="22" fill="#999" stroke="#AAA" stroke-width="0.8"/>
  <!-- Inner chrome face -->
  <circle cx="270" cy="120" r="18" fill="#B8B8B8" stroke="#CCC" stroke-width="0.5"/>
  <!-- Center detail (Rancilio steam emblem) -->
  <circle cx="270" cy="120" r="12" fill="#A8A8A8"/>
  <!-- Steam leaf/wave emblem in center -->
  <path d="M266 114 Q263 120 266 126" fill="none" stroke="#888" stroke-width="1"/>
  <path d="M270 113 Q267 119 270 125" fill="none" stroke="#888" stroke-width="1"/>
  <path d="M274 114 Q271 120 274 126" fill="none" stroke="#888" stroke-width="1"/>
  <!-- Knob grip fluting (chrome ridges around edge) -->
  <circle cx="270" cy="120" r="20" fill="none" stroke="#A0A0A0" stroke-width="1.2" stroke-dasharray="4,3"/>
  <!-- Top highlight -->
  <ellipse cx="266" cy="112" rx="8" ry="5" fill="rgba(255,255,255,0.1)"/>

  <!-- ======== COMMERCIAL STEAM WAND ======== -->
  <!-- Pivot point below steam knob -->
  <circle cx="272" cy="155" r="6" fill="#A0A0A0" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="272" cy="155" r="3.5" fill="#B0B0B0"/>
  <!-- Wand arm — angling down from below knob -->
  <path d="M275 160 Q280 190 282 250 L284 320" stroke="#B8B8B8" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M275 160 Q280 190 282 250 L284 320" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Rubber grip sleeve -->
  <rect x="277" y="240" width="12" height="28" rx="4" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Wand tip (commercial 4-hole) -->
  <ellipse cx="284" cy="324" rx="5" ry="6" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>
  <circle cx="282" cy="326" r="1.2" fill="#888"/>
  <circle cx="286" cy="326" r="1.2" fill="#888"/>
  <circle cx="284" cy="323" r="1.2" fill="#888"/>
  <circle cx="284" cy="329" r="1.2" fill="#888"/>
</svg>`,
  "Breville Barista Pro": `<svg width="380" height="450" viewBox="0 0 380 450">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="lcd-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#061018"/>
    </linearGradient>
    <!-- LCD glow filter -->
    <filter id="lcd-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Shadow -->
  <ellipse cx="185" cy="438" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (stainless, wide, with lozenge slot pattern) ======== -->
  <rect x="30" y="370" width="310" height="60" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Grate plate (recessed) -->
  <rect x="42" y="378" width="286" height="36" rx="2" fill="#AAAAAA"/>
  <!-- Perforated grate pattern (lozenge slots with depth) -->
  <g fill="#969696">
    <rect x="54" y="384" width="24" height="5" rx="2.5"/><rect x="84" y="384" width="24" height="5" rx="2.5"/>
    <rect x="114" y="384" width="24" height="5" rx="2.5"/><rect x="144" y="384" width="24" height="5" rx="2.5"/>
    <rect x="174" y="384" width="24" height="5" rx="2.5"/><rect x="204" y="384" width="24" height="5" rx="2.5"/>
    <rect x="234" y="384" width="24" height="5" rx="2.5"/><rect x="264" y="384" width="24" height="5" rx="2.5"/>
    <rect x="294" y="384" width="24" height="5" rx="2.5"/>
    <rect x="69" y="393" width="24" height="5" rx="2.5"/><rect x="99" y="393" width="24" height="5" rx="2.5"/>
    <rect x="129" y="393" width="24" height="5" rx="2.5"/><rect x="159" y="393" width="24" height="5" rx="2.5"/>
    <rect x="189" y="393" width="24" height="5" rx="2.5"/><rect x="219" y="393" width="24" height="5" rx="2.5"/>
    <rect x="249" y="393" width="24" height="5" rx="2.5"/><rect x="279" y="393" width="24" height="5" rx="2.5"/>
    <rect x="54" y="402" width="24" height="5" rx="2.5"/><rect x="84" y="402" width="24" height="5" rx="2.5"/>
    <rect x="114" y="402" width="24" height="5" rx="2.5"/><rect x="144" y="402" width="24" height="5" rx="2.5"/>
    <rect x="174" y="402" width="24" height="5" rx="2.5"/><rect x="204" y="402" width="24" height="5" rx="2.5"/>
    <rect x="234" y="402" width="24" height="5" rx="2.5"/><rect x="264" y="402" width="24" height="5" rx="2.5"/>
    <rect x="294" y="402" width="24" height="5" rx="2.5"/>
  </g>
  <!-- Subtle shadow under grate for depth -->
  <rect x="42" y="410" width="286" height="4" rx="1" fill="rgba(0,0,0,0.06)"/>
  <!-- Tray front lip -->
  <rect x="30" y="416" width="310" height="14" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (wide, boxy) ======== -->
  <rect x="38" y="72" width="296" height="300" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="38" y="72" width="8" height="300" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="326" y="72" width="8" height="300" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== TOP EDGE ======== -->
  <rect x="36" y="68" width="300" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== BEAN HOPPER (on top-LEFT — offset left, NOT centered) ======== -->
  <!-- Grinder collar (dark ring where hopper seats into machine) -->
  <rect x="52" y="62" width="110" height="10" rx="4" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Hopper base (where it meets the body) -->
  <rect x="56" y="56" width="102" height="14" rx="4" fill="#333" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper cone (widens upward, smoked/clear plastic — left-biased) -->
  <path d="M64 56 L42 16 Q40 4 58 2 L160 2 Q178 4 176 16 L154 56 Z" fill="url(#hopper-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Subtle transparency/plastic shine on hopper -->
  <path d="M64 56 L46 20 Q50 12 64 6 L72 56 Z" fill="rgba(255,255,255,0.04)"/>
  <path d="M142 56 L164 20 Q160 12 148 6 L134 56 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Hopper rim -->
  <ellipse cx="109" cy="4" rx="52" ry="7" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <!-- Coffee beans visible inside (dark brown fill) -->
  <path d="M62 50 L46 20 Q45 8 62 6 L156 6 Q173 8 172 20 L156 50 Z" fill="#3A2010" opacity="0.7"/>
  <!-- Bean texture (oval shapes) -->
  <g fill="#2A1808" opacity="0.8">
    <ellipse cx="82" cy="26" rx="7" ry="4.5" transform="rotate(-15 82 26)"/>
    <ellipse cx="109" cy="20" rx="6" ry="4" transform="rotate(10 109 20)"/>
    <ellipse cx="94" cy="36" rx="6" ry="4" transform="rotate(-5 94 36)"/>
    <ellipse cx="126" cy="28" rx="6" ry="4" transform="rotate(20 126 28)"/>
    <ellipse cx="72" cy="40" rx="5.5" ry="3.5" transform="rotate(-10 72 40)"/>
    <ellipse cx="118" cy="40" rx="5.5" ry="3.5" transform="rotate(5 118 40)"/>
    <ellipse cx="140" cy="34" rx="5" ry="3.5" transform="rotate(15 140 34)"/>
    <ellipse cx="100" cy="46" rx="5" ry="3" transform="rotate(-8 100 46)"/>
    <ellipse cx="135" cy="46" rx="5" ry="3" transform="rotate(12 135 46)"/>
  </g>
  <!-- Hopper lid (clear dome hint) -->
  <ellipse cx="109" cy="4" rx="48" ry="5" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== BREVILLE LOGO (centered on body, below top edge) ======== -->
  <text x="186" y="88" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2">Breville</text>

  <!-- ======== SIDE-MOUNTED CONTROLS (visible as edge details in front view) ======== -->
  <!-- Grind size selector — on LEFT side of body, visible as edge-mounted dial -->
  <ellipse cx="40" cy="110" rx="4" ry="10" fill="#333" stroke="#555" stroke-width="0.5"/>
  <ellipse cx="40" cy="110" rx="3" ry="7" fill="#2A2A2A"/>
  <line x1="40" y1="110" x2="40" y2="104" stroke="#555" stroke-width="0.8" stroke-linecap="round"/>

  <!-- Power button — on LEFT side, below grind selector -->
  <ellipse cx="40" cy="134" rx="3.5" ry="5" fill="#333" stroke="#555" stroke-width="0.4"/>
  <circle cx="40" cy="134" r="2" fill="none" stroke="#555" stroke-width="0.4"/>

  <!-- Steam dial — on RIGHT side of body, larger knob -->
  <ellipse cx="332" cy="118" rx="5" ry="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <ellipse cx="332" cy="118" rx="3.5" ry="10" fill="#C0C0C0"/>
  <line x1="332" y1="118" x2="332" y2="108" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>
  <!-- Knob grip ridges (edge view) -->
  <ellipse cx="332" cy="118" rx="4.5" ry="12.5" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.6" stroke-dasharray="2,2"/>

  <!-- ======== LCD DISPLAY (CENTER-RIGHT — THE defining feature of the Pro vs Express) ======== -->
  <!-- LCD bezel (black surround) -->
  <rect x="170" y="96" width="148" height="42" rx="5" fill="#111" stroke="#333" stroke-width="0.8"/>
  <!-- LCD screen active area -->
  <rect x="176" y="100" width="136" height="34" rx="3" fill="url(#lcd-grad)"/>
  <!-- Screen reflection highlight -->
  <path d="M176 100 L312 100 L312 109 Q244 114 176 109 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- LCD subtle backlight glow -->
  <rect x="180" y="104" width="128" height="26" rx="4" fill="#1A2844" opacity="0.3"/>

  <!-- LCD content — shot timer, grind bar, temp, filter size -->
  <!-- Grind size indicator (left side of LCD) -->
  <text x="192" y="114" font-size="5" fill="#88AADD" font-family="monospace" letter-spacing="0.5">GRIND</text>
  <rect x="188" y="118" width="32" height="6" rx="2" fill="#1A2A3A"/>
  <rect x="188" y="118" width="20" height="6" rx="2" fill="#3366AA" opacity="0.6"/>

  <!-- Shot timer (center of LCD) -->
  <text x="250" y="120" text-anchor="middle" font-size="15" fill="#CCDDEE" font-family="monospace" font-weight="bold">0:00</text>

  <!-- Temperature indicator (right side of LCD) -->
  <text x="296" y="112" font-size="5" fill="#88AADD" font-family="monospace" letter-spacing="0.5">93&#xB0;C</text>
  <!-- Filter size indicator -->
  <text x="296" y="124" font-size="4.5" fill="#6688BB" font-family="monospace">2 CUP</text>

  <!-- ======== CONTROL PANEL (horizontal row below LCD — MENU dial, GRIND AMT, 1CUP, 2CUP) ======== -->
  <!-- MENU / multi-function rotary dial (leftmost control button area) -->
  <circle cx="188" cy="152" r="11" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.7"/>
  <circle cx="188" cy="152" r="7.5" fill="#C0C0C0"/>
  <circle cx="188" cy="152" r="4" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>
  <!-- Dial indicator notch -->
  <line x1="188" y1="152" x2="188" y2="144" stroke="#888" stroke-width="1" stroke-linecap="round"/>
  <text x="188" y="168" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif" letter-spacing="0.5">MENU</text>

  <!-- GRIND AMOUNT / FILTER SIZE button -->
  <circle cx="224" cy="152" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="224" cy="152" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Filter icon -->
  <path d="M221 148 L227 148 L225 155 L223 155 Z" fill="none" stroke="#777" stroke-width="0.7"/>
  <text x="224" y="168" text-anchor="middle" font-size="3" fill="#888" font-family="sans-serif" letter-spacing="0.3">GRIND AMT</text>

  <!-- 1-cup button -->
  <circle cx="258" cy="152" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="258" cy="152" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <rect x="256" y="148" width="4.5" height="5.5" rx="1.2" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="254" y="153.5" width="8.5" height="1.2" rx="0.6" fill="#777"/>

  <!-- 2-cup button -->
  <circle cx="292" cy="152" r="9" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="292" cy="152" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <rect x="287.5" y="148" width="3.5" height="5" rx="0.8" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="293" y="148" width="3.5" height="5" rx="0.8" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="285.5" y="153" width="13" height="1.2" rx="0.6" fill="#777"/>

  <!-- ======== HORIZONTAL DIVIDER ======== -->
  <line x1="38" y1="174" x2="334" y2="174" stroke="#999" stroke-width="0.5"/>

  <!-- ======== GROUP HEAD AREA (chrome overhang with TWO distinct dark openings) ======== -->
  <!-- Chrome overhang band -->
  <rect x="60" y="160" width="250" height="16" rx="2" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>

  <!-- LEFT SLOT: Grinder chute (separate dark opening) -->
  <rect x="72" y="176" width="60" height="34" rx="3" fill="#333" stroke="#4A4A4A" stroke-width="0.5"/>
  <rect x="78" y="182" width="48" height="22" rx="2" fill="#282828"/>
  <!-- Inner chute opening -->
  <rect x="90" y="186" width="24" height="14" rx="2" fill="#1E1E1E"/>
  <!-- Grinder chute label -->
  <text x="102" y="208" text-anchor="middle" font-size="2.8" fill="#555" font-family="sans-serif" letter-spacing="0.3">AUTO · PUSH ONCE</text>

  <!-- Steel body visible BETWEEN the two slots (divider) -->
  <!-- (the steel body gradient naturally shows through here) -->

  <!-- RIGHT SLOT: Group head opening (separate dark opening) -->
  <rect x="148" y="176" width="140" height="34" rx="3" fill="#444" stroke="#555" stroke-width="0.3"/>

  <!-- CENTER-RIGHT ZONE: Group head and portafilter -->
  <!-- ======== GROUP HEAD CHROME RING ======== -->
  <ellipse cx="210" cy="209" rx="28" ry="7" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="210" cy="207" rx="26" ry="6.5" fill="#999" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="206" cy="205" rx="13" ry="3" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== PORTAFILTER (center-right, below group head) ======== -->
  <ellipse cx="210" cy="227" rx="26" ry="24" fill="#333" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="210" cy="227" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="210" cy="227" rx="17" ry="15" fill="#1E1E1E"/>
  <!-- Basket bottom highlight -->
  <ellipse cx="206" cy="222" rx="9" ry="7" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector -->
  <path d="M200 246 Q204 254 207 262 L213 262 Q216 254 220 246" fill="#AAA" stroke="#BBB" stroke-width="0.4"/>
  <!-- Dual spouts -->
  <rect x="204" y="262" width="5" height="12" rx="2" fill="#999"/>
  <rect x="212" y="262" width="5" height="12" rx="2" fill="#999"/>

  <!-- Handle extending LEFT from portafilter -->
  <line x1="184" y1="224" x2="100" y2="232" stroke="#2A2A2A" stroke-width="11" stroke-linecap="round"/>
  <line x1="184" y1="224" x2="100" y2="232" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <!-- Handle ring -->
  <circle cx="96" cy="233" r="6.5" fill="none" stroke="#2A2A2A" stroke-width="3.5"/>
  <circle cx="96" cy="233" r="6.5" fill="none" stroke="#333" stroke-width="2"/>

  <!-- ======== MAGNETIC TAMPER (far left side, signature Breville feature) ======== -->
  <!-- Tamper cradle on left side of body -->
  <rect x="40" y="180" width="18" height="40" rx="3" fill="#444" stroke="#555" stroke-width="0.3"/>
  <!-- Tamper handle (black, cylindrical) -->
  <rect x="43" y="168" width="12" height="18" rx="5" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Tamper body (chrome shaft) -->
  <rect x="45" y="186" width="8" height="32" rx="2" fill="#B0B0B0" stroke="#CCC" stroke-width="0.3"/>
  <line x1="47" y1="188" x2="47" y2="216" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <!-- Tamper base (chrome disc) -->
  <ellipse cx="49" cy="218" rx="8" ry="3" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>

  <!-- ======== STEAM WAND (right side, commercial style with ball joint) ======== -->
  <!-- Ball joint -->
  <circle cx="326" cy="200" r="9" fill="#A8A8A8" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="326" cy="200" r="5.5" fill="#B8B8B8"/>
  <circle cx="324" cy="198" r="2" fill="rgba(255,255,255,0.1)"/>
  <!-- Wand arm -->
  <path d="M330 206 Q336 230 338 290 L340 355" stroke="#C0C0C0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M330 206 Q336 230 338 290 L340 355" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Rubber grip sleeve -->
  <rect x="332" y="256" width="12" height="26" rx="4" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Wand tip (tapered/bulbous) -->
  <ellipse cx="340" cy="359" rx="5" ry="6" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>

  <!-- ======== WATER TANK HINT (right side, behind body) ======== -->
  <rect x="324" y="150" width="16" height="215" rx="4" fill="rgba(150,180,210,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>

  <!-- ======== HOT WATER OUTLET (small chrome spout, right of group head recess) ======== -->
  <rect x="268" y="188" width="4" height="10" rx="1.5" fill="#AAA" stroke="#BBB" stroke-width="0.3"/>
  <circle cx="270" cy="198" r="1.5" fill="#888"/>
</svg>`,
  "Breville Barista Touch": `<svg width="380" height="450" viewBox="0 0 380 450">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="screen-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="100%" stop-color="#111118"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="185" cy="438" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (stainless, wide) ======== -->
  <rect x="30" y="370" width="310" height="60" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <rect x="42" y="378" width="286" height="36" rx="2" fill="#AAAAAA"/>
  <!-- Grid lines -->
  <g stroke="#999" stroke-width="0.5">
    <line x1="50" y1="385" x2="320" y2="385"/><line x1="50" y1="392" x2="320" y2="392"/>
    <line x1="50" y1="399" x2="320" y2="399"/><line x1="50" y1="406" x2="320" y2="406"/>
  </g>
  <rect x="30" y="416" width="310" height="14" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (wide, boxy) ======== -->
  <rect x="38" y="72" width="296" height="300" rx="4" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="38" y="72" width="8" height="300" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="326" y="72" width="8" height="300" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== TOP EDGE ======== -->
  <rect x="36" y="68" width="300" height="8" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== BEAN HOPPER (on top-LEFT — defining layout difference) ======== -->
  <!-- Grinder collar (dark ring where hopper seats into machine) -->
  <rect x="44" y="62" width="110" height="10" rx="4" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Hopper base (where it meets the body) -->
  <rect x="48" y="56" width="102" height="14" rx="4" fill="#333" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper cone (widens upward, smoked plastic — shifted left) -->
  <path d="M56 56 L32 16 Q30 4 50 2 L148 2 Q168 4 166 16 L142 56 Z" fill="url(#hopper-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Subtle transparency/plastic shine on hopper -->
  <path d="M56 56 L36 20 Q40 12 54 6 L62 56 Z" fill="rgba(255,255,255,0.04)"/>
  <path d="M132 56 L158 20 Q154 12 140 6 L128 56 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Hopper rim -->
  <ellipse cx="99" cy="4" rx="50" ry="7" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <!-- Coffee beans visible inside (dark brown fill) -->
  <path d="M54 50 L36 20 Q35 8 52 6 L146 6 Q163 8 162 20 L144 50 Z" fill="#3A2010" opacity="0.7"/>
  <!-- Bean texture (oval shapes) -->
  <g fill="#2A1808" opacity="0.8">
    <ellipse cx="72" cy="26" rx="7" ry="4.5" transform="rotate(-15 72 26)"/>
    <ellipse cx="99" cy="20" rx="6" ry="4" transform="rotate(10 99 20)"/>
    <ellipse cx="84" cy="36" rx="6" ry="4" transform="rotate(-5 84 36)"/>
    <ellipse cx="115" cy="28" rx="6" ry="4" transform="rotate(20 115 28)"/>
    <ellipse cx="64" cy="40" rx="5.5" ry="3.5" transform="rotate(-10 64 40)"/>
    <ellipse cx="108" cy="40" rx="5.5" ry="3.5" transform="rotate(5 108 40)"/>
    <ellipse cx="130" cy="34" rx="5" ry="3.5" transform="rotate(15 130 34)"/>
    <ellipse cx="90" cy="46" rx="5" ry="3" transform="rotate(-8 90 46)"/>
    <ellipse cx="122" cy="46" rx="5" ry="3" transform="rotate(12 122 46)"/>
  </g>
  <!-- Hopper lid (clear dome hint) -->
  <ellipse cx="99" cy="4" rx="46" ry="5" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== GRIND SIZE DIAL (LEFT SIDE edge-mounted) ======== -->
  <ellipse cx="40" cy="112" rx="4" ry="10" fill="#333" stroke="#555" stroke-width="0.5"/>
  <ellipse cx="40" cy="112" rx="3" ry="7" fill="#2A2A2A"/>
  <line x1="40" y1="112" x2="40" y2="106" stroke="#555" stroke-width="0.8" stroke-linecap="round"/>

  <!-- ======== BREVILLE LOGO ======== -->
  <text x="220" y="87" text-anchor="middle" font-size="11" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2">Breville</text>

  <!-- ======== POWER BUTTON (single, to the left of the touchscreen) ======== -->
  <circle cx="158" cy="126" r="8" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.5"/>
  <circle cx="158" cy="126" r="5.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Power icon -->
  <path d="M158 121 L158 124" stroke="#888" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M154 122.5 Q158 119 162 122.5" fill="none" stroke="#888" stroke-width="0.8" stroke-linecap="round"/>

  <!-- ======== TOUCHSCREEN (THE defining feature — large, CENTER-RIGHT) ======== -->
  <!-- Screen outer glow (subtle blue tint to suggest backlight) -->
  <rect x="172" y="94" width="150" height="72" rx="7" fill="none" stroke="rgba(100,140,200,0.08)" stroke-width="2"/>
  <!-- Screen bezel (black surround) — large and prominent -->
  <rect x="174" y="96" width="146" height="68" rx="6" fill="#111" stroke="#2A2A2A" stroke-width="1"/>
  <!-- Screen active area with slight glow -->
  <rect x="180" y="100" width="134" height="60" rx="4" fill="url(#screen-grad)"/>
  <!-- Screen reflection highlight -->
  <path d="M180 100 L314 100 L314 110 Q247 116 180 110 Z" fill="rgba(255,255,255,0.03)" rx="4"/>
  <!-- Screen bottom edge light bleed -->
  <rect x="182" y="157" width="130" height="1.5" rx="0.75" fill="rgba(100,140,200,0.06)"/>

  <!-- Drink preset grid (2x3 layout — tiles with icons) -->
  <!-- Row 1 -->
  <!-- Espresso -->
  <rect x="185" y="105" width="40" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="190" y="109" width="7" height="10" rx="2" fill="#443322" stroke="#DDAA66" stroke-width="0.8"/>
  <rect x="188" y="118" width="11" height="1.2" rx="0.6" fill="#DDAA66" opacity="0.7"/>
  <text x="203" y="119" font-size="4" fill="#CCCCCC" font-family="sans-serif">Espresso</text>

  <!-- Cappuccino -->
  <rect x="229" y="105" width="40" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="234" y="109" width="8" height="9" rx="2" fill="#443322" stroke="#DDAA66" stroke-width="0.8"/>
  <ellipse cx="238" cy="110" rx="5" ry="3" fill="#EED8AA" opacity="0.4"/>
  <text x="247" y="119" font-size="3.5" fill="#CCCCCC" font-family="sans-serif">Cappuc.</text>

  <!-- Latte -->
  <rect x="273" y="105" width="36" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="278" y="108" width="8" height="12" rx="2.5" fill="#443322" stroke="#DDAA66" stroke-width="0.8"/>
  <text x="291" y="119" font-size="4" fill="#CCCCCC" font-family="sans-serif">Latte</text>

  <!-- Row 2 -->
  <!-- Flat White -->
  <rect x="185" y="132" width="40" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="190" y="136" width="7" height="10" rx="2" fill="#443322" stroke="#DDAA66" stroke-width="0.8"/>
  <text x="201" y="148" font-size="3.5" fill="#CCCCCC" font-family="sans-serif">Flat White</text>

  <!-- Americano -->
  <rect x="229" y="132" width="40" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="234" y="136" width="8" height="10" rx="2.5" fill="#334455" stroke="#88AACC" stroke-width="0.8"/>
  <text x="247" y="148" font-size="3.5" fill="#CCCCCC" font-family="sans-serif">Americ.</text>

  <!-- Macchiato -->
  <rect x="273" y="132" width="36" height="24" rx="3" fill="#2A2A3A" stroke="#444455" stroke-width="0.5"/>
  <rect x="278" y="136" width="8" height="10" rx="2.5" fill="#443322" stroke="#EED8AA" stroke-width="0.8"/>
  <text x="291" y="148" font-size="3.5" fill="#CCCCCC" font-family="sans-serif">Macch.</text>

  <!-- ======== HORIZONTAL DIVIDER ======== -->
  <line x1="38" y1="170" x2="334" y2="170" stroke="#999" stroke-width="0.5"/>

  <!-- ======== GROUP HEAD AREA (chrome overhang with TWO distinct dark openings) ======== -->
  <!-- Chrome overhang band -->
  <rect x="60" y="172" width="250" height="16" rx="2" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>

  <!-- LEFT SLOT: Grinder chute (separate dark opening) -->
  <rect x="72" y="188" width="60" height="28" rx="3" fill="#333" stroke="#4A4A4A" stroke-width="0.5"/>
  <rect x="78" y="192" width="48" height="18" rx="2" fill="#282828"/>
  <!-- Inner chute opening -->
  <rect x="88" y="196" width="28" height="10" rx="2" fill="#1E1E1E"/>
  <!-- Grinder chute label -->
  <text x="102" y="218" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif" letter-spacing="0.3">GRIND · PUSH ONCE</text>

  <!-- Steel body visible BETWEEN the two slots -->

  <!-- RIGHT SLOT: Group head opening (separate dark opening) -->
  <rect x="148" y="188" width="140" height="28" rx="3" fill="#444" stroke="#555" stroke-width="0.3"/>

  <!-- CENTER-RIGHT ZONE: Group head area -->
  <!-- ======== GROUP HEAD CHROME RING ======== -->
  <ellipse cx="206" cy="215" rx="28" ry="7" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="206" cy="213" rx="26" ry="6.5" fill="#999" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="202" cy="211" rx="13" ry="3" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== PORTAFILTER ======== -->
  <ellipse cx="206" cy="233" rx="26" ry="24" fill="#333" stroke="#555" stroke-width="1.5"/>
  <ellipse cx="206" cy="233" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="206" cy="233" rx="17" ry="15" fill="#1E1E1E"/>
  <ellipse cx="202" cy="228" rx="9" ry="7" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector -->
  <path d="M196 252 Q200 260 203 268 L209 268 Q212 260 216 252" fill="#AAA" stroke="#BBB" stroke-width="0.4"/>
  <!-- Dual spouts -->
  <rect x="200" y="268" width="5" height="12" rx="2" fill="#999"/>
  <rect x="208" y="268" width="5" height="12" rx="2" fill="#999"/>

  <!-- Handle extending LEFT -->
  <line x1="180" y1="230" x2="100" y2="238" stroke="#2A2A2A" stroke-width="11" stroke-linecap="round"/>
  <line x1="180" y1="230" x2="100" y2="238" stroke="#333" stroke-width="6" stroke-linecap="round"/>
  <circle cx="96" cy="239" r="6.5" fill="none" stroke="#2A2A2A" stroke-width="3.5"/>
  <circle cx="96" cy="239" r="6.5" fill="none" stroke="#333" stroke-width="2"/>

  <!-- ======== AUTO STEAM WAND (right side — MilQ auto frother) ======== -->
  <!-- Ball joint -->
  <circle cx="326" cy="208" r="9" fill="#A8A8A8" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="326" cy="208" r="5.5" fill="#B8B8B8"/>
  <circle cx="324" cy="206" r="2" fill="rgba(255,255,255,0.1)"/>
  <!-- Wand arm -->
  <path d="M330 214 Q336 238 338 298 L340 355" stroke="#C0C0C0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M330 214 Q336 238 338 298 L340 355" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Auto frother housing (wider cylindrical section for auto milk texturing) -->
  <rect x="330" y="256" width="18" height="38" rx="7" fill="#2A2A2A" stroke="#444" stroke-width="0.6"/>
  <!-- Rubber grip lines -->
  <line x1="332" y1="262" x2="346" y2="262" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="266" x2="346" y2="266" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="270" x2="346" y2="270" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="274" x2="346" y2="274" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="278" x2="346" y2="278" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="282" x2="346" y2="282" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="332" y1="286" x2="346" y2="286" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Temperature sensor ring -->
  <circle cx="339" cy="280" r="5" fill="none" stroke="#555" stroke-width="0.8"/>
  <circle cx="339" cy="280" r="2" fill="#555"/>
  <!-- Wand tip (bulbous, auto-frother style) -->
  <ellipse cx="340" cy="359" rx="5.5" ry="7" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>
  <circle cx="340" cy="361" r="2" fill="#888"/>

  <!-- ======== MAGNETIC TAMPER (far left side of body) ======== -->
  <!-- Tamper cradle -->
  <rect x="40" y="192" width="18" height="40" rx="3" fill="#444" stroke="#555" stroke-width="0.3"/>
  <!-- Tamper handle -->
  <rect x="43" y="180" width="12" height="18" rx="5" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Tamper body (chrome shaft) -->
  <rect x="45" y="198" width="8" height="32" rx="2" fill="#B0B0B0" stroke="#CCC" stroke-width="0.3"/>
  <line x1="47" y1="200" x2="47" y2="228" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <!-- Tamper base (chrome disc) -->
  <ellipse cx="49" cy="230" rx="8" ry="3" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>

  <!-- ======== WATER TANK HINT (right side, behind body) ======== -->
  <rect x="324" y="140" width="16" height="225" rx="4" fill="rgba(150,180,210,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
</svg>`,
  "Breville Oracle": `<svg width="460" height="500" viewBox="0 -30 460 510">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <linearGradient id="steel-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4A4A4A"/>
      <stop offset="20%" stop-color="#3A3A3A"/>
      <stop offset="80%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#252525"/>
    </linearGradient>
    <linearGradient id="hopper-highlight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="30%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.1)"/>
      <stop offset="70%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <linearGradient id="screen-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="50%" stop-color="#0D0D1A"/>
      <stop offset="100%" stop-color="#1A1A2E"/>
    </linearGradient>
    <radialGradient id="dial-grad" cx="0.45" cy="0.4" r="0.55">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="80%" stop-color="#A0A0A0"/>
      <stop offset="100%" stop-color="#888888"/>
    </radialGradient>
    <linearGradient id="jug-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#D8D8D8"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <!-- Zone separator gradient for visual distinction -->
    <linearGradient id="zone-divider" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(80,80,80,0.6)"/>
      <stop offset="50%" stop-color="rgba(60,60,60,0.3)"/>
      <stop offset="100%" stop-color="rgba(80,80,80,0.6)"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="220" cy="460" rx="170" ry="14" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="30" y="420" width="380" height="28" rx="4" fill="#252525"/>
  <rect x="30" y="420" width="380" height="6" rx="2" fill="#333"/>

  <!-- ======== DRIP TRAY (wide stainless) ======== -->
  <rect x="32" y="350" width="376" height="70" rx="5" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Drip tray grid plate -->
  <rect x="46" y="358" width="348" height="44" rx="3" fill="#AAAAAA"/>
  <!-- Lozenge slots row 1 -->
  <rect x="58" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="90" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="122" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="154" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="186" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="218" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="250" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="282" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="314" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="346" y="364" width="26" height="7" rx="3.5" fill="#949494"/>
  <!-- Lozenge slots row 2 -->
  <rect x="74" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="106" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="138" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="170" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="202" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="234" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="266" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="298" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="330" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="362" y="376" width="26" height="7" rx="3.5" fill="#949494"/>
  <!-- Lozenge slots row 3 -->
  <rect x="58" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="90" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="122" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="154" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="186" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="218" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="250" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="282" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="314" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <rect x="346" y="388" width="26" height="7" rx="3.5" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="32" y="402" width="376" height="18" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (wide stainless steel) ======== -->
  <rect x="38" y="100" width="364" height="250" rx="5" fill="url(#steel)" stroke="#B0B0B0" stroke-width="0.3"/>
  <!-- Left edge shadow -->
  <rect x="38" y="100" width="8" height="250" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="394" y="100" width="8" height="250" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== HEAD / CONTROL PANEL (wider, overhangs body) ======== -->
  <path d="M26 48 Q26 44 30 42 L410 42 Q414 44 414 48 L416 98 Q416 102 412 102 L24 102 Q20 102 20 98 Z" fill="url(#steel-vert)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Convex bulge effect -->
  <path d="M32 58 Q220 53 408 58 L410 88 Q220 93 30 88 Z" fill="rgba(255,255,255,0.06)"/>
  <!-- Left edge shadow on head -->
  <path d="M26 48 L20 98 L28 98 L34 48 Z" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== CUP WARMING TRAY (top surface, right of hopper) ======== -->
  <rect x="150" y="36" width="262" height="8" rx="3" fill="#B0B0B0"/>
  <!-- Ridges on cup tray -->
  <rect x="160" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="172" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="184" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="196" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="208" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="220" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="232" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="244" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="256" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="268" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="280" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="292" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="304" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="316" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="328" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="340" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="352" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="364" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="376" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="388" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>
  <rect x="400" y="38" width="5" height="5" rx="1" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== BEAN HOPPER (LARGE conical, on top-LEFT — bigger than Pro/Touch) ======== -->
  <!-- Hopper base collar -->
  <rect x="44" y="36" width="98" height="8" rx="3" fill="#3A3A3A" stroke="#444" stroke-width="0.3"/>
  <!-- Hopper body (conical — wide at top, narrow at base) -->
  <path d="M24 -18 Q20 -18 20 -14 L46 38 L140 38 L166 -14 Q166 -18 162 -18 Z" fill="url(#hopper-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Hopper highlight (curved surface reflection) -->
  <path d="M36 -14 L56 36 L126 36 L148 -14 Z" fill="url(#hopper-highlight)"/>
  <!-- Hopper lid (dome top) -->
  <ellipse cx="93" cy="-18" rx="50" ry="11" fill="#444" stroke="#555" stroke-width="0.5"/>
  <!-- Lid handle/knob -->
  <ellipse cx="93" cy="-22" rx="11" ry="5" fill="#555" stroke="#666" stroke-width="0.5"/>
  <!-- Bean hints inside hopper (smoked transparent look) -->
  <path d="M36 -14 L56 36 L126 36 L148 -14 Z" fill="rgba(80,55,30,0.12)"/>
  <circle cx="65" cy="2" r="4" fill="rgba(100,70,40,0.18)"/>
  <circle cx="80" cy="-2" r="3.5" fill="rgba(100,70,40,0.22)"/>
  <circle cx="96" cy="0" r="4" fill="rgba(100,70,40,0.16)"/>
  <circle cx="112" cy="4" r="3.5" fill="rgba(100,70,40,0.20)"/>
  <circle cx="72" cy="12" r="4" fill="rgba(100,70,40,0.20)"/>
  <circle cx="90" cy="10" r="3.5" fill="rgba(100,70,40,0.18)"/>
  <circle cx="106" cy="14" r="3.5" fill="rgba(100,70,40,0.15)"/>
  <circle cx="120" cy="12" r="3" fill="rgba(100,70,40,0.14)"/>
  <circle cx="78" cy="22" r="3.5" fill="rgba(100,70,40,0.16)"/>
  <circle cx="95" cy="20" r="3" fill="rgba(100,70,40,0.20)"/>
  <circle cx="110" cy="24" r="3" fill="rgba(100,70,40,0.13)"/>
  <circle cx="86" cy="30" r="2.5" fill="rgba(100,70,40,0.16)"/>
  <circle cx="100" cy="32" r="2.5" fill="rgba(100,70,40,0.14)"/>

  <!-- ======== POWER BUTTON (far left of control panel) ======== -->
  <circle cx="50" cy="74" r="10" fill="#2A2A2A" stroke="#555" stroke-width="0.8"/>
  <circle cx="50" cy="74" r="7" fill="#222"/>
  <!-- Power icon -->
  <path d="M50 67 L50 72" stroke="#888" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M45 69 Q45 79 50 80 Q55 79 55 69" fill="none" stroke="#888" stroke-width="1" stroke-linecap="round"/>

  <!-- ======== LARGE COLOR TOUCHSCREEN (upper center) ======== -->
  <!-- Screen bezel -->
  <rect x="120" y="52" width="190" height="42" rx="4" fill="#111" stroke="#444" stroke-width="0.8"/>
  <!-- Screen display area -->
  <rect x="125" y="56" width="180" height="34" rx="3" fill="url(#screen-grad)"/>
  <!-- Touchscreen content — drink presets -->
  <!-- Latte icon (selected, highlighted) -->
  <rect x="131" y="60" width="36" height="26" rx="2" fill="rgba(70,130,200,0.25)" stroke="rgba(100,160,230,0.5)" stroke-width="0.5"/>
  <!-- Latte glass shape -->
  <path d="M141 67 L145 80 Q149 82 153 80 L157 67 Z" fill="none" stroke="#AAD4FF" stroke-width="0.8"/>
  <rect x="145" y="72" width="8" height="6" rx="0" fill="rgba(230,230,230,0.3)"/>
  <text x="149" y="88" text-anchor="middle" font-size="4" fill="#8AC" font-family="Arial, sans-serif">Latte</text>

  <!-- Espresso icon -->
  <rect x="171" y="60" width="32" height="26" rx="2" fill="rgba(40,40,50,0.3)"/>
  <!-- Small espresso cup -->
  <rect x="180" y="70" width="14" height="10" rx="2" fill="none" stroke="#889" stroke-width="0.7"/>
  <path d="M194 73 Q198 73 198 77 Q198 80 194 80" fill="none" stroke="#889" stroke-width="0.6"/>
  <text x="187" y="88" text-anchor="middle" font-size="4" fill="#778" font-family="Arial, sans-serif">Espresso</text>

  <!-- Cappuccino icon -->
  <rect x="207" y="60" width="32" height="26" rx="2" fill="rgba(40,40,50,0.3)"/>
  <!-- Cappuccino cup -->
  <rect x="215" y="70" width="16" height="10" rx="2" fill="none" stroke="#889" stroke-width="0.7"/>
  <path d="M231 73 Q235 73 235 77 Q235 80 231 80" fill="none" stroke="#889" stroke-width="0.6"/>
  <!-- Foam dome -->
  <path d="M215 70 Q223 65 231 70" fill="none" stroke="#889" stroke-width="0.6"/>
  <text x="223" y="88" text-anchor="middle" font-size="4" fill="#778" font-family="Arial, sans-serif">Cappucc.</text>

  <!-- Flat White icon -->
  <rect x="243" y="60" width="32" height="26" rx="2" fill="rgba(40,40,50,0.3)"/>
  <!-- Flat white cup -->
  <rect x="252" y="71" width="14" height="9" rx="2" fill="none" stroke="#889" stroke-width="0.7"/>
  <path d="M266 74 Q270 74 270 77 Q270 79 266 79" fill="none" stroke="#889" stroke-width="0.6"/>
  <text x="259" y="88" text-anchor="middle" font-size="4" fill="#778" font-family="Arial, sans-serif">Flat Wh.</text>

  <!-- Parameter readout bar at bottom of screen -->
  <rect x="126" y="83" width="178" height="6" rx="1" fill="rgba(20,20,30,0.6)"/>
  <text x="156" y="88" text-anchor="middle" font-size="3.5" fill="#6A9" font-family="monospace">Grind:33</text>
  <text x="195" y="88" text-anchor="middle" font-size="3.5" fill="#6A9" font-family="monospace">Time:30s</text>
  <text x="240" y="88" text-anchor="middle" font-size="3.5" fill="#6A9" font-family="monospace">Temp:140F</text>
  <text x="284" y="88" text-anchor="middle" font-size="3.5" fill="#6A9" font-family="monospace">Vol:2oz</text>

  <!-- ======== "Breville" LOGO TEXT (right of the screen) ======== -->
  <text x="340" y="78" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" fill="#888" font-weight="400" letter-spacing="2">Breville</text>

  <!-- ======== PRESSURE GAUGE (between logo area and buttons) ======== -->
  <circle cx="340" cy="62" r="6" fill="#222" stroke="#555" stroke-width="0.5"/>
  <circle cx="340" cy="62" r="4.5" fill="#1A1A1A"/>
  <!-- Gauge markings -->
  <path d="M337 59 L337.5 60.5" stroke="#666" stroke-width="0.5"/>
  <path d="M340 58 L340 59.5" stroke="#666" stroke-width="0.5"/>
  <path d="M343 59 L342.5 60.5" stroke="#666" stroke-width="0.5"/>
  <!-- Needle -->
  <line x1="340" y1="62" x2="342.5" y2="59.5" stroke="#CC4444" stroke-width="0.6"/>
  <circle cx="340" cy="62" r="0.8" fill="#666"/>

  <!-- ======== LARGE CHROME DIAL (prominent, oversized, center below touchscreen) ======== -->
  <circle cx="220" cy="128" r="28" fill="#333" stroke="#888" stroke-width="1.5"/>
  <circle cx="220" cy="128" r="25" fill="url(#dial-grad)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="220" cy="128" r="20" fill="#C8C8C8"/>
  <circle cx="220" cy="128" r="15" fill="#D0D0D0"/>
  <!-- Dial grip ridges (knurling) -->
  <circle cx="220" cy="128" r="23" fill="none" stroke="rgba(150,150,150,0.4)" stroke-width="0.6" stroke-dasharray="3,2"/>
  <circle cx="220" cy="128" r="26" fill="none" stroke="rgba(150,150,150,0.3)" stroke-width="0.5" stroke-dasharray="2.5,2.5"/>
  <!-- Dial center dimple -->
  <circle cx="220" cy="128" r="4" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>
  <!-- Dial indicator line -->
  <line x1="220" y1="104" x2="220" y2="108" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Subtle light reflection -->
  <ellipse cx="214" cy="120" rx="8" ry="5" fill="rgba(255,255,255,0.08)"/>

  <!-- "DUAL BOILER" text below the dial -->
  <text x="220" y="166" text-anchor="middle" font-size="6.5" font-family="Arial, sans-serif" fill="rgba(136,136,136,0.6)" font-weight="300" letter-spacing="3.5">DUAL BOILER</text>

  <!-- ======== 1-CUP SHOT BUTTON (left of dial) ======== -->
  <circle cx="155" cy="128" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="155" cy="128" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <!-- 1-cup icon -->
  <rect x="152" y="122" width="6" height="8" rx="1.5" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="149" y="129.5" width="12" height="1.5" rx="0.75" fill="#808080"/>

  <!-- ======== 2-CUP SHOT BUTTON (right of dial) ======== -->
  <circle cx="285" cy="128" r="14" fill="url(#btn-grad)" stroke="#A0A0A0" stroke-width="0.8"/>
  <circle cx="285" cy="128" r="11" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
  <!-- 2-cup icon -->
  <rect x="279" y="122" width="5" height="7" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="286" y="122" width="5" height="7" rx="1" fill="none" stroke="#808080" stroke-width="1"/>
  <rect x="276" y="128.5" width="18" height="1.5" rx="0.75" fill="#808080"/>

  <!-- ======== BODY DETAILS ======== -->
  <!-- Subtle horizontal chrome strip separating control area from recess -->
  <line x1="46" y1="178" x2="394" y2="178" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>

  <!-- ======== DARK GROUP HEAD RECESS — THREE DISTINCT ZONES ======== -->
  <!-- Full width dark recess background -->
  <rect x="46" y="180" width="348" height="160" rx="3" fill="#2A2A2A"/>
  <!-- Inner shadow at top of recess -->
  <rect x="46" y="180" width="348" height="12" rx="3" fill="#222"/>

  <!-- ======== ZONE DIVIDERS (vertical lines separating the three zones) ======== -->
  <line x1="162" y1="185" x2="162" y2="338" stroke="rgba(100,100,100,0.35)" stroke-width="1"/>
  <line x1="304" y1="185" x2="304" y2="338" stroke="rgba(100,100,100,0.35)" stroke-width="1"/>

  <!-- ========================================================== -->
  <!-- ZONE 1 (LEFT): AUTO-GRINDER / AUTO-DOSER / AUTO-TAMPER     -->
  <!-- ========================================================== -->
  <!-- Zone label -->
  <text x="104" y="195" text-anchor="middle" font-size="4.5" font-family="Arial, sans-serif" fill="rgba(150,150,150,0.5)" letter-spacing="1">GRIND  DOSE  TAMP</text>

  <!-- Grinder chute housing (dark opening) -->
  <rect x="74" y="204" width="60" height="70" rx="4" fill="#1A1A1A" stroke="#444" stroke-width="0.5"/>
  <!-- Inner chute cavity -->
  <rect x="80" y="210" width="48" height="56" rx="3" fill="#111"/>
  <!-- Grinder burr mechanism hint at top -->
  <ellipse cx="104" cy="216" rx="18" ry="5" fill="#1E1E1E" stroke="#333" stroke-width="0.5"/>
  <ellipse cx="104" cy="216" rx="10" ry="3" fill="#151515"/>
  <!-- Conical grinder hint -->
  <path d="M92 220 L98 248 L110 248 L116 220" fill="#181818" stroke="#333" stroke-width="0.3"/>
  <!-- Dosing chute outlet -->
  <rect x="94" y="248" width="20" height="14" rx="2" fill="#151515" stroke="#333" stroke-width="0.4"/>
  <!-- Auto-tamper piston hint -->
  <rect x="97" y="252" width="14" height="5" rx="1" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <rect x="100" y="255" width="8" height="3" rx="0.5" fill="#333"/>
  <!-- Tamper arrow indicator -->
  <path d="M104 262 L100 268 L108 268 Z" fill="rgba(150,150,150,0.3)"/>

  <!-- Ground coffee output hint (small pile) -->
  <ellipse cx="104" cy="290" rx="16" ry="4" fill="rgba(80,55,30,0.25)"/>
  <ellipse cx="104" cy="288" rx="12" ry="3" fill="rgba(80,55,30,0.18)"/>

  <!-- "AUTO" label -->
  <text x="104" y="310" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="rgba(150,150,150,0.4)" letter-spacing="1.5">AUTO</text>

  <!-- ========================================================== -->
  <!-- ZONE 2 (CENTER): GROUP HEAD + PORTAFILTER + SHOT GLASSES   -->
  <!-- ========================================================== -->
  <!-- Zone label -->
  <text x="233" y="195" text-anchor="middle" font-size="4.5" font-family="Arial, sans-serif" fill="rgba(150,150,150,0.5)" letter-spacing="1">GROUP HEAD</text>

  <!-- Interior light strip (warm light under group head) -->
  <rect x="180" y="199" width="106" height="2" rx="1" fill="rgba(255,200,100,0.15)"/>

  <!-- Chrome group head collar -->
  <ellipse cx="233" cy="212" rx="30" ry="8" fill="#777" stroke="#999" stroke-width="0.8"/>
  <ellipse cx="233" cy="210" rx="24" ry="5" fill="#888" stroke="#AAA" stroke-width="0.3"/>

  <!-- Portafilter basket (58mm professional) -->
  <ellipse cx="233" cy="230" rx="28" ry="25" fill="#333" stroke="#666" stroke-width="1.5"/>
  <ellipse cx="233" cy="230" rx="23" ry="20" fill="#2A2A2A"/>
  <ellipse cx="233" cy="230" rx="17" ry="15" fill="#1E1E1E"/>
  <!-- Basket bottom highlight -->
  <ellipse cx="228" cy="224" rx="8" ry="6" fill="rgba(255,255,255,0.06)"/>

  <!-- Spout connector -->
  <path d="M223 252 L223 260 Q223 264 227 264 L239 264 Q243 264 243 260 L243 252" fill="#777" stroke="#999" stroke-width="0.5"/>
  <!-- Spout housing -->
  <rect x="221" y="264" width="24" height="10" rx="3" fill="#2A2A2A"/>
  <!-- Dual spouts -->
  <rect x="225" y="272" width="6" height="14" rx="2.5" fill="#222"/>
  <rect x="235" y="272" width="6" height="14" rx="2.5" fill="#222"/>
  <!-- Drip from spouts (espresso hint) -->
  <ellipse cx="228" cy="290" rx="1.5" ry="2.5" fill="rgba(120,80,30,0.3)"/>
  <ellipse cx="238" cy="289" rx="1.5" ry="2.5" fill="rgba(120,80,30,0.3)"/>

  <!-- Handle — extends to the RIGHT -->
  <line x1="262" y1="230" x2="296" y2="234" stroke="#2A2A2A" stroke-width="12" stroke-linecap="round"/>
  <line x1="262" y1="230" x2="296" y2="234" stroke="#333" stroke-width="7" stroke-linecap="round"/>
  <!-- Handle ring -->
  <circle cx="300" cy="234" r="7" fill="none" stroke="#2A2A2A" stroke-width="4"/>
  <circle cx="300" cy="234" r="7" fill="none" stroke="#333" stroke-width="2.5"/>

  <!-- Espresso shot glasses on drip tray -->
  <!-- Left glass -->
  <path d="M214 340 L216 308 Q216 304 220 304 L228 304 Q232 304 232 308 L234 340" fill="none" stroke="rgba(200,200,200,0.25)" stroke-width="1"/>
  <rect x="216" y="330" width="18" height="10" rx="0" fill="rgba(100,65,20,0.2)"/>
  <!-- Right glass -->
  <path d="M236 340 L238 308 Q238 304 242 304 L250 304 Q254 304 254 308 L256 340" fill="none" stroke="rgba(200,200,200,0.25)" stroke-width="1"/>
  <rect x="238" y="330" width="18" height="10" rx="0" fill="rgba(100,65,20,0.2)"/>

  <!-- ========================================================== -->
  <!-- ZONE 3 (RIGHT): AUTO MilQ MILK STATION                     -->
  <!-- ========================================================== -->
  <!-- Zone label -->
  <text x="358" y="195" text-anchor="middle" font-size="4.5" font-family="Arial, sans-serif" fill="rgba(150,150,150,0.5)" letter-spacing="1">AUTO MilQ</text>

  <!-- Steam wand mount on body -->
  <rect x="370" y="200" width="14" height="24" rx="4" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <rect x="372" y="204" width="10" height="9" rx="2" fill="#333"/>
  <circle cx="377" cy="208" r="2" fill="#444"/>

  <!-- Ball joint -->
  <circle cx="374" cy="234" r="10" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="374" cy="234" r="5.5" fill="#A0A0A0"/>
  <circle cx="372" cy="232" r="2" fill="rgba(255,255,255,0.15)"/>

  <!-- Wand arm (curves down to nozzle) -->
  <path d="M370 242 Q364 255 360 275 L356 310" stroke="#B8B8B8" stroke-width="5.5" fill="none" stroke-linecap="round"/>
  <path d="M370 242 Q364 255 360 275 L356 310" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Auto-frother nozzle housing (MilQ feature — wider cylindrical nozzle) -->
  <rect x="346" y="296" width="20" height="24" rx="6" fill="#999" stroke="#AAA" stroke-width="0.5"/>
  <!-- Chrome ring details -->
  <rect x="347" y="300" width="18" height="3" rx="1.5" fill="#BBB"/>
  <rect x="347" y="312" width="18" height="2" rx="1" fill="#BBB"/>
  <!-- Nozzle bottom plate -->
  <ellipse cx="356" cy="322" rx="8" ry="3.5" fill="#AAA" stroke="#BBB" stroke-width="0.3"/>
  <!-- Steam holes -->
  <circle cx="353" cy="321" r="1.2" fill="#888"/>
  <circle cx="356" cy="320" r="1.2" fill="#888"/>
  <circle cx="359" cy="321" r="1.2" fill="#888"/>

  <!-- Wand tip -->
  <ellipse cx="356" cy="326" rx="4.5" ry="4" fill="#A8A8A8"/>

  <!-- Stainless steel milk jug (positioned under auto-steam wand) -->
  <path d="M336 400 L338 330 Q338 324 344 320 L366 320 Q372 324 372 330 L374 400 Q374 408 356 410 Q336 408 336 400 Z" fill="url(#jug-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Jug handle -->
  <path d="M372 328 Q384 340 384 370 Q384 398 374 400" stroke="#B8B8B8" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Jug pour spout -->
  <path d="M340 324 Q336 316 332 312" stroke="#C8C8C8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Jug highlight -->
  <line x1="346" y1="326" x2="346" y2="398" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <!-- Jug interior shadow (milk surface) -->
  <ellipse cx="356" cy="322" rx="12" ry="3.5" fill="rgba(240,240,245,0.08)"/>
  <!-- Milk inside hint -->
  <rect x="340" y="360" width="32" height="38" rx="2" fill="rgba(240,240,245,0.06)"/>

  <!-- ======== LOWER BODY DETAILS ======== -->
  <!-- "the Oracle" model name text -->
  <text x="220" y="345" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" fill="rgba(136,136,136,0.5)" font-weight="300" letter-spacing="3">the Oracle</text>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="400" y="130" width="18" height="210" rx="5" fill="rgba(150,180,210,0.08)" stroke="rgba(150,180,210,0.1)" stroke-width="0.5"/>
  <!-- Water level line -->
  <line x1="404" y1="200" x2="414" y2="200" stroke="rgba(150,180,210,0.15)" stroke-width="0.5"/>
  <line x1="404" y1="240" x2="414" y2="240" stroke="rgba(150,180,210,0.12)" stroke-width="0.5"/>
  <line x1="404" y1="280" x2="414" y2="280" stroke="rgba(150,180,210,0.10)" stroke-width="0.5"/>
</svg>`,
  "Lelit Bianca V3": `<svg width="340" height="420" viewBox="0 0 340 420">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8E8E8"/>
      <stop offset="20%" stop-color="#C0C0C0"/>
      <stop offset="45%" stop-color="#F0F0F0"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="80%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#B0B0B0"/>
    </linearGradient>
    <linearGradient id="chrome-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="70%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="walnut" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A07830"/>
      <stop offset="25%" stop-color="#8B6914"/>
      <stop offset="50%" stop-color="#7A5C20"/>
      <stop offset="75%" stop-color="#8B6914"/>
      <stop offset="100%" stop-color="#654321"/>
    </linearGradient>
    <linearGradient id="walnut-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#A07830"/>
      <stop offset="40%" stop-color="#8B6914"/>
      <stop offset="100%" stop-color="#5A4010"/>
    </linearGradient>
    <linearGradient id="walnut-dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B6914"/>
      <stop offset="50%" stop-color="#6B4F10"/>
      <stop offset="100%" stop-color="#4A350D"/>
    </linearGradient>
    <radialGradient id="gauge-face" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="80%" stop-color="#F5F5F5"/>
      <stop offset="100%" stop-color="#E0E0E0"/>
    </radialGradient>
    <radialGradient id="gauge-bezel" cx="0.35" cy="0.3" r="0.7">
      <stop offset="0%" stop-color="#E8E8E8"/>
      <stop offset="50%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#999"/>
    </radialGradient>
    <radialGradient id="e61-dome" cx="0.4" cy="0.3" r="0.7">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="70%" stop-color="#A8A8A8"/>
      <stop offset="100%" stop-color="#909090"/>
    </radialGradient>
    <radialGradient id="knob-depth" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#A07830"/>
      <stop offset="50%" stop-color="#8B6914"/>
      <stop offset="100%" stop-color="#5A4010"/>
    </radialGradient>
    <linearGradient id="body-vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.03)"/>
      <stop offset="50%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.04)"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="170" cy="408" rx="130" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== WALNUT WOOD FEET (4 corners) ======== -->
  <!-- Left foot -->
  <ellipse cx="82" cy="397" rx="13" ry="9" fill="url(#walnut)" stroke="#4A350D" stroke-width="0.6"/>
  <ellipse cx="82" cy="393" rx="13" ry="4" fill="#A07830"/>
  <ellipse cx="80" cy="392" rx="6" ry="2" fill="rgba(255,255,255,0.08)"/>
  <!-- Right foot -->
  <ellipse cx="258" cy="397" rx="13" ry="9" fill="url(#walnut)" stroke="#4A350D" stroke-width="0.6"/>
  <ellipse cx="258" cy="393" rx="13" ry="4" fill="#A07830"/>
  <ellipse cx="256" cy="392" rx="6" ry="2" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== DRIP TRAY ======== -->
  <!-- Tray body -->
  <rect x="62" y="340" width="216" height="55" rx="3" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Inner shadow at top of tray -->
  <rect x="62" y="340" width="216" height="4" rx="1" fill="rgba(0,0,0,0.06)"/>
  <!-- Tray grid area -->
  <rect x="72" y="348" width="196" height="30" rx="2" fill="#B0B0B0"/>
  <!-- Grid slots (staggered lozenge pattern) -->
  <rect x="82" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="110" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="138" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="166" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="194" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="222" y="351" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="96" y="360" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="124" y="360" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="152" y="360" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="180" y="360" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="208" y="360" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="82" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="110" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="138" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="166" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="194" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <rect x="222" y="369" width="22" height="5" rx="2.5" fill="#9A9A9A"/>
  <!-- Tray front lip with pull tab -->
  <rect x="62" y="382" width="216" height="13" rx="2" fill="url(#steel-dark)"/>
  <rect x="148" y="385" width="44" height="6" rx="2" fill="#888" stroke="#777" stroke-width="0.5"/>

  <!-- ======== MAIN BODY (boxy stainless steel) ======== -->
  <rect x="64" y="42" width="212" height="300" rx="4" fill="url(#steel)" stroke="#B0B0B0" stroke-width="0.5"/>
  <!-- Vertical shading overlay for body depth -->
  <rect x="64" y="42" width="212" height="300" rx="4" fill="url(#body-vert)"/>
  <!-- Left edge shadow -->
  <rect x="64" y="42" width="8" height="300" fill="rgba(0,0,0,0.07)"/>
  <!-- Right edge highlight -->
  <rect x="268" y="42" width="8" height="300" fill="rgba(255,255,255,0.04)"/>
  <!-- Subtle horizontal seam line -->
  <line x1="64" y1="340" x2="276" y2="340" stroke="#999" stroke-width="0.5"/>

  <!-- ======== CUP WARMING TRAY (top) ======== -->
  <rect x="62" y="34" width="216" height="12" rx="3" fill="url(#steel-dark)"/>
  <!-- Top cap -->
  <rect x="60" y="30" width="220" height="6" rx="3" fill="#B8B8B8" stroke="#AAA" stroke-width="0.3"/>
  <!-- Ridges on cup tray -->
  <rect x="72" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="82" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="92" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="102" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="112" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="122" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="132" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="142" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="152" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="162" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="172" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="182" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="192" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="202" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="212" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="222" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="232" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="242" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="252" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>
  <rect x="262" y="35" width="5" height="9" rx="1" fill="rgba(0,0,0,0.06)"/>

  <!-- ======== E61 GROUP HEAD (centered, iconic chrome dome) ======== -->
  <!-- Dark recess area behind group head -->
  <rect x="115" y="148" width="110" height="38" rx="3" fill="#505050"/>
  <rect x="115" y="148" width="110" height="10" fill="#444" rx="2"/>
  <!-- Shadow under the dome -->
  <ellipse cx="170" cy="150" rx="30" ry="6" fill="rgba(0,0,0,0.15)"/>
  <!-- E61 chrome body — wider mushroom dome -->
  <!-- Lower chrome cylinder -->
  <rect x="150" y="125" width="40" height="30" rx="6" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <!-- Chrome cylinder highlight -->
  <rect x="164" y="127" width="8" height="26" rx="3" fill="rgba(255,255,255,0.06)"/>
  <!-- Upper dome (wide, flatter) -->
  <ellipse cx="170" cy="125" rx="30" ry="16" fill="url(#e61-dome)" stroke="#999" stroke-width="0.5"/>
  <!-- Dome specular highlight -->
  <ellipse cx="164" cy="118" rx="16" ry="7" fill="rgba(255,255,255,0.1)"/>
  <!-- E61 cap nut on top -->
  <circle cx="170" cy="114" r="8" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <circle cx="170" cy="114" r="5" fill="#C0C0C0"/>
  <!-- Hex nut detail -->
  <polygon points="170,109 174,111 174,117 170,119 166,117 166,111" fill="none" stroke="#999" stroke-width="0.6"/>
  <!-- Cap highlight -->
  <circle cx="168" cy="112" r="2" fill="rgba(255,255,255,0.12)"/>

  <!-- ======== FLOW CONTROL PADDLE (walnut wood — THE signature feature) ======== -->
  <!-- Paddle stem (chrome below, walnut above) -->
  <rect x="167" y="96" width="6" height="14" rx="2" fill="#B0B0B0" stroke="#999" stroke-width="0.3"/>
  <rect x="166" y="72" width="8" height="26" rx="3" fill="url(#walnut-vert)"/>
  <!-- Paddle head (distinctive wide paddle shape) -->
  <path d="M150 74 Q150 62 170 57 Q190 62 190 74 Z" fill="url(#walnut)" stroke="#4A350D" stroke-width="0.8"/>
  <!-- Paddle top highlight -->
  <path d="M158 67 Q170 63 182 67" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
  <!-- Wood grain subtle lines -->
  <path d="M155 72 Q170 69 185 72" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.4"/>

  <!-- ======== WALNUT STAR KNOBS (steam left, hot water right) ======== -->
  <!-- LEFT KNOB (steam) — 5 rounded petal/lobe shape with depth -->
  <g transform="translate(100, 115)">
    <!-- Shadow under knob -->
    <ellipse cx="2" cy="3" rx="18" ry="16" fill="rgba(0,0,0,0.12)"/>
    <!-- 5-petal flower knob shape -->
    <circle cx="0" cy="-12" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="11.4" cy="-3.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="7" cy="9.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="-7" cy="9.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="-11.4" cy="-3.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <!-- Center hub -->
    <circle cx="0" cy="0" r="9" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="0" cy="0" r="5.5" fill="#7A5C20"/>
    <!-- Highlight on hub -->
    <ellipse cx="-1" cy="-2" rx="3" ry="2" fill="rgba(255,255,255,0.1)"/>
    <!-- Chrome center screw -->
    <circle cx="0" cy="0" r="2.5" fill="url(#chrome)" stroke="#AAA" stroke-width="0.3"/>
    <circle cx="-0.5" cy="-0.5" r="0.8" fill="rgba(255,255,255,0.2)"/>
  </g>

  <!-- RIGHT KNOB (hot water) — 5 rounded petal/lobe shape with depth -->
  <g transform="translate(240, 115)">
    <!-- Shadow under knob -->
    <ellipse cx="2" cy="3" rx="18" ry="16" fill="rgba(0,0,0,0.12)"/>
    <!-- 5-petal flower knob shape -->
    <circle cx="0" cy="-12" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="11.4" cy="-3.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="7" cy="9.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="-7" cy="9.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="-11.4" cy="-3.7" r="6.5" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="0" cy="0" r="9" fill="url(#knob-depth)" stroke="#4A350D" stroke-width="0.5"/>
    <circle cx="0" cy="0" r="5.5" fill="#7A5C20"/>
    <ellipse cx="-1" cy="-2" rx="3" ry="2" fill="rgba(255,255,255,0.1)"/>
    <circle cx="0" cy="0" r="2.5" fill="url(#chrome)" stroke="#AAA" stroke-width="0.3"/>
    <circle cx="-0.5" cy="-0.5" r="0.8" fill="rgba(255,255,255,0.2)"/>
  </g>

  <!-- ======== PRESSURE GAUGE (right side, dual-needle, white face) ======== -->
  <!-- Shadow behind gauge -->
  <circle cx="242" cy="168" r="25" fill="rgba(0,0,0,0.08)"/>
  <!-- Chrome bezel (wider, more prominent) -->
  <circle cx="240" cy="166" r="24" fill="url(#gauge-bezel)" stroke="#999" stroke-width="0.8"/>
  <!-- Inner chrome ring -->
  <circle cx="240" cy="166" r="21" fill="url(#chrome)" stroke="#AAA" stroke-width="0.3"/>
  <!-- White face -->
  <circle cx="240" cy="166" r="19" fill="url(#gauge-face)"/>
  <!-- Gauge arc markings -->
  <path d="M224 158 A18 18 0 0 1 256 158" fill="none" stroke="#333" stroke-width="0.8"/>
  <path d="M222 166 A20 20 0 0 1 226 154" fill="none" stroke="#555" stroke-width="0.5"/>
  <!-- Tick marks around the arc -->
  <line x1="240" y1="148" x2="240" y2="152" stroke="#333" stroke-width="0.6"/>
  <line x1="231" y1="150" x2="232" y2="154" stroke="#333" stroke-width="0.5"/>
  <line x1="249" y1="150" x2="248" y2="154" stroke="#333" stroke-width="0.5"/>
  <line x1="224" y1="157" x2="226" y2="160" stroke="#333" stroke-width="0.5"/>
  <line x1="256" y1="157" x2="254" y2="160" stroke="#333" stroke-width="0.5"/>
  <line x1="222" y1="166" x2="225" y2="166" stroke="#333" stroke-width="0.5"/>
  <line x1="258" y1="166" x2="255" y2="166" stroke="#333" stroke-width="0.5"/>
  <!-- Red needle (steam) -->
  <line x1="240" y1="166" x2="232" y2="153" stroke="#CC0000" stroke-width="1" stroke-linecap="round"/>
  <!-- Black needle (pump) -->
  <line x1="240" y1="166" x2="246" y2="154" stroke="#222" stroke-width="0.8" stroke-linecap="round"/>
  <!-- Center pin -->
  <circle cx="240" cy="166" r="2.5" fill="#444"/>
  <circle cx="240" cy="166" r="1.2" fill="#666"/>
  <!-- Labels -->
  <text x="232" y="176" font-size="3.2" fill="#CC0000" font-family="sans-serif" font-weight="bold">STEAM</text>
  <text x="240" y="180" text-anchor="middle" font-size="3" fill="#333" font-family="sans-serif">PUMP</text>
  <!-- Glass glare effect -->
  <ellipse cx="234" cy="158" rx="8" ry="6" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== OLED PID DISPLAY (left side, below knob) ======== -->
  <!-- Display housing with chrome bezel -->
  <rect x="86" y="168" width="42" height="24" rx="4" fill="#222" stroke="#888" stroke-width="0.8"/>
  <!-- Screen bezel -->
  <rect x="89" y="171" width="36" height="18" rx="3" fill="#111"/>
  <!-- Screen -->
  <rect x="91" y="173" width="32" height="14" rx="2" fill="#050505"/>
  <!-- Display text (temperature readout) -->
  <text x="107" y="183" text-anchor="middle" font-size="9" fill="#00D4FF" font-family="monospace" font-weight="bold">93.5</text>
  <!-- Degree symbol -->
  <text x="123" y="178" font-size="4" fill="#00BBDD" font-family="monospace">°C</text>
  <!-- Screen glow -->
  <rect x="91" y="173" width="32" height="14" rx="2" fill="rgba(0,180,255,0.03)"/>

  <!-- ======== POWER BUTTON (chrome, round, below PID) ======== -->
  <!-- Shadow -->
  <circle cx="108" cy="210" r="9" fill="rgba(0,0,0,0.08)"/>
  <circle cx="107" cy="209" r="9" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <circle cx="107" cy="209" r="6" fill="#C8C8C8"/>
  <!-- Power icon -->
  <path d="M107 204 L107 208" stroke="#666" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M103 206 Q107 202 111 206" fill="none" stroke="#666" stroke-width="0.8" stroke-linecap="round"/>
  <!-- Button highlight -->
  <circle cx="105" cy="207" r="2" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== LELIT LOGO BADGE (red, with chrome border) ======== -->
  <!-- Badge shadow -->
  <rect x="92" y="237" width="36" height="15" rx="2.5" fill="rgba(0,0,0,0.1)"/>
  <!-- Chrome border -->
  <rect x="89" y="234" width="38" height="16" rx="3" fill="url(#chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Red badge interior -->
  <rect x="91" y="236" width="34" height="12" rx="2" fill="#CC0000"/>
  <!-- Badge highlight -->
  <rect x="91" y="236" width="34" height="5" rx="2" fill="rgba(255,255,255,0.08)"/>
  <text x="108" y="245.5" text-anchor="middle" font-size="7" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="bold" letter-spacing="1.5">LELIT</text>

  <!-- ======== +/- BUTTONS (small, below badge) ======== -->
  <circle cx="96" cy="262" r="4.5" fill="#2A2A2A" stroke="#555" stroke-width="0.5"/>
  <text x="96" y="264.5" text-anchor="middle" font-size="6" fill="#888" font-family="sans-serif" font-weight="bold">-</text>
  <circle cx="121" cy="262" r="4.5" fill="#2A2A2A" stroke="#555" stroke-width="0.5"/>
  <text x="121" y="265" text-anchor="middle" font-size="6" fill="#888" font-family="sans-serif" font-weight="bold">+</text>

  <!-- ======== PORTAFILTER ======== -->
  <!-- Chrome group head ring (connects E61 to portafilter) -->
  <ellipse cx="170" cy="178" rx="28" ry="8" fill="#999" stroke="#AAA" stroke-width="0.8"/>
  <ellipse cx="170" cy="176" rx="24" ry="5" fill="rgba(255,255,255,0.06)"/>
  <!-- Dark basket — viewed from front, prominent -->
  <ellipse cx="170" cy="196" rx="30" ry="28" fill="#333" stroke="#666" stroke-width="1.5"/>
  <ellipse cx="170" cy="196" rx="26" ry="24" fill="#2A2A2A"/>
  <ellipse cx="170" cy="196" rx="20" ry="18" fill="#1E1E1E"/>
  <!-- Basket bottom highlight -->
  <ellipse cx="164" cy="189" rx="10" ry="8" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector (chrome) -->
  <path d="M157 220 L157 228 Q157 233 162 233 L178 233 Q183 233 183 228 L183 220" fill="url(#chrome-vert)" stroke="#999" stroke-width="0.5"/>
  <!-- Spout housing -->
  <rect x="155" y="233" width="30" height="10" rx="3" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <!-- Dual spouts -->
  <rect x="159" y="241" width="7" height="16" rx="3" fill="#333" stroke="#444" stroke-width="0.3"/>
  <rect x="174" y="241" width="7" height="16" rx="3" fill="#333" stroke="#444" stroke-width="0.3"/>
  <!-- Spout tips -->
  <ellipse cx="162.5" cy="256" rx="3" ry="1.5" fill="#444"/>
  <ellipse cx="177.5" cy="256" rx="3" ry="1.5" fill="#444"/>

  <!-- Handle — extends to the LEFT with walnut wood (thick, prominent) -->
  <line x1="140" y1="196" x2="52" y2="203" stroke="#3A3A3A" stroke-width="16" stroke-linecap="round"/>
  <line x1="140" y1="196" x2="52" y2="203" stroke="url(#walnut)" stroke-width="10" stroke-linecap="round"/>
  <!-- Wood grain highlight -->
  <line x1="128" y1="197" x2="62" y2="202" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-linecap="round"/>
  <!-- Handle end cap -->
  <circle cx="48" cy="204" r="10" fill="#654321" stroke="#3A2A0D" stroke-width="1.2"/>
  <circle cx="48" cy="204" r="7" fill="#7A5C20"/>
  <circle cx="46" cy="202" r="2.5" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== STEAM WAND (right side) ======== -->
  <!-- Wand ball joint (chrome sphere) -->
  <circle cx="270" cy="185" r="9" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <circle cx="270" cy="185" r="5" fill="#B8B8B8"/>
  <circle cx="268" cy="183" r="1.5" fill="rgba(255,255,255,0.15)"/>
  <!-- Chrome wand arm (thicker, with highlight) -->
  <path d="M277 190 Q284 202 286 228 L288 278 L290 318" stroke="#B8B8B8" stroke-width="6.5" fill="none" stroke-linecap="round"/>
  <path d="M277 190 Q284 202 286 228 L288 278 L290 318" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
  <!-- Walnut wood grip on steam wand -->
  <rect x="282" y="250" width="13" height="24" rx="5" fill="url(#walnut-vert)" stroke="#4A350D" stroke-width="0.5"/>
  <!-- Grip highlight -->
  <rect x="285" y="252" width="4" height="20" rx="2" fill="rgba(255,255,255,0.06)"/>
  <!-- Wand tip (chrome) -->
  <ellipse cx="290" cy="322" rx="5" ry="6" fill="#B0B0B0" stroke="#999" stroke-width="0.3"/>
  <circle cx="290" cy="324" r="1.5" fill="#888"/>

  <!-- ======== HOT WATER WAND (left side, thinner) ======== -->
  <!-- Wand ball joint -->
  <circle cx="72" cy="155" r="6" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <circle cx="72" cy="155" r="3" fill="#B0B0B0"/>
  <circle cx="71" cy="153.5" r="1" fill="rgba(255,255,255,0.12)"/>
  <!-- Wand arm -->
  <path d="M67 160 Q62 172 60 198 L58 250 L56 288" stroke="#B0B0B0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M67 160 Q62 172 60 198 L58 250 L56 288" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="none"/>
  <!-- Walnut wood tip -->
  <rect x="52" y="272" width="9" height="14" rx="3.5" fill="url(#walnut-vert)" stroke="#4A350D" stroke-width="0.4"/>
  <!-- Tip -->
  <ellipse cx="56.5" cy="291" rx="3.5" ry="4" fill="#A0A0A0"/>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="268" y="80" width="16" height="250" rx="4" fill="rgba(150,180,210,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>

  <!-- ======== "Bianca" SCRIPT on body (subtle engraved look) ======== -->
  <text x="200" y="145" text-anchor="middle" font-size="13" font-family="Georgia, serif" fill="rgba(180,180,180,0.3)" font-style="italic" letter-spacing="1.5">Bianca</text>

</svg>`,
  "Profitec Go": `<svg width="340" height="430" viewBox="0 0 340 430">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <linearGradient id="tray-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="50%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#909090"/>
    </linearGradient>
    <linearGradient id="gauge-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5BA8C8"/>
      <stop offset="100%" stop-color="#3A7A98"/>
    </linearGradient>
    <linearGradient id="black-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="15%" stop-color="#2A2A2A"/>
      <stop offset="50%" stop-color="#303030"/>
      <stop offset="85%" stop-color="#2A2A2A"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
    <linearGradient id="chrome-btn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="165" cy="418" rx="110" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY (chrome, slightly wider than body) ======== -->
  <!-- Tray slot shadow (where tray slides into body) -->
  <rect x="60" y="353" width="210" height="4" rx="1" fill="rgba(0,0,0,0.3)"/>
  <rect x="52" y="355" width="226" height="55" rx="3" fill="url(#tray-grad)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Tray grid area -->
  <rect x="62" y="362" width="206" height="34" rx="2" fill="#A0A0A0"/>
  <!-- Perforated grid (smaller, denser dot pattern) -->
  <g fill="#909090">
    <!-- Row 1 -->
    <circle cx="74" cy="367" r="1.3"/><circle cx="84" cy="367" r="1.3"/><circle cx="94" cy="367" r="1.3"/>
    <circle cx="104" cy="367" r="1.3"/><circle cx="114" cy="367" r="1.3"/><circle cx="124" cy="367" r="1.3"/>
    <circle cx="134" cy="367" r="1.3"/><circle cx="144" cy="367" r="1.3"/><circle cx="154" cy="367" r="1.3"/>
    <circle cx="164" cy="367" r="1.3"/><circle cx="174" cy="367" r="1.3"/><circle cx="184" cy="367" r="1.3"/>
    <circle cx="194" cy="367" r="1.3"/><circle cx="204" cy="367" r="1.3"/><circle cx="214" cy="367" r="1.3"/>
    <circle cx="224" cy="367" r="1.3"/><circle cx="234" cy="367" r="1.3"/><circle cx="244" cy="367" r="1.3"/>
    <circle cx="254" cy="367" r="1.3"/>
    <!-- Row 2 -->
    <circle cx="79" cy="375" r="1.3"/><circle cx="89" cy="375" r="1.3"/><circle cx="99" cy="375" r="1.3"/>
    <circle cx="109" cy="375" r="1.3"/><circle cx="119" cy="375" r="1.3"/><circle cx="129" cy="375" r="1.3"/>
    <circle cx="139" cy="375" r="1.3"/><circle cx="149" cy="375" r="1.3"/><circle cx="159" cy="375" r="1.3"/>
    <circle cx="169" cy="375" r="1.3"/><circle cx="179" cy="375" r="1.3"/><circle cx="189" cy="375" r="1.3"/>
    <circle cx="199" cy="375" r="1.3"/><circle cx="209" cy="375" r="1.3"/><circle cx="219" cy="375" r="1.3"/>
    <circle cx="229" cy="375" r="1.3"/><circle cx="239" cy="375" r="1.3"/><circle cx="249" cy="375" r="1.3"/>
    <!-- Row 3 -->
    <circle cx="74" cy="383" r="1.3"/><circle cx="84" cy="383" r="1.3"/><circle cx="94" cy="383" r="1.3"/>
    <circle cx="104" cy="383" r="1.3"/><circle cx="114" cy="383" r="1.3"/><circle cx="124" cy="383" r="1.3"/>
    <circle cx="134" cy="383" r="1.3"/><circle cx="144" cy="383" r="1.3"/><circle cx="154" cy="383" r="1.3"/>
    <circle cx="164" cy="383" r="1.3"/><circle cx="174" cy="383" r="1.3"/><circle cx="184" cy="383" r="1.3"/>
    <circle cx="194" cy="383" r="1.3"/><circle cx="204" cy="383" r="1.3"/><circle cx="214" cy="383" r="1.3"/>
    <circle cx="224" cy="383" r="1.3"/><circle cx="234" cy="383" r="1.3"/><circle cx="244" cy="383" r="1.3"/>
    <circle cx="254" cy="383" r="1.3"/>
    <!-- Row 4 -->
    <circle cx="79" cy="391" r="1.3"/><circle cx="89" cy="391" r="1.3"/><circle cx="99" cy="391" r="1.3"/>
    <circle cx="109" cy="391" r="1.3"/><circle cx="119" cy="391" r="1.3"/><circle cx="129" cy="391" r="1.3"/>
    <circle cx="139" cy="391" r="1.3"/><circle cx="149" cy="391" r="1.3"/><circle cx="159" cy="391" r="1.3"/>
    <circle cx="169" cy="391" r="1.3"/><circle cx="179" cy="391" r="1.3"/><circle cx="189" cy="391" r="1.3"/>
    <circle cx="199" cy="391" r="1.3"/><circle cx="209" cy="391" r="1.3"/><circle cx="219" cy="391" r="1.3"/>
    <circle cx="229" cy="391" r="1.3"/><circle cx="239" cy="391" r="1.3"/><circle cx="249" cy="391" r="1.3"/>
  </g>
  <!-- Tray front lip -->
  <rect x="52" y="398" width="226" height="10" rx="2" fill="url(#steel-dark)"/>

  <!-- ======== MAIN BODY (MATTE BLACK, narrow and tall) ======== -->
  <rect x="60" y="38" width="210" height="320" rx="4" fill="url(#black-body)" stroke="#444" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="60" y="38" width="7" height="320" fill="rgba(0,0,0,0.15)"/>
  <!-- Right edge subtle highlight -->
  <rect x="263" y="38" width="7" height="320" fill="rgba(255,255,255,0.03)"/>
  <!-- Subtle vertical center highlight (matte sheen) -->
  <rect x="155" y="50" width="20" height="300" fill="rgba(255,255,255,0.015)"/>

  <!-- ======== TOP EDGE CAP ======== -->
  <rect x="58" y="34" width="214" height="8" rx="3" fill="#383838" stroke="#555" stroke-width="0.3"/>

  <!-- ======== CUP WARMING TRAY (flat top, dark) ======== -->
  <rect x="62" y="38" width="206" height="12" rx="2" fill="#252525"/>
  <!-- Top tray edge line -->
  <line x1="62" y1="50" x2="268" y2="50" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <!-- Ridges -->
  <g fill="rgba(255,255,255,0.04)">
    <rect x="74" y="40" width="4" height="8" rx="1"/>
    <rect x="84" y="40" width="4" height="8" rx="1"/>
    <rect x="94" y="40" width="4" height="8" rx="1"/>
    <rect x="104" y="40" width="4" height="8" rx="1"/>
    <rect x="114" y="40" width="4" height="8" rx="1"/>
    <rect x="124" y="40" width="4" height="8" rx="1"/>
    <rect x="134" y="40" width="4" height="8" rx="1"/>
    <rect x="144" y="40" width="4" height="8" rx="1"/>
    <rect x="154" y="40" width="4" height="8" rx="1"/>
    <rect x="164" y="40" width="4" height="8" rx="1"/>
    <rect x="174" y="40" width="4" height="8" rx="1"/>
    <rect x="184" y="40" width="4" height="8" rx="1"/>
    <rect x="194" y="40" width="4" height="8" rx="1"/>
    <rect x="204" y="40" width="4" height="8" rx="1"/>
    <rect x="214" y="40" width="4" height="8" rx="1"/>
    <rect x="224" y="40" width="4" height="8" rx="1"/>
    <rect x="234" y="40" width="4" height="8" rx="1"/>
    <rect x="244" y="40" width="4" height="8" rx="1"/>
    <rect x="254" y="40" width="4" height="8" rx="1"/>
  </g>

  <!-- ======== UPPER CONTROL PANEL ======== -->
  <!-- The Profitec Go has buttons on the left, steam knob on the right -->
  <!-- Subtle horizontal divider between control area and group head area -->
  <line x1="60" y1="210" x2="270" y2="210" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>

  <!-- ======== 3 ROUND CHROME PUSH BUTTONS (left side, vertically stacked) ======== -->
  <!-- Button 1 — Brew (top, near top of panel) -->
  <circle cx="97" cy="80" r="9" fill="url(#chrome-btn)" stroke="#AAA" stroke-width="0.8"/>
  <circle cx="97" cy="80" r="6.5" fill="#C0C0C0"/>
  <circle cx="97" cy="80" r="4" fill="#B0B0B0"/>
  <!-- Highlight -->
  <ellipse cx="95" cy="77" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.12)"/>
  <!-- Cup/brew icon -->
  <rect x="94" y="78" width="6" height="4" rx="1" fill="none" stroke="#777" stroke-width="0.6"/>
  <rect x="92.5" y="81.5" width="9" height="1.3" rx="0.65" fill="#777"/>
  <!-- Amber indicator light -->
  <circle cx="114" cy="80" r="3" fill="#CC7722" opacity="0.9"/>
  <circle cx="114" cy="80" r="5" fill="#CC7722" opacity="0.06"/>

  <!-- Button 2 — Steam (middle) -->
  <circle cx="97" cy="126" r="9" fill="url(#chrome-btn)" stroke="#AAA" stroke-width="0.8"/>
  <circle cx="97" cy="126" r="6.5" fill="#C0C0C0"/>
  <circle cx="97" cy="126" r="4" fill="#B0B0B0"/>
  <!-- Highlight -->
  <ellipse cx="95" cy="123" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.12)"/>
  <!-- Steam icon -->
  <path d="M94 123 Q91.5 126 94 129" fill="none" stroke="#777" stroke-width="0.6"/>
  <path d="M98 122 Q95.5 125 98 128" fill="none" stroke="#777" stroke-width="0.6"/>
  <!-- Amber indicator light -->
  <circle cx="114" cy="126" r="3" fill="#CC7722" opacity="0.9"/>
  <circle cx="114" cy="126" r="5" fill="#CC7722" opacity="0.06"/>

  <!-- Button 3 — ON/OFF (bottom, lower on the panel) -->
  <circle cx="97" cy="172" r="9" fill="url(#chrome-btn)" stroke="#AAA" stroke-width="0.8"/>
  <circle cx="97" cy="172" r="6.5" fill="#C0C0C0"/>
  <circle cx="97" cy="172" r="4" fill="#B0B0B0"/>
  <!-- Highlight -->
  <ellipse cx="95" cy="169" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.12)"/>
  <!-- Power icon -->
  <circle cx="97" cy="172.5" r="2.8" fill="none" stroke="#777" stroke-width="0.6"/>
  <line x1="97" y1="169.5" x2="97" y2="172" stroke="#777" stroke-width="0.6"/>
  <!-- ON label -->
  <text x="97" y="187" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="#666" letter-spacing="0.5">ON</text>
  <!-- OFF label -->
  <text x="97" y="194" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="#666" letter-spacing="0.5">OFF</text>
  <!-- Teal/green indicator light -->
  <circle cx="114" cy="172" r="3" fill="#22AA88" opacity="0.9"/>
  <circle cx="114" cy="172" r="5" fill="#22AA88" opacity="0.06"/>

  <!-- ======== STEAM KNOB (right side, large black ridged rotary) ======== -->
  <!-- Shadow -->
  <circle cx="236" cy="105" r="24" fill="rgba(0,0,0,0.2)"/>
  <!-- Outer knob body -->
  <circle cx="234" cy="103" r="24" fill="#1A1A1A" stroke="#444" stroke-width="1"/>
  <!-- Inner rings -->
  <circle cx="234" cy="103" r="20" fill="#222"/>
  <circle cx="234" cy="103" r="14" fill="#2A2A2A"/>
  <!-- Knob grip ridges -->
  <circle cx="234" cy="103" r="22" fill="none" stroke="#333" stroke-width="1.2" stroke-dasharray="4,2.5"/>
  <!-- Indicator dot -->
  <circle cx="234" cy="85" r="2" fill="#555"/>
  <!-- Center detail -->
  <circle cx="234" cy="103" r="6" fill="#252525"/>

  <!-- ======== PROFITEC LOGO BADGE (lower-right of upper body area) ======== -->
  <rect x="180" y="193" width="76" height="14" rx="2" fill="#888" stroke="#AAA" stroke-width="0.5"/>
  <rect x="182" y="194.5" width="72" height="11" rx="1.5" fill="#999"/>
  <!-- Diamond accents -->
  <path d="M186 200 l1.5 -2.5 l1.5 2.5 l-1.5 2.5 z" fill="#777"/>
  <text x="218" y="203.5" text-anchor="middle" font-size="7" font-family="Arial, sans-serif" fill="#555" font-weight="700" letter-spacing="2">PROFITEC</text>
  <path d="M249 200 l1.5 -2.5 l1.5 2.5 l-1.5 2.5 z" fill="#777"/>

  <!-- ======== GROUP HEAD AREA (center, below controls) ======== -->
  <!-- Recessed dark area behind group head -->
  <rect x="90" y="214" width="150" height="36" fill="#151515" rx="2"/>
  <!-- Chrome rail at top of group area -->
  <rect x="90" y="214" width="150" height="4" rx="1" fill="#777" stroke="#888" stroke-width="0.3"/>
  <rect x="90" y="214" width="150" height="1.5" rx="0.5" fill="rgba(255,255,255,0.06)"/>
  <!-- Chrome sides of group area (subtle) -->
  <rect x="90" y="214" width="3" height="36" fill="#666"/>
  <rect x="237" y="214" width="3" height="36" fill="#666"/>

  <!-- Chrome group head collar -->
  <ellipse cx="165" cy="244" rx="30" ry="7.5" fill="rgba(0,0,0,0.12)"/>
  <ellipse cx="165" cy="242" rx="28" ry="7" fill="#AAA" stroke="#BBB" stroke-width="0.8"/>
  <ellipse cx="165" cy="240" rx="26" ry="6" fill="#B8B8B8" stroke="#CCC" stroke-width="0.5"/>
  <ellipse cx="161" cy="238" rx="13" ry="3" fill="rgba(255,255,255,0.1)"/>
  <!-- Locking collar shadow -->
  <ellipse cx="165" cy="247" rx="26" ry="4" fill="rgba(0,0,0,0.15)"/>

  <!-- ======== PORTAFILTER ======== -->
  <!-- Basket front view -->
  <ellipse cx="165" cy="260" rx="26" ry="24" fill="#333" stroke="#555" stroke-width="1.2"/>
  <ellipse cx="165" cy="260" rx="22" ry="20" fill="#2A2A2A"/>
  <ellipse cx="165" cy="260" rx="16" ry="14" fill="#1E1E1E"/>
  <ellipse cx="161" cy="255" rx="9" ry="6.5" fill="rgba(255,255,255,0.05)"/>

  <!-- Spout connector -->
  <path d="M153 280 Q156 286 158 294 L172 294 Q174 286 177 280" fill="#AAA" stroke="#BBB" stroke-width="0.5"/>
  <!-- Dual spouts -->
  <rect x="155" y="294" width="7" height="15" rx="3" fill="#A0A0A0" stroke="#BBB" stroke-width="0.3"/>
  <rect x="168" y="294" width="7" height="15" rx="3" fill="#A0A0A0" stroke="#BBB" stroke-width="0.3"/>
  <!-- Spout openings -->
  <circle cx="158.5" cy="308" r="2" fill="#777"/>
  <circle cx="171.5" cy="308" r="2" fill="#777"/>
  <!-- Spout highlights -->
  <line x1="157" y1="296" x2="157" y2="307" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <line x1="170" y1="296" x2="170" y2="307" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Handle extending LEFT (more subtle, slightly angled) -->
  <line x1="139" y1="257" x2="88" y2="262" stroke="#2A2A2A" stroke-width="9" stroke-linecap="round"/>
  <line x1="139" y1="257" x2="88" y2="262" stroke="#333" stroke-width="5.5" stroke-linecap="round"/>
  <!-- Handle end cap -->
  <circle cx="84" cy="263" r="6" fill="#2A2A2A" stroke="#444" stroke-width="0.8"/>
  <circle cx="84" cy="263" r="4" fill="#333"/>

  <!-- ======== PRESSURE GAUGE (large, blue face, lower-left) ======== -->
  <!-- Gauge shadow -->
  <circle cx="112" cy="320" r="26" fill="rgba(0,0,0,0.2)"/>
  <!-- Chrome bezel -->
  <circle cx="110" cy="318" r="26" fill="#B0B0B0" stroke="#CCC" stroke-width="1"/>
  <circle cx="110" cy="318" r="23" fill="#A8A8A8" stroke="#BBB" stroke-width="0.5"/>
  <!-- Blue gauge face -->
  <circle cx="110" cy="318" r="20" fill="url(#gauge-face)"/>
  <!-- Gauge markings -->
  <g stroke="#fff" stroke-width="0.5" opacity="0.7">
    <line x1="110" y1="300" x2="110" y2="304"/>
    <line x1="98" y1="304" x2="100" y2="307"/>
    <line x1="92" y1="314" x2="95" y2="315"/>
    <line x1="92" y1="324" x2="95" y2="323"/>
    <line x1="98" y1="332" x2="100" y2="330"/>
    <line x1="110" y1="336" x2="110" y2="332"/>
    <line x1="122" y1="332" x2="120" y2="330"/>
    <line x1="128" y1="324" x2="125" y2="323"/>
    <line x1="128" y1="314" x2="125" y2="315"/>
    <line x1="122" y1="304" x2="120" y2="307"/>
  </g>
  <!-- Gauge numbers -->
  <text x="110" y="307" text-anchor="middle" font-size="4" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.8)">0</text>
  <text x="96" y="321" text-anchor="middle" font-size="4" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.8)">8</text>
  <text x="110" y="334" text-anchor="middle" font-size="4" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.8)">16</text>
  <text x="124" y="321" text-anchor="middle" font-size="4" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.8)">4</text>
  <!-- Needle -->
  <line x1="110" y1="318" x2="100" y2="312" stroke="#CC2222" stroke-width="1"/>
  <!-- Center pin -->
  <circle cx="110" cy="318" r="2.5" fill="#888"/>
  <circle cx="110" cy="318" r="1.5" fill="#AAA"/>
  <!-- Glass highlight -->
  <ellipse cx="106" cy="312" rx="8" ry="6" fill="rgba(255,255,255,0.08)"/>

  <!-- ======== PID DISPLAY (LCD, lower-right) ======== -->
  <rect x="196" y="306" width="52" height="28" rx="3" fill="#111" stroke="#444" stroke-width="0.8"/>
  <rect x="200" y="310" width="44" height="20" rx="2" fill="#0A2A1A"/>
  <!-- LCD glow -->
  <rect x="200" y="310" width="44" height="20" rx="2" fill="#33CC66" opacity="0.03"/>
  <!-- LCD text (temperature reading) -->
  <text x="222" y="324" text-anchor="middle" font-size="11" font-family="'Courier New', monospace" fill="#33CC66" font-weight="700">93.5</text>
  <!-- Degree symbol -->
  <text x="243" y="317" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="#33CC66">°C</text>

  <!-- ======== STEAM WAND ======== -->
  <!-- Pivot point (chrome ball joint, right side of body) -->
  <circle cx="262" cy="230" r="5" fill="#A0A0A0" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="262" cy="230" r="3" fill="#B0B0B0"/>
  <!-- Wand arm — with smooth elbow bend like the real machine -->
  <path d="M265 233 Q270 245 274 260 Q276 290 277 348" stroke="#B8B8B8" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M265 233 Q270 245 274 260 Q276 290 277 348" stroke="rgba(255,255,255,0.1)" stroke-width="1.8" fill="none"/>
  <!-- Rubber grip sleeve -->
  <rect x="270" y="285" width="10" height="22" rx="3.5" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Wand tip -->
  <ellipse cx="277" cy="351" rx="4" ry="5" fill="#B0B0B0" stroke="#999" stroke-width="0.5"/>
  <!-- Tip holes -->
  <circle cx="275" cy="352" r="1" fill="#888"/>
  <circle cx="279" cy="352" r="1" fill="#888"/>

  <!-- ======== ESPRESSO CUPS (subtle, under spouts) ======== -->
  <path d="M140 350 L141 318 Q141 314 146 313 L158 313 Q163 314 163 318 L164 350 Q164 354 153 355 Q140 354 140 350 Z" fill="rgba(200,200,200,0.05)" stroke="rgba(200,200,200,0.08)" stroke-width="0.5"/>
  <path d="M166 350 L167 318 Q167 314 172 313 L184 313 Q189 314 189 318 L190 350 Q190 354 179 355 Q166 354 166 350 Z" fill="rgba(200,200,200,0.05)" stroke="rgba(200,200,200,0.08)" stroke-width="0.5"/>
  <ellipse cx="153" cy="322" rx="8" ry="3" fill="rgba(140,100,50,0.10)"/>
  <ellipse cx="179" cy="322" rx="8" ry="3" fill="rgba(140,100,50,0.10)"/>
</svg>`,
  "De'Longhi Magnifica S": `<svg width="340" height="440" viewBox="0 0 340 440">
  <defs>
    <linearGradient id="silver-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8A8A8A"/>
      <stop offset="12%" stop-color="#AAAAAA"/>
      <stop offset="35%" stop-color="#C4C4C4"/>
      <stop offset="55%" stop-color="#BFBFBF"/>
      <stop offset="80%" stop-color="#AAAAAA"/>
      <stop offset="100%" stop-color="#8A8A8A"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="dark-panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#383838"/>
      <stop offset="50%" stop-color="#282828"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="30%" stop-color="#CCC"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="70%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="wand-metal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#777"/>
      <stop offset="40%" stop-color="#AAA"/>
      <stop offset="60%" stop-color="#999"/>
      <stop offset="100%" stop-color="#777"/>
    </linearGradient>
    <linearGradient id="btn-depth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#444"/>
      <stop offset="40%" stop-color="#363636"/>
      <stop offset="100%" stop-color="#2E2E2E"/>
    </linearGradient>
    <linearGradient id="hopper-lid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#222"/>
      <stop offset="30%" stop-color="#1A1A1A"/>
      <stop offset="70%" stop-color="#161616"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="170" cy="425" rx="120" ry="8" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== MAIN SILVER BODY ======== -->
  <rect x="65" y="30" width="210" height="356" rx="5" fill="url(#silver-body)" stroke="#888" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <path d="M65 35 Q65 30 70 30 L76 30 L76 386 L70 386 Q65 386 65 381 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge shadow -->
  <path d="M264 30 L269 30 Q275 30 275 35 L275 381 Q275 386 269 386 L264 386 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Subtle body highlight (center) -->
  <rect x="140" y="120" width="60" height="240" fill="rgba(255,255,255,0.015)"/>

  <!-- ======== BLACK TOP LID (bean hopper) ======== -->
  <rect x="65" y="26" width="210" height="30" rx="5" fill="#1E1E1E" stroke="#444" stroke-width="0.5"/>
  <!-- Lid highlight strip -->
  <rect x="73" y="28" width="194" height="2.5" rx="1" fill="rgba(255,255,255,0.06)"/>
  <!-- Bean hopper lid recess with gradient -->
  <rect x="112" y="30" width="116" height="23" rx="3" fill="url(#hopper-lid)" stroke="#333" stroke-width="0.3"/>
  <!-- Hopper inner shadow (depth) -->
  <rect x="115" y="32" width="110" height="4" rx="1" fill="rgba(0,0,0,0.2)"/>
  <!-- Hopper handle ridge -->
  <rect x="148" y="36" width="44" height="4" rx="2" fill="#252525" stroke="#3A3A3A" stroke-width="0.3"/>
  <!-- Hopper lid highlight edge -->
  <rect x="115" y="49" width="110" height="1.5" rx="0.5" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== CHROME STRIP (decorative band) ======== -->
  <rect x="65" y="56" width="210" height="5" fill="url(#chrome)" stroke="#BBB" stroke-width="0.3"/>

  <!-- ======== DARK PANEL / WINDOW ======== -->
  <rect x="84" y="68" width="172" height="48" rx="3" fill="url(#dark-panel)" stroke="#505050" stroke-width="0.5"/>
  <rect x="89" y="72" width="162" height="40" rx="2" fill="#1A1A1A"/>
  <!-- Subtle sheen -->
  <path d="M89 72 L251 72 L251 79 Q170 84 89 79 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Status indicator lights (small LEDs in dark panel) -->
  <circle cx="100" cy="105" r="1.5" fill="#444" stroke="#555" stroke-width="0.2"/>
  <circle cx="108" cy="105" r="1.5" fill="#444" stroke="#555" stroke-width="0.2"/>
  <circle cx="116" cy="105" r="1.5" fill="#8B4513" stroke="#555" stroke-width="0.2"/>

  <!-- MAGNIFICA XS text (vertical, right side) -->
  <text x="266" y="80" font-size="4.5" font-family="sans-serif" fill="#666" letter-spacing="1" font-weight="500" transform="rotate(90 266 80)">MAGNIFICA XS</text>

  <!-- ======== CONTROL PANEL ======== -->

  <!-- Single espresso button (with depth) -->
  <circle cx="126" cy="132" r="7" fill="url(#btn-depth)" stroke="#5A5A5A" stroke-width="0.6"/>
  <circle cx="126" cy="132" r="6" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
  <rect x="124" y="129" width="4" height="6" rx="1" fill="none" stroke="#BBB" stroke-width="0.5"/>

  <!-- Double espresso button -->
  <circle cx="150" cy="132" r="7" fill="url(#btn-depth)" stroke="#5A5A5A" stroke-width="0.6"/>
  <circle cx="150" cy="132" r="6" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
  <rect x="146" y="129" width="3.5" height="6" rx="0.8" fill="none" stroke="#BBB" stroke-width="0.5"/>
  <rect x="150.5" y="129" width="3.5" height="6" rx="0.8" fill="none" stroke="#BBB" stroke-width="0.5"/>

  <!-- ======== CENTRAL ROTARY DIAL ======== -->
  <circle cx="170" cy="157" r="23" fill="#2A2A2A" stroke="#5A5A5A" stroke-width="1.2"/>
  <circle cx="170" cy="157" r="19" fill="#242424"/>
  <circle cx="170" cy="157" r="13" fill="#2E2E2E" stroke="#484848" stroke-width="0.5"/>
  <!-- Dial texture ring -->
  <circle cx="170" cy="157" r="21" fill="none" stroke="#3C3C3C" stroke-width="0.7" stroke-dasharray="2.5,2.5"/>
  <!-- Dial indicator notch (top) -->
  <line x1="170" y1="136" x2="170" y2="141" stroke="#AAA" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Center dot -->
  <circle cx="170" cy="157" r="3" fill="#383838" stroke="#555" stroke-width="0.3"/>
  <!-- Subtle highlight arc (top of dial) -->
  <path d="M152 140 A20 20 0 0 1 188 140" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>

  <!-- Steam button -->
  <circle cx="204" cy="144" r="7" fill="url(#btn-depth)" stroke="#5A5A5A" stroke-width="0.6"/>
  <circle cx="204" cy="144" r="6" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
  <path d="M202 141 Q204 139 203 145 Q205 141 204 147" stroke="#BBB" stroke-width="0.5" fill="none"/>

  <!-- Hot water button -->
  <circle cx="214" cy="166" r="7" fill="url(#btn-depth)" stroke="#5A5A5A" stroke-width="0.6"/>
  <circle cx="214" cy="166" r="6" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
  <circle cx="214" cy="166" r="2.5" fill="none" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="214" cy="166" r="0.8" fill="#BBB"/>

  <!-- MIN/MAX volume control (left of dial) -->
  <rect x="90" y="150" width="28" height="16" rx="2" fill="#333" stroke="#505050" stroke-width="0.4"/>
  <rect x="91" y="151" width="26" height="2" rx="0.5" fill="rgba(0,0,0,0.15)"/>
  <text x="94" y="157" font-size="3.2" fill="#AAA" font-family="sans-serif">MIN</text>
  <text x="94" y="163" font-size="3.2" fill="#AAA" font-family="sans-serif">MAX</text>
  <!-- Slider track -->
  <rect x="113" y="153" width="3" height="11" rx="1" fill="#444" stroke="#555" stroke-width="0.2"/>
  <rect x="113" y="155" width="3" height="4" rx="1" fill="#999"/>

  <!-- Strength selector (right side) -->
  <rect x="224" y="150" width="28" height="16" rx="2" fill="#333" stroke="#505050" stroke-width="0.4"/>
  <rect x="225" y="151" width="26" height="2" rx="0.5" fill="rgba(0,0,0,0.15)"/>
  <circle cx="231" cy="158" r="2" fill="#AAA"/>
  <circle cx="238" cy="158" r="2" fill="#888"/>
  <circle cx="245" cy="158" r="2" fill="#555"/>

  <!-- Power button (below dial) -->
  <circle cx="170" cy="188" r="6.5" fill="url(#btn-depth)" stroke="#5A5A5A" stroke-width="0.6"/>
  <path d="M170 183 L170 185.5" stroke="#E53935" stroke-width="1" stroke-linecap="round"/>
  <path d="M166 184.5 A5 5 0 1 0 174 184.5" fill="none" stroke="#E53935" stroke-width="0.7"/>

  <!-- ======== DE'LONGHI BADGE ======== -->
  <rect x="130" y="200" width="80" height="17" rx="3" fill="url(#chrome)" stroke="#BBB" stroke-width="0.3"/>
  <!-- Badge inner shadow -->
  <rect x="131" y="201" width="78" height="3" rx="1" fill="rgba(0,0,0,0.06)"/>
  <text x="170" y="212" text-anchor="middle" font-size="7.5" font-family="sans-serif" fill="#444" font-weight="700" letter-spacing="0.3">De'Longhi</text>

  <!-- ======== DISPENSING CAVITY ======== -->
  <rect x="84" y="222" width="172" height="130" rx="4" fill="url(#gloss-black)"/>
  <!-- Cavity top inner shadow -->
  <rect x="85" y="223" width="170" height="5" rx="2" fill="rgba(0,0,0,0.3)"/>
  <!-- Cavity top reflection -->
  <path d="M84 222 L256 222 L256 231 Q170 236 84 231 Z" fill="rgba(255,255,255,0.02)"/>

  <!-- ======== SPOUT ASSEMBLY ======== -->
  <!-- Spout mounting block (black, at top of cavity) -->
  <rect x="142" y="224" width="56" height="14" rx="3" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <!-- Chrome ring around spout exit -->
  <ellipse cx="170" cy="230" rx="12" ry="4" fill="none" stroke="#666" stroke-width="0.5"/>
  <!-- Height adjustment body -->
  <rect x="155" y="238" width="30" height="28" rx="2" fill="url(#chrome-v)" stroke="#AAA" stroke-width="0.3"/>
  <!-- Vertical groove on adjuster -->
  <rect x="168" y="240" width="4" height="24" rx="1" fill="#888" stroke="#999" stroke-width="0.2"/>
  <!-- Adjustment tab -->
  <rect x="172" y="248" width="8" height="6" rx="1" fill="#999" stroke="#AAA" stroke-width="0.2"/>

  <!-- Dual spout tubes -->
  <rect x="159" y="266" width="5" height="34" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <rect x="176" y="266" width="5" height="34" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <!-- Cross bar -->
  <rect x="158" y="284" width="24" height="3" rx="1" fill="#BBB"/>
  <!-- Drip nozzles -->
  <ellipse cx="161.5" cy="301" rx="3.2" ry="3.8" fill="#AAA" stroke="#999" stroke-width="0.2"/>
  <ellipse cx="178.5" cy="301" rx="3.2" ry="3.8" fill="#AAA" stroke="#999" stroke-width="0.2"/>
  <!-- Drip holes -->
  <circle cx="161.5" cy="302" r="1.2" fill="#666"/>
  <circle cx="178.5" cy="302" r="1.2" fill="#666"/>

  <!-- ======== PANARELLO STEAM WAND (left side) ======== -->
  <!-- Wand knob/pivot on body -->
  <circle cx="74" cy="232" r="7.5" fill="#666" stroke="#888" stroke-width="0.6"/>
  <circle cx="74" cy="232" r="5" fill="#555" stroke="#777" stroke-width="0.3"/>
  <!-- Knob highlight -->
  <path d="M68 228 A7 7 0 0 1 80 228" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.6"/>
  <!-- Chrome pipe section (vertical) -->
  <rect x="67" y="239" width="5.5" height="60" rx="1.5" fill="url(#wand-metal)" stroke="#888" stroke-width="0.3"/>
  <!-- Pipe highlight -->
  <rect x="69" y="240" width="1.5" height="58" rx="0.5" fill="rgba(255,255,255,0.08)"/>
  <!-- Panarello sleeve (black, wider, lower section) -->
  <rect x="63.5" y="294" width="12" height="46" rx="3.5" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <!-- Sleeve texture lines -->
  <line x1="65" y1="302" x2="74" y2="302" stroke="#333" stroke-width="0.3"/>
  <line x1="65" y1="308" x2="74" y2="308" stroke="#333" stroke-width="0.3"/>
  <line x1="65" y1="314" x2="74" y2="314" stroke="#333" stroke-width="0.3"/>
  <!-- Panarello tip (bulbous) -->
  <path d="M63.5 334 Q61.5 338 61.5 344 Q61.5 350 69.5 350 Q77.5 350 77.5 344 Q77.5 338 75.5 334 Z" fill="#333" stroke="#555" stroke-width="0.3"/>
  <!-- Tip opening -->
  <ellipse cx="69.5" cy="347" rx="3.5" ry="2" fill="#222"/>

  <!-- ======== DRIP TRAY ======== -->
  <path d="
    M58 356
    L58 386
    Q58 396 72 398
    L268 398
    Q282 396 282 386
    L282 356
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Drip tray top highlight -->
  <rect x="60" y="357" width="220" height="2" rx="0.5" fill="rgba(255,255,255,0.06)"/>

  <!-- Drip tray grate -->
  <rect x="72" y="362" width="196" height="24" rx="3" fill="#1A1A1A"/>
  <!-- Grid slot pattern (rectangular slots instead of dots) -->
  <!-- Row 1 -->
  <rect x="82" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="95" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="121" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="134" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="147" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="160" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="173" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="186" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="199" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="212" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="225" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="238" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="251" y="367" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <!-- Row 2 -->
  <rect x="82" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="95" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="121" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="134" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="147" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="160" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="173" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="186" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="199" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="212" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="225" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="238" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="251" y="372" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <!-- Row 3 -->
  <rect x="82" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="95" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="121" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="134" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="147" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="160" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="173" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="186" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="199" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="212" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="225" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="238" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="251" y="377" width="8" height="2" rx="0.5" fill="#2A2A2A"/>

  <!-- Right side drip tray vertical slots -->
  <rect x="250" y="390" width="1.5" height="5" rx="0.5" fill="#999"/>
  <rect x="254" y="390" width="1.5" height="5" rx="0.5" fill="#999"/>
  <rect x="258" y="390" width="1.5" height="5" rx="0.5" fill="#999"/>
  <rect x="262" y="390" width="1.5" height="5" rx="0.5" fill="#999"/>
  <rect x="266" y="390" width="1.5" height="5" rx="0.5" fill="#999"/>

  <!-- Black base/foot -->
  <path d="M62 396 Q62 412 80 414 L260 414 Q278 412 278 396 Z" fill="#1E1E1E"/>
</svg>`,
  "Philips 3200 LatteGo": `<svg width="340" height="440" viewBox="0 0 340 440">
  <defs>
    <linearGradient id="matte-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#262626"/>
      <stop offset="15%" stop-color="#2E2E2E"/>
      <stop offset="50%" stop-color="#343434"/>
      <stop offset="85%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#262626"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="30%" stop-color="#CCC"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="70%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="hopper-lid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#282828"/>
      <stop offset="50%" stop-color="#1E1E1E"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="panel-trim" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="30%" stop-color="#C0C0C0"/>
      <stop offset="60%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="lattego-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A3A3A"/>
      <stop offset="50%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#282828"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="170" cy="420" rx="130" ry="9" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== MAIN BODY ======== -->
  <!-- Philips 3200: matte black, slightly organic/rounded shape -->
  <path d="
    M58 42
    Q58 28 72 24
    L268 24
    Q282 28 282 42
    L282 370
    Q282 384 268 386
    L72 386
    Q58 384 58 370
    Z
  " fill="url(#matte-black)" stroke="#3E3E3E" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <path d="M58 42 Q58 28 72 24 L78 24 L78 386 L72 386 Q58 384 58 370 Z" fill="rgba(0,0,0,0.1)"/>
  <!-- Right edge highlight -->
  <path d="M276 24 L268 24 Q282 28 282 42 L282 370 Q282 384 268 386 L276 386 Z" fill="rgba(0,0,0,0.06)"/>
  <!-- Subtle center highlight -->
  <rect x="155" y="120" width="30" height="240" rx="2" fill="rgba(255,255,255,0.008)"/>

  <!-- ======== BEAN HOPPER LID ======== -->
  <path d="
    M78 24
    Q78 14 95 12
    L245 12
    Q262 14 262 24
    Z
  " fill="url(#hopper-lid)" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Hopper lid highlight -->
  <rect x="100" y="13" width="140" height="2" rx="1" fill="rgba(255,255,255,0.06)"/>
  <!-- Hopper handle ridge -->
  <rect x="140" y="16" width="60" height="4" rx="2" fill="#282828" stroke="#3A3A3A" stroke-width="0.3"/>

  <!-- ======== CONTROL PANEL AREA ======== -->
  <!-- The Philips 3200 has a distinctive chrome-trimmed swooping panel -->
  <!-- Chrome trim border - asymmetric swoop, wider on right side -->
  <path d="
    M76 34
    L264 34
    Q274 34 276 44
    L278 108
    Q278 120 266 122
    L76 116
    Q66 114 66 104
    L66 44
    Q66 34 76 34
    Z
  " fill="none" stroke="url(#panel-trim)" stroke-width="1.8"/>

  <!-- Dark glossy control panel background -->
  <path d="
    M72 38
    L268 38
    Q274 38 274 46
    L276 106
    Q276 116 264 118
    L72 112
    Q64 110 64 102
    L64 46
    Q64 38 72 38
    Z
  " fill="url(#gloss-black)"/>
  <!-- Panel sheen -->
  <path d="M72 38 L268 38 Q274 38 274 46 L274 52 Q170 58 64 52 L64 46 Q64 38 72 38 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- ======== TOUCH BUTTONS ROW 1 (drink selections) ======== -->
  <!-- Power button (leftmost) -->
  <g>
    <circle cx="84" cy="56" r="6" fill="rgba(255,255,255,0.02)" stroke="#555" stroke-width="0.4"/>
    <path d="M84 51 L84 53.5" stroke="#777" stroke-width="0.7" stroke-linecap="round"/>
    <path d="M81 52.5 A4 4 0 1 0 87 52.5" fill="none" stroke="#777" stroke-width="0.5"/>
  </g>

  <!-- Espresso -->
  <g>
    <rect x="105" y="49" width="7" height="10" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>
    <text x="108.5" y="66" text-anchor="middle" font-size="3.2" fill="#666" font-family="sans-serif">Espresso</text>
  </g>

  <!-- Coffee (taller cup) -->
  <g>
    <rect x="137" y="48" width="9" height="12" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>
    <text x="141.5" y="66" text-anchor="middle" font-size="3.2" fill="#666" font-family="sans-serif">Coffee</text>
  </g>

  <!-- Cappuccino (cup with foam) -->
  <g>
    <rect x="170" y="49" width="9" height="11" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>
    <path d="M171 51.5 Q174.5 48 179 51.5" fill="none" stroke="#AA8855" stroke-width="0.4"/>
    <text x="174.5" y="66" text-anchor="middle" font-size="3.2" fill="#666" font-family="sans-serif">Cappuccino</text>
  </g>

  <!-- Latte Macchiato (layered cup) -->
  <g>
    <rect x="204" y="48" width="9" height="12" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>
    <line x1="205.5" y1="52" x2="211.5" y2="52" stroke="#AA8855" stroke-width="0.3"/>
    <line x1="205.5" y1="55" x2="211.5" y2="55" stroke="#AA8855" stroke-width="0.3"/>
    <text x="208.5" y="66" text-anchor="middle" font-size="3" fill="#666" font-family="sans-serif">Latte M.</text>
  </g>

  <!-- Hot Water -->
  <g>
    <circle cx="240" cy="54" r="6" fill="none" stroke="#AA8855" stroke-width="0.5"/>
    <path d="M238 52 Q240 50 239 55 Q241 51 240 56" stroke="#AA8855" stroke-width="0.4" fill="none"/>
    <text x="240" y="66" text-anchor="middle" font-size="3.2" fill="#666" font-family="sans-serif">Hot Water</text>
  </g>

  <!-- "My Coffee Choice" label (top right) -->
  <text x="254" y="44" font-size="2.5" fill="#555" font-family="sans-serif" text-anchor="end">My Coffee Choice</text>

  <!-- ======== ROW 2: Aroma / Volume / Maintenance ======== -->
  <!-- Aroma strength (3 bean dots) -->
  <circle cx="96" cy="82" r="2.2" fill="#444" stroke="#555" stroke-width="0.3"/>
  <circle cx="106" cy="82" r="2.2" fill="#555" stroke="#666" stroke-width="0.3"/>
  <circle cx="116" cy="82" r="2.2" fill="#777" stroke="#888" stroke-width="0.3"/>

  <!-- Volume size (3 cup sizes) -->
  <rect x="140" y="79" width="5" height="6" rx="0.5" fill="none" stroke="#555" stroke-width="0.4"/>
  <rect x="150" y="78" width="6" height="7" rx="0.5" fill="none" stroke="#666" stroke-width="0.4"/>
  <rect x="161" y="77" width="7" height="8" rx="0.5" fill="none" stroke="#888" stroke-width="0.4"/>

  <!-- AquaClean indicator -->
  <circle cx="198" cy="82" r="3" fill="none" stroke="#555" stroke-width="0.4"/>
  <text x="198" y="83.5" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif">A</text>
  <text x="198" y="92" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif">AquaClean</text>

  <!-- Calc Clean indicator -->
  <circle cx="232" cy="82" r="3" fill="none" stroke="#555" stroke-width="0.4"/>
  <text x="232" y="83.5" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif">C</text>
  <text x="232" y="92" text-anchor="middle" font-size="2.5" fill="#555" font-family="sans-serif">Calc Clean</text>

  <!-- Panel-to-body transition line -->
  <line x1="62" y1="122" x2="278" y2="122" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>

  <!-- ======== PERFORATED DOT PATTERN (left front panel) ======== -->
  <!-- Distinctive triangular/trapezoidal dot grid - key Philips 3200 feature -->
  <g opacity="0.55">
    <circle cx="78" cy="132" r="1.1" fill="#444"/><circle cx="86" cy="132" r="1.1" fill="#444"/><circle cx="94" cy="132" r="1.1" fill="#444"/><circle cx="102" cy="132" r="1.1" fill="#444"/><circle cx="110" cy="132" r="1.1" fill="#444"/><circle cx="118" cy="132" r="1.1" fill="#444"/><circle cx="126" cy="132" r="1.1" fill="#444"/>
    <circle cx="78" cy="140" r="1.1" fill="#444"/><circle cx="86" cy="140" r="1.1" fill="#444"/><circle cx="94" cy="140" r="1.1" fill="#444"/><circle cx="102" cy="140" r="1.1" fill="#444"/><circle cx="110" cy="140" r="1.1" fill="#444"/><circle cx="118" cy="140" r="1.1" fill="#444"/><circle cx="126" cy="140" r="1.1" fill="#444"/>
    <circle cx="78" cy="148" r="1.1" fill="#444"/><circle cx="86" cy="148" r="1.1" fill="#444"/><circle cx="94" cy="148" r="1.1" fill="#444"/><circle cx="102" cy="148" r="1.1" fill="#444"/><circle cx="110" cy="148" r="1.1" fill="#444"/><circle cx="118" cy="148" r="1.1" fill="#444"/><circle cx="126" cy="148" r="1.1" fill="#444"/>
    <circle cx="78" cy="156" r="1.1" fill="#444"/><circle cx="86" cy="156" r="1.1" fill="#444"/><circle cx="94" cy="156" r="1.1" fill="#444"/><circle cx="102" cy="156" r="1.1" fill="#444"/><circle cx="110" cy="156" r="1.1" fill="#444"/><circle cx="118" cy="156" r="1.1" fill="#444"/><circle cx="126" cy="156" r="1.1" fill="#444"/>
    <circle cx="78" cy="164" r="1.1" fill="#444"/><circle cx="86" cy="164" r="1.1" fill="#444"/><circle cx="94" cy="164" r="1.1" fill="#444"/><circle cx="102" cy="164" r="1.1" fill="#444"/><circle cx="110" cy="164" r="1.1" fill="#444"/><circle cx="118" cy="164" r="1.1" fill="#444"/><circle cx="126" cy="164" r="1.1" fill="#444"/>
    <circle cx="78" cy="172" r="1.1" fill="#444"/><circle cx="86" cy="172" r="1.1" fill="#444"/><circle cx="94" cy="172" r="1.1" fill="#444"/><circle cx="102" cy="172" r="1.1" fill="#444"/><circle cx="110" cy="172" r="1.1" fill="#444"/><circle cx="118" cy="172" r="1.1" fill="#444"/><circle cx="126" cy="172" r="1.1" fill="#444"/>
    <circle cx="78" cy="180" r="1.1" fill="#444"/><circle cx="86" cy="180" r="1.1" fill="#444"/><circle cx="94" cy="180" r="1.1" fill="#444"/><circle cx="102" cy="180" r="1.1" fill="#444"/><circle cx="110" cy="180" r="1.1" fill="#444"/><circle cx="118" cy="180" r="1.1" fill="#444"/><circle cx="126" cy="180" r="1.1" fill="#444"/>
    <circle cx="78" cy="188" r="1.1" fill="#444"/><circle cx="86" cy="188" r="1.1" fill="#444"/><circle cx="94" cy="188" r="1.1" fill="#444"/><circle cx="102" cy="188" r="1.1" fill="#444"/><circle cx="110" cy="188" r="1.1" fill="#444"/><circle cx="118" cy="188" r="1.1" fill="#444"/><circle cx="126" cy="188" r="1.1" fill="#444"/>
    <circle cx="78" cy="196" r="1.1" fill="#444"/><circle cx="86" cy="196" r="1.1" fill="#444"/><circle cx="94" cy="196" r="1.1" fill="#444"/><circle cx="102" cy="196" r="1.1" fill="#444"/><circle cx="110" cy="196" r="1.1" fill="#444"/><circle cx="118" cy="196" r="1.1" fill="#444"/><circle cx="126" cy="196" r="1.1" fill="#444"/>
    <circle cx="78" cy="204" r="1.1" fill="#444"/><circle cx="86" cy="204" r="1.1" fill="#444"/><circle cx="94" cy="204" r="1.1" fill="#444"/><circle cx="102" cy="204" r="1.1" fill="#444"/><circle cx="110" cy="204" r="1.1" fill="#444"/><circle cx="118" cy="204" r="1.1" fill="#444"/><circle cx="126" cy="204" r="1.1" fill="#444"/>
    <circle cx="78" cy="212" r="1.1" fill="#444"/><circle cx="86" cy="212" r="1.1" fill="#444"/><circle cx="94" cy="212" r="1.1" fill="#444"/><circle cx="102" cy="212" r="1.1" fill="#444"/><circle cx="110" cy="212" r="1.1" fill="#444"/><circle cx="118" cy="212" r="1.1" fill="#444"/><circle cx="126" cy="212" r="1.1" fill="#444"/>
    <circle cx="78" cy="220" r="1.1" fill="#444"/><circle cx="86" cy="220" r="1.1" fill="#444"/><circle cx="94" cy="220" r="1.1" fill="#444"/><circle cx="102" cy="220" r="1.1" fill="#444"/><circle cx="110" cy="220" r="1.1" fill="#444"/><circle cx="118" cy="220" r="1.1" fill="#444"/><circle cx="126" cy="220" r="1.1" fill="#444"/>
  </g>

  <!-- ======== RIGHT SIDE PANEL AREA (smooth matte, below controls) ======== -->
  <!-- Subtle recessed panel on right side -->
  <rect x="148" y="128" width="120" height="78" rx="4" fill="rgba(0,0,0,0.04)"/>
  <!-- Subtle division line between dot area and right panel -->
  <line x1="140" y1="124" x2="140" y2="216" stroke="rgba(255,255,255,0.015)" stroke-width="0.5"/>

  <!-- ======== PHILIPS LOGO (right side, below panel) ======== -->
  <text x="248" y="148" text-anchor="middle" font-size="7.5" font-family="sans-serif" fill="#555" font-weight="500" letter-spacing="1.5">PHILIPS</text>

  <!-- Model indicator (subtle) -->
  <text x="206" y="194" text-anchor="middle" font-size="3.5" fill="#444" font-family="sans-serif" letter-spacing="0.5">3200 Series</text>

  <!-- ======== DISPENSING CAVITY ======== -->
  <!-- Large open area where cups sit -->
  <rect x="98" y="218" width="144" height="140" rx="6" fill="url(#gloss-black)"/>
  <!-- Cavity top inner shadow -->
  <rect x="99" y="219" width="142" height="6" rx="3" fill="rgba(0,0,0,0.3)"/>
  <!-- Cavity top reflection -->
  <path d="M98 218 L242 218 L242 228 Q170 234 98 228 Z" fill="rgba(255,255,255,0.02)"/>

  <!-- ======== SPOUT ASSEMBLY ======== -->
  <!-- Spout mounting block (at top of cavity) -->
  <rect x="148" y="220" width="44" height="14" rx="3" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <!-- Chrome collar -->
  <ellipse cx="170" cy="228" rx="14" ry="4.5" fill="none" stroke="#888" stroke-width="0.8"/>
  <ellipse cx="170" cy="228" rx="12" ry="3.5" fill="none" stroke="#555" stroke-width="0.3"/>

  <!-- Height adjustment body -->
  <rect x="156" y="234" width="28" height="30" rx="2" fill="url(#chrome-v)" stroke="#AAA" stroke-width="0.3"/>
  <!-- Vertical groove on adjuster -->
  <rect x="168" y="236" width="3" height="26" rx="1" fill="#888" stroke="#999" stroke-width="0.2"/>
  <!-- Adjustment tab -->
  <rect x="171" y="246" width="8" height="5" rx="1" fill="#999" stroke="#AAA" stroke-width="0.2"/>

  <!-- Dual spout tubes -->
  <rect x="160" y="264" width="5" height="36" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <rect x="175" y="264" width="5" height="36" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <!-- Cross bar -->
  <rect x="159" y="282" width="22" height="3" rx="1" fill="#BBB"/>
  <!-- Drip nozzles -->
  <ellipse cx="162.5" cy="301" rx="3.2" ry="3.8" fill="#AAA" stroke="#999" stroke-width="0.2"/>
  <ellipse cx="177.5" cy="301" rx="3.2" ry="3.8" fill="#AAA" stroke="#999" stroke-width="0.2"/>
  <!-- Drip holes -->
  <circle cx="162.5" cy="302" r="1.3" fill="#666"/>
  <circle cx="177.5" cy="302" r="1.3" fill="#666"/>

  <!-- ======== LATTEGO MILK CONTAINER (clips onto right side) ======== -->
  <!-- The LatteGo snaps onto the front of the machine beside the spout -->
  <!-- Clip channel on machine body -->
  <rect x="228" y="232" width="3" height="88" rx="1" fill="#383838" stroke="#4A4A4A" stroke-width="0.3"/>

  <!-- Container outer body -->
  <path d="
    M231 236
    L258 236
    Q264 236 264 242
    L264 316
    Q264 322 258 322
    L231 322
    Z
  " fill="url(#lattego-body)" stroke="#4A4A4A" stroke-width="0.5"/>
  <!-- Container inner visible milk chamber -->
  <rect x="235" y="244" width="24" height="64" rx="3" fill="#2A2A2A" stroke="#3E3E3E" stroke-width="0.3"/>
  <!-- Milk level (semi-transparent white to suggest translucent container) -->
  <rect x="237" y="268" width="20" height="36" rx="2" fill="rgba(230,225,210,0.07)"/>
  <!-- Milk surface line -->
  <line x1="237" y1="268" x2="257" y2="268" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
  <!-- Container top connector block (connects to spout area) -->
  <rect x="218" y="236" width="16" height="12" rx="2" fill="#333" stroke="#4A4A4A" stroke-width="0.3"/>
  <!-- Container bottom handle bump -->
  <rect x="236" y="312" width="18" height="8" rx="3" fill="#383838" stroke="#444" stroke-width="0.3"/>
  <!-- LatteGo label -->
  <text x="248" y="332" text-anchor="middle" font-size="3.2" fill="#555" font-family="sans-serif">LatteGo</text>

  <!-- ======== DRIP TRAY ======== -->
  <path d="
    M60 370
    L60 396
    Q60 406 76 408
    L264 408
    Q280 406 280 396
    L280 370
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Drip tray top highlight -->
  <rect x="62" y="371" width="216" height="2" rx="0.5" fill="rgba(255,255,255,0.06)"/>

  <!-- Drip tray grate -->
  <rect x="76" y="377" width="188" height="22" rx="3" fill="#1A1A1A"/>
  <!-- Grate slots - Row 1 -->
  <rect x="84" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="96" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="120" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="132" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="144" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="156" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="168" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="180" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="192" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="204" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="216" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="228" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="240" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="252" y="381" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <!-- Grate slots - Row 2 -->
  <rect x="84" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="96" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="120" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="132" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="144" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="156" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="168" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="180" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="192" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="204" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="216" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="228" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="240" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="252" y="386" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <!-- Grate slots - Row 3 -->
  <rect x="84" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="96" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="108" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="120" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="132" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="144" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="156" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="168" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="180" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="192" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="204" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="216" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="228" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="240" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>
  <rect x="252" y="391" width="8" height="2" rx="0.5" fill="#2A2A2A"/>

  <!-- Black base/foot -->
  <path d="M64 406 Q64 418 82 420 L258 420 Q276 418 276 406 Z" fill="#1E1E1E"/>
</svg>`,
  "De'Longhi Dinamica": `<svg width="340" height="440" viewBox="0 0 340 440">
  <defs>
    <linearGradient id="silver-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#909090"/>
      <stop offset="15%" stop-color="#B8B8B8"/>
      <stop offset="40%" stop-color="#CCCCCC"/>
      <stop offset="60%" stop-color="#C4C4C4"/>
      <stop offset="85%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#909090"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="panel-gloss" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="#2E2E2E"/>
      <stop offset="30%" stop-color="#1E1E1E"/>
      <stop offset="70%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="30%" stop-color="#CCC"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="70%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <!-- Enhanced glossy surface gradient for panel -->
    <linearGradient id="panel-reflection" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="30%" stop-color="rgba(255,255,255,0.02)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="170" cy="428" rx="130" ry="9" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== MAIN SILVER BODY ======== -->
  <rect x="62" y="36" width="216" height="362" rx="6" fill="url(#silver-body)" stroke="#999" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="62" y="36" width="10" height="362" rx="6" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="268" y="36" width="10" height="362" rx="6" fill="rgba(255,255,255,0.03)"/>
  <!-- Subtle panel break lines on silver body -->
  <line x1="62" y1="195" x2="82" y2="195" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>

  <!-- ======== BLACK TOP / BEAN HOPPER ======== -->
  <rect x="62" y="24" width="216" height="18" rx="6" fill="#2A2A2A" stroke="#444" stroke-width="0.5"/>
  <!-- Lid highlight -->
  <rect x="70" y="26" width="200" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
  <!-- Bean hopper center lid -->
  <rect x="120" y="28" width="100" height="10" rx="3" fill="#222" stroke="#333" stroke-width="0.3"/>
  <!-- Hopper handle ridge -->
  <rect x="148" y="30" width="44" height="4" rx="2" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>

  <!-- ======== CHROME ACCENT STRIP ======== -->
  <rect x="62" y="42" width="216" height="4" fill="url(#chrome)" stroke="#BBB" stroke-width="0.3"/>

  <!-- ======== CENTERED BLACK FRONT PANEL (upper control area + dispensing cavity below) ======== -->
  <path d="
    M110 50
    Q110 48 112 48
    L228 48
    Q230 48 230 50
    L230 195
    L268 195
    Q270 195 270 197
    L270 370
    Q270 372 268 372
    L72 372
    Q70 372 70 370
    L70 197
    Q70 195 72 195
    L110 195
    Z
  " fill="url(#panel-gloss)" stroke="#444" stroke-width="0.4"/>

  <!-- Enhanced glossy reflection on control panel -->
  <path d="M114 50 L168 50 L160 195 L114 195 Z" fill="url(#panel-reflection)"/>

  <!-- Subtle reflection on dispensing cavity top -->
  <path d="M72 195 L268 195 L268 210 Q170 216 72 210 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- ======== DE'LONGHI LOGO ======== -->
  <text x="170" y="68" text-anchor="middle" font-size="6.5" font-family="Arial, sans-serif" fill="#888" font-weight="500" letter-spacing="0.3">De'Longhi</text>

  <!-- ======== DINAMICA TEXT ======== -->
  <text x="170" y="81" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="#666" font-weight="400" letter-spacing="2">DINAMICA</text>

  <!-- ======== STRENGTH INDICATOR DOTS (vertical, left side of panel) ======== -->
  <circle cx="125" cy="100" r="1.8" fill="#777"/>
  <circle cx="125" cy="109" r="1.8" fill="#666"/>
  <circle cx="125" cy="118" r="1.8" fill="#555"/>
  <circle cx="125" cy="127" r="1.8" fill="#444"/>
  <circle cx="125" cy="136" r="1.8" fill="#333"/>

  <!-- ======== DRINK BUTTONS (soft-touch icons, vertically arranged, centered) ======== -->
  <!-- Espresso -->
  <rect x="138" y="96" width="64" height="14" rx="2.5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.3"/>
  <rect x="148" y="99" width="5" height="7" rx="1.2" fill="none" stroke="#888" stroke-width="0.5"/>
  <rect x="145" y="105.5" width="11" height="1.2" rx="0.6" fill="#777"/>
  <text x="172" y="106" font-size="4" fill="#777" font-family="sans-serif">Espresso</text>

  <!-- Long coffee -->
  <rect x="138" y="114" width="64" height="14" rx="2.5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.3"/>
  <rect x="147" y="117" width="7" height="8" rx="1.2" fill="none" stroke="#888" stroke-width="0.5"/>
  <rect x="144" y="124.5" width="13" height="1.2" rx="0.6" fill="#777"/>
  <text x="172" y="124" font-size="4" fill="#777" font-family="sans-serif">Lungo</text>

  <!-- Double espresso -->
  <rect x="138" y="132" width="64" height="14" rx="2.5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.3"/>
  <rect x="146" y="135" width="4.5" height="7" rx="1" fill="none" stroke="#888" stroke-width="0.5"/>
  <rect x="152" y="135" width="4.5" height="7" rx="1" fill="none" stroke="#888" stroke-width="0.5"/>
  <rect x="144" y="141.5" width="15" height="1.2" rx="0.6" fill="#777"/>
  <text x="172" y="142" font-size="4" fill="#777" font-family="sans-serif">Double</text>

  <!-- Iced coffee (TrueBrew Over Ice - blue accent, key differentiator) -->
  <rect x="138" y="150" width="64" height="14" rx="2.5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.3"/>
  <rect x="147" y="153" width="6" height="8" rx="1.2" fill="none" stroke="#6699CC" stroke-width="0.5"/>
  <rect x="148.5" y="155.5" width="3" height="2.5" rx="0.5" fill="none" stroke="#6699CC" stroke-width="0.35"/>
  <rect x="144" y="160.5" width="12" height="1.2" rx="0.6" fill="#6699CC"/>
  <text x="172" y="160" font-size="4" fill="#6699CC" font-family="sans-serif">Iced</text>

  <!-- Steam -->
  <rect x="138" y="168" width="64" height="14" rx="2.5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.3"/>
  <path d="M151 171 Q148 174 151 177" fill="none" stroke="#888" stroke-width="0.5"/>
  <path d="M155 170 Q152 173 155 176" fill="none" stroke="#888" stroke-width="0.5"/>
  <text x="172" y="178" font-size="4" fill="#777" font-family="sans-serif">Steam</text>

  <!-- ======== NAVIGATION ARROWS (volume/strength adjustment) ======== -->
  <path d="M163 196 L170 191 L177 196" fill="none" stroke="#555" stroke-width="0.8" stroke-linecap="round"/>
  <path d="M163 205 L170 210 L177 205" fill="none" stroke="#555" stroke-width="0.8" stroke-linecap="round"/>

  <!-- ======== POWER BUTTON (integrated into panel, subtle) ======== -->
  <circle cx="170" cy="222" r="5" fill="#1A1A1A" stroke="#3A3A3A" stroke-width="0.4"/>
  <path d="M170 218.5 L170 220.5" stroke="#CC3333" stroke-width="0.6" stroke-linecap="round"/>
  <circle cx="170" cy="222" r="2.8" fill="none" stroke="#CC3333" stroke-width="0.4"/>

  <!-- ======== CHROME HORIZONTAL DIVIDER (panel/cavity transition) ======== -->
  <rect x="70" y="193" width="200" height="3" fill="url(#chrome)" stroke="#AAA" stroke-width="0.2"/>

  <!-- ======== SPOUT ASSEMBLY (centered in dispensing cavity) ======== -->
  <!-- Spout mounting block at top of cavity -->
  <rect x="142" y="199" width="56" height="14" rx="3" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.3"/>
  <!-- Adjustment knob on right side -->
  <rect x="200" y="202" width="8" height="7" rx="1.5" fill="#555" stroke="#777" stroke-width="0.3"/>

  <!-- Height adjustment slider body -->
  <rect x="157" y="213" width="26" height="42" rx="2" fill="url(#chrome-v)" stroke="#AAA" stroke-width="0.2"/>
  <!-- Slider grooves -->
  <line x1="168" y1="217" x2="168" y2="251" stroke="#999" stroke-width="0.4"/>
  <line x1="172" y1="217" x2="172" y2="251" stroke="#999" stroke-width="0.4"/>

  <!-- Dual spouts -->
  <rect x="161" y="255" width="5.5" height="34" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <rect x="174" y="255" width="5.5" height="34" rx="1.5" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.2"/>
  <!-- Connector bar -->
  <rect x="160" y="276" width="22" height="3" rx="1" fill="#AAA"/>
  <!-- Drip tips -->
  <ellipse cx="163.75" cy="290" rx="3.2" ry="3.8" fill="#999"/>
  <ellipse cx="176.75" cy="290" rx="3.2" ry="3.8" fill="#999"/>

  <!-- ======== PANARELLO STEAM WAND (left side — clearly a steam wand) ======== -->
  <!-- Wand pivot joint on body — chrome ball joint -->
  <circle cx="70" cy="234" r="6" fill="#888" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="70" cy="234" r="3.5" fill="#777"/>
  <circle cx="68" cy="232" r="1.2" fill="rgba(255,255,255,0.15)"/>

  <!-- Chrome wand arm (thin, clearly a steam wand tube) -->
  <path d="M64 237 L60 265 L56 325 L54 358" stroke="#B0B0B0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M64 237 L60 265 L56 325 L54 358" stroke="rgba(255,255,255,0.1)" stroke-width="1.8" fill="none" stroke-linecap="round"/>

  <!-- Black rubber sleeve (grip section) -->
  <rect x="53" y="284" width="8" height="18" rx="3" fill="#333" stroke="#444" stroke-width="0.3"/>

  <!-- Panarello tip (wider than wand, clearly a frothing attachment) -->
  <path d="M50 350 Q48 354 48 362 Q48 370 56 370 Q64 370 64 362 Q64 354 62 350 Z" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <!-- Tip hole -->
  <ellipse cx="56" cy="367" rx="3" ry="2" fill="#1A1A1A"/>
  <!-- Steam holes on tip -->
  <circle cx="53" cy="364" r="0.8" fill="#1A1A1A"/>
  <circle cx="59" cy="364" r="0.8" fill="#1A1A1A"/>

  <!-- ======== DRIP TRAY ======== -->
  <path d="
    M56 374
    L56 398
    Q56 410 76 412
    L264 412
    Q284 410 284 398
    L284 374
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>

  <!-- Drip tray front lip highlight -->
  <rect x="56" y="374" width="228" height="3" rx="1" fill="rgba(255,255,255,0.06)"/>

  <!-- Drip tray grid (horizontal slots - Dinamica style) -->
  <rect x="70" y="380" width="200" height="24" rx="3" fill="#222"/>
  <rect x="78" y="382" width="184" height="2" rx="1" fill="#3A3A3A"/>
  <rect x="78" y="387" width="184" height="2" rx="1" fill="#3A3A3A"/>
  <rect x="78" y="392" width="184" height="2" rx="1" fill="#3A3A3A"/>
  <rect x="78" y="397" width="184" height="2" rx="1" fill="#3A3A3A"/>

  <!-- Drip tray pull handle (oval cutout on left) -->
  <ellipse cx="76" cy="392" rx="3.5" ry="6.5" fill="#333" stroke="#555" stroke-width="0.3"/>

  <!-- Black base -->
  <path d="M64 410 Q64 424 84 426 L256 426 Q276 424 276 410 Z" fill="#222"/>

  <!-- ======== WATER TANK HINT (right side, barely visible) ======== -->
  <rect x="270" y="70" width="12" height="290" rx="4" fill="rgba(40,40,40,0.4)" stroke="rgba(100,100,100,0.12)" stroke-width="0.5"/>
</svg>`,
  "Jura E4": `<svg width="380" height="460" viewBox="0 0 380 460">
  <defs>
    <linearGradient id="piano-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#222"/>
      <stop offset="15%" stop-color="#303030"/>
      <stop offset="40%" stop-color="#383838"/>
      <stop offset="60%" stop-color="#353535"/>
      <stop offset="85%" stop-color="#2C2C2C"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="piano-black-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2E2E2E"/>
      <stop offset="30%" stop-color="#252525"/>
      <stop offset="60%" stop-color="#202020"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="190" cy="445" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== 3-SECTION BODY ======== -->
  <!-- LEFT WING (shorter, starts lower, angled side, with ventilation slats) -->
  <path d="
    M48 65
    Q38 65 34 69
    L26 380
    Q26 395 42 398
    L105 398
    L105 65
    Z
  " fill="url(#piano-black)" stroke="#444" stroke-width="0.8"/>
  <!-- Left wing subtle edge highlight -->
  <path d="M48 65 L34 69 L26 380 L42 398 L105 398 L105 395 L40 395 Q30 392 30 378 L38 70 Q40 66 48 65 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- LEFT WING VENTILATION SLATS — prominent horizontal ridges -->
  <!-- Each slat: dark groove line + top highlight edge for 3D ridge effect -->
  <line x1="38" y1="80" x2="100" y2="80" stroke="#181818" stroke-width="3"/>
  <line x1="38" y1="78" x2="100" y2="78" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="37" y1="88" x2="100" y2="88" stroke="#181818" stroke-width="3"/>
  <line x1="37" y1="86" x2="100" y2="86" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="37" y1="96" x2="100" y2="96" stroke="#181818" stroke-width="3"/>
  <line x1="37" y1="94" x2="100" y2="94" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="36" y1="104" x2="100" y2="104" stroke="#181818" stroke-width="3"/>
  <line x1="36" y1="102" x2="100" y2="102" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="36" y1="112" x2="100" y2="112" stroke="#181818" stroke-width="3"/>
  <line x1="36" y1="110" x2="100" y2="110" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="35" y1="120" x2="100" y2="120" stroke="#181818" stroke-width="3"/>
  <line x1="35" y1="118" x2="100" y2="118" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="35" y1="128" x2="100" y2="128" stroke="#181818" stroke-width="3"/>
  <line x1="35" y1="126" x2="100" y2="126" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="34" y1="136" x2="100" y2="136" stroke="#181818" stroke-width="3"/>
  <line x1="34" y1="134" x2="100" y2="134" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="34" y1="144" x2="100" y2="144" stroke="#181818" stroke-width="3"/>
  <line x1="34" y1="142" x2="100" y2="142" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="33" y1="152" x2="100" y2="152" stroke="#181818" stroke-width="3"/>
  <line x1="33" y1="150" x2="100" y2="150" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="33" y1="160" x2="100" y2="160" stroke="#181818" stroke-width="3"/>
  <line x1="33" y1="158" x2="100" y2="158" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="32" y1="168" x2="100" y2="168" stroke="#181818" stroke-width="3"/>
  <line x1="32" y1="166" x2="100" y2="166" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <line x1="32" y1="176" x2="100" y2="176" stroke="#181818" stroke-width="3"/>
  <line x1="32" y1="174" x2="100" y2="174" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>

  <!-- Vertical division line left -->
  <line x1="105" y1="65" x2="105" y2="398" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <!-- CENTER SECTION (taller, extends higher) -->
  <path d="
    M105 28
    Q105 24 109 24
    L271 24
    Q275 24 275 28
    L275 398
    L105 398
    Z
  " fill="url(#piano-black)" stroke="#444" stroke-width="0.8"/>
  <!-- Top highlight on center — glossy reflection -->
  <path d="M109 24 L271 24 Q275 24 275 28 L275 34 Q190 38 105 34 L105 28 Q105 24 109 24 Z" fill="rgba(255,255,255,0.05)"/>
  <!-- Left edge ambient light strip on center panel -->
  <path d="M105 28 L108 28 L108 398 L105 398 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- RIGHT WING (shorter, starts lower, angled side) -->
  <path d="
    M275 65
    L275 398
    L338 398
    Q354 395 354 380
    L346 69
    Q344 65 332 65
    Z
  " fill="url(#piano-black)" stroke="#444" stroke-width="0.8"/>
  <!-- Right wing edge highlight -->
  <path d="M332 65 Q340 66 342 70 L350 378 Q352 392 340 395 L275 395 L275 398 L338 398 Q354 395 354 380 L346 69 Q344 65 332 65 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Vertical division line right -->
  <line x1="275" y1="65" x2="275" y2="398" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <!-- ======== DISPLAY/BUTTON PANEL — centered in center section ======== -->
  <!-- Recessed panel area -->
  <rect x="118" y="36" width="144" height="68" rx="4" fill="#111" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Inner bezel -->
  <rect x="122" y="40" width="136" height="58" rx="3" fill="#181818"/>

  <!-- Touch button row — small white illuminated icons like on the E4 -->
  <!-- Power/standby button -->
  <circle cx="140" cy="52" r="3.5" fill="none" stroke="#888" stroke-width="0.8"/>
  <path d="M140 49 L140 51.5" stroke="#888" stroke-width="0.8"/>

  <!-- Small espresso cup icon -->
  <path d="M157 50 L157 56 Q157 58 159 58 L163 58 Q165 58 165 56 L165 50 Z" fill="none" stroke="#777" stroke-width="0.6"/>
  <line x1="158" y1="48" x2="164" y2="48" stroke="#777" stroke-width="0.5"/>

  <!-- Large coffee cup icon -->
  <path d="M179 48 L179 56 Q179 59 182 59 L188 59 Q191 59 191 56 L191 48 Z" fill="none" stroke="#777" stroke-width="0.6"/>
  <line x1="180" y1="46" x2="190" y2="46" stroke="#777" stroke-width="0.5"/>

  <!-- Double espresso icon (2x) -->
  <text x="212" y="56" text-anchor="middle" font-size="7" font-family="sans-serif" fill="#777" font-weight="600">2x</text>

  <!-- Maintenance/wrench icon -->
  <circle cx="235" cy="53" r="3" fill="none" stroke="#666" stroke-width="0.8"/>
  <circle cx="235" cy="53" r="1.2" fill="#666"/>

  <!-- Subtle indicator strip below buttons -->
  <rect x="135" y="64" width="110" height="1" rx="0.5" fill="#333"/>

  <!-- Small status indicators -->
  <circle cx="155" cy="74" r="1.5" fill="#444"/>
  <circle cx="175" cy="74" r="1.5" fill="#444"/>
  <circle cx="195" cy="74" r="1.5" fill="#444"/>
  <circle cx="215" cy="74" r="1.5" fill="#444"/>

  <!-- Navigation arrows -->
  <path d="M127 68 L122 72 L127 76" stroke="#444" stroke-width="1" fill="none"/>
  <path d="M253 68 L258 72 L253 76" stroke="#444" stroke-width="1" fill="none"/>

  <!-- ======== ROTARY DIAL — in right wing, chrome surround ======== -->
  <!-- Chrome outer ring -->
  <circle cx="314" cy="82" r="19" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <!-- Dark inner disc -->
  <circle cx="314" cy="82" r="15" fill="#222" stroke="#444" stroke-width="0.5"/>
  <!-- Inner knob -->
  <circle cx="314" cy="82" r="10" fill="#2A2A2A"/>
  <!-- Center dot -->
  <circle cx="314" cy="82" r="3" fill="#333"/>
  <!-- Detent marks on chrome ring -->
  <circle cx="314" cy="82" r="17" fill="none" stroke="#888" stroke-width="0.5" stroke-dasharray="1.5,2.5"/>
  <!-- Arrow indicator above dial -->
  <path d="M302 64 Q314 56 326 64" fill="none" stroke="#777" stroke-width="1"/>
  <line x1="314" y1="58" x2="314" y2="62" stroke="#777" stroke-width="1"/>

  <!-- ======== JURA LOGO PANEL — centered ======== -->
  <rect x="158" y="118" width="64" height="58" rx="4" fill="#181818" stroke="#333" stroke-width="0.5"/>
  <!-- Subtle glossy reflection on logo panel -->
  <rect x="160" y="120" width="60" height="20" rx="3" fill="rgba(255,255,255,0.015)"/>
  <!-- Jura logo circle — white outline on black, signature Jura branding -->
  <circle cx="190" cy="138" r="14" fill="#111" stroke="#CCC" stroke-width="1.2"/>
  <circle cx="190" cy="138" r="12.5" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/>
  <text x="190" y="143" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#EEE" font-style="italic" font-weight="700">jura</text>
  <!-- E 4 model text -->
  <text x="190" y="168" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#888" font-weight="500" letter-spacing="3">E 4</text>

  <!-- ======== PANEL SEAM LINE — horizontal division ======== -->
  <line x1="72" y1="180" x2="308" y2="180" stroke="#222" stroke-width="1.5"/>
  <line x1="72" y1="181" x2="308" y2="181" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>

  <!-- ======== BLACK GLOSSY DISPENSING AREA ======== -->
  <rect x="72" y="182" width="236" height="170" rx="5" fill="url(#gloss-black)"/>
  <!-- Dispensing niche recessed area — darker inner cavity -->
  <rect x="110" y="195" width="160" height="140" rx="4" fill="#0D0D0D"/>
  <!-- Niche left wall shadow -->
  <rect x="110" y="195" width="4" height="140" fill="rgba(255,255,255,0.02)"/>
  <!-- Niche right wall shadow -->
  <rect x="266" y="195" width="4" height="140" fill="rgba(0,0,0,0.1)"/>
  <!-- Niche top shadow -->
  <rect x="110" y="195" width="160" height="6" fill="rgba(0,0,0,0.2)"/>
  <!-- Glossy reflection band on outer panel -->
  <path d="M72 182 L308 182 L308 198 Q190 206 72 198 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Subtle vertical reflection -->
  <path d="M78 280 L95 182 L102 182 L85 280 Z" fill="rgba(255,255,255,0.01)"/>

  <!-- ======== SPOUT — compact coffee-only dispenser ======== -->
  <!-- Spout housing/slide rail -->
  <rect x="176" y="196" width="28" height="12" rx="3" fill="#444" stroke="#555" stroke-width="0.4"/>
  <!-- Height adjust tab -->
  <rect x="205" y="199" width="5" height="6" rx="1" fill="#333" stroke="#555" stroke-width="0.3"/>
  <!-- Main spout body -->
  <rect x="182" y="208" width="16" height="30" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlight strip on spout body -->
  <rect x="188" y="210" width="3" height="26" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Dual spout nozzles -->
  <rect x="184" y="238" width="4" height="26" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <rect x="192" y="238" width="4" height="26" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Spout spreader bar -->
  <rect x="183" y="250" width="14" height="3" rx="1" fill="#BBB"/>
  <!-- Nozzle openings -->
  <ellipse cx="186" cy="265" rx="2.5" ry="3" fill="#999"/>
  <ellipse cx="194" cy="265" rx="2.5" ry="3" fill="#999"/>

  <!-- ======== DRIP TRAY ======== -->
  <!-- Chrome tray surround -->
  <path d="
    M30 380
    L30 400
    Q30 418 55 420
    L325 420
    Q350 418 350 400
    L350 380
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Black grate inset -->
  <rect x="50" y="385" width="280" height="22" rx="3" fill="#181818"/>
  <!-- Grate lines -->
  <line x1="75" y1="390" x2="75" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="105" y1="390" x2="105" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="135" y1="390" x2="135" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="165" y1="390" x2="165" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="195" y1="390" x2="195" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="225" y1="390" x2="225" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="255" y1="390" x2="255" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="285" y1="390" x2="285" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="315" y1="390" x2="315" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Chrome trim line on drip tray -->
  <line x1="40" y1="411" x2="340" y2="411" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M42 418 Q42 432 68 434 L312 434 Q338 432 338 418 Z" fill="#181818"/>
  <!-- Base chrome trim -->
  <line x1="60" y1="434" x2="320" y2="434" stroke="#888" stroke-width="0.3"/>
</svg>`,
  "Jura E6": `<svg width="380" height="460" viewBox="0 0 380 460">
  <defs>
    <linearGradient id="white-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="20%" stop-color="#EEEEEE"/>
      <stop offset="50%" stop-color="#F5F5F5"/>
      <stop offset="80%" stop-color="#E8E8E8"/>
      <stop offset="100%" stop-color="#D0D0D0"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="190" cy="445" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== 3-SECTION BODY ======== -->
  <!-- LEFT WING (shorter, starts lower, angled side) -->
  <path d="
    M48 65
    Q38 65 34 69
    L26 380
    Q26 395 42 398
    L105 398
    L105 65
    Z
  " fill="url(#white-body)" stroke="#CCC" stroke-width="0.5"/>
  <!-- Left wing angled facet shadow -->
  <path d="M48 65 L34 69 L26 380 L42 398 L105 398 L105 395 L40 395 Q30 392 30 378 L38 70 Q40 66 48 65 Z" fill="rgba(0,0,0,0.02)"/>
  <!-- Vertical division line left -->
  <line x1="105" y1="65" x2="105" y2="398" stroke="rgba(0,0,0,0.04)" stroke-width="1"/>

  <!-- CENTER SECTION (taller, extends higher) -->
  <path d="
    M105 28
    Q105 24 109 24
    L271 24
    Q275 24 275 28
    L275 398
    L105 398
    Z
  " fill="url(#white-body)" stroke="#CCC" stroke-width="0.5"/>

  <!-- RIGHT WING (shorter, starts lower, angled side) -->
  <path d="
    M275 65
    L275 398
    L338 398
    Q354 395 354 380
    L346 69
    Q344 65 332 65
    Z
  " fill="url(#white-body)" stroke="#CCC" stroke-width="0.5"/>
  <!-- Right wing angled facet highlight -->
  <path d="M332 65 Q340 66 342 70 L350 378 Q352 392 340 395 L275 395 L275 398 L338 398 Q354 395 354 380 L346 69 Q344 65 332 65 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Vertical division line right -->
  <line x1="275" y1="65" x2="275" y2="398" stroke="rgba(0,0,0,0.04)" stroke-width="1"/>

  <!-- ======== DISPLAY — centered in center section ======== -->
  <rect x="118" y="40" width="144" height="65" rx="4" fill="#1A1A1A" stroke="#333" stroke-width="0.5"/>
  <rect x="124" y="45" width="132" height="52" rx="3" fill="#262626"/>
  <!-- 2x2 drink grid -->
  <rect x="128" y="49" width="58" height="21" rx="2" fill="#2D2D2D" stroke="#3A3A3A" stroke-width="0.3"/>
  <text x="133" y="58" font-size="3.5" fill="#999" font-family="sans-serif">Espresso</text>
  <rect x="166" y="52" width="5" height="7" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>

  <rect x="192" y="49" width="58" height="21" rx="2" fill="#2D2D2D" stroke="#3A3A3A" stroke-width="0.3"/>
  <text x="197" y="58" font-size="3.5" fill="#999" font-family="sans-serif">Cappuccino</text>
  <rect x="232" y="52" width="5" height="7" rx="1" fill="none" stroke="#AA8855" stroke-width="0.5"/>

  <rect x="128" y="74" width="58" height="21" rx="2" fill="#2D2D2D" stroke="#3A3A3A" stroke-width="0.3"/>
  <text x="133" y="83" font-size="3.5" fill="#999" font-family="sans-serif">Kaffee</text>

  <rect x="192" y="74" width="58" height="21" rx="2" fill="#2D2D2D" stroke="#3A3A3A" stroke-width="0.3"/>
  <text x="197" y="83" font-size="3.5" fill="#999" font-family="sans-serif">Milchschaum</text>

  <!-- Nav arrows -->
  <path d="M125 68 L120 72 L125 76" stroke="#555" stroke-width="1" fill="none"/>
  <path d="M255 68 L260 72 L255 76" stroke="#555" stroke-width="1" fill="none"/>

  <!-- ======== ROTARY DIAL — in right wing ======== -->
  <circle cx="314" cy="82" r="18" fill="#333" stroke="#555" stroke-width="1"/>
  <circle cx="314" cy="82" r="14" fill="#2A2A2A"/>
  <circle cx="314" cy="82" r="9" fill="#333"/>
  <circle cx="314" cy="82" r="16" fill="none" stroke="#3A3A3A" stroke-width="0.8" stroke-dasharray="2,2"/>
  <path d="M302 66 Q314 58 326 66" fill="none" stroke="#666" stroke-width="0.8"/>
  <line x1="314" y1="60" x2="314" y2="64" stroke="#666" stroke-width="0.8"/>

  <!-- ======== JURA LOGO PANEL ======== -->
  <rect x="158" y="118" width="64" height="58" rx="4" fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="190" cy="138" r="13" fill="#222" stroke="#444" stroke-width="0.5"/>
  <text x="190" y="142" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#CCC" font-style="italic" font-weight="700">jura</text>
  <text x="190" y="166" text-anchor="middle" font-size="9" font-family="sans-serif" fill="#777" font-weight="500" letter-spacing="2">E 6</text>

  <!-- ======== BLACK GLOSSY AREA — narrower, more inset ======== -->
  <rect x="72" y="180" width="236" height="172" rx="5" fill="url(#gloss-black)"/>
  <path d="M72 180 L308 180 L308 200 Q190 210 72 200 Z" fill="rgba(255,255,255,0.03)"/>
  <path d="M78 280 L95 180 L102 180 L85 280 Z" fill="rgba(255,255,255,0.012)"/>

  <!-- ======== SPOUT — short compact ======== -->
  <rect x="176" y="182" width="28" height="10" rx="3" fill="#B0B0B0" stroke="#CCC" stroke-width="0.3"/>
  <rect x="204" y="185" width="5" height="5" rx="1" fill="#444"/>
  <rect x="182" y="192" width="16" height="26" rx="2" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>
  <rect x="184" y="218" width="4" height="24" rx="1.5" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>
  <rect x="192" y="218" width="4" height="24" rx="1.5" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>
  <rect x="183" y="232" width="14" height="3" rx="1" fill="#AAA"/>
  <ellipse cx="186" cy="243" rx="2.5" ry="3" fill="#999"/>
  <ellipse cx="194" cy="243" rx="2.5" ry="3" fill="#999"/>

  <!-- ======== DRIP TRAY ======== -->
  <path d="
    M30 380
    L30 400
    Q30 418 55 420
    L325 420
    Q350 418 350 400
    L350 380
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <rect x="50" y="385" width="280" height="22" rx="3" fill="#222"/>
  <line x1="75" y1="390" x2="75" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="105" y1="390" x2="105" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="135" y1="390" x2="135" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="165" y1="390" x2="165" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="195" y1="390" x2="195" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="225" y1="390" x2="225" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="255" y1="390" x2="255" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="285" y1="390" x2="285" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <line x1="315" y1="390" x2="315" y2="403" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M42 418 Q42 432 68 434 L312 434 Q338 432 338 418 Z" fill="#222"/>
</svg>`,
  "De'Longhi Eletta Explore": `<svg width="380" height="460" viewBox="0 0 380 460">
  <defs>
    <linearGradient id="titanium" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999999"/>
      <stop offset="15%" stop-color="#B8B8B8"/>
      <stop offset="35%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#BFBFBF"/>
      <stop offset="70%" stop-color="#C4C4C4"/>
      <stop offset="85%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#959595"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2E2E2E"/>
      <stop offset="20%" stop-color="#1E1E1E"/>
      <stop offset="50%" stop-color="#161616"/>
      <stop offset="80%" stop-color="#1A1A1A"/>
      <stop offset="100%" stop-color="#202020"/>
    </linearGradient>
    <linearGradient id="white-panel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="20%" stop-color="#EEEEEE"/>
      <stop offset="50%" stop-color="#F5F5F5"/>
      <stop offset="80%" stop-color="#EAEAEA"/>
      <stop offset="100%" stop-color="#D5D5D5"/>
    </linearGradient>
    <linearGradient id="carafe-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(200,210,220,0.2)"/>
      <stop offset="30%" stop-color="rgba(220,230,240,0.3)"/>
      <stop offset="70%" stop-color="rgba(210,220,230,0.25)"/>
      <stop offset="100%" stop-color="rgba(195,205,215,0.15)"/>
    </linearGradient>
    <linearGradient id="spout-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#A8A8A8"/>
      <stop offset="100%" stop-color="#909090"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="190" cy="448" rx="130" ry="9" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="62" y="418" width="256" height="20" rx="4" fill="#222"/>
  <rect x="62" y="418" width="256" height="4" rx="2" fill="#2E2E2E"/>

  <!-- ======== DRIP TRAY (black with vertical slot grating) ======== -->
  <rect x="64" y="358" width="252" height="62" rx="4" fill="#1C1C1C" stroke="#333" stroke-width="0.5"/>
  <!-- Drip tray raised grate area -->
  <rect x="80" y="366" width="220" height="42" rx="3" fill="#242424"/>
  <!-- Vertical slot grating -->
  <rect x="90" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="100" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="110" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="120" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="130" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="140" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="150" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="160" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="170" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="180" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="190" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="200" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="210" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="220" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="230" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="240" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="250" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="260" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="270" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="280" y="370" width="2.5" height="34" rx="1" fill="#333"/>
  <rect x="290" y="370" width="2.5" height="34" rx="1" fill="#333"/>

  <!-- ======== SILVER/TITANIUM MAIN BODY ======== -->
  <path d="
    M70 98
    Q70 94 74 94
    L306 94
    Q310 94 310 98
    L310 360
    L70 360
    Z
  " fill="url(#titanium)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <path d="M70 98 L70 360 L77 360 L77 98 Z" fill="rgba(0,0,0,0.05)"/>
  <!-- Right edge highlight -->
  <path d="M303 98 L303 360 L310 360 L310 98 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== BLACK TOP PANEL (display area) ======== -->
  <path d="
    M70 42
    Q70 36 76 36
    L304 36
    Q310 36 310 42
    L310 98
    L70 98
    Z
  " fill="url(#gloss-black)"/>
  <!-- Subtle gloss reflection on black panel -->
  <path d="M76 36 L304 36 Q310 36 310 42 L310 52 Q190 58 70 52 L70 42 Q70 36 76 36 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- ======== BEAN HOPPER (on top, black with smoked transparent lid) ======== -->
  <!-- Hopper base (black) -->
  <rect x="112" y="20" width="156" height="20" rx="4" fill="#222" stroke="#333" stroke-width="0.5"/>
  <!-- Smoked transparent lid -->
  <rect x="120" y="8" width="140" height="16" rx="5" fill="rgba(55,50,45,0.75)" stroke="rgba(90,85,80,0.5)" stroke-width="0.5"/>
  <!-- Beans visible through lid -->
  <ellipse cx="155" cy="15" rx="8" ry="4" fill="rgba(80,50,30,0.3)"/>
  <ellipse cx="175" cy="14" rx="10" ry="5" fill="rgba(70,45,25,0.25)"/>
  <ellipse cx="200" cy="15" rx="7" ry="4" fill="rgba(75,48,28,0.28)"/>
  <ellipse cx="225" cy="15" rx="8" ry="3.5" fill="rgba(72,46,26,0.22)"/>
  <!-- Lid highlight -->
  <rect x="135" y="10" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== CUP WARMER TRAY (top surface visible on sides of hopper) ======== -->
  <rect x="70" y="32" width="42" height="8" rx="2" fill="#A0A0A0"/>
  <rect x="268" y="32" width="42" height="8" rx="2" fill="#A0A0A0"/>

  <!-- ======== 3.5" TOUCHSCREEN DISPLAY ======== -->
  <!-- Display bezel -->
  <rect x="96" y="44" width="188" height="48" rx="4" fill="#0E0E0E" stroke="#333" stroke-width="0.5"/>
  <!-- Screen area -->
  <rect x="102" y="48" width="176" height="40" rx="3" fill="#1A1D24"/>
  <!-- Horizontal drink icon row (the defining feature of this machine) -->
  <!-- Icon 1: Espresso -->
  <rect x="108" y="52" width="36" height="32" rx="2" fill="#252830" stroke="#363940" stroke-width="0.3"/>
  <rect x="118" y="58" width="14" height="11" rx="2" fill="none" stroke="#CC9955" stroke-width="0.7"/>
  <rect x="115" y="68.5" width="20" height="1.5" rx="0.75" fill="#AA8844"/>
  <text x="126" y="80" text-anchor="middle" font-size="3.5" fill="#999" font-family="sans-serif">Espresso</text>
  <!-- Icon 2: Cappuccino -->
  <rect x="148" y="52" width="36" height="32" rx="2" fill="#252830" stroke="#363940" stroke-width="0.3"/>
  <rect x="158" y="56" width="14" height="14" rx="2.5" fill="none" stroke="#CC9955" stroke-width="0.7"/>
  <path d="M158 62 L172 62" stroke="#EECCAA" stroke-width="0.5"/>
  <path d="M159 66 L171 66" stroke="#DDBB88" stroke-width="0.4"/>
  <text x="166" y="80" text-anchor="middle" font-size="3.5" fill="#999" font-family="sans-serif">Cappuccino</text>
  <!-- Icon 3: Latte -->
  <rect x="188" y="52" width="36" height="32" rx="2" fill="#252830" stroke="#363940" stroke-width="0.3"/>
  <rect x="198" y="55" width="14" height="16" rx="2.5" fill="none" stroke="#CC9955" stroke-width="0.7"/>
  <path d="M198 60 L212 60" stroke="#EECCAA" stroke-width="0.5"/>
  <path d="M199 64 L211 64" stroke="#DDBB88" stroke-width="0.4"/>
  <path d="M199 67 L211 67" stroke="#CCAA77" stroke-width="0.3"/>
  <text x="206" y="80" text-anchor="middle" font-size="3.5" fill="#999" font-family="sans-serif">Latte</text>
  <!-- Icon 4: Cold Brew (blue-tinted) -->
  <rect x="228" y="52" width="36" height="32" rx="2" fill="#252830" stroke="#363940" stroke-width="0.3"/>
  <rect x="238" y="55" width="14" height="16" rx="2.5" fill="none" stroke="#5588BB" stroke-width="0.7"/>
  <circle cx="242" cy="66" r="1.2" fill="#5588BB"/>
  <circle cx="245" cy="63" r="1" fill="#5588BB"/>
  <circle cx="248" cy="67" r="1.1" fill="#5588BB"/>
  <text x="246" y="80" text-anchor="middle" font-size="3.5" fill="#999" font-family="sans-serif">Cold Brew</text>
  <!-- Nav dots below display -->
  <circle cx="166" cy="91" r="1.5" fill="#555"/>
  <circle cx="176" cy="91" r="1.5" fill="#888"/>
  <circle cx="186" cy="91" r="1.5" fill="#555"/>
  <circle cx="196" cy="91" r="1.5" fill="#555"/>
  <!-- Touch buttons flanking display -->
  <circle cx="84" cy="68" r="5" fill="#1A1A1A" stroke="#333" stroke-width="0.5"/>
  <circle cx="296" cy="68" r="5" fill="#1A1A1A" stroke="#333" stroke-width="0.5"/>
  <!-- Settings gear icon in right button -->
  <circle cx="296" cy="68" r="2.5" fill="none" stroke="#555" stroke-width="0.4"/>
  <circle cx="296" cy="68" r="0.8" fill="#555"/>

  <!-- ======== WHITE BRANDED DISPENSING PANEL (center-right, the most distinctive element) ======== -->
  <rect x="148" y="115" width="120" height="150" rx="8" fill="url(#white-panel)" stroke="#CCC" stroke-width="0.5"/>
  <!-- Panel top curve/chamfer detail -->
  <path d="M148 123 Q148 115 156 115 L260 115 Q268 115 268 123 L268 127 Q208 125 148 127 Z" fill="rgba(255,255,255,0.05)"/>
  <!-- De'Longhi logo area -->
  <rect x="174" y="124" width="68" height="15" rx="3" fill="#EAEAEA" stroke="#DDD" stroke-width="0.3"/>
  <text x="208" y="135" text-anchor="middle" font-size="7" font-family="sans-serif" fill="#555" font-weight="700" letter-spacing="0.3">De'Longhi</text>
  <!-- ELETTA EXPLORE text -->
  <text x="208" y="152" text-anchor="middle" font-size="6" font-family="sans-serif" fill="#777" font-weight="600" letter-spacing="2">ELETTA</text>
  <text x="208" y="161" text-anchor="middle" font-size="5" font-family="sans-serif" fill="#888" font-weight="400" letter-spacing="2">EXPLORE</text>

  <!-- ======== DISPENSING SPOUT (sleek, adjustable height) ======== -->
  <!-- Spout mount bracket -->
  <rect x="194" y="168" width="28" height="8" rx="3" fill="#C8C8C8" stroke="#BBB" stroke-width="0.3"/>
  <!-- Height adjustment track -->
  <rect x="200" y="176" width="16" height="42" rx="2" fill="url(#spout-grad)" stroke="#BBB" stroke-width="0.2"/>
  <!-- Spout crossbar -->
  <rect x="196" y="218" width="24" height="5" rx="2" fill="#B8B8B8"/>
  <!-- Dual dispensing nozzles -->
  <rect x="200" y="223" width="5" height="18" rx="2" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>
  <rect x="211" y="223" width="5" height="18" rx="2" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>
  <!-- Nozzle tips -->
  <ellipse cx="202.5" cy="242" rx="3" ry="2" fill="#999"/>
  <ellipse cx="213.5" cy="242" rx="3" ry="2" fill="#999"/>
  <!-- Drip openings -->
  <circle cx="202.5" cy="242" r="1.2" fill="#777"/>
  <circle cx="213.5" cy="242" r="1.2" fill="#777"/>

  <!-- ======== MILK CARAFE (left side, translucent white, prominent) ======== -->
  <!-- Carafe body - slim, attached to left front of machine -->
  <path d="
    M74 195
    L76 162
    Q76 155 84 153
    L130 153
    Q136 155 136 162
    L136 195
    L136 310
    Q136 320 106 322
    Q74 320 74 310
    Z
  " fill="url(#carafe-grad)" stroke="rgba(180,190,200,0.35)" stroke-width="0.8"/>
  <!-- Carafe lid (solid white plastic) -->
  <rect x="76" y="147" width="58" height="10" rx="3" fill="#E8E8E8" stroke="#CCC" stroke-width="0.5"/>
  <!-- Lid handle/spout -->
  <rect x="95" y="141" width="16" height="9" rx="3" fill="#DDD" stroke="#BBB" stroke-width="0.4"/>
  <!-- Measurement markings on carafe -->
  <line x1="80" y1="185" x2="93" y2="185" stroke="rgba(150,160,170,0.25)" stroke-width="0.5"/>
  <text x="95" y="187" font-size="2.5" fill="rgba(150,160,170,0.2)" font-family="sans-serif">MAX</text>
  <line x1="80" y1="210" x2="91" y2="210" stroke="rgba(150,160,170,0.2)" stroke-width="0.4"/>
  <line x1="80" y1="235" x2="91" y2="235" stroke="rgba(150,160,170,0.2)" stroke-width="0.4"/>
  <line x1="80" y1="260" x2="91" y2="260" stroke="rgba(150,160,170,0.2)" stroke-width="0.4"/>
  <line x1="80" y1="285" x2="91" y2="285" stroke="rgba(150,160,170,0.2)" stroke-width="0.4"/>
  <!-- Milk level (partially filled) -->
  <path d="M76 240 L136 240 L136 310 Q136 320 106 322 Q74 320 74 310 Z" fill="rgba(245,245,250,0.06)"/>
  <!-- LatteCrema branding -->
  <text x="106" y="175" text-anchor="middle" font-size="3.5" fill="rgba(120,130,140,0.3)" font-family="sans-serif" letter-spacing="0.5">LatteCrema</text>
  <!-- Carafe highlight (left edge) -->
  <path d="M78 165 L78 305 Q78 312 82 316" stroke="rgba(255,255,255,0.06)" stroke-width="1" fill="none"/>
  <!-- Milk tube connecting carafe to spout (subtle) -->
  <path d="M136 168 Q148 164 158 160 Q168 157 178 157 L194 168" stroke="rgba(200,200,200,0.2)" stroke-width="1" fill="none"/>

  <!-- ======== BODY PANEL DETAILS ======== -->
  <!-- Vertical panel line (right side of body) -->
  <line x1="282" y1="98" x2="282" y2="358" stroke="rgba(0,0,0,0.04)" stroke-width="1"/>
  <!-- Subtle horizontal seam between black top and silver body -->
  <line x1="70" y1="98" x2="310" y2="98" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>

  <!-- ======== CUP DISPENSING CAVITY (dark area below spout where cup sits) ======== -->
  <!-- Recessed cavity -->
  <rect x="148" y="272" width="118" height="82" rx="4" fill="rgba(0,0,0,0.06)"/>
  <!-- Inner darker shadow at top of cavity -->
  <rect x="152" y="274" width="110" height="10" rx="2" fill="rgba(0,0,0,0.04)"/>
  <!-- Cup platform hint -->
  <rect x="170" y="330" width="76" height="6" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.02)" stroke-width="0.3"/>

  <!-- ======== RIGHT SIDE PANEL DETAILS ======== -->
  <!-- Subtle dark panel on right (the door/service panel visible in reference) -->
  <rect x="272" y="115" width="32" height="120" rx="2" fill="rgba(0,0,0,0.03)"/>
  <line x1="272" y1="115" x2="272" y2="235" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/>
</svg>`,
  "Nespresso VertuoPlus": `<svg width="340" height="420" viewBox="0 0 340 420">
  <defs>
    <!-- Chrome/steel gradient for metallic parts -->
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <!-- Dark charcoal body gradient -->
    <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3A3A3A"/>
      <stop offset="20%" stop-color="#4A4A4A"/>
      <stop offset="50%" stop-color="#505050"/>
      <stop offset="80%" stop-color="#484848"/>
      <stop offset="100%" stop-color="#383838"/>
    </linearGradient>
    <!-- Dome head gradient (top-to-bottom for rounded look) -->
    <linearGradient id="dome-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#606060"/>
      <stop offset="15%" stop-color="#585858"/>
      <stop offset="40%" stop-color="#505050"/>
      <stop offset="70%" stop-color="#484848"/>
      <stop offset="100%" stop-color="#404040"/>
    </linearGradient>
    <!-- Dome left-right gradient for 3D roundedness -->
    <linearGradient id="dome-lr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
      <stop offset="12%" stop-color="rgba(0,0,0,0.06)"/>
      <stop offset="35%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="70%" stop-color="rgba(255,255,255,0.02)"/>
      <stop offset="88%" stop-color="rgba(0,0,0,0.06)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
    </linearGradient>
    <!-- Chrome lever gradient -->
    <linearGradient id="lever-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B0B0B0"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="75%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#B0B0B0"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="170" cy="405" rx="110" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="90" y="378" width="160" height="22" rx="4" fill="#222"/>
  <rect x="90" y="378" width="160" height="5" rx="2" fill="#2E2E2E"/>

  <!-- ======== DRIP TRAY ======== -->
  <rect x="92" y="320" width="156" height="60" rx="4" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Tray grid plate -->
  <rect x="100" y="326" width="140" height="34" rx="3" fill="#AAAAAA"/>
  <!-- Grid slots -->
  <rect x="112" y="331" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="139" y="331" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="166" y="331" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="193" y="331" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="125" y="340" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="152" y="340" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="179" y="340" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="112" y="349" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="139" y="349" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="166" y="349" width="22" height="5" rx="2.5" fill="#949494"/>
  <rect x="193" y="349" width="22" height="5" rx="2.5" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="92" y="360" width="156" height="18" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== LOWER BODY (narrower rectangular section) ======== -->
  <path d="M96 180 L92 320 L248 320 L244 180 Z" fill="url(#body-grad)" stroke="#555" stroke-width="0.3"/>
  <!-- Left shadow -->
  <path d="M96 180 L92 320 L98 320 L102 180 Z" fill="rgba(0,0,0,0.08)"/>
  <!-- Right highlight -->
  <path d="M238 180 L242 320 L248 320 L244 180 Z" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== NESPRESSO LOGO on body ======== -->
  <text x="170" y="238" text-anchor="middle" font-size="10" font-family="Arial, sans-serif" fill="#777" font-weight="400" letter-spacing="3">NESPRESSO</text>
  <!-- Subtle panel line on body -->
  <line x1="100" y1="260" x2="240" y2="260" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>

  <!-- ======== CAPSULE CONTAINER (subtle dark area on body) ======== -->
  <rect x="98" y="280" width="144" height="36" rx="3" fill="rgba(0,0,0,0.12)"/>

  <!-- ======== DISPENSING AREA (dark recess under dome overhang) ======== -->
  <rect x="92" y="172" width="156" height="16" fill="#2A2A2A" rx="2"/>
  <!-- Chrome spout housing (centered) -->
  <rect x="157" y="174" width="26" height="10" rx="3" fill="url(#steel-dark)" stroke="#888" stroke-width="0.3"/>
  <!-- Spout nozzle body -->
  <rect x="162" y="184" width="16" height="16" rx="2" fill="#555" stroke="#666" stroke-width="0.3"/>
  <!-- Dual nozzle tips -->
  <rect x="164" y="200" width="4" height="10" rx="1.5" fill="#666"/>
  <rect x="172" y="200" width="4" height="10" rx="1.5" fill="#666"/>
  <!-- Nozzle tip openings -->
  <ellipse cx="166" cy="211" rx="2" ry="2.5" fill="#555"/>
  <ellipse cx="174" cy="211" rx="2" ry="2.5" fill="#555"/>

  <!-- ======== DOME HEAD (smooth rounded top — only slightly wider than body) ======== -->
  <!-- Main dome shape — smooth rounded rectangle profile, gentle curve, NOT mushroom-shaped -->
  <path d="
    M82 170
    L78 140
    Q76 105 80 75
    Q86 40 170 34
    Q254 40 260 75
    Q264 105 262 140
    L258 170
    Z
  " fill="url(#dome-grad)" stroke="#555" stroke-width="0.5"/>
  <!-- Dome roundedness overlay (left-right shading for 3D effect) -->
  <path d="
    M82 170
    L78 140
    Q76 105 80 75
    Q86 40 170 34
    Q254 40 260 75
    Q264 105 262 140
    L258 170
    Z
  " fill="url(#dome-lr)"/>
  <!-- Subtle top highlight arc -->
  <path d="M120 56 Q170 42 220 56" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <!-- Secondary highlight band across dome -->
  <path d="M85 95 Q170 84 255 95" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>
  <!-- Bottom edge of dome — chrome accent strip at seam -->
  <path d="M82 170 Q170 170 258 170" stroke="#666" stroke-width="1.5" fill="none"/>
  <path d="M84 169 Q170 169 256 169" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" fill="none"/>

  <!-- ======== BUTTON ON TOP (single Nespresso Vertuo button — chrome, more prominent) ======== -->
  <ellipse cx="170" cy="40" rx="16" ry="6" fill="#555" stroke="#777" stroke-width="1"/>
  <ellipse cx="170" cy="40" rx="12" ry="4.5" fill="#666"/>
  <ellipse cx="170" cy="40" rx="8" ry="3" fill="#707070"/>
  <!-- Button highlight -->
  <ellipse cx="168" cy="39" rx="5" ry="1.5" fill="rgba(255,255,255,0.12)"/>

  <!-- ======== CHROME LEVER/LATCH (slim elegant handle on front of dome) ======== -->
  <!-- Lever backing/mount -->
  <rect x="162" y="68" width="16" height="84" rx="8" fill="url(#lever-grad)" stroke="#CCC" stroke-width="0.5"/>
  <!-- Inner chrome surface with highlight -->
  <rect x="164" y="72" width="12" height="76" rx="6" fill="url(#steel)" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/>
  <!-- Central highlight line -->
  <line x1="170" y1="76" x2="170" y2="144" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
  <!-- Lever top arch detail -->
  <path d="M164 76 Q170 70 176 76" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
  <!-- Subtle grip ridges -->
  <line x1="165" y1="100" x2="175" y2="100" stroke="rgba(0,0,0,0.06)" stroke-width="0.4"/>
  <line x1="165" y1="110" x2="175" y2="110" stroke="rgba(0,0,0,0.06)" stroke-width="0.4"/>
  <line x1="165" y1="120" x2="175" y2="120" stroke="rgba(0,0,0,0.06)" stroke-width="0.4"/>
  <line x1="165" y1="130" x2="175" y2="130" stroke="rgba(0,0,0,0.06)" stroke-width="0.4"/>

  <!-- ======== SEAM LINE where dome meets body ======== -->
  <!-- Dome overhang shadow cast on body -->
  <rect x="92" y="172" width="156" height="6" fill="rgba(0,0,0,0.15)" rx="1"/>

  <!-- ======== VERTUO BRANDING on dome (subtle) ======== -->
  <text x="170" y="162" text-anchor="middle" font-size="5.5" font-family="Arial, sans-serif" fill="#5A5A5A" letter-spacing="2">VERTUO</text>

  <!-- ======== WATER TANK HINT (behind body, right side) ======== -->
  <rect x="250" y="85" width="16" height="230" rx="5" fill="rgba(80,120,160,0.05)" stroke="rgba(100,130,170,0.06)" stroke-width="0.5"/>
</svg>`,
  "Nespresso Vertuo Next": `<svg width="340" height="420" viewBox="0 0 340 420">
  <defs>
    <!-- Chrome/steel gradient for metallic parts -->
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7A7A7A"/>
      <stop offset="50%" stop-color="#8A8A8A"/>
      <stop offset="100%" stop-color="#707070"/>
    </linearGradient>
    <!-- Dark charcoal body gradient (smooth lower section) -->
    <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#282828"/>
      <stop offset="15%" stop-color="#333"/>
      <stop offset="50%" stop-color="#383838"/>
      <stop offset="85%" stop-color="#323232"/>
      <stop offset="100%" stop-color="#262626"/>
    </linearGradient>
    <!-- Head gradient (ribbed section, slightly lighter gray) -->
    <linearGradient id="head-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3C3C3C"/>
      <stop offset="12%" stop-color="#4A4A4A"/>
      <stop offset="40%" stop-color="#525252"/>
      <stop offset="60%" stop-color="#505050"/>
      <stop offset="88%" stop-color="#484848"/>
      <stop offset="100%" stop-color="#3A3A3A"/>
    </linearGradient>
    <!-- Head vertical shading for roundedness/cylinder feel -->
    <linearGradient id="head-lr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
      <stop offset="8%" stop-color="rgba(0,0,0,0.08)"/>
      <stop offset="25%" stop-color="rgba(255,255,255,0.03)"/>
      <stop offset="45%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="55%" stop-color="rgba(255,255,255,0.03)"/>
      <stop offset="75%" stop-color="rgba(255,255,255,0.01)"/>
      <stop offset="92%" stop-color="rgba(0,0,0,0.08)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
    </linearGradient>
    <!-- Lever chrome gradient -->
    <linearGradient id="lever-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B0B0B0"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="75%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#B0B0B0"/>
    </linearGradient>
    <!-- Clip path for ribbing to stay within head shape -->
    <clipPath id="head-clip">
      <path d="
        M108 172
        L108 68
        Q108 34 140 28
        Q155 24 170 24
        Q185 24 200 28
        Q232 34 232 68
        L232 172
        Z
      "/>
    </clipPath>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="170" cy="398" rx="88" ry="8" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE PLATFORM ======== -->
  <path d="M100 373 L100 392 Q100 398 108 398 L232 398 Q240 398 240 392 L240 373 Z" fill="#1A1A1A"/>
  <rect x="100" y="373" width="140" height="4" rx="1" fill="#222"/>

  <!-- ======== DRIP TRAY (chrome, sits on base) ======== -->
  <rect x="108" y="326" width="124" height="49" rx="3" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Tray grid plate -->
  <rect x="114" y="331" width="112" height="28" rx="2" fill="#AAAAAA"/>
  <!-- Grid slots -->
  <rect x="122" y="335" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="143" y="335" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="164" y="335" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="185" y="335" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="132" y="343" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="153" y="343" width="17" height="4" rx="2" fill="#949494"/>
  <rect x="174" y="343" width="17" height="4" rx="2" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="108" y="359" width="124" height="14" rx="2" fill="url(#steel-dark)"/>

  <!-- ======== SMOOTH LOWER BODY (darker, below the ribbed head) ======== -->
  <!-- Slightly narrower than the head to show the transition -->
  <rect x="114" y="172" width="112" height="154" rx="2" fill="url(#body-grad)" stroke="#444" stroke-width="0.3"/>
  <!-- Left edge shadow -->
  <rect x="114" y="172" width="5" height="154" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge subtle highlight -->
  <rect x="221" y="172" width="5" height="154" fill="rgba(255,255,255,0.02)"/>

  <!-- ======== DISPENSING AREA (open front recess carved into body) ======== -->
  <rect x="122" y="198" width="96" height="126" rx="3" fill="#141414"/>
  <!-- Inner top shadow -->
  <rect x="122" y="198" width="96" height="5" fill="rgba(0,0,0,0.25)" rx="2"/>
  <!-- Inner side reflections -->
  <rect x="122" y="200" width="2.5" height="120" fill="rgba(255,255,255,0.015)"/>
  <rect x="215.5" y="200" width="2.5" height="120" fill="rgba(255,255,255,0.01)"/>

  <!-- ======== SPOUT (connected to top of dispensing area, wider/flatter design) ======== -->
  <!-- Connector strip from body top to spout (ensures no floating) -->
  <rect x="152" y="190" width="36" height="10" rx="2" fill="#383838"/>
  <!-- Spout housing (wider, flatter) -->
  <rect x="150" y="196" width="40" height="9" rx="4" fill="url(#steel-dark)" stroke="#888" stroke-width="0.3"/>
  <!-- Spout highlight -->
  <line x1="155" y1="200" x2="185" y2="200" stroke="rgba(255,255,255,0.06)" stroke-width="0.4"/>
  <!-- Spout body (wider single piece) -->
  <rect x="157" y="205" width="26" height="12" rx="3" fill="#4A4A4A" stroke="#555" stroke-width="0.3"/>
  <!-- Spout bottom plate -->
  <rect x="159" y="215" width="22" height="3" rx="1" fill="#505050"/>
  <!-- Dual nozzle tips -->
  <rect x="162" y="218" width="5" height="9" rx="2" fill="#555"/>
  <rect x="173" y="218" width="5" height="9" rx="2" fill="#555"/>
  <!-- Nozzle openings -->
  <ellipse cx="164.5" cy="228" rx="2" ry="2.5" fill="#444"/>
  <ellipse cx="175.5" cy="228" rx="2" ry="2.5" fill="#444"/>

  <!-- ======== HEAD SECTION (wider cylindrical shape with ribbed grooves) ======== -->
  <!-- The head flares slightly wider than the body, giving it a barrel shape -->
  <path d="
    M108 172
    L108 68
    Q108 34 140 28
    Q155 24 170 24
    Q185 24 200 28
    Q232 34 232 68
    L232 172
    Z
  " fill="url(#head-grad)" stroke="#555" stroke-width="0.4"/>
  <!-- Left-right shading overlay for cylinder roundedness -->
  <path d="
    M108 172
    L108 68
    Q108 34 140 28
    Q155 24 170 24
    Q185 24 200 28
    Q232 34 232 68
    L232 172
    Z
  " fill="url(#head-lr)"/>

  <!-- ======== HORIZONTAL RIBBED GROOVES (clipped to head shape, denser spacing) ======== -->
  <g clip-path="url(#head-clip)">
    <!-- Dense horizontal groove lines (3px spacing for finer ribbing) -->
    <line x1="106" y1="55" x2="234" y2="55" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="58" x2="234" y2="58" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="61" x2="234" y2="61" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="64" x2="234" y2="64" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="67" x2="234" y2="67" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="70" x2="234" y2="70" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="73" x2="234" y2="73" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="76" x2="234" y2="76" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="79" x2="234" y2="79" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="82" x2="234" y2="82" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="85" x2="234" y2="85" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="88" x2="234" y2="88" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="91" x2="234" y2="91" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="94" x2="234" y2="94" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="97" x2="234" y2="97" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="100" x2="234" y2="100" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="103" x2="234" y2="103" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="106" x2="234" y2="106" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="109" x2="234" y2="109" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="112" x2="234" y2="112" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="115" x2="234" y2="115" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="118" x2="234" y2="118" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="121" x2="234" y2="121" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="124" x2="234" y2="124" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="127" x2="234" y2="127" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="130" x2="234" y2="130" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="133" x2="234" y2="133" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="136" x2="234" y2="136" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="139" x2="234" y2="139" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="142" x2="234" y2="142" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="145" x2="234" y2="145" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="148" x2="234" y2="148" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="151" x2="234" y2="151" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="154" x2="234" y2="154" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="157" x2="234" y2="157" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="160" x2="234" y2="160" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="163" x2="234" y2="163" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="166" x2="234" y2="166" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <line x1="106" y1="169" x2="234" y2="169" stroke="rgba(0,0,0,0.14)" stroke-width="0.5"/>
    <!-- Highlight lines (offset 1px below for depth) -->
    <line x1="106" y1="56" x2="234" y2="56" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="59" x2="234" y2="59" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="62" x2="234" y2="62" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="65" x2="234" y2="65" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="68" x2="234" y2="68" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="71" x2="234" y2="71" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="74" x2="234" y2="74" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="77" x2="234" y2="77" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="80" x2="234" y2="80" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="83" x2="234" y2="83" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="86" x2="234" y2="86" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="89" x2="234" y2="89" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="92" x2="234" y2="92" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="95" x2="234" y2="95" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="98" x2="234" y2="98" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="101" x2="234" y2="101" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="104" x2="234" y2="104" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="107" x2="234" y2="107" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="110" x2="234" y2="110" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="113" x2="234" y2="113" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="116" x2="234" y2="116" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="119" x2="234" y2="119" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="122" x2="234" y2="122" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="125" x2="234" y2="125" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="128" x2="234" y2="128" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="131" x2="234" y2="131" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="134" x2="234" y2="134" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="137" x2="234" y2="137" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="140" x2="234" y2="140" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="143" x2="234" y2="143" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="146" x2="234" y2="146" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="149" x2="234" y2="149" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="152" x2="234" y2="152" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="155" x2="234" y2="155" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="158" x2="234" y2="158" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="161" x2="234" y2="161" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="164" x2="234" y2="164" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="167" x2="234" y2="167" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
    <line x1="106" y1="170" x2="234" y2="170" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
  </g>

  <!-- Top highlight arc -->
  <path d="M140 36 Q170 26 200 36" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.2"/>
  <!-- Secondary highlight band -->
  <path d="M112 60 Q170 54 228 60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="5"/>

  <!-- ======== NESPRESSO BRANDING on head (more visible) ======== -->
  <text x="170" y="49" text-anchor="middle" font-size="7.5" font-family="Arial, sans-serif" fill="#808080" letter-spacing="2.5" font-weight="500">NESPRESSO</text>

  <!-- ======== SEAM LINE where head meets smooth body ======== -->
  <!-- Chrome accent strip at the transition -->
  <line x1="108" y1="172" x2="232" y2="172" stroke="#555" stroke-width="1.5"/>
  <line x1="108" y1="173" x2="232" y2="173" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <!-- Shadow below seam -->
  <rect x="114" y="174" width="112" height="4" fill="rgba(0,0,0,0.12)" rx="1"/>

  <!-- ======== CHROME LEVER ON TOP ======== -->
  <!-- Lever base (flat chrome bar across top, characteristic of Vertuo Next) -->
  <rect x="140" y="18" width="60" height="13" rx="6" fill="url(#lever-grad)" stroke="#CCC" stroke-width="0.4"/>
  <!-- Lever inner chrome surface -->
  <rect x="144" y="21" width="52" height="7" rx="3.5" fill="url(#steel)"/>
  <!-- Lever highlight line -->
  <line x1="150" y1="24.5" x2="190" y2="24.5" stroke="rgba(255,255,255,0.2)" stroke-width="0.6"/>
  <!-- Lever hinge indicators (small circles on sides) -->
  <circle cx="146" cy="24.5" r="2.5" fill="#AAA" stroke="#CCC" stroke-width="0.3"/>
  <circle cx="194" cy="24.5" r="2.5" fill="#AAA" stroke="#CCC" stroke-width="0.3"/>

  <!-- ======== BUTTON (single round button, more prominent) ======== -->
  <circle cx="170" cy="39" r="6.5" fill="#383838" stroke="#555" stroke-width="0.8"/>
  <circle cx="170" cy="39" r="5" fill="#424242"/>
  <circle cx="170" cy="39" r="3" fill="#4A4A4A"/>
  <!-- Button highlight -->
  <ellipse cx="169" cy="38" rx="2.8" ry="1.2" fill="rgba(255,255,255,0.1)"/>
  <!-- Subtle LED indicator ring -->
  <circle cx="170" cy="39" r="5" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>

  <!-- ======== WATER TANK HINT (right side, behind body, softened) ======== -->
  <rect x="234" y="80" width="8" height="240" rx="3" fill="rgba(80,120,160,0.03)" stroke="rgba(100,130,170,0.03)" stroke-width="0.5"/>
</svg>`,
  "Nespresso Vertuo Creatista": `<svg width="380" height="430" viewBox="0 0 380 430">
  <defs>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A8A8A8"/>
      <stop offset="12%" stop-color="#C8C8C8"/>
      <stop offset="25%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#C0C0C0"/>
      <stop offset="55%" stop-color="#D4D4D4"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="85%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="steel-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#808080"/>
      <stop offset="50%" stop-color="#909090"/>
      <stop offset="100%" stop-color="#787878"/>
    </linearGradient>
    <linearGradient id="dome-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9A9A9A"/>
      <stop offset="15%" stop-color="#B8B8B8"/>
      <stop offset="35%" stop-color="#CCCCCC"/>
      <stop offset="50%" stop-color="#D2D2D2"/>
      <stop offset="65%" stop-color="#C8C8C8"/>
      <stop offset="85%" stop-color="#B0B0B0"/>
      <stop offset="100%" stop-color="#9A9A9A"/>
    </linearGradient>
    <linearGradient id="dome-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D8D8D8"/>
      <stop offset="40%" stop-color="#CCCCCC"/>
      <stop offset="100%" stop-color="#B8B8B8"/>
    </linearGradient>
    <radialGradient id="dial-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
    <linearGradient id="panel-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#B0B0B0"/>
      <stop offset="15%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#D4D4D4"/>
      <stop offset="65%" stop-color="#CCCBCB"/>
      <stop offset="85%" stop-color="#BEBEBE"/>
      <stop offset="100%" stop-color="#AAAAAA"/>
    </linearGradient>
    <linearGradient id="cap-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D4D4D4"/>
      <stop offset="50%" stop-color="#C4C4C4"/>
      <stop offset="100%" stop-color="#B4B4B4"/>
    </linearGradient>
    <radialGradient id="btn-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </radialGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="170" cy="415" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BLACK BASE ======== -->
  <rect x="25" y="388" width="290" height="22" rx="4" fill="#222"/>
  <rect x="25" y="388" width="290" height="5" rx="2" fill="#303030"/>

  <!-- ======== DRIP TRAY ======== -->
  <rect x="27" y="330" width="286" height="58" rx="4" fill="url(#steel)" stroke="#999" stroke-width="0.5"/>
  <!-- Grill plate -->
  <rect x="38" y="336" width="264" height="34" rx="3" fill="#AAAAAA"/>
  <!-- Dot grid pattern on drip tray -->
  <circle cx="52" cy="344" r="1.8" fill="#949494"/><circle cx="66" cy="344" r="1.8" fill="#949494"/>
  <circle cx="80" cy="344" r="1.8" fill="#949494"/><circle cx="94" cy="344" r="1.8" fill="#949494"/>
  <circle cx="108" cy="344" r="1.8" fill="#949494"/><circle cx="122" cy="344" r="1.8" fill="#949494"/>
  <circle cx="136" cy="344" r="1.8" fill="#949494"/><circle cx="150" cy="344" r="1.8" fill="#949494"/>
  <circle cx="164" cy="344" r="1.8" fill="#949494"/><circle cx="178" cy="344" r="1.8" fill="#949494"/>
  <circle cx="192" cy="344" r="1.8" fill="#949494"/><circle cx="206" cy="344" r="1.8" fill="#949494"/>
  <circle cx="220" cy="344" r="1.8" fill="#949494"/><circle cx="234" cy="344" r="1.8" fill="#949494"/>
  <circle cx="248" cy="344" r="1.8" fill="#949494"/><circle cx="262" cy="344" r="1.8" fill="#949494"/>
  <circle cx="276" cy="344" r="1.8" fill="#949494"/><circle cx="290" cy="344" r="1.8" fill="#949494"/>
  <!-- Row 2 offset -->
  <circle cx="59" cy="353" r="1.8" fill="#949494"/><circle cx="73" cy="353" r="1.8" fill="#949494"/>
  <circle cx="87" cy="353" r="1.8" fill="#949494"/><circle cx="101" cy="353" r="1.8" fill="#949494"/>
  <circle cx="115" cy="353" r="1.8" fill="#949494"/><circle cx="129" cy="353" r="1.8" fill="#949494"/>
  <circle cx="143" cy="353" r="1.8" fill="#949494"/><circle cx="157" cy="353" r="1.8" fill="#949494"/>
  <circle cx="171" cy="353" r="1.8" fill="#949494"/><circle cx="185" cy="353" r="1.8" fill="#949494"/>
  <circle cx="199" cy="353" r="1.8" fill="#949494"/><circle cx="213" cy="353" r="1.8" fill="#949494"/>
  <circle cx="227" cy="353" r="1.8" fill="#949494"/><circle cx="241" cy="353" r="1.8" fill="#949494"/>
  <circle cx="255" cy="353" r="1.8" fill="#949494"/><circle cx="269" cy="353" r="1.8" fill="#949494"/>
  <circle cx="283" cy="353" r="1.8" fill="#949494"/>
  <!-- Row 3 -->
  <circle cx="52" cy="362" r="1.8" fill="#949494"/><circle cx="66" cy="362" r="1.8" fill="#949494"/>
  <circle cx="80" cy="362" r="1.8" fill="#949494"/><circle cx="94" cy="362" r="1.8" fill="#949494"/>
  <circle cx="108" cy="362" r="1.8" fill="#949494"/><circle cx="122" cy="362" r="1.8" fill="#949494"/>
  <circle cx="136" cy="362" r="1.8" fill="#949494"/><circle cx="150" cy="362" r="1.8" fill="#949494"/>
  <circle cx="164" cy="362" r="1.8" fill="#949494"/><circle cx="178" cy="362" r="1.8" fill="#949494"/>
  <circle cx="192" cy="362" r="1.8" fill="#949494"/><circle cx="206" cy="362" r="1.8" fill="#949494"/>
  <circle cx="220" cy="362" r="1.8" fill="#949494"/><circle cx="234" cy="362" r="1.8" fill="#949494"/>
  <circle cx="248" cy="362" r="1.8" fill="#949494"/><circle cx="262" cy="362" r="1.8" fill="#949494"/>
  <circle cx="276" cy="362" r="1.8" fill="#949494"/><circle cx="290" cy="362" r="1.8" fill="#949494"/>
  <!-- Tray front lip -->
  <rect x="27" y="370" width="286" height="18" rx="3" fill="url(#steel-dark)"/>

  <!-- ======== RIGHT PANEL (taller section, extends higher) ======== -->
  <path d="M155 38 L155 330 L310 330 L310 38 Q310 32 304 32 L161 32 Q155 32 155 38 Z" fill="url(#panel-grad)" stroke="#B0B0B0" stroke-width="0.5"/>
  <!-- Left edge shadow on panel -->
  <path d="M155 38 L155 330 L161 330 L161 38 Z" fill="rgba(0,0,0,0.04)"/>
  <!-- Right edge highlight -->
  <path d="M304 38 L304 330 L310 330 L310 38 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Subtle brushed texture lines on panel -->
  <line x1="165" y1="200" x2="300" y2="200" stroke="rgba(255,255,255,0.02)" stroke-width="0.3"/>
  <line x1="165" y1="230" x2="300" y2="230" stroke="rgba(0,0,0,0.02)" stroke-width="0.3"/>
  <line x1="165" y1="260" x2="300" y2="260" stroke="rgba(255,255,255,0.02)" stroke-width="0.3"/>
  <line x1="165" y1="290" x2="300" y2="290" stroke="rgba(0,0,0,0.02)" stroke-width="0.3"/>

  <!-- ======== LEFT BODY (below dome, column to drip tray) ======== -->
  <rect x="30" y="170" width="145" height="160" rx="2" fill="url(#steel)" stroke="#B0B0B0" stroke-width="0.3"/>
  <!-- Left edge shadow -->
  <path d="M30 170 L30 330 L36 330 L36 170 Z" fill="rgba(0,0,0,0.05)"/>

  <!-- ======== DOME / BREW HEAD (cylindrical barrel shape, left section) ======== -->
  <!-- Main dome barrel — straight sides, rounded top corners (cylinder from front) -->
  <path d="M35 170 L35 68 Q35 55 101 52 Q167 55 167 68 L167 170 Z" fill="url(#dome-body)" stroke="#AAA" stroke-width="0.5"/>

  <!-- Dome cap / lid — wider overhanging lid that sits on top of cylinder -->
  <!-- The cap overhangs the barrel by a few px on each side -->
  <path d="M28 68 Q28 46 101 42 Q174 46 174 68 L174 72 Q174 75 101 75 Q28 75 28 72 Z" fill="url(#cap-grad)" stroke="#BBB" stroke-width="0.4"/>
  <!-- Cap underside shadow (where lid meets barrel) -->
  <path d="M35 75 Q35 78 101 78 Q167 78 167 75" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
  <!-- Cap top surface highlight -->
  <path d="M40 55 Q101 48 162 55 L162 62 Q101 56 40 62 Z" fill="rgba(255,255,255,0.06)"/>

  <!-- Horizontal ribbing on dome (brushed steel texture — characteristic of this machine) -->
  <line x1="36" y1="85" x2="166" y2="85" stroke="rgba(0,0,0,0.05)" stroke-width="0.6"/>
  <line x1="36" y1="95" x2="166" y2="95" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  <line x1="35" y1="105" x2="167" y2="105" stroke="rgba(0,0,0,0.05)" stroke-width="0.6"/>
  <line x1="35" y1="115" x2="167" y2="115" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  <line x1="35" y1="125" x2="167" y2="125" stroke="rgba(0,0,0,0.05)" stroke-width="0.6"/>
  <line x1="35" y1="135" x2="167" y2="135" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  <line x1="35" y1="145" x2="167" y2="145" stroke="rgba(0,0,0,0.05)" stroke-width="0.6"/>
  <line x1="35" y1="155" x2="167" y2="155" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  <line x1="35" y1="165" x2="167" y2="165" stroke="rgba(0,0,0,0.05)" stroke-width="0.6"/>

  <!-- Dome center highlight (convex cylinder reflection — vertical band) -->
  <path d="M78 58 Q101 55 124 58 L122 168 Q101 170 80 168 Z" fill="rgba(255,255,255,0.05)"/>

  <!-- ======== NESPRESSO LOGO on dome ======== -->
  <text x="101" y="112" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" fill="#898989" font-weight="400" letter-spacing="1.2">NESPRESSO</text>

  <!-- ======== LEVER (on top of dome cap) ======== -->
  <!-- Lever base/track — wide bar sitting on dome cap -->
  <rect x="62" y="40" width="78" height="7" rx="3.5" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.4"/>
  <!-- Lever handle (the sliding grip part) — sitting on the track -->
  <rect x="78" y="34" width="44" height="9" rx="4.5" fill="#C0C0C0" stroke="#D0D0D0" stroke-width="0.3"/>
  <!-- Lever grip ridge details -->
  <line x1="86" y1="38" x2="114" y2="38" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
  <line x1="88" y1="40" x2="112" y2="40" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/>

  <!-- ======== DARK RECESS / COFFEE DISPENSING AREA ======== -->
  <!-- Dark cavity below dome where coffee dispenses from — wider opening -->
  <rect x="40" y="170" width="130" height="50" rx="4" fill="#3A3A3A"/>
  <rect x="40" y="170" width="130" height="14" rx="4" fill="#303030"/>
  <!-- Recess bottom shadow -->
  <rect x="42" y="208" width="126" height="10" rx="3" fill="#444"/>

  <!-- Chrome coffee spout housing — centered in recess -->
  <rect x="78" y="182" width="46" height="14" rx="4" fill="#888" stroke="#AAA" stroke-width="0.5"/>
  <!-- Dual spout tubes -->
  <rect x="86" y="196" width="9" height="22" rx="3.5" fill="#666" stroke="#888" stroke-width="0.3"/>
  <rect x="107" y="196" width="9" height="22" rx="3.5" fill="#666" stroke="#888" stroke-width="0.3"/>
  <!-- Spout openings (drip tips) -->
  <ellipse cx="90.5" cy="219" rx="4.5" ry="2.5" fill="#888"/>
  <ellipse cx="111.5" cy="219" rx="4.5" ry="2.5" fill="#888"/>

  <!-- ======== CUP SUPPORT SHELF (folds out from below dispensing area) ======== -->
  <rect x="60" y="240" width="84" height="8" rx="2" fill="url(#steel-dark)" stroke="#999" stroke-width="0.3"/>
  <!-- Shelf front edge highlight -->
  <rect x="60" y="246" width="84" height="3" rx="1" fill="#888"/>

  <!-- ======== CONTROL AREA (right panel) ======== -->
  <!-- Breville branding -->
  <text x="232" y="55" text-anchor="middle" font-size="6" font-family="Arial, sans-serif" fill="#999" letter-spacing="1.5">NESPRESSO</text>

  <!-- Main brew/size dial — prominent circular control -->
  <circle cx="232" cy="95" r="26" fill="url(#dial-grad)" stroke="#B0B0B0" stroke-width="0.8"/>
  <circle cx="232" cy="95" r="21" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <circle cx="232" cy="95" r="10" fill="#C0C0C0" stroke="#D0D0D0" stroke-width="0.3"/>
  <!-- Dial notch indicators around rim -->
  <line x1="232" y1="71" x2="232" y2="76" stroke="#999" stroke-width="1"/>
  <line x1="256" y1="95" x2="251" y2="95" stroke="#888" stroke-width="0.8"/>
  <line x1="208" y1="95" x2="213" y2="95" stroke="#888" stroke-width="0.8"/>
  <line x1="232" y1="119" x2="232" y2="114" stroke="#888" stroke-width="0.8"/>
  <!-- Diagonal marks -->
  <line x1="249" y1="78" x2="245" y2="82" stroke="#888" stroke-width="0.6"/>
  <line x1="215" y1="78" x2="219" y2="82" stroke="#888" stroke-width="0.6"/>
  <line x1="249" y1="112" x2="245" y2="108" stroke="#888" stroke-width="0.6"/>
  <line x1="215" y1="112" x2="219" y2="108" stroke="#888" stroke-width="0.6"/>

  <!-- ======== 3 FUNCTION BUTTONS (below dial) ======== -->
  <!-- Milk texture -->
  <circle cx="200" cy="148" r="9" fill="url(#btn-grad)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="200" cy="148" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Texture icon (wavy lines) -->
  <path d="M196 146 Q198 144 200 146 Q202 148 204 146" fill="none" stroke="#777" stroke-width="0.8"/>
  <path d="M196 150 Q198 148 200 150 Q202 152 204 150" fill="none" stroke="#777" stroke-width="0.8"/>

  <!-- Milk temperature -->
  <circle cx="232" cy="148" r="9" fill="url(#btn-grad)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="232" cy="148" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Thermometer icon -->
  <rect x="230" y="143" width="4" height="8" rx="2" fill="none" stroke="#777" stroke-width="0.8"/>
  <circle cx="232" cy="153" r="1.2" fill="#777"/>

  <!-- Steam -->
  <circle cx="264" cy="148" r="9" fill="url(#btn-grad)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="264" cy="148" r="6.5" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>
  <!-- Steam icon -->
  <path d="M264 142 Q261 147 264 152 Q267 147 264 142 Z" fill="none" stroke="#777" stroke-width="0.8"/>

  <!-- ======== INDICATOR DOTS (temperature and froth level) ======== -->
  <!-- Temperature indicators -->
  <circle cx="200" cy="172" r="2.2" fill="#C07030"/>
  <circle cx="212" cy="172" r="2.2" fill="#D08040"/>
  <circle cx="224" cy="172" r="2.2" fill="#E09050"/>
  <!-- Froth level indicators -->
  <circle cx="242" cy="172" r="2.2" fill="#888"/>
  <circle cx="254" cy="172" r="2.2" fill="#999"/>
  <circle cx="266" cy="172" r="2.2" fill="#AAA"/>

  <!-- ======== STEAM WAND ======== -->
  <!-- Ball joint mount — at junction between dome section and right panel -->
  <circle cx="175" cy="198" r="10" fill="url(#steel-dark)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="175" cy="198" r="5.5" fill="#A8A8A8"/>
  <circle cx="173" cy="196" r="1.8" fill="rgba(255,255,255,0.15)"/>

  <!-- Wand arm — thinner, more elegant, curves down -->
  <path d="M184 202 Q190 222 192 248 L194 292 L195 318" stroke="#B8B8B8" stroke-width="5.5" fill="none" stroke-linecap="round"/>
  <path d="M184 202 Q190 222 192 248 L194 292 L195 318" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Cool-touch rubber sleeve on wand -->
  <rect x="187" y="248" width="12" height="34" rx="5" fill="#2A2A2A"/>
  <rect x="188.5" y="250" width="9" height="30" rx="4" fill="#333"/>
  <!-- Sleeve texture lines -->
  <line x1="190" y1="256" x2="196" y2="256" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
  <line x1="190" y1="262" x2="196" y2="262" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
  <line x1="190" y1="268" x2="196" y2="268" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>
  <line x1="190" y1="274" x2="196" y2="274" stroke="rgba(255,255,255,0.04)" stroke-width="0.3"/>

  <!-- Wand tip (pointed nozzle) -->
  <ellipse cx="195" cy="322" rx="4.5" ry="5" fill="#A8A8A8"/>
  <circle cx="195" cy="324" r="1.5" fill="#888"/>

  <!-- ======== WATER TANK HINT (behind right panel, right edge) ======== -->
  <rect x="300" y="70" width="18" height="252" rx="4" fill="rgba(150,180,210,0.07)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
  <!-- Water level lines -->
  <line x1="303" y1="120" x2="315" y2="120" stroke="rgba(150,180,210,0.05)" stroke-width="0.3"/>
  <line x1="303" y1="170" x2="315" y2="170" stroke="rgba(150,180,210,0.05)" stroke-width="0.3"/>
  <line x1="303" y1="220" x2="315" y2="220" stroke="rgba(150,180,210,0.05)" stroke-width="0.3"/>
  <line x1="303" y1="270" x2="315" y2="270" stroke="rgba(150,180,210,0.05)" stroke-width="0.3"/>

  <!-- ======== MILK JUG (separate, to the right) ======== -->
  <path d="M328 388 L330 306 Q330 298 338 294 L350 294 Q358 298 358 306 L360 388 Q360 396 344 398 Q328 396 328 388 Z" fill="url(#steel)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Jug handle -->
  <path d="M358 302 Q372 312 372 346 Q372 378 360 388" stroke="#B8B8B8" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Jug pour spout -->
  <path d="M332 300 Q328 292 324 288" stroke="#C8C8C8" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Jug highlight -->
  <line x1="336" y1="300" x2="336" y2="386" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <!-- Jug interior shadow -->
  <ellipse cx="344" cy="296" rx="10" ry="3" fill="rgba(0,0,0,0.1)"/>
</svg>`,
  "Nespresso Pixie": `<svg width="280" height="420" viewBox="0 0 280 420">
  <defs>
    <!-- Titanium/dark aluminum body gradient -->
    <linearGradient id="titanium" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#484848"/>
      <stop offset="15%" stop-color="#5A5A5A"/>
      <stop offset="40%" stop-color="#666666"/>
      <stop offset="60%" stop-color="#606060"/>
      <stop offset="85%" stop-color="#555555"/>
      <stop offset="100%" stop-color="#484848"/>
    </linearGradient>
    <!-- Black plastic for brewing head -->
    <linearGradient id="head-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#383838"/>
      <stop offset="30%" stop-color="#2A2A2A"/>
      <stop offset="70%" stop-color="#222222"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
    <linearGradient id="head-lr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(0,0,0,0.15)"/>
      <stop offset="15%" stop-color="rgba(0,0,0,0.04)"/>
      <stop offset="40%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0.02)"/>
      <stop offset="85%" stop-color="rgba(0,0,0,0.04)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.12)"/>
    </linearGradient>
    <!-- Chrome gradient -->
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="25%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#DADADA"/>
      <stop offset="75%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
    <!-- Button backlit amber glow -->
    <radialGradient id="btn-glow" cx="0.45" cy="0.4" r="0.55">
      <stop offset="0%" stop-color="#FFD060" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#FFAA22" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#AA6600" stop-opacity="0.2"/>
    </radialGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="140" cy="405" rx="78" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BASE PLATFORM ======== -->
  <rect x="80" y="384" width="120" height="14" rx="3" fill="#1E1E1E"/>
  <rect x="80" y="384" width="120" height="3" rx="1.5" fill="#2E2E2E"/>

  <!-- ======== DRIP TRAY (fold-out, chrome/black) ======== -->
  <rect x="72" y="338" width="136" height="48" rx="3" fill="#2A2A2A" stroke="#444" stroke-width="0.4"/>
  <!-- Chrome tray front edge -->
  <rect x="72" y="338" width="136" height="4" rx="2" fill="url(#chrome)"/>
  <!-- Grid plate -->
  <rect x="80" y="344" width="120" height="28" rx="2" fill="#222"/>
  <!-- Horizontal slot ridges on tray -->
  <g stroke="#3A3A3A" stroke-width="1">
    <line x1="84" y1="349" x2="196" y2="349"/>
    <line x1="84" y1="354" x2="196" y2="354"/>
    <line x1="84" y1="359" x2="196" y2="359"/>
    <line x1="84" y1="364" x2="196" y2="364"/>
    <line x1="84" y1="369" x2="196" y2="369"/>
  </g>
  <!-- Breville/De'Longhi badge -->
  <text x="140" y="382" text-anchor="middle" font-size="5.5" font-family="Arial, sans-serif" fill="#666" font-weight="500" letter-spacing="1">Breville</text>

  <!-- ======== LOWER BODY (narrower, titanium aluminum) ======== -->
  <rect x="88" y="168" width="104" height="172" rx="3" fill="url(#titanium)" stroke="#555" stroke-width="0.3"/>
  <!-- Left edge shadow -->
  <rect x="88" y="168" width="4" height="172" fill="rgba(0,0,0,0.1)"/>
  <!-- Right edge highlight -->
  <rect x="188" y="168" width="4" height="172" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== CHROME TRIM at body-tray junction ======== -->
  <rect x="88" y="336" width="104" height="4" rx="1" fill="url(#chrome)"/>

  <!-- ======== FRONT FACE HORIZONTAL VENTILATION SLATS ======== -->
  <!-- Dense horizontal ridges across the front face — signature Pixie visual -->
  <g stroke="rgba(0,0,0,0.2)" stroke-width="1.2">
    <line x1="92" y1="200" x2="188" y2="200"/>
    <line x1="92" y1="206" x2="188" y2="206"/>
    <line x1="92" y1="212" x2="188" y2="212"/>
    <line x1="92" y1="218" x2="188" y2="218"/>
    <line x1="92" y1="224" x2="188" y2="224"/>
    <line x1="92" y1="230" x2="188" y2="230"/>
    <line x1="92" y1="236" x2="188" y2="236"/>
    <line x1="92" y1="242" x2="188" y2="242"/>
    <line x1="92" y1="248" x2="188" y2="248"/>
    <line x1="92" y1="254" x2="188" y2="254"/>
    <line x1="92" y1="260" x2="188" y2="260"/>
    <line x1="92" y1="266" x2="188" y2="266"/>
    <line x1="92" y1="272" x2="188" y2="272"/>
    <line x1="92" y1="278" x2="188" y2="278"/>
    <line x1="92" y1="284" x2="188" y2="284"/>
  </g>
  <!-- Highlight ridges (alternate) -->
  <g stroke="rgba(255,255,255,0.04)" stroke-width="0.5">
    <line x1="92" y1="203" x2="188" y2="203"/>
    <line x1="92" y1="209" x2="188" y2="209"/>
    <line x1="92" y1="215" x2="188" y2="215"/>
    <line x1="92" y1="221" x2="188" y2="221"/>
    <line x1="92" y1="227" x2="188" y2="227"/>
    <line x1="92" y1="233" x2="188" y2="233"/>
    <line x1="92" y1="239" x2="188" y2="239"/>
    <line x1="92" y1="245" x2="188" y2="245"/>
    <line x1="92" y1="251" x2="188" y2="251"/>
    <line x1="92" y1="257" x2="188" y2="257"/>
    <line x1="92" y1="263" x2="188" y2="263"/>
    <line x1="92" y1="269" x2="188" y2="269"/>
    <line x1="92" y1="275" x2="188" y2="275"/>
    <line x1="92" y1="281" x2="188" y2="281"/>
  </g>

  <!-- ======== DISPENSING SPOUT (emerging from between head and body) ======== -->
  <!-- Chrome spout housing -->
  <rect x="122" y="175" width="36" height="10" rx="3" fill="#777" stroke="#999" stroke-width="0.3"/>
  <!-- Dual nozzles -->
  <rect x="130" y="185" width="5" height="18" rx="2" fill="#666"/>
  <rect x="145" y="185" width="5" height="18" rx="2" fill="#666"/>
  <ellipse cx="132.5" cy="204" rx="2.5" ry="2" fill="#555"/>
  <ellipse cx="147.5" cy="204" rx="2.5" ry="2" fill="#555"/>

  <!-- ======== NESPRESSO LOGO on body ======== -->
  <text x="140" y="310" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" fill="#888" font-weight="300" letter-spacing="3">NESPRESSO</text>

  <!-- ======== CHROME ARCH (wraps around the brewing head — signature Pixie element) ======== -->
  <!-- The chrome arch sits at the junction of head and body, visible from the front as a U-shape -->
  <path d="M78 170 L78 120 Q78 100 90 88 L90 170" fill="none" stroke="url(#chrome)" stroke-width="5" stroke-linecap="round"/>
  <path d="M202 170 L202 120 Q202 100 190 88 L190 170" fill="none" stroke="url(#chrome)" stroke-width="5" stroke-linecap="round"/>
  <!-- Arch top connecting bar -->
  <path d="M90 88 Q140 76 190 88" fill="none" stroke="url(#chrome)" stroke-width="5"/>
  <!-- Chrome highlight on arch -->
  <path d="M82 165 L82 122 Q82 104 92 92" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>

  <!-- ======== BREWING HEAD (large rounded black unit — WIDER than body) ======== -->
  <!-- Main head shape — rounded rectangle, wider than the lower body -->
  <path d="
    M72 170
    L72 80
    Q72 42 100 32
    Q140 22 180 32
    Q208 42 208 80
    L208 170
    Z
  " fill="url(#head-grad)" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- 3D roundedness overlay -->
  <path d="
    M72 170 L72 80 Q72 42 100 32 Q140 22 180 32 Q208 42 208 80 L208 170 Z
  " fill="url(#head-lr)"/>

  <!-- Capsule lever arm on top of head -->
  <rect x="114" y="26" width="52" height="12" rx="6" fill="#333" stroke="#4A4A4A" stroke-width="0.5"/>
  <!-- Lever hinge pivot -->
  <circle cx="140" cy="32" r="5" fill="#3A3A3A" stroke="#555" stroke-width="0.5"/>
  <circle cx="140" cy="32" r="2.5" fill="#444"/>
  <!-- Lever grip -->
  <ellipse cx="140" cy="24" rx="18" ry="6" fill="#383838" stroke="#4A4A4A" stroke-width="0.5"/>
  <ellipse cx="140" cy="23" rx="14" ry="4.5" fill="#444"/>
  <ellipse cx="137" cy="22" rx="7" ry="2.5" fill="rgba(255,255,255,0.06)"/>

  <!-- Capsule slot seam line on head front -->
  <rect x="95" y="108" width="90" height="4" rx="2" fill="#1E1E1E" stroke="#333" stroke-width="0.3"/>

  <!-- "nespresso" text on head top -->
  <text x="186" y="48" text-anchor="end" font-size="5" font-family="Arial, sans-serif" fill="#555" font-weight="300" letter-spacing="1.5">nespresso</text>

  <!-- ======== BREW BUTTONS (two backlit amber buttons on top of head) ======== -->
  <!-- Espresso button -->
  <circle cx="120" cy="60" r="10" fill="#1E1E1E" stroke="#3A3A3A" stroke-width="0.7"/>
  <circle cx="120" cy="60" r="7" fill="url(#btn-glow)" opacity="0.85"/>
  <!-- Small cup icon -->
  <rect x="117" y="57" width="6" height="5" rx="1" fill="none" stroke="rgba(80,50,0,0.8)" stroke-width="0.8"/>
  <rect x="115" y="61.5" width="10" height="1" rx="0.5" fill="rgba(80,50,0,0.7)"/>

  <!-- Lungo button -->
  <circle cx="160" cy="60" r="10" fill="#1E1E1E" stroke="#3A3A3A" stroke-width="0.7"/>
  <circle cx="160" cy="60" r="7" fill="url(#btn-glow)" opacity="0.85"/>
  <!-- Tall cup icon -->
  <rect x="156" y="55" width="8" height="7" rx="1.2" fill="none" stroke="rgba(80,50,0,0.8)" stroke-width="0.8"/>
  <rect x="154" y="61.5" width="12" height="1" rx="0.5" fill="rgba(80,50,0,0.7)"/>

  <!-- ======== WATER TANK (transparent, right side behind body) ======== -->
  <rect x="198" y="80" width="18" height="250" rx="6" fill="rgba(180,210,240,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
  <!-- Water level lines -->
  <line x1="200" y1="200" x2="214" y2="200" stroke="rgba(150,180,210,0.06)" stroke-width="0.3"/>
  <line x1="200" y1="260" x2="214" y2="260" stroke="rgba(150,180,210,0.06)" stroke-width="0.3"/>
</svg>`,
  "Nespresso CitiZ": `<svg width="280" height="440" viewBox="0 0 280 440">
  <defs>
    <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#282828"/>
      <stop offset="12%" stop-color="#363636"/>
      <stop offset="40%" stop-color="#3E3E3E"/>
      <stop offset="60%" stop-color="#3A3A3A"/>
      <stop offset="88%" stop-color="#323232"/>
      <stop offset="100%" stop-color="#282828"/>
    </linearGradient>
    <linearGradient id="dome-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#484848"/>
      <stop offset="40%" stop-color="#383838"/>
      <stop offset="100%" stop-color="#2E2E2E"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="20%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#E0E0E0"/>
      <stop offset="55%" stop-color="#D8D8D8"/>
      <stop offset="75%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="100%" stop-color="#B8B8B8"/>
    </linearGradient>
    <!-- Shield-shaped lever chrome gradient -->
    <radialGradient id="lever-grad" cx="0.4" cy="0.35" r="0.65">
      <stop offset="0%" stop-color="#ECECEC"/>
      <stop offset="30%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#909090"/>
    </radialGradient>
    <linearGradient id="base-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A3A3A"/>
      <stop offset="50%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="140" cy="420" rx="100" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== WIDE BLACK BASE PLATFORM ======== -->
  <path d="M52 372 L52 410 Q52 418 66 418 L214 418 Q228 418 228 410 L228 372 Z" fill="url(#base-grad)" stroke="#444" stroke-width="0.5"/>
  <rect x="52" y="372" width="176" height="2" rx="1" fill="#4A4A4A"/>

  <!-- ======== CHROME DRIP TRAY (perforated dot grid — sits in the base) ======== -->
  <rect x="62" y="330" width="156" height="44" rx="3" fill="url(#chrome)" stroke="#AAA" stroke-width="0.5"/>
  <!-- Dot grid pattern (perforated holes, not lozenges — matches reference photos) -->
  <g fill="#949494">
    <!-- Row 1 -->
    <circle cx="78" cy="340" r="1.5"/><circle cx="86" cy="340" r="1.5"/><circle cx="94" cy="340" r="1.5"/>
    <circle cx="102" cy="340" r="1.5"/><circle cx="110" cy="340" r="1.5"/><circle cx="118" cy="340" r="1.5"/>
    <circle cx="126" cy="340" r="1.5"/><circle cx="134" cy="340" r="1.5"/><circle cx="142" cy="340" r="1.5"/>
    <circle cx="150" cy="340" r="1.5"/><circle cx="158" cy="340" r="1.5"/><circle cx="166" cy="340" r="1.5"/>
    <circle cx="174" cy="340" r="1.5"/><circle cx="182" cy="340" r="1.5"/><circle cx="190" cy="340" r="1.5"/>
    <circle cx="198" cy="340" r="1.5"/><circle cx="206" cy="340" r="1.5"/>
    <!-- Row 2 -->
    <circle cx="82" cy="348" r="1.5"/><circle cx="90" cy="348" r="1.5"/><circle cx="98" cy="348" r="1.5"/>
    <circle cx="106" cy="348" r="1.5"/><circle cx="114" cy="348" r="1.5"/><circle cx="122" cy="348" r="1.5"/>
    <circle cx="130" cy="348" r="1.5"/><circle cx="138" cy="348" r="1.5"/><circle cx="146" cy="348" r="1.5"/>
    <circle cx="154" cy="348" r="1.5"/><circle cx="162" cy="348" r="1.5"/><circle cx="170" cy="348" r="1.5"/>
    <circle cx="178" cy="348" r="1.5"/><circle cx="186" cy="348" r="1.5"/><circle cx="194" cy="348" r="1.5"/>
    <circle cx="202" cy="348" r="1.5"/>
    <!-- Row 3 -->
    <circle cx="78" cy="356" r="1.5"/><circle cx="86" cy="356" r="1.5"/><circle cx="94" cy="356" r="1.5"/>
    <circle cx="102" cy="356" r="1.5"/><circle cx="110" cy="356" r="1.5"/><circle cx="118" cy="356" r="1.5"/>
    <circle cx="126" cy="356" r="1.5"/><circle cx="134" cy="356" r="1.5"/><circle cx="142" cy="356" r="1.5"/>
    <circle cx="150" cy="356" r="1.5"/><circle cx="158" cy="356" r="1.5"/><circle cx="166" cy="356" r="1.5"/>
    <circle cx="174" cy="356" r="1.5"/><circle cx="182" cy="356" r="1.5"/><circle cx="190" cy="356" r="1.5"/>
    <circle cx="198" cy="356" r="1.5"/><circle cx="206" cy="356" r="1.5"/>
    <!-- Row 4 -->
    <circle cx="82" cy="364" r="1.5"/><circle cx="90" cy="364" r="1.5"/><circle cx="98" cy="364" r="1.5"/>
    <circle cx="106" cy="364" r="1.5"/><circle cx="114" cy="364" r="1.5"/><circle cx="122" cy="364" r="1.5"/>
    <circle cx="130" cy="364" r="1.5"/><circle cx="138" cy="364" r="1.5"/><circle cx="146" cy="364" r="1.5"/>
    <circle cx="154" cy="364" r="1.5"/><circle cx="162" cy="364" r="1.5"/><circle cx="170" cy="364" r="1.5"/>
    <circle cx="178" cy="364" r="1.5"/><circle cx="186" cy="364" r="1.5"/><circle cx="194" cy="364" r="1.5"/>
    <circle cx="202" cy="364" r="1.5"/>
  </g>
  <!-- Nespresso N badge on drip tray -->
  <rect x="130" y="370" width="20" height="8" rx="2" fill="#B0B0B0" stroke="#999" stroke-width="0.3"/>
  <text x="140" y="377" text-anchor="middle" font-size="5" font-family="Arial, sans-serif" fill="#666" font-weight="700">N</text>

  <!-- ======== MAIN BODY TOWER (tall, narrow, black) ======== -->
  <rect x="94" y="46" width="92" height="286" rx="4" fill="url(#body-grad)" stroke="#4A4A4A" stroke-width="0.5"/>
  <!-- Left edge shadow -->
  <rect x="94" y="46" width="4" height="286" fill="rgba(0,0,0,0.1)"/>
  <!-- Right edge highlight -->
  <rect x="182" y="46" width="4" height="286" fill="rgba(255,255,255,0.03)"/>

  <!-- Chrome edge trim (left and right vertical strips framing the front) -->
  <rect x="92" y="46" width="3" height="286" rx="1" fill="url(#chrome)" opacity="0.5"/>
  <rect x="185" y="46" width="3" height="286" rx="1" fill="url(#chrome)" opacity="0.4"/>

  <!-- ======== DOMED TOP ======== -->
  <path d="M94 46 Q94 18 140 12 Q186 18 186 46 Z" fill="url(#dome-grad)" stroke="#4A4A4A" stroke-width="0.5"/>
  <path d="M108 34 Q140 20 172 34" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>

  <!-- ======== CAPSULE LEVER (on top) ======== -->
  <rect x="120" y="18" width="40" height="8" rx="4" fill="#333" stroke="#4A4A4A" stroke-width="0.5"/>
  <ellipse cx="140" cy="18" rx="16" ry="5" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.5"/>
  <ellipse cx="140" cy="17" rx="12" ry="3.5" fill="#444"/>
  <ellipse cx="138" cy="16" rx="6" ry="2" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== TWO BREW BUTTONS (on top) ======== -->
  <circle cx="128" cy="34" r="4.5" fill="#2E2E2E" stroke="#4A4A4A" stroke-width="0.5"/>
  <circle cx="128" cy="34" r="2.5" fill="#444"/>
  <circle cx="152" cy="34" r="4.5" fill="#2E2E2E" stroke="#4A4A4A" stroke-width="0.5"/>
  <circle cx="152" cy="34" r="2.5" fill="#444"/>
  <!-- nespresso text on dome -->
  <text x="168" y="44" text-anchor="end" font-size="4" font-family="Arial, sans-serif" fill="#555" font-weight="300" letter-spacing="1">nespresso</text>

  <!-- ======== CHROME LEVER — SHIELD/D SHAPE (the signature CitiZ feature) ======== -->
  <!-- The lever is a large chrome shield/teardrop on the upper front face -->
  <!-- It's NOT a ring/oval — it's a solid convex chrome piece, wider at top, pointed at bottom -->
  <path d="
    M108 72
    Q100 72 98 82
    L96 120
    Q94 145 108 162
    Q125 180 140 184
    Q155 180 172 162
    Q186 145 184 120
    L182 82
    Q180 72 172 72
    Z
  " fill="url(#lever-grad)" stroke="#CCC" stroke-width="0.8"/>
  <!-- Lever depth/convex highlight -->
  <path d="
    M112 76
    Q108 78 106 86
    L104 118
    Q102 140 114 156
    Q128 172 140 176
  " fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
  <!-- Lever right shadow -->
  <path d="
    M168 76
    Q172 78 174 86
    L176 118
    Q178 140 166 156
    Q152 172 140 176
  " fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/>
  <!-- Center reflection spot -->
  <ellipse cx="136" cy="110" rx="14" ry="20" fill="rgba(255,255,255,0.06)"/>
  <!-- Lever pivot hinge at top -->
  <rect x="114" y="68" width="52" height="6" rx="3" fill="#C0C0C0" stroke="#DDD" stroke-width="0.3"/>
  <rect x="114" y="68" width="52" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>

  <!-- ======== VERTICAL CHROME VENTILATION FINS (below the lever) ======== -->
  <!-- Dense vertical slats/fins — this is the other signature CitiZ visual -->
  <rect x="100" y="192" width="80" height="80" rx="2" fill="#2A2A2A"/>
  <!-- Chrome vertical fins -->
  <g fill="url(#chrome)" opacity="0.7">
    <rect x="104" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="110" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="116" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="122" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="128" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="134" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="140" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="146" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="152" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="158" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="164" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="170" y="194" width="2.5" height="76" rx="0.8"/>
    <rect x="176" y="194" width="2.5" height="76" rx="0.8"/>
  </g>
  <!-- Subtle depth shadow between fins -->
  <g fill="rgba(0,0,0,0.15)">
    <rect x="107" y="194" width="2" height="76"/>
    <rect x="113" y="194" width="2" height="76"/>
    <rect x="119" y="194" width="2" height="76"/>
    <rect x="125" y="194" width="2" height="76"/>
    <rect x="131" y="194" width="2" height="76"/>
    <rect x="137" y="194" width="2" height="76"/>
    <rect x="143" y="194" width="2" height="76"/>
    <rect x="149" y="194" width="2" height="76"/>
    <rect x="155" y="194" width="2" height="76"/>
    <rect x="161" y="194" width="2" height="76"/>
    <rect x="167" y="194" width="2" height="76"/>
    <rect x="173" y="194" width="2" height="76"/>
  </g>

  <!-- ======== CHROME CUP SHELF (below the fins, cup sits here) ======== -->
  <path d="M88 274 Q88 270 92 270 L188 270 Q192 270 192 274 L192 288 Q192 292 188 292 L92 292 Q88 292 88 288 Z" fill="url(#chrome)" stroke="#AAA" stroke-width="0.4"/>
  <!-- Shelf top highlight -->
  <rect x="90" y="270" width="100" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>
  <!-- Cup support ridge -->
  <rect x="110" y="276" width="60" height="3" rx="1.5" fill="#B0B0B0"/>

  <!-- ======== DISPENSING SPOUT (small chrome nozzle emerging between fins and shelf) ======== -->
  <!-- Dual nozzles coming out from behind the fins -->
  <rect x="131" y="276" width="4" height="14" rx="1.5" fill="#AAA"/>
  <rect x="145" y="276" width="4" height="14" rx="1.5" fill="#AAA"/>
  <ellipse cx="133" cy="291" rx="2" ry="1.5" fill="#999"/>
  <ellipse cx="147" cy="291" rx="2" ry="1.5" fill="#999"/>

  <!-- ======== NESPRESSO BRANDING (on lower body) ======== -->
  <text x="140" y="310" text-anchor="middle" font-size="6" font-family="Arial, sans-serif" fill="#777" font-weight="300" letter-spacing="2.5">NESPRESSO</text>

  <!-- ======== WATER TANK (transparent, right side) ======== -->
  <path d="M186 52 L190 52 Q198 56 198 64 L198 320 Q198 326 190 328 L186 328 Z" fill="rgba(180,210,240,0.06)" stroke="rgba(150,180,210,0.08)" stroke-width="0.5"/>
  <line x1="188" y1="160" x2="196" y2="160" stroke="rgba(150,180,210,0.06)" stroke-width="0.3"/>
  <line x1="188" y1="240" x2="196" y2="240" stroke="rgba(150,180,210,0.06)" stroke-width="0.3"/>
</svg>`,
  "Nespresso Lattissima One": `<svg width="340" height="420" viewBox="0 0 340 420">
  <defs>
    <!-- Matte black body gradient (brighter to contrast with bg) -->
    <linearGradient id="matte-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#262626"/>
      <stop offset="15%" stop-color="#333333"/>
      <stop offset="40%" stop-color="#383838"/>
      <stop offset="60%" stop-color="#353535"/>
      <stop offset="85%" stop-color="#303030"/>
      <stop offset="100%" stop-color="#252525"/>
    </linearGradient>
    <!-- Chrome gradient for lever and spout -->
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="25%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="75%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <!-- Chrome vertical -->
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="30%" stop-color="#E0E0E0"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <!-- Capsule head gradient (spherical look) -->
    <radialGradient id="capsule-head" cx="0.35" cy="0.3" r="0.65">
      <stop offset="0%" stop-color="#505050"/>
      <stop offset="30%" stop-color="#404040"/>
      <stop offset="60%" stop-color="#333333"/>
      <stop offset="100%" stop-color="#222222"/>
    </radialGradient>
    <!-- Milk jug translucent gradient -->
    <linearGradient id="milk-jug" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#505860"/>
      <stop offset="30%" stop-color="#5A6470"/>
      <stop offset="70%" stop-color="#555D68"/>
      <stop offset="100%" stop-color="#4A5258"/>
    </linearGradient>
    <!-- Milk jug vertical -->
    <linearGradient id="milk-jug-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.03)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.01)"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="158" cy="405" rx="115" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== DRIP TRAY BASE ======== -->
  <rect x="76" y="346" width="172" height="52" rx="4" fill="#2A2A2A" stroke="#404040" stroke-width="0.5"/>
  <!-- Tray grid plate -->
  <rect x="86" y="352" width="152" height="34" rx="3" fill="#1E1E1E"/>
  <!-- Grid lines horizontal -->
  <rect x="92" y="356" width="140" height="1.5" rx="0.5" fill="#333"/>
  <rect x="92" y="362" width="140" height="1.5" rx="0.5" fill="#333"/>
  <rect x="92" y="368" width="140" height="1.5" rx="0.5" fill="#333"/>
  <rect x="92" y="374" width="140" height="1.5" rx="0.5" fill="#333"/>
  <rect x="92" y="380" width="140" height="1.5" rx="0.5" fill="#333"/>
  <!-- Grid lines vertical -->
  <rect x="108" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="124" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="140" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="156" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="172" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="188" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="204" y="354" width="1" height="30" rx="0.5" fill="#333"/>
  <rect x="220" y="354" width="1" height="30" rx="0.5" fill="#333"/>

  <!-- ======== MAIN BODY (tall narrow matte black rectangle) ======== -->
  <rect x="82" y="50" width="160" height="298" rx="5" fill="url(#matte-black)" stroke="#505050" stroke-width="0.8"/>
  <!-- Left edge highlight -->
  <rect x="82" y="50" width="2.5" height="298" rx="1" fill="rgba(255,255,255,0.06)"/>
  <!-- Right edge highlight -->
  <rect x="239.5" y="50" width="2.5" height="298" rx="1" fill="rgba(255,255,255,0.04)"/>
  <!-- Top edge -->
  <rect x="82" y="50" width="160" height="2.5" rx="1" fill="rgba(255,255,255,0.07)"/>
  <!-- Bottom edge -->
  <rect x="82" y="345.5" width="160" height="2.5" rx="1" fill="rgba(255,255,255,0.03)"/>
  <!-- Subtle horizontal line texture on body -->
  <line x1="88" y1="105" x2="236" y2="105" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="135" x2="236" y2="135" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="165" x2="236" y2="165" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="195" x2="236" y2="195" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="225" x2="236" y2="225" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="255" x2="236" y2="255" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="285" x2="236" y2="285" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>
  <line x1="88" y1="315" x2="236" y2="315" stroke="rgba(255,255,255,0.02)" stroke-width="0.5"/>

  <!-- ======== TOP SURFACE ======== -->
  <rect x="82" y="46" width="160" height="8" rx="3" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.3"/>

  <!-- ======== CHROME CAPSULE LEVER (prominent arched handle on top) ======== -->
  <!-- Lever pivot base -->
  <rect x="120" y="36" width="50" height="14" rx="4" fill="#555" stroke="#666" stroke-width="0.5"/>
  <!-- Lever arm arching up — wide and prominent -->
  <path d="M126 44 Q145 -2 164 44" fill="none" stroke="url(#chrome)" stroke-width="8" stroke-linecap="round"/>
  <!-- Lever inner highlight -->
  <path d="M132 44 Q145 6 158 44" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
  <!-- Lever handle/grip at top -->
  <rect x="136" y="2" width="18" height="10" rx="4" fill="url(#chrome)" stroke="#BBB" stroke-width="0.3"/>
  <rect x="138" y="4" width="14" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>

  <!-- ======== DE'LONGHI BRANDING (upper right) ======== -->
  <text x="215" y="68" text-anchor="middle" font-size="5.5" font-family="Arial, sans-serif" fill="#5A5A5A" letter-spacing="1.5" font-weight="400">DE'LONGHI</text>

  <!-- ======== TOUCH BUTTONS (3 circular, upper right of front face) ======== -->
  <!-- Espresso button -->
  <circle cx="193" cy="84" r="9" fill="rgba(255,255,255,0.03)" stroke="#5A5A5A" stroke-width="1"/>
  <!-- Espresso icon (small cup) -->
  <rect x="190" y="81" width="6" height="5" rx="1" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="188" y="85.5" width="10" height="1.2" rx="0.6" fill="#777"/>

  <!-- Lungo button -->
  <circle cx="215" cy="84" r="9" fill="rgba(255,255,255,0.03)" stroke="#5A5A5A" stroke-width="1"/>
  <!-- Lungo icon (tall cup) -->
  <rect x="212" y="79" width="6" height="7" rx="1" fill="none" stroke="#777" stroke-width="0.8"/>
  <rect x="210" y="85.5" width="10" height="1.2" rx="0.6" fill="#777"/>

  <!-- Milk recipe button -->
  <circle cx="237" cy="84" r="9" fill="rgba(255,255,255,0.03)" stroke="#5A5A5A" stroke-width="1"/>
  <!-- Milk icon (cup with steam) -->
  <rect x="234" y="80" width="6" height="6" rx="1" fill="none" stroke="#777" stroke-width="0.8"/>
  <path d="M236 82 Q238 79 240 82" fill="none" stroke="#777" stroke-width="0.6"/>
  <rect x="232" y="85.5" width="10" height="1.2" rx="0.6" fill="#777"/>

  <!-- ======== CAPSULE HEAD MOUNT (subtle neck connecting sphere to body) ======== -->
  <!-- Mounting bracket — narrower, blends with body -->
  <rect x="100" y="130" width="28" height="65" rx="8" fill="#303030"/>

  <!-- ======== CAPSULE HEAD (large spherical, protruding from front-left) ======== -->
  <!-- This is THE defining feature — big prominent sphere -->
  <circle cx="108" cy="150" r="46" fill="url(#capsule-head)" stroke="#444" stroke-width="1.2"/>
  <!-- Inner ring detail -->
  <circle cx="108" cy="150" r="39" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.8"/>
  <!-- Specular highlight (top-left) -->
  <ellipse cx="92" cy="133" rx="16" ry="10" fill="rgba(255,255,255,0.07)"/>
  <!-- Secondary softer highlight -->
  <ellipse cx="98" cy="140" rx="10" ry="6" fill="rgba(255,255,255,0.04)"/>
  <!-- NESPRESSO text -->
  <text x="108" y="148" text-anchor="middle" font-size="8" font-family="Arial, sans-serif" fill="#888" letter-spacing="2.5" font-weight="600">NESPRESSO</text>
  <!-- Capsule slot line -->
  <line x1="84" y1="158" x2="132" y2="158" stroke="#4A4A4A" stroke-width="1.2"/>
  <!-- Bottom shadow on sphere -->
  <ellipse cx="108" cy="175" rx="30" ry="8" fill="rgba(0,0,0,0.15)"/>

  <!-- ======== COFFEE SPOUT (compact, integrated below capsule head) ======== -->
  <!-- Spout housing — attached under capsule area -->
  <rect x="100" y="196" width="24" height="8" rx="3" fill="#3A3A3A" stroke="#4A4A4A" stroke-width="0.5"/>
  <!-- Spout arm — chrome/dark -->
  <rect x="105" y="204" width="14" height="28" rx="3" fill="#777" stroke="#888" stroke-width="0.3"/>
  <!-- Spout highlight line -->
  <rect x="109" y="206" width="3" height="24" rx="1" fill="rgba(255,255,255,0.08)"/>
  <!-- Height adjuster notch -->
  <rect x="103" y="222" width="18" height="2.5" rx="1" fill="#999"/>
  <!-- Spout tip -->
  <rect x="107" y="232" width="10" height="6" rx="2" fill="#888"/>
  <!-- Spout opening -->
  <ellipse cx="112" cy="238" rx="3" ry="1.5" fill="#777"/>

  <!-- ======== LATTE GLASS (under spout, adds life) ======== -->
  <path d="M92 340 L95 270 Q95 264 104 263 L128 263 Q137 264 137 270 L140 340 Q140 345 116 346 Q92 345 92 340 Z" fill="rgba(200,200,200,0.06)" stroke="rgba(200,200,200,0.1)" stroke-width="0.5"/>
  <!-- Coffee layer (bottom) -->
  <path d="M97 340 L100 310 L132 310 L135 340 Q135 344 116 345 Q97 344 97 340 Z" fill="rgba(120,80,30,0.12)"/>
  <!-- Milk layer (middle) -->
  <path d="M99 310 L101 285 L131 285 L133 310 Z" fill="rgba(240,230,210,0.1)"/>
  <!-- Foam layer (top) -->
  <ellipse cx="116" cy="275" rx="16" ry="4" fill="rgba(255,250,240,0.12)"/>

  <!-- ======== MILK JUG (translucent, docked into right side of machine) ======== -->
  <!-- Jug dock recess on machine body -->
  <rect x="195" y="150" width="10" height="80" rx="2" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.3"/>
  <!-- Milk spout pipe coming out of dock -->
  <rect x="197" y="160" width="6" height="8" rx="1" fill="#555"/>

  <!-- Jug lid/top — sits on top of jug -->
  <rect x="204" y="146" width="50" height="14" rx="4" fill="#444" stroke="#555" stroke-width="0.5"/>
  <!-- Lid handle/nub -->
  <rect x="222" y="143" width="14" height="6" rx="3" fill="#4A4A4A" stroke="#5A5A5A" stroke-width="0.5"/>

  <!-- Jug body — frosted translucent container, docked against machine -->
  <path d="M206 160 L204 332 Q204 340 216 342 L244 342 Q256 340 256 332 L254 160 Z" fill="url(#milk-jug)" stroke="rgba(160,170,180,0.35)" stroke-width="0.8" opacity="0.75"/>
  <!-- Frosted glass overlay effect -->
  <path d="M206 160 L204 332 Q204 340 216 342 L244 342 Q256 340 256 332 L254 160 Z" fill="url(#milk-jug-v)" opacity="0.4"/>
  <!-- Jug interior - milk level lines -->
  <line x1="212" y1="190" x2="248" y2="190" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <line x1="212" y1="220" x2="248" y2="220" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <line x1="212" y1="250" x2="248" y2="250" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <line x1="212" y1="280" x2="248" y2="280" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <!-- Marker text labels (drink size indicators) -->
  <text x="226" y="188" font-size="4.5" fill="rgba(255,255,255,0.2)" font-family="sans-serif" text-anchor="middle">CAP</text>
  <text x="226" y="218" font-size="4.5" fill="rgba(255,255,255,0.2)" font-family="sans-serif" text-anchor="middle">LAT</text>
  <text x="226" y="248" font-size="4.5" fill="rgba(255,255,255,0.2)" font-family="sans-serif" text-anchor="middle">FLAT W</text>
  <!-- Jug highlight stripe (left edge light catch) -->
  <line x1="212" y1="165" x2="211" y2="337" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <!-- Jug right edge shadow -->
  <line x1="250" y1="165" x2="251" y2="337" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>

  <!-- ======== WATER TANK HINT (behind body, visible at right edge) ======== -->
  <rect x="240" y="78" width="14" height="255" rx="4" fill="rgba(50,60,70,0.1)" stroke="rgba(80,90,100,0.08)" stroke-width="0.5"/>
</svg>`,

  "Jura ENA 4": `<svg width="400" height="430" viewBox="0 0 400 430">
  <defs>
    <!-- Piano Black — deep glossy black, must read against #1A1A1A bg -->
    <linearGradient id="piano-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="12%" stop-color="#282828"/>
      <stop offset="35%" stop-color="#2E2E2E"/>
      <stop offset="50%" stop-color="#2C2C2C"/>
      <stop offset="65%" stop-color="#2A2A2A"/>
      <stop offset="88%" stop-color="#252525"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="spout-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#222"/>
      <stop offset="30%" stop-color="#333"/>
      <stop offset="50%" stop-color="#383838"/>
      <stop offset="70%" stop-color="#333"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <!-- Display panel background -->
    <linearGradient id="display-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A1A"/>
      <stop offset="50%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#121212"/>
    </linearGradient>
    <!-- Glossy highlight -->
    <linearGradient id="piano-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <!-- Water tank translucent blue fill -->
    <linearGradient id="tank-fill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(140,190,220,0.25)"/>
      <stop offset="30%" stop-color="rgba(120,175,210,0.18)"/>
      <stop offset="60%" stop-color="rgba(100,165,205,0.22)"/>
      <stop offset="100%" stop-color="rgba(80,150,195,0.15)"/>
    </linearGradient>
    <!-- Crystal diamond crosshatch pattern -->
    <pattern id="crystal-diamond" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="14" y2="14" stroke="rgba(180,215,240,0.18)" stroke-width="0.5"/>
      <line x1="14" y1="0" x2="0" y2="14" stroke="rgba(180,215,240,0.18)" stroke-width="0.5"/>
      <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(160,200,230,0.06)" stroke-width="0.3"/>
      <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(160,200,230,0.06)" stroke-width="0.3"/>
    </pattern>
    <!-- Tank highlight gloss -->
    <linearGradient id="tank-gloss" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.0)"/>
      <stop offset="20%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="40%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="55%" stop-color="rgba(255,255,255,0.04)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.0)"/>
    </linearGradient>
    <!-- Water level gradient -->
    <linearGradient id="water-level" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(70,140,190,0.0)"/>
      <stop offset="25%" stop-color="rgba(70,140,190,0.0)"/>
      <stop offset="28%" stop-color="rgba(70,140,190,0.08)"/>
      <stop offset="100%" stop-color="rgba(60,130,180,0.22)"/>
    </linearGradient>
    <!-- Clip for tank to sit behind the body edge -->
    <clipPath id="tank-clip">
      <rect x="272" y="25" width="80" height="365"/>
    </clipPath>
  </defs>

  <!-- Shadow -->
  <ellipse cx="185" cy="418" rx="145" ry="8" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== WATER TANK — crystal diamond-pattern, right side ======== -->
  <g clip-path="url(#tank-clip)">
    <!-- Tank outer shell — slightly rounded rectangle -->
    <rect x="275" y="35" width="60" height="337" rx="8" ry="8"
          fill="#1A2530" stroke="rgba(140,190,220,0.2)" stroke-width="0.6"/>
    <!-- Translucent blue tinted body -->
    <rect x="275" y="35" width="60" height="337" rx="8" ry="8"
          fill="url(#tank-fill)"/>
    <!-- Crystal diamond crosshatch overlay -->
    <rect x="275" y="35" width="60" height="337" rx="8" ry="8"
          fill="url(#crystal-diamond)"/>
    <!-- Water level — gradient showing water inside -->
    <rect x="275" y="35" width="60" height="337" rx="8" ry="8"
          fill="url(#water-level)"/>
    <!-- Glossy vertical highlight — simulates light catching the curved plastic -->
    <rect x="275" y="35" width="60" height="337" rx="8" ry="8"
          fill="url(#tank-gloss)"/>
    <!-- Top rim / cap of the tank -->
    <rect x="278" y="33" width="54" height="8" rx="4" ry="3"
          fill="#222830" stroke="rgba(140,190,220,0.15)" stroke-width="0.4"/>
    <!-- Subtle water surface line at ~30% from top -->
    <line x1="280" y1="136" x2="330" y2="136"
          stroke="rgba(100,175,220,0.2)" stroke-width="0.6"/>
    <line x1="282" y1="137" x2="328" y2="137.3"
          stroke="rgba(100,175,220,0.08)" stroke-width="1.2"/>
    <!-- Light refraction lines inside the water -->
    <line x1="285" y1="177" x2="290" y2="350" stroke="rgba(120,180,215,0.05)" stroke-width="1.5"/>
    <line x1="310" y1="151" x2="315" y2="360" stroke="rgba(120,180,215,0.04)" stroke-width="1"/>
    <!-- Edge shadow where tank meets machine body -->
    <rect x="275" y="37" width="4" height="335" fill="rgba(0,0,0,0.25)"/>
  </g>

  <!-- ======== MONOLITHIC BODY — single Piano Black block ======== -->
  <!-- The ENA 4 is one continuous flat-faced black block -->
  <path d="
    M58 30
    Q58 22 66 20
    L274 20
    Q282 22 282 30
    L282 375
    Q282 382 274 384
    L66 384
    Q58 382 58 375
    Z
  " fill="url(#piano-black)" stroke="#3A3A3A" stroke-width="0.6"/>

  <!-- Top highlight — glossy reflection arc -->
  <path d="M66 20 L274 20 Q282 22 282 30 L282 38 Q170 44 58 38 L58 30 Q58 22 66 20 Z" fill="url(#piano-gloss)"/>
  <!-- Left edge ambient light -->
  <rect x="58" y="30" width="2.5" height="345" fill="rgba(255,255,255,0.02)"/>
  <!-- Subtle diagonal gloss strip — piano black sheen -->
  <path d="M67 28 L73 28 L73 350 L67 350 Z" fill="rgba(255,255,255,0.015)"/>
  <!-- Piano black glossy reflection — curved highlight across upper body -->
  <path d="M62 120 Q170 108 278 120 L278 125 Q170 113 62 125 Z" fill="rgba(255,255,255,0.02)"/>
  <!-- Subtle right edge shadow for 3D depth -->
  <rect x="279.5" y="30" width="2.5" height="345" fill="rgba(0,0,0,0.15)"/>

  <!-- ======== DISPLAY/CONTROL PANEL — recessed dark area at top ======== -->
  <!-- This is a single recessed panel housing symbols and buttons -->
  <rect x="78" y="34" width="184" height="70" rx="5" fill="url(#display-bg)" stroke="#282828" stroke-width="0.4"/>
  <!-- Top inner shadow -->
  <rect x="80" y="36" width="180" height="2.5" rx="1.5" fill="rgba(0,0,0,0.2)"/>

  <!-- ======== SYMBOL ROW — 4 illuminated drink icons ======== -->
  <!-- Small amber/gold coffee cup symbols -->

  <!-- Symbol 1: Espresso (small cup) -->
  <g opacity="0.75">
    <rect x="107" y="47" width="6" height="7" rx="1" fill="none" stroke="#C8A050" stroke-width="0.7"/>
    <rect x="113" y="48.5" width="2" height="3.5" rx="0.7" fill="none" stroke="#C8A050" stroke-width="0.5"/>
    <ellipse cx="110" cy="47" rx="2.3" ry="0.5" fill="rgba(200,160,80,0.35)"/>
  </g>

  <!-- Symbol 2: Espresso Doppio -->
  <g opacity="0.75">
    <rect x="139" y="47" width="6" height="7" rx="1" fill="none" stroke="#C8A050" stroke-width="0.7"/>
    <rect x="141.5" y="47" width="6" height="7" rx="1" fill="none" stroke="#C8A050" stroke-width="0.5"/>
    <ellipse cx="143" cy="47" rx="3" ry="0.5" fill="rgba(200,160,80,0.35)"/>
  </g>

  <!-- Symbol 3: Coffee (tall mug) — active/highlighted -->
  <g opacity="1.0">
    <rect x="171" y="45" width="7" height="9.5" rx="1.2" fill="none" stroke="#D4A86A" stroke-width="0.9"/>
    <rect x="178" y="47" width="2.2" height="4" rx="0.7" fill="none" stroke="#D4A86A" stroke-width="0.6"/>
    <ellipse cx="174.5" cy="45" rx="2.8" ry="0.6" fill="rgba(212,168,106,0.5)"/>
  </g>

  <!-- Symbol 4: Cafe Doppio -->
  <g opacity="0.75">
    <rect x="203" y="45" width="7" height="9.5" rx="1.2" fill="none" stroke="#C8A050" stroke-width="0.7"/>
    <rect x="205.5" y="45" width="7" height="9.5" rx="1.2" fill="none" stroke="#C8A050" stroke-width="0.5"/>
    <ellipse cx="208" cy="45" rx="3.5" ry="0.6" fill="rgba(200,160,80,0.35)"/>
  </g>

  <!-- ======== 4 BUTTONS — below symbols, extremely subtle ======== -->
  <!-- On the real machine these are barely visible black-on-black -->
  <circle cx="110" cy="72" r="4.5" fill="#121212" stroke="#222" stroke-width="0.4"/>
  <circle cx="143" cy="72" r="4.5" fill="#121212" stroke="#222" stroke-width="0.4"/>
  <!-- Active button gets a faint ring -->
  <circle cx="175" cy="72" r="4.5" fill="#141414" stroke="#2E2E2E" stroke-width="0.5"/>
  <circle cx="208" cy="72" r="4.5" fill="#121212" stroke="#222" stroke-width="0.4"/>

  <!-- Tiny LED indicator dots -->
  <circle cx="110" cy="80" r="0.5" fill="#333"/>
  <circle cx="143" cy="80" r="0.5" fill="#333"/>
  <circle cx="175" cy="80" r="0.6" fill="rgba(200,160,80,0.4)"/>
  <circle cx="208" cy="80" r="0.5" fill="#333"/>

  <!-- ======== HORIZONTAL SEAM — between panel and main body ======== -->
  <line x1="58" y1="110" x2="282" y2="110" stroke="#252525" stroke-width="0.6"/>
  <line x1="58" y1="111" x2="282" y2="111" stroke="rgba(255,255,255,0.012)" stroke-width="0.3"/>

  <!-- ======== JURA LOGO MEDALLION — centered on flat front face ======== -->
  <!-- The logo sits on the flat Piano Black surface between panel and niche -->
  <circle cx="170" cy="142" r="14.5" fill="#1E1E1E" stroke="#555" stroke-width="1"/>
  <circle cx="170" cy="142" r="13" fill="#272727" stroke="rgba(255,255,255,0.06)" stroke-width="0.3"/>
  <text x="170" y="147" text-anchor="middle" font-size="10.5" font-family="sans-serif" fill="#CCC" font-style="italic" font-weight="700">jura</text>

  <!-- ENA 4 model text -->
  <text x="170" y="170" text-anchor="middle" font-size="7" font-family="sans-serif" fill="#666" font-weight="400" letter-spacing="1.5">ENA 4</text>

  <!-- ======== DISPENSING NICHE — proportional cavity with depth ======== -->
  <!-- The dispensing niche is a recessed area cut into the flat front -->
  <rect x="100" y="195" width="140" height="150" rx="5" fill="#0A0A0A"/>
  <!-- Inner wall shadows for recessed depth -->
  <rect x="100" y="195" width="2.5" height="150" fill="rgba(255,255,255,0.015)"/>
  <rect x="237.5" y="195" width="2.5" height="150" fill="rgba(0,0,0,0.15)"/>
  <rect x="100" y="195" width="140" height="5" rx="3" fill="rgba(0,0,0,0.25)"/>
  <!-- Bottom inner shadow -->
  <rect x="100" y="340" width="140" height="3" fill="rgba(0,0,0,0.1)"/>
  <!-- Subtle ambient reflection on niche back wall -->
  <rect x="105" y="310" width="130" height="30" rx="3" fill="rgba(255,255,255,0.008)"/>

  <!-- ======== SPOUT — descending from top of niche ======== -->
  <!-- Spout mount housing -->
  <rect x="157" y="196" width="26" height="9" rx="3" fill="#333" stroke="#444" stroke-width="0.3"/>
  <!-- Height adjust tab -->
  <rect x="184" y="198.5" width="4" height="4.5" rx="1" fill="#2C2C2C" stroke="#444" stroke-width="0.3"/>

  <!-- Main spout body -->
  <rect x="162" y="205" width="16" height="28" rx="2" fill="url(#spout-body)" stroke="#444" stroke-width="0.3"/>
  <!-- Chrome highlight on spout body -->
  <rect x="168" y="207" width="2.5" height="24" rx="1" fill="rgba(255,255,255,0.05)"/>

  <!-- Dual nozzle tubes -->
  <rect x="164" y="233" width="3.5" height="24" rx="1.3" fill="url(#spout-body)" stroke="#444" stroke-width="0.3"/>
  <rect x="172.5" y="233" width="3.5" height="24" rx="1.3" fill="url(#spout-body)" stroke="#444" stroke-width="0.3"/>
  <!-- Spreader bar -->
  <rect x="163" y="245" width="14" height="1.8" rx="0.8" fill="#444"/>

  <!-- Chrome nozzle tips -->
  <ellipse cx="165.8" cy="258" rx="2.3" ry="2.8" fill="url(#spout-chrome)"/>
  <ellipse cx="174.3" cy="258" rx="2.3" ry="2.8" fill="url(#spout-chrome)"/>
  <!-- Nozzle openings -->
  <ellipse cx="165.8" cy="259" rx="1.3" ry="1.8" fill="#888"/>
  <ellipse cx="174.3" cy="259" rx="1.3" ry="1.8" fill="#888"/>

  <!-- ======== FLAT BODY — narrow strip between niche and drip tray ======== -->
  <!-- Subtle horizontal seam above drip tray -->
  <line x1="60" y1="355" x2="280" y2="355" stroke="#252525" stroke-width="0.4"/>

  <!-- ======== DRIP TRAY — chrome plated, extends slightly wider ======== -->
  <path d="
    M52 375
    L52 392
    Q52 404 70 406
    L270 406
    Q288 404 288 392
    L288 375
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Black grate inset -->
  <rect x="66" y="379" width="208" height="18" rx="2" fill="#181818"/>
  <!-- Grate vertical lines -->
  <line x1="84" y1="383" x2="84" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="105" y1="383" x2="105" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="126" y1="383" x2="126" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="147" y1="383" x2="147" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="168" y1="383" x2="168" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="189" y1="383" x2="189" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="210" y1="383" x2="210" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="231" y1="383" x2="231" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="252" y1="383" x2="252" y2="394" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Chrome trim line -->
  <line x1="60" y1="400" x2="280" y2="400" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M62 404 Q62 415 80 417 L260 417 Q278 415 278 404 Z" fill="#1E1E1E"/>
  <line x1="74" y1="417" x2="266" y2="417" stroke="#555" stroke-width="0.3"/>

  <!-- ======== BEAN HOPPER LID — subtle on top ======== -->
  <ellipse cx="170" cy="21" rx="35" ry="3" fill="#2A2A2A" stroke="#3A3A3A" stroke-width="0.4"/>
  <ellipse cx="170" cy="20.5" rx="25" ry="1.8" fill="rgba(255,255,255,0.02)"/>
</svg>`,
  "Jura ENA 8": `<svg width="380" height="430" viewBox="0 0 380 430">
  <defs>
    <!-- Metropolitan Black — deep piano black with slight warm undertone -->
    <linearGradient id="metro-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="15%" stop-color="#282828"/>
      <stop offset="40%" stop-color="#2E2E2E"/>
      <stop offset="60%" stop-color="#2B2B2B"/>
      <stop offset="85%" stop-color="#242424"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
    <!-- Matte black front face — Metropolitan Black is ALL black -->
    <linearGradient id="brushed-alum" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="12%" stop-color="#303030"/>
      <stop offset="30%" stop-color="#333"/>
      <stop offset="50%" stop-color="#313131"/>
      <stop offset="70%" stop-color="#323232"/>
      <stop offset="88%" stop-color="#2E2E2E"/>
      <stop offset="100%" stop-color="#2A2A2A"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="170" cy="418" rx="120" ry="8" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== WATER TANK — crystal-pattern, right side (prominent on ENA 8) ======== -->
  <!-- Tank runs full height of body: top of machine body (y=22) down to drip tray (y=368) -->
  <rect x="283" y="22" width="32" height="346" rx="4" fill="rgba(45,55,70,0.50)" stroke="rgba(120,140,160,0.35)" stroke-width="0.6"/>
  <!-- Crystal diamond crosshatch pattern — faceted rows spanning full tank height -->
  <path d="M287 37 L295 47 L303 37 L295 27 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 47 L303 57 L311 47 L303 37 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 57 L295 67 L303 57 L295 47 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 67 L303 77 L311 67 L303 57 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 77 L295 87 L303 77 L295 67 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 87 L303 97 L311 87 L303 77 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 97 L295 107 L303 97 L295 87 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 107 L303 117 L311 107 L303 97 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 117 L295 127 L303 117 L295 107 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 127 L303 137 L311 127 L303 117 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 137 L295 147 L303 137 L295 127 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 147 L303 157 L311 147 L303 137 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 157 L295 167 L303 157 L295 147 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 167 L303 177 L311 167 L303 157 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 177 L295 187 L303 177 L295 167 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 187 L303 197 L311 187 L303 177 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 197 L295 207 L303 197 L295 187 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 207 L303 217 L311 207 L303 197 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 217 L295 227 L303 217 L295 207 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 227 L303 237 L311 227 L303 217 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 237 L295 247 L303 237 L295 227 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 247 L303 257 L311 247 L303 237 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 257 L295 267 L303 257 L295 247 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 267 L303 277 L311 267 L303 257 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 277 L295 287 L303 277 L295 267 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 287 L303 297 L311 287 L303 277 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 297 L295 307 L303 297 L295 287 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 307 L303 317 L311 307 L303 297 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 317 L295 327 L303 317 L295 307 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 327 L303 337 L311 327 L303 317 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 337 L295 347 L303 337 L295 327 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <path d="M295 347 L303 357 L311 347 L303 337 Z" fill="none" stroke="rgba(160,200,240,0.08)" stroke-width="0.5"/>
  <path d="M287 357 L295 367 L303 357 L295 347 Z" fill="none" stroke="rgba(160,200,240,0.10)" stroke-width="0.5"/>
  <!-- Crosshatch diagonal lines for extra faceted texture -->
  <line x1="287" y1="27" x2="311" y2="51" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="67" x2="311" y2="91" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="107" x2="311" y2="131" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="147" x2="311" y2="171" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="187" x2="311" y2="211" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="227" x2="311" y2="251" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="267" x2="311" y2="291" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="307" x2="311" y2="331" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="287" y1="347" x2="311" y2="368" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="27" x2="287" y2="51" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="67" x2="287" y2="91" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="107" x2="287" y2="131" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="147" x2="287" y2="171" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="187" x2="287" y2="211" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="227" x2="287" y2="251" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="267" x2="287" y2="291" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="307" x2="287" y2="331" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <line x1="311" y1="347" x2="287" y2="368" stroke="rgba(160,200,240,0.05)" stroke-width="0.3"/>
  <!-- Water level — subtle blue tint in lower portion -->
  <rect x="285" y="200" width="28" height="163" rx="3" fill="rgba(70,110,170,0.06)"/>
  <!-- Tank highlight / vertical reflection -->
  <rect x="291" y="27" width="4" height="336" rx="2" fill="rgba(255,255,255,0.06)"/>
  <!-- Tank top cap -->
  <rect x="285" y="18" width="28" height="6" rx="3" fill="rgba(60,60,70,0.7)" stroke="rgba(120,140,160,0.3)" stroke-width="0.4"/>

  <!-- ======== MONOLITHIC BODY — single unified shape ======== -->
  <!-- The ENA 8 is a compact, unified block — NOT 3-section like E-line -->
  <path d="
    M58 32
    Q58 25 64 22
    L276 22
    Q282 25 282 32
    L282 368
    Q282 376 276 378
    L64 378
    Q58 376 58 368
    Z
  " fill="url(#metro-black)" stroke="#3A3A3A" stroke-width="0.8"/>
  <!-- Top highlight — glossy reflection on Metropolitan Black -->
  <path d="M64 22 L276 22 Q282 25 282 32 L282 40 Q170 46 58 40 L58 32 Q58 25 64 22 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Left edge ambient light -->
  <path d="M58 32 L61 32 L61 368 L58 368 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Right edge shadow -->
  <path d="M279 32 L282 32 L282 368 L279 368 Z" fill="rgba(0,0,0,0.08)"/>

  <!-- ======== BRUSHED ALUMINUM FRONT PANEL — the signature sloping face ======== -->
  <rect x="70" y="36" width="200" height="312" rx="5" fill="url(#brushed-alum)"/>
  <!-- Subtle vertical brushed-metal texture lines -->
  <line x1="90" y1="40" x2="90" y2="344" stroke="rgba(255,255,255,0.018)" stroke-width="0.3"/>
  <line x1="115" y1="40" x2="115" y2="344" stroke="rgba(255,255,255,0.014)" stroke-width="0.3"/>
  <line x1="140" y1="40" x2="140" y2="344" stroke="rgba(255,255,255,0.018)" stroke-width="0.3"/>
  <line x1="170" y1="40" x2="170" y2="344" stroke="rgba(255,255,255,0.014)" stroke-width="0.3"/>
  <line x1="200" y1="40" x2="200" y2="344" stroke="rgba(255,255,255,0.018)" stroke-width="0.3"/>
  <line x1="225" y1="40" x2="225" y2="344" stroke="rgba(255,255,255,0.014)" stroke-width="0.3"/>
  <line x1="250" y1="40" x2="250" y2="344" stroke="rgba(255,255,255,0.018)" stroke-width="0.3"/>
  <!-- Top glossy reflection on aluminum -->
  <rect x="70" y="36" width="200" height="16" rx="5" fill="rgba(255,255,255,0.035)"/>
  <!-- Left edge highlight on aluminum panel -->
  <rect x="70" y="36" width="3" height="312" fill="rgba(255,255,255,0.035)"/>

  <!-- ======== 2.8" TFT TOUCHSCREEN DISPLAY ======== -->
  <!-- Display bezel -->
  <rect x="108" y="50" width="124" height="68" rx="5" fill="#0E0E0E" stroke="#444" stroke-width="0.5"/>
  <!-- Inner screen -->
  <rect x="113" y="54" width="114" height="60" rx="3" fill="#0A0A1E"/>
  <!-- Screen backlight glow -->
  <rect x="113" y="54" width="114" height="60" rx="3" fill="none" stroke="rgba(60,100,180,0.2)" stroke-width="1"/>
  <!-- Subtle screen reflection -->
  <path d="M113 54 L227 54 L227 62 Q170 66 113 62 Z" fill="rgba(255,255,255,0.04)"/>

  <!-- Drink icons on screen — 2x3 grid -->
  <!-- Row 1 -->
  <!-- Espresso -->
  <rect x="117" y="59" width="34" height="17" rx="2" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.4"/>
  <rect x="130" y="62" width="5" height="7" rx="1" fill="none" stroke="#D4A76A" stroke-width="0.8"/>
  <ellipse cx="132.5" cy="61.5" rx="3.5" ry="1" fill="rgba(200,160,90,0.5)"/>
  <text x="134" y="73.5" text-anchor="middle" font-size="2.6" fill="#9AACCC" font-family="sans-serif">Espresso</text>

  <!-- Coffee -->
  <rect x="154" y="59" width="34" height="17" rx="2" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.4"/>
  <rect x="165" y="61" width="7" height="8.5" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="0.8"/>
  <ellipse cx="168.5" cy="60.5" rx="4.5" ry="1" fill="rgba(200,160,90,0.5)"/>
  <text x="171" y="73.5" text-anchor="middle" font-size="2.6" fill="#9AACCC" font-family="sans-serif">Coffee</text>

  <!-- Cappuccino — highlighted/selected -->
  <rect x="191" y="59" width="34" height="17" rx="2" fill="#1A1A48" stroke="rgba(120,160,240,0.5)" stroke-width="0.6"/>
  <rect x="202" y="61" width="7" height="8.5" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="0.8"/>
  <ellipse cx="205.5" cy="66" rx="3.5" ry="1.8" fill="rgba(240,240,240,0.35)"/>
  <text x="208" y="73.5" text-anchor="middle" font-size="2.3" fill="#AABBDD" font-family="sans-serif">Cappuccino</text>

  <!-- Row 2 -->
  <!-- Latte macchiato -->
  <rect x="117" y="79" width="34" height="17" rx="2" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.4"/>
  <rect x="128" y="81" width="6" height="10.5" rx="1" fill="none" stroke="#D4A76A" stroke-width="0.7"/>
  <rect x="129" y="84" width="4" height="2.2" rx="0.4" fill="rgba(240,240,240,0.3)"/>
  <rect x="129" y="87.5" width="4" height="2.2" rx="0.4" fill="rgba(200,160,90,0.35)"/>
  <text x="134" y="93.5" text-anchor="middle" font-size="2.3" fill="#9AACCC" font-family="sans-serif">Latte macc.</text>

  <!-- Flat white -->
  <rect x="154" y="79" width="34" height="17" rx="2" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.4"/>
  <rect x="165" y="81.5" width="7" height="8" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="0.7"/>
  <ellipse cx="168.5" cy="86" rx="3.2" ry="1.4" fill="rgba(240,240,240,0.3)"/>
  <text x="171" y="93.5" text-anchor="middle" font-size="2.6" fill="#9AACCC" font-family="sans-serif">Flat white</text>

  <!-- Cortado -->
  <rect x="191" y="79" width="34" height="17" rx="2" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.4"/>
  <rect x="203" y="82" width="5" height="7" rx="1" fill="none" stroke="#D4A76A" stroke-width="0.7"/>
  <rect x="204" y="84" width="3" height="1.8" rx="0.4" fill="rgba(240,240,240,0.25)"/>
  <text x="208" y="93.5" text-anchor="middle" font-size="2.6" fill="#9AACCC" font-family="sans-serif">Cortado</text>

  <!-- ======== JURA LOGO — centered below display ======== -->
  <circle cx="170" cy="140" r="14" fill="#3E3E3E" stroke="#CCC" stroke-width="1.2"/>
  <circle cx="170" cy="140" r="12.5" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/>
  <text x="170" y="145" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#EEE" font-style="italic" font-weight="700">jura</text>

  <!-- ENA 8 model text -->
  <text x="170" y="166" text-anchor="middle" font-size="8" font-family="sans-serif" fill="#AAA" font-weight="400" letter-spacing="2">ENA 8</text>

  <!-- ======== PANEL SEAM LINES — visible separation between sections ======== -->
  <!-- Upper seam — between display/controls area and logo section -->
  <line x1="70" y1="128" x2="270" y2="128" stroke="#1E1E1E" stroke-width="0.6"/>
  <line x1="70" y1="128.8" x2="270" y2="128.8" stroke="rgba(255,255,255,0.025)" stroke-width="0.3"/>
  <!-- Main seam — between upper control panel and lower dispensing section -->
  <line x1="70" y1="180" x2="270" y2="180" stroke="#1A1A1A" stroke-width="1.2"/>
  <line x1="70" y1="181" x2="270" y2="181" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
  <!-- Body side seam — runs along the left and right edges of the front panel -->
  <line x1="58" y1="180" x2="70" y2="180" stroke="#1A1A1A" stroke-width="0.8"/>
  <line x1="270" y1="180" x2="282" y2="180" stroke="#1A1A1A" stroke-width="0.8"/>
  <!-- Lower seam — above the drip tray area -->
  <line x1="70" y1="348" x2="270" y2="348" stroke="#1E1E1E" stroke-width="0.6"/>
  <line x1="70" y1="348.8" x2="270" y2="348.8" stroke="rgba(255,255,255,0.025)" stroke-width="0.3"/>
  <!-- Vertical panel split lines — subtle side seams on body -->
  <line x1="70" y1="36" x2="70" y2="348" stroke="#1C1C1C" stroke-width="0.5"/>
  <line x1="270" y1="36" x2="270" y2="348" stroke="#1C1C1C" stroke-width="0.5"/>

  <!-- ======== GLOSSY BLACK DISPENSING AREA ======== -->
  <rect x="70" y="182" width="200" height="166" rx="4" fill="url(#gloss-black)"/>
  <!-- Dispensing niche — recessed dark cavity -->
  <rect x="98" y="196" width="144" height="135" rx="4" fill="#0D0D0D"/>
  <!-- Niche left wall subtle edge -->
  <rect x="98" y="196" width="3" height="135" fill="rgba(255,255,255,0.02)"/>
  <!-- Niche right wall shadow -->
  <rect x="239" y="196" width="3" height="135" fill="rgba(0,0,0,0.1)"/>
  <!-- Niche top shadow -->
  <rect x="98" y="196" width="144" height="5" fill="rgba(0,0,0,0.2)"/>
  <!-- Glossy reflection band on outer panel -->
  <path d="M70 182 L270 182 L270 197 Q170 205 70 197 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- ======== ILLUMINATED SPOUT — height-adjustable dual dispenser ======== -->
  <!-- Spout housing/slide rail -->
  <rect x="155" y="197" width="30" height="12" rx="3" fill="#444" stroke="#555" stroke-width="0.4"/>
  <!-- Height adjust tab -->
  <rect x="186" y="200" width="5" height="6" rx="1" fill="#333" stroke="#555" stroke-width="0.3"/>
  <!-- Main spout body -->
  <rect x="160" y="209" width="20" height="28" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlight strip on spout body -->
  <rect x="168" y="211" width="3" height="24" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Dual nozzles -->
  <rect x="163" y="237" width="4.5" height="24" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <rect x="172.5" y="237" width="4.5" height="24" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Spout spreader bar -->
  <rect x="162" y="248" width="16" height="2.5" rx="1" fill="#BBB"/>
  <!-- Nozzle openings -->
  <ellipse cx="165.3" cy="262" rx="2.5" ry="3" fill="#999"/>
  <ellipse cx="174.8" cy="262" rx="2.5" ry="3" fill="#999"/>
  <!-- Illumination glow under spout (warm amber — signature ENA 8 feature) -->
  <ellipse cx="170" cy="264" rx="18" ry="6" fill="rgba(210,140,50,0.12)"/>
  <ellipse cx="170" cy="266" rx="12" ry="4" fill="rgba(210,140,50,0.08)"/>
  <ellipse cx="170" cy="268" rx="6" ry="2" fill="rgba(220,160,60,0.06)"/>

  <!-- Cup platform area at bottom of niche -->
  <rect x="110" y="318" width="120" height="8" rx="2" fill="#161616" stroke="#222" stroke-width="0.3"/>
  <!-- Cup platform subtle highlight -->
  <rect x="120" y="318" width="100" height="2" rx="1" fill="rgba(255,255,255,0.015)"/>

  <!-- ======== MILK FROTHER ATTACHMENT — right side connector + tube ======== -->
  <!-- Connector housing on body edge -->
  <rect x="272" y="215" width="10" height="16" rx="2.5" fill="#363636" stroke="#5A5A5A" stroke-width="0.6"/>
  <!-- Chrome connector ring -->
  <rect x="282" y="217" width="14" height="12" rx="3.5" fill="#505050" stroke="#777" stroke-width="0.5"/>
  <!-- Connector highlight -->
  <rect x="283" y="218" width="12" height="3.5" rx="1.5" fill="rgba(255,255,255,0.08)"/>
  <!-- Connector chrome dot -->
  <circle cx="289" cy="223" r="2.5" fill="#666" stroke="#888" stroke-width="0.3"/>
  <!-- Silicone milk siphon tube going down to container -->
  <path d="M296 229 Q302 229 302 236 L302 285 Q302 294 295 294" stroke="#585858" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M296 229 Q302 229 302 236 L302 285 Q302 294 295 294" stroke="rgba(255,255,255,0.06)" stroke-width="0.6" fill="none"/>
  <!-- Tube end / milk pickup -->
  <circle cx="293" cy="294" r="3" fill="#4A4A4A" stroke="#666" stroke-width="0.4"/>
  <circle cx="293" cy="294" r="1.2" fill="#555"/>

  <!-- ======== DRIP TRAY — chrome plated ======== -->
  <path d="
    M54 368
    L54 386
    Q54 398 70 400
    L270 400
    Q286 398 286 386
    L286 368
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Black grate inset -->
  <rect x="66" y="373" width="208" height="18" rx="2" fill="#181818"/>
  <!-- Grate lines -->
  <line x1="82" y1="377" x2="82" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="105" y1="377" x2="105" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="128" y1="377" x2="128" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="151" y1="377" x2="151" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="174" y1="377" x2="174" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="197" y1="377" x2="197" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="220" y1="377" x2="220" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="243" y1="377" x2="243" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="266" y1="377" x2="266" y2="388" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Chrome trim line -->
  <line x1="60" y1="394" x2="280" y2="394" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M62 398 Q62 408 78 410 L262 410 Q278 408 278 398 Z" fill="#181818"/>
  <!-- Base chrome trim -->
  <line x1="72" y1="410" x2="268" y2="410" stroke="#888" stroke-width="0.3"/>

  <!-- ======== BEAN HOPPER LID — subtle on top ======== -->
  <ellipse cx="170" cy="23" rx="38" ry="4" fill="#262626" stroke="#3A3A3A" stroke-width="0.5"/>
  <ellipse cx="170" cy="22" rx="28" ry="2" fill="rgba(255,255,255,0.03)"/>
  <!-- Hopper lid handle/edge -->
  <rect x="162" y="18" width="16" height="4" rx="2" fill="#2E2E2E" stroke="#3A3A3A" stroke-width="0.3"/>
</svg>`,
  "Jura E8": `<svg width="380" height="460" viewBox="0 0 380 460">
  <defs>
    <!-- Dark Inox — dark metallic silver with subtle warm undertone -->
    <linearGradient id="dark-inox" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3E4044"/>
      <stop offset="15%" stop-color="#515458"/>
      <stop offset="35%" stop-color="#5C5F64"/>
      <stop offset="50%" stop-color="#585B60"/>
      <stop offset="70%" stop-color="#545760"/>
      <stop offset="85%" stop-color="#4A4D52"/>
      <stop offset="100%" stop-color="#3E4044"/>
    </linearGradient>
    <linearGradient id="dark-inox-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#565960"/>
      <stop offset="30%" stop-color="#4E5158"/>
      <stop offset="60%" stop-color="#454850"/>
      <stop offset="100%" stop-color="#3C3F46"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <!-- Screen glow gradient -->
    <linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="50%" stop-color="#16162A"/>
      <stop offset="100%" stop-color="#111128"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="190" cy="445" rx="140" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== 3-SECTION BODY ======== -->
  <!-- LEFT WING (shorter, starts lower, angled side, smooth chrome finish) -->
  <path d="
    M48 65
    Q38 65 34 69
    L26 380
    Q26 395 42 398
    L105 398
    L105 65
    Z
  " fill="url(#dark-inox)" stroke="#666" stroke-width="0.8"/>
  <!-- Left wing subtle edge highlight -->
  <path d="M48 65 L34 69 L26 380 L42 398 L105 398 L105 395 L40 395 Q30 392 30 378 L38 70 Q40 66 48 65 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- Vertical division line left -->
  <line x1="105" y1="65" x2="105" y2="398" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- CENTER SECTION (taller, extends higher) -->
  <path d="
    M105 28
    Q105 24 109 24
    L271 24
    Q275 24 275 28
    L275 398
    L105 398
    Z
  " fill="url(#dark-inox)" stroke="#666" stroke-width="0.8"/>
  <!-- Top highlight on center — metallic reflection -->
  <path d="M109 24 L271 24 Q275 24 275 28 L275 34 Q190 38 105 34 L105 28 Q105 24 109 24 Z" fill="rgba(255,255,255,0.06)"/>
  <!-- Left edge ambient light strip on center panel -->
  <path d="M105 28 L108 28 L108 398 L105 398 Z" fill="rgba(255,255,255,0.04)"/>

  <!-- RIGHT WING (shorter, starts lower, angled side) -->
  <path d="
    M275 65
    L275 398
    L338 398
    Q354 395 354 380
    L346 69
    Q344 65 332 65
    Z
  " fill="url(#dark-inox)" stroke="#666" stroke-width="0.8"/>
  <!-- Right wing edge highlight -->
  <path d="M332 65 Q340 66 342 70 L350 378 Q352 392 340 395 L275 395 L275 398 L338 398 Q354 395 354 380 L346 69 Q344 65 332 65 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Vertical division line right -->
  <line x1="275" y1="65" x2="275" y2="398" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- ======== 2.8" COLOR TOUCHSCREEN DISPLAY ======== -->
  <!-- Chrome bezel surround — premium E8 feature -->
  <rect x="114" y="33" width="152" height="76" rx="6" fill="url(#chrome)" stroke="#AAA" stroke-width="0.4"/>
  <!-- Dark inner frame -->
  <rect x="117" y="36" width="146" height="70" rx="4" fill="#1A1A1E" stroke="#444" stroke-width="0.3"/>

  <!-- Color touchscreen — 2.8" TFT, vibrant backlit display -->
  <rect x="126" y="42" width="128" height="52" rx="3" fill="#0A0A1E"/>
  <!-- Screen backlight glow effect -->
  <rect x="126" y="42" width="128" height="52" rx="3" fill="none" stroke="rgba(60,100,180,0.25)" stroke-width="1.2"/>
  <!-- Subtle screen reflection -->
  <path d="M126 42 L254 42 L254 50 Q190 55 126 50 Z" fill="rgba(255,255,255,0.04)" rx="3"/>

  <!-- Drink icons on screen — 2x3 grid of colorful selections -->
  <!-- Row 1 -->
  <!-- Espresso -->
  <rect x="131" y="47" width="36" height="20" rx="2.5" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.5"/>
  <rect x="144" y="52" width="6" height="8" rx="1" fill="none" stroke="#D4A76A" stroke-width="1"/>
  <ellipse cx="147" cy="51.5" rx="4.5" ry="1.2" fill="rgba(200,160,90,0.5)"/>
  <text x="149" y="63.5" text-anchor="middle" font-size="3.2" fill="#9AACCC" font-family="sans-serif">Espresso</text>

  <!-- Coffee -->
  <rect x="172" y="47" width="36" height="20" rx="2.5" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.5"/>
  <rect x="184" y="50" width="8" height="10" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="1"/>
  <ellipse cx="188" cy="49.5" rx="5.5" ry="1.4" fill="rgba(200,160,90,0.5)"/>
  <text x="190" y="63.5" text-anchor="middle" font-size="3.2" fill="#9AACCC" font-family="sans-serif">Coffee</text>

  <!-- Cappuccino — highlighted/selected -->
  <rect x="213" y="47" width="36" height="20" rx="2.5" fill="#1A1A48" stroke="rgba(120,160,240,0.5)" stroke-width="0.7"/>
  <rect x="225" y="50" width="8" height="10" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="1"/>
  <ellipse cx="229" cy="55" rx="4.5" ry="2.2" fill="rgba(240,240,240,0.35)"/>
  <text x="231" y="63.5" text-anchor="middle" font-size="2.8" fill="#AABBDD" font-family="sans-serif">Cappuccino</text>

  <!-- Row 2 -->
  <!-- Latte macchiato -->
  <rect x="131" y="71" width="36" height="20" rx="2.5" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.5"/>
  <rect x="142" y="73.5" width="7" height="12" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="0.8"/>
  <rect x="143" y="76.5" width="5" height="3" rx="0.5" fill="rgba(240,240,240,0.3)"/>
  <rect x="143" y="80.5" width="5" height="3" rx="0.5" fill="rgba(200,160,90,0.35)"/>
  <text x="149" y="88" text-anchor="middle" font-size="2.6" fill="#9AACCC" font-family="sans-serif">Latte macc.</text>

  <!-- Flat white -->
  <rect x="172" y="71" width="36" height="20" rx="2.5" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.5"/>
  <rect x="184" y="74" width="8" height="9.5" rx="1.5" fill="none" stroke="#D4A76A" stroke-width="0.8"/>
  <ellipse cx="188" cy="78.5" rx="4" ry="1.8" fill="rgba(240,240,240,0.3)"/>
  <text x="190" y="88" text-anchor="middle" font-size="2.8" fill="#9AACCC" font-family="sans-serif">Flat white</text>

  <!-- Milk foam -->
  <rect x="213" y="71" width="36" height="20" rx="2.5" fill="#14143A" stroke="rgba(90,130,210,0.4)" stroke-width="0.5"/>
  <rect x="225" y="74" width="8" height="9.5" rx="1.5" fill="none" stroke="#BBBBD8" stroke-width="0.8"/>
  <ellipse cx="229" cy="78.5" rx="4" ry="2.2" fill="rgba(240,240,240,0.4)"/>
  <text x="231" y="88" text-anchor="middle" font-size="2.8" fill="#9AACCC" font-family="sans-serif">Milk foam</text>

  <!-- ======== 6 OPERATING BUTTONS — 3 per side, outside chrome bezel ======== -->
  <!-- Left side buttons — illuminated touch-sensitive with icons -->
  <!-- Button 1: Power/standby -->
  <circle cx="111" cy="48" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <circle cx="111" cy="48" r="2.8" fill="none" stroke="#AAA" stroke-width="0.7"/>
  <path d="M111 45.5 L111 47.5" stroke="#AAA" stroke-width="0.7"/>

  <!-- Button 2: Scroll up -->
  <circle cx="111" cy="62" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <path d="M108 63.5 L111 60 L114 63.5" fill="none" stroke="#AAA" stroke-width="0.8"/>

  <!-- Button 3: Select/confirm -->
  <circle cx="111" cy="76" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <circle cx="111" cy="76" r="2" fill="#999"/>

  <!-- Right side buttons — illuminated touch-sensitive with icons -->
  <!-- Button 4: Back/menu -->
  <circle cx="269" cy="48" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <path d="M267 46 L271 46 L271 50 L267 50 Z" fill="none" stroke="#AAA" stroke-width="0.6"/>
  <path d="M267 47.5 L265.5 48 L267 48.5" fill="#AAA"/>

  <!-- Button 5: Scroll down -->
  <circle cx="269" cy="62" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <path d="M266 60.5 L269 64 L272 60.5" fill="none" stroke="#AAA" stroke-width="0.8"/>

  <!-- Button 6: Maintenance/settings -->
  <circle cx="269" cy="76" r="4.5" fill="#2A2A30" stroke="#777" stroke-width="0.6"/>
  <circle cx="269" cy="76" r="2.5" fill="none" stroke="#AAA" stroke-width="0.6"/>
  <circle cx="269" cy="76" r="1" fill="#AAA"/>

  <!-- ======== ROTARY DIAL — in right wing, chrome surround ======== -->
  <!-- Chrome outer ring -->
  <circle cx="314" cy="82" r="19" fill="url(#chrome)" stroke="#999" stroke-width="0.5"/>
  <!-- Dark inner disc -->
  <circle cx="314" cy="82" r="15" fill="#2A2A2E" stroke="#555" stroke-width="0.5"/>
  <!-- Inner knob -->
  <circle cx="314" cy="82" r="10" fill="#333338"/>
  <!-- Center dot -->
  <circle cx="314" cy="82" r="3" fill="#3C3C42"/>
  <!-- Detent marks on chrome ring -->
  <circle cx="314" cy="82" r="17" fill="none" stroke="#888" stroke-width="0.5" stroke-dasharray="1.5,2.5"/>
  <!-- Arrow indicator above dial -->
  <path d="M302 64 Q314 56 326 64" fill="none" stroke="#888" stroke-width="1"/>
  <line x1="314" y1="58" x2="314" y2="62" stroke="#888" stroke-width="1"/>

  <!-- ======== JURA LOGO PANEL — chrome accent panel, centered ======== -->
  <rect x="155" y="116" width="70" height="62" rx="4" fill="url(#chrome-v)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Subtle glossy reflection on chrome panel -->
  <rect x="157" y="118" width="66" height="22" rx="3" fill="rgba(255,255,255,0.08)"/>
  <!-- Jura logo circle -->
  <circle cx="190" cy="138" r="14" fill="#222" stroke="#DDD" stroke-width="1.2"/>
  <circle cx="190" cy="138" r="12.5" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.3"/>
  <text x="190" y="143" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#EEE" font-style="italic" font-weight="700">jura</text>
  <!-- E 8 model text -->
  <text x="190" y="170" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#777" font-weight="500" letter-spacing="3">E 8</text>

  <!-- ======== PANEL SEAM LINE — horizontal division ======== -->
  <line x1="72" y1="182" x2="308" y2="182" stroke="#3A3A40" stroke-width="1.5"/>
  <line x1="72" y1="183" x2="308" y2="183" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>

  <!-- ======== BLACK GLOSSY DISPENSING AREA ======== -->
  <rect x="72" y="184" width="236" height="168" rx="5" fill="url(#gloss-black)"/>
  <!-- Dispensing niche recessed area — darker inner cavity -->
  <rect x="110" y="197" width="160" height="138" rx="4" fill="#0D0D0D"/>
  <!-- Niche left wall shadow -->
  <rect x="110" y="197" width="4" height="138" fill="rgba(255,255,255,0.02)"/>
  <!-- Niche right wall shadow -->
  <rect x="266" y="197" width="4" height="138" fill="rgba(0,0,0,0.1)"/>
  <!-- Niche top shadow -->
  <rect x="110" y="197" width="160" height="6" fill="rgba(0,0,0,0.2)"/>
  <!-- Glossy reflection band on outer panel -->
  <path d="M72 184 L308 184 L308 200 Q190 208 72 200 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Subtle vertical reflection -->
  <path d="M78 282 L95 184 L102 184 L85 282 Z" fill="rgba(255,255,255,0.01)"/>

  <!-- ======== SPOUT — adjustable height HP3 coffee + milk dispenser ======== -->
  <!-- Spout housing/slide rail -->
  <rect x="172" y="198" width="36" height="14" rx="3" fill="#555" stroke="#666" stroke-width="0.4"/>
  <!-- Height adjust tab on right -->
  <rect x="209" y="201" width="6" height="8" rx="1.5" fill="#444" stroke="#666" stroke-width="0.3"/>
  <!-- Main spout body — compact HP3 unit -->
  <rect x="178" y="212" width="24" height="30" rx="2.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlight strip on spout body -->
  <rect x="188" y="214" width="3" height="26" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Dual coffee nozzle tubes — two separate parallel spouts -->
  <rect x="180" y="242" width="7" height="28" rx="3" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <rect x="193" y="242" width="7" height="28" rx="3" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlights on each nozzle tube -->
  <rect x="182.5" y="244" width="2" height="24" rx="1" fill="rgba(255,255,255,0.15)"/>
  <rect x="195.5" y="244" width="2" height="24" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Spout spreader bar connecting the two nozzles -->
  <rect x="179" y="252" width="22" height="3" rx="1" fill="#BBB" stroke="#999" stroke-width="0.2"/>
  <!-- Nozzle tip flanges — flared ends on each tube -->
  <ellipse cx="183.5" cy="270" rx="4.2" ry="2.2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <ellipse cx="196.5" cy="270" rx="4.2" ry="2.2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Nozzle openings — dark holes at each tip -->
  <ellipse cx="183.5" cy="271" rx="2.8" ry="1.5" fill="#444"/>
  <ellipse cx="196.5" cy="271" rx="2.8" ry="1.5" fill="#444"/>

  <!-- ======== MILK / CAPPUCCINO SPOUT — chrome tube, right side ======== -->
  <defs>
    <linearGradient id="milk-tube-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="20%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#E2E2E2"/>
      <stop offset="55%" stop-color="#F0F0F0"/>
      <stop offset="70%" stop-color="#D8D8D8"/>
      <stop offset="85%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#909090"/>
    </linearGradient>
    <linearGradient id="milk-knob-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="30%" stop-color="#BBB"/>
      <stop offset="50%" stop-color="#D0D0D0"/>
      <stop offset="70%" stop-color="#B8B8B8"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>

  <!-- Mounting bracket at top — where tube connects to machine body -->
  <rect x="282" y="116" width="18" height="10" rx="2" fill="url(#milk-knob-chrome)" stroke="#AAA" stroke-width="0.4"/>
  <rect x="284" y="118" width="14" height="6" rx="1.5" fill="rgba(255,255,255,0.08)"/>

  <!-- Main chrome vertical tube — slight curve via path -->
  <path d="
    M288 126
    Q287 160 286 200
    Q285.8 220 285.5 245
  " fill="none" stroke="url(#milk-tube-chrome)" stroke-width="10" stroke-linecap="round"/>
  <!-- Chrome highlight stripe running down the tube -->
  <path d="
    M291 126
    Q290 160 289 200
    Q288.8 220 288.5 245
  " fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Dark edge on left side of tube for depth -->
  <path d="
    M284 126
    Q283 160 282 200
    Q281.8 220 281.5 245
  " fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Adjustment knob near top of tube -->
  <ellipse cx="296" cy="148" rx="6" ry="5.5" fill="url(#milk-knob-chrome)" stroke="#AAA" stroke-width="0.4"/>
  <ellipse cx="296" cy="148" rx="4" ry="3.8" fill="#3A3A40" stroke="#666" stroke-width="0.3"/>
  <!-- Knob grip ridges -->
  <line x1="293" y1="146" x2="293" y2="150" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
  <line x1="295" y1="145.5" x2="295" y2="150.5" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
  <line x1="297" y1="145.5" x2="297" y2="150.5" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
  <line x1="299" y1="146" x2="299" y2="150" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
  <!-- Knob indicator dot -->
  <circle cx="296" cy="148" r="1" fill="#555"/>

  <!-- Nozzle tip at bottom — flared dispensing end -->
  <ellipse cx="285.5" cy="245" rx="6.5" ry="3" fill="url(#milk-tube-chrome)" stroke="#AAA" stroke-width="0.3"/>
  <ellipse cx="285.5" cy="247" rx="5" ry="2" fill="#888" stroke="#777" stroke-width="0.3"/>
  <!-- Nozzle opening -->
  <ellipse cx="285.5" cy="248" rx="3" ry="1.2" fill="#555"/>

  <!-- ======== DRIP TRAY ======== -->
  <!-- Chrome tray surround -->
  <path d="
    M30 380
    L30 400
    Q30 418 55 420
    L325 420
    Q350 418 350 400
    L350 380
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Black grate inset -->
  <rect x="50" y="385" width="280" height="22" rx="3" fill="#181818"/>
  <!-- Grate lines -->
  <line x1="75" y1="390" x2="75" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="105" y1="390" x2="105" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="135" y1="390" x2="135" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="165" y1="390" x2="165" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="195" y1="390" x2="195" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="225" y1="390" x2="225" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="255" y1="390" x2="255" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="285" y1="390" x2="285" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="315" y1="390" x2="315" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Chrome trim line on drip tray -->
  <line x1="40" y1="411" x2="340" y2="411" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M42 418 Q42 432 68 434 L312 434 Q338 432 338 418 Z" fill="#1E1E22"/>
  <!-- Base chrome trim -->
  <line x1="60" y1="434" x2="320" y2="434" stroke="#888" stroke-width="0.3"/>
</svg>`,
  "Jura J8": `<svg width="390" height="460" viewBox="0 0 390 460">
  <defs>
    <!-- Midnight Silver body gradient — dark gunmetal, not bright silver -->
    <linearGradient id="midnight-silver" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4A4A52"/>
      <stop offset="15%" stop-color="#5C5C66"/>
      <stop offset="40%" stop-color="#686874"/>
      <stop offset="60%" stop-color="#646470"/>
      <stop offset="85%" stop-color="#56565E"/>
      <stop offset="100%" stop-color="#4A4A52"/>
    </linearGradient>
    <linearGradient id="midnight-silver-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#626270"/>
      <stop offset="30%" stop-color="#5A5A66"/>
      <stop offset="60%" stop-color="#525260"/>
      <stop offset="100%" stop-color="#4A4A55"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <!-- Bright chrome gradient for prominent milk spout -->
    <linearGradient id="milk-spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A8"/>
      <stop offset="15%" stop-color="#C8C8D0"/>
      <stop offset="40%" stop-color="#E8E8EE"/>
      <stop offset="55%" stop-color="#F0F0F4"/>
      <stop offset="70%" stop-color="#D8D8E0"/>
      <stop offset="90%" stop-color="#B0B0B8"/>
      <stop offset="100%" stop-color="#9898A0"/>
    </linearGradient>
    <linearGradient id="milk-spout-chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D0D0D8"/>
      <stop offset="30%" stop-color="#E0E0E8"/>
      <stop offset="60%" stop-color="#D8D8E0"/>
      <stop offset="100%" stop-color="#B8B8C0"/>
    </linearGradient>
    <!-- Screen glow for touchscreen -->
    <linearGradient id="screen-glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A2E"/>
      <stop offset="50%" stop-color="#16213E"/>
      <stop offset="100%" stop-color="#1A1A2E"/>
    </linearGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="195" cy="445" rx="145" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== BEAN HOPPER (top of machine) ======== -->
  <!-- Hopper lid — dark tinted plastic, slightly recessed on top of center -->
  <rect x="140" y="18" width="114" height="8" rx="3" fill="#3A3A42" stroke="#4A4A52" stroke-width="0.4"/>
  <!-- Hopper lid handle ridge -->
  <rect x="175" y="19" width="44" height="3" rx="1.5" fill="#484850"/>
  <line x1="185" y1="20.5" x2="209" y2="20.5" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>

  <!-- ======== 3-SECTION BODY — Midnight Silver ======== -->
  <!-- LEFT WING (shorter, starts lower, angled side) -->
  <path d="
    M52 68
    Q42 68 38 72
    L30 380
    Q30 395 46 398
    L110 398
    L110 68
    Z
  " fill="url(#midnight-silver)" stroke="#777" stroke-width="0.5"/>
  <!-- Left wing subtle edge highlight -->
  <path d="M52 68 L38 72 L30 380 L46 398 L110 398 L110 395 L44 395 Q34 392 34 378 L42 73 Q44 69 52 68 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- Vertical division line left -->
  <line x1="110" y1="68" x2="110" y2="398" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- CENTER SECTION (taller, extends higher) -->
  <path d="
    M110 28
    Q110 24 114 24
    L280 24
    Q284 24 284 28
    L284 398
    L110 398
    Z
  " fill="url(#midnight-silver)" stroke="#777" stroke-width="0.5"/>
  <!-- Top highlight on center — glossy reflection -->
  <path d="M114 24 L280 24 Q284 24 284 28 L284 34 Q197 38 110 34 L110 28 Q110 24 114 24 Z" fill="rgba(255,255,255,0.06)"/>
  <!-- Left edge ambient light strip on center panel -->
  <path d="M110 28 L113 28 L113 398 L110 398 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- RIGHT WING (shorter, starts lower, angled side — NO rotary dial on J8) -->
  <path d="
    M284 68
    L284 398
    L348 398
    Q364 395 364 380
    L356 72
    Q354 68 342 68
    Z
  " fill="url(#midnight-silver)" stroke="#777" stroke-width="0.5"/>
  <!-- Right wing edge highlight -->
  <path d="M342 68 Q350 69 352 73 L360 378 Q362 392 350 395 L284 395 L284 398 L348 398 Q364 395 364 380 L356 72 Q354 68 342 68 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Vertical division line right -->
  <line x1="284" y1="68" x2="284" y2="398" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

  <!-- ======== 4.3" COLOR TOUCHSCREEN — large, centered in center section ======== -->
  <!-- Outer bezel — recessed dark frame -->
  <rect x="120" y="34" width="154" height="82" rx="5" fill="#111" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Inner screen bezel -->
  <rect x="125" y="38" width="144" height="74" rx="4" fill="#0A0A0A"/>
  <!-- Active screen area with subtle blue-tinted glow -->
  <rect x="129" y="42" width="136" height="66" rx="3" fill="url(#screen-glow)"/>

  <!-- Touchscreen drink grid — 2x3 layout showing specialty selection -->
  <!-- Row 1 -->
  <rect x="133" y="46" width="40" height="18" rx="2" fill="#222838" stroke="#3A4058" stroke-width="0.3"/>
  <text x="138" y="54" font-size="3.5" fill="#8899BB" font-family="sans-serif">Espresso</text>
  <rect x="138" y="56" width="8" height="5" rx="1" fill="none" stroke="#AA8855" stroke-width="0.4"/>

  <rect x="177" y="46" width="40" height="18" rx="2" fill="#222838" stroke="#3A4058" stroke-width="0.3"/>
  <text x="182" y="54" font-size="3.2" fill="#8899BB" font-family="sans-serif">Cappuccino</text>
  <rect x="198" y="56" width="8" height="5" rx="1" fill="none" stroke="#AA8855" stroke-width="0.4"/>

  <rect x="221" y="46" width="40" height="18" rx="2" fill="#222838" stroke="#3A4058" stroke-width="0.3"/>
  <text x="226" y="54" font-size="3.2" fill="#8899BB" font-family="sans-serif">Flat White</text>
  <rect x="242" y="56" width="8" height="5" rx="1" fill="none" stroke="#AA8855" stroke-width="0.4"/>

  <!-- Row 2 -->
  <rect x="133" y="68" width="40" height="18" rx="2" fill="#222838" stroke="#3A4058" stroke-width="0.3"/>
  <text x="138" y="76" font-size="3.5" fill="#8899BB" font-family="sans-serif">Latte</text>
  <rect x="138" y="78" width="8" height="5" rx="1" fill="none" stroke="#AA8855" stroke-width="0.4"/>

  <rect x="177" y="68" width="40" height="18" rx="2" fill="#253020" stroke="#3A5030" stroke-width="0.3"/>
  <text x="180" y="76" font-size="3" fill="#88AA77" font-family="sans-serif">Sweet Foam</text>
  <rect x="198" y="78" width="8" height="5" rx="1" fill="none" stroke="#77AA55" stroke-width="0.4"/>

  <rect x="221" y="68" width="40" height="18" rx="2" fill="#222838" stroke="#3A4058" stroke-width="0.3"/>
  <text x="226" y="76" font-size="3.5" fill="#8899BB" font-family="sans-serif">Ristretto</text>
  <rect x="242" y="78" width="8" height="5" rx="1" fill="none" stroke="#AA8855" stroke-width="0.4"/>

  <!-- Navigation dots at bottom of screen -->
  <circle cx="185" cy="102" r="1.5" fill="#556688"/>
  <circle cx="192" cy="102" r="1.5" fill="#334466"/>
  <circle cx="199" cy="102" r="1.5" fill="#334466"/>
  <circle cx="206" cy="102" r="1.5" fill="#334466"/>

  <!-- Screen edge highlight — premium glass look -->
  <rect x="129" y="42" width="136" height="2" rx="1" fill="rgba(255,255,255,0.06)"/>

  <!-- ======== RIGHT WING — smooth panel with power button and Wi-Fi indicator ======== -->
  <!-- Subtle power button on right wing -->
  <circle cx="320" cy="82" r="6" fill="#3A3A42" stroke="#555" stroke-width="0.5"/>
  <circle cx="320" cy="82" r="4.5" fill="none" stroke="#666" stroke-width="0.6"/>
  <path d="M320 78" stroke="#666" stroke-width="0.7"/>
  <circle cx="320" cy="82" r="4.5" fill="none" stroke="#666" stroke-width="0.6"/>
  <path d="M320 77.5 L320 80" stroke="#777" stroke-width="0.8"/>
  <!-- Wi-Fi indicator below power button -->
  <path d="M312 100 Q320 94 328 100" fill="none" stroke="#4A4A52" stroke-width="0.6"/>
  <path d="M315 98 Q320 95 325 98" fill="none" stroke="#4A4A52" stroke-width="0.6"/>
  <circle cx="320" cy="100" r="0.8" fill="#4A4A52"/>

  <!-- ======== JURA LOGO PANEL — centered below screen ======== -->
  <rect x="162" y="124" width="70" height="54" rx="4" fill="#3E3E46" stroke="#555" stroke-width="0.5"/>
  <!-- Subtle glossy reflection on logo panel -->
  <rect x="164" y="126" width="66" height="18" rx="3" fill="rgba(255,255,255,0.02)"/>
  <!-- Jura logo circle — signature branding -->
  <circle cx="197" cy="142" r="14" fill="#2A2A30" stroke="#BBB" stroke-width="1.2"/>
  <circle cx="197" cy="142" r="12.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.3"/>
  <text x="197" y="147" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#DDD" font-style="italic" font-weight="700">jura</text>
  <!-- J 8 model text -->
  <text x="197" y="170" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#999" font-weight="500" letter-spacing="3">J 8</text>

  <!-- ======== PANEL SEAM LINE — horizontal division ======== -->
  <line x1="76" y1="182" x2="318" y2="182" stroke="#3A3A42" stroke-width="1.5"/>
  <line x1="76" y1="183" x2="318" y2="183" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>

  <!-- ======== BLACK GLOSSY DISPENSING AREA ======== -->
  <rect x="76" y="184" width="242" height="170" rx="5" fill="url(#gloss-black)"/>
  <!-- Dispensing niche recessed area — darker inner cavity -->
  <rect x="114" y="197" width="166" height="140" rx="4" fill="#0D0D0D"/>
  <!-- Niche left wall shadow -->
  <rect x="114" y="197" width="4" height="140" fill="rgba(255,255,255,0.02)"/>
  <!-- Niche right wall shadow -->
  <rect x="276" y="197" width="4" height="140" fill="rgba(0,0,0,0.1)"/>
  <!-- Niche top shadow -->
  <rect x="114" y="197" width="166" height="6" fill="rgba(0,0,0,0.2)"/>
  <!-- Glossy reflection band on outer panel -->
  <path d="M76 184 L318 184 L318 200 Q197 208 76 200 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Subtle vertical reflection -->
  <path d="M82 280 L99 184 L106 184 L89 280 Z" fill="rgba(255,255,255,0.01)"/>

  <!-- ======== SPOUT HOUSING RAIL — shared top rail across dispensing niche ======== -->
  <rect x="145" y="198" width="104" height="12" rx="3" fill="#444" stroke="#555" stroke-width="0.4"/>
  <!-- Housing rail chrome accent line -->
  <line x1="150" y1="204" x2="244" y2="204" stroke="#555" stroke-width="0.3"/>
  <!-- Height adjust tab on right end of rail -->
  <rect x="241" y="201" width="5" height="6" rx="1" fill="#333" stroke="#555" stroke-width="0.3"/>

  <!-- ======== COFFEE SPOUT — dual chrome nozzles, centered in niche ======== -->
  <!-- Main spout body — centered at roughly x=190 -->
  <rect x="182" y="210" width="16" height="30" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlight strip on spout body -->
  <rect x="188" y="212" width="3" height="26" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Dual coffee nozzles -->
  <rect x="184" y="240" width="4" height="26" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <rect x="192" y="240" width="4" height="26" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Spout spreader bar connecting the two nozzles -->
  <rect x="183" y="252" width="14" height="3" rx="1" fill="#BBB"/>
  <!-- Nozzle openings -->
  <ellipse cx="186" cy="267" rx="2.5" ry="3" fill="#999"/>
  <ellipse cx="194" cy="267" rx="2.5" ry="3" fill="#999"/>

  <!-- ======== MILK SPOUT — OUTSIDE the black niche, on the silver body panel to the RIGHT ======== -->
  <!-- Positioned on the silver body panel between the niche right edge and the body right edge -->
  <!-- Mounting bracket on silver panel -->
  <rect x="288" y="196" width="18" height="8" rx="2" fill="url(#milk-spout-chrome)" stroke="#999" stroke-width="0.4"/>
  <!-- Adjustment knob -->
  <circle cx="297" cy="210" r="7" fill="url(#milk-spout-chrome)" stroke="#BBB" stroke-width="0.5"/>
  <circle cx="297" cy="210" r="4.5" fill="#505058" stroke="#999" stroke-width="0.4"/>
  <circle cx="297" cy="207" r="0.8" fill="#CCC"/>
  <!-- Milk spout tube — shorter than coffee nozzles, chrome -->
  <rect x="291" y="216" width="12" height="60" rx="3" fill="url(#milk-spout-chrome)" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Chrome highlight -->
  <rect x="296" y="218" width="3" height="56" rx="1" fill="rgba(255,255,255,0.18)"/>
  <!-- Left shadow -->
  <rect x="291" y="218" width="2" height="56" rx="1" fill="rgba(0,0,0,0.08)"/>
  <!-- Chrome band -->
  <rect x="292" y="240" width="10" height="2.5" rx="1" fill="#D8D8E0" stroke="#BBB" stroke-width="0.3"/>
  <!-- Nozzle tip -->
  <ellipse cx="297" cy="278" rx="7" ry="3" fill="url(#milk-spout-chrome)" stroke="#BBB" stroke-width="0.3"/>
  <ellipse cx="297" cy="279" rx="3" ry="2" fill="#888"/>


  <!-- ======== COFFEE EYE CUP SENSOR — integrated into left niche wall ======== -->
  <circle cx="122" cy="220" r="3.5" fill="#181818" stroke="#333" stroke-width="0.5"/>
  <circle cx="122" cy="220" r="2" fill="#222"/>
  <circle cx="122" cy="220" r="1" fill="#3A4455"/>
  <!-- Sensor subtle glow -->
  <circle cx="122" cy="220" r="4" fill="none" stroke="rgba(100,120,160,0.15)" stroke-width="0.5"/>

  <!-- ======== CUP ILLUMINATION — warm amber LEDs on sides of niche ======== -->
  <rect x="116" y="300" width="3" height="14" rx="1" fill="#3D2E18"/>
  <rect x="116.5" y="302" width="2" height="10" rx="0.5" fill="#5A4020" opacity="0.9"/>
  <rect x="275" y="300" width="3" height="14" rx="1" fill="#3D2E18"/>
  <rect x="275.5" y="302" width="2" height="10" rx="0.5" fill="#5A4020" opacity="0.9"/>
  <!-- Warm light glow on niche floor -->
  <ellipse cx="197" cy="332" rx="40" ry="4" fill="rgba(80,60,20,0.08)"/>

  <!-- ======== CUP PLATFORM — subtle shelf at bottom of niche ======== -->
  <rect x="118" y="326" width="158" height="8" rx="2" fill="#161616" stroke="#252525" stroke-width="0.3"/>
  <line x1="122" y1="330" x2="272" y2="330" stroke="#222" stroke-width="0.3"/>

  <!-- ======== DRIP TRAY ======== -->
  <!-- Chrome tray surround -->
  <path d="
    M34 380
    L34 400
    Q34 418 59 420
    L335 420
    Q360 418 360 400
    L360 380
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Black grate inset -->
  <rect x="54" y="385" width="286" height="22" rx="3" fill="#181818"/>
  <!-- Grate lines -->
  <line x1="79" y1="390" x2="79" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="109" y1="390" x2="109" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="139" y1="390" x2="139" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="169" y1="390" x2="169" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="199" y1="390" x2="199" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="229" y1="390" x2="229" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="259" y1="390" x2="259" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="289" y1="390" x2="289" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <line x1="319" y1="390" x2="319" y2="403" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Chrome trim line on drip tray -->
  <line x1="44" y1="411" x2="350" y2="411" stroke="#C0C0C0" stroke-width="0.5"/>
  <!-- Black base -->
  <path d="M46 418 Q46 432 72 434 L322 434 Q348 432 348 418 Z" fill="#181818"/>
  <!-- Base chrome trim -->
  <line x1="64" y1="434" x2="330" y2="434" stroke="#888" stroke-width="0.3"/>
</svg>`,
  "Jura S8": `<svg width="400" height="480" viewBox="0 0 400 480">
  <defs>
    <!-- Moonlight Silver gradient for wings -->
    <linearGradient id="silver-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#C8C8C8"/>
      <stop offset="15%" stop-color="#DCDCDC"/>
      <stop offset="40%" stop-color="#E8E8E8"/>
      <stop offset="60%" stop-color="#E4E4E4"/>
      <stop offset="85%" stop-color="#D8D8D8"/>
      <stop offset="100%" stop-color="#C4C4C4"/>
    </linearGradient>
    <!-- Chrome accent gradient -->
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="25%" stop-color="#CDCDCD"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="75%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <!-- Chrome vertical gradient for spouts -->
    <linearGradient id="chrome-v" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="20%" stop-color="#C0C0C0"/>
      <stop offset="45%" stop-color="#DDD"/>
      <stop offset="55%" stop-color="#D8D8D8"/>
      <stop offset="80%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
    <!-- Glossy black panel -->
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="15%" stop-color="#1E1E1E"/>
      <stop offset="50%" stop-color="#141414"/>
      <stop offset="85%" stop-color="#181818"/>
      <stop offset="100%" stop-color="#1C1C1C"/>
    </linearGradient>
    <!-- Screen gradient -->
    <linearGradient id="screen-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1A1A"/>
      <stop offset="100%" stop-color="#111"/>
    </linearGradient>
    <!-- Drip tray gradient -->
    <linearGradient id="tray-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#333"/>
      <stop offset="50%" stop-color="#222"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <!-- Milk frother chrome -->
    <linearGradient id="frother-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#AAA"/>
      <stop offset="30%" stop-color="#D5D5D5"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#AAA"/>
    </linearGradient>
  </defs>

  <!-- ======== SHADOW ======== -->
  <ellipse cx="200" cy="462" rx="155" ry="11" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== LEFT SILVER WING ======== -->
  <path d="
    M52 30
    Q40 30 36 36
    L28 388
    Q28 402 48 406
    L110 406
    L110 30
    Z
  " fill="url(#silver-body)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Left wing subtle edge shadow -->
  <path d="M52 30 Q42 30 38 36 L30 388 Q30 400 48 404 L56 404 Q36 400 36 388 L44 36 Q46 32 52 30 Z" fill="rgba(0,0,0,0.04)"/>

  <!-- ======== RIGHT SILVER WING ======== -->
  <path d="
    M290 30
    L290 406
    L352 406
    Q372 402 372 388
    L364 36
    Q360 30 348 30
    Z
  " fill="url(#silver-body)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Right wing subtle edge highlight -->
  <path d="M348 30 Q356 32 358 36 L366 388 Q366 400 352 404 L344 404 Q364 400 364 388 L356 36 Q354 32 348 30 Z" fill="rgba(255,255,255,0.05)"/>

  <!-- ======== CENTER BLACK PANEL ======== -->
  <path d="
    M110 28
    Q110 24 114 24
    L286 24
    Q290 24 290 28
    L290 406
    L110 406
    Z
  " fill="url(#gloss-black)"/>
  <!-- Subtle gloss reflection on center panel -->
  <path d="M110 28 Q110 24 114 24 L286 24 Q290 24 290 28 L290 50 Q200 58 110 50 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- Division lines between wings and center -->
  <line x1="110" y1="30" x2="110" y2="406" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
  <line x1="290" y1="30" x2="290" y2="406" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>

  <!-- ======== 4.3" TOUCHSCREEN ======== -->
  <!-- Screen bezel -->
  <rect x="120" y="36" width="160" height="118" rx="5" fill="#0D0D0D" stroke="#2A2A2A" stroke-width="0.5"/>
  <!-- Screen inner -->
  <rect x="126" y="42" width="148" height="106" rx="3" fill="url(#screen-bg)"/>

  <!-- Top status bar -->
  <text x="134" y="52" font-size="4" fill="#888" font-family="sans-serif" font-weight="600">P</text>
  <!-- Status bar indicators -->
  <rect x="148" y="47" width="2" height="6" rx="0.5" fill="#555"/>
  <rect x="156" y="47" width="30" height="6" rx="1" fill="#333" stroke="#444" stroke-width="0.3"/>
  <rect x="156" y="47" width="18" height="6" rx="1" fill="#4488CC"/>
  <rect x="192" y="47" width="2" height="6" rx="0.5" fill="#555"/>
  <!-- WiFi icon (simplified) -->
  <path d="M248 47 Q252 44 256 47" stroke="#666" stroke-width="0.6" fill="none"/>
  <path d="M250 49 Q252 47 254 49" stroke="#666" stroke-width="0.6" fill="none"/>
  <circle cx="252" cy="51" r="0.8" fill="#666"/>
  <!-- Settings icon -->
  <rect x="262" y="47" width="6" height="6" rx="1" fill="none" stroke="#555" stroke-width="0.5"/>

  <!-- Drink grid — 2 rows x 4 columns (refined icons) -->
  <!-- Row 1: Espresso -->
  <rect x="130" y="58" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="147" y="80" text-anchor="middle" font-size="3.4" fill="#AAA" font-family="sans-serif">Espresso</text>
  <!-- Cup icon -->
  <path d="M140 63 L140 70 Q140 72 142 72 L148 72 Q150 72 150 70 L150 63 Z" fill="none" stroke="#BB9966" stroke-width="0.5"/>
  <path d="M150 65 Q153 65 153 68 Q153 71 150 71" fill="none" stroke="#BB9966" stroke-width="0.4"/>

  <!-- Kaffee -->
  <rect x="166" y="58" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="183" y="80" text-anchor="middle" font-size="3.4" fill="#AAA" font-family="sans-serif">Kaffee</text>
  <path d="M176 63 L176 71 Q176 73 178 73 L184 73 Q186 73 186 71 L186 63 Z" fill="none" stroke="#BB9966" stroke-width="0.5"/>
  <path d="M186 65 Q189 65 189 68 Q189 71 186 71" fill="none" stroke="#BB9966" stroke-width="0.4"/>

  <!-- 2x Kaffee -->
  <rect x="202" y="58" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="219" y="80" text-anchor="middle" font-size="3.4" fill="#AAA" font-family="sans-serif">2x Kaffee</text>
  <path d="M210 63 L210 70 Q210 72 212 72 L216 72 Q218 72 218 70 L218 63 Z" fill="none" stroke="#BB9966" stroke-width="0.5"/>
  <path d="M220 63 L220 70 Q220 72 222 72 L226 72 Q228 72 228 70 L228 63 Z" fill="none" stroke="#BB9966" stroke-width="0.5"/>

  <!-- Heisswasser -->
  <rect x="238" y="58" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="255" y="80" text-anchor="middle" font-size="2.8" fill="#AAA" font-family="sans-serif">Heisswasser</text>
  <path d="M250 63 L250 70 Q250 72 252 72 L256 72 Q258 72 258 70 L258 63 Z" fill="none" stroke="#6699CC" stroke-width="0.5"/>
  <path d="M252 60 Q253 58 254 60" stroke="#6699CC" stroke-width="0.3" fill="none"/>

  <!-- Row 2: Cappuccino -->
  <rect x="130" y="88" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="147" y="110" text-anchor="middle" font-size="2.8" fill="#AAA" font-family="sans-serif">Cappuccino</text>
  <path d="M140 93 L140 100 Q140 102 142 102 L148 102 Q150 102 150 100 L150 93 Z" fill="none" stroke="#DDBB88" stroke-width="0.5"/>
  <path d="M140 96 L150 96" stroke="#EECC99" stroke-width="0.3"/>

  <!-- Latte Macchiato -->
  <rect x="166" y="88" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="183" y="110" text-anchor="middle" font-size="2.5" fill="#AAA" font-family="sans-serif">Latte Macch.</text>
  <path d="M177 91 L177 102 Q177 104 179 104 L185 104 Q187 104 187 102 L187 91 Z" fill="none" stroke="#DDBB88" stroke-width="0.5"/>
  <path d="M177 95 L187 95" stroke="#EED" stroke-width="0.3"/>
  <path d="M177 99 L187 99" stroke="#DDBB88" stroke-width="0.3"/>

  <!-- Flat White -->
  <rect x="202" y="88" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="219" y="110" text-anchor="middle" font-size="2.8" fill="#AAA" font-family="sans-serif">Flat White</text>
  <path d="M212 93 L212 100 Q212 102 214 102 L220 102 Q222 102 222 100 L222 93 Z" fill="none" stroke="#DDBB88" stroke-width="0.5"/>
  <path d="M212 96 L222 96" stroke="#EED" stroke-width="0.3"/>

  <!-- Milchschaum -->
  <rect x="238" y="88" width="33" height="26" rx="2" fill="#222" stroke="#3A3A3A" stroke-width="0.4"/>
  <text x="255" y="110" text-anchor="middle" font-size="2.5" fill="#AAA" font-family="sans-serif">Milchschaum</text>
  <path d="M248 91 L248 102 Q248 104 250 104 L256 104 Q258 104 258 102 L258 91 Z" fill="none" stroke="#EEE" stroke-width="0.5"/>
  <path d="M248 95 L258 95" stroke="#EEE" stroke-width="0.3"/>

  <!-- Navigation dots at bottom of screen -->
  <circle cx="193" cy="142" r="1.5" fill="#4488CC"/>
  <circle cx="200" cy="142" r="1.5" fill="#444"/>
  <circle cx="207" cy="142" r="1.5" fill="#444"/>

  <!-- ======== JURA LOGO PANEL ======== -->
  <!-- Chrome circle with Jura logo -->
  <circle cx="200" cy="178" r="18" fill="url(#chrome)" stroke="#AAA" stroke-width="0.5"/>
  <circle cx="200" cy="178" r="15" fill="#1A1A1A" stroke="#444" stroke-width="0.5"/>
  <text x="200" y="182" text-anchor="middle" font-size="10" font-family="Georgia, serif" fill="#CCC" font-style="italic" font-weight="700">jura</text>

  <!-- S8 model text -->
  <text x="200" y="210" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#777" font-weight="500" letter-spacing="2">S 8</text>

  <!-- ======== DUAL CHROME SPOUTS (H-configuration) ======== -->
  <!-- Spout housing/bridge at top -->
  <rect x="168" y="224" width="64" height="16" rx="5" fill="#444" stroke="#666" stroke-width="0.4"/>
  <!-- Chrome accent on bridge -->
  <rect x="172" y="227" width="56" height="10" rx="3" fill="url(#chrome)" stroke="#AAA" stroke-width="0.2"/>
  <!-- Height adjust tab -->
  <rect x="226" y="228" width="6" height="7" rx="1.5" fill="#555" stroke="#666" stroke-width="0.3"/>

  <!-- Left spout tube -->
  <rect x="179" y="240" width="12" height="72" rx="4" fill="url(#chrome-v)" stroke="#BBB" stroke-width="0.3"/>
  <!-- Left spout highlight -->
  <rect x="182" y="244" width="3" height="64" rx="1" fill="rgba(255,255,255,0.08)"/>
  <!-- Left spout nozzle -->
  <ellipse cx="185" cy="314" rx="6.5" ry="4" fill="#999" stroke="#AAA" stroke-width="0.3"/>

  <!-- Right spout tube -->
  <rect x="209" y="240" width="12" height="72" rx="4" fill="url(#chrome-v)" stroke="#BBB" stroke-width="0.3"/>
  <!-- Right spout highlight -->
  <rect x="212" y="244" width="3" height="64" rx="1" fill="rgba(255,255,255,0.08)"/>
  <!-- Right spout nozzle -->
  <ellipse cx="215" cy="314" rx="6.5" ry="4" fill="#999" stroke="#AAA" stroke-width="0.3"/>

  <!-- Connecting bridge between spouts (upper) -->
  <rect x="189" y="252" width="22" height="6" rx="2" fill="url(#chrome)" stroke="#BBB" stroke-width="0.2"/>

  <!-- Small chrome drip plate under spouts -->
  <rect x="174" y="318" width="52" height="5" rx="1.5" fill="url(#chrome)" stroke="#AAA" stroke-width="0.2"/>

  <!-- ======== MILK FROTHER (right side, integrated with wing) ======== -->
  <!-- Shadow behind frother -->
  <rect x="354" y="95" width="6" height="145" rx="2" fill="rgba(0,0,0,0.15)"/>
  <!-- Upper chrome frother tube -->
  <rect x="349" y="88" width="12" height="65" rx="5" fill="url(#frother-chrome)" stroke="#BBB" stroke-width="0.4"/>
  <!-- Frother highlight -->
  <rect x="351" y="92" width="3" height="57" rx="1" fill="rgba(255,255,255,0.12)"/>
  <!-- Black mount bracket on wing -->
  <rect x="344" y="148" width="22" height="26" rx="5" fill="#252525" stroke="#444" stroke-width="0.6"/>
  <!-- Adjustment knob -->
  <circle cx="355" cy="161" r="8" fill="#383838" stroke="#555" stroke-width="0.6"/>
  <circle cx="355" cy="161" r="5.5" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>
  <circle cx="355" cy="161" r="2.5" fill="#383838"/>
  <!-- Knob indicator dot -->
  <circle cx="355" cy="155" r="0.8" fill="#666"/>
  <!-- Lower chrome frother nozzle -->
  <rect x="349" y="174" width="12" height="62" rx="4" fill="url(#frother-chrome)" stroke="#AAA" stroke-width="0.4"/>
  <!-- Lower tube highlight -->
  <rect x="351" y="178" width="3" height="54" rx="1" fill="rgba(255,255,255,0.1)"/>
  <!-- Nozzle tip -->
  <ellipse cx="355" cy="238" rx="6" ry="3.5" fill="#999" stroke="#AAA" stroke-width="0.3"/>

  <!-- ======== LOWER BLACK PANEL (below spouts) ======== -->
  <!-- Access door / waste container panel -->
  <rect x="135" y="328" width="130" height="52" rx="4" fill="#161616" stroke="#282828" stroke-width="0.4"/>
  <!-- Panel divider line -->
  <line x1="140" y1="354" x2="260" y2="354" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
  <!-- Small pull tab -->
  <rect x="192" y="344" width="16" height="3" rx="1" fill="#333"/>

  <!-- ======== DRIP TRAY ======== -->
  <path d="
    M30 388
    L30 412
    Q30 426 55 428
    L345 428
    Q370 426 370 412
    L370 388
    Z
  " fill="#333" stroke="#444" stroke-width="0.5"/>
  <!-- Drip tray top edge highlight -->
  <line x1="35" y1="389" x2="365" y2="389" stroke="#444" stroke-width="0.5"/>
  <!-- Drip tray grill area -->
  <rect x="48" y="393" width="304" height="24" rx="3" fill="#1E1E1E" stroke="#3A3A3A" stroke-width="0.5"/>
  <!-- Horizontal grill lines (visible) -->
  <line x1="55" y1="398" x2="345" y2="398" stroke="#333" stroke-width="0.8"/>
  <line x1="55" y1="402" x2="345" y2="402" stroke="#333" stroke-width="0.8"/>
  <line x1="55" y1="406" x2="345" y2="406" stroke="#333" stroke-width="0.8"/>
  <line x1="55" y1="410" x2="345" y2="410" stroke="#333" stroke-width="0.8"/>
  <line x1="55" y1="414" x2="345" y2="414" stroke="#333" stroke-width="0.8"/>

  <!-- ======== BLACK BASE ======== -->
  <path d="M46 426 Q46 440 72 442 L328 442 Q354 440 354 426 Z" fill="#222"/>
</svg>`,
  "Jura J8 twin": `<svg width="380" height="460" viewBox="0 0 380 460">
  <defs>
    <linearGradient id="diamond-black" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E1E1E"/>
      <stop offset="12%" stop-color="#2A2A2A"/>
      <stop offset="35%" stop-color="#323232"/>
      <stop offset="50%" stop-color="#353535"/>
      <stop offset="65%" stop-color="#323232"/>
      <stop offset="88%" stop-color="#2A2A2A"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="70%" stop-color="#C8C8C8"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="chrome-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C0C0C0"/>
      <stop offset="40%" stop-color="#D8D8D8"/>
      <stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A8A8A8"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="20%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#111"/>
      <stop offset="80%" stop-color="#151515"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="25%" stop-color="#C0C0C0"/>
      <stop offset="50%" stop-color="#DDD"/>
      <stop offset="75%" stop-color="#BBB"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
    <linearGradient id="hopper-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3A3A3A"/>
      <stop offset="50%" stop-color="#2A2A2A"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <radialGradient id="screen-glow" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0%" stop-color="#1E1E30"/>
      <stop offset="60%" stop-color="#12121E"/>
      <stop offset="100%" stop-color="#0A0A12"/>
    </radialGradient>
    <!-- Drink glass gradients -->
    <linearGradient id="espresso-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B5E3C"/>
      <stop offset="30%" stop-color="#6B3F1F"/>
      <stop offset="100%" stop-color="#4A2A10"/>
    </linearGradient>
    <linearGradient id="latte-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8D5B8"/>
      <stop offset="20%" stop-color="#D4B896"/>
      <stop offset="60%" stop-color="#8B5E3C"/>
      <stop offset="100%" stop-color="#4A2A10"/>
    </linearGradient>
    <linearGradient id="cappuccino-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F0E0CC"/>
      <stop offset="30%" stop-color="#D4B896"/>
      <stop offset="70%" stop-color="#6B3F1F"/>
      <stop offset="100%" stop-color="#4A2A10"/>
    </linearGradient>
    <!-- Dial gradient for premium feel -->
    <radialGradient id="dial-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stop-color="#3A3A3A"/>
      <stop offset="50%" stop-color="#2A2A2A"/>
      <stop offset="100%" stop-color="#1E1E1E"/>
    </radialGradient>
  </defs>

  <!-- Shadow -->
  <ellipse cx="190" cy="445" rx="145" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== MAIN BODY — monolithic Diamond Black ======== -->

  <!-- LEFT WING (curved, tapers inward toward top) -->
  <path d="
    M55 58
    Q42 58 38 64
    L28 380
    Q28 395 44 398
    L108 398
    L108 58
    Z
  " fill="url(#diamond-black)" stroke="#444" stroke-width="0.6"/>
  <!-- Left wing edge highlight -->
  <path d="M55 58 Q44 58 40 64 L30 378 Q30 392 44 395 L48 395 L38 66 Q40 60 55 58 Z" fill="rgba(255,255,255,0.03)"/>
  <!-- Left wing subtle body reflection -->
  <path d="M60 80 L56 300 L62 300 L66 80 Z" fill="rgba(255,255,255,0.015)"/>

  <!-- CENTER SECTION (taller, extends to top for bean hoppers) -->
  <path d="
    M108 20
    Q108 16 112 16
    L268 16
    Q272 16 272 20
    L272 398
    L108 398
    Z
  " fill="url(#diamond-black)" stroke="#444" stroke-width="0.6"/>
  <!-- Top highlight -->
  <path d="M112 16 L268 16 Q272 16 272 20 L272 28 Q190 32 108 28 L108 20 Q108 16 112 16 Z" fill="rgba(255,255,255,0.04)"/>
  <!-- Left edge ambient strip -->
  <path d="M108 20 L111 20 L111 398 L108 398 Z" fill="rgba(255,255,255,0.025)"/>

  <!-- RIGHT WING (curved, tapers inward toward top) -->
  <path d="
    M272 58
    L272 398
    L336 398
    Q352 395 352 380
    L344 64
    Q342 58 325 58
    Z
  " fill="url(#diamond-black)" stroke="#444" stroke-width="0.6"/>
  <!-- Right wing edge highlight -->
  <path d="M325 58 Q338 60 340 66 L332 395 L336 395 Q350 392 350 378 L344 64 Q342 58 325 58 Z" fill="rgba(255,255,255,0.03)"/>

  <!-- Vertical division lines -->
  <line x1="108" y1="58" x2="108" y2="398" stroke="rgba(255,255,255,0.025)" stroke-width="0.8"/>
  <line x1="272" y1="58" x2="272" y2="398" stroke="rgba(255,255,255,0.025)" stroke-width="0.8"/>

  <!-- ======== DUAL BEAN HOPPERS — on top of center section ======== -->
  <!-- Chrome trim strip across top -->
  <rect x="112" y="16" width="156" height="3.5" rx="1" fill="url(#chrome)" opacity="0.7"/>

  <!-- Left hopper well -->
  <rect x="116" y="2" width="72" height="17" rx="3" fill="url(#hopper-grad)" stroke="#444" stroke-width="0.6"/>
  <rect x="120" y="4" width="64" height="12" rx="2" fill="#151515"/>
  <!-- Bean texture in left hopper -->
  <ellipse cx="132" cy="9" rx="3.5" ry="2" fill="#3A2A1A" opacity="0.7"/>
  <ellipse cx="140" cy="8" rx="4" ry="2.5" fill="#422E1C" opacity="0.65"/>
  <ellipse cx="148" cy="9.5" rx="3" ry="2" fill="#3A2A1A" opacity="0.7"/>
  <ellipse cx="156" cy="8" rx="3.5" ry="2" fill="#422E1C" opacity="0.55"/>
  <ellipse cx="164" cy="9" rx="3" ry="2" fill="#3A2A1A" opacity="0.6"/>
  <ellipse cx="137" cy="12" rx="3" ry="1.5" fill="#4A3420" opacity="0.5"/>
  <ellipse cx="152" cy="11.5" rx="3" ry="1.5" fill="#3A2A1A" opacity="0.45"/>
  <!-- Left grinder dial — with concentric detail -->
  <circle cx="152" cy="9" r="6" fill="#2E2E2E" stroke="#555" stroke-width="0.6"/>
  <circle cx="152" cy="9" r="4.5" fill="#333" stroke="#444" stroke-width="0.3"/>
  <circle cx="152" cy="9" r="2.5" fill="#3A3A3A"/>
  <line x1="152" y1="4" x2="152" y2="6" stroke="#888" stroke-width="0.6"/>
  <!-- Hopper rim highlight -->
  <rect x="118" y="3" width="66" height="1.5" rx="0.5" fill="rgba(255,255,255,0.04)"/>

  <!-- Right hopper well -->
  <rect x="192" y="2" width="72" height="17" rx="3" fill="url(#hopper-grad)" stroke="#444" stroke-width="0.6"/>
  <rect x="196" y="4" width="64" height="12" rx="2" fill="#151515"/>
  <!-- Bean texture in right hopper -->
  <ellipse cx="210" cy="9" rx="3.5" ry="2" fill="#3A2A1A" opacity="0.7"/>
  <ellipse cx="218" cy="8" rx="4" ry="2.5" fill="#422E1C" opacity="0.65"/>
  <ellipse cx="226" cy="9.5" rx="3" ry="2" fill="#3A2A1A" opacity="0.7"/>
  <ellipse cx="234" cy="8" rx="3.5" ry="2" fill="#422E1C" opacity="0.55"/>
  <ellipse cx="242" cy="9" rx="3" ry="2" fill="#3A2A1A" opacity="0.6"/>
  <ellipse cx="215" cy="12" rx="3" ry="1.5" fill="#4A3420" opacity="0.5"/>
  <ellipse cx="230" cy="11.5" rx="3" ry="1.5" fill="#3A2A1A" opacity="0.45"/>
  <!-- Right grinder dial — with concentric detail -->
  <circle cx="228" cy="9" r="6" fill="#2E2E2E" stroke="#555" stroke-width="0.6"/>
  <circle cx="228" cy="9" r="4.5" fill="#333" stroke="#444" stroke-width="0.3"/>
  <circle cx="228" cy="9" r="2.5" fill="#3A3A3A"/>
  <line x1="228" y1="4" x2="228" y2="6" stroke="#888" stroke-width="0.6"/>
  <!-- Hopper rim highlight -->
  <rect x="194" y="3" width="66" height="1.5" rx="0.5" fill="rgba(255,255,255,0.04)"/>

  <!-- Divider between hoppers -->
  <rect x="188" y="2" width="4" height="17" rx="1" fill="#2A2A2A" stroke="#444" stroke-width="0.3"/>

  <!-- ======== 6.7" PANORAMA TOUCHSCREEN DISPLAY ======== -->
  <!-- THE key visual differentiator — very wide panoramic display -->
  <!-- Outer bezel frame -->
  <rect x="68" y="32" width="244" height="92" rx="6" fill="#0D0D0D" stroke="#333" stroke-width="0.8"/>
  <!-- Bezel top highlight (glossy edge) -->
  <rect x="72" y="33" width="236" height="2" rx="1" fill="rgba(255,255,255,0.06)"/>
  <!-- Inner screen area -->
  <rect x="75" y="37" width="230" height="82" rx="4" fill="url(#screen-glow)"/>
  <!-- Screen glass reflection (diagonal light streak) -->
  <path d="M80 37 L120 37 L85 119 L75 119 Z" fill="rgba(255,255,255,0.02)"/>

  <!-- Display content — 2x4 grid of drink selections with glass icons -->

  <!-- Row 1: 4 drinks -->
  <!-- Espresso -->
  <rect x="80" y="42" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="106" y="49" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Espresso</text>
  <path d="M98 54 L98 68 Q98 70 100 70 L112 70 Q114 70 114 68 L114 54 Z" fill="url(#espresso-fill)" opacity="0.85"/>
  <rect x="99" y="55" width="14" height="2.5" rx="0.5" fill="#C09060" opacity="0.5"/>
  <path d="M114 57 Q118 59 114 64" fill="none" stroke="#8B5E3C" stroke-width="0.4"/>

  <!-- Coffee -->
  <rect x="136" y="42" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="162" y="49" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Coffee</text>
  <path d="M154 52 L154 68 Q154 70 156 70 L168 70 Q170 70 170 68 L170 52 Z" fill="url(#espresso-fill)" opacity="0.75"/>
  <path d="M155 53 Q156 51 155 49" fill="none" stroke="#555" stroke-width="0.3"/>
  <path d="M159 53 Q160 50 159 48" fill="none" stroke="#555" stroke-width="0.3"/>

  <!-- Cappuccino -->
  <rect x="192" y="42" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="218" y="49" text-anchor="middle" font-size="3" fill="#999" font-family="sans-serif">Cappuccino</text>
  <path d="M210 53 L210 68 Q210 70 212 70 L224 70 Q226 70 226 68 L226 53 Z" fill="url(#cappuccino-fill)" opacity="0.85"/>
  <ellipse cx="218" cy="53" rx="8" ry="2" fill="#F0E0CC" opacity="0.4"/>

  <!-- Latte Macchiato -->
  <rect x="248" y="42" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="274" y="49" text-anchor="middle" font-size="2.8" fill="#999" font-family="sans-serif">Latte Macchiato</text>
  <path d="M267 53 L268 68 Q268 70 270 70 L278 70 Q280 70 280 68 L281 53 Z" fill="url(#latte-fill)" opacity="0.85"/>
  <rect x="269" y="54" width="10" height="3" rx="0.5" fill="#F0E0CC" opacity="0.4"/>
  <rect x="269" y="63" width="10" height="3" rx="0.5" fill="#8B5E3C" opacity="0.3"/>

  <!-- Row 2: 4 drinks -->
  <!-- Flat White -->
  <rect x="80" y="80" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="106" y="87" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Flat White</text>
  <path d="M98 92 L98 106 Q98 108 100 108 L112 108 Q114 108 114 106 L114 92 Z" fill="url(#cappuccino-fill)" opacity="0.75"/>
  <ellipse cx="106" cy="92" rx="8" ry="1.8" fill="#E8D5B8" opacity="0.4"/>

  <!-- Macchiato -->
  <rect x="136" y="80" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="162" y="87" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Macchiato</text>
  <path d="M155 92 L155 106 Q155 108 157 108 L167 108 Q169 108 169 106 L169 92 Z" fill="url(#espresso-fill)" opacity="0.75"/>
  <ellipse cx="162" cy="92" rx="7" ry="1.5" fill="#E8D5B8" opacity="0.35"/>

  <!-- Lungo -->
  <rect x="192" y="80" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="218" y="87" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Lungo</text>
  <path d="M210 92 L210 106 Q210 108 212 108 L224 108 Q226 108 226 106 L226 92 Z" fill="url(#espresso-fill)" opacity="0.65"/>
  <path d="M211 93 Q212 91 211 89" fill="none" stroke="#555" stroke-width="0.3"/>

  <!-- Ristretto -->
  <rect x="248" y="80" width="52" height="35" rx="2.5" fill="#181825" stroke="#2A2A35" stroke-width="0.3"/>
  <text x="274" y="87" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Ristretto</text>
  <path d="M268 94 L268 106 Q268 108 270 108 L278 108 Q280 108 280 106 L280 94 Z" fill="url(#espresso-fill)" opacity="0.9"/>
  <rect x="269" y="95" width="10" height="2" rx="0.5" fill="#C09060" opacity="0.6"/>

  <!-- Navigation dots at bottom of display -->
  <circle cx="178" cy="117" r="1.2" fill="#555"/>
  <circle cx="185" cy="117" r="1.5" fill="#AAA"/>
  <circle cx="192" cy="117" r="1.2" fill="#555"/>
  <circle cx="199" cy="117" r="1.2" fill="#555"/>

  <!-- ======== JURA LOGO PANEL — chrome rectangle below display ======== -->
  <rect x="148" y="128" width="84" height="50" rx="4" fill="url(#chrome)" stroke="#BBB" stroke-width="0.4"/>
  <!-- Multi-stop gloss reflection for metallic feel -->
  <rect x="150" y="130" width="80" height="14" rx="3" fill="rgba(255,255,255,0.07)"/>
  <rect x="155" y="165" width="70" height="6" rx="2" fill="rgba(255,255,255,0.03)"/>

  <!-- Jura logo circle -->
  <circle cx="190" cy="146" r="14" fill="#181818" stroke="#CCC" stroke-width="1.2"/>
  <circle cx="190" cy="146" r="12.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.3"/>
  <!-- Specular highlight on logo circle -->
  <path d="M180 138 Q190 134 200 138" fill="rgba(255,255,255,0.06)" stroke="none"/>
  <text x="190" y="151" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#EEE" font-style="italic" font-weight="700">jura</text>

  <!-- J8 twin model text -->
  <text x="190" y="172" text-anchor="middle" font-size="7" font-family="sans-serif" fill="#888" font-weight="400" letter-spacing="1">J8 twin</text>

  <!-- ======== ROTARY DIAL — right wing, enhanced depth ======== -->
  <!-- Outer chrome ring -->
  <circle cx="312" cy="146" r="18" fill="url(#chrome)" stroke="#999" stroke-width="0.4"/>
  <!-- Dark dial body -->
  <circle cx="312" cy="146" r="15" fill="url(#dial-grad)"/>
  <!-- Concentric texture rings -->
  <circle cx="312" cy="146" r="13" fill="none" stroke="#3A3A3A" stroke-width="0.3"/>
  <circle cx="312" cy="146" r="11" fill="none" stroke="#383838" stroke-width="0.3"/>
  <circle cx="312" cy="146" r="9" fill="none" stroke="#363636" stroke-width="0.3"/>
  <!-- Inner knob -->
  <circle cx="312" cy="146" r="6" fill="#333"/>
  <circle cx="312" cy="146" r="2.5" fill="#3A3A3A"/>
  <!-- Detent marks -->
  <circle cx="312" cy="146" r="16.5" fill="none" stroke="#888" stroke-width="0.4" stroke-dasharray="1,2.5"/>
  <!-- Specular highlight on dial -->
  <path d="M303 138 Q312 132 321 138" fill="rgba(255,255,255,0.06)" stroke="none"/>

  <!-- ======== PANEL SEAM — horizontal division ======== -->
  <line x1="50" y1="185" x2="330" y2="185" stroke="#1A1A1A" stroke-width="1.5"/>
  <line x1="50" y1="186" x2="330" y2="186" stroke="rgba(255,255,255,0.035)" stroke-width="0.5"/>

  <!-- ======== BLACK GLOSSY DISPENSING AREA ======== -->
  <rect x="55" y="187" width="270" height="168" rx="5" fill="url(#gloss-black)"/>
  <!-- Glossy reflection band at top -->
  <path d="M55 187 L325 187 L325 205 Q190 214 55 205 Z" fill="rgba(255,255,255,0.025)"/>
  <!-- Subtle vertical reflection -->
  <path d="M62 295 L78 187 L85 187 L69 295 Z" fill="rgba(255,255,255,0.01)"/>
  <!-- Right side subtle reflection -->
  <path d="M310 295 L298 187 L305 187 L317 295 Z" fill="rgba(255,255,255,0.008)"/>

  <!-- Dispensing niche — recessed darker area -->
  <rect x="105" y="200" width="170" height="140" rx="4" fill="#0D0D0D"/>
  <!-- Niche depth shadows -->
  <rect x="105" y="200" width="4" height="140" fill="rgba(255,255,255,0.015)"/>
  <rect x="271" y="200" width="4" height="140" fill="rgba(0,0,0,0.15)"/>
  <rect x="105" y="200" width="170" height="6" fill="rgba(0,0,0,0.25)"/>
  <!-- Niche bottom highlight -->
  <rect x="110" y="336" width="160" height="2" fill="rgba(255,255,255,0.015)"/>

  <!-- Cup illumination (subtle amber glow) -->
  <ellipse cx="190" cy="332" rx="35" ry="5" fill="rgba(180,130,60,0.05)"/>
  <ellipse cx="190" cy="332" rx="20" ry="3" fill="rgba(180,130,60,0.04)"/>

  <!-- ======== SPOUT ASSEMBLY — twin spouts: coffee (center-left) + milk (right) ======== -->

  <!-- Shared mounting rail across top of niche -->
  <rect x="148" y="200" width="100" height="14" rx="3" fill="#444" stroke="#555" stroke-width="0.4"/>
  <!-- Rail groove detail -->
  <line x1="153" y1="207" x2="243" y2="207" stroke="#333" stroke-width="0.5"/>
  <!-- Height-adjust tab (left of center) -->
  <rect x="196" y="203" width="6" height="7" rx="1.5" fill="#383838" stroke="#555" stroke-width="0.3"/>

  <!-- ===== COFFEE SPOUT (center-left) — dual chrome nozzles ===== -->
  <!-- Coffee spout main body / mounting plate -->
  <rect x="158" y="214" width="22" height="30" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Chrome highlight strip -->
  <rect x="167" y="216" width="3" height="26" rx="1" fill="rgba(255,255,255,0.15)"/>
  <!-- Dark edge definition -->
  <rect x="158" y="216" width="1.5" height="26" fill="rgba(0,0,0,0.15)"/>

  <!-- Left coffee nozzle -->
  <rect x="161" y="244" width="5" height="30" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Right coffee nozzle -->
  <rect x="172" y="244" width="5" height="30" rx="2" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Spreader bar connecting nozzles -->
  <rect x="160" y="256" width="18" height="3" rx="1" fill="#BBB"/>
  <!-- Left nozzle opening -->
  <ellipse cx="163.5" cy="275" rx="3" ry="3.5" fill="#888"/>
  <ellipse cx="163.5" cy="275" rx="2" ry="2.5" fill="#666"/>
  <!-- Right nozzle opening -->
  <ellipse cx="174.5" cy="275" rx="3" ry="3.5" fill="#888"/>
  <ellipse cx="174.5" cy="275" rx="2" ry="2.5" fill="#666"/>

  <!-- ===== MILK SPOUT (right side) — wider/fatter chrome tube ===== -->
  <!-- Milk spout mounting bracket -->
  <rect x="210" y="214" width="28" height="14" rx="2.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Highlight on bracket -->
  <rect x="212" y="216" width="24" height="3" rx="1" fill="rgba(255,255,255,0.1)"/>

  <!-- Milk tube — prominent, wider chrome tube -->
  <rect x="214" y="228" width="20" height="52" rx="6" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.4"/>
  <!-- Chrome highlight running down tube -->
  <rect x="222" y="230" width="4" height="48" rx="1.5" fill="rgba(255,255,255,0.18)"/>
  <!-- Dark left edge for roundness -->
  <rect x="214" y="230" width="2.5" height="48" rx="1" fill="rgba(0,0,0,0.12)"/>
  <!-- Chrome band detail mid-tube -->
  <rect x="212" y="250" width="24" height="4" rx="2" fill="url(#chrome)" opacity="0.5"/>

  <!-- Milk tube nozzle tip — wider opening -->
  <rect x="216" y="280" width="16" height="6" rx="2.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.3"/>
  <!-- Nozzle opening -->
  <ellipse cx="224" cy="287" rx="5.5" ry="3" fill="#888"/>
  <ellipse cx="224" cy="287" rx="3.5" ry="2" fill="#666"/>

  <!-- ======== DRIP TRAY — enhanced grate pattern ======== -->
  <!-- Chrome tray surround -->
  <path d="
    M32 358
    L32 378
    Q32 396 58 398
    L322 398
    Q348 396 348 378
    L348 358
    Z
  " fill="url(#chrome)" stroke="#BBB" stroke-width="0.5"/>
  <!-- Chrome top highlight -->
  <rect x="38" y="359" width="304" height="2" rx="1" fill="rgba(255,255,255,0.08)"/>

  <!-- Black grate inset -->
  <rect x="50" y="363" width="280" height="24" rx="3" fill="#151515"/>
  <!-- Vertical grate bars — more visible pattern -->
  <line x1="65" y1="367" x2="65" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="80" y1="367" x2="80" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="95" y1="367" x2="95" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="110" y1="367" x2="110" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="125" y1="367" x2="125" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="140" y1="367" x2="140" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="155" y1="367" x2="155" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="170" y1="367" x2="170" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="185" y1="367" x2="185" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="200" y1="367" x2="200" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="215" y1="367" x2="215" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="230" y1="367" x2="230" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="245" y1="367" x2="245" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="260" y1="367" x2="260" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="275" y1="367" x2="275" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="290" y1="367" x2="290" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="305" y1="367" x2="305" y2="384" stroke="#282828" stroke-width="1"/>
  <line x1="320" y1="367" x2="320" y2="384" stroke="#282828" stroke-width="1"/>
  <!-- Horizontal grate bars for grid pattern -->
  <line x1="55" y1="372" x2="325" y2="372" stroke="#222" stroke-width="0.5"/>
  <line x1="55" y1="379" x2="325" y2="379" stroke="#222" stroke-width="0.5"/>
  <!-- Chrome trim line -->
  <line x1="40" y1="390" x2="340" y2="390" stroke="#C0C0C0" stroke-width="0.5"/>

  <!-- Black base -->
  <path d="M45 396 Q45 412 72 414 L308 414 Q335 412 335 396 Z" fill="#181818"/>
  <line x1="65" y1="414" x2="315" y2="414" stroke="#888" stroke-width="0.3"/>
</svg>`,
  "Jura Z10": `<svg width="480" height="460" viewBox="-90 0 470 460">
  <defs>
    <!-- Dark Inox brushed aluminum — warm dark silver with subtle warmth -->
    <linearGradient id="dark-inox" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5E5E56"/>
      <stop offset="10%" stop-color="#70706A"/>
      <stop offset="25%" stop-color="#83837B"/>
      <stop offset="45%" stop-color="#8D8D84"/>
      <stop offset="55%" stop-color="#8D8D84"/>
      <stop offset="75%" stop-color="#83837B"/>
      <stop offset="90%" stop-color="#70706A"/>
      <stop offset="100%" stop-color="#5E5E56"/>
    </linearGradient>
    <linearGradient id="dark-inox-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#88887F"/>
      <stop offset="40%" stop-color="#7E7E76"/>
      <stop offset="100%" stop-color="#6E6E66"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A0A0"/>
      <stop offset="25%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#E8E8E8"/>
      <stop offset="75%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#A0A0A0"/>
    </linearGradient>
    <linearGradient id="spout-chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#999"/>
      <stop offset="25%" stop-color="#C8C8C8"/>
      <stop offset="50%" stop-color="#E0E0E0"/>
      <stop offset="75%" stop-color="#C0C0C0"/>
      <stop offset="100%" stop-color="#999"/>
    </linearGradient>
    <linearGradient id="gloss-black" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#282828"/>
      <stop offset="25%" stop-color="#181818"/>
      <stop offset="50%" stop-color="#0F0F0F"/>
      <stop offset="80%" stop-color="#131313"/>
      <stop offset="100%" stop-color="#181818"/>
    </linearGradient>
    <linearGradient id="screen-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1C1C1C"/>
      <stop offset="100%" stop-color="#0E0E0E"/>
    </linearGradient>
    <!-- Curved logo panel — convex chrome, slightly warm -->
    <linearGradient id="logo-chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B0B0A8"/>
      <stop offset="25%" stop-color="#D0D0C8"/>
      <stop offset="50%" stop-color="#E0E0D8"/>
      <stop offset="75%" stop-color="#C8C8C0"/>
      <stop offset="100%" stop-color="#A0A098"/>
    </linearGradient>
    <!-- Logo panel horizontal for wider feel -->
    <linearGradient id="logo-chrome-h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A0A098"/>
      <stop offset="20%" stop-color="#C0C0B8"/>
      <stop offset="50%" stop-color="#D8D8D0"/>
      <stop offset="80%" stop-color="#C0C0B8"/>
      <stop offset="100%" stop-color="#A0A098"/>
    </linearGradient>
    <!-- Water tank translucent blue gradient -->
    <linearGradient id="tank-blue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5A8BA8" stop-opacity="0.22"/>
      <stop offset="18%" stop-color="#7CB8D8" stop-opacity="0.18"/>
      <stop offset="40%" stop-color="#9AD0EA" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#A8DCF2" stop-opacity="0.28"/>
      <stop offset="80%" stop-color="#7CB8D8" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#5A8BA8" stop-opacity="0.22"/>
    </linearGradient>
    <linearGradient id="tank-blue-solid" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4A7A98"/>
      <stop offset="20%" stop-color="#6AACCC"/>
      <stop offset="50%" stop-color="#80C4E0"/>
      <stop offset="80%" stop-color="#6AACCC"/>
      <stop offset="100%" stop-color="#4A7A98"/>
    </linearGradient>
    <linearGradient id="tank-water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6AACC8" stop-opacity="0.10"/>
      <stop offset="50%" stop-color="#5098B8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#3878A0" stop-opacity="0.25"/>
    </linearGradient>
    <!-- Diamond/crosshatch crystal pattern -->
    <pattern id="crystal-diamond" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
      <!-- Diamond grid lines — two diagonals forming a diamond lattice -->
      <line x1="0" y1="0" x2="16" y2="16" stroke="rgba(180,220,240,0.18)" stroke-width="0.6"/>
      <line x1="16" y1="0" x2="0" y2="16" stroke="rgba(180,220,240,0.18)" stroke-width="0.6"/>
      <line x1="8" y1="-8" x2="24" y2="8" stroke="rgba(180,220,240,0.12)" stroke-width="0.4"/>
      <line x1="-8" y1="8" x2="8" y2="24" stroke="rgba(180,220,240,0.12)" stroke-width="0.4"/>
      <!-- Diamond center highlights — subtle sparkle at intersections -->
      <circle cx="8" cy="0" r="0.6" fill="rgba(200,235,255,0.15)"/>
      <circle cx="0" cy="8" r="0.6" fill="rgba(200,235,255,0.15)"/>
      <circle cx="16" cy="8" r="0.6" fill="rgba(200,235,255,0.15)"/>
      <circle cx="8" cy="16" r="0.6" fill="rgba(200,235,255,0.15)"/>
    </pattern>
    <!-- Finer secondary crystal pattern -->
    <pattern id="crystal-fine" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(160,210,240,0.08)" stroke-width="0.3"/>
      <line x1="8" y1="0" x2="0" y2="8" stroke="rgba(160,210,240,0.08)" stroke-width="0.3"/>
    </pattern>
    <!-- Tank vertical highlight for glass effect -->
    <linearGradient id="tank-gloss" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0)" />
      <stop offset="25%" stop-color="rgba(255,255,255,0.04)" />
      <stop offset="45%" stop-color="rgba(255,255,255,0.12)" />
      <stop offset="55%" stop-color="rgba(255,255,255,0.10)" />
      <stop offset="75%" stop-color="rgba(255,255,255,0.03)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>
  </defs>

  <!-- Shadow under machine -->
  <ellipse cx="150" cy="448" rx="200" ry="10" fill="rgba(255,255,255,0.04)"/>

  <!-- ======== CRYSTAL WATER TANK — LEFT SIDE ======== -->
  <!-- The Z10's signature transparent crystal-pattern water tank -->
  <g id="water-tank">
    <!-- Tank back shadow — gives depth behind the transparent tank -->
    <rect x="-27" y="32" width="78" height="331" rx="6" fill="#1E2830" opacity="0.7"/>

    <!-- Tank outer shell — translucent blue-tinted body -->
    <rect x="-24" y="35" width="72" height="325" rx="5" fill="url(#tank-blue-solid)" opacity="0.18" stroke="rgba(120,180,210,0.35)" stroke-width="0.8"/>

    <!-- Water fill — slightly darker blue toward the bottom -->
    <rect x="-22" y="38" width="68" height="319" rx="4" fill="url(#tank-water)"/>

    <!-- Crystal diamond pattern overlay — the signature faceted look -->
    <rect x="-22" y="38" width="68" height="319" rx="4" fill="url(#crystal-diamond)"/>

    <!-- Fine secondary crosshatch layer for additional texture -->
    <rect x="-22" y="38" width="68" height="319" rx="4" fill="url(#crystal-fine)"/>

    <!-- Glossy vertical reflection streak — glass-like specular highlight -->
    <rect x="-22" y="38" width="68" height="319" rx="4" fill="url(#tank-gloss)"/>

    <!-- Top highlight edge — light catching the rim -->
    <rect x="-22" y="35" width="68" height="6" rx="3" fill="rgba(180,220,245,0.12)"/>

    <!-- Water level indicator lines — subtle horizontal marks -->
    <line x1="-17" y1="100" x2="-13" y2="100" stroke="rgba(150,200,230,0.25)" stroke-width="0.5"/>
    <line x1="-17" y1="165" x2="-13" y2="165" stroke="rgba(150,200,230,0.25)" stroke-width="0.5"/>
    <line x1="-17" y1="230" x2="-13" y2="230" stroke="rgba(150,200,230,0.25)" stroke-width="0.5"/>
    <line x1="-17" y1="295" x2="-13" y2="295" stroke="rgba(150,200,230,0.25)" stroke-width="0.5"/>
    <line x1="-17" y1="345" x2="-13" y2="345" stroke="rgba(150,200,230,0.25)" stroke-width="0.5"/>

    <!-- Left edge vertical highlight — glass edge refraction -->
    <line x1="-21" y1="42" x2="-21" y2="354" stroke="rgba(180,220,250,0.10)" stroke-width="1"/>

    <!-- Right edge — where tank meets the machine body, subtle seam -->
    <line x1="47" y1="38" x2="47" y2="357" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>

    <!-- Bright vertical specular streak — the characteristic glass glint -->
    <rect x="1" y="48" width="3" height="298" rx="1.5" fill="rgba(220,240,255,0.10)"/>
    <rect x="19" y="54" width="1.5" height="286" rx="0.75" fill="rgba(220,240,255,0.06)"/>

    <!-- Tank handle/grip indent on left side -->
    <rect x="-26" y="150" width="4" height="70" rx="2" fill="rgba(80,140,180,0.12)" stroke="rgba(120,180,210,0.18)" stroke-width="0.5"/>

    <!-- Bottom edge shadow -->
    <rect x="-22" y="354" width="68" height="6" rx="3" fill="rgba(0,0,0,0.10)"/>
  </g>

  <!-- Upper body — the main aluminum block -->
  <rect x="48" y="22" width="284" height="342" rx="5" fill="url(#dark-inox)" stroke="#666" stroke-width="0.5"/>

  <!-- Convex-concave front panel effect -->
  <!-- Left edge depth shadow -->
  <rect x="48" y="22" width="10" height="342" fill="rgba(0,0,0,0.06)"/>
  <!-- Right edge depth shadow -->
  <rect x="322" y="22" width="10" height="342" fill="rgba(0,0,0,0.06)"/>
  <!-- Central convex highlight — wider, softer -->
  <path d="M140 22 L240 22 L240 364 L140 364 Z" fill="rgba(255,255,255,0.02)"/>
  <!-- Top edge highlight -->
  <path d="M53 22 L327 22 Q332 22 332 27 L332 38 Q190 44 48 38 L48 27 Q48 22 53 22 Z" fill="rgba(255,255,255,0.04)"/>

  <!-- Bean hopper hint at top — dark strip indicating the hopper lid -->
  <rect x="130" y="22" width="120" height="5" rx="2" fill="rgba(0,0,0,0.15)"/>
  <rect x="145" y="22" width="90" height="3" rx="1.5" fill="rgba(0,0,0,0.08)"/>

  <!-- Subtle vertical brushed grain lines -->
  <line x1="75" y1="22" x2="75" y2="364" stroke="rgba(255,255,255,0.008)" stroke-width="0.3"/>
  <line x1="110" y1="22" x2="110" y2="364" stroke="rgba(255,255,255,0.006)" stroke-width="0.3"/>
  <line x1="160" y1="22" x2="160" y2="364" stroke="rgba(255,255,255,0.008)" stroke-width="0.3"/>
  <line x1="220" y1="22" x2="220" y2="364" stroke="rgba(255,255,255,0.008)" stroke-width="0.3"/>
  <line x1="270" y1="22" x2="270" y2="364" stroke="rgba(255,255,255,0.006)" stroke-width="0.3"/>
  <line x1="305" y1="22" x2="305" y2="364" stroke="rgba(255,255,255,0.008)" stroke-width="0.3"/>

  <!-- ======== 4.3" TOUCHSCREEN DISPLAY ======== -->
  <!-- Black bezel — wider, more prominent -->
  <rect x="105" y="32" width="170" height="95" rx="5" fill="#0C0C0C" stroke="#2A2A2A" stroke-width="0.8"/>
  <!-- Inner screen -->
  <rect x="112" y="38" width="156" height="82" rx="3" fill="url(#screen-bg)"/>
  <!-- Screen bezel inner glow -->
  <rect x="112" y="38" width="156" height="3" fill="rgba(255,255,255,0.02)"/>

  <!-- Screen content: 2 rows x 4 drink tiles -->
  <!-- Row 1 -->
  <!-- Espresso -->
  <rect x="118" y="44" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="130" y="58" width="8" height="11" rx="1.5" fill="none" stroke="#B8925A" stroke-width="0.7"/>
  <path d="M131 63 L137 63" stroke="#9A7540" stroke-width="0.5"/>
  <text x="134" y="55" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Espresso</text>

  <!-- Coffee -->
  <rect x="155" y="44" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="166" y="56" width="10" height="13" rx="1.5" fill="none" stroke="#B8925A" stroke-width="0.7"/>
  <path d="M167 62 L175 62" stroke="#9A7540" stroke-width="0.5"/>
  <text x="171" y="55" text-anchor="middle" font-size="3.2" fill="#999" font-family="sans-serif">Coffee</text>

  <!-- Cappuccino -->
  <rect x="192" y="44" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="203" y="55" width="10" height="14" rx="1.5" fill="none" stroke="#B8925A" stroke-width="0.7"/>
  <path d="M204 60 L212 60" stroke="#E0D0B0" stroke-width="0.7"/>
  <path d="M204 64 L212 64" stroke="#9A7540" stroke-width="0.5"/>
  <text x="208" y="54" text-anchor="middle" font-size="3" fill="#999" font-family="sans-serif">Cappucc.</text>

  <!-- Latte Macchiato -->
  <rect x="229" y="44" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="240" y="53" width="10" height="16" rx="1.5" fill="none" stroke="#B8925A" stroke-width="0.7"/>
  <path d="M241 58 L249 58" stroke="#E0D0B0" stroke-width="0.6"/>
  <path d="M241 62 L249 62" stroke="#9A7540" stroke-width="0.5"/>
  <path d="M241 66 L249 66" stroke="#E0D0B0" stroke-width="0.4"/>
  <text x="245" y="53" text-anchor="middle" font-size="2.8" fill="#999" font-family="sans-serif">Latte M.</text>

  <!-- Row 2 -->
  <!-- Flat White -->
  <rect x="118" y="78" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="130" y="90" width="8" height="12" rx="1.5" fill="none" stroke="#B8925A" stroke-width="0.7"/>
  <path d="M131 95 L137 95" stroke="#E0D0B0" stroke-width="0.6"/>
  <text x="134" y="88" text-anchor="middle" font-size="2.8" fill="#999" font-family="sans-serif">Flat White</text>

  <!-- Cold Brew — blue tint for cold -->
  <rect x="155" y="78" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="166" y="89" width="10" height="13" rx="1.5" fill="none" stroke="#6B99B8" stroke-width="0.7"/>
  <circle cx="171" cy="96" r="1.8" fill="none" stroke="#6B99B8" stroke-width="0.4"/>
  <text x="171" y="87" text-anchor="middle" font-size="2.8" fill="#7BA8C0" font-family="sans-serif">Cold Brew</text>

  <!-- Milk Foam -->
  <rect x="192" y="78" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="203" y="89" width="10" height="13" rx="1.5" fill="none" stroke="#D8C8A8" stroke-width="0.7"/>
  <path d="M204 93 Q208 90 212 93" stroke="#E0D0B0" stroke-width="0.6"/>
  <text x="208" y="88" text-anchor="middle" font-size="2.8" fill="#999" font-family="sans-serif">Milk Foam</text>

  <!-- Hot Water -->
  <rect x="229" y="78" width="33" height="30" rx="2" fill="#232323" stroke="#333" stroke-width="0.3"/>
  <rect x="240" y="89" width="10" height="13" rx="1.5" fill="none" stroke="#7BA8C0" stroke-width="0.7"/>
  <path d="M243 93 L243 99 M245 92 L247 97" stroke="#7BA8C0" stroke-width="0.4"/>
  <text x="245" y="88" text-anchor="middle" font-size="2.8" fill="#999" font-family="sans-serif">Hot Water</text>

  <!-- Page indicator dots -->
  <circle cx="172" cy="113" r="1.5" fill="#777"/>
  <circle cx="180" cy="113" r="1.5" fill="#444"/>
  <circle cx="188" cy="113" r="1.5" fill="#444"/>
  <circle cx="196" cy="113" r="1.5" fill="#444"/>
  <circle cx="204" cy="113" r="1.5" fill="#444"/>

  <!-- ======== CURVED CHROME LOGO PANEL — the Z10's signature convex element ======== -->
  <!-- Wide convex chrome band — convex/curved top edge, flat bottom, spanning most of body width -->
  <path d="
    M62 145
    Q62 132 70 132
    L120 132
    Q190 125 260 132
    L310 132
    Q318 132 318 145
    L318 202
    Q318 208 310 208
    L70 208
    Q62 208 62 202
    Z
  " fill="url(#logo-chrome-h)" stroke="#BBB" stroke-width="0.5"/>

  <!-- Convex surface effect — curved highlight across the bowed top -->
  <path d="M70 132 L120 132 Q190 125 260 132 L310 132 Q318 132 318 145 L318 156 Q190 168 62 156 L62 145 Q62 132 70 132 Z" fill="rgba(255,255,255,0.18)"/>
  <!-- Secondary convex gleam — center area bright spot -->
  <ellipse cx="190" cy="164" rx="100" ry="18" fill="rgba(255,255,255,0.04)"/>
  <!-- Bottom edge shadow for depth -->
  <path d="M62 196 L318 196 L318 202 Q318 208 310 208 L70 208 Q62 208 62 202 Z" fill="rgba(0,0,0,0.08)"/>
  <!-- Subtle vertical brush lines on chrome -->
  <line x1="130" y1="132" x2="130" y2="208" stroke="rgba(255,255,255,0.03)" stroke-width="0.3"/>
  <line x1="250" y1="132" x2="250" y2="208" stroke="rgba(255,255,255,0.03)" stroke-width="0.3"/>

  <!-- Jura logo circle — prominent, centered in chrome band -->
  <circle cx="190" cy="163" r="20" fill="#151515" stroke="#555" stroke-width="1.2"/>
  <circle cx="190" cy="163" r="17.5" fill="#111" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
  <!-- Jura text — italic serif style -->
  <text x="190" y="169" text-anchor="middle" font-size="14" font-family="Georgia, serif" fill="#DDD" font-style="italic" font-weight="700">jura</text>

  <!-- Z10 model badge — below logo circle -->
  <text x="190" y="200" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#666" font-weight="400" letter-spacing="3">Z10</text>

  <!-- Small rotary switch on right side of chrome panel -->
  <circle cx="306" cy="168" r="6" fill="#555" stroke="#888" stroke-width="0.5"/>
  <circle cx="306" cy="168" r="3.5" fill="#444"/>
  <circle cx="306" cy="168" r="1.5" fill="#555"/>

  <!-- ======== BLACK SIDE STRIPS — visible between aluminum body and dispensing area ======== -->
  <!-- These dark strips run vertically on both sides of the dispensing area in the Z10 -->
  <rect x="60" y="210" width="10" height="148" fill="#1A1A1A"/>
  <rect x="310" y="210" width="10" height="148" fill="#1A1A1A"/>

  <!-- ======== BLACK DISPENSING CAVITY ======== -->
  <!-- The black recessed area below the chrome panel and above the drip tray -->
  <rect x="70" y="210" width="240" height="148" rx="4" fill="url(#gloss-black)"/>
  <!-- Inner deeper cavity -->
  <rect x="100" y="218" width="180" height="130" rx="3" fill="#090909"/>
  <!-- Top shadow inside cavity -->
  <rect x="100" y="218" width="180" height="6" fill="rgba(0,0,0,0.25)"/>
  <!-- Left wall subtle light -->
  <rect x="100" y="218" width="3" height="130" fill="rgba(255,255,255,0.015)"/>
  <!-- Right wall shadow -->
  <rect x="277" y="218" width="3" height="130" fill="rgba(0,0,0,0.12)"/>
  <!-- Glossy reflection across top of black panel -->
  <path d="M70 210 L310 210 L310 222 Q190 228 70 222 Z" fill="rgba(255,255,255,0.02)"/>

  <!-- ======== SPOUT SYSTEM ======== -->
  <!-- Spout housing/rail at top of cavity -->
  <rect x="158" y="220" width="64" height="11" rx="3" fill="#4A4A4A" stroke="#666" stroke-width="0.4"/>
  <!-- Height-adjust sliding tab on right -->
  <rect x="223" y="222" width="7" height="7" rx="1" fill="#3A3A3A" stroke="#555" stroke-width="0.3"/>

  <!-- Main spout body — chrome block -->
  <rect x="170" y="231" width="40" height="22" rx="3" fill="url(#chrome)" stroke="#AAA" stroke-width="0.3"/>
  <!-- Chrome highlight on body -->
  <rect x="187" y="233" width="5" height="18" rx="1" fill="rgba(255,255,255,0.18)"/>

  <!-- Dual coffee nozzles — the central pair -->
  <rect x="179" y="253" width="5" height="28" rx="2" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.3"/>
  <rect x="196" y="253" width="5" height="28" rx="2" fill="url(#spout-chrome)" stroke="#AAA" stroke-width="0.3"/>

  <!-- Milk system nozzle — right side, slightly thinner -->
  <rect x="207" y="242" width="4" height="34" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.25"/>

  <!-- Hot water nozzle — left side -->
  <rect x="169" y="244" width="4" height="30" rx="1.5" fill="url(#spout-chrome)" stroke="#999" stroke-width="0.25"/>

  <!-- Spreader bar -->
  <rect x="177" y="266" width="26" height="2.5" rx="1" fill="#CCC"/>

  <!-- Nozzle openings -->
  <ellipse cx="182" cy="282" rx="3" ry="3" fill="#888"/>
  <ellipse cx="199" cy="282" rx="3" ry="3" fill="#888"/>
  <ellipse cx="209" cy="277" rx="2" ry="2.5" fill="#777"/>
  <ellipse cx="171" cy="275" rx="2" ry="2.5" fill="#777"/>

  <!-- Cup illumination — warm amber glow strip at bottom of cavity -->
  <rect x="140" y="340" width="100" height="2.5" rx="1" fill="#BB9940" opacity="0.25"/>
  <rect x="155" y="342" width="70" height="2" rx="1" fill="#DDAA44" opacity="0.1"/>

  <!-- Small control buttons on the aluminum body flanking the dispensing area -->
  <!-- Left button -->
  <circle cx="82" cy="335" r="4.5" fill="#333" stroke="#555" stroke-width="0.5"/>
  <circle cx="82" cy="335" r="1.8" fill="#444"/>
  <!-- Right button — power symbol -->
  <circle cx="298" cy="335" r="4.5" fill="#333" stroke="#555" stroke-width="0.5"/>
  <circle cx="298" cy="335" r="1.2" fill="none" stroke="#666" stroke-width="0.7"/>
  <line x1="298" y1="331.5" x2="298" y2="333.2" stroke="#666" stroke-width="0.7"/>

  <!-- ======== DRIP TRAY — aluminum, wider than the body ======== -->
  <path d="
    M32 365
    L32 395
    Q32 410 52 412
    L328 412
    Q348 410 348 395
    L348 365
    Z
  " fill="url(#dark-inox-v)" stroke="#777" stroke-width="0.5"/>
  <!-- Top edge highlight on drip tray -->
  <path d="M32 365 L348 365 L348 372 Q190 376 32 372 Z" fill="rgba(255,255,255,0.05)"/>

  <!-- Black grate inset with vertical lines (matching Z10 reference) -->
  <rect x="50" y="370" width="280" height="30" rx="3" fill="#151515"/>
  <!-- Vertical grate lines -->
  <line x1="68" y1="374" x2="68" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="82" y1="374" x2="82" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="96" y1="374" x2="96" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="110" y1="374" x2="110" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="124" y1="374" x2="124" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="138" y1="374" x2="138" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="152" y1="374" x2="152" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="166" y1="374" x2="166" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="180" y1="374" x2="180" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="194" y1="374" x2="194" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="208" y1="374" x2="208" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="222" y1="374" x2="222" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="236" y1="374" x2="236" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="250" y1="374" x2="250" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="264" y1="374" x2="264" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="278" y1="374" x2="278" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="292" y1="374" x2="292" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="306" y1="374" x2="306" y2="396" stroke="#252525" stroke-width="0.6"/>
  <line x1="320" y1="374" x2="320" y2="396" stroke="#252525" stroke-width="0.6"/>

  <!-- Chrome trim below grate -->
  <line x1="42" y1="404" x2="338" y2="404" stroke="#999" stroke-width="0.4"/>

  <!-- ======== BLACK BASE ======== -->
  <path d="M46 410 Q46 428 68 430 L312 430 Q334 428 334 410 Z" fill="#151515"/>
  <!-- Base edge highlight -->
  <line x1="62" y1="430" x2="318" y2="430" stroke="#666" stroke-width="0.3"/>
</svg>`,
};
