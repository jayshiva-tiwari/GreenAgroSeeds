import { createAdminClient } from '@/lib/supabase-admin';
import InquiryItem from '@/components/admin/InquiryItem';
import { Mail } from 'lucide-react';

export const revalidate = 0; // Ensures fresh data is fetched

export default async function AdminInquiriesPage() {
  let inquiries = [];
  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inquiries:', error);
    }
    
    inquiries = data || [];
  } catch (err) {
    console.error('Failed to load inquiries:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Farm Inquiries</h1>
          <p className="text-slate-500 font-medium">Direct messages from your customers and farmers.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries.map((inq: any) => (
          <InquiryItem key={inq.id} inquiry={inq} />
        ))}
        {inquiries.length === 0 && (
          <div className="text-center py-20 bg-white border rounded-xl">
             <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-900">No Inquiries</h3>
          </div>
        )}
      </div>
    </div>
  );
}
