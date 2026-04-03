import { supabase } from './supabase';

export type AnalyticsEventType = 'whatsapp_click' | 'offer_click' | 'product_view';

export const trackEvent = async (
  event_type: AnalyticsEventType, 
  product_id?: string, 
  metadata?: any
) => {
  try {
    const { error } = await supabase.from('analytics_events').insert({
      event_type,
      product_id: product_id || null,
      metadata: metadata || {}
    });
    
    if (error) throw error;
  } catch (err) {
    console.error('Analytics tracking error:', err);
  }
};
