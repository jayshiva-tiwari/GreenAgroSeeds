'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/lib/api';
import { Loader2, Upload, X, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSuccess?: () => void;
}

export default function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name_en: initialData?.name_en || '',
    name_hi: initialData?.name_hi || '',
    name_gu: initialData?.name_gu || '',
    description_en: initialData?.description_en || '',
    description_hi: initialData?.description_hi || '',
    description_gu: initialData?.description_gu || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || '',
    image_url: initialData?.image_url || '',
    public_id: initialData?.public_id || '',
    is_active: initialData?.is_active ?? true,
    has_offer: initialData?.has_offer ?? false,
    offer_label: initialData?.offer_label || '',
    offer_expiry: initialData?.offer_expiry || '',
    slug: initialData?.slug || '',
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation for 1MB handled by Cloudinary widget, but let's double check if needed
      if (!formData.image_url) {
        alert('Please upload a product image first.');
        setLoading(false);
        return;
      }

      // Sanitize the payload to avoid database type errors (empty strings -> null)
      const sanitize = (val: any) => (val === '' ? null : val);

      const parsedPrice = parseFloat(formData.price) || 0;

      const productPayload = {
        name_en: formData.name_en,
        name_hi: sanitize(formData.name_hi),
        name_gu: sanitize(formData.name_gu),
        description_en: formData.description_en,
        description_hi: sanitize(formData.description_hi),
        description_gu: sanitize(formData.description_gu),
        price: parsedPrice,
        category: formData.category,
        image_url: formData.image_url,
        public_id: sanitize(formData.public_id),
        is_active: formData.is_active,
        has_offer: formData.has_offer,
        offer_label: sanitize(formData.offer_label),
        slug: formData.slug || formData.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };

      // Fallback/demo products have sentinel UUIDs — they don't exist in DB, so always INSERT
      const isFallbackProduct = initialData?.id?.startsWith('00000000-0000-0000-0000-');
      const isNewProduct = !initialData?.id || isFallbackProduct;

      let res: Response;
      if (!isNewProduct) {
        // UPDATE via server API (bypasses RLS)
        res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: initialData!.id, ...productPayload }),
        });
      } else {
        // INSERT via server API (bypasses RLS)
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPayload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        console.error('API error:', errData);
        throw new Error(errData.error || 'Failed to save product');
      }

      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      console.error('Error saving product:', err);
      alert(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!initialData?.id;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-card overflow-hidden relative">
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-10 pb-20 space-y-12 min-h-0">
        {/* Section 1: Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-earthGreen pl-4">1. Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">English Name *</Label>
              <Input
                required
                className="h-12 border-slate-200 focus-visible:ring-earthGreen bg-white"
                value={formData.name_en}
                onChange={e => setFormData({ ...formData, name_en: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Price (₹) *</Label>
              <Input
                required
                type="number"
                step="0.01"
                className="h-12 border-slate-200 focus-visible:ring-earthGreen bg-white font-bold"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category *</Label>
              <Input
                required
                className="h-12 border-slate-200 focus-visible:ring-earthGreen bg-white"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Slug (URL Name)</Label>
              <Input
                className="h-12 border-slate-200 focus-visible:ring-earthGreen bg-white"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Localization */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-blue-500 pl-4">2. Vernacular Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-wider text-slate-500">Hindi Name</Label>
              <Input
                className="h-12 border-slate-200 focus-visible:ring-earthGreen font-hindi bg-white"
                value={formData.name_hi}
                onChange={e => setFormData({ ...formData, name_hi: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-wider text-slate-500">Gujarati Name</Label>
              <Input
                className="h-12 border-slate-200 focus-visible:ring-earthGreen font-gujarati bg-white"
                value={formData.name_gu}
                onChange={e => setFormData({ ...formData, name_gu: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Description */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-4">3. Product Descriptions</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold tracking-wider text-slate-500">English Description *</Label>
              <Textarea
                required
                className="min-h-[120px] border-slate-200 focus-visible:ring-earthGreen leading-relaxed bg-white"
                value={formData.description_en}
                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-wider text-slate-500">Hindi Description</Label>
                <Textarea
                  className="min-h-[100px] border-slate-200 focus-visible:ring-earthGreen font-hindi leading-relaxed bg-white"
                  value={formData.description_hi}
                  onChange={e => setFormData({ ...formData, description_hi: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold tracking-wider text-slate-500">Gujarati Description</Label>
                <Textarea
                  className="min-h-[100px] border-slate-200 focus-visible:ring-earthGreen font-gujarati leading-relaxed bg-white"
                  value={formData.description_gu}
                  onChange={e => setFormData({ ...formData, description_gu: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Imagery */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-500 pl-4">4. Media Support</h3>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-64 h-64 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50/50 relative shadow-inner">
              {formData.image_url ? (
                <>
                  <img src={formData.image_url} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '', public_id: '' }))}
                    className="absolute top-3 right-3 bg-white/90 text-red-600 p-2 rounded-full hover:bg-white shadow-xl transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <Upload className="h-12 w-12" />
                  <span className="text-xs font-black tracking-widest uppercase">No Image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6 self-center">
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign"
                onSuccess={(result: any) => {
                  const info = result.info as any;
                  setFormData(prev => ({
                    ...prev,
                    image_url: info.secure_url,
                    public_id: info.public_id
                  }));
                }}
                options={{
                  maxFiles: 1,
                  clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                  maxFileSize: 1000000,
                  folder: 'agri-company/products',
                }}
              >
                {({ open }: any) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open?.()}
                    className="h-12 border-2 border-slate-200 font-bold hover:bg-slate-50 rounded-xl px-8"
                  >
                    <Upload className="h-5 w-5 mr-3" />
                    {formData.image_url ? 'Change Image' : 'Select Product Image'}
                  </Button>
                )}
              </CldUploadWidget>
              <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50/30 text-xs space-y-2 text-slate-600">
                <p className="font-black text-blue-700 uppercase tracking-tighter">Optimization Guidelines</p>
                <p>High-resolution images sell faster. WebP compression is applied automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Visibility & Promotional Offers */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-red-500 pl-4">5. Settings & Offers</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 border rounded-xl bg-white flex items-center justify-between shadow-sm gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <Label htmlFor="switch-active" className="text-base font-bold text-slate-800 block truncate cursor-pointer">Active Listing</Label>
                <p className="text-xs text-slate-500 font-medium tracking-tight truncate">Make this product live on your website</p>
              </div>
              <div className="shrink-0 flex items-center h-8">
                <Switch
                  id="switch-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                  className="data-[checked]:bg-earthGreen cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border rounded-xl bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label htmlFor="switch-offer" className="text-base font-bold text-slate-800 block truncate cursor-pointer">Special Offer Label</Label>
                  <p className="text-xs text-slate-500 font-medium tracking-tight truncate">Show a promotional badge on product card</p>
                </div>
                <div className="shrink-0 flex items-center h-8">
                  <Switch
                    id="switch-offer"
                    checked={formData.has_offer}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, has_offer: checked })}
                    className="data-[checked]:bg-red-600 cursor-pointer"
                  />
                </div>
              </div>

              {formData.has_offer && (
                <div className="pt-4 border-t space-y-3">
                  <Label className="text-xs font-black text-red-600 uppercase tracking-widest">Offer Text</Label>
                  <Input
                    placeholder="e.g. 10% OFF, Limited Edition"
                    className="h-10 border-red-100 focus-visible:ring-red-600 bg-white"
                    value={formData.offer_label}
                    onChange={e => setFormData({ ...formData, offer_label: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Modern Dashboard Footer */}
      <div className="shrink-0 px-6 md:px-10 py-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isEditing ? 'bg-amber-400' : 'bg-green-500'} shadow-sm shadow-black/10`} />
          <span className="text-sm font-black text-slate-800 tracking-tight">{isEditing ? 'EDITING PRODUCT' : 'NEW PRODUCT CREATION'}</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            type="button"
            disabled={loading}
            onClick={() => onSuccess?.()}
            className="flex-1 sm:flex-none h-12 px-8 font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none h-12 px-12 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>{isEditing ? 'Confirm Changes' : 'Create Product'}</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
