// Live WordPress content snapshot, refreshed by `npm run sync:wp` before every build.
import raw from '../data/wp-content.json';

export type WPItem = {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: string;
  text: string;
  image: number | null;
  imageUrl: string | null;
};

export const wpContent = raw as {
  generatedAt: string;
  source: string;
  pages: WPItem[];
  sermons: WPItem[];
  ministries: WPItem[];
  events: WPItem[];
  posts: WPItem[];
};

export const wpBlogPosts = wpContent.posts;
export const wpSermons = wpContent.sermons;
export const wpPages = wpContent.pages;

export function wpPage(slug: string): WPItem | undefined {
  return wpContent.pages.find((p) => p.slug === slug);
}
