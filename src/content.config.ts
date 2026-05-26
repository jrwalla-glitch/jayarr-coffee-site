import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIES = ['Origins', 'Equipment', 'Brewing', 'Science', 'Recipes', 'Drinks', 'Industry'] as const;
export type Category = typeof CATEGORIES[number];

export const DB_CATEGORIES = ['Chemistry', 'Physics', 'Roasting', 'Agriculture'] as const;
export type DBCategory = typeof DB_CATEGORIES[number];

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			category: z.enum(['Origins', 'Equipment', 'Brewing', 'Science', 'Recipes', 'Drinks', 'Industry']).optional(),
			videoId: z.string().optional(),
		}),
});

const deepbrew = defineCollection({
	loader: glob({ base: './src/content/deepbrew', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		category: z.enum(['Chemistry', 'Physics', 'Roasting', 'Agriculture']),
		tags: z.array(z.string()).optional(),
	}),
});

const faq = defineCollection({
	loader: glob({ base: './src/content/faq', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		question: z.string(),
		shortAnswer: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tool: z.enum(['brew-ratio', 'caffeine', 'fix-my-coffee', 'freshness', 'grind-guide', 'drink-builder', 'espresso-machines', 'nespresso-pods']),
		pillar: z.string().optional(),
		cluster: z.enum(['caffeine', 'freshness', 'espresso', 'culture']),
	}),
});

export const collections = { blog, deepbrew, faq };
