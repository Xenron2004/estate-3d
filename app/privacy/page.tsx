import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy notice — Aurelia Estates',
  description:
    'Template privacy notice for the Aurelia Estates demonstration. Replace before any real deployment.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e7] px-6 py-20 text-[#16211c]">
      <main className="mx-auto max-w-[760px]">
        <div className="text-[11px] uppercase tracking-[0.3em] text-[#a8794a]">Template notice</div>
        <h1 className="mt-4 font-serif text-[38px] leading-tight">Privacy notice</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-[#16211c]/70">
          This page is a placeholder. Aurelia Estates is a fictional development and this site does
          not collect personal data for any commercial purpose. In a production deployment this
          document would be replaced with the operator’s actual privacy policy, including the lawful
          basis for processing, retention periods, third-party processors and contact details for data
          subject requests.
        </p>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-[#16211c]/75">
          <section>
            <h2 className="font-serif text-[20px]">What this demonstration does</h2>
            <p className="mt-2">
              The enquiry form posts the details you type to a server-side API route, which writes them
              to a demonstration database so the submission flow can be tested end to end. No email or
              SMS is sent, no marketing list is built, and no third-party analytics or advertising
              scripts are loaded.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[20px]">Local storage</h2>
            <p className="mt-2">
              The 3D scene stores your session preferences — camera mode, filters and selected parcel —
              in memory for the life of the page. No identifiers are written to cookies or local
              storage.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[20px]">What to change before going live</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Name the legal entity that operates the development and the data controller.</li>
              <li>Replace the demonstration enquiry store with a CRM or ticketing system.</li>
              <li>Add retention, deletion and access-request procedures.</li>
              <li>List any map, analytics or messaging providers and their data transfers.</li>
            </ul>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-block rounded-sm border border-[#16211c]/25 px-5 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-[#16211c] hover:text-[#f5f0e7]"
        >
          Back to Aurelia Estates
        </Link>
      </main>
    </div>
  );
}
