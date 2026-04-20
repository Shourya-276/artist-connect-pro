import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const clientTypes = ['Corporate', 'Wedding Planner', 'Event Agency', 'Venue', 'Individual', 'Other'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Goa', 'Chandigarh'];

export default function ClientSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', company: '', city: '', clientType: '', gst: '', password: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          role: 'CLIENT',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/client/login?registered=true');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {[
                { field: 'name', label: 'Name', placeholder: 'Your full name', type: 'text' },
                { field: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX', type: 'tel' },
                { field: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
                { field: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
                  <input required type={type} value={(form as any)[field]} onChange={e => update(field, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                <select required value={form.city} onChange={e => update('city', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select city</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Client Type</label>
                <select required value={form.clientType} onChange={e => update('clientType', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
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
                <input required type="password" value={form.password} onChange={e => update('password', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Create password" />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-xl mt-2" size="lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center mt-6">
              <Link
                to="/client/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Already have an account? Login here
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
