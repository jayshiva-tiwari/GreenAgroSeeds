import { supabase } from '@/lib/supabase';
import { getActiveOffers } from '@/lib/api';
import OffersTable from '@/components/admin/OffersTable';

export default async function AdminOffersPage() {
  let offers = [];
  try {
    const { data } = await supabase.from('products').select('*').eq('has_offer', true).order('created_at', { ascending: false });
    offers = data || await getActiveOffers();
  } catch (err) {
    offers = await getActiveOffers();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Offers</h1>
          <p className="text-slate-500">Manage current promotions and discounts</p>
        </div>
      </div>

      <OffersTable initialOffers={offers} />
    </div>
  );
}
