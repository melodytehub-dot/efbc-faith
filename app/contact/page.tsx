import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Contact</span>
        <h1>Visit or reach out</h1>
        <p className="lede">We would love to hear from you. Call, email, or come by the church.</p>
      </header>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card" style={{ display: "grid", gap: 22 }}>
          <div className="info-item">
            <span className="tile-ic">
              <Icon name="pin" />
            </span>
            <div>
              <b>Address</b>
              <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer">
                {church.address.line1}
                <br />
                {church.address.cityLine}
              </a>
            </div>
          </div>
          <div className="info-item">
            <span className="tile-ic">
              <Icon name="phone" />
            </span>
            <div>
              <b>Phone</b>
              {church.phones.map((p, i) => (
                <a key={p} href={`tel:${church.phoneLinks[i]}`} style={{ display: "block" }}>
                  {p}
                </a>
              ))}
            </div>
          </div>
          <div className="info-item">
            <span className="tile-ic">
              <Icon name="mail" />
            </span>
            <div>
              <b>Email</b>
              {church.emails
                .filter((e) => e !== church.emails[0])
                .map((e) => (
                  <a key={e} href={`mailto:${e}`} style={{ display: "block" }}>
                    {e}
                  </a>
                ))}
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
        </div>

        <div className="stack">
          <a
            href={church.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
            style={{ display: "block", textDecoration: "none" }}
          >
            <span className="eyebrow">Find us</span>
            <p style={{ marginTop: 14, fontSize: 18, fontWeight: 600 }}>
              {church.address.line1}, {church.address.cityLine}
            </p>
            <p className="muted" style={{ marginTop: 8 }}>
              Open in maps for directions.
            </p>
          </a>
          <div className="photo" style={{ aspectRatio: "4 / 3" }}>
            <img src="/images/pulpit.jpg" alt="A preacher speaking from the pulpit" />
          </div>
        </div>
      </div>
    </div>
  );
}
