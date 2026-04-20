import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtistCard from '@/components/artists/ArtistCard';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '', genre: '', city: '', eventType: '', language: '',
    budgetMin: '', budgetMax: '', travel: false,
  });

  // Fetch Metadata (Categories, Cities, Genres)
  const { data: metadata } = useQuery({
    queryKey: ['metadata'],
    queryFn: () => apiFetch('/api/metadata'),
  });

  // Fetch Artists based on query and filters
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['artists', query, filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.genre) params.append('genre', filters.genre);
      return apiFetch(`/api/artists?${params.toString()}`);
    },
  });

  const clearFilters = () => setFilters({ category: '', genre: '', city: '', eventType: '', language: '', budgetMin: '', budgetMax: '', travel: false });

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Find Artists</h1>
          <p className="text-muted-foreground">{artists.length} artists available</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artists, categories..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
          <Button
            variant="default"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border border-border rounded-xl p-6 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 rounded-lg bg-secondary text-foreground border border-border px-3 text-sm"
                  >
                    <option value="">All Categories</option>
                    {metadata?.categories?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                    className="w-full h-10 rounded-lg bg-secondary text-foreground border border-border px-3 text-sm"
                  >
                    <option value="">All Cities</option>
                    {metadata?.cities?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters(f => ({ ...f, genre: e.target.value }))}
                    className="w-full h-10 rounded-lg bg-secondary text-foreground border border-border px-3 text-sm"
                  >
                    <option value="">All Genres</option>
                    {metadata?.genres?.map((g: any) => <option key={g.id} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Event Type</label>
                  <select
                    value={filters.eventType}
                    onChange={(e) => setFilters(f => ({ ...f, eventType: e.target.value }))}
                    className="w-full h-10 rounded-lg bg-secondary text-foreground border border-border px-3 text-sm"
                  >
                    <option value="">All Events</option>
                    {metadata?.eventTypes?.map((e: any) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.travel}
                    onChange={(e) => setFilters(f => ({ ...f, travel: e.target.checked }))}
                    className="rounded"
                  />
                  Travel Nationwide
                </label>
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist: any, i: number) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>

        {!isLoading && artists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No artists found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
