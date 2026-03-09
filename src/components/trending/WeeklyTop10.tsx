import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Star, MapPin } from 'lucide-react';
import { Artist, mockArtists } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface WeeklyTop10Props {
    city?: string;
    category?: string;
    title?: string;
}

export default function WeeklyTop10({ city, category, title }: WeeklyTop10Props) {
    // Mock logic to get top 10 based on score (views, bookings, reviews etc)
    const getTrendingArtists = () => {
        let filtered = [...mockArtists];
        if (city) filtered = filtered.filter(a => a.city.toLowerCase() === city.toLowerCase());
        if (category) filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());

        return filtered
            .map(artist => ({
                ...artist,
                score: artist.views * 1 + artist.bookings * 10 + artist.rating * 100
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    };

    const trending = getTrendingArtists();

    if (trending.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={28} />
                        {title || 'Weekly Top 10'}
                    </h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                        <TrendingUp size={14} className="text-primary" />
                        Trending Based On Bookings And Views This Week
                    </p>
                </div>
                <div className="hidden sm:block">
                    <Link to="/search">
                        <Button variant="outline" size="sm" className="rounded-full">View All Artists</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trending.map((artist, index) => (
                    <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all card-elevated"
                    >
                        {/* Rank Badge */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index < 3 ? 'gradient-bg text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'
                            }`}>
                            {index + 1}
                        </div>

                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-heading font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                    {artist.name}
                                </h3>
                                {artist.verified && (
                                    <div className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{artist.category} • {artist.priceRange}</p>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> {artist.rating}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase">
                                    <MapPin size={12} /> {artist.city}
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        <Link to={`/artist/${artist.id}`} className="absolute inset-0 z-10" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
