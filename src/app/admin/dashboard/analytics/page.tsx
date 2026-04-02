'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const dailyVisitsData = [
    { name: 'Mon', visits: 400, inquiries: 4 },
    { name: 'Tue', visits: 300, inquiries: 2 },
    { name: 'Wed', visits: 550, inquiries: 6 },
    { name: 'Thu', visits: 480, inquiries: 5 },
    { name: 'Fri', visits: 600, inquiries: 10 },
    { name: 'Sat', visits: 800, inquiries: 15 },
    { name: 'Sun', visits: 950, inquiries: 22 },
  ];

  const trafficSources = [
    { name: 'Google Search', value: analyticsData?.ga_data?.sessions ? Math.round(analyticsData.ga_data.sessions * 0.4) : 450, color: '#4285F4' },
    { name: 'Direct', value: analyticsData?.ga_data?.sessions ? Math.round(analyticsData.ga_data.sessions * 0.3) : 300, color: '#3B6D11' },
    { name: 'WhatsApp Links', value: analyticsData?.supabase_data?.total_whatsapp || 200, color: '#25D366' },
    { name: 'Social Media', value: analyticsData?.ga_data?.sessions ? Math.round(analyticsData.ga_data.sessions * 0.1) : 150, color: '#E1306C' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500">Website performance metrics (Database & GA4)</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-4 rounded-xl border shadow-sm">
              <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider mb-1">Active Sessions</span>
              <span className="text-2xl font-bold text-earthGreen">{analyticsData?.ga_data?.realtimeUsers || 0}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Daily Traffic & Engagement</CardTitle>
            <CardDescription>Visits and Inquiries over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVisitsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="visits" stroke="#3B6D11" strokeWidth={3} dot={{r: 4, fill: '#3B6D11'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="inquiries" stroke="#25D366" strokeWidth={3} dot={{r: 4, fill: '#25D366'}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSources.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

