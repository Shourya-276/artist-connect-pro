import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Shield, LogOut, UserPlus, Filter, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import AddArtistForm from '@/components/admin/AddArtistForm';
import SortArtist from '@/components/admin/SortArtist';

const sidebarItems = [
  { icon: Music, label: 'Artists', key: 'artists' },
  { icon: UserPlus, label: 'Add Artist', key: 'add-artist' },
  { icon: Filter, label: 'Sort Artists', key: 'sort-artist' },
  { icon: Users, label: 'Leads', key: 'leads' },
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
  const [activeTab, setActiveTab] = useState('artists');
  const [role] = useState('SuperAdmin');
  
  const { data: artists, isLoading } = useQuery<any[]>({
    queryKey: ['admin-artists'],
    queryFn: () => apiFetch('/api/artists'),
  });

  const { data: leads, isLoading: isLoadingLeads } = useQuery<any[]>({
    queryKey: ['admin-leads'],
    queryFn: () => apiFetch('/api/leads'),
    enabled: activeTab === 'leads',
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login', { replace: true });
  };

  // Basic security check
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminLoggedIn');
    if (isAdmin !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-16 bg-background">
      {/* Mobile Header / Sidebar Toggle */}
      <div className="lg:hidden bg-sidebar text-sidebar-foreground p-4 border-b border-sidebar-border flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-sidebar-primary" />
          <span className="font-heading font-bold">Admin Panel</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === item.key ? 'bg-sidebar-primary text-white shadow-lg' : 'bg-sidebar-accent/50 text-sidebar-foreground/70'}`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-sidebar-primary" />
            <span className="font-heading font-bold text-sidebar-foreground">Admin Panel</span>
          </div>
          <div className="mt-1">{roleBadge(role)}</div>
        </div>
        <nav className="px-3 flex-1 overflow-y-auto custom-scrollbar">
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
            onClick={handleLogout}
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

            {activeTab === 'artists' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Artists Management</h1>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Artist</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Rating</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Loading artists...</td></tr>
                      ) : artists?.map(a => (
                        <tr key={a.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                          <td className="p-3 text-[10px] font-mono text-muted-foreground select-all uppercase">{a.id.split('-').pop()}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden">
                                {a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover" /> : a.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-card-foreground">{a.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground lowercase">{a.user?.email || 'no-email@id'}</td>
                          <td className="p-3 text-muted-foreground">{a.category?.name || 'Uncategorized'}</td>
                          <td className="p-3 text-muted-foreground">{a.city?.name || 'Remote'}</td>
                          <td className="p-3">
                             <div className="flex items-center gap-1">
                               <span className="font-bold text-card-foreground">{a.rating}</span>
                               <span className="text-[10px] text-muted-foreground">({a.totalReviews})</span>
                             </div>
                          </td>
                          <td className="p-3">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-3 gap-2 text-primary hover:text-primary hover:bg-primary/5 rounded-lg"
                                onClick={() => window.open(`/artist/${a.id}`, '_blank')}
                             >
                               <ExternalLink size={14} /> View
                             </Button>
                          </td>
                        </tr>
                      ))}
                      {!isLoading && artists?.length === 0 && (
                        <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">No artists found in the system.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'add-artist' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-heading font-bold text-2xl text-foreground">Create New Artist Profile</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manually onboard and configure an artist's profile.</p>
                  </div>
                </div>
                <AddArtistForm onArtistCreated={() => setActiveTab('artists')} />
              </>
            )}

            {activeTab === 'sort-artist' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-heading font-bold text-2xl text-foreground">Sort & Feature Artists</h1>
                    <p className="text-muted-foreground text-sm mt-1">Select which artists to highlight on the homepage.</p>
                  </div>
                </div>
                <SortArtist />
              </>
            )}

            {activeTab === 'leads' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Inquiry Leads</h1>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingLeads ? (
                        <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">Loading leads...</td></tr>
                      ) : leads?.map(l => (
                        <tr key={l.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                          <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 font-semibold text-card-foreground">{l.name}</td>
                          <td className="p-3 text-muted-foreground">{l.email}</td>
                          <td className="p-3 text-muted-foreground max-w-md truncate" title={l.message}>{l.message}</td>
                        </tr>
                      ))}
                      {!isLoadingLeads && leads?.length === 0 && (
                        <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">No leads found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}
