import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Play, Heart, Share2, Globe, Instagram, Youtube, Calendar, MessageSquare, Verified, Image as ImageIcon, Banknote, Video, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useShortlist } from '@/hooks/use-shortlist';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'videos' | 'reviews'>('about');
  const [showContact, setShowContact] = useState(false);

  // Fetch Artist Data
  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => apiFetch(`/api/artists/${id}`),
    enabled: !!id,
  });

  const { isShortlisted, toggleShortlist } = useShortlist(id || '', artist?.name || '');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>;
  }

  if (error || !artist) {
    return <div className="min-h-screen flex items-center justify-center pt-20 bg-background text-2xl font-black uppercase tracking-widest opacity-20">Artist Not Found</div>;
  }

  const photos = artist.media?.filter((m: any) => m.type === 'IMAGE') || [];
  const videos = artist.media?.filter((m: any) => m.type === 'VIDEO') || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cinematic Hero Header */}
      <div className="relative h-[45vh] lg:h-[55vh] w-full group overflow-hidden bg-secondary">
        {artist.coverImage ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={artist.coverImage} 
            className="w-full h-full object-cover" 
            alt="" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
             <div className="text-primary/10 select-none font-black text-[15vw] uppercase tracking-tighter line-clamp-1">{artist.name}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-10 left-0 right-0 z-20">
            <div className="container-wide flex flex-col md:flex-row items-end gap-6">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] border-8 border-background overflow-hidden shadow-2xl bg-secondary shrink-0 relative group"
                >
                    <img src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random`} className="w-full h-full object-cover" alt={artist.name} />
                </motion.div>
                
                <div className="flex-1 pb-2">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="font-heading font-black text-4xl lg:text-6xl text-foreground tracking-tighter drop-shadow-md">
                                {artist.name}
                            </h1>
                            {artist.verifiedStatus === 'VERIFIED' && <Verified className="text-primary" size={32} />}
                        </div>
                        <div className="flex items-center gap-6 text-sm lg:text-md font-bold uppercase tracking-widest text-muted-foreground/80">
                            <span className="flex items-center gap-1.5 text-primary"><MapPin size={18} /> {artist.city?.name || 'Anywhere'}</span>
                            <span className="flex items-center gap-1.5"><BadgeCheck size={18} /> {artist.category?.name}</span>
                            <span className="flex items-center gap-1.5"><Star size={18} className="text-yellow-500 fill-yellow-500" /> {artist.rating} ({artist.totalReviews} Reviews)</span>
                        </div>
                    </motion.div>
                </div>

                <div className="flex gap-3 mb-2 relative z-30">
                    <Button 
                        onClick={toggleShortlist}
                        variant={isShortlisted ? "secondary" : "outline"} 
                        className={`rounded-2xl h-14 w-14 lg:w-auto px-0 lg:px-6 shadow-xl ${isShortlisted ? 'bg-primary text-primary-foreground border-none' : 'backdrop-blur-md bg-card/50 ring-1 ring-white/10'}`}
                    >
                        <Heart size={20} className={isShortlisted ? 'fill-current' : ''} />
                        <span className="hidden lg:inline ml-2 font-bold uppercase tracking-widest text-xs">{isShortlisted ? 'Saved' : 'Shortlist'}</span>
                    </Button>
                    <Button 
                        onClick={() => setShowContact(true)}
                        className="rounded-2xl h-14 px-8 lg:px-10 text-md font-black uppercase tracking-widest shadow-2xl shadow-primary/30 gradient-bg"
                    >
                        Inquire Now
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <div className="container-wide mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Content Tabs */}
        <div className="lg:col-span-8 space-y-10">
            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-border mb-8 overflow-x-auto no-scrollbar">
                {(['about', 'photos', 'videos', 'reviews'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground opacity-50'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'about' && (
                    <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans">Biography</h3>
                            <p className="text-xl leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                                {artist.bio || "No biography provided yet."}
                            </p>
                        </section>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                { label: 'City', value: artist.city?.name, icon: MapPin },
                                { label: 'Languages', value: Array.isArray(artist.languages) ? artist.languages.join(', ') : (artist.languages || 'English, Hindi'), icon: Globe },
                                { label: 'Price Range', value: artist.priceRange, icon: Banknote },
                                { label: 'Travels', value: artist.travelNationwide ? 'Nationwide' : 'City Only', icon: Plane },
                                { label: 'Reviews', value: `${artist.totalReviews}+`, icon: Star },
                            ].map((detail, idx) => (
                                <div key={idx} className="p-5 rounded-3xl bg-secondary/50 border border-border/50 flex flex-col justify-center">
                                    <detail.icon className="text-primary mb-2 opacity-50" size={18} />
                                    <p className="text-sm font-black text-foreground truncate">{detail.value || 'N/A'}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{detail.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Chart */}
                        {artist.budgetChart && Array.isArray(artist.budgetChart) && artist.budgetChart.length > 0 && (
                            <div className="mt-12 bg-card rounded-3xl border border-border p-8 shadow-xl">
                                <h3 className="font-heading font-black text-2xl text-foreground mb-6 flex items-center gap-3">
                                    <Banknote className="text-primary" /> Performance Packages
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {artist.budgetChart.map((item: any, i: number) => (
                                        <div key={i} className="p-5 rounded-2xl bg-secondary/50 border border-border flex flex-col justify-between hover:border-primary/30 transition-colors group">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{item.budgetRange} Range</p>
                                                <h4 className="font-bold text-lg text-foreground mb-2">{item.eventType || 'Event Performance'}</h4>
                                            </div>
                                            <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                                                 <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Starting At</span>
                                                 <span className="text-xl font-black text-foreground">₹{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Media Gallery */}
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
                                    <h3 className="font-heading font-black text-2xl text-foreground mb-6 flex items-center gap-3">
                                        <ImageIcon className="text-primary" /> Image Gallery
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {(artist.media || []).filter((m: any) => m.type === 'IMAGE').map((img: any, i: number) => (
                                            <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
                                                <img src={img.url} className="w-full h-full object-cover" alt="Portfolio" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
                                    <h3 className="font-heading font-black text-2xl text-foreground mb-6 flex items-center gap-3">
                                        <Video className="text-primary" /> Video Performances
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(artist.media || []).filter((m: any) => m.type === 'VIDEO').map((vid: any, i: number) => (
                                            <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-lg">
                                                <video src={vid.url} className="w-full h-full object-contain" controls />
                                            </div>
                                        ))}
                                        {(artist.media || []).filter((m: any) => m.type === 'VIDEO').length === 0 && (
                                            <p className="col-span-full text-center py-12 text-muted-foreground font-medium italic">No performance videos uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Genres */}
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 font-sans">Genres & Styles</h3>
                            <div className="flex flex-wrap gap-2">
                                {artist.genres?.map((g: any) => (
                                    <span key={g.id} className="px-5 py-2.5 rounded-full bg-secondary border border-border text-xs font-black uppercase tracking-widest">{g.name}</span>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === 'photos' && (
                    <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.length > 0 ? photos.map((m: any) => (
                            <div key={m.id} className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary border border-border group">
                                <img src={m.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center opacity-30">
                                <ImageIcon className="mx-auto mb-4" size={48} />
                                <p className="font-black uppercase tracking-widest">No Photos Gallery</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'videos' && (
                    <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videos.length > 0 ? videos.map((m: any) => (
                            <div key={m.id} className="aspect-video rounded-[2.5rem] bg-secondary border border-border flex items-center justify-center group relative overflow-hidden shadow-xl">
                                <video src={m.url} controls preload="metadata" playsInline className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 bg-black" />
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center opacity-30">
                                <Play className="mx-auto mb-4" size={48} />
                                <p className="font-black uppercase tracking-widest">No Video Samples</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border">
                            <div className="text-7xl font-black text-foreground drop-shadow-sm">{artist.rating}</div>
                            <div>
                                <div className="flex gap-1 mb-2">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={20} className={s <= Math.round(artist.rating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />)}
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic">Based on {artist.totalReviews} Verified Client Reviews</p>
                            </div>
                        </div>

                        {artist.reviews?.length > 0 ? artist.reviews.map((r: any) => (
                            <div key={r.id} className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">{r.client?.name[0]}</div>
                                        <div>
                                            <p className="font-black text-lg text-foreground tracking-tight">{r.client?.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-foreground/80 font-medium italic">"{r.comment}"</p>
                            </div>
                        )) : (
                            <div className="py-20 text-center opacity-30">
                                <MessageSquare className="mx-auto mb-4" size={48} />
                                <p className="font-black uppercase tracking-widest">Be the first to review</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Right: Interaction Card */}
        <div className="lg:col-span-4 h-fit">
            <div className="sticky top-28 space-y-6">
                <div className="bg-card border-4 border-primary rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Star size={120} /></div>
                    <h3 className="font-heading font-black text-2xl mb-2">Book This Artist</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-6 border-b border-border pb-6">Instant Availability Check</p>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-muted-foreground">Starting Budget</span>
                            <span className="text-foreground">{artist.priceRange}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-muted-foreground">Booking Deposit</span>
                            <span className="text-foreground">25% Required</span>
                        </div>
                    </div>

                    <Button onClick={() => setShowContact(true)} className="w-full h-16 rounded-[1.5rem] text-lg font-black tracking-wide uppercase gradient-bg shadow-xl shadow-primary/30">
                        Check Availability
                    </Button>
                </div>

                <div className="bg-secondary/50 border border-border/50 rounded-[2.5rem] p-8">
                    <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-6">Contact Channels</h4>
                    <div className="space-y-3">
                        {artist.instagram && <Button variant="outline" className="w-full rounded-2xl h-12 justify-start gap-3 border-border bg-card font-bold text-xs" onClick={() => window.open(artist.instagram)}><Instagram size={16} className="text-pink-500" /> INSTAGRAM</Button>}
                        {artist.youtube && <Button variant="outline" className="w-full rounded-2xl h-12 justify-start gap-3 border-border bg-card font-bold text-xs" onClick={() => window.open(artist.youtube)}><Youtube size={16} className="text-red-500" /> YOUTUBE</Button>}
                        {artist.website && <Button variant="outline" className="w-full rounded-2xl h-12 justify-start gap-3 border-border bg-card font-bold text-xs" onClick={() => window.open(artist.website)}><Globe size={16} className="text-blue-500" /> OFFICIAL WEBSITE</Button>}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Modern Contact Modal */}
      <AnimatePresence>
        {showContact && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-card border border-border rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none"><Verified size={200} /></div>
                    
                    <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
                        <MessageSquare className="text-primary-foreground" size={32} />
                    </div>
                    
                    <h3 className="font-heading font-black text-3xl text-foreground mb-3 font-sans tracking-tight">Direct Connection Unlocked</h3>
                    <p className="text-muted-foreground text-md font-medium mb-8 leading-relaxed">
                        You can now reach out to <span className="text-primary font-bold">{artist.name}</span> directly for personalized quotes and requirements.
                    </p>
                    
                    <div className="p-6 rounded-3xl bg-secondary border border-border mb-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-40">Verified WhatsApp</p>
                        <p className="text-2xl font-black text-foreground font-mono tracking-tighter cursor-copy group">
                            {artist.user?.phone || '+91 99XXXXXX00'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button className="h-14 rounded-2xl font-black uppercase tracking-widest text-sm gradient-bg" onClick={() => window.open(`https://wa.me/${artist.user?.phone || '910000000000'}`)}>
                            Open WhatsApp Chat
                        </Button>
                        <Button variant="ghost" className="h-12 rounded-2xl font-bold text-muted-foreground" onClick={() => setShowContact(false)}>
                            Keep Exploring
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
