import type { Metadata } from "next";
import { JoinForm } from "@/components/JoinForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Join Us",
  description: "Apply to the Yavapai Alternative Management Fund. Every major and year welcome.",
};

const PROCESS = [
  { title: "Apply", text: "Submit the form with your resume. Applications are reviewed on a rolling basis." },
  { title: "Coffee chat", text: "A relaxed 20-minute conversation with a current member." },
  { title: "Interview", text: "Walk us through a company or idea you find compelling." },
  { title: "Onboarding", text: "Join a sector desk and start the analyst training program." },
];

export default function JoinPage() {
  return (
    <div className="container join">
      <div className="join__intro">
        <div className="join__heading">
          <span className="eyebrow">Join Us · Spring 2027 Recruiting</span>
          <h1 className="join__title">Build your conviction with us</h1>
          <p className="join__lede">
            We welcome students of every major and year. You don&apos;t need finance experience, just
            curiosity about energy, AI, and technology, and a willingness to do the work.
          </p>
        </div>

        <ol className="process">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              <span className="process__num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="process__title">{step.title}</h2>
                <p className="process__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="contact-note">
          <span className="mono-label">Questions?</span>
          <a href={`mailto:${site.recruitingEmail}`}>{site.recruitingEmail}</a>
        </div>
      </div>

      <JoinForm />
    </div>
  );
}
