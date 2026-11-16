import Link from "next/link";
import { publications, formatDate } from "@/data/publications";

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

/** Dawn over the dunes. The footer closes the page with the same sun setting. */
function Horizon() {
  return (
    <svg className="horizon" viewBox="0 0 1440 220" aria-hidden="true">
      <circle cx="1130" cy="118" r="54" fill="#E9D3B4" />
      <path
        d="M0 150 C 180 110, 340 100, 520 128 C 700 156, 860 112, 1040 104 C 1200 98, 1330 120, 1440 132 L1440 220 L0 220 Z"
        fill="#ECE3D4"
      />
      <path
        d="M0 178 C 220 150, 420 156, 640 172 C 860 188, 1060 150, 1260 152 C 1350 153, 1400 160, 1440 166 L1440 220 L0 220 Z"
        fill="#DFD1BB"
      />
      <path
        d="M0 204 C 260 190, 520 196, 760 202 C 1000 208, 1240 196, 1440 198 L1440 220 L0 220 Z"
        fill="#C9A57A"
      />
    </svg>
  );
}

export default function Home() {
  const latest = publications[0];
  return (
    <>
      <section className="container hero">
        <h1 className="hero__title">Yavapai Alternative Management Fund</h1>
        <p className="hero__subtitle">
          Student-led investment research at the University of Arizona, connecting markets,
          energy, AI, and technology.
        </p>
        <div className="hero__actions">
          <Link href="/publications" className="btn btn--solid">
            Read our research
          </Link>
          <a href="#about" className="btn btn--outline">Meet the fund</a>
        </div>
      </section>

      <Horizon />

      <section id="about" className="program" aria-labelledby="about-title">
        <div className="container program__inner">
          <div className="program__intro">
            <h2 id="about-title" className="program__title">
              Who are we?
            </h2>
            <div className="program__copy">
              <p>
                Yavapai Alternative Management Fund is a student-run investment organization at the
                University of Arizona. We aim to cultivate the next generation of investors — and,
                through them, a better future.
              </p>
              <p>
                We focus on alternative investment themes such as Commodities, Macro, Fixed Income,
                Emerging Markets, Cryptocurrency and Prediction Markets.
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

          <ul className="steps">
            {PROGRAM.map((step) => (
              <li key={step.title} className="step">
                <div className="step__body">
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {latest && <section className="container home-research" aria-labelledby="latest-research">
        <div><h2 id="latest-research">Inside our research</h2><p>Read the questions, data, and analysis behind our coverage.</p></div>
        <article>
          <p className="research-meta">{latest.desk} · {formatDate(latest.date, true)}</p>
          <h3><Link href={`/publications/${latest.slug}`}>{latest.title}</Link></h3>
          <p>{latest.abstract}</p>
          <Link className="text-link" href={`/publications/${latest.slug}`}>Read the article →</Link>
        </article>
      </section>}
      <section className="container home-invitation" aria-labelledby="join-invitation">
        <div><h2 id="join-invitation">Curiosity belongs here</h2><p>Every major and year is welcome. Bring a company, market, or idea you want to understand better.</p></div>
        <Link className="btn btn--solid" href="/join">Apply to join YAMF →</Link>
      </section>
    </>
  );
}
