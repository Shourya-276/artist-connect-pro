import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-6">Privacy Policy</h1>
          <div className="prose prose-sm text-muted-foreground space-y-4">
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
            <h3 className="font-heading font-semibold text-foreground">Information We Collect</h3>
            <p>We collect information you provide during registration, profile creation, and platform usage including name, email, phone, and event preferences.</p>
            <h3 className="font-heading font-semibold text-foreground">How We Use Information</h3>
            <p>Your information is used to provide platform services, match artists with clients, and improve user experience.</p>
            <h3 className="font-heading font-semibold text-foreground">Data Protection</h3>
            <p>We implement industry-standard security measures to protect your personal information.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
