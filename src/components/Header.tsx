"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { SiteSettings } from "@/types/content";
import { fallbackSettings } from "@/lib/fallbacks";

type Props = {
  settings?: SiteSettings | null;
};

export function Header({ settings }: Props) {
  const nav = settings?.navigationLinks?.length
    ? settings.navigationLinks
    : fallbackSettings.navigationLinks;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border-light bg-white relative">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:py-4">
        <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-brand-deep">
          Mathew<span className="text-brand-accent"> Yel</span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-brand-body md:flex"
          aria-label="Main navigation"
        >
          {nav?.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link href="/activities" className="btn-primary px-4 py-2 text-sm">
            Activities
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-nav-toggle md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={toggleMenu}
          >
            <span className={`mobile-nav-icon${menuOpen ? " mobile-nav-icon-open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        className={`mobile-nav-panel md:hidden${menuOpen ? " mobile-nav-panel-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <div className="mobile-nav-panel-inner">
          {nav?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
