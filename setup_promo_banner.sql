-- Step 1: Create promo_banner table
CREATE TABLE IF NOT EXISTS public.promo_banner (
  id uuid primary key default gen_random_uuid(),
  badge_text text,
  badge_color text default '#EF4444',
  heading text not null,
  subheading text,
  button_text text default 'Shop Offers Now',
  button_link text default '/offers',
  bg_color text default '#2D6A35',
  bg_image_url text,
  bg_overlay numeric default 0.35,
  text_color text default '#FFFFFF',
  is_active boolean default true,
  updated_at timestamp with time zone default now()
);

-- Step 2: RLS Policies
ALTER TABLE public.promo_banner ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on promo_banner"
  ON public.promo_banner FOR SELECT
  USING (true);

-- Allow authenticated user to insert/update (further restricted in API route or by matching exact UID if known)
CREATE POLICY "Allow authenticated insert on promo_banner"
  ON public.promo_banner FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on promo_banner"
  ON public.promo_banner FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 3: Insert default row
INSERT INTO public.promo_banner (
  badge_text,
  badge_color,
  heading,
  subheading,
  button_text,
  button_link,
  bg_color,
  text_color
)
SELECT 
  'LIMITED TIME DEALS',
  '#ef4444', -- red-500
  'Huge Savings on Farm Fresh Goods',
  'Get up to 20% off on selected seasonal items. Don''t miss out on these exclusive farm direct deals.',
  'Shop Offers Now',
  '/offers',
  '#2D6A35', -- earthGreen approximate or whatever they use
  '#FFFFFF'
WHERE NOT EXISTS (SELECT 1 FROM public.promo_banner);
