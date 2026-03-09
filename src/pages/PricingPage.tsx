import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from '@/data/mockData';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-3">Subscription Plans</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Choose A Premium Membership That Fits Your Event's Scale And Frequency. All Plans Include Unlimited Usage.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className={`bg-white rounded-2xl p-8 border-2 relative transition-all duration-300 flex flex-col ${plan.recommended ? 'border-primary shadow-xl scale-105 z-10' : 'border-border shadow-sm'
                }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-[10px] uppercase tracking-wider font-bold text-white whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <h3 className="font-heading font-bold text-2xl text-black mb-1">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Subscription Card</p>

              <div className="mb-8">
                <span className="text-5xl font-heading font-bold text-gray-400">{plan.price}</span>
                <span className="text-black/60 text-sm ml-1 font-medium">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-black font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.recommended ? 'default' : 'outline'}
                className={`w-full h-12 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-primary hover:bg-primary/90 text-white shadow-lg' : 'border-black text-black hover:bg-black hover:text-white'}`}
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
