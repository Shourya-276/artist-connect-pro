import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Users, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, mockArtists, testimonials } from '@/data/mockData';
import ArtistCard from '@/components/artists/ArtistCard';
import TrendingCarousel from '@/components/artists/TrendingCarousel';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import Hero from '@/components/layout/Hero';
import { Testimonials } from '@/components/layout/Testimonials';

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />

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
              Browse By Category
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Find The Perfect Artist For Any Occasion
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
                  <p className="text-sm text-muted-foreground mt-1">{cat.count.toLocaleString()} Artists</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artists */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <TrendingCarousel title="📈 Trending This Week" artists={mockArtists} />
          <TrendingCarousel title="💰 Top Sellers" artists={[...mockArtists].sort((a, b) => b.bookings - a.bookings)} />
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
              { icon: Search, title: 'Search & Filter', desc: 'Browse Thousands Of Artists By Category, City, Budget, And More.' },
              { icon: Users, title: 'Compare & Shortlist', desc: 'View Profiles, Watch Videos, Read Reviews And Shortlist Favorites.' },
              { icon: Music, title: 'Book & Celebrate', desc: 'Connect With Artists, Finalize Details, And Enjoy Your Event!' },
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

      <Testimonials testimonials={testimonials} />

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
              Ready To Make Your Event Unforgettable?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join Thousands Of Event Planners Who Trust Live101.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" variant="default" className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  Browse Artists
                </Button>
              </Link>
              <Link to="/artist/signup">
                <Button size="lg" variant="outline" className="rounded-xl px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Join As Artist
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
