import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LogOut, Banknote, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const [budgetChart, setBudgetChart] = useState([
    { eventType: '', budgetRange: '10001-20000', price: 0 },
  ]);

  // Fetch Artist Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['artist-profile'],
    queryFn: () => apiFetch('/api/artists/me'),
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const toggleDate = (day: number) => {
    const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`;
    const states = ['available', 'booked', 'blocked', ''];
    const current = selectedDates[key] || '';
    const next = states[(states.indexOf(current) + 1) % states.length];
    setSelectedDates(prev => ({ ...prev, [key]: next }));
  };

  const statusColors: Record<string, string> = {
    available: 'bg-primary/20 text-primary border-primary',
    booked: 'bg-accent/20 text-accent border-accent',
    blocked: 'bg-destructive/20 text-destructive border-destructive',
  };

  if (isLoading) return <div className="min-h-screen pt-20 flex items-center justify-center">Loading dashboard...</div>;

  const isProfileIncomplete = !profile?.bio || !profile?.priceRange;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Artist Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile, availability, and bookings</p>
            </div>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>

          {/* Profile Completion Warning */}
          {isProfileIncomplete && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-8 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-foreground text-sm">Complete your profile</p>
                <p className="text-xs text-muted-foreground">Add your bio and pricing to appear in search results</p>
              </div>
              <Link to="/artist/complete-profile" className="ml-auto">
                <Button size="sm">Complete Now</Button>
              </Link>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Views</p>
                <p className="text-2xl font-bold text-foreground">{profile?.stats?.views || 0}</p>
             </div>
             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Bookings</p>
                <p className="text-2xl font-bold text-foreground">{profile?.stats?.bookings || 0}</p>
             </div>
             <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase">Rating</p>
                <p className="text-2xl font-bold text-foreground">{profile?.rating || 'N/A'}</p>
             </div>
          </div>

          {/* Calendar */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-xl border border-border p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                  <CalendarIcon size={20} className="text-primary" /> Availability Calendar
                </h3>
              </div>
              {/* Calendar grid... stays the same for UI purposes */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`;
                  const status = selectedDates[key] || '';
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDate(day)}
                      className={`aspect-square rounded-lg text-sm font-medium border transition-all hover:scale-105 ${status ? statusColors[status] : 'border-border text-foreground hover:bg-secondary'
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price List */}
            <div className="bg-card rounded-xl border border-border p-6 h-full">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2 mb-6">
                  <Banknote size={20} className="text-primary" /> Profile Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="text-sm font-bold text-foreground">{profile?.category?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">City</span>
                        <span className="text-sm font-bold text-foreground">{profile?.city?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Pricing</span>
                        <span className="text-sm font-bold text-foreground">{profile?.priceRange || 'Not Set'}</span>
                    </div>
                    {profile?.budgetChart?.length > 0 && (
                        <div className="py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground block mb-2">Event Types</span>
                            <div className="flex flex-wrap gap-2">
                                {profile.budgetChart.map((item: any, i: number) => (
                                    <span key={i} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">
                                        {item.eventType}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Verification</span>
                        <span className="text-sm font-bold text-green-500">{profile?.isVerified ? 'Verified' : 'Pending'}</span>
                    </div>
                </div>
                <Link to="/artist/complete-profile">
                    <Button className="w-full mt-8" variant="outline">Edit My Profile</Button>
                </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
