// The one list of tools. Header menu, footer, tools hub and cross-links all read it, so a tool
// can't be missing from one place and present in another. URLs are the existing ones.

export type ToolGroup = 'make' | 'fix' | 'know' | 'choose' | 'explore';

export interface ToolEntry {
  id: string;
  name: string;
  href: string;
  /** What it answers, in a few words. */
  blurb: string;
  group: ToolGroup;
  deepBrew?: boolean;
}

export const TOOL_GROUPS: { id: ToolGroup; label: string }[] = [
  { id: 'make', label: 'Make a cup' },
  { id: 'fix', label: 'Fix a cup' },
  { id: 'know', label: 'Know your coffee' },
  { id: 'choose', label: 'Choose gear' },
  { id: 'explore', label: 'Explore' },
];

export const TOOLS: ToolEntry[] = [
  { id: 'brew', name: 'Brew Guide', href: '/tools/brew-ratio/', blurb: 'Coffee, water, grind and every pour for your cup', group: 'make' },
  { id: 'grind', name: 'Grind Guide', href: '/tools/grind-guide/', blurb: 'How fine to grind for your brewer', group: 'make' },
  { id: 'calibrator', name: 'Grind Calibrator', href: '/deep-brew/calibrator/', blurb: 'The number to set on your grinder', group: 'make', deepBrew: true },
  { id: 'water', name: 'Water Recipe Builder', href: '/deep-brew/water/', blurb: 'Mix brewing water to a recipe', group: 'make', deepBrew: true },
  { id: 'drinks', name: 'Coffee Drinks', href: '/tools/drink-builder/', blurb: 'Every espresso drink, layer by layer, from published recipes', group: 'make' },
  { id: 'doctor', name: 'Fix My Coffee', href: '/tools/fix-my-coffee/', blurb: 'Why it tastes sour, bitter or weak', group: 'fix' },
  { id: 'extraction', name: 'Extraction Map', href: '/deep-brew/extraction/', blurb: 'Where your cup sits between sour and bitter', group: 'fix', deepBrew: true },
  { id: 'caffeine', name: 'Caffeine Calculator', href: '/tools/caffeine/', blurb: 'How much is still in you at bedtime', group: 'know' },
  { id: 'freshness', name: 'Freshness', href: '/tools/freshness/', blurb: 'Where your beans are, from roast to stale', group: 'know' },
  { id: 'machines', name: 'Espresso Machines', href: '/tools/espresso-machines/', blurb: 'The right machine for how you drink', group: 'choose' },
  { id: 'pods', name: 'Nespresso Pods', href: '/tools/nespresso-pods/', blurb: 'Pods that fit your machine and your taste', group: 'choose' },
  { id: 'origins', name: 'Origins Atlas', href: '/explore/origins/', blurb: 'Where coffee grows and what it tastes like', group: 'explore' },
  { id: 'flavors', name: 'Flavor Bloom', href: '/explore/flavors/', blurb: 'Find coffees by the notes you like', group: 'explore' },
  { id: 'methods', name: 'Brewing Constellations', href: '/explore/methods/', blurb: 'Every brewing method, mapped', group: 'explore' },
];

export const toolById = (id: string) => TOOLS.find((t) => t.id === id);
