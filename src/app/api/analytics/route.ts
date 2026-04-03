import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7'; // Default 7 days
    const days = parseInt(range);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateIso = startDate.toISOString();

    // 1. Fetch Event Metrics grouped by day
    // We'll fetch all events in range and group them in JS for simplicity or use specific counts
    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDateIso);

    const { data: inquiries } = await supabase
      .from('inquiries')
      .select('created_at')
      .gte('created_at', startDateIso);

    // 2. Derive Stats per Day
    const dailyStats: Record<string, any> = {};
    
    // Initialize stats for each day in range
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyStats[dateStr] = { date: dateStr, visits: 0, whatsapp: 0, inquiries: 0 };
    }

    events?.forEach(evt => {
        const d = evt.created_at.split('T')[0];
        if (dailyStats[d]) {
            if (evt.event_type === 'product_view') dailyStats[d].visits++;
            if (evt.event_type === 'whatsapp_click') dailyStats[d].whatsapp++;
        }
    });

    inquiries?.forEach(inq => {
        const d = inq.created_at.split('T')[0];
        if (dailyStats[d]) dailyStats[d].inquiries++;
    });

    const dailyStatsArray = Object.values(dailyStats).sort((a: any, b: any) => a.date.localeCompare(b.date));

    // 3. Grouped Metrics
    // Most Viewed Products
    const productViews: Record<string, number> = {};
    events?.filter(e => e.event_type === 'product_view' && e.product_id).forEach(e => {
        productViews[e.product_id] = (productViews[e.product_id] || 0) + 1;
    });
    
    // We'd need to join with product names, but for now we'll return raw IDs or find names if we can fetch all products
    const { data: products } = await supabase.from('products').select('id, name_en');
    const mostViewedProducts = Object.entries(productViews)
        .map(([id, views]) => ({
            id,
            views,
            name: products?.find(p => p.id === id)?.name_en || 'Unknown Product'
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    // Offer Engagement
    const offerClicks: Record<string, number> = {};
    events?.filter(e => e.event_type === 'offer_click' && e.product_id).forEach(e => {
        offerClicks[e.product_id] = (offerClicks[e.product_id] || 0) + 1;
    });
    const offerEngagement = Object.entries(offerClicks)
        .map(([id, clicks]) => ({
            id,
            clicks,
            name: products?.find(p => p.id === id)?.name_en || 'Offer'
        }))
        .sort((a, b) => b.clicks - a.clicks);

    // Price Change History
    const { data: priceHistory } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'price_change')
        .order('created_at', { ascending: false })
        .limit(10);
    
    const formattedPriceHistory = priceHistory?.map(ph => ({
        id: ph.id,
        date: ph.created_at,
        product_name: products?.find(p => p.id === ph.product_id)?.name_en || 'Product',
        old_price: ph.metadata?.old_price,
        new_price: ph.metadata?.new_price
    })) || [];

    // 4. GA4 Metrics (Mocked/Derived from Supabase as fallback)
    const totalVisits = events?.filter(e => e.event_type === 'product_view').length || 0;
    const uniqueUsers = new Set(events?.filter(e => e.metadata?.session_id).map(e => e.metadata.session_id)).size || Math.round(totalVisits * 0.7);
    
    // Recent Inquiries for Dashboard
    const { data: recentInquiries } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    return NextResponse.json({
      daily_stats: dailyStatsArray,
      most_viewed_products: mostViewedProducts,
      offer_engagement: offerEngagement,
      price_history: formattedPriceHistory,
      recent_inquiries: recentInquiries || [],
      summary: {
        total_visits: totalVisits,
        unique_users: uniqueUsers,
        bounce_rate: 42.5, // Mocked
        whatsapp_clicks: events?.filter(e => e.event_type === 'whatsapp_click').length || 0,
        total_inquiries: inquiries?.length || 0
      }
    });
  } catch (err: any) {
    console.error('Analytics fetch error', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
