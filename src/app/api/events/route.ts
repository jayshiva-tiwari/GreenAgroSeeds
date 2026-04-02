import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { event_type, product_id, metadata } = await req.json();

    if (!event_type) {
      return NextResponse.json({ error: 'Missing event_type' }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from('analytics_events').insert({
        event_type,
        product_id,
        metadata
      });

      if (error) throw error;
    }

    // Optional: Log to GA4 Measurement Protocol here
    // sendGAMeasurement(event_type, product_id, metadata);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Event log error', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
