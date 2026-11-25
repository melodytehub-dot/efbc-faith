import type { Metadata } from "next";
import { church, aboutIntro, coreValues, leadership, mission, vision, verseOfTheDay } from "@/lib/church";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const initials = (name: string) =>
    name
      .replace(/^Pu\.\s*/, "")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">About EFBC</span>
        <h1>Growing in truth. Living in love.</h1>
        <p className="lede">{aboutIntro}</p>
      </header>

      <div className="photo" style={{ aspectRatio: "16 / 7" }}>
        <img src="/images/sanctuary.jpg" alt="Inside the sanctuary during a service" />
      </div>

      <section className="section grid-2" aria-label="Mission and vision">
        <div className="card">
          <span className="eyebrow">Our mission</span>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>{mission}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Our vision</span>
          <p style={{ marginTop: 16, color: "var(--muted)" }}>{vision}</p>
        </div>
      </section>

      <section className="section">
        <div className="verse">
          <blockquote>
            <p>&ldquo;{verseOfTheDay.english}&rdquo;</p>
          </blockquote>
          <cite>{verseOfTheDay.reference}</cite>
          <p className="chin">{verseOfTheDay.chin}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Core values</span>
            <h2 style={{ marginTop: 14 }}>Grounded in Ephesians 4:15</h2>
            <p>We commit to the following as a church family.</p>
          </div>
        </div>
        <div className="grid-3">
          {coreValues.map((v) => (
            <div key={v.title} className="value">
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Leadership</span>
            <h2 style={{ marginTop: 14 }}>Our leaders and servants</h2>
          </div>
        </div>
        <ul className="grid-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {leadership.map((p) => (
            <li key={p.name} className="person">
              <span className="avatar" aria-hidden="true">
                {initials(p.name)}
              </span>
              <span>
                <b>{p.name}</b>
                <span>{p.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="btn-row">
          <a className="btn btn-primary" href="/contact/">
            Contact the church
          </a>
          <a className="btn btn-ghost" href="/live">
            Watch a service
          </a>
        </div>
      </section>
    </div>
  );
}
