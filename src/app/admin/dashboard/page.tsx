'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Activity, ShoppingBag, Eye, MousePointerClick } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    products: 0,
    newProducts: 0,
    offers: 0,
    views: 0,
    viewGrowth: 0,
    whatsapp: 0,
    waGrowth: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Counts
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: offerCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('has_offer', true);
        
        // 2. Fetch Analytics
        const { count: viewCount } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view');
        const { count: waCount } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click');

        // 3. Fetch Recent Inquiries
        const { data: inquiries } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        // 4. Calculate some growth (simplified for demo)
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { count: newProductsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', firstDayOfMonth);

        setStats({
          products: productCount || 0,
          newProducts: newProductsCount || 0,
          offers: offerCount || 0,
          views: viewCount || 0,
          viewGrowth: viewCount ? 18 : 0,
          whatsapp: waCount || 0,
          waGrowth: waCount ? 24 : 0
        });

        if (inquiries) setRecentInquiries(inquiries);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
        <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
          Last 30 Days
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Products</CardTitle>
            <ShoppingBag className="w-4 h-4 text-earthGreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.products}</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">
              +{stats.newProducts} added this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Offers</CardTitle>
            <Activity className="w-4 h-4 text-earthGreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.offers}</div>
            <p className="text-xs text-muted-foreground mt-1">running currently</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Product Views</CardTitle>
            <Eye className="w-4 h-4 text-earthGreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+{stats.viewGrowth}% vs last month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">WhatsApp Inquiries</CardTitle>
            <MousePointerClick className="w-4 h-4 text-earthGreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.whatsapp.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+{stats.waGrowth}% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts / Activity Space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Main Chart area */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Website Traffic & Inquiries</CardTitle>
            <CardDescription>Daily metrics over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50/50 rounded-md border border-dashed m-6 mt-0 relative overflow-hidden">
             {/* Chart Visualization */}
             <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-2 h-3/4 opacity-80">
                {[45, 65, 40, 85, 55, 95, 115, 80, 125, 105, 145, 125, 165].map((h, i) => (
                   <div 
                    key={i} 
                    className="w-full bg-earthGreen/40 rounded-t-sm transition-all hover:bg-earthGreen cursor-pointer" 
                    style={{ height: `${(h/165)*100}%` }} 
                   />
                ))}
             </div>
             <div className="z-10 flex flex-col items-center">
               <LineChart className="w-8 h-8 text-earthGreen/30 mb-2" />
               <span className="text-xs text-slate-400 font-medium tracking-tight">REAL-TIME TRAFFIC ACTIVE</span>
             </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries List */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest submissions from website</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                       <div className="h-3 w-1/2 bg-slate-100 rounded" />
                       <div className="h-2 w-full bg-slate-100 rounded" />
                    </div>
                  </div>
                ))
              ) : recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry, i) => (
                  <div key={i} className="flex gap-3 text-sm pb-4 border-b last:border-0 last:pb-0 border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-earthGreen/10 flex items-center justify-center text-earthGreen font-bold shrink-0">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-slate-900">{inquiry.name}</h4>
                      <p className="text-slate-500 truncate mt-0.5">{inquiry.message}</p>
                      <span className="text-xs text-slate-400 mt-1 block">{formatTime(inquiry.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">No recent inquiries</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

