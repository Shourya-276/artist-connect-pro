import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-6">Terms of Service</h1>
          <div className="prose prose-sm text-muted-foreground space-y-6 max-w-none">
            <p>Welcome to Live101. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. No Refund Policy</h2>
              <p>All subscription payments, including Silver, Gold, and Platinum plans, are final. Live101 maintains a strict <strong>No Refund Policy</strong>. Once a subscription is activated, no portion of the payment shall be refundable under any circumstances, including but not limited to cancellation of usage or dissatisfaction with the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Usage of Event Footages</h2>
              <p>By using the Live101 platform and booking artists for your events, you grant Live101 a non-exclusive, worldwide, royalty-free license to use, reproduce, and display media captured during the event.</p>
              <p className="mt-2 text-xs italic">"This includes but is not limited to: photography, video highlights, and audio recordings for the purpose of marketing, platform promotion, and demonstrating artist performance quality to future clients."</p>
              <p className="mt-2">We ensure that such footage is used professionally to highlight the success of the event and the talent of the artists involved.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Data & Updates</h2>
              <p>Artist data and availability are updated on a quarterly basis to ensure accuracy. Users agree that while we strive for 100% accuracy, the platform is provided on an "as-is" basis.</p>
            </section>

            <div className="mt-12 p-6 bg-secondary/50 rounded-2xl border border-border">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree-terms"
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="agree-terms" className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I have read and agree to the Terms of Service and the Privacy Policy.
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
