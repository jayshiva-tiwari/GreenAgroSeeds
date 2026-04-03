'use client';

import { useState } from 'react';
import { Tag, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';

interface OffersTableProps {
  initialOffers: Product[];
}

export default function OffersTable({ initialOffers }: OffersTableProps) {
  const [offers, setOffers] = useState(initialOffers);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [offerToRemove, setOfferToRemove] = useState<Product | null>(null);

  const removeOffer = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ has_offer: false }),
      });

      if (!res.ok) {
        throw new Error('Failed to remove offer');
      }

      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert('Error removing offer');
    } finally {
      setDeletingId(null);
    }
  };

  const onFormSuccess = async () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    try {
      // Re-fetch active offers
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const freshData = json.data as Product[];
          setOffers(freshData.filter((p) => p.has_offer));
        }
      }
    } catch {
      // Ignore
    }
  };

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden border-slate-200/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50/50 border-b text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5 whitespace-nowrap">Original Price</th>
                <th className="px-6 py-5">Offer Label</th>
                <th className="px-6 py-5">Expiry</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {offers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No active offers found.
                  </td>
                </tr>
              )}
              {offers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                        <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-1">{p.name_en}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-400 line-through">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 flex items-center gap-2 w-fit border border-red-100">
                      <Tag className="w-3.5 h-3.5" /> {p.offer_label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                    {p.offer_expiry ? new Date(p.offer_expiry).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-earthGreen hover:bg-earthGreen/5 rounded-lg transition-colors"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={deletingId === p.id}
                        onClick={() => setOfferToRemove(p)}
                      >
                        {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent className="max-w-4xl w-[98vw] sm:w-[95vw] h-[90vh] md:h-[85vh] p-0 flex flex-col shadow-2xl bg-card border-none overflow-hidden rounded-2xl">
          <div className="p-5 md:px-10 md:py-8 border-b bg-white flex-shrink-0">
            <div className="space-y-1">
              <DialogTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                Edit Offer Details
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-1 text-sm md:text-base">
                Customize the promotion for this product.
              </DialogDescription>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {editingProduct && (
              <ProductForm
                initialData={editingProduct}
                onSuccess={onFormSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={!!offerToRemove} onOpenChange={(open) => !open && setOfferToRemove(null)}>
        <DialogContent className="max-w-md p-6 border-none shadow-2xl rounded-2xl bg-white">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
               <AlertTriangle className="w-6 h-6 text-red-600" />
             </div>
             <div className="space-y-2">
               <DialogTitle className="text-xl font-bold text-slate-900">Remove Offer</DialogTitle>
               <DialogDescription className="text-slate-500 text-base">
                 Are you sure you want to remove the special offer from <span className="font-bold text-slate-700">"{offerToRemove?.name_en}"</span>? The product will remain active.
               </DialogDescription>
             </div>
             <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
               <Button variant="ghost" onClick={() => setOfferToRemove(null)} className="h-11 font-bold text-slate-500 hover:text-slate-900">
                 Cancel
               </Button>
               <Button 
                 onClick={() => {
                   if (offerToRemove) removeOffer(offerToRemove.id);
                   setOfferToRemove(null);
                 }} 
                 className="h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
               >
                 Confirm Removal
               </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
