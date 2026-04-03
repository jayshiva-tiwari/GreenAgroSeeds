'use client';

import { useState } from 'react';
import { Phone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function InquiryItem({ inquiry }: { inquiry: Inquiry }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsRead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: true }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to mark read', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white border rounded-xl p-6 shadow-sm transition-colors ${!inquiry.is_read ? 'border-l-4 border-l-earthGreen bg-green-50/20' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-slate-900">{inquiry.name}</h3>
              {!inquiry.is_read && (
                <span className="px-2 py-0.5 rounded-full bg-earthGreen text-white text-[10px] font-black uppercase tracking-widest">New</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-earthGreen/60" /> {inquiry.phone}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-300" /> {new Date(inquiry.created_at).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg text-slate-700 italic border border-slate-100/50 leading-relaxed">
            "{inquiry.message}"
          </div>
        </div>
        
        <div className="flex sm:flex-col gap-2 shrink-0">
          {!inquiry.is_read && (
            <Button 
                onClick={handleMarkAsRead}
                disabled={loading}
                className="bg-white border-2 border-earthGreen text-earthGreen hover:bg-earthGreen hover:text-white rounded-lg h-11 font-bold shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark as Read
            </Button>
          )}
          {inquiry.is_read && (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold opacity-70">
              <CheckCircle className="w-4 h-4" /> Solved
            </div>
          )}
          <a 
            href={`https://wa.me/${inquiry.phone}?text=Hi ${inquiry.name}, `} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center px-4 py-2.5 rounded-lg font-bold shadow-md transition-all h-11"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="mr-2"
                fill="currentColor"
            >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.12 1.521 5.86L.07 23.361c-.131.478.351.921.808.736l5.72-2.317C8.167 23.447 10.016 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.812c-1.854 0-3.606-.516-5.1-.1.408 1.516z" className="opacity-0"/>
                <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.099-.47-.15-.667.15-.198.3-.765.971-.937 1.171-.173.199-.345.225-.646.075-.301-.15-1.272-.469-2.421-1.492-.895-.795-1.501-1.776-1.677-2.076-.176-.3-.019-.462.132-.611.135-.135.301-.35.452-.525.151-.175.201-.299.301-.499.1-.2.05-.375-.025-.525-.075-.15-.667-1.603-.914-2.197-.24-.582-.486-.503-.667-.512-.172-.008-.37-.01-.568-.01-.198 0-.521.074-.794.373-.273.3-1.041 1.018-1.041 2.484 0 1.467 1.066 2.88 1.216 3.079.149.199 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.417.247-.695.247-1.292.173-1.417-.074-.125-.272-.199-.572-.349z" />
            </svg>
            WhatsApp Reply
          </a>
        </div>
      </div>
    </div>
  );
}
