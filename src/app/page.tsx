import Link from "next/link";

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
  return (
    <>
      <section className="container hero">
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          Based out of the University of Arizona
        </div>
        <h1 className="hero__title">Yavapai Alternative Management Fund</h1>
        <p className="hero__subtitle">
          A student-run investment fund researching topics shaping the frontier ahead.
        </p>
        <div className="hero__actions">
          <a href="#about" className="btn btn--solid">
            Learn More
          </a>
          <Link href="/publications" className="btn btn--outline">
            Explore Our Work
          </Link>
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
                We would like to think of ourselves as quantamental investors, using both quantitative
                finance skills and technical abilities.
              </p>
              <p>
                You do not need to be part of the Eller College of Management or a finance major. Some
                of the best investors pursued a wide range of subjects during their higher education. We
                welcome anyone with a curious mind.
              </p>
            </div>
          </div>

          <ol className="steps">
            {PROGRAM.map((step, i) => (
              <li key={step.title} className="step">
                <span className="step__num">[{String(i + 1).padStart(2, "0")}]</span>
                <div className="step__body">
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
