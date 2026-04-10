import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper to get remote IP (for basic rate limiting)
function getIP(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

// In-memory rate limiting map
// Warning: This is scoped to serverless instance. For production, use Edge middleware or Redis.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('approved_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Basic Rate limiting: max 3 per IP per day (86400000 ms)
    const ip = getIP(request);
    const now = Date.now();
    const limit = rateLimitMap.get(ip);
    
    if (limit) {
      if (now - limit.timestamp < 86400000) {
        if (limit.count >= 3) {
          return NextResponse.json({ error: 'Too many submissions. Please try again tomorrow.' }, { status: 429 });
        }
        rateLimitMap.set(ip, { ...limit, count: limit.count + 1 });
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    const { name, location, rating, message, avatar_url } = body;

    // Validate
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    if (!message || message.trim().length < 20 || message.trim().length > 300) {
      return NextResponse.json({ error: 'Invalid message length' }, { status: 400 });
    }

    // Insert to Supabase using service role to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([
        {
          name: name.trim(),
          location: location ? location.trim() : null,
          rating,
          message: message.trim(),
          avatar_url: avatar_url || null,
          is_approved: false
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send email notification to admin via Resend
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const adminUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard/testimonials`
        : 'http://localhost:3000/admin/dashboard/testimonials';
      
      const starsDisplay = '⭐'.repeat(rating);

      await resend.emails.send({
        from: 'Green Seeds Agro <notifications@greenseedsagro.in>',
        to: [process.env.ADMIN_EMAIL],
        subject: `New Testimonial Pending Review - ${name}`,
        html: `
          <h2>New Testimonial Submitted</h2>
          <p>A new testimonial has been submitted and is waiting for your approval.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Location:</strong> ${location || 'N/A'}</p>
            <p><strong>Rating:</strong> ${starsDisplay}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          <p>
            <a href="${adminUrl}" style="background-color: #009639; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review Testimonial
            </a>
          </p>
        `,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Testimonial submission error:', error);
    return NextResponse.json({ error: error.message || 'Submission failed' }, { status: 500 });
  }
}
