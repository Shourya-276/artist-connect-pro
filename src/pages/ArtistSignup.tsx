import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { categories, genres, eventTypes, cities, languages } from '@/data/mockData';

export default function ArtistSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', gender: '', languages: [] as string[], city: '', area: '',
    primaryCategory: '', genres: [] as string[], instruments: [] as string[], eventCategories: [] as string[],
    bio: '', instagram: '', youtube: '', facebook: '', website: '', travelNationwide: false,
  });

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const toggleArray = (field: string, val: string) => {
    const arr = (form as any)[field] as string[];
    update(field, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('users') || '[]');
    existing.push({ ...form, type: 'artist', id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem('users', JSON.stringify(existing));
    navigate('/artist/dashboard');
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide max-w-2xl py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Join as Artist</h1>
          <p className="text-muted-foreground mb-8">Step {step} of 3</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'gradient-bg' : 'bg-border'}`} />
            ))}
          </div>

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <input value={form.fullName} onChange={e => update('fullName', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Gender</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(l => (
                    <button key={l} onClick={() => toggleArray('languages', l)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.languages.includes(l) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                  <select value={form.city} onChange={e => update('city', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                    <option value="">Select city</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Area</label>
                  <input value={form.area} onChange={e => update('area', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Your area" />
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-11 rounded-xl mt-4" size="lg">Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Primary Category</label>
                <select value={form.primaryCategory} onChange={e => update('primaryCategory', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <button key={g} onClick={() => toggleArray('genres', g)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.genres.includes(g) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Event Categories</label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map(e => (
                    <button key={e} onClick={() => toggleArray('eventCategories', e)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.eventCategories.includes(e) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm resize-none" placeholder="Tell us about yourself..." />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border">
                <span className="text-sm font-medium text-foreground">Travel Nationwide</span>
                <button onClick={() => update('travelNationwide', !form.travelNationwide)} className={`w-12 h-6 rounded-full transition-all ${form.travelNationwide ? 'gradient-bg' : 'bg-border'}`}>
                  <div className={`w-5 h-5 rounded-full bg-card transition-transform ${form.travelNationwide ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl">Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl">Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Social Links</h3>
              {['instagram', 'youtube', 'facebook', 'website'].map(field => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-1 block capitalize">{field}</label>
                  <input value={(form as any)[field]} onChange={e => update(field, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={`Your ${field} URL`} />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl">Back</Button>
                <Button onClick={handleSubmit} className="flex-1 h-11 rounded-xl">Complete Signup</Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
