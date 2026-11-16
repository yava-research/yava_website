import Link from "next/link";

export default function NotFound() {
  return <section className="container not-found">
    <h1>This page isn’t available</h1>
    <p>The link may have changed, or the research may still be in preparation. Browse the published archive or return to the fund.</p>
    <div className="hero__actions"><Link className="btn btn--solid" href="/publications">Browse publications</Link><Link className="btn btn--outline" href="/">Return home</Link></div>
  </section>;
}
