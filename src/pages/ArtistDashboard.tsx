import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LogOut, Banknote, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Record<string, { status: 'available' | 'booked' | 'blocked' | ''; note?: string }>>({});
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
    navigate('/artist/login', { replace: true });
  };

  // Basic security check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/artist/login');
    }
  }, [navigate]);

  // Load calendar dates from database (or localStorage fallback) on profile load
  useEffect(() => {
    if (profile) {
      if (profile.availability) {
        try {
          const parsed = typeof profile.availability === 'string'
            ? JSON.parse(profile.availability)
            : profile.availability;
          setSelectedDates(parsed || {});
          return;
        } catch (e) {
          console.error('Failed to parse database availability', e);
        }
      }

      // LocalStorage fallback
      if (profile.id) {
        const saved = localStorage.getItem(`artist_calendar_${profile.id}`);
        if (saved) {
          try {
            setSelectedDates(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse saved calendar dates', e);
          }
        }
      }
    }
  }, [profile]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

  const handleMonthChange = (monthIdx: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIdx, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Modal States for Dates
  const [activeDateModal, setActiveDateModal] = useState<{ day: number; key: string } | null>(null);
  const [modalStatus, setModalStatus] = useState<'available' | 'booked' | 'blocked' | ''>('');
  const [modalNote, setModalNote] = useState('');

  const handleDateClick = (day: number) => {
    const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`;
    const dateData = selectedDates[key] || { status: '', note: '' };
    setActiveDateModal({ day, key });
    setModalStatus(dateData.status);
    setModalNote(dateData.note || '');
  };

  const handleSaveDateData = async () => {
    if (!activeDateModal) return;
    const { key } = activeDateModal;
    
    const updated = { ...selectedDates };
    if (modalStatus === '') {
      delete updated[key];
    } else {
      updated[key] = {
        status: modalStatus,
        note: modalNote.trim()
      };
    }

    setSelectedDates(updated);
    
    if (profile?.id) {
      localStorage.setItem(`artist_calendar_${profile.id}`, JSON.stringify(updated));
      
      try {
        await apiFetch('/api/artists/me/availability', {
          method: 'PUT',
          body: JSON.stringify({ availability: updated }),
        });
      } catch (err) {
        console.error('Failed to save availability to database:', err);
      }
    }
    
    setActiveDateModal(null);
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20',
    booked: 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20',
    blocked: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20',
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <h3 className="font-heading font-semibold text-base text-foreground flex items-center gap-2">
                  <CalendarIcon size={18} className="text-primary" /> Availability Calendar
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-border"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <select
                    value={currentMonth.getMonth()}
                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                    className="h-9 px-3 rounded-lg border border-border bg-secondary text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="h-9 px-3 rounded-lg border border-border bg-secondary text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-border"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
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
                  const dateData = selectedDates[key];
                  const status = dateData?.status || '';
                  const note = dateData?.note || '';
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      title={note ? `${status.toUpperCase()}: ${note}` : status ? status.toUpperCase() : 'Unblocked'}
                      className={`aspect-square rounded-lg text-sm font-medium border transition-all hover:scale-105 relative flex flex-col items-center justify-center ${
                        status ? statusColors[status] : 'border-border text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span>{day}</span>
                      {note && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-1 animate-pulse" />
                      )}
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

      {/* Date Manager Modal */}
      <AnimatePresence>
        {activeDateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl relative"
            >
              <h3 className="font-heading font-bold text-xl text-foreground mb-1 tracking-tight">
                Manage Date
              </h3>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-6">
                {activeDateModal.day} {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              </p>

              <div className="space-y-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModalStatus('available')}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        modalStatus === 'available'
                          ? 'bg-green-500/20 text-green-600 border-green-500'
                          : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStatus('booked')}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        modalStatus === 'booked'
                          ? 'bg-primary/20 text-primary border-primary'
                          : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary'
                      }`}
                    >
                      Booked
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStatus('blocked')}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        modalStatus === 'blocked'
                          ? 'bg-destructive/20 text-destructive border-destructive'
                          : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary'
                      }`}
                    >
                      Blocked
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalStatus('')}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all ${
                        modalStatus === ''
                          ? 'bg-muted/20 text-muted-foreground border-muted-foreground/30'
                          : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary'
                      }`}
                    >
                      Unblocked (Clear)
                    </button>
                  </div>
                </div>

                {/* Booking Note Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Booking / Block Notes</label>
                  <textarea
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    placeholder="Enter event note, booking name, or description..."
                    className="w-full min-h-[90px] p-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:bg-card text-xs font-medium outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 mt-8">
                <Button
                  onClick={handleSaveDateData}
                  className="flex-1 rounded-xl h-11 text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-md"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setActiveDateModal(null)}
                  variant="outline"
                  className="flex-1 rounded-xl h-11 text-xs font-black uppercase tracking-widest border-border text-foreground"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
