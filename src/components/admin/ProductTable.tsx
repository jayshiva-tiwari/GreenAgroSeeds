'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Loader2, AlertCircle, ShoppingBag, CheckCircle2, AlertTriangle, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

interface ProductTableProps {
  initialProducts: Product[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filtered = products.filter(p => 
    p.name_en.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    withOffers: products.filter(p => p.has_offer).length,
    categories: new Set(products.map(p => p.category)).size
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  const onFormSuccess = async () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    // Re-fetch products via API
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setProducts(json.data as Product[]);
      }
    } catch {
      // If fetch fails, the table will show stale data until the user refreshes
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header & Stats Overview */}
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-earthGreen mb-1">
               <div className="p-2 bg-earthGreen/10 rounded-lg">
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <span className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-70">Catalog Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Products Catalog</h1>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl">Manage your inventory, pricing, and promotional offers from a central dashboard.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingProduct(null);
          }}>
            <DialogTrigger
              render={
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="bg-earthGreen hover:bg-lightGreen text-white h-12 md:h-14 px-6 md:px-8 font-bold shadow-lg shadow-earthGreen/20 hover:shadow-xl hover:shadow-earthGreen/30 transition-all hover:-translate-y-0.5 active:translate-y-0 rounded-xl flex items-center justify-center gap-3 w-full lg:w-auto"
                >
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg">Add New Product</span>
                </Button>
              }
            >
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[98vw] sm:w-[95vw] h-[90vh] md:h-[85vh] p-0 flex flex-col shadow-2xl bg-card border-none overflow-hidden rounded-2xl">
              <div className="p-5 md:px-10 md:py-8 border-b bg-white flex-shrink-0">
                <div className="space-y-1">
                  <DialogTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium pt-1 text-sm md:text-base">
                    {editingProduct ? 'Carefully review and update your catalog details.' : 'Introduce your latest farm-fresh offering to customers.'}
                  </DialogDescription>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <ProductForm 
                  initialData={editingProduct || undefined} 
                  onSuccess={onFormSuccess} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
           {[
             { label: 'Total Products', value: stats.total, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Active Listings', value: stats.active, icon: CheckCircle2, color: 'text-earthGreen', bg: 'bg-green-50' },
             { label: 'Special Offers', value: stats.withOffers, icon: Percent, color: 'text-red-600', bg: 'bg-red-50' },
             { label: 'Categories', value: stats.categories, icon: Tag, color: 'text-amber-600', bg: 'bg-amber-50' },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                 <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden border-slate-200/60">
        <div className="p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by product name or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 w-full bg-white border-slate-200 focus-visible:ring-earthGreen rounded-xl shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-600 font-bold shadow-sm">
             <span className="w-2.5 h-2.5 rounded-full bg-earthGreen animate-pulse" />
             {filtered.length} products found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50/50 border-b text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Promotion</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 border border-slate-200 overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {p.public_id ? (
                          <CldImage
                            src={p.public_id}
                            alt={p.name_en}
                            width={100}
                            height={100}
                            crop="fill"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image 
                            src={p.image_url} 
                            alt={p.name_en} 
                            fill
                            className="object-cover" 
                          />
                        )}
                      </div>
                      <div>
                        <span className="block text-base">{p.name_en}</span>
                        <span className="block text-xs font-medium text-slate-400 mt-0.5 tracking-tight uppercase">SLUG: {p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">{p.category}</span>
                  </td>
                  <td className="px-6 py-5 font-black text-earthGreen text-lg">₹{p.price}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-green-600' : 'bg-slate-400'}`} />
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {p.has_offer ? (
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 flex items-center gap-2 w-fit border border-red-100 animate-pulse">
                        <Tag className="w-3.5 h-3.5" /> {p.offer_label}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-10 w-10 text-slate-400 hover:text-earthGreen border-slate-200 hover:border-earthGreen hover:bg-earthGreen/5 rounded-xl shadow-sm transition-all active:scale-95"
                         onClick={() => {
                           setEditingProduct(p);
                           setIsDialogOpen(true);
                         }}
                       >
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="outline" 
                         size="icon" 
                         className="h-10 w-10 text-slate-400 hover:text-red-500 border-slate-200 hover:border-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all active:scale-95"
                         disabled={deletingId === p.id}
                         onClick={() => setProductToDelete(p)}
                       >
                         {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-28 text-center bg-slate-50/30">
                      <div className="flex flex-col items-center max-w-xs mx-auto text-slate-400">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                            <AlertCircle className="w-10 h-10" />
                         </div>
                         <p className="text-xl font-bold text-slate-800">No products found</p>
                         <p className="text-sm mt-2 leading-relaxed">We couldn't find any products matching your search. Try adjusting your filters or add a new item.</p>
                         <Button 
                            variant="link" 
                            className="mt-4 text-earthGreen font-bold"
                            onClick={() => setSearch('')}
                         >
                           Clear Search
                         </Button>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="max-w-md p-6 border-none shadow-2xl rounded-2xl bg-white">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
               <AlertTriangle className="w-6 h-6 text-red-600" />
             </div>
             <div className="space-y-2">
               <DialogTitle className="text-xl font-bold text-slate-900">Remove Product</DialogTitle>
               <DialogDescription className="text-slate-500 text-base">
                 Are you sure you want to delete <span className="font-bold text-slate-700">"{productToDelete?.name_en}"</span>? This will permanently remove the item from your catalog.
               </DialogDescription>
             </div>
             <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
               <Button variant="ghost" onClick={() => setProductToDelete(null)} className="h-11 font-bold text-slate-500 hover:text-slate-900">
                 Cancel
               </Button>
               <Button 
                 onClick={() => {
                   if (productToDelete) handleDelete(productToDelete.id);
                   setProductToDelete(null);
                 }} 
                 className="h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
               >
                 Confirm Deletion
               </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
