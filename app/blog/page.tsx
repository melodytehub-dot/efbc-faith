import Link from 'next/link';
import Icon from '../../components/Icons';
import Footer from '../../components/Footer';
import { wpBlogPosts } from '../../lib/wp-data';

export default function BlogPage() {
  return (
    <>
      <section className="block block--flush">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">From the church</span><h1 style={{ fontSize: 'clamp(38px,4.5vw,64px)' }}>Stories & reflections.</h1></div>
          </div>
          <div className="grid grid--2">
            {wpBlogPosts.map((p) => (
              <Link className="card" href={`/blog/${p.slug}/`} key={p.id}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--p-accent)' }}>{p.date?.slice(0, 10)}</span>
                <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                <p>{p.text.slice(0, 180)}{p.text.length > 180 ? '…' : ''}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'var(--p-accent)' }}>Read <Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
