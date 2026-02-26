import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArtistDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

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

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Artist Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage your profile, availability, and bookings</p>

          {/* Profile Completion Warning */}
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-foreground text-sm">Complete your profile</p>
              <p className="text-xs text-muted-foreground">Upload at least 3 photos and 3 videos to activate your profile</p>
            </div>
            <Button size="sm" className="ml-auto">Complete Now</Button>
          </div>

          {/* Subscription Card */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-foreground">Annual Plan</h3>
                <p className="text-sm text-muted-foreground">Expires in 45 days</p>
              </div>
              <Button variant="outline" size="sm">Renew</Button>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                <CalendarIcon size={20} className="text-primary" /> Availability Calendar
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary"><ChevronLeft size={16} /></button>
                <span className="px-3 py-1 text-sm font-medium text-foreground">{monthName}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary"><ChevronRight size={16} /></button>
              </div>
            </div>
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
                    className={`aspect-square rounded-lg text-sm font-medium border transition-all hover:scale-105 ${
                      status ? statusColors[status] : 'border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary/30" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-accent/30" /> Booked</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-destructive/30" /> Blocked</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
