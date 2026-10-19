import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { newestFirst } from '../lib/order';

export async function GET(context) {
	// Newest first, as a feed reader expects, and the same day by id (getCollection's order varies by build).
	const posts = (await getCollection('blog')).sort(newestFirst);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
