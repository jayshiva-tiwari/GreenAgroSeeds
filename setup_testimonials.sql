-- Create testmonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NULL,
    avatar_url TEXT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    approved_at TIMESTAMP WITH TIME ZONE NULL
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public SELECT: only where is_approved = true
CREATE POLICY "Public SELECT approved testimonials" 
    ON public.testimonials 
    FOR SELECT 
    TO public 
    USING (is_approved = true);

-- Public INSERT: allowed for anyone
CREATE POLICY "Public INSERT new testimonial" 
    ON public.testimonials 
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Admin UPDATE and DELETE: only authenticated admin
CREATE POLICY "Admin UPDATE all testimonials" 
    ON public.testimonials 
    FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Admin DELETE all testimonials" 
    ON public.testimonials 
    FOR DELETE 
    TO authenticated 
    USING (true);

-- Admin SELECT all testimonials
CREATE POLICY "Admin SELECT all testimonials" 
    ON public.testimonials 
    FOR SELECT 
    TO authenticated 
    USING (true);
