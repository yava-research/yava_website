import Link from "next/link";
import { publications, formatDate, type Publication } from "@/data/publications";
import { getArticleSlugs } from "@/lib/articles";

const PROGRAM = [
  {
    title: "General Body Meetings",
    text: "Weekly meetings to discuss investment ideas, market moves, and the stories behind them.",
  },
  {
    title: "Sector Analysis",
    text: "Join one of our desks. Track earnings, write weekly notes, and build coverage models.",
  },
  {
    title: "Skills Development",
    text: "Interview prep, financial modeling, and research workshops led by members and alumni.",
  },
  {
    title: "High Conviction Research",
    text: "Monitor positions and report on them every quarter. Write in-depth memos and research papers, with the goal of publishing in journals.",
  },
];

const THEMES = ["Commodities", "Macro", "Fixed Income", "Emerging Markets", "Cryptocurrency", "Prediction Markets"];

/**
 * Dawn over the dunes: the sun rises behind the title and sets again in the footer.
 * Layers run back to front; the last one is the page sand, so the hero melts into the next section.
 */
function Dunes() {
  return (
    <svg className="home-hero__dunes" viewBox="0 0 1440 240" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 92 C 180 52, 360 46, 540 76 C 720 106, 880 58, 1060 50 C 1220 44, 1340 70, 1440 84 L1440 240 L0 240 Z"
        fill="#E8D3B0"
      />
      <path
        d="M0 138 C 220 104, 420 110, 640 128 C 860 146, 1060 102, 1260 104 C 1350 105, 1400 112, 1440 118 L1440 240 L0 240 Z"
        fill="#D9BB8E"
      />
      <path
        d="M0 178 C 260 156, 520 166, 760 176 C 1000 186, 1240 160, 1440 166 L1440 240 L0 240 Z"
        fill="#C9A57A"
      />
      <path
        d="M0 214 C 300 198, 620 210, 920 206 C 1160 203, 1320 210, 1440 206 L1440 240 L0 240 Z"
        fill="#F6F1E8"
      />
    </svg>
  );
}

function publicationHref(pub: Publication, articleSlugs: string[]) {
  if (articleSlugs.includes(pub.slug)) return `/publications/${pub.slug}`;
  return pub.href;
}

export default function Home() {
  const articleSlugs = getArticleSlugs();
  const [latest, ...rest] = publications;
  const more = rest.slice(0, 3);
  const latestHref = latest ? publicationHref(latest, articleSlugs) : undefined;

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__sun" aria-hidden="true" />
        <div className="container home-hero__copy">
          <h1 id="home-title" className="home-hero__title">
            <span className="home-hero__line">Yavapai Alternative</span>{" "}
            <span className="home-hero__line">Management Fund</span>
          </h1>
          <p className="home-hero__lede">
            Student-led investment research at the University of Arizona, connecting markets,
            energy, AI, and technology.
          </p>
          <Link href="/publications" className="btn btn--solid home-hero__cta">
            Read our research
          </Link>
        </div>
        <Dunes />
      </section>

      <section id="about" className="home-about" aria-labelledby="about-title">
        <div className="container">
          <div className="home-about__grid">
            <h2 id="about-title" className="home-heading">Who are we?</h2>
            <div className="home-about__copy">
              <p>
                Yavapai Alternative Management Fund is a student-run investment organization at the
                University of Arizona. We aim to cultivate the next generation of investors — and,
                through them, a better future.
              </p>
              <p>
                Our work combines financial analysis, quantitative methods, and technical research.
                Energy, AI, and technology are lenses for exploring these wider markets.
              </p>
              <p>
                You do not need to be part of the Eller College of Management or a finance major. Some
                of the best investors pursued a wide range of subjects during their higher education. We
                welcome anyone with a curious mind.
              </p>
            </div>
          </div>

          <div className="home-themes">
            <p className="home-themes__lead">We focus on alternative investment themes such as</p>
            <ul className="home-themes__list">
              {THEMES.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-program" aria-labelledby="program-title">
        <div className="container">
          <h2 id="program-title" className="home-heading home-program__title">How we operate</h2>
          <ul className="home-program__grid">
            {PROGRAM.map((item) => (
              <li key={item.title} className="home-program__item">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {latest && (
        <section className="container home-research" aria-labelledby="latest-research">
          <div className="home-research__head">
            <h2 id="latest-research" className="home-heading">Explore our work</h2>
            <p>Read the questions, data, and analysis behind our coverage.</p>
            <Link className="text-link" href="/publications">All publications →</Link>
          </div>

          <article className="home-lead">
            <h3 className="home-lead__title">
              {latestHref ? <Link href={latestHref}>{latest.title}</Link> : latest.title}
            </h3>
            <p className="home-lead__meta">
              {latest.type} · {latest.desk} · {formatDate(latest.date, true)}
            </p>
            <p className="home-lead__abstract">{latest.abstract}</p>
            {latestHref && (
              <Link className="text-link" href={latestHref}>Read the article →</Link>
            )}
          </article>

          {more.length > 0 && (
            <ul className="home-more" aria-label="More recent publications">
              {more.map((pub) => {
                const href = publicationHref(pub, articleSlugs);
                const body = (
                  <>
                    <span className="home-more__title">{pub.title}</span>
                    <span className="home-more__meta">
                      {pub.type} · {pub.desk} · {formatDate(pub.date)}
                    </span>
                  </>
                );
                return (
                  <li key={pub.slug}>
                    {href ? <Link className="home-more__item" href={href}>{body}</Link> : <div className="home-more__item">{body}</div>}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <section className="container home-invite" aria-labelledby="join-invitation">
        <h2 id="join-invitation" className="home-heading">Curiosity belongs here</h2>
        <p>Every major and year is welcome. Bring a company, market, or idea you want to understand better.</p>
        <Link className="btn btn--solid" href="/join">Apply to join YAMF →</Link>
      </section>
    </>
  );
}
