import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Play, Heart, Share2, Calendar, Globe, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockArtists } from '@/data/mockData';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const artist = mockArtists.find(a => a.id === id) || mockArtists[0];
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'videos' | 'reviews'>('about');
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
      </div>

      <div className="container-wide">
        <div className="relative -mt-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8 card-elevated"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-background -mt-20 md:-mt-16"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="font-heading font-bold text-2xl text-card-foreground">{artist.name}</h1>
                      {artist.verified && <BadgeCheck className="text-primary" size={20} />}
                    </div>
                    <p className="text-primary font-medium">{artist.category}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {artist.city}</span>
                      <span className="flex items-center gap-1"><Star size={14} className="text-accent fill-accent" /> {artist.rating} ({artist.reviews} reviews)</span>
                      <span>{artist.events} events done</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Heart size={16} className="mr-1" /> Shortlist</Button>
                    <Button variant="outline" size="sm"><Share2 size={16} /></Button>
                    <Button size="sm" onClick={() => setShowContact(true)}>Unlock Contact</Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {artist.genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">{g}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-8 border-b border-border">
              {(['about', 'photos', 'videos', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 gradient-bg rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === 'about' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">About</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{artist.bio}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-foreground">{artist.events}</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-foreground">{artist.reviews}</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-foreground">{artist.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-2xl font-heading font-bold text-primary">{artist.priceRange.split(' - ')[0]}</div>
                      <div className="text-xs text-muted-foreground">Starting Price</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">Social Links</h3>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm"><Instagram size={16} className="mr-1" /> Instagram</Button>
                      <Button variant="outline" size="sm"><Youtube size={16} className="mr-1" /> YouTube</Button>
                      <Button variant="outline" size="sm"><Globe size={16} className="mr-1" /> Website</Button>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'photos' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-square rounded-xl bg-secondary overflow-hidden">
                      <img src={artist.image} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </motion.div>
              )}
              {activeTab === 'videos' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video rounded-xl bg-secondary flex items-center justify-center cursor-pointer group">
                      <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-primary-foreground ml-1" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {[
                    { name: 'Ravi K.', text: 'Amazing performance! Totally blew us away.', rating: 5, date: 'Jan 2026' },
                    { name: 'Priya S.', text: 'Very professional and talented. Highly recommended.', rating: 5, date: 'Dec 2025' },
                    { name: 'Amit T.', text: 'Great energy, perfect for our corporate event.', rating: 4, date: 'Nov 2025' },
                  ].map((r, i) => (
                    <div key={i} className="bg-secondary rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">{r.name[0]}</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} size={12} className="fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
          onClick={() => setShowContact(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-heading font-bold text-xl text-card-foreground mb-2">Contact Unlocked!</h3>
            <p className="text-muted-foreground text-sm mb-6">You can now reach {artist.name} directly.</p>
            <Button className="w-full rounded-xl mb-3" size="lg">
              Chat on WhatsApp
            </Button>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setShowContact(false)}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
