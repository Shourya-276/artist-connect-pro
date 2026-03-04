import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, LogOut, Banknote, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const [budgetChart, setBudgetChart] = useState([
    { eventType: '', budgetRange: '10001-20000', price: 0 },
  ]);

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Artist Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile, availability, and bookings</p>
            </div>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => navigate('/')}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>

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
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card rounded-xl border border-border p-6 h-full">
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
                      className={`aspect-square rounded-lg text-sm font-medium border transition-all hover:scale-105 ${status ? statusColors[status] : 'border-border text-foreground hover:bg-secondary'
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

            {/* Budget Chart Column */}
            <div className="bg-card rounded-xl border border-border p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                  <Banknote size={20} className="text-primary" /> Event & Budget Chart
                </h3>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">Save Changes</Button>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Manage your custom event pricing</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setBudgetChart([...budgetChart, { eventType: '', budgetRange: '10001-20000', price: 0 }])}
                  className="h-8 p-0 text-primary hover:bg-transparent"
                >
                  <Plus size={16} className="mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {budgetChart.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        value={item.eventType}
                        onChange={e => {
                          const newChart = [...budgetChart];
                          newChart[index].eventType = e.target.value;
                          setBudgetChart(newChart);
                        }}
                        className="flex-1 bg-transparent border-none text-sm font-semibold text-foreground focus:ring-0 p-0 placeholder:text-muted-foreground/50"
                        placeholder="Event Name (e.g. Wedding)"
                      />
                      {budgetChart.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBudgetChart(budgetChart.filter((_, i) => i !== index))}
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Budget Range</label>
                        <select
                          value={item.budgetRange}
                          onChange={e => {
                            const newChart = [...budgetChart];
                            newChart[index].budgetRange = e.target.value;
                            setBudgetChart(newChart);
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-card text-foreground border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="0-5000">0 - 5000</option>
                          <option value="5001-10000">5001 - 10000</option>
                          <option value="10001-20000">10001 - 20000</option>
                          <option value="20001-50000">20001 - 50000</option>
                          <option value="50001-100000">50001 - 100000</option>
                          <option value="100000+">100000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Your Price (₹)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={e => {
                            const newChart = [...budgetChart];
                            newChart[index].price = parseInt(e.target.value) || 0;
                            setBudgetChart(newChart);
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-card text-foreground border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                          placeholder="Price"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
