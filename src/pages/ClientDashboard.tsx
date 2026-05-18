import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Heart, MessageSquare, Settings, LogOut, Bell, Search, Star, CheckCircle2, Clock, MapPin, ChevronRight, AlertCircle, RefreshCcw, BellRing, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import WeeklyTop10 from '@/components/trending/WeeklyTop10';
import ArtistCard from '@/components/artists/ArtistCard';
import ReviewModal from '@/components/dashboard/ReviewModal';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedReviewBooking, setSelectedReviewBooking] = useState<any>(null);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await apiFetch('/api/clients/change-password', {
                method: 'POST',
                body: JSON.stringify({ oldPassword, newPassword })
            });
            toast.success('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const [notifications, setNotifications] = useState<any[]>([]);

    const loadNotifications = useCallback(() => {
        const list = JSON.parse(localStorage.getItem('clientNotifications') || '[]');
        setNotifications(list);
    }, []);

    useEffect(() => {
        loadNotifications();
        window.addEventListener('storage', loadNotifications);
        return () => window.removeEventListener('storage', loadNotifications);
    }, [loadNotifications]);

    const markAllNotificationsAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem('clientNotifications', JSON.stringify(updated));
        setNotifications(updated);
        window.dispatchEvent(new Event('storage'));
    };

    const clearAllNotifications = () => {
        localStorage.setItem('clientNotifications', JSON.stringify([]));
        setNotifications([]);
        window.dispatchEvent(new Event('storage'));
    };

    const deleteNotification = (id: string) => {
        const updated = notifications.filter(n => n.id !== id);
        localStorage.setItem('clientNotifications', JSON.stringify(updated));
        setNotifications(updated);
        window.dispatchEvent(new Event('storage'));
    };

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
        navigate('/client/login', { replace: true });
    };

    // Basic security check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/client/login');
        }
    }, [navigate]);

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
        <div className="min-h-screen pt-16 bg-[#F8F9FB] flex flex-col lg:flex-row overflow-hidden h-[calc(100vh)]">
            <AnimatePresence>
                {selectedReviewBooking && (
                    <ReviewModal 
                        booking={selectedReviewBooking} 
                        onClose={() => setSelectedReviewBooking(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Premium Sidebar */}
            <aside className="w-full lg:w-72 bg-white border-r border-border/50 flex flex-col z-20 shadow-sm relative lg:sticky lg:top-16 h-[calc(100vh-4rem)]">
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

                <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto custom-scrollbar">
                    {[
                        { icon: LayoutDashboard, label: 'Overview' },
                        { icon: Heart, label: 'Shortlisted' },
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
                                {item.label === 'Notifications' && notifications.filter(n => !n.read).length > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center animate-pulse shrink-0">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </div>
                            {activeTab === item.label && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Total Events', value: profile.bookings?.length || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-500/5' },
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
                                    <div className="bg-[#111111] rounded-[3rem] p-10 text-white shadow-3xl shadow-primary/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150 rotate-12"><Star size={100} /></div>
                                        <div className="relative z-10">
                                            <h3 className="font-heading font-black text-2xl mb-2 tracking-tighter">Elite Privileges</h3>
                                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Early access to celebrities & celebrity management teams.</p>
                                            <Button onClick={() => navigate('/pricing')} className="w-full font-black py-7 rounded-2xl gradient-bg border-none shadow-xl shadow-primary/40">Upgrade Membership</Button>
                                        </div>
                                    </div>
                                </div>
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
                        ) : activeTab === 'Notifications' ? (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-6"
                            >
                                <div className="bg-white border border-border/40 rounded-[3rem] p-10 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-primary/10 text-primary animate-bounce">
                                                <BellRing size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-black text-xl tracking-tighter">Your Notifications</h3>
                                                <p className="text-xs text-muted-foreground font-medium">Stay updated with your shortlist updates and activity log.</p>
                                            </div>
                                        </div>
                                        {notifications.length > 0 && (
                                            <div className="flex items-center gap-3">
                                                <Button 
                                                    onClick={markAllNotificationsAsRead}
                                                    variant="outline" 
                                                    className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-1.5 border-2"
                                                >
                                                    Mark all read
                                                </Button>
                                                <Button 
                                                    onClick={clearAllNotifications}
                                                    variant="ghost" 
                                                    className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-1.5 text-destructive hover:bg-destructive/5"
                                                >
                                                    <Trash2 size={14} /> Clear all
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {notifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {notifications.map((notif) => (
                                                <div 
                                                    key={notif.id} 
                                                    className={`p-6 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                                                        notif.read 
                                                            ? 'bg-secondary/10 border-border/30 opacity-70' 
                                                            : 'bg-white border-primary/20 shadow-md shadow-primary/5 hover:border-primary/45'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                                                            notif.type === 'success' 
                                                                ? 'bg-green-500/10 text-green-600' 
                                                                : 'bg-blue-500/10 text-blue-600'
                                                        }`}>
                                                            {notif.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-black text-sm text-foreground tracking-tight">{notif.title}</h4>
                                                                {!notif.read && (
                                                                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1 font-medium">{notif.message}</p>
                                                            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase mt-2">
                                                                {new Date(notif.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteNotification(notif.id)}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 opacity-30">
                                            <BellRing className="mx-auto mb-4" size={48} />
                                            <p className="font-black uppercase tracking-widest text-xs">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : activeTab === 'Settings' ? (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Left Panel: Change Password */}
                                    <div className="lg:col-span-8 bg-white border border-border/40 rounded-[3rem] p-10 shadow-sm space-y-8">
                                        <div className="flex items-center gap-3 pb-6 border-b border-border">
                                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                                <Settings size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-heading font-black text-xl tracking-tighter">Security & Password Management</h3>
                                                <p className="text-xs text-muted-foreground font-medium">Update your account credentials to keep your profile secure.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-foreground">Previous Password</label>
                                                <input 
                                                    type="password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full h-14 px-6 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-medium"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-foreground">New Password</label>
                                                    <input 
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full h-14 px-6 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-foreground">Confirm New Password</label>
                                                    <input 
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        className="w-full h-14 px-6 rounded-2xl bg-secondary/30 border border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <Button 
                                                type="submit" 
                                                disabled={isUpdatingPassword}
                                                className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gradient-bg border-none hover:scale-[1.01] transition-transform"
                                            >
                                                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                                            </Button>
                                        </form>
                                    </div>

                                    {/* Right Panel: Sessions Controls */}
                                    <div className="lg:col-span-4 bg-white border border-border/40 rounded-[3rem] p-10 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
                                        <div>
                                            <div className="flex items-center gap-3 pb-6 border-b border-border">
                                                <div className="p-3 rounded-2xl bg-destructive/10 text-destructive">
                                                    <LogOut size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-heading font-black text-xl tracking-tighter text-destructive">Session Settings</h3>
                                                    <p className="text-xs text-muted-foreground font-medium">Manage your active portal sessions.</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium mt-6 leading-relaxed">
                                                Signing out will end your current session and require you to enter credentials on your next visit.
                                            </p>
                                        </div>

                                        <Button 
                                            onClick={handleLogout}
                                            variant="destructive"
                                            className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs hover:bg-destructive/90 transition-colors mt-8 shrink-0"
                                        >
                                            <LogOut size={16} className="mr-2" /> Log Out Securely
                                        </Button>
                                    </div>
                                </div>
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
