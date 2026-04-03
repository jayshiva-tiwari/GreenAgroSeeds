import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id } = await props.params;
    const { is_read } = await req.json();

    const { error } = await supabaseAdmin
      .from('inquiries')
      .update({ is_read })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Inquiry updated' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
      const supabaseAdmin = createAdminClient();
      const { id } = await props.params;
  
      const { error } = await supabaseAdmin
        .from('inquiries')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
  
      return NextResponse.json({ success: true, message: 'Inquiry deleted' });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
    }
}
