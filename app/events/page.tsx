import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Events</span>
        <h1>Gatherings and events</h1>
        <p className="lede">
          Upcoming church events appear here. For the next gathering, call or email the church office.
        </p>
      </header>

      <div className="empty">
        <h3>No upcoming events are posted yet</h3>
        <p style={{ marginBottom: 22 }}>The church office can share dates for worship, meetings, and fellowship.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a className="btn btn-primary btn-sm" href={`tel:${church.phoneLinks[0]}`}>
            <Icon name="phone" /> Call the church
          </a>
        </div>
      </div>
    </div>
  );
}
