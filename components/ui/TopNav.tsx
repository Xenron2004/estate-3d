'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#introduction', label: 'The vision' },
  { href: '#master-plan', label: 'The township' },
  { href: '#amenities', label: 'The everyday' },
  { href: '#plots', label: 'Your plot' },
];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key !== 'Tab') return;
      const links = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []);
      const first = links[0];
      const last = links[links.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener('keydown', handleKey);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${scrolled || open ? 'border-ink/10 bg-bone/95 backdrop-blur-md' : 'border-transparent bg-bone'}`}>
        <nav aria-label="Primary" className="site-shell flex h-[84px] items-center justify-between gap-5 lg:h-[96px]">
          <Link href="#top" onClick={() => setOpen(false)} className="group inline-flex items-center gap-3 text-ink" aria-label="Aurelia Estates home">
            <svg aria-hidden="true" viewBox="0 0 38 42" fill="none" className="h-10 w-9 shrink-0">
              <path d="M4 35L19 5L34 35M10.5 23H27.5M15.5 35L25 16" stroke="currentColor" strokeWidth="1.3" />
              <path d="M4 39H34" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            <span className="flex flex-col">
              <span className="font-display text-[27px] leading-[1.03] tracking-[-0.045em] sm:text-[29px]">Aurelia</span>
              <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.34em] text-ink/70">Estates & residences</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            {LINKS.map((link) => <a key={link.href} href={link.href} className="link-underline text-[12px] text-ink/70 transition-colors hover:text-ink">{link.label}</a>)}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <a href="#contact" className="group hidden items-center gap-6 rounded-full border border-ink/20 px-5 py-3 text-[11px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone sm:inline-flex">
              Plan your visit
              <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button ref={triggerRef} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-bone lg:hidden">
              {open ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Site navigation" className="fixed inset-0 z-[60] overflow-y-auto bg-ink px-6 pb-9 pt-28 text-bone sm:px-10 lg:hidden">
          <span className="absolute left-6 top-7 font-display text-[28px] tracking-[-0.04em] sm:left-10">Aurelia</span>
          <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close navigation menu" className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors hover:bg-bone hover:text-ink sm:right-10"><X size={18} strokeWidth={1.5} aria-hidden="true" /></button>
          <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-bone/65">Discover Aurelia</p>
          <ul>
            {[...LINKS, { href: '#gallery', label: 'A closer look' }, { href: '#contact', label: 'Let’s begin' }].map((link, index) => (
              <li key={link.href} className="border-b border-bone/15">
                <a href={link.href} onClick={() => setOpen(false)} className="group flex items-center justify-between gap-5 py-5">
                  <span className="flex items-baseline gap-4"><span className="font-mono text-[10px] text-lime/65">0{index + 1}</span><span className="font-display text-[clamp(1.65rem,7vw,2.6rem)] tracking-[-0.035em]">{link.label}</span></span>
                  <ArrowUpRight size={22} strokeWidth={1} aria-hidden="true" className="text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex items-center justify-between gap-5 text-[10px] text-bone/65"><span>Your land. Your legacy.</span><span>Aurelia Estates</span></div>
        </div>
      )}
    </>
  );
}
