'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
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
const EMPTY: FormState = { name: '', phone: '', email: '', plotInterest: '', preferredDate: '', message: '' };
const FIELDS = [
  { key: 'name' as const, label: 'Your name', type: 'text', autoComplete: 'name', placeholder: 'First and last name', required: true },
  { key: 'phone' as const, label: 'Phone number', type: 'tel', autoComplete: 'tel', placeholder: '+91 98765 43210', required: true },
  { key: 'email' as const, label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com', required: false },
];

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

  const selected = useMemo(() => plots.find((plot) => plot.id === form.plotInterest), [plots, form.plotInterest]);
  const whatsappMessage = useMemo(() => {
    const lines = [`Hello Aurelia Estates, I would like to know more about ${form.plotInterest || 'a plot'} at Aurelia Estates.`];
    if (selected) lines.push(`Plot ${selected.id} · ${selected.areaSqft.toLocaleString('en-IN')} sq ft · ${selected.facing}-facing · ${formatINR(selected.price)}.`);
    if (form.preferredDate) lines.push(`Preferred site visit date: ${form.preferredDate}.`);
    if (form.name) lines.push(`My name is ${form.name}.`);
    lines.push('(Sent from the Aurelia Estates demonstration website.)');
    return lines.join(' ');
  }, [form.plotInterest, form.preferredDate, form.name, selected]);

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) next.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.plotInterest) next.plotInterest = 'Choose a plot that interests you.';
    if (form.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.preferredDate)) next.preferredDate = 'Use a valid date.';
    setErrors(next);
    const firstError = Object.keys(next)[0];
    if (firstError) document.getElementById(`enquiry-${firstError}`)?.focus();
    return !firstError;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setStatus('submitting');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
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
      setServerError('We could not send your enquiry. Please try again or use the WhatsApp link.');
      setStatus('error');
    }
  };

  const fieldClass = (key: keyof FormState) => `w-full rounded-[10px] border bg-white/60 px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/70 transition-colors focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15 ${errors[key] ? 'border-sold' : 'border-ink/15'}`;
  const errorFor = (key: keyof FormState) => errors[key] ? <p id={`enquiry-${key}-error`} className="mt-2 text-[11px] leading-relaxed text-sold">{errors[key]}</p> : null;

  return (
    <section id="contact" className="section-space relative scroll-mt-24 overflow-hidden bg-ink text-bone">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[560px] w-[560px] rounded-full border border-bone/[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-20 h-[400px] w-[400px] rounded-full border border-bone/[0.06]" />
      <div className="site-shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-bone/65"><span className="text-lime">10 /</span> A new beginning</p>
              <h2 className="mt-8 max-w-[10ch] font-display text-[clamp(3.7rem,7.5vw,7.4rem)] leading-[0.98] tracking-[-0.055em]">Make room<br />for <span className="italic text-lime">what’s next.</span></h2>
              <p className="mt-8 max-w-[36ch] text-[15px] leading-[1.85] text-bone/70">A place for your plans, your people, your kind of life. Tell us what you have in mind.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-12 max-w-[420px] border-t border-bone/20 pt-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-bone/65">Prefer a conversation?</p>
                <p className="numeric mt-3 font-display text-[30px] tracking-[-0.02em]">{BRAND.phone}</p>
                <p className="mt-2 text-[13px] text-bone/65">{BRAND.email}</p>
                <a href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-3 rounded-full border border-bone/30 px-5 py-3.5 text-[12px] text-bone transition-colors hover:border-lime hover:bg-lime hover:text-ink"><MessageCircle size={16} aria-hidden="true" /> Continue on WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a>
                <p className="mt-5 max-w-[43ch] text-[11px] leading-[1.7] text-bone/65">A fictional development, created as a design exploration. Contact details and site visits are illustrative.</p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <Reveal delay={0.1}>
              <form onSubmit={submit} noValidate className="rounded-[24px] bg-bone p-6 text-ink sm:p-9 xl:p-11">
                {status === 'success' ? (
                  <div className="py-12" role="status" aria-live="polite">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime"><Check size={26} strokeWidth={1.5} aria-hidden="true" /></div>
                    <h3 className="mt-7 font-display text-[38px] leading-tight tracking-[-0.03em]">A new possibility.</h3>
                    <p className="mt-4 text-[14px] leading-[1.8] text-ink/70">Your demonstration enquiry has been recorded{reference ? <> with reference <span className="font-medium text-ink">{reference}</span></> : null}. No email or SMS is sent in this demo.</p>
                    <button type="button" onClick={() => { setStatus('idle'); setReference(null); }} className="button-primary mt-8">Send another enquiry <ArrowUpRight size={16} aria-hidden="true" /></button>
                  </div>
                ) : (
                  <>
                    <p className="eyebrow text-bronze">Let’s get acquainted</p>
                    <h3 className="mt-3 font-display text-[34px] tracking-[-0.035em]">Find your place.</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-ink/70">A few details to begin. Fields marked * are required.</p>
                    <div className="mt-8 grid gap-x-5 gap-y-5 sm:grid-cols-2">
                      {FIELDS.map((field) => <div key={field.key} className={field.key === 'name' ? 'sm:col-span-2' : ''}>
                        <label htmlFor={`enquiry-${field.key}`} className="mb-2 block text-[11px] font-medium text-ink/75">{field.label}{field.required ? ' *' : ''}</label>
                        <input id={`enquiry-${field.key}`} name={field.key} type={field.type} autoComplete={field.autoComplete} required={field.required} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `enquiry-${field.key}-error` : undefined} className={fieldClass(field.key)} placeholder={field.placeholder} />
                        {errorFor(field.key)}
                      </div>)}
                      <div>
                        <label htmlFor="enquiry-plotInterest" className="mb-2 block text-[11px] font-medium text-ink/75">Your preferred plot *</label>
                        <select id="enquiry-plotInterest" name="plotInterest" required value={form.plotInterest} onChange={(event) => setForm({ ...form, plotInterest: event.target.value })} aria-invalid={Boolean(errors.plotInterest)} aria-describedby={errors.plotInterest ? 'enquiry-plotInterest-error' : undefined} className={fieldClass('plotInterest')}><option value="">Choose a plot</option>{plots.map((plot) => <option key={plot.id} value={plot.id}>{plot.id} · {plot.areaSqft.toLocaleString('en-IN')} sq ft · {formatINR(plot.price)} ({plot.status})</option>)}</select>
                        {errorFor('plotInterest')}
                      </div>
                      <div>
                        <label htmlFor="enquiry-preferredDate" className="mb-2 block text-[11px] font-medium text-ink/75">Preferred visit date</label>
                        <input id="enquiry-preferredDate" name="preferredDate" type="date" value={form.preferredDate} onChange={(event) => setForm({ ...form, preferredDate: event.target.value })} aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? 'enquiry-preferredDate-error' : undefined} className={fieldClass('preferredDate')} />
                        {errorFor('preferredDate')}
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="enquiry-message" className="mb-2 block text-[11px] font-medium text-ink/75">What does home look like to you?</label>
                        <textarea id="enquiry-message" name="message" rows={3} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className={`resize-y ${fieldClass('message')}`} placeholder="Your plans, your timeline, anything you’d like to share…" />
                      </div>
                    </div>
                    {serverError && <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-[10px] border border-sold/25 bg-sold/5 p-4 text-[12px] leading-relaxed text-sold"><AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{serverError}</div>}
                    <button type="submit" disabled={status === 'submitting'} className="button-primary mt-7 w-full justify-between disabled:cursor-wait disabled:opacity-60"><span>{status === 'submitting' ? 'Sending your enquiry…' : 'Begin the conversation'}</span><ArrowUpRight size={18} aria-hidden="true" /></button>
                    <p className="mt-4 text-[10px] leading-[1.7] text-ink/70">Demo submissions are recorded for this experience and are not delivered to a sales team. See our <a href="/privacy" className="underline underline-offset-2 hover:text-ink">privacy notice</a>.</p>
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
