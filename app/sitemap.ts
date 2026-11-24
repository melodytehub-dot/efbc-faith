import type { MetadataRoute } from 'next';
import { wpBlogPosts } from '../lib/wp-data';

export const dynamic = 'force-static';

const base = 'https://efbcusa.com';

const routes = [
  '', 'bible', 'hymns', 'prayer', 'church', 'community', 'live',
  'sermons', 'blog', 'events', 'faq', 'giving', 'contact', 'profile', 'more',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...routes.map((r) => ({ url: `${base}/${r}`, lastModified: now, changeFrequency: 'weekly' as const, priority: r === '' ? 1 : 0.7 })),
    ...wpBlogPosts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date || now), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
