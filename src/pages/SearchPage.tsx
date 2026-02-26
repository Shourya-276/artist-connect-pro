import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockArtists, categories, genres, eventTypes, cities, languages, Artist } from '@/data/mockData';
import ArtistCard from '@/components/artists/ArtistCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '', genre: '', city: '', eventType: '', language: '',
    budgetMin: '', budgetMax: '', travel: false,
  });

  const artists = useMemo(() => {
    let result = [...mockArtists, ...mockArtists.map(a => ({ ...a, id: a.id + '-dup' }))]; // Duplicate for demo
    if (query) result = result.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));
    if (filters.category) result = result.filter(a => a.category.toLowerCase() === filters.category.toLowerCase());
    if (filters.city) result = result.filter(a => a.city === filters.city);
    if (filters.genre) result = result.filter(a => a.genres.includes(filters.genre));
    if (filters.travel) result = result.filter(a => a.travelNationwide);
    return result;
  }, [query, filters]);

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
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 rounded-xl"
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
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
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
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
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
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
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
                    {eventTypes.map(e => <option key={e} value={e}>{e}</option>)}
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No artists found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
