import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '../../../components/Icons';
import Footer from '../../../components/Footer';
import { wpBlogPosts } from '../../../lib/wp-data';

export function generateStaticParams() {
  return wpBlogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = wpBlogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="block block--flush">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Link href="/blog/" className="mono" style={{ fontSize: 12, color: 'var(--p-accent)', display: 'inline-flex', gap: 8, alignItems: 'center' }}><Icon name="back" /> All stories</Link>
          <span className="eyebrow" style={{ marginTop: 32 }}>{post.date?.slice(0, 10)}</span>
          <h1 style={{ fontSize: 'clamp(34px,4vw,56px)', marginTop: 10 }}>{post.title}</h1>
          <div style={{ marginTop: 30, fontSize: 18, lineHeight: 1.8, color: 'var(--p-muted)' }}>
            {post.text.split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean).map((para, i) => <p key={i} style={{ marginBottom: 20 }}>{para}</p>)}
          </div>
          <a className="btn btn--ghost" style={{ marginTop: 20 }} href={post.link} target="_blank" rel="noreferrer">View original <Icon name="arrow" /></a>
        </div>
      </article>
      <Footer />
    </>
  );
}
