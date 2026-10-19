import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
	const posts = (await getCollection('deepbrew'))
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	return rss({
		title: 'Deep Brew | JayArr Coffee',
		description: 'Long-form coffee science articles grounded in peer-reviewed research.',
		// The channel's own page is Deep Brew, not the homepage. Item links are root-relative, so they
		// still resolve against the site's origin.
		site: new URL('/deep-brew/', context.site).href,
		items: posts.map((post) => ({
			...post.data,
			link: `/deep-brew/research/${post.id}/`,
		})),
	});
}
