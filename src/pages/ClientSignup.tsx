import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cities } from '@/data/mockData';
import { toast } from '@/components/ui/sonner';

const clientTypes = ['Corporate', 'Wedding Planner', 'Event Agency', 'Venue', 'Individual', 'Other'];

export default function ClientSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', company: '', city: '', clientType: '', gst: '', password: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('clientProfiles') || '[]');
    existing.push({ ...form, type: 'client', id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem('clientProfiles', JSON.stringify(existing));
    navigate('/client/login?registered=true');
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide max-w-lg py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2 text-center">
            Event Planner Portal
          </h1>
          <p className="text-muted-foreground mb-8 text-center text-sm italic">
            Join our premium network to access top talent and management tools
          </p>

          <div className="space-y-4">
            <div className="space-y-4">
              {[
                { field: 'name', label: 'Name', placeholder: 'Your full name', type: 'text' },
                { field: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX', type: 'tel' },
                { field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                { field: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
                  <input type={type} value={(form as any)[field]} onChange={e => update(field, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                <select value={form.city} onChange={e => update('city', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select city</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Client Type</label>
                <select value={form.clientType} onChange={e => update('clientType', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select type</option>
                  {clientTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">GST Number (optional)</label>
                <input value={form.gst} onChange={e => update('gst', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="GST number" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Create password" />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full h-11 rounded-xl mt-2" size="lg">
              Create Account
            </Button>

            <div className="text-center mt-6">
              <Link
                to="/client/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Already have an account? Login here
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
