import type { ReactNode } from "react";

// Small editorial widgets for MDX articles (server-safe).
//   import { Callout, KeyStats } from "@/components/article";

export function Callout({
  title,
  tone = "note",
  children,
}: {
  title?: string;
  tone?: "note" | "thesis" | "risk";
  children: ReactNode;
}) {
  return (
    <aside className="callout" data-tone={tone}>
      {title && <p className="callout__title">{title}</p>}
      <div className="callout__body">{children}</div>
    </aside>
  );
}

export type Stat = { label: string; value: string; note?: string };

export function KeyStats({ items }: { items: Stat[] }) {
  return (
    <dl className="key-stats">
      {items.map((s) => (
        <div key={s.label} className="key-stats__item">
          <dt className="mono-label">{s.label}</dt>
          <dd className="key-stats__value">{s.value}</dd>
          {s.note && <dd className="key-stats__note">{s.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
