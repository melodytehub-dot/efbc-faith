import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Give" };

export default function GivePage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Giving</span>
        <h1>Give to support the church</h1>
        <p className="lede">
          Your giving helps us worship, serve our community, and share the Gospel. To give, or to ask
          how your gift is used, contact the church office.
        </p>
      </header>
      <div className="card" style={{ maxWidth: 640, display: "grid", gap: 18 }}>
        <div className="info-item">
          <span className="tile-ic">
            <Icon name="heart" />
          </span>
          <div>
            <b>Contact the church office</b>
            <span className="muted">Our team will share how to give.</span>
          </div>
        </div>
        <div className="btn-row">
          <a className="btn btn-primary" href={`tel:${church.phoneLinks[0]}`}>
            <Icon name="phone" /> Call the office
          </a>
        </div>
      </div>
    </div>
  );
}
