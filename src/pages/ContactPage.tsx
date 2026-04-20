import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours."
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-3">Get in Touch</h1>
          <p className="text-muted-foreground">We'd love to hear from you</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@artisthub.in' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <input required className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Your name" />
            <input required type="email" className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Your email" />
            <textarea required className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm resize-none" rows={5} placeholder="Your message" />
            <Button
              className="w-full rounded-xl gap-2 font-bold"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
