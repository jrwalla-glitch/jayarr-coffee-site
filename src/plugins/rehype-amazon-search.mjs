// Marks article links that open an Amazon search, so they say they're searches (How We Make This and the
// affiliate disclosure promise it). Most article buying links are searches (amazon.com/s?k=…) whose text is a
// bare product name; this adds a small visible "(Amazon search)" inside each one, after its text, so it is
// read as part of the link's name and stays out of its href. Exact product links (/dp/) are left alone.
//
// MDX hands inline JSX anchors (<a href="…">) to rehype as mdxJsxTextElement nodes, and Markdown links as
// hast elements; both are handled. A search link inside a heading, a table header or a ToolCallout gets no
// marker there: a heading's text is its anchor and its outline entry. A heading's search link is explained
// by a short line straight after the heading instead.

const SEARCH = /^https?:\/\/(?:www\.)?amazon\.com\/s\?/i;
const MARK = 'amz-search';
const NOTE = 'amz-search-note';
// Inline styles: the plugin has no stylesheet of its own. inline-block keeps the link's underline off the
// marker, and a plain space before it (not a margin) means a marker that wraps starts flush at the line's edge.
// The color is the ink-2 token, which Deep Brew's dark theme redefines.
const MARK_STYLE = 'display:inline-block;font-size:.78em;line-height:1;color:var(--color-ink-2,#5b4a3d);white-space:nowrap;text-decoration:none';
const NOTE_STYLE = 'margin:-.35em 0 .9em;font-size:.85em;color:var(--color-ink-2,#5b4a3d)';

const isJsx = (n) => n.type === 'mdxJsxTextElement' || n.type === 'mdxJsxFlowElement';
const jsxAttr = (n, name) => n.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name)?.value;
const hrefOf = (n) => (n.type === 'element' && n.tagName === 'a' ? n.properties?.href : isJsx(n) && n.name === 'a' ? jsxAttr(n, 'href') : undefined);
const tagOf = (n) => (n.type === 'element' ? n.tagName : isJsx(n) ? n.name : undefined);
const isHeading = (n) => /^h[1-6]$/.test(tagOf(n) ?? '');
const isBlocked = (n) => isHeading(n) || tagOf(n) === 'th' || tagOf(n) === 'ToolCallout';
const hasClass = (n, c) => {
  if (n.type === 'element') { const k = n.properties?.className; return Array.isArray(k) ? k.includes(c) : k === c; }
  return isJsx(n) && String(jsxAttr(n, 'className') ?? jsxAttr(n, 'class') ?? '').split(/\s+/).includes(c);
};
const isSearch = (n) => typeof hrefOf(n) === 'string' && SEARCH.test(hrefOf(n));

function marker() {
  return { type: 'element', tagName: 'span', properties: { className: [MARK], style: MARK_STYLE }, children: [{ type: 'text', value: '(Amazon search)' }] };
}
function note(count) {
  const text = count === 1 ? 'The link above opens an Amazon search.' : 'The links above open Amazon searches.';
  return { type: 'element', tagName: 'p', properties: { className: [NOTE], style: NOTE_STYLE }, children: [{ type: 'text', value: text }] };
}
function searchLinksIn(n, out = []) {
  if (isSearch(n)) out.push(n);
  for (const c of n.children ?? []) searchLinksIn(c, out);
  return out;
}

export default function rehypeAmazonSearch() {
  return (tree, file) => {
    let marked = 0, noted = 0;
    const walk = (node) => {
      const kids = node.children;
      if (!kids) return;
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        // A heading with a search link: leave its text alone and say so on the next line.
        if (isHeading(child)) {
          const links = searchLinksIn(child);
          const next = kids[i + 1];
          if (links.length && !(next && hasClass(next, NOTE))) { kids.splice(i + 1, 0, note(links.length)); noted += links.length; }
          continue;
        }
        if (isBlocked(child)) continue;
        if (isSearch(child)) {
          const last = child.children?.[child.children.length - 1];
          if (!(last && hasClass(last, MARK))) { child.children = [...(child.children ?? []), { type: 'text', value: ' ' }, marker()]; marked++; }
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
    if (file?.data) file.data.amazonSearch = { marked, noted };
  };
}
