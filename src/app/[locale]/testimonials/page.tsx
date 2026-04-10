import { setRequestLocale } from 'next-intl/server';
import Testimonials from '@/components/sections/Testimonials';
import TestimonialForm from '@/components/sections/TestimonialForm';

export default async function TestimonialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20"> {/* Add top padding if navbar overlays */}
      {/* Optional hero/header specific to the page could go here */}
      {/* <div className="bg-theme-light py-12 text-center border-b border-border">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
          Customer Stories
        </h1>
        <p className="mt-4 text-muted-foreground font-sans max-w-2xl mx-auto px-4 text-balance">
          Discover why thousands of farmers across India choose Green Seeds Agro to power 
          their growth and success season after season.
        </p>
      </div> */}

      {/* <Testimonials /> */}
      <TestimonialForm />
    </div>
  );
}
