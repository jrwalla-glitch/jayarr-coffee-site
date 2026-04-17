<script>
  // FlavorRings — concentric ellipses inside the collection cup
  // Concept art ref: 00-apparatus-v3-final.png (cup interior with colored rings)
  // Colors from Flavor Bloom palette
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { flavorProfile = null } = $props();

  // Flavor Bloom palette — maps flavor categories to ring colors
  const FLAVOR_COLORS = {
    fruity:  '#E8834A',  // warm orange
    floral:  '#D4728C',  // pink
    sweet:   '#E6A644',  // amber/honey
    nutty:   '#A67C52',  // brown
    cocoa:   '#6B4226',  // dark brown
    spicy:   '#C44D3F',  // red-brown
    roasted: '#8B5E2B',  // roast brown
    earthy:  '#7A8B5C',  // olive
    herbal:  '#6B9E6B',  // sage green
    citrus:  '#E8B84A',  // yellow-orange
    berry:   '#9B4DCA',  // purple
    tropical:'#44B89E',  // teal
  };

  // Default ring data when no profile
  const defaultRings = [
    { color: '#D4C5A9', rx: 30, ry: 12, opacity: 0.2 },
    { color: '#D4C5A9', rx: 22, ry: 9, opacity: 0.15 },
    { color: '#D4C5A9', rx: 14, ry: 6, opacity: 0.1 },
  ];

  // Parse flavor notes into ring data
  let rings = $derived.by(() => {
    if (!flavorProfile?.expect) return defaultRings;

    // Parse the "expect" string for flavor keywords
    const text = (flavorProfile.expect || '').toLowerCase();
    const matched = [];

    for (const [key, color] of Object.entries(FLAVOR_COLORS)) {
      if (text.includes(key)) {
        matched.push({ key, color });
      }
    }

    // Also check common note words
    const noteMap = {
      'blueberry': 'berry', 'strawberry': 'berry', 'raspberry': 'berry',
      'lemon': 'citrus', 'orange': 'citrus', 'lime': 'citrus', 'grapefruit': 'citrus',
      'jasmine': 'floral', 'rose': 'floral', 'lavender': 'floral',
      'chocolate': 'cocoa', 'cacao': 'cocoa',
      'caramel': 'sweet', 'honey': 'sweet', 'brown sugar': 'sweet', 'toffee': 'sweet',
      'mango': 'tropical', 'pineapple': 'tropical', 'papaya': 'tropical',
      'almond': 'nutty', 'hazelnut': 'nutty', 'walnut': 'nutty', 'pecan': 'nutty',
      'cinnamon': 'spicy', 'clove': 'spicy', 'pepper': 'spicy',
    };

    for (const [word, category] of Object.entries(noteMap)) {
      if (text.includes(word) && !matched.find(m => m.key === category)) {
        matched.push({ key: category, color: FLAVOR_COLORS[category] });
      }
    }

    if (matched.length === 0) {
      // Fallback: use a warm default
      return [
        { color: '#E8834A', rx: 30, ry: 12, opacity: 0.4 },
        { color: '#E6A644', rx: 22, ry: 9, opacity: 0.35 },
        { color: '#D4728C', rx: 14, ry: 6, opacity: 0.3 },
      ];
    }

    // Build rings from matched flavors (up to 4, outermost = most prominent)
    const maxRings = Math.min(matched.length, 4);
    return matched.slice(0, maxRings).map((m, i) => ({
      color: m.color,
      rx: 30 - i * 7,
      ry: 12 - i * 2.5,
      opacity: 0.45 - i * 0.05,
    }));
  });

  const cx = 50;
  const cy = 28;
</script>

<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" class="flavor-rings">
  <!-- Liquid surface shimmer -->
  <ellipse cx={cx} cy={cy} rx="38" ry="16" fill="#F5F0E6" opacity="0.3" />

  <!-- Flavor rings (outermost first) -->
  {#each rings as ring, i}
    <ellipse
      cx={cx} cy={cy}
      rx={ring.rx} ry={ring.ry}
      fill="none"
      stroke={ring.color}
      stroke-width="2.5"
      opacity={ring.opacity}
    />
  {/each}

  <!-- Center dot (liquid surface reflection) -->
  <ellipse cx={cx} cy={cy} rx="4" ry="2" fill="#C17A3A" opacity="0.2" />
</svg>

<style>
  .flavor-rings {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
