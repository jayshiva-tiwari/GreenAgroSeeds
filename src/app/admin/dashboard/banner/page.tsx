'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, CheckCircleIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface BannerFormState {
  id?: string;
  is_active: boolean;
  badge_text: string;
  badge_color: string;
  heading: string;
  subheading: string;
  button_text: string;
  button_link: string;
  bg_color: string;
  bg_image_url: string;
  bg_overlay: number;
  text_color: string;
}

export default function BannerAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<BannerFormState>({
    is_active: true,
    badge_text: '',
    badge_color: '#EF4444',
    heading: '',
    subheading: '',
    button_text: 'Shop Offers Now',
    button_link: '/offers',
    bg_color: '#2D6A35',
    bg_image_url: '',
    bg_overlay: 0.35,
    text_color: '#FFFFFF',
  });

  useEffect(() => {
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData({
            id: data.id,
            is_active: data.is_active ?? true,
            badge_text: data.badge_text || '',
            badge_color: data.badge_color || '#EF4444',
            heading: data.heading || '',
            subheading: data.subheading || '',
            button_text: data.button_text || 'Shop Offers Now',
            button_link: data.button_link || '/offers',
            bg_color: data.bg_color || '#2D6A35',
            bg_image_url: data.bg_image_url || '',
            bg_overlay: data.bg_overlay != null ? Number(data.bg_overlay) : 0.35,
            text_color: data.text_color || '#FFFFFF',
          });
        }
      })
      .catch(err => console.error("Error fetching banner", err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!formData.heading.trim()) {
      showToast('Heading is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update banner');
      
      showToast('Banner updated successfully!', 'success');
      if (result.id) {
        setFormData(prev => ({ ...prev, id: result.id }));
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="space-y-1">
      <Label className="text-xs font-bold text-slate-500">{label}</Label>
      <div className="flex items-center gap-3">
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer border-0 rounded p-0"
        />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="h-10 flex-1 uppercase font-mono text-sm"
        />
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-gray-50/50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white font-medium transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
          {toast.type === 'success' && <CheckCircleIcon className="h-5 w-5" />}
          {toast.message}
        </div>
      )}

      {/* LEFT: Editor Form (45%) */}
      <div className="w-full md:w-[45%] h-full overflow-y-auto border-r border-slate-200 bg-white p-6 md:p-8 shrink-0">
        <div className="mb-8">
          <h2 className="text-[18px] font-medium font-dm-sans text-slate-900">Banner Editor</h2>
          <p className="text-[13px] text-slate-500 font-dm-sans mt-1">Changes preview instantly. Click Save to go live.</p>
        </div>

        <div className="space-y-6">
          {/* Field 1: Active Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50">
            <Label className="cursor-pointer">Show banner on website</Label>
            <Switch 
              checked={formData.is_active} 
              onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Field 2 & 3: Badge Text & Color */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">Badge label (optional)</Label>
              <Input 
                placeholder="e.g. LIMITED TIME DEALS" 
                value={formData.badge_text}
                onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
              />
              <p className="text-[11px] text-slate-400">Leave empty to hide</p>
            </div>
            <ColorInput 
              label="Badge color" 
              value={formData.badge_color} 
              onChange={val => setFormData({ ...formData, badge_color: val })} 
            />
          </div>

          {/* Field 4: Heading */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">Main heading *</Label>
            <Input 
              placeholder="e.g. Huge Savings on Farm Fresh Goods" 
              value={formData.heading}
              onChange={e => setFormData({ ...formData, heading: e.target.value })}
            />
          </div>

          {/* Field 5: Subheading */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">Subheading (optional)</Label>
            <Textarea 
              rows={3} 
              placeholder="Short description below the heading" 
              value={formData.subheading}
              onChange={e => setFormData({ ...formData, subheading: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Field 6 & 7: Button setup */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">Button label</Label>
              <Input 
                placeholder="Shop Offers Now" 
                value={formData.button_text}
                onChange={e => setFormData({ ...formData, button_text: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500">Button destination URL</Label>
              <Input 
                placeholder="/offers or https://..." 
                value={formData.button_link}
                onChange={e => setFormData({ ...formData, button_link: e.target.value })}
              />
              <p className="text-[11px] text-slate-400">Use /offers for offers page</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Field 8 & 11: BG and Text colors */}
            <ColorInput 
              label="Banner background color" 
              value={formData.bg_color} 
              onChange={val => setFormData({ ...formData, bg_color: val })} 
            />
            <ColorInput 
              label="Text color" 
              value={formData.text_color} 
              onChange={val => setFormData({ ...formData, text_color: val })} 
            />
          </div>

          {/* Field 9: Background Image */}
          <div className="space-y-2 p-4 border rounded-xl bg-slate-50/50">
            <Label className="text-xs font-bold text-slate-500">Background image (optional)</Label>
            
            {formData.bg_image_url ? (
              <div className="space-y-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <img src={formData.bg_image_url} alt="BG Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setFormData({ ...formData, bg_image_url: '' })}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs h-9"
                  >
                    <X className="w-4 h-4 mr-2" /> Remove image
                  </Button>
                </div>

                {/* Field 10: Overlay Opacity */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs font-bold text-slate-500">Image overlay darkness</Label>
                    <span className="text-xs font-bold text-slate-700">{Math.round(formData.bg_overlay * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={formData.bg_overlay}
                    onChange={(e) => setFormData({ ...formData, bg_overlay: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Transparent</span>
                    <span>Dark</span>
                  </div>
                </div>
              </div>
            ) : (
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign"
                onSuccess={(result: any) => {
                  const info = result.info as any;
                  setFormData(prev => ({ ...prev, bg_image_url: info.secure_url }));
                }}
                options={{ maxFiles: 1, clientAllowedFormats: ["png", "jpg", "jpeg", "webp"] }}
              >
                {({ open }: any) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open?.()}
                    className="w-full h-12 border-dashed border-2 text-slate-500 hover:text-slate-800"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload Image
                  </Button>
                )}
              </CldUploadWidget>
            )}
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full h-12 rounded-[10px] text-[15px] font-medium font-dm-sans transition-all hover:brightness-110"
            style={{ backgroundColor: formData.bg_color, color: formData.text_color }}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Save & Publish Banner
          </Button>

          {/* Add a tiny padding at the very bottom since mobile scrolling can cut off */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* RIGHT: Live Preview (55%) */}
      <div className="w-full md:w-[55%] h-full bg-slate-100 p-6 md:p-8 overflow-y-auto flex flex-col items-center shrink-0">
        <div className="w-full max-w-[800px]">
          <h3 className="text-sm font-medium text-slate-400 mb-4 tracking-wide uppercase text-center md:text-left">Live Preview</h3>
          
          <div className="w-full rounded-[12px] border border-slate-300 shadow-xl overflow-hidden bg-white">
            {formData.is_active ? (
              <div 
                style={{
                  minHeight: '280px',
                  padding: '60px 24px',
                  backgroundColor: formData.bg_image_url ? 'transparent' : formData.bg_color,
                  backgroundImage: formData.bg_image_url ? `url(${formData.bg_image_url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
                className="w-full flex justify-center items-center overflow-hidden"
              >
                {formData.bg_image_url && (
                  <div 
                    className="absolute inset-0 z-0" 
                    style={{ backgroundColor: formData.bg_color, opacity: formData.bg_overlay }}
                  />
                )}

                <div className="relative z-10 w-full max-w-[800px] flex flex-col items-center">
                  {formData.badge_text && (
                    <span 
                      className="font-dm-sans font-bold text-[12px] uppercase tracking-[1px] px-[16px] py-[6px] rounded-full mb-[16px] inline-block text-white"
                      style={{ backgroundColor: formData.badge_color }}
                    >
                      {formData.badge_text}
                    </span>
                  )}

                  {formData.heading ? (
                    <h2 
                      className="font-playfair text-[36px] md:text-[52px] font-bold mb-[16px] text-center leading-[1.2]"
                      style={{ color: formData.text_color }}
                    >
                      {formData.heading}
                    </h2>
                  ) : (
                    <h2 className="font-playfair text-[36px] md:text-[52px] font-bold mb-[16px] text-center leading-[1.2] text-white/50 border border-dashed border-white/20 p-2 rounded">
                      [ Heading Required ]
                    </h2>
                  )}

                  {formData.subheading && (
                    <p 
                      className="font-dm-sans text-[16px] opacity-85 text-center w-full max-w-[560px] mx-auto mb-[28px] leading-[1.6]"
                      style={{ color: formData.text_color }}
                    >
                      {formData.subheading}
                    </p>
                  )}

                  {formData.button_text && (
                    <div
                      className="font-dm-sans font-semibold text-[15px] px-[28px] py-[13px] rounded-[50px] border-[2px] border-transparent inline-block"
                      style={{ backgroundColor: '#FFFFFF', color: formData.bg_color }}
                    >
                      {formData.button_text}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-[280px] w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <span className="font-medium">Banner hidden</span>
                <span className="text-sm mt-2 opacity-70">Toggle "Show banner on website" to preview</span>
              </div>
            )}
          </div>

          <p className="text-[12px] text-slate-400 mt-4 text-center">This is how it looks on your website</p>
        </div>
      </div>
    </div>
  );
}
