import Image from "next/image";
import { site } from "@/data/site";

const STARS: [number, number, number, number][] = [
  [90, 70, 1.5, 0.55],
  [310, 38, 1.2, 0.45],
  [470, 104, 1.5, 0.5],
  [640, 34, 1.2, 0.45],
  [760, 120, 1, 0.4],
  [880, 64, 1.6, 0.55],
  [990, 28, 1.2, 0.45],
  [1270, 72, 1.4, 0.5],
  [1390, 118, 1.2, 0.45],
  [180, 150, 1, 0.35],
];

// Saguaro trunks and arms, drawn as round-capped strokes: [path, strokeWidth].
const SAGUAROS: [string, number][] = [
  ["M220 316 V180", 18],
  ["M220 256 H190 V212", 13],
  ["M220 236 H250 V190", 13],
  ["M364 316 V230", 12],
  ["M364 276 H346 V248", 9],
  ["M1296 316 V206", 15],
  ["M1296 262 H1320 V224", 11],
  ["M1296 278 H1274 V250", 11],
  ["M1384 316 V258", 9],
];

/** Arizona at night: buttes, saguaros and the sun setting on the same horizon the hero rises from. */
function ArizonaNight() {
  return (
    <svg className="site-footer__art" viewBox="0 0 1440 340" aria-hidden="true">
      {STARS.map(([cx, cy, r, opacity]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#F6F1E8" opacity={opacity} />
      ))}
      <circle cx="1130" cy="226" r="52" fill="#E9D3B4" />
      <path
        d="M0 250 L118 250 L134 216 L142 160 L232 160 L240 216 L262 250 L500 254 L516 228 L524 186 L584 186 L590 228 L612 254 L852 250 L872 204 L882 128 L1004 128 L1012 204 L1034 250 L1214 254 L1228 216 L1236 194 L1296 194 L1302 216 L1316 254 L1440 248 L1440 340 L0 340 Z"
        fill="#141A63"
      />
      <path
        d="M0 276 C 200 262, 360 284, 560 272 C 760 260, 900 280, 1100 270 C 1260 262, 1360 272, 1440 268 L1440 340 L0 340 Z"
        fill="#0A0E4C"
      />
      <path
        d="M0 306 C 300 296, 600 308, 900 302 C 1140 297, 1300 306, 1440 302 L1440 340 L0 340 Z"
        fill="#00022A"
      />
      <g fill="none" stroke="#00022A" strokeLinecap="round" strokeLinejoin="round">
        {SAGUAROS.map(([d, w]) => (
          <path key={d} d={d} strokeWidth={w} />
        ))}
      </g>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <ArizonaNight />
      <div className="site-footer__bar">
        <div className="container site-footer__inner">
          <div className="site-footer__brand">
            <Image src="/logo.png" alt="" width={28} height={28} />
            {site.shortName}
          </div>
          <ul className="site-footer__links site-footer__meta" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="site-footer__meta">{site.location}</div>
          <div className="site-footer__meta">© {site.founded} · Not investment advice</div>
        </div>
      </div>
    </footer>
  );
}
