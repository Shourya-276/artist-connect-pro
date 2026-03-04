import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-6">Terms of Service</h1>
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p>Welcome to Live101. By using our platform, you agree to these terms of service.</p>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Our Service</h2>
            <p>Live101 provides a marketplace connecting artists with event planners. We facilitate connections but are not party to agreements between artists and clients.</p>
            <h3 className="font-heading font-semibold text-foreground">2. User Accounts</h3>
            <p>Users must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account.</p>
            <h3 className="font-heading font-semibold text-foreground">3. Artist Listings</h3>
            <p>Artists are responsible for the accuracy of their profiles, pricing, and availability information.</p>
            <h3 className="font-heading font-semibold text-foreground">4. Payments</h3>
            <p>Subscription payments are processed securely. Refund policies apply as per our refund policy.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
