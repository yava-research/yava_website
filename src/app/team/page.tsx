import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/Portrait";
import { groups, members } from "@/data/members";
import { showTeam } from "@/data/site";
import { notFound } from "next/navigation";

export const metadata: Metadata = showTeam ? {
  title: "Team",
  description: "The analysts and portfolio managers behind the Yavapai Alternative Management Fund.",
} : {};

export default function TeamPage() {
  if (!showTeam) notFound();
  return (
    <>
      <header className="container page-header">
        <div className="page-header__main">
          <h1 className="page-header__title">The people behind the fund</h1>
        </div>
        <p className="page-header__blurb">
          Student research across markets, energy, AI, and technology. Aditya Thirumalai is our current member;
          the remaining profiles are clearly marked synthetic examples.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.name} className="container team-group" aria-label={group.name}>
          <div className="section-head">
            <h2 className="section-head__title">{group.name}</h2>
            <span className="section-head__meta meta-label">{group.meta}</span>
          </div>
          <div className="team-grid">
            {members
              .filter((m) => m.group === group.name)
              .map((m) => (
                <Link key={m.slug} href={`/team/${m.slug}`} className="member-card">
                  <Portrait name={m.name} photo={m.photo} />
                  <div>
                    <h3 className="member-card__name">{m.name}</h3>
                    <p className="member-card__role">{m.role}</p>
                    {m.synthetic && <span className="sample-label">Synthetic profile</span>}
                  </div>
                  <dl className="facts">
                    <div className="facts__row">
                      <dt className="meta-label">Major</dt>
                      <dd>{m.major}</dd>
                    </div>
                    <div className="facts__row">
                      <dt className="meta-label">Class</dt>
                      <dd>{m.classYear}</dd>
                    </div>
                    {!m.synthetic && m.previous && <div className="facts__row">
                      <dt className="meta-label">Previous</dt>
                      <dd>{m.previous}</dd>
                    </div>}
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
