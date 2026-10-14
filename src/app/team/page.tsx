import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/Portrait";
import { groups, members } from "@/data/members";

export const metadata: Metadata = {
  title: "Team",
  description: "The analysts and portfolio managers behind the Yavapai Alternative Management Fund.",
};

export default function TeamPage() {
  return (
    <>
      <header className="container page-header">
        <div className="page-header__main">
          <span className="eyebrow">Our Team</span>
          <h1 className="page-header__title">The people behind the fund</h1>
        </div>
        <p className="page-header__blurb">
          Analysts and portfolio managers from across the University of Arizona, united by a long-term
          view of energy, AI, and technology.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.name} className="container team-group" aria-label={group.name}>
          <div className="section-head">
            <h2 className="section-head__title">{group.name}</h2>
            <span className="section-head__meta mono-label">{group.meta}</span>
          </div>
          <div className="team-grid">
            {members
              .filter((m) => m.group === group.name)
              .map((m) => (
                <Link key={m.slug} href={`/team/${m.slug}`} className="member-card">
                  <Portrait name={m.name} photo={m.photo} />
                  <div>
                    <h3 className="member-card__name">{m.name}</h3>
                    <p className="member-card__role mono-label">{m.role}</p>
                  </div>
                  <dl className="facts">
                    <div className="facts__row">
                      <dt className="mono-label">Major</dt>
                      <dd>{m.major}</dd>
                    </div>
                    <div className="facts__row">
                      <dt className="mono-label">Class</dt>
                      <dd>{m.classYear}</dd>
                    </div>
                    <div className="facts__row">
                      <dt className="mono-label">Previous</dt>
                      <dd>{m.previous}</dd>
                    </div>
                  </dl>
                  <span className="member-card__cta">View bio →</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
