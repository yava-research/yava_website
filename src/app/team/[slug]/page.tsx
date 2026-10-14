import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Portrait } from "@/components/Portrait";
import { PublicationRow } from "@/components/PublicationRow";
import { getMember, members } from "@/data/members";
import { publicationsBy } from "@/data/publications";
import { getArticleSlugs } from "@/lib/articles";

export function generateStaticParams() {
  return members.map((m) => ({ slug: m.slug }));
}

// The whole page depends on the slug, so there is no static shell to show
// instantly — render as a normal blocking route.
// (Without this, dev logs an `instant-shell-url-data` validation error.)
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = getMember(slug);
  return member ? { title: member.name, description: member.bio[0] } : {};
}

export default async function MemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();

  const firstName = member.name.split(" ")[0];
  const pubs = publicationsBy(member.byline);
  const articleSlugs = new Set(getArticleSlugs());
  const [lede, ...rest] = member.bio;

  return (
    <>
      <nav className="container breadcrumb mono-label" aria-label="Breadcrumb">
        <Link href="/team">← Team</Link>
        <span style={{ color: "var(--ochre)" }}>/</span>
        <span style={{ color: "var(--muted)" }}>{member.group}</span>
      </nav>

      <article className="container profile">
        <Portrait name={member.name} photo={member.photo} priority />

        <div className="profile__info">
          <header>
            <span className="eyebrow" style={{ fontSize: 13 }}>
              {member.role}
            </span>
            <h1 className="profile__name">{member.name}</h1>
          </header>

          <dl className="fact-strip">
            <div>
              <dt className="mono-label">Major</dt>
              <dd>{member.major}</dd>
            </div>
            <div>
              <dt className="mono-label">Class</dt>
              <dd>{member.classYear}</dd>
            </div>
            <div>
              <dt className="mono-label">Previous</dt>
              <dd>{member.previous}</dd>
            </div>
            <div>
              <dt className="mono-label">Hometown</dt>
              <dd>{member.hometown}</dd>
            </div>
          </dl>

          <div className="bio">
            <p className="bio__lede">{lede}</p>
            {rest.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          {(member.linkedin || member.email) && (
            <div className="contact-actions">
              {member.linkedin && (
                <a href={member.linkedin} className="btn btn--solid btn--sm" target="_blank" rel="noreferrer">
                  LinkedIn →
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="btn btn--outline btn--sm">
                  {member.email}
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      {pubs.length > 0 && (
        <section className="container member-pubs" aria-labelledby="member-pubs-title">
          <div className="section-head">
            <h2 id="member-pubs-title" className="section-head__title">
              Publications by {firstName}
            </h2>
            <span className="section-head__meta mono-label">
              {pubs.length} {pubs.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
          <ul className="pub-list">
            {pubs.map((p) => (
              <PublicationRow key={p.slug} pub={p} hasArticle={articleSlugs.has(p.slug)} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
