'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { 
  Users, Eye, MessageSquare, TrendingUp, Calendar, 
  ArrowUpRight, ArrowDownRight, MousePointer2, Tag, 
  History, Info 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7');

  const fetchAnalytics = async (days: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${days}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const COLORS = ['#3B6D11', '#25D366', '#87A922', '#FDCB6E', '#E17055'];

  if (loading && !data) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-earthGreen border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Crunching your farm data...</p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const dailyStats = data?.daily_stats || [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header with Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-slate-500 font-medium">Real-time insights from your Green Seeds Agro ecosystem.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <Select value={range} onValueChange={(val) => setRange(val || '7')}>
            <SelectTrigger className="w-[180px] border-none shadow-none focus:ring-0 font-bold text-slate-700">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Visits', value: summary.total_visits, icon: Eye, color: 'text-earthGreen', bg: 'bg-green-50', sub: 'Page views recorded' },
          { label: 'Unique Users', value: summary.unique_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Calculated sessions' },
          { label: 'Bounce Rate', value: `${summary.bounce_rate}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Avg engagement rate' },
          { label: 'WhatsApp Clicks', value: summary.whatsapp_clicks, icon: MessageSquare, color: 'text-[#25D366]', bg: 'bg-emerald-50', sub: 'Potential inquiries' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Live <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Engagement over Time */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Traffic & Inquiries</CardTitle>
              <CardDescription>Daily growth metrics</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] p-0 pb-6 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B6D11" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B6D11" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3B6D11', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#3B6D11" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" dot={{r: 4, fill: '#3B6D11', strokeWidth: 2, stroke: '#fff'}} />
                <Line type="monotone" dataKey="inquiries" stroke="#25D366" strokeWidth={3} dot={{r: 4, fill: '#25D366'}} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Conversion Channels */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Inquiry Sources</CardTitle>
            <CardDescription>Channel distributions</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyStats.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                  <XAxis dataKey="date" hide />
                  <Tooltip />
                  <Bar dataKey="whatsapp" fill="#25D366" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="inquiries" fill="#3B6D11" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Most Viewed Products Table */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <MousePointer2 className="w-5 h-5" />
               </div>
               <div>
                  <CardTitle className="text-lg">Most Viewed Products</CardTitle>
                  <CardDescription>Highest intent listings</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                   <tr>
                     <th className="px-6 py-4 text-left">Product Name</th>
                     <th className="px-6 py-4 text-center">Page Views</th>
                     <th className="px-6 py-4 text-right">Trend</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {data?.most_viewed_products?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{p.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-blue-100 text-blue-700 font-black px-3 py-1 rounded-full text-xs">
                            {p.views}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ArrowUpRight className="w-4 h-4 text-green-500 inline" />
                        </td>
                      </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>

        {/* Offer Engagement Table */}
        <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Tag className="w-5 h-5" />
               </div>
               <div>
                  <CardTitle className="text-lg">Offer Engagement</CardTitle>
                  <CardDescription>Flash deal effectiveness</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                   <tr>
                     <th className="px-6 py-4 text-left">Offer / Product</th>
                     <th className="px-6 py-4 text-center">Clicks</th>
                     <th className="px-6 py-4 text-right">Conversion</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {data?.offer_engagement?.map((o: any) => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{o.name}</td>
                        <td className="px-6 py-4 text-center font-black text-amber-600">{o.clicks}</td>
                        <td className="px-6 py-4 text-right text-slate-400 font-medium">8.2%</td>
                      </tr>
                   ))}
                   {(!data?.offer_engagement || data.offer_engagement.length === 0) && (
                     <tr>
                       <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                         No offer data for this period.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Change Row */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-900 rounded-lg text-white">
                  <History className="w-5 h-5" />
               </div>
               <div>
                  <CardTitle className="text-lg">Recent Price Change History</CardTitle>
                  <CardDescription>Track inventory pricing adjustments</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                   <tr>
                     <th className="px-8 py-5 text-left border-b">Timestamp</th>
                     <th className="px-8 py-5 text-left border-b">Product</th>
                     <th className="px-8 py-5 text-center border-b">Adjustment</th>
                     <th className="px-8 py-5 text-right border-b">Change</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {data?.price_history?.map((entry: any) => {
                      const diff = (entry.new_price || 0) - (entry.old_price || 0);
                      const isUp = diff > 0;
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5 text-slate-400 font-medium">{new Date(entry.date).toLocaleString()}</td>
                          <td className="px-8 py-5 font-bold text-slate-900">{entry.product_name}</td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-2 font-black">
                               <span className="text-slate-400 scale-90">₹{entry.old_price}</span>
                               <ArrowRight className="w-3 h-3 text-slate-300" />
                               <span className="text-slate-900">₹{entry.new_price}</span>
                            </div>
                          </td>
                          <td className={`px-8 py-5 text-right font-black ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                             <div className="flex items-center justify-end gap-1">
                                {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                ₹{Math.abs(diff)}
                             </div>
                          </td>
                        </tr>
                      );
                   })}
                   {(!data?.price_history || data.price_history.length === 0) && (
                     <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">No price adjustments tracked.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
      </Card>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}

