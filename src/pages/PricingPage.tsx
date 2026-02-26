import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from '@/data/mockData';

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-3">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Choose the plan that fits your needs. Start with a 7-day free trial.</p>
        </motion.div>

        {/* Trial Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-bg rounded-2xl p-6 text-center mb-12 max-w-2xl mx-auto">
          <h3 className="font-heading font-bold text-xl text-primary-foreground mb-1">🎉 Start Your 7-Day Free Trial</h3>
          <p className="text-primary-foreground/80 text-sm">No credit card required. Full access to all features.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className={`bg-card rounded-2xl p-8 border-2 relative ${
                plan.recommended ? 'border-primary card-elevated' : 'border-border'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-xs font-semibold text-primary-foreground">
                  Recommended
                </div>
              )}
              <h3 className="font-heading font-bold text-xl text-card-foreground">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-heading font-bold text-card-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Check size={16} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.recommended ? 'default' : 'outline'}
                className="w-full rounded-xl"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
