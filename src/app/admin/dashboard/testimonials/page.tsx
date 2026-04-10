'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Star, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchAllTestimonials, approveTestimonial, toggleFeatureTestimonial, deleteTestimonial } from './actions';

export default function AdminTestimonialsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For rejecting/removing popover dummy state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTestimonials();
      if (data) {
        setPending(data.filter((t: any) => !t.is_approved));
        setApproved(data.filter((t: any) => t.is_approved).sort((a: any, b: any) => new Date(b.approved_at).getTime() - new Date(a.approved_at).getTime()));
      }
    } catch (error) {
      console.error('Failed to fetch testimonials', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveTestimonial(id);
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      alert('Failed to approve');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      setConfirmDeleteId(null);
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      await toggleFeatureTestimonial(id, currentStatus);
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      alert('Failed to update feature status');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 fill-slate-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Testimonials Manager</h1>
        <p className="text-slate-500 text-sm mt-1">Review and manage customer feedback for the public website.</p>
      </div>

      <div className="flex gap-2 bg-slate-200/50 p-1 w-fit rounded-full">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2
            ${activeTab === 'pending' ? 'bg-earthGreen text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          Pending
          {pending.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'pending' ? 'bg-white text-earthGreen' : 'bg-amber-500 text-white'}`}>
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors
            ${activeTab === 'approved' ? 'bg-earthGreen text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}
          `}
        >
          Approved
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading...</div>
        ) : activeTab === 'pending' ? (
          pending.length > 0 ? pending.map(item => (
            <Card key={item.id} className="overflow-hidden border-slate-200 shadow-sm">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-earthGreen font-bold text-lg">{item.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <span className="text-slate-500 text-sm">{item.location && `• ${item.location}`}</span>
                    <span className="text-slate-400 text-xs ml-auto whitespace-nowrap">
                      {new Date(item.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">{renderStars(item.rating)}</div>
                  <p className="text-slate-600 text-sm line-clamp-2 italic">"{item.message}"</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 sm:flex-none h-9 px-4 bg-earthGreen hover:bg-earthGreen/90 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Approve
                  </button>
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="w-full h-9 px-4 bg-red-100/50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
                    >
                      Reject
                    </button>
                    {confirmDeleteId === item.id && (
                      <div className="absolute right-0 top-11 p-3 bg-white border shadow-xl rounded-xl w-48 z-10">
                        <p className="text-xs font-semibold mb-3 text-slate-800">Delete this testimonial?</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-600 text-white text-xs py-1.5 rounded-lg">Yes</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="flex-1 bg-slate-100 text-slate-700 py-1.5 text-xs rounded-lg">No</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-16 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-slate-900 font-medium">No pending testimonials</h3>
              <p className="text-slate-500 text-sm">All caught up!</p>
            </div>
          )
        ) : (
          approved.length > 0 ? approved.map(item => (
            <Card key={item.id} className="overflow-hidden border-slate-200 shadow-sm opacity-90 transition-opacity hover:opacity-100">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-earthGreen font-bold text-lg">{item.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <span className="text-slate-500 text-sm">{item.location && `• ${item.location}`}</span>
                    <span className="text-slate-400 text-xs ml-auto whitespace-nowrap">
                      Approved {new Date(item.approved_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    {renderStars(item.rating)}
                    {item.is_featured && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>}
                  </div>
                  <p className="text-slate-600 text-sm">"{item.message}"</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFeature(item.id, item.is_featured)}
                    className={`flex-1 sm:flex-none h-9 px-4 text-sm font-medium rounded-xl transition-colors ${
                      item.is_featured 
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {item.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="w-full h-9 px-4 bg-red-100/50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                    {confirmDeleteId === item.id && (
                      <div className="absolute right-0 top-11 p-3 bg-white border shadow-xl rounded-xl w-48 z-10">
                        <p className="text-xs font-semibold mb-3 text-slate-800">Remove permanently?</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-600 text-white text-xs py-1.5 rounded-lg">Yes</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="flex-1 bg-slate-100 text-slate-700 py-1.5 text-xs rounded-lg">No</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-16 flex flex-col items-center">
              <Star className="w-12 h-12 text-amber-200 mb-3" />
              <h3 className="text-slate-900 font-medium">No approved testimonials yet</h3>
              <p className="text-slate-500 text-sm">Approve some from the Pending tab</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
