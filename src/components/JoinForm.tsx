"use client";

import { useState, type DragEvent, type FormEvent, type InputHTMLAttributes } from "react";

const INTERESTS = ["Energy", "Artificial Intelligence", "Technology", "Macro & Commodities", "Not sure yet"];
const GRAD_YEARS = [2027, 2028, 2029, 2030];
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type Errors = Partial<Record<"interests" | "resume", string>>;

export function JoinForm() {
  const [resume, setResume] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function pickResume(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((e) => ({ ...e, resume: "Please upload your resume as a PDF." }));
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((e) => ({ ...e, resume: "That file is over 5 MB." }));
      return;
    }
    setErrors((e) => ({ ...e, resume: undefined }));
    setResume(file);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    pickResume(e.dataTransfer.files[0]);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (data.getAll("interests").length === 0) next.interests = "Pick at least one desk.";
    if (!resume) next.resume = "Please attach your resume.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: send `data` and `resume` to a real destination (form service, email, or storage).
    // Until that's connected, submissions are not saved anywhere.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-card" role="status">
        <div className="form-success">
          <span className="eyebrow">Application received</span>
          <h2 className="form-card__title">Thanks for applying.</h2>
          <p>
            We review applications on a rolling basis and will reach out by email to schedule a coffee
            chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div>
        <h2 className="form-card__title">Application</h2>
        <p className="form-card__sub">Takes about five minutes. Fields marked * are required.</p>
      </div>

      <div className="form-row">
        <Field label="First name *" name="firstName" placeholder="Wilbur" autoComplete="given-name" required />
        <Field label="Last name *" name="lastName" placeholder="Wildcat" autoComplete="family-name" required />
      </div>

      <div className="form-row">
        <Field
          label="University email *"
          name="email"
          type="email"
          placeholder="netid@arizona.edu"
          autoComplete="email"
          required
        />
        <Field label="Phone" name="phone" type="tel" placeholder="(520) 555-0142" autoComplete="tel" />
      </div>

      <div className="form-row">
        <Field label="Major *" name="major" placeholder="e.g. Finance, Computer Science" required />
        <label className="field field--narrow">
          <span className="field__label mono-label">Grad year *</span>
          <select className="input" name="gradYear" required defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {GRAD_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Field label="LinkedIn URL" name="linkedin" type="url" placeholder="linkedin.com/in/" />

      <fieldset className="field">
        <legend className="field__label mono-label" style={{ paddingBottom: 12 }}>
          Desk interest *
        </legend>
        <div className="interest-chips">
          {INTERESTS.map((interest) => (
            <label key={interest} className="interest">
              <input type="checkbox" name="interests" value={interest} />
              <svg className="interest__check" width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="#E9D3B4" strokeWidth="1.6" />
              </svg>
              {interest}
            </label>
          ))}
        </div>
        {errors.interests && <span className="field__error">{errors.interests}</span>}
      </fieldset>

      <div className="field">
        <span className="field__label mono-label">Resume *</span>
        <label
          className="dropzone"
          data-dragging={dragging}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={(e) => pickResume(e.target.files?.[0])}
          />
          <span className="dropzone__icon">
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
              <path d="M10 15V2M10 2L5 7M10 2L15 7M2 14V20H18V14" stroke="#00043A" strokeWidth="1.6" />
            </svg>
          </span>
          <span>
            <span className="dropzone__title" style={{ display: "block" }}>
              {resume ? resume.name : "Drop your resume here, or browse files"}
            </span>
            <span className="dropzone__meta mono-label" style={{ display: "block" }}>
              {resume ? `${(resume.size / 1024).toFixed(0)} KB · Click to replace` : "PDF · Max 5 MB"}
            </span>
          </span>
        </label>
        {errors.resume && <span className="field__error">{errors.resume}</span>}
      </div>

      <label className="field">
        <span className="field__label mono-label">Why YAMF? / Additional comments</span>
        <textarea
          className="input"
          name="comments"
          placeholder="Tell us about a company, trend, or idea you've been thinking about."
        />
      </label>

      <div className="submit">
        <button type="submit" className="btn btn--solid">
          Submit application →
        </button>
        <p className="submit__note">Your information is only shared with the YAMF recruiting committee.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  ...input
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span className="field__label mono-label">{label}</span>
      <input className="input" type="text" {...input} />
    </label>
  );
}
