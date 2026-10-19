// A stable order for content (Wave F r2). getCollection returns entries in an order that changes from build
// to build (a cold cache and a warm one disagree), and Array.sort keeps that order for ties, so items that
// share a date came out differently: blog pages 6–8, the Deep Brew notes and their related cards, the feeds.
// Every content sort ends on the entry's id, compared by code point, so the same tree builds the same pages.

type Entry = { id: string; data: { pubDate: Date; updatedDate?: Date } };

/** By id, by code point (not locale), as the last word in any sort. */
export const byId = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** Newest published first; the same day by id. */
export const newestFirst = (a: Entry, b: Entry) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || byId(a, b);

/** Most recently updated (or published) first; the same day by id. */
export const latestFirst = (a: Entry, b: Entry) =>
  (b.data.updatedDate ?? b.data.pubDate).valueOf() - (a.data.updatedDate ?? a.data.pubDate).valueOf() || byId(a, b);
