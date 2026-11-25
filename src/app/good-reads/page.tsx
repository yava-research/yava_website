import type { Metadata } from "next";
import { GoodReadsGrid } from "@/components/GoodReadsGrid";
import { goodReads } from "@/data/good-reads";

export const metadata: Metadata = {
  title: "Good Reads",
  description: "Papers, PDFs, letters and tidbits the YAMF desks keep passing around, with what stood out and a link to the source.",
};

export default function GoodReadsPage() {
  const reads = [...goodReads].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <header className="container page-header">
        <div className="page-header__main">
          <h1 className="page-header__title">Good reads</h1>
        </div>
      </header>

      <section className="container reads" aria-label="Good reads">
        <GoodReadsGrid reads={reads} />
      </section>
    </>
  );
}
