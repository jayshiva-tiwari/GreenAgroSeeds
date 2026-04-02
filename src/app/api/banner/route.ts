import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from('promo_banner')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    if (error?.code === 'PGRST116') {
      // No rows returned
      return NextResponse.json(null);
    }
    return NextResponse.json({ error: error?.message || 'Failed to fetch banner' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.heading || body.heading.trim() === '') {
      return NextResponse.json({ error: 'Heading is required' }, { status: 400 });
    }

    // Inject updated_at
    body.updated_at = new Date().toISOString();

    // Use the admin client to bypass RLS since the admin dashboard login is mocked
    // In a production app with real auth, you would use createServerClient and check user.id
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('promo_banner')
      .upsert([body], { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
