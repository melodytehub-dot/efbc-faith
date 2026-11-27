import type { Metadata } from "next";
import { LiveStream } from "@/components/LiveStream";

export const metadata: Metadata = { title: "Live stream" };

export default function LivePage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="pill live-pill">
          <span className="live-dot" /> Live stream
        </span>
        <h1 style={{ marginTop: 16 }}>Join us online</h1>
        <p className="lede">Watch our services as they happen. The video appears here when we go live.</p>
      </header>

      <LiveStream />

      <section className="section" style={{ paddingTop: 28 }}>
        <p className="fine">Live chat is available on YouTube during broadcasts. Sign in there to join the conversation.</p>
      </section>
    </div>
  );
}
