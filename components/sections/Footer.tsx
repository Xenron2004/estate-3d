import Link from 'next/link';
import { BRAND } from '@/lib/data/township';

const ANCHORS = [
  { href: '#introduction', label: 'Introduction' },
  { href: '#master-plan', label: 'Master plan' },
  { href: '#highlights', label: 'Highlights' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#plots', label: 'Plots' },
  { href: '#location', label: 'Location' },
  { href: '#plan-details', label: 'Plan details' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Enquire' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-bone/12 bg-ink px-5 py-16 text-bone sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-display text-[26px] leading-none text-bone">Aurelia Estates</div>
            <div className="eyebrow mt-3 text-bronze-soft">{BRAND.tagline}</div>
            <p className="mt-6 max-w-[38ch] text-[13px] leading-relaxed text-bone/50">
              A fictional planned township built as a design and engineering demonstration:
              procedural 3D, a single canonical plot dataset, and an interface designed for
              exploring land.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-bone/40">On this page</h2>
            <ul className="mt-4 grid grid-cols-2 gap-y-2.5">
              {ANCHORS.map((anchor) => (
                <li key={anchor.href}>
                  <a
                    href={anchor.href}
                    className="link-underline text-[13px] text-bone/60 transition-colors hover:text-bone"
                  >
                    {anchor.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-bone/40">Contact</h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-bone/60">
              <li className="numeric">{BRAND.phone}</li>
              <li>{BRAND.email}</li>
              <li>Aurelia belt — illustrative</li>
              <li className="numeric">+91 {BRAND.whatsapp.slice(2)}</li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-bone/35">
              All contact details are placeholders for this demonstration.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-bone/40">Legal & demo notice</h2>
            <p className="mt-4 text-[11.5px] leading-relaxed text-bone/45">
              Aurelia Estates is fictional. It is not a real project, and nothing on this site
              constitutes an offer, invitation, price guarantee, planning approval, title, RERA
              registration, ownership claim or statement of appreciation. Prices, availability,
              geography, distances and amenities are illustrative. The 3D model is a design
              representation and is not a legal survey.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[12px] text-bone/55">
              <Link href="/privacy" className="link-underline hover:text-bone">
                Privacy notice (template)
              </Link>
              <Link href="/brochure" className="link-underline hover:text-bone">
                Printable master plan
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-bone/12 pt-6 text-[11px] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Aurelia Estates — a fictional development.</span>
          <span>
            Designed and engineered as a demonstration. 3D built with Three.js / React Three Fiber;
            motion with GSAP; dataset and UI by the Aurelia design team.
          </span>
        </div>
      </div>
    </footer>
  );
}
