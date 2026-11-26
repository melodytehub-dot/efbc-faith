import type { Metadata } from "next";
import { BibleReader } from "@/components/BibleReader";

export const metadata: Metadata = { title: "Bible" };

export default function BiblePage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Baibal Thiang</span>
        <h1>Read the Bible in Hakha Chin</h1>
      </header>
      <BibleReader />
    </div>
  );
}
