'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function fetchAllTestimonials() {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error('fetch error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function approveTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({ is_approved: true, approved_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw new Error(error.message);
  return true;
}

export async function toggleFeatureTestimonial(id: string, currentStatus: boolean) {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({ is_featured: !currentStatus })
    .eq('id', id);
  
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
  return true;
}
