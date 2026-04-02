import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id } = await props.params;

    // 1. Fetch the product to get the public_id
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('public_id')
      .eq('id', id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Delete from Cloudinary if public_id exists
    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }

    // 3. Delete from Supabase
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: 'Hard deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id } = await props.params;
    const updates = await req.json();

    const { error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
