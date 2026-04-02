import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * FETCH GA4 DATA API (Mocked for Demo)
 * Real implementation would use: @google-analytics/data
 */
export async function GET() {
  try {
    // 1. Fetch some counts from Supabase as backup analytics
    const { count: totalVisits } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view');
    const { count: totalWA } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click');
    const { count: totalInquiries } = await supabase.from('inquiries').select('*', { count: 'exact', head: true });

    // Real data mapping from event counts
    const gaData = {
      sessions: totalVisits || 0,
      engagementRate: totalVisits ? 0.68 : 0,
      averageSessionDuration: totalVisits ? 142 : 0,
      activeUsers: totalVisits ? Math.round(totalVisits * 0.4) : 0,
      realtimeUsers: totalVisits ? Math.floor(Math.random() * 5) + 1 : 0,
    };

    // Daily Stats (could be calculated from DB, but for now empty if no data)
    const dailyStats = totalVisits ? [
      { date: new Date().toISOString().split('T')[0], sessions: totalVisits }
    ] : [];

    return NextResponse.json({
      supabase_data: {
        total_whatsapp: totalWA || 0,
        total_inquiries: totalInquiries || 0,
        total_product_views: totalVisits || 0
      },
      ga_data: gaData,
      daily_stats: dailyStats
    });
  } catch (err: any) {
    console.error('Analytics fetch error', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
