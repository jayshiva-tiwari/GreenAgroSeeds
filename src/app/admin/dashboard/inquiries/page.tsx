import { Mail, Phone, CheckCircle, Clock } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createAdminClient } from '@/lib/supabase-admin';

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
          <h1 className="text-3xl font-bold text-slate-900">Inquiries</h1>
          <p className="text-slate-500">Contact form submissions from visitors</p>
        </div>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inq: any) => (
          <div key={inq.id} className={`bg-white border rounded-xl p-6 shadow-sm transition-colors ${!inq.is_read ? 'border-l-4 border-l-earthGreen' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{inq.name}</h3>
                    {!inq.is_read && (
                      <span className="px-2 py-0.5 rounded-full bg-earthGreen/10 text-earthGreen text-xs font-bold uppercase tracking-wide">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {inq.phone}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(inq.created_at || inq.submitted_at || new Date()).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg text-slate-700 italic border border-slate-100">
                  "{inq.message}"
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button variant="outline" className="border-earthGreen text-earthGreen hover:bg-earthGreen hover:text-white justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Read
                </Button>
                <a 
                  href={`https://wa.me/${inq.phone}?text=Hi ${inq.name}, `} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), "bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center px-4 py-2 rounded-md")}
                >
                  <Phone className="w-4 h-4 mr-2" />  WhatsApp Reply
                </a>
              </div>
            </div>
          </div>
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
