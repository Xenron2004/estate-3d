import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface EnquiryBody {
  name?: string;
  phone?: string;
  email?: string;
  plotInterest?: string;
  preferredDate?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export async function POST(request: Request) {
  let body: EnquiryBody;
  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const phoneDigits = (body.phone ?? '').replace(/\D/g, '').slice(-10);
  const email = (body.email ?? '').trim();
  const plotInterest = (body.plotInterest ?? '').trim();
  const preferredDate = (body.preferredDate ?? '').trim();
  const message = (body.message ?? '').trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (!PHONE_RE.test(phoneDigits)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (email && !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!plotInterest) errors.plotInterest = 'Select a plot you would like to know about.';
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.preferredDate = 'Use a valid date.';
  }
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const reference = `AUR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const row = {
    reference,
    name,
    phone: phoneDigits,
    email: email || null,
    plot_interest: plotInterest,
    preferred_date: preferredDate || null,
    message: message || null,
    status: 'received-demo',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('enquiries').insert(row);
    if (error) {
      console.error('[api/enquiries] insert failed:', error);
      return NextResponse.json(
        {
          error:
            'The demo enquiry store is unavailable right now. Please try again shortly, or use the WhatsApp link.',
          reference,
        },
        { status: 503 },
      );
    }
  }

  return NextResponse.json(
    {
      ok: true,
      reference,
      delivery: 'demo',
      note: 'Stored in the demo database. No email or SMS delivery is wired up in this demonstration.',
    },
    { status: 201 },
  );
}
