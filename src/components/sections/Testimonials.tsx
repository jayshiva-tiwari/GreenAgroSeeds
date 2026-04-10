'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import './testimonials.css';
import { supabase } from '@/lib/supabase';

import { useRouter } from '@/i18n/routing';

// Define the Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  avatar_url: string | null;
  rating: number;
  message: string;
  is_approved: boolean;
  is_featured: boolean;
  submitted_at: string;
  approved_at: string | null;
}

interface TestimonialsProps {
  limit?: number;
}

export default function Testimonials({ limit }: TestimonialsProps = {}) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(limit ? data.slice(0, limit) : data);
        } else {
          // fallback direct fallback for client
          const { data } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_approved', true)
            .order('approved_at', { ascending: false });
          if (data) {
            setTestimonials(limit ? data.slice(0, limit) : data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch testimonials", e);
      }
    }
    fetchTestimonials();
  }, [limit]);

  const total = testimonials.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (total === 0 || isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [total, isHovered, handleNext]);

  // Swipe handling
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const scrollToForm = () => {
    const formEl = document.getElementById('testimonial-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/testimonials#testimonial-form-section');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  // Render Stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} className="star-icon filled" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="star-icon empty" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        {/* SECTION HEADER */}
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">
            Our client send us bunch of smilies with our services and we love them
          </p>
        </div>

        {total === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg italic">No testimonials yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            {/* CAROUSEL */}
            <div
              className="testimonials-carousel"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >

              {/* Decorative Side Avatars */}
              <div className="side-avatar left">
                {testimonials[currentIndex === 0 ? total - 1 : currentIndex - 1].avatar_url ? (
                  <img src={testimonials[currentIndex === 0 ? total - 1 : currentIndex - 1].avatar_url as string} alt="Previous" className="side-img" />
                ) : (
                  <div className="side-initials">{getInitials(testimonials[currentIndex === 0 ? total - 1 : currentIndex - 1].name)}</div>
                )}
              </div>

              <div className="side-avatar right">
                {testimonials[currentIndex === total - 1 ? 0 : currentIndex + 1].avatar_url ? (
                  <img src={testimonials[currentIndex === total - 1 ? 0 : currentIndex + 1].avatar_url as string} alt="Next" className="side-img" />
                ) : (
                  <div className="side-initials">{getInitials(testimonials[currentIndex === total - 1 ? 0 : currentIndex + 1].name)}</div>
                )}
              </div>

              <button className="nav-arrow left-arrow" onClick={handlePrev} aria-label="Previous testimonial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* MAIN CARD */}
              <div className="testimonial-card-main" key={testimonials[currentIndex].id}>
                <div className="testimonial-avatar">
                  {testimonials[currentIndex].avatar_url ? (
                    <img src={testimonials[currentIndex].avatar_url} alt={testimonials[currentIndex].name} className="main-img" />
                  ) : (
                    <div className="main-initials">{getInitials(testimonials[currentIndex].name)}</div>
                  )}
                </div>

                <h3 className="testimonial-name">{testimonials[currentIndex].name}</h3>
                {testimonials[currentIndex].location && <p className="testimonial-location">{testimonials[currentIndex].location}</p>}

                <div className="testimonial-rating">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                <div className="testimonial-message-container">
                  <span className="quote-mark left-quote">“</span>
                  <p className="testimonial-message">{testimonials[currentIndex].message}</p>
                  <span className="quote-mark right-quote">”</span>
                </div>
              </div>

              <button className="nav-arrow right-arrow" onClick={handleNext} aria-label="Next testimonial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

            </div>

            {/* DOTS */}
            <div className="testimonials-dots">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* SUBMIT BUTTON */}
        <div className="testimonials-action">
          <button className="share-btn" onClick={scrollToForm}>
            Share Your Experience &rarr;
          </button>
        </div>

      </div>
    </section>
  );
}
