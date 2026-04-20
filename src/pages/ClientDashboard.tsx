import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Heart, MessageSquare, Settings, LogOut, Bell, Search, Star, CheckCircle2, Clock, MapPin, ChevronRight, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import ArtistCard from '@/components/artists/ArtistCard';
import ReviewModal from '@/components/dashboard/ReviewModal';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedReviewBooking, setSelectedReviewBooking] = useState<any>(null);

    // Fetch Client Data
    const { data: profile, isLoading, error, refetch } = useQuery({
        queryKey: ['client-dashboard'],
        queryFn: () => apiFetch('/api/clients/me'),
        retry: 1,
    });

    // Fetch Shortlisted Artists
    const { data: shortlisted = [] } = useQuery({
        queryKey: ['shortlisted-artists'],
        queryFn: async () => {
            const ids = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
            if (ids.length === 0) return [];
            const allArtists = await apiFetch('/api/artists');
            return allArtists.filter((a: any) => ids.includes(a.id));
        },
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">Initializing Portal...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Session Disturbed</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">We couldn't verify your credentials. This usually happens if your session has expired.</p>
            <div className="flex gap-4">
                <Button onClick={() => refetch()} variant="outline" className="rounded-2xl h-12 px-8 gap-2 border-2 uppercase text-[10px] font-black tracking-widest">
                    <RefreshCcw size={16} /> Retry
                </Button>
                <Button onClick={handleLogout} className="rounded-2xl h-12 px-8 uppercase text-[10px] font-black tracking-widest gradient-bg border-none">
                    Log In Again
                </Button>
            </div>
        </div>
    );

    if (!profile) return null;

    const initials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U';

    return (
        <div className="min-h-screen pt-16 bg-[#F8F9FB] flex flex-col lg:flex-row overflow-hidden h-screen">
            <AnimatePresence>
                {selectedReviewBooking && (
                    <ReviewModal 
                        booking={selectedReviewBooking} 
                        onClose={() => setSelectedReviewBooking(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Premium Sidebar */}
            <aside className="w-full lg:w-72 bg-white border-r border-border/50 flex flex-col z-20 shadow-sm relative overflow-y-auto lg:overflow-visible no-scrollbar">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-4 mb-2 p-4 rounded-3xl bg-secondary/30 border border-border/20">
                        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground font-black text-xl shadow-xl shadow-primary/20 shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-foreground text-sm truncate leading-tight">{profile.name}</p>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.15em] mt-0.5">Explorer</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 py-4">
                    {[
                        { icon: LayoutDashboard, label: 'Overview' },
                        { icon: Heart, label: 'Shortlisted' },
                        { icon: Calendar, label: 'My Bookings' },
                        { icon: MessageSquare, label: 'Messages' },
                        { icon: Bell, label: 'Notifications' },
                        { icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-black transition-all group ${activeTab === item.label
                                ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 active-scale'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={activeTab === item.label ? '' : 'group-hover:scale-110 transition-transform'} />
                                <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
                            </div>
                            {activeTab === item.label && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-border/50">
                    <button
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F8F9FB] relative">
                <div className="p-6 lg:p-12 max-w-7xl mx-auto">
                    {/* Top Strategy Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="font-heading font-black text-4xl lg:text-5xl text-foreground tracking-tighter mb-2">
                                {activeTab}
                            </h2>
                            <p className="text-muted-foreground font-medium text-lg">Manage your bookings and explore elite talent.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link to="/search">
                                <Button className="rounded-2xl h-14 px-8 shadow-2xl shadow-primary/20 gradient-bg border-none font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                    <Search size={18} className="mr-2" /> Find Artists
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="grid grid-cols-1 xl:grid-cols-12 gap-10"
                            >
                                <div className="xl:col-span-8 space-y-10 order-2 xl:order-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Total Events', value: profile.bookings?.length || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-500/5' },
                                            { label: 'Active Enquiries', value: profile.enquiries?.length || 0, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-500/5' },
                                            { label: 'Saved Talent', value: shortlisted.length, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-500/5' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="p-8 rounded-[2.5rem] bg-white border border-border/40 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                                                <div className={`p-4 rounded-2xl w-fit ${stat.bg} ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                                                    <stat.icon size={22} strokeWidth={2.5} />
                                                </div>
                                                <p className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</p>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mt-1 tracking-[0.2em]">{stat.label}</p>
                                                <div className={`absolute -bottom-6 -right-6 text-9xl font-black opacity-[0.03] select-none pointer-events-none ${stat.color}`}>{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <section className="bg-white border border-border/40 rounded-[3rem] p-10 shadow-sm">
                                        <WeeklyTop10 title="✨ Exclusive Talent Recommendations" />
                                    </section>
                                </div>

                                <div className="xl:col-span-4 space-y-8 order-1 xl:order-2">
                                    <div className="bg-white border border-border/40 rounded-[3rem] p-8 shadow-sm relative overflow-hidden">
                                        <h3 className="font-heading font-black text-xl mb-8 flex items-center justify-between">
                                            Live Enquiries
                                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">{profile.enquiries?.length || 0}</span>
                                        </h3>
                                        <div className="space-y-4">
                                            {profile.enquiries?.length > 0 ? profile.enquiries.slice(0, 3).map((e: any) => (
                                                <div key={e.id} className="p-5 rounded-3xl bg-secondary/30 border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group">
                                                    <div>
                                                        <p className="font-black text-sm text-foreground">{e.artist?.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest">{new Date(e.eventDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10 opacity-40 italic flex flex-col items-center">
                                                    <MessageSquare size={32} className="mb-2" />
                                                    <p className="text-xs uppercase tracking-widest font-black">No Enquiries</p>
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-8 text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary rounded-2xl h-12">See All Activities</Button>
                                    </div>

                                    <div className="bg-[#111111] rounded-[3rem] p-10 text-white shadow-3xl shadow-primary/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150 rotate-12"><Star size={100} /></div>
                                        <div className="relative z-10">
                                            <h3 className="font-heading font-black text-2xl mb-2 tracking-tighter">Elite Privileges</h3>
                                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Early access to celebrities & celebrity management teams.</p>
                                            <Button className="w-full font-black py-7 rounded-2xl gradient-bg border-none shadow-xl shadow-primary/40">Upgrade Membership</Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'My Bookings' ? (
                            <motion.div
                                key="bookings"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {profile.bookings?.length > 0 ? (
                                    <div className="space-y-6">
                                        {profile.bookings.map((booking: any) => (
                                            <div key={booking.id} className="bg-white border border-border/40 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:scale-[1.01] transition-all">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-24 h-24 rounded-[2rem] bg-secondary overflow-hidden border border-border/50 shrink-0 shadow-lg group">
                                                        <img src={booking.artist?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.artist?.name)}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-heading font-black text-2xl tracking-tighter">{booking.artist?.name}</h4>
                                                            <CheckCircle2 size={16} className="text-primary" />
                                                        </div>
                                                        <div className="flex items-center gap-6 text-xs text-muted-foreground font-black uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> 24 Oct 2024</span>
                                                            <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-500" /> {booking.artist?.category?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/30">
                                                    <div className="flex flex-col items-end mr-6 hidden md:flex">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest mb-1">Status</span>
                                                        <span className={`text-xs font-black tracking-widest ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>{booking.paymentStatus}</span>
                                                    </div>
                                                    
                                                    {booking.status === 'COMPLETED' ? (
                                                        booking.hasBeenReviewed ? (
                                                            <div className="flex items-center gap-2 px-8 h-14 rounded-2xl bg-green-500/5 text-green-600 border border-green-500/20 font-black text-xs uppercase tracking-widest">
                                                                <CheckCircle2 size={18} /> Experience Rated
                                                            </div>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => setSelectedReviewBooking(booking)}
                                                                className="rounded-2xl h-14 px-10 shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-widest gradient-bg group overflow-hidden"
                                                            >
                                                                <Star size={18} className="mr-2 group-hover:fill-white transition-all scale-110" /> Leave Review
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <div className="h-14 px-8 rounded-2xl bg-secondary/50 border border-border/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                            <Clock size={16} className="text-primary animate-pulse" /> Upcoming Performance
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-border/30 flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center mb-10">
                                            <Calendar className="text-muted-foreground opacity-20" size={60} />
                                        </div>
                                        <h3 className="text-4xl font-black text-foreground mb-4 tracking-tighter font-heading">Empty Calendar</h3>
                                        <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">Your event journey hasn't started yet. Let's find an artist to make your moment legendary.</p>
                                        <Link to="/search">
                                            <Button className="h-16 px-12 rounded-2xl text-xs font-black uppercase tracking-[0.2em] gradient-bg shadow-2xl shadow-primary/30">Start Exploring Talent</Button>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        ) : activeTab === 'Shortlisted' ? (
                            <motion.div
                                key="shortlisted"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                {shortlisted.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {shortlisted.map((artist: any, i: number) => (
                                            <ArtistCard key={artist.id} artist={artist} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-border/30 flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center mb-10">
                                            <Heart className="text-muted-foreground opacity-20" size={60} />
                                        </div>
                                        <h3 className="text-4xl font-black text-foreground mb-4 tracking-tighter font-heading">Heart List Empty</h3>
                                        <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">Save the performances you love and build your dream lineup here.</p>
                                        <Link to="/search">
                                            <Button variant="outline" className="h-16 px-12 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2">Find Talent</Button>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="other"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center py-32 text-muted-foreground italic bg-white rounded-[4rem] border border-border/40 shadow-sm"
                            >
                                <div className="text-center">
                                    <Clock size={48} className="mx-auto mb-4 opacity-10" />
                                    <p className="font-black uppercase tracking-[0.3em] text-[10px]">{activeTab} Section Is Under Construction</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
