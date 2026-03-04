import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Heart, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Artist } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export default function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    const shortlisted = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
    setIsShortlisted(shortlisted.includes(artist.id));
  }, [artist.id]);

  const toggleShortlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const shortlisted = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
    let newShortlisted;

    if (isShortlisted) {
      newShortlisted = shortlisted.filter((id: string) => id !== artist.id);
      toast.info(`Removed ${artist.name} from shortlist`);
    } else {
      newShortlisted = [...shortlisted, artist.id];
      toast.success(`Added ${artist.name} to shortlist`);
    }

    localStorage.setItem('shortlistedArtists', JSON.stringify(newShortlisted));
    setIsShortlisted(!isShortlisted);

    // Trigger storage event for other components to update if needed
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-xl overflow-hidden card-elevated border border-border"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

        <button
          onClick={toggleShortlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isShortlisted ? 'bg-primary text-primary-foreground' : 'glass hover:bg-primary hover:text-primary-foreground'
            }`}
        >
          <Heart size={16} fill={isShortlisted ? "currentColor" : "none"} />
        </button>

        {artist.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium gradient-bg text-primary-foreground">
            <BadgeCheck size={12} />
            Verified
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1 text-primary-foreground">
            <Star size={14} className="fill-accent text-accent" />
            <span className="text-sm font-semibold">{artist.rating}</span>
            <span className="text-xs text-primary-foreground/70">({artist.reviews})</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-heading font-semibold text-card-foreground">{artist.name}</h3>
        </div>
        <p className="text-sm text-primary font-medium mb-2">{artist.category}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin size={14} />
          {artist.city}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-card-foreground">{artist.priceRange}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link to={`/artist/${artist.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">View Profile</Button>
          </Link>
          <Button
            variant={isShortlisted ? "secondary" : "default"}
            size="sm"
            className="flex-1 text-xs"
            onClick={toggleShortlist}
          >
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
