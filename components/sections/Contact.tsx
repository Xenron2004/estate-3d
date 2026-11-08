'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, MessageCircle, Send } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { useExplorerStore } from '@/lib/store';
import { BRAND } from '@/lib/data/township';
import { formatINR } from '@/lib/format';

interface FormState {
  name: string;
  phone: string;
  email: string;
  plotInterest: string;
  preferredDate: string;
  message: string;
}

const EMPTY: FormState = {
  name: '',
  phone: '',
  email: '',
  plotInterest: '',
  preferredDate: '',
  message: '',
};

export default function Contact() {
  const plots = useExplorerStore((state) => state.plots);
  const enquiryPlot = useExplorerStore((state) => state.enquiryPlot);
  const setEnquiryPlot = useExplorerStore((state) => state.setEnquiryPlot);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (enquiryPlot) setForm((current) => ({ ...current, plotInterest: enquiryPlot }));
  }, [enquiryPlot]);

  const selected = useMemo(
    () => plots.find((plot) => plot.id === form.plotInterest),
    [plots, form.plotInterest],
  );

  const whatsappMessage = useMemo(() => {
    const lines = [
      `Hello Aurelia Estates, I would like to know more about ${form.plotInterest || 'a plot'} at Aurelia Estates.`,
    ];
    if (selected) {
      lines.push(
        `Plot ${selected.id} · ${selected.areaSqft.toLocaleString('en-IN')} sq ft · ${selected.facing}-facing · ${formatINR(selected.price)}.`,
      );
    }
    if (form.preferredDate) lines.push(`Preferred site visit date: ${form.preferredDate}.`);
    if (form.name) lines.push(`My name is ${form.name}.`);
    lines.push('(Sent from the Aurelia Estates demonstration website.)');
    return lines.join(' ');
  }, [form.plotInterest, form.preferredDate, form.name, selected]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    const digits = form.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.plotInterest) next.plotInterest = 'Select a plot you would like to know about.';
    if (form.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.preferredDate)) {
      next.preferredDate = 'Use a valid date.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setStatus('submitting');
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.errors) setErrors(data.errors);
        setServerError(data?.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setReference(data.reference ?? null);
      setStatus('success');
      setForm(EMPTY);
      setEnquiryPlot(null);
    } catch {
      setServerError('The network request failed. Please try again or use the WhatsApp link.');
      setStatus('error');
    }
  };

  const fieldClass = (key: keyof FormState) =>
    `w-full rounded-sm border bg-bone-deep/40 px-4 py-3 text-[14px] text-ink placeholder:text-ink/35 focus:outline-none ${
      errors[key] ? 'border-sold' : 'border-ink/15 focus:border-bronze'
    }`;

  return (
    <section id="contact" className="scroll-mt-24 bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                index="12"
                eyebrow="Enquire & site visit"
                tone="dark"
                title={
                  <>
                    Come and stand on <span className="italic text-bronze-soft">the land.</span>
                  </>
                }
                intro="Tell us which parcel interests you and when you would like to walk it. In a live development this form would book the visit and send a confirmation; here it is stored in a demonstration database so the flow can be tested end to end."
              />
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="mt-12 space-y-7">
                {[
                  { label: 'Sales (placeholder)', value: BRAND.phone },
                  { label: 'Email (placeholder)', value: BRAND.email },
                  { label: 'WhatsApp (placeholder)', value: `+91 ${BRAND.whatsapp.slice(2)}` },
                  { label: 'Site office', value: 'Aurelia belt — illustrative location' },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="eyebrow text-bone/40">{item.label}</dt>
                    <dd className="numeric mt-1.5 text-[15px] text-bone/85">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 rounded-sm border border-bone/30 px-5 py-3.5 text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-bronze hover:bg-bronze hover:text-ink"
              >
                <MessageCircle size={15} aria-hidden="true" />
                Continue on WhatsApp
              </a>
              <p className="mt-3 max-w-[46ch] text-[11.5px] leading-relaxed text-bone/40">
                The WhatsApp link opens a chat with your selected plot ID already written in. The number
                above is a placeholder for this demonstration.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.06}>
              <form
                onSubmit={submit}
                noValidate
                className="rounded-sm border border-bone/15 bg-bone/[0.04] p-6 sm:p-8"
              >
                {status === 'success' ? (
                  <div className="py-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-bronze-soft/50 text-bronze-soft">
                      <Check size={20} aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-[26px] leading-tight text-bone">
                      Enquiry recorded.
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-[13.5px] leading-relaxed text-bone/60">
                      Your reference is{' '}
                      <span className="numeric text-bone/90">{reference}</span>. It has been written to
                      the demonstration database so the flow can be verified end to end — no email or
                      SMS is sent in this build.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setReference(null);
                      }}
                      className="mt-6 rounded-sm border border-bone/25 px-5 py-3 text-[10.5px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className="eyebrow block text-bone/50">
                          Full name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(event) => setForm({ ...form, name: event.target.value })}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                          className={`mt-2 ${fieldClass('name')}`}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-1.5 text-[11.5px] text-sold">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="eyebrow block text-bone/50">
                          Mobile *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(event) => setForm({ ...form, phone: event.target.value })}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                          className={`mt-2 ${fieldClass('phone')}`}
                          placeholder="98765 43210"
                        />
                        {errors.phone && (
                          <p id="phone-error" className="mt-1.5 text-[11.5px] text-sold">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="eyebrow block text-bone/50">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) => setForm({ ...form, email: event.target.value })}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={`mt-2 ${fieldClass('email')}`}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1.5 text-[11.5px] text-sold">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="plot" className="eyebrow block text-bone/50">
                          Plot interest *
                        </label>
                        <select
                          id="plot"
                          name="plotInterest"
                          value={form.plotInterest}
                          onChange={(event) => setForm({ ...form, plotInterest: event.target.value })}
                          aria-invalid={Boolean(errors.plotInterest)}
                          aria-describedby={errors.plotInterest ? 'plot-error' : undefined}
                          className={`mt-2 ${fieldClass('plotInterest')}`}
                        >
                          <option value="">Select a plot</option>
                          {plots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              {plot.id} — {plot.areaSqft.toLocaleString('en-IN')} sq ft —{' '}
                              {formatINR(plot.price)} ({plot.status})
                            </option>
                          ))}
                        </select>
                        {errors.plotInterest && (
                          <p id="plot-error" className="mt-1.5 text-[11.5px] text-sold">
                            {errors.plotInterest}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="date" className="eyebrow block text-bone/50">
                          Preferred visit date
                        </label>
                        <input
                          id="date"
                          name="preferredDate"
                          type="date"
                          value={form.preferredDate}
                          onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
                          aria-invalid={Boolean(errors.preferredDate)}
                          aria-describedby={errors.preferredDate ? 'date-error' : undefined}
                          className={`mt-2 ${fieldClass('preferredDate')}`}
                        />
                        {errors.preferredDate && (
                          <p id="date-error" className="mt-1.5 text-[11.5px] text-sold">
                            {errors.preferredDate}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="message" className="eyebrow block text-bone/50">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={(event) => setForm({ ...form, message: event.target.value })}
                          className={`mt-2 resize-none ${fieldClass('message')}`}
                          placeholder="Anything we should know — orientation, budget, timeline."
                        />
                      </div>
                    </div>

                    {serverError && (
                      <div
                        role="alert"
                        className="mt-5 flex items-start gap-2.5 rounded-sm border border-sold/40 bg-sold/10 p-3.5 text-[12.5px] text-bone/80"
                      >
                        <AlertCircle size={15} className="mt-0.5 shrink-0 text-sold" aria-hidden="true" />
                        {serverError}
                      </div>
                    )}

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="inline-flex items-center gap-3 rounded-sm bg-bronze px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-bronze-soft disabled:opacity-60"
                      >
                        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                        <Send size={14} aria-hidden="true" />
                      </button>
                      <p className="max-w-[34ch] text-[11px] leading-relaxed text-bone/40">
                        Demonstration only: submissions are stored locally in a demo database and are
                        not delivered to a sales team.
                      </p>
                    </div>
                  </>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
