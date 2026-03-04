import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Music, CreditCard, TrendingUp, Upload, Shield, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockArtists } from '@/data/mockData';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', key: 'dashboard' },
  { icon: Music, label: 'Artists', key: 'artists' },
  { icon: Users, label: 'Clients', key: 'clients' },
  { icon: CreditCard, label: 'Subscriptions', key: 'subscriptions' },
  { icon: TrendingUp, label: 'Leaderboard', key: 'leaderboard' },
  { icon: Upload, label: 'Bulk Import', key: 'import' },
];

const roleBadge = (role: string) => {
  const colors: Record<string, string> = {
    SuperAdmin: 'gradient-bg text-primary-foreground',
    Admin: 'bg-accent text-accent-foreground',
    Sales: 'bg-secondary text-secondary-foreground',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[role] || ''}`}>{role}</span>;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role] = useState('SuperAdmin');

  const dashboardStats = [
    { label: 'Total Artists', value: '10,234', change: '+12%', icon: Music },
    { label: 'Total Clients', value: '5,678', change: '+8%', icon: Users },
    { label: 'Active Subs', value: '3,456', change: '+15%', icon: CreditCard },
    { label: 'Revenue', value: '₹45.2L', change: '+22%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-sidebar-primary" />
            <span className="font-heading font-bold text-sidebar-foreground">Admin Panel</span>
          </div>
          <div className="mt-1">{roleBadge(role)}</div>
        </div>
        <nav className="px-3 flex-1">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === item.key ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            onClick={() => navigate('/')}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="p-6 sm:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === 'dashboard' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Dashboard Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                  {dashboardStats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card rounded-xl border border-border p-5 card-elevated"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon size={20} className="text-primary" />
                        <span className="text-xs font-medium text-primary">{stat.change}</span>
                      </div>
                      <div className="text-2xl font-heading font-bold text-card-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Recent Artists</h2>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Rating</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockArtists.map(a => (
                        <tr key={a.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                          <td className="p-3 font-medium text-card-foreground">{a.name}</td>
                          <td className="p-3 text-muted-foreground">{a.category}</td>
                          <td className="p-3 text-muted-foreground">{a.city}</td>
                          <td className="p-3 text-card-foreground">{a.rating}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'artists' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Artists Management</h1>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">Artist</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Bookings</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Rating</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockArtists.map(a => (
                        <tr key={a.id} className="border-t border-border hover:bg-secondary/50">
                          <td className="p-3 flex items-center gap-3">
                            <img src={a.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium text-card-foreground">{a.name}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">{a.category}</td>
                          <td className="p-3 text-muted-foreground">{a.city}</td>
                          <td className="p-3 text-card-foreground">{a.bookings}</td>
                          <td className="p-3 text-card-foreground">{a.rating}</td>
                          <td className="p-3"><Button variant="ghost" size="sm">View</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'clients' && (
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Clients Management</h1>
                <p className="text-muted-foreground">Client data will appear here from localStorage.</p>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Subscriptions</h1>
                <p className="text-muted-foreground">Subscription management panel.</p>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Leaderboard</h1>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">#</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Artist</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Views</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockArtists.sort((a, b) => (b.views + b.bookings * 10) - (a.views + a.bookings * 10)).map((a, i) => (
                        <tr key={a.id} className="border-t border-border hover:bg-secondary/50">
                          <td className="p-3 font-bold text-card-foreground">{i + 1}</td>
                          <td className="p-3 font-medium text-card-foreground">{a.name}</td>
                          <td className="p-3 text-primary font-bold">{a.views + a.shortlists * 3 + a.enquiries * 5 + a.bookings * 10}</td>
                          <td className="p-3 text-muted-foreground">{a.views.toLocaleString()}</td>
                          <td className="p-3 text-muted-foreground">{a.bookings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'import' && (
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Bulk Import</h1>
                <div className="bg-card rounded-xl border-2 border-dashed border-border p-12 text-center">
                  <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-heading font-semibold text-foreground mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to upload artist data</p>
                  <Button variant="outline">Select File</Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
