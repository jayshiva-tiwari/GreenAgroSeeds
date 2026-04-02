import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { sendInquiryEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Insert into Supabase
    const { data, error } = await supabaseAdmin.from('inquiries').insert({
      name,
      phone,
      message,
      is_read: false,
    }).select().single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger email notification automatically
    try {
      await sendInquiryEmail(name, phone, message);
    } catch (emailErr) {
      console.error('Failed to send inquiry email:', emailErr);
      // Don't fail the whole request because email failed, but log it
    }

    return NextResponse.json({ success: true, inquiryId: data?.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Error' }, { status: 500 });
  }
}
