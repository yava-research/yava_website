"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/data/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="wordmark" aria-label={`${site.shortName} home`} onClick={close}>
          <Image src="/logo.png" alt="YAMF logo" width={36} height={36} className="wordmark__logo" priority />
          <span className="wordmark__name">{site.shortName}</span>
          <span className="wordmark__tag">{site.tagline}</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            {open ? (
              <path d="M3 1L17 13M17 1L3 13" stroke="#00043A" strokeWidth="1.6" />
            ) : (
              <path d="M0 1H20M0 7H20M0 13H20" stroke="#00043A" strokeWidth="1.6" />
            )}
          </svg>
        </button>

        <nav id="site-nav" className="nav" data-open={open} aria-label="Main">
          {navLinks.map((link) => {
            const active = !link.href.includes("#") && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav__link"
                aria-current={active ? "page" : undefined}
                onClick={close}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/join" className="nav__cta" aria-current={pathname === "/join" ? "page" : undefined} onClick={close}>
            Join Us →
          </Link>
        </nav>
      </div>
    </header>
  );
}
