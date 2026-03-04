import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Heart, MessageSquare, Settings, LogOut, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import { mockArtists, Artist } from '@/data/mockData';
import ArtistCard from '@/components/artists/ArtistCard';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [shortlisted, setShortlisted] = useState<Artist[]>([]);

    const loadShortlisted = () => {
        const ids = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
        const artists = mockArtists.filter(a => ids.includes(a.id));
        setShortlisted(artists);
    };

    useEffect(() => {
        loadShortlisted();
        window.addEventListener('storage', loadShortlisted);
        return () => window.removeEventListener('storage', loadShortlisted);
    }, []);

    return (
        <div className="min-h-screen pt-20 bg-background flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 border-r border-border bg-card p-6 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold">
                        JD
                    </div>
                    <div>
                        <p className="font-bold text-foreground text-sm">John Doe</p>
                        <p className="text-xs text-muted-foreground">Premium Member</p>
                    </div>
                </div>

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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.label
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}

                <div className="mt-auto pt-8">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => navigate('/')}
                    >
                        <LogOut size={18} /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-heading font-bold text-2xl text-foreground">
                            {activeTab}
                        </h2>
                        <Link to="/search">
                            <Button size="sm" className="rounded-full gap-2">
                                <Search size={16} /> Find Artists
                            </Button>
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                            >
                                {/* Left Column: Stats & trending */}
                                <div className="xl:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { label: 'Total Bookings', value: '12', trend: '+2 this month' },
                                            { label: 'Amount Spent', value: '₹4.5L', trend: 'Pro Plan' },
                                            { label: 'Upcoming Events', value: '3', trend: 'Next: 15 Oct' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border card-elevated">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                                                <p className="text-[10px] text-primary mt-1 font-semibold">{stat.trend}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <section className="bg-card border border-border rounded-2xl p-6 card-elevated">
                                        <WeeklyTop10 title="🔥 Hot This Week" />
                                    </section>
                                </div>

                                {/* Right Column: Recent Activity */}
                                <div className="space-y-8">
                                    <div className="bg-card border border-border rounded-2xl p-6 card-elevated">
                                        <h3 className="font-heading font-bold text-lg mb-4">Recent Enquiries</h3>
                                        <div className="space-y-4">
                                            {[
                                                { artist: 'Arjun Kapoor', status: 'Quote Received', date: '2h ago' },
                                                { artist: 'DJ Priya', status: 'Payment Pending', date: '1d ago' },
                                                { artist: 'Vikram Singh', status: 'Completed', date: '5d ago' },
                                            ].map((act, i) => (
                                                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{act.artist}</p>
                                                        <p className="text-xs text-muted-foreground">{act.status}</p>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-medium">{act.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-4 text-xs font-bold uppercase tracking-widest hover:text-primary">View All Activities</Button>
                                    </div>

                                    <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-10 text-primary-foreground shadow-xl shadow-primary/20">
                                        <h3 className="font-heading font-bold text-lg mb-2">Exclusive Offer</h3>
                                        <p className="text-sm text-primary-foreground/80 mb-4">Get 20% off on your next booking with any Verified Artist.</p>
                                        <Button variant="secondary" size="sm" className="w-full font-bold">Claim Now</Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'Shortlisted' ? (
                            <motion.div
                                key="shortlisted"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {shortlisted.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {shortlisted.map((artist, i) => (
                                            <ArtistCard key={artist.id} artist={artist} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                                        <Heart className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                                        <h3 className="text-xl font-heading font-bold text-foreground mb-2">No shortlists yet</h3>
                                        <p className="text-muted-foreground mb-8">Start exploring and save your favorite artists here.</p>
                                        <Link to="/search">
                                            <Button>Explore Artists</Button>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="other"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center py-20 text-muted-foreground italic"
                            >
                                This section is coming soon...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
