import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { church, ministries } from "@/lib/church";

export const metadata: Metadata = { title: "Ministries" };

export default function MinistriesPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Community</span>
        <h1>Ministries for every generation</h1>
        <p className="lede">
          From children and youth to women, music, and mission, our ministries help the church family
          grow together. Contact the church office to join or ask about a ministry.
        </p>
      </header>

      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="photo" style={{ aspectRatio: "4 / 3.4" }}>
          <img src="/images/youth.jpg" alt="Youth and children in traditional Chin attire" />
        </div>
        <div className="photo" style={{ aspectRatio: "4 / 3.4" }}>
          <img src="/images/worship.jpg" alt="A worship leader singing during a service" />
        </div>
        <div className="photo" style={{ aspectRatio: "4 / 3.4" }}>
          <img src="/images/fellowship.jpg" alt="Members of the church sharing fellowship" />
        </div>
      </div>

      <ul className="grid-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {ministries.map((name) => (
          <li
            key={name}
            className="value"
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 22 }}
          >
            <h3>{name}</h3>
            <a className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }} href={`tel:${church.phoneLinks[0]}`}>
              <Icon name="phone" /> Call to ask
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
