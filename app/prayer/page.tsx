import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Prayer" };

export default function PrayerPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Prayer</span>
        <h1>We are praying with you</h1>
      </header>

      <div className="photo" style={{ aspectRatio: "16 / 6", marginBottom: 28 }}>
        <img src="/images/prayer-banner.png" alt="By His wounds we are healed" style={{ objectFit: "cover" }} />
      </div>

      <div className="card" style={{ display: "grid", gap: 18, maxWidth: 640 }}>
        <h3>Share a prayer request</h3>
        <p className="muted">
          For now, call the church office during office hours and we will pray with you.
        </p>
        <a className="btn btn-primary" href={`tel:${church.phoneLinks[0]}`}>
          <Icon name="phone" /> {church.phones[0]}
        </a>
        <a className="btn btn-ghost" href={`tel:${church.phoneLinks[1]}`}>
          <Icon name="phone" /> {church.phones[1]}
        </a>
        <p className="fine">Office hours: {church.officeHours}</p>
      </div>
    </div>
  );
}
