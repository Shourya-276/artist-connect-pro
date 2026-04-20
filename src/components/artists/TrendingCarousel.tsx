import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import ArtistCard from './ArtistCard';

interface TrendingCarouselProps {
  title: string;
  artists: any[];
}

export default function TrendingCarousel({ title, artists }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (!artists || artists.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary" size={24} />
          <h3 className="font-heading font-bold text-xl text-foreground">{title}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors text-foreground shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors text-foreground shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {artists.map((artist, i) => (
          <div key={artist.id || i} className="min-w-[280px] max-w-[280px]">
            <ArtistCard artist={artist} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
