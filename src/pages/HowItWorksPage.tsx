import { motion } from 'framer-motion';
import { Search, Users, Music } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Search & Discover', desc: 'Browse through thousands of verified artists across 150+ cities. Filter by category, genre, budget, and more to find exactly what you need.' },
  { icon: Users, title: 'Compare & Shortlist', desc: 'View detailed profiles with videos, photos, reviews, and pricing. Shortlist your favorites and compare them side by side.' },
  { icon: Music, title: 'Connect & Book', desc: 'Unlock artist contact details, discuss your event requirements, finalize the booking, and enjoy an amazing performance!' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-3">How It Works</h1>
          <p className="text-muted-foreground">Book your perfect artist in 3 simple steps</p>
        </motion.div>
        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start"
            >
              <div className="shrink-0 w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
                <step.icon size={24} className="text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
