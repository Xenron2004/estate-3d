'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#master-plan', label: 'Master Plan' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#plots', label: 'Plots' },
  { href: '#location', label: 'Location' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Enquire' },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'bg-bone/92 backdrop-blur-md border-b border-ink/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-8"
        >
          <Link href="#top" className="group flex items-baseline gap-3" aria-label="Aurelia Estates home">
            <span className="font-display text-[19px] tracking-[0.02em] text-ink">Aurelia</span>
            <span className="eyebrow hidden sm:inline text-bronze">Estates</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-[12.5px] tracking-wide text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-sm border border-ink/25 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
            >
              Book a visit
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex items-center gap-2 rounded-sm border border-ink/20 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-ink lg:hidden"
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-bone px-6 pt-28 pb-10 lg:hidden"
        >
          <ul className="space-y-1">
            {LINKS.map((link, index) => (
              <li key={link.href} className="border-b border-ink/10">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-[28px] text-ink"
                >
                  <span className="eyebrow numeric text-bronze">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[34ch] text-[13px] leading-relaxed text-ink/60">
            A fictional township built as a design demonstration. Prices, availability and location are
            illustrative.
          </p>
        </div>
      )}
    </>
  );
}
