import type { Metadata } from "next";
import { EventsList } from "@/components/EventsList";
import { church } from "@/lib/church";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Events</span>
        <h1>Upcoming events</h1>
        <p className="lede">For questions about a gathering, call the church office at {church.phones[0]}.</p>
      </header>

      <section className="section" style={{ paddingTop: 36 }}>
        <EventsList />
      </section>
    </div>
  );
}
