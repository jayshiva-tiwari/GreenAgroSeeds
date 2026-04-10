'use client';

import React, { useState, useRef } from 'react';
import './testimonial-form.css';

export default function TestimonialForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRatingText = (val: number) => {
    switch (val) {
      case 5: return "5 stars — Excellent!";
      case 4: return "4 stars — Very Good!";
      case 3: return "3 stars — Good!";
      case 2: return "2 stars — Fair!";
      case 1: return "1 star — Poor!";
      default: return "";
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Only JPEG, PNG, or WEBP allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Max size is 2MB');
      return;
    }

    setUploadError('');
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhotoToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary not configured');
    }

    // Get signature
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const paramsToSign = {
      timestamp,
      folder: 'testimonials'
    };

    const sigRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paramsToSign }),
    });

    if (!sigRes.ok) throw new Error('Signature failed');
    const { signature } = await sigRes.json();

    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    if (!apiKey) throw new Error('Cloudinary API key missing');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'testimonials');

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) throw new Error('Upload failed');
    const data = await uploadRes.json();
    return data.secure_url;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters';
    if (message.trim().length > 300) newErrors.message = 'Message must be less than 300 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let avatar_url = null;
      if (photoFile) {
        setIsUploadingPhoto(true);
        avatar_url = await uploadPhotoToCloudinary(photoFile);
        setIsUploadingPhoto(false);
      }

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          rating,
          message,
          avatar_url
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrors({ form: err.message || 'An error occurred during submission.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="form-section" id="testimonial-form-section">
        <div className="form-container">
          <div className="success-state">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="success-title">Thank You!</h3>
            <p className="success-msg">
              Your feedback has been submitted and is pending review. We appreciate you taking the time!
            </p>
            <a href="/" className="back-home-btn">Back to Home</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="form-section bg-[#]" id="testimonial-form-section">
      <div className="form-container">

        <div className="form-header">
          <h2 className="form-title">Share Your Experience</h2>
          <p className="form-subtitle">Your feedback helps other farmers trust us</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* LOCATION */}
            <div className="form-group">
              <label className="form-label">Your City & State <span className="optional">(optional)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Surat, Gujarat"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* RATING */}
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="rating-stars" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`form-star ${(hoverRating || rating) >= star ? 'selected' : ''}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div className="rating-text">
                {(hoverRating > 0 || rating > 0) ? getRatingText(hoverRating || rating) : <span className="empty-spacer">&nbsp;</span>}
              </div>
              {errors.rating && <span className="error-text">{errors.rating}</span>}
            </div>

            {/* PHOTO */}
            <div className="form-group">
              <label className="form-label">Your Photo <span className="optional">(optional)</span></label>
              <p className="form-helper">A friendly face builds more trust</p>

              <div className="photo-upload-area" onClick={() => !photoPreview && fileInputRef.current?.click()}>
                {photoPreview ? (
                  <div className="photo-preview-wrapper" onClick={(e) => e.stopPropagation()}>
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                    <button type="button" className="remove-photo" onClick={removePhoto}>×</button>
                  </div>
                ) : (
                  <>
                    <svg className="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span className="upload-text">Click to upload photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="hidden-file-input"
                />
              </div>
              {uploadError && <span className="error-text">{uploadError}</span>}
            </div>

            {/* MESSAGE */}
            <div className="form-group">
              <label className="form-label">Your Feedback</label>
              <textarea
                className="form-textarea"
                placeholder="Tell others about your experience with our products and service..."
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 300))}
              ></textarea>
              <div className="char-count">
                {message.length} / 300
              </div>
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            {errors.form && <div className="error-text global-error">{errors.form}</div>}

            <button type="submit" className="submit-btn" disabled={isSubmitting || isUploadingPhoto}>
              {isSubmitting || isUploadingPhoto ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : "Submit Feedback"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
