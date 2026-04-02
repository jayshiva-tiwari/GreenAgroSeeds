'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await res.json();
        alert('Failed to send message: ' + (errorData.error || 'Server Error'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Network error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmCream py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl text-left mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-earthGreen mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our products, bulk orders, or farming practices? We're here to help. Reach out to us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border overflow-hidden">
          {/* Contact Info */}
          <div className="bg-earthGreen text-warmCream p-10 lg:p-12 relative overflow-hidden">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-lightGreen rounded-full opacity-20 blur-3xl" />
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Our Location</h4>
                  <p className="opacity-80">Bansari Township<br />Mehsana, Gujarat<br />India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <p className="opacity-80">+91 98765 43210</p>
                  <p className="opacity-80 text-sm mt-1">Mon-Sat, 9AM to 6PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Email Queries</h4>
                  <p className="opacity-80">contact@greenseedsagro.in</p>
                  <p className="opacity-80 mt-1">sales@greenseedsagro.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Farm Visits</h4>
                  <p className="opacity-80">We offer guided farm tours on weekends. Pre-booking required.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-10 lg:p-12 relative">
            <h3 className="text-2xl font-bold text-earthGreen mb-6">Send us a Message</h3>
            {success ? (
              <div className="bg-lightGreen/10 text-earthGreen p-6 rounded-xl border border-lightGreen/20 text-center">
                <div className="w-12 h-12 bg-lightGreen rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Send className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSuccess(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="John Doe" className="h-12 border-earthGreen/20 focus-visible:ring-earthGreen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (WhatsApp preferred)</Label>
                  <Input id="phone" name="phone" type="tel" required placeholder="+91 99999 99999" className="h-12 border-earthGreen/20 focus-visible:ring-earthGreen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" name="message" required placeholder="Tell us what you're looking for..." className="min-h-[120px] resize-none border-earthGreen/20 focus-visible:ring-earthGreen" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-lightGreen hover:bg-earthGreen text-white text-lg rounded-xl flex items-center gap-2">
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  {!loading && <Send className="w-4 h-4" />}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Map Embed */}
        <div className="mt-16 bg-white p-4 rounded-3xl shadow-sm border">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Bansari%20Township,%20Mehsana&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Green Seeds Agro Location - Bansari Township, Mehsana"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
