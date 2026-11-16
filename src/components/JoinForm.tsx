"use client";

import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { site } from "@/data/site";

const INTERESTS = ["Energy", "Artificial Intelligence", "Technology", "Macro & Commodities", "Exploring my interests"];
const DRAFT_KEY = "yamf-application-draft-v1";

export function JoinForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [interestError, setInterestError] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (!saved || !formRef.current) return;
      const values = JSON.parse(saved) as Record<string, string | string[]>;
      for (const element of Array.from(formRef.current.elements)) {
        if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) continue;
        const value = values[element.name];
        if (element.type === "checkbox" && element instanceof HTMLInputElement) {
          element.checked = element.name === "keepDraft" || (Array.isArray(value) && value.includes(element.value));
        } else if (typeof value === "string") element.value = value;
      }
    } catch { /* The form remains usable when browser storage is unavailable. */ }
  }, []);

  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    try {
      if (!data.has("keepDraft")) { sessionStorage.removeItem(DRAFT_KEY); return; }
      const values: Record<string, string | string[]> = {};
      for (const [key, value] of data) if (typeof value === "string" && key !== "keepDraft") values[key] = value;
      values.interests = data.getAll("interests").map(String);
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } catch { setNotice("Your browser could not keep this draft. Keep this page open or copy your application below."); }
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const interests = data.getAll("interests").map(String);
    if (!interests.length) {
      setInterestError(true);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setInterestError(false);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    setEmailBody([
      `Hello YAMF,`, "", `I'd like to apply to join the fund.`, "",
      `Name: ${value("firstName")} ${value("lastName")}`,
      `University email: ${value("email")}`, `Major: ${value("major")}`,
      `Graduation year: ${value("gradYear")}`, `Desk interests: ${interests.join(", ")}`,
      ...(value("phone") ? [`Phone: ${value("phone")}`] : []),
      ...(value("linkedin") ? [`LinkedIn: ${value("linkedin")}`] : []),
      "", ...(value("comments") ? [value("comments"), ""] : []),
      "Résumé: attach your PDF before sending.",
    ].join("\n"));
    setNotice("");
    saveDraft();
    requestAnimationFrame(() => document.getElementById("email-draft")?.focus());
  }

  async function copyDraft() {
    try { await navigator.clipboard.writeText(emailBody); setNotice("Application text copied. Paste it into your email, attach your résumé, and send."); }
    catch { setNotice("Select and copy the application text below, then paste it into your email."); }
  }

  const emailHref = `mailto:${site.recruitingEmail}?subject=${encodeURIComponent("YAMF membership application")}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="application-panel" id="application">
      <form className="form-card" ref={formRef} onSubmit={prepareEmail} onChange={() => { setEmailBody(""); saveDraft(); }}>
        <div>
          <h2 className="form-card__title">Apply by email</h2>
          <p className="form-card__sub" id="application-help">Fill in your details to prepare an email to {site.recruitingEmail}. You’ll attach your résumé and send it from your email app. Required fields are marked *.</p>
        </div>
        <div className="form-row">
          <Field label="First name *" name="firstName" autoComplete="given-name" maxLength={60} required />
          <Field label="Last name *" name="lastName" autoComplete="family-name" maxLength={60} required />
        </div>
        <div className="form-row">
          <Field label="University email *" name="email" type="email" placeholder="netid@arizona.edu" autoComplete="email" maxLength={120} required />
          <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        </div>
        <div className="form-row">
          <Field label="Major *" name="major" autoComplete="organization-title" maxLength={100} required />
          <Field label="Graduation year *" name="gradYear" type="number" inputMode="numeric" min={2000} max={2100} placeholder="2030" required />
        </div>
        <Field label="LinkedIn URL (optional)" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/your-name" autoComplete="url" maxLength={200} />
        <fieldset className="field" aria-describedby={interestError ? "interests-help interests-error" : "interests-help"}>
          <legend className="field__label">Desk interests *</legend>
          <p id="interests-help" className="field__help">Choose one or more. It’s fine to be exploring.</p>
          <div className="interest-chips">
            {INTERESTS.map((interest) => (
              <label className="interest" key={interest}>
                <input type="checkbox" name="interests" value={interest} aria-invalid={interestError || undefined} aria-describedby={interestError ? "interests-error" : undefined} onChange={() => setInterestError(false)} />
                {interest}
              </label>
            ))}
          </div>
          {interestError && <p className="field__error" id="interests-error" ref={errorRef} role="alert" tabIndex={-1}>Choose at least one interest, including “Exploring my interests” if you’re unsure.</p>}
        </fieldset>
        <label className="field">
          <span className="field__label">What have you been thinking about? (optional)</span>
          <textarea className="input" name="comments" maxLength={600} placeholder="A company, market, or research question that interests you. Up to 600 characters." />
        </label>
        <label className="draft-choice"><input type="checkbox" name="keepDraft" /> Keep my draft in this browser tab until I close it.</label>
        <div className="submit">
          <button type="submit" className="btn btn--solid">Prepare application email →</button>
          <p className="submit__note">This prepares a draft. Your application reaches us only after you send the email.</p>
        </div>
      </form>
      {emailBody && <section className="email-draft" aria-labelledby="email-draft" >
        <h2 id="email-draft" tabIndex={-1}>Your email is ready to send</h2>
        <p>Open the draft, attach your résumé as a PDF, and press Send in your email app. We have not received your application yet.</p>
        <a className="btn btn--solid" href={emailHref}>Open email draft →</a>
        <p>If your email app doesn’t open, email <a className="text-link" href={`mailto:${site.recruitingEmail}`}>{site.recruitingEmail}</a> with the text below and your résumé attached.</p>
        <label className="field"><span className="field__label">Application text</span><textarea className="input email-draft__text" value={emailBody} readOnly /></label>
        <button type="button" className="btn btn--outline" onClick={copyDraft}>Copy application text</button>
        <button type="button" className="text-link clear-draft" onClick={() => { formRef.current?.reset(); setEmailBody(""); try { sessionStorage.removeItem(DRAFT_KEY); } catch {} setNotice("Draft cleared from this page and browser tab."); }}>Clear my draft</button>
      </section>}
      <p role="status" className="draft-status">{notice}</p>
    </div>
  );
}

function Field({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return <label className="field"><span className="field__label">{label}</span><input className="input" type="text" {...input} /></label>;
}
