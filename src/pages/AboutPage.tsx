import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-6">About ArtistHub</h1>
          <p className="text-muted-foreground leading-relaxed mb-6">
            ArtistHub is India's premier artist booking marketplace, connecting talented performers with event planners across 150+ cities. From intimate house parties to grand corporate galas, we make finding and booking the perfect artist effortless.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Our platform hosts over 10,000 verified artists across categories including singers, DJs, bands, dancers, comedians, anchors, and more. Each artist is vetted for quality and professionalism.
          </p>
          <div className="gradient-bg rounded-2xl p-8 text-center">
            <h2 className="font-heading font-bold text-2xl text-primary-foreground mb-2">Our Mission</h2>
            <p className="text-primary-foreground/80">To democratize live entertainment by connecting every event with the perfect artist.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
