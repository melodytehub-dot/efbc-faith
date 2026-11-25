import Link from "next/link";
import { Greeting } from "@/components/Greeting";
import { Icon, type IconName } from "@/components/Icon";
import { church, verseOfTheDay } from "@/lib/church";

const tiles: { href: string; label: string; sub: string; icon: IconName; live?: boolean }[] = [
  { href: "/bible", label: "Bible", sub: "Hakha Chin, full text", icon: "book" },
  { href: "/prayer", label: "Prayer", sub: "Send a request", icon: "hands" },
  { href: "/about", label: "Church", sub: "Mission and leaders", icon: "church" },
  { href: "/ministries", label: "Community", sub: "Seven ministries", icon: "community" },
  { href: "/live", label: "Live Stream", sub: "Watch on YouTube", icon: "live", live: true },
  { href: "/more", label: "More", sub: "Hymns, giving, contact", icon: "more" },
];

export default function Home() {
  return (
    <div className="wrap">
      <section className="home-top" aria-label="Welcome">
        <div className="hero">
          <img src="/images/hero-sunrise.jpg" alt="Sunrise over a field of crosses" />
          <Greeting />
          <h1>Hope in Jesus Christ</h1>
          <p>
            Experience God&apos;s love and grace, uniting you through hope and healing. Come as you
            are, and leave with hope.
          </p>
          <div className="btn-row">
            <Link href="/live" className="btn btn-primary">
              <Icon name="play" /> Watch live
            </Link>
            <Link href="/bible" className="btn btn-ghost">
              Read the Bible
            </Link>
          </div>
        </div>

        <div className="home-side">
          <nav className="tiles" aria-label="Explore">
            {tiles.map((t) => (
              <Link key={t.href} href={t.href} className={`tile${t.live ? " is-live" : ""}`}>
                <span className="tile-ic">
                  <Icon name={t.icon} className="ic-lg" />
                </span>
                <span>
                  <span className="tile-label" style={{ display: "block" }}>
                    {t.label}
                  </span>
                  <span className="tile-sub">{t.sub}</span>
                </span>
              </Link>
            ))}
          </nav>

          <figure className="verse" style={{ margin: 0 }}>
            <blockquote>
              <p>&ldquo;{verseOfTheDay.english}&rdquo;</p>
            </blockquote>
            <cite>{verseOfTheDay.reference}</cite>
            <p className="chin">{verseOfTheDay.chin}</p>
          </figure>
        </div>
      </section>

      <section className="section welcome-band">
        <div className="stack">
          <span className="eyebrow">Welcome to EFBC</span>
          <h2>Experience God&apos;s love and grace</h2>
          <p className="lede">
            At Emmanuel Farm Baptist Church, we believe that God&apos;s love is the foundation, and
            His grace is the invitation to a life transformed. In a world filled with brokenness, we
            gather to be united through hope and healing, anchored in the truth of Jesus Christ.
          </p>
          <p className="muted">
            &ldquo;He heals the brokenhearted and binds up their wounds.&rdquo; Psalm 147:3
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link href="/about" className="btn btn-ghost">
              About our church
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Plan a visit
            </Link>
          </div>
        </div>
        <div className="photo" style={{ aspectRatio: "4 / 3" }}>
          <img src="/images/congregation.jpg" alt="Members of the congregation gathered together" />
        </div>
      </section>

      <section className="section" aria-label="At a glance">
        <div className="stat-row">
          <div className="stat">
            <b>514</b>
            <span>Hymns in Hakha Chin</span>
          </div>
          <div className="stat">
            <b>51</b>
            <span>Readings in Hakha Chin</span>
          </div>
          <div className="stat">
            <b>66</b>
            <span>Books of the Bible in Chin</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Our mission</span>
            <h2 style={{ marginTop: 14 }}>Speaking the truth in love</h2>
            <p>
              We gather to worship God, glorify His name, and grow together in spiritual maturity,
              as Burmese Chin believers.
            </p>
          </div>
          <Link href="/about" className="btn btn-ghost">
            Read our story
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 8 }}>
        <div className="card" style={{ display: "grid", gap: 18 }}>
          <div className="info-item">
            <span className="tile-ic">
              <Icon name="pin" />
            </span>
            <div>
              <b>Visit us</b>
              <span className="muted">
                {church.address.line1}, {church.address.cityLine}
              </span>
            </div>
          </div>
          <div className="info-item">
            <span className="tile-ic">
              <Icon name="clock" />
            </span>
            <div>
              <b>Office hours</b>
              <span className="muted">{church.officeHours}</span>
            </div>
          </div>
          <div className="btn-row">
            <a className="btn btn-primary btn-sm" href={`tel:${church.phoneLinks[0]}`}>
              <Icon name="phone" /> Call the church
            </a>
            <a className="btn btn-ghost btn-sm" href="/contact/">
              <Icon name="mail" /> Contact us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
