import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// GET /api/products — Fetch all products ordered by creation date
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products — Create a new product (bypasses RLS via service role)
export async function POST(req: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const payload = await req.json();

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[POST /api/products] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}

// PUT /api/products — Update an existing product (bypasses RLS via service role)
export async function PUT(req: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id, ...payload } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[PUT /api/products] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}
