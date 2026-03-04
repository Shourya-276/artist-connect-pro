import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Users, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, mockArtists, stats, testimonials } from '@/data/mockData';
import ArtistCard from '@/components/artists/ArtistCard';
import TrendingCarousel from '@/components/artists/TrendingCarousel';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import heroBg from '@/assets/hero-bg.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Concert" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
        </div>
        <div className="relative z-10 container-wide text-center py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.p variants={itemVariants} className="text-white font-semibold text-sm tracking-widest uppercase mb-4">
              India's #1 Artist Booking Platform
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-6"
            >
              Book incredible live artists for your events
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Discover singers, DJs, bands, comedians and more. From intimate parties to grand celebrations.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search artists, categories, cities..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background text-foreground placeholder:text-muted-foreground border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <Link to="/search">
                <Button size="lg" className="h-12 px-8 rounded-xl w-full sm:w-auto">
                  Explore <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Find the perfect artist for any occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Link
                  to={`/search?category=${cat.id}`}
                  className="block bg-card border border-border rounded-xl p-6 text-center card-elevated"
                >
                  <span className="text-4xl mb-3 block">{cat.icon}</span>
                  <h3 className="font-heading font-semibold text-card-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.count.toLocaleString()} artists</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artists */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
              Trending Artists
            </h2>
            <p className="text-muted-foreground">Most booked artists this week</p>
          </motion.div>

          <div className="mb-16">
            <WeeklyTop10 title="🏆 This Week's Top 10" />
          </div>

          <TrendingCarousel title="🔥 More Trending" artists={mockArtists} />
          <TrendingCarousel title="📍 Top in Mumbai" artists={mockArtists.filter(a => a.city === 'Mumbai').concat(mockArtists.slice(0, 3))} />
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
              How It Works
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Search, title: 'Search & Filter', desc: 'Browse thousands of artists by category, city, budget, and more.' },
              { icon: Users, title: 'Compare & Shortlist', desc: 'View profiles, watch videos, read reviews and shortlist favorites.' },
              { icon: Music, title: 'Book & Celebrate', desc: 'Connect with artists, finalize details, and enjoy your event!' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <step.icon size={28} className="text-primary-foreground" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-3">
              What Our Clients Say
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border card-elevated"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 text-sm leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-2xl p-10 sm:p-16 text-center"
          >
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground mb-4">
              Ready to Make Your Event Unforgettable?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of event planners who trust Live101.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="rounded-xl px-8">
                  Browse Artists
                </Button>
              </Link>
              <Link to="/artist/signup">
                <Button size="lg" variant="outline" className="rounded-xl px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Join as Artist
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
