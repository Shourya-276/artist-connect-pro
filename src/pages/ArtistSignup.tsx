import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Camera, UploadCloud, Image as ImageIcon, Video, AlertCircle, CheckCircle2, LayoutPanelTop } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
// No longer importing mockData constants as we'll fetch them from the backend

export default function ArtistSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [metadata, setMetadata] = useState<{
    categories: any[],
    cities: any[],
    genres: any[],
    languages: string[],
    eventTypes: string[]
  }>({
    categories: [],
    cities: [],
    genres: [],
    languages: [],
    eventTypes: []
  });

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', gender: '', languages: [] as string[], city: '', area: '',
    primaryCategory: '', genres: [] as string[], instruments: [] as string[], eventCategories: [] as string[],
    bio: '', instagram: '', youtube: '', facebook: '', website: '', travelNationwide: false,
    budgetChart: [
      { eventType: '', budgetRange: '10001-20000', price: 0 },
    ],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/metadata`);
        if (res.ok) {
          const data = await res.json();
          setMetadata(data);
        }
      } catch (err) {
        console.error("Failed to fetch metadata", err);
      }
    };
    fetchMetadata();
  }, []);

  const [files, setFiles] = useState<{ 
    images: File[], 
    videos: File[], 
    profileImage: File | null, 
    coverImage: File | null 
  }>({
    images: [],
    videos: [],
    profileImage: null,
    coverImage: null,
  });

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const profileInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const toggleArray = (field: string, val: string) => {
    const arr = (form as any)[field] as string[];
    update(field, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.fullName || !form.email || !form.password || !form.phone || !form.city) {
        toast.error('Please fill all required account details');
        return false;
      }
    }
    if (step === 2) {
      if (!form.primaryCategory || !form.bio) {
        toast.error('Category and Bio are required');
        return false;
      }
    }
    if (step === 3) {
      const validPricing = form.budgetChart.some(item => item.eventType && item.price > 0);
      if (!validPricing) {
        toast.error('Please add at least one valid pricing entry');
        return false;
      }
    }
    if (step === 4) {
      if (files.images.length < 2) {
        toast.error('Please upload at least 2 pictures');
        return false;
      }
      if (files.videos.length < 1) {
        toast.error('Please upload at least 1 performance video');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const uploadMediaAction = async (endpoint: string, uploadFiles: File | File[], token: string, multiple = false) => {
      const formData = new FormData();
      if (multiple && Array.isArray(uploadFiles)) { 
          uploadFiles.forEach(f => formData.append('files', f)); 
      } 
      else if (!Array.isArray(uploadFiles)) { 
          formData.append('file', uploadFiles); 
      }
      
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/media/${endpoint}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData,
          });
          if (!res.ok) throw new Error(`Failed to upload to ${endpoint}`);
      } catch (e: any) { 
          toast.error(e.message); 
      }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      // 1. Register User
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: 'ARTIST',
          name: form.fullName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'User already exists') {
          throw new Error('This email is already registered. If you had a failed signup attempt, please use a different email or login to finish your profile.');
        }
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. Update Profile with full details
      const profileRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/artists/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: form.bio,
          priceRange: `${form.budgetChart[0].price} - ${form.budgetChart[form.budgetChart.length-1].price}`,
          budgetChart: form.budgetChart,
          instagram: form.instagram,
          youtube: form.youtube,
          facebook: form.facebook,
          website: form.website,
          categoryId: form.primaryCategory,
          cityId: form.city,
          genreIds: form.genres,
          travelNationwide: form.travelNationwide,
          phone: form.phone,
          gender: form.gender,
          area: form.area,
          languages: form.languages,
          instruments: form.instruments,
          eventCategories: form.eventCategories,
        }),
      });

      if (!profileRes.ok) throw new Error('Failed to update profile details');

      // 3. Upload Media
      if (files.profileImage) {
        await uploadMediaAction('profile-pill', files.profileImage, token, false);
      }
      if (files.coverImage) {
        await uploadMediaAction('cover-wide', files.coverImage, token, false);
      }
      if (files.images.length > 0) {
        await uploadMediaAction('upload', files.images, token, true);
      }
      if (files.videos.length > 0) {
        for (const video of files.videos) {
            await uploadMediaAction('video-upload', video, token, false);
        }
      }

      toast.success('Successfully registered! Welcome to Live101.');
      navigate('/artist/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container-wide max-w-2xl py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Join as Artist</h1>
          <p className="text-muted-foreground mb-8">Step {step} of 5</p>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'gradient-bg' : 'bg-border'}`} />
            ))}
          </div>

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-secondary/50 border border-border">
                <div 
                    className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex flex-col items-center justify-center bg-card cursor-pointer hover:bg-primary/5 transition-colors overflow-hidden relative group"
                    onClick={() => profileInputRef.current?.click()}
                >
                    {files.profileImage ? (
                        <img src={URL.createObjectURL(files.profileImage)} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <Camera className="text-primary/40 mb-1" size={24} />
                            <span className="text-[8px] font-bold text-primary/40 uppercase">Profile Pic</span>
                        </>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={20} />
                    </div>
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files && setFiles(f => ({ ...f, profileImage: e.target.files![0] }))} />
                </div>
                <div>
                   <h4 className="font-bold text-sm">Identity Photo (Optional)</h4>
                   <p className="text-xs text-muted-foreground">Add a clear square photo of yourself</p>
                </div>
              </div>
              
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
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Create a password" />
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
                  {metadata.languages.map(l => (
                    <button key={l} type="button" onClick={() => toggleArray('languages', l)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.languages.includes(l) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                  <select value={form.city} onChange={e => update('city', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                    <option value="">Select city</option>
                    {metadata.cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Area</label>
                  <input value={form.area} onChange={e => update('area', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Your area" />
                </div>
              </div>
              <Button onClick={nextStep} className="w-full h-11 rounded-xl mt-4" size="lg">Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Primary Category</label>
                <select value={form.primaryCategory} onChange={e => update('primaryCategory', e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border text-sm">
                  <option value="">Select category</option>
                  {metadata.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {metadata.genres.map(g => (
                    <button key={g.id} type="button" onClick={() => toggleArray('genres', g.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.genres.includes(g.id) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{g.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Event Categories</label>
                <div className="flex flex-wrap gap-2">
                  {metadata.eventTypes.map(e => (
                    <button key={e} type="button" onClick={() => toggleArray('eventCategories', e)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.eventCategories.includes(e) ? 'gradient-bg text-primary-foreground border-transparent' : 'border-border text-muted-foreground hover:border-primary'}`}>{e}</button>
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
                <Button onClick={nextStep} className="flex-1 h-11 rounded-xl">Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="font-heading font-semibold text-lg text-foreground">Event & Budget Chart</h3>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Define your pricing for different event types</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    update('budgetChart', [...form.budgetChart, { eventType: '', budgetRange: '10001-20000', price: 0 }]);
                  }}
                  className="h-8 px-2 border-primary/50 text-primary hover:bg-primary/5"
                >
                  <Plus size={16} className="mr-1" /> Add Event
                </Button>
              </div>
              <div className="space-y-6">
                {form.budgetChart.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/50 border border-border space-y-4 relative group">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Event Name</label>
                        <div className="flex gap-2">
                          <input
                            value={item.eventType}
                            onChange={e => {
                              const newChart = [...form.budgetChart];
                              newChart[index].eventType = e.target.value;
                              update('budgetChart', newChart);
                            }}
                            className="flex-1 h-10 px-3 rounded-lg bg-card text-foreground border border-border text-sm outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g. Wedding, Private Party, Concert"
                          />
                          {form.budgetChart.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                update('budgetChart', form.budgetChart.filter((_, i) => i !== index));
                              }}
                              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget Range</label>
                        <select
                          value={item.budgetRange}
                          onChange={e => {
                            const newChart = [...form.budgetChart];
                            newChart[index].budgetRange = e.target.value;
                            update('budgetChart', newChart);
                          }}
                          className="w-full h-10 px-3 rounded-lg bg-card text-foreground border border-border text-sm"
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
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Price (₹)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={e => {
                            const newChart = [...form.budgetChart];
                            newChart[index].price = parseInt(e.target.value) || 0;
                            update('budgetChart', newChart);
                          }}
                          className="w-full h-10 px-3 rounded-lg bg-card text-foreground border border-border text-xs"
                          placeholder="Enter your price"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl">Back</Button>
                <Button onClick={nextStep} className="flex-1 h-11 rounded-xl">Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground">Media Assets</h3>
                  <p className="text-sm text-muted-foreground">Showcase your best work (Min 2 photos, 1 video)</p>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ImageIcon size={14} /> Pictures ({files.images.length}/2 min)
                  </label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => imageInputRef.current?.click()}
                    className="h-9 px-4 rounded-xl border-dashed hover:border-primary border-primary/30"
                  >
                    <UploadCloud size={16} className="mr-2" /> Add Photos
                  </Button>
                  <input 
                    type="file" 
                    multiple 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={e => e.target.files && setFiles(f => ({ ...f, images: [...f.images, ...Array.from(e.target.files!)] }))}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {files.images.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-secondary">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFiles(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {files.images.length < 3 && Array.from({ length: 3 - files.images.length }).map((_, i) => (
                    <div 
                      key={`placeholder-${i}`} 
                      className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-secondary/30 ${files.images.length < 2 && step === 4 ? 'border-primary/20' : 'border-border'}`}
                    >
                      <ImageIcon className="opacity-10 mb-2" size={24} />
                      <span className="text-[10px] font-bold opacity-30">IMAGE {files.images.length + i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Video size={14} /> Performance Videos ({files.videos.length}/1 min)
                  </label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => videoInputRef.current?.click()}
                    className="h-9 px-4 rounded-xl border-dashed hover:border-primary border-primary/30"
                  >
                    <UploadCloud size={16} className="mr-2" /> Add Videos
                  </Button>
                  <input 
                    type="file" 
                    multiple 
                    ref={videoInputRef} 
                    className="hidden" 
                    accept="video/*"
                    onChange={e => e.target.files && setFiles(f => ({ ...f, videos: [...f.videos, ...Array.from(e.target.files!)] }))}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.videos.map((file, i) => (
                    <div key={i} className="relative aspect-video rounded-3xl overflow-hidden bg-black group border border-border">
                        <video 
                            src={URL.createObjectURL(file)} 
                            className="w-full h-full object-contain" 
                            controls 
                        />
                        <button 
                            type="button" 
                            onClick={() => setFiles(prev => ({ ...prev, videos: prev.videos.filter((_, idx) => idx !== i) }))}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:scale-110"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                  ))}
                  {files.videos.length === 0 && (
                    <div 
                        onClick={() => videoInputRef.current?.click()}
                        className="aspect-video rounded-3xl border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors group col-span-2"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Video className="text-primary" size={32} />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">Upload Your First Video</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <LayoutPanelTop size={14} /> Cover Image (Optional)
                </label>
                
                {files.coverImage ? (
                  <div className="relative h-40 rounded-3xl overflow-hidden bg-secondary group border border-border">
                    <img src={URL.createObjectURL(files.coverImage)} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFiles(f => ({ ...f, coverImage: null }))}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-destructive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => coverInputRef.current?.click()}
                    className="h-24 rounded-2xl border-2 border-dashed border-border bg-secondary/30 flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors group"
                  >
                    <Camera className="text-muted-foreground/30 mr-3" size={24} />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Add Wide Profile Cover</p>
                  </div>
                )}
                <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={e => e.target.files && setFiles(f => ({ ...f, coverImage: e.target.files![0] }))} />
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl">Back</Button>
                <Button onClick={nextStep} className="flex-1 h-11 rounded-xl">Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Social Links (Optional)</h3>
              {['instagram', 'youtube', 'facebook', 'website'].map(field => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground mb-1 block capitalize">{field}</label>
                  <input value={(form as any)[field]} onChange={e => update(field, e.target.value)} className="w-full h-11 px-4 rounded-xl bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder={`Your ${field} URL`} />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(4)} className="flex-1 h-11 rounded-xl">Back</Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 h-11 rounded-xl gradient-bg shadow-xl shadow-primary/20 font-black uppercase tracking-widest"
                  disabled={submitting}
                >
                  {submitting ? 'Creating Profile...' : 'Complete Signup'}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div >
  );
}
