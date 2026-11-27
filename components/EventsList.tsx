"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatShortDate, formatWhen } from "@/lib/format";

export type PublicEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  description: string | null;
  coverUrl: string | null;
};

export function EventsList() {
  const [events, setEvents] = useState<PublicEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    api<{ events: PublicEvent[] }>("/api/events")
      .then((data) => active && setEvents(data.events))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return (
      <div className="empty">
        <h3>Events could not be loaded</h3>
        <p>Please refresh the page, or call the church office for the latest dates.</p>
      </div>
    );
  }

  if (!events) {
    return <div className="event-grid" aria-busy="true" />;
  }

  if (events.length === 0) {
    return (
      <div className="empty">
        <h3>No upcoming events yet</h3>
        <p>New dates will appear here once they are scheduled.</p>
      </div>
    );
  }

  return (
    <ul className="event-grid">
      {events.map((event) => {
        const date = formatShortDate(event.startsAt);
        return (
          <li key={event.id} className="event-card">
            <div className="event-cover">
              {event.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.coverUrl} alt="" loading="lazy" />
              ) : (
                <img src="/images/hero-sunrise.jpg" alt="" loading="lazy" />
              )}
              <span className="event-date">
                <b>{date.day}</b>
                {date.month}
              </span>
            </div>
            <div className="event-body">
              <h3>{event.title}</h3>
              <p className="event-when">{formatWhen(event.startsAt, event.endsAt)}</p>
              {event.location && <p className="event-where">{event.location}</p>}
              {event.description && <p className="event-desc">{event.description}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
