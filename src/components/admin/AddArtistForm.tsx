import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { CheckCircle2, UserPlus, Image as ImageIcon, Video, Trash2, Camera, UploadCloud, LayoutPanelTop, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function AddArtistForm() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        bio: '',
        priceRange: '',
        instagram: '',
        youtube: '',
        website: '',
        facebook: '',
        categoryId: '',
        cityId: '',
        phone: '',
        gender: '',
        area: '',
        languages: [] as string[],
        genreIds: [] as string[],
        eventCategories: [] as string[],
        travelNationwide: false,
        budgetChart: [
            { eventType: '', budgetRange: '10001-20000', price: 0 },
        ],
    });

    const [files, setFiles] = useState({
        profile: null as File | null,
        cover: null as File | null,
        gallery: [] as File[],
    });

    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Fetch Metadata
    const { data: metadata } = useQuery<any>({ 
        queryKey: ['metadata'], 
        queryFn: () => apiFetch('/api/metadata') 
    });

    const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
    const toggleGenre = (id: string, field: 'genreIds' | 'languages' | 'eventCategories' = 'genreIds') => {
        setForm(f => {
            const arr = f[field] as string[];
            return {
                ...f,
                [field]: arr.includes(id) ? arr.filter(item => item !== id) : [...arr, id]
            };
        });
    };

    const handleFileChange = (field: 'profile' | 'cover' | 'gallery', newFiles: FileList | null) => {
        if (!newFiles) return;
        if (field === 'gallery') {
            setFiles(f => ({ ...f, gallery: [...f.gallery, ...Array.from(newFiles)] }));
        } else {
            setFiles(f => ({ ...f, [field]: newFiles[0] }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create User
            const authRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    role: 'ARTIST',
                    name: form.fullName,
                }),
            });

            if (!authRes.ok) {
                const errorData = await authRes.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const authData = await authRes.json();
            const newToken = authData.token;

            // 2. Update Profile with details
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/artists/me`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken}`
                },
                body: JSON.stringify({
                    bio: form.bio,
                    priceRange: form.priceRange,
                    instagram: form.instagram,
                    youtube: form.youtube,
                    website: form.website,
                    categoryId: form.categoryId,
                    cityId: form.cityId,
                    genreIds: form.genreIds,
                    budgetChart: form.budgetChart,
                    phone: form.phone,
                    gender: form.gender,
                    area: form.area,
                    languages: form.languages,
                    eventCategories: form.eventCategories,
                    facebook: form.facebook,
                    travelNationwide: form.travelNationwide,
                }),
            });

            // 3. Media Uploads
            if (files.profile) {
                await uploadMediaAction('profile-pill', files.profile, newToken, false);
            }
            if (files.cover) {
                await uploadMediaAction('cover-wide', files.cover, newToken, false);
            }
            if (files.gallery.length > 0) {
                await uploadMediaAction('upload', files.gallery, newToken, true);
            }

            toast.success('Successfully created new artist profile!');
            
            // Reset form
            setForm({
                fullName: '', email: '', password: '', bio: '', priceRange: '',
                instagram: '', youtube: '', website: '', facebook: '', categoryId: '', cityId: '', genreIds: [],
                phone: '', gender: '', area: '', languages: [], eventCategories: [], travelNationwide: false,
                budgetChart: [{ eventType: '', budgetRange: '10001-20000', price: 0 }],
            });
            setFiles({ profile: null, cover: null, gallery: [] });

        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* Account Details */}
            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-6">
                    <UserPlus size={24} className="text-primary"/> 1. Account Details 
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <input required value={form.fullName} onChange={e => update('fullName', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="artist@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                        <input type="password" required value={form.password} onChange={e => update('password', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Set a password" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                        <input value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gender</label>
                        <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Visuals Sidebar (adapted from CompleteProfile) */}
            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-6">
                    <Camera size={24} className="text-primary"/> 2. Media & Visuals
                </h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Visualizer box */}
                    <div className="flex-1 bg-secondary rounded-2xl overflow-hidden relative border border-border h-64">
                        {/* Cover image preview */}
                        {files.cover ? (
                            <img src={URL.createObjectURL(files.cover)} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                                <LayoutPanelTop size={48} />
                                <span className="text-[10px] font-bold tracking-widest mt-2">NO COVER IMAGE</span>
                            </div>
                        )}
                        <input type="file" ref={coverInputRef} className="hidden" onChange={e => handleFileChange('cover', e.target.files)} />
                        <Button type="button" variant="secondary" size="sm" onClick={() => coverInputRef.current?.click()} className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 border-0">
                            Change Cover
                        </Button>

                        {/* Profile Pic preview */}
                        <div className="absolute bottom-4 left-4 border-4 border-card rounded-full overflow-hidden w-24 h-24 bg-card cursor-pointer group" onClick={() => profileInputRef.current?.click()}>
                            {files.profile ? (
                                <img src={URL.createObjectURL(files.profile)} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ImageIcon size={32} /></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                <Camera size={20} />
                            </div>
                            <input type="file" ref={profileInputRef} className="hidden" onChange={e => handleFileChange('profile', e.target.files)} />
                        </div>
                    </div>

                    {/* Gallery section */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Gallery</label>
                            <input type="file" multiple ref={galleryInputRef} className="hidden" onChange={e => handleFileChange('gallery', e.target.files)} />
                            <Button type="button" size="sm" onClick={() => galleryInputRef.current?.click()} className="bg-primary/10 text-primary hover:bg-primary/20 gap-2 h-8">
                                <UploadCloud size={14} /> Add Work
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {files.gallery.map((f, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary group">
                                    {f.type.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-foreground/10"><Video size={20} className="text-muted-foreground" /></div>
                                    )}
                                    <button type="button" onClick={() => setFiles(prev => ({...prev, gallery: prev.gallery.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={12} /></button>
                                </div>
                            ))}
                            {files.gallery.length === 0 && (
                                <div className="col-span-3 text-center py-8 opacity-30 bg-secondary/50 rounded-xl border border-dashed border-border">
                                    <ImageIcon className="mx-auto mb-2" size={24} />
                                    <p className="text-[10px] uppercase tracking-widest font-bold font-sans">No Portfolio yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Content */}
            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg space-y-6">
                <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-6">
                    <CheckCircle2 size={24} className="text-primary"/> 3. Profile Details
                </h3>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Professional Bio</label>
                    <textarea required value={form.bio} onChange={e => update('bio', e.target.value)} className="w-full h-32 px-4 py-3 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm leading-relaxed" placeholder="Describe the artistry, experience..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget Starting From</label>
                        <input required value={form.priceRange} onChange={e => update('priceRange', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" placeholder="₹ 30k onwards" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City (ID)</label>
                        <select required value={form.cityId} onChange={e => update('cityId', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm">
                            <option value="">Select City</option>
                            {metadata?.cities?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area</label>
                        <input value={form.area} onChange={e => update('area', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="Your area" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Category</label>
                        <select required value={form.categoryId} onChange={e => update('categoryId', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm">
                            <option value="">Choose category</option>
                            {metadata?.categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

            </section>

            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genres & Styles</label>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {metadata?.genres?.map((g: any) => (
                            <button type="button" key={g.id} onClick={() => toggleGenre(g.id, 'genreIds')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.genreIds.includes(g.id) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Languages</label>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {metadata?.languages?.map((l: string) => (
                            <button type="button" key={l} onClick={() => toggleGenre(l, 'languages')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.languages.includes(l) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Event Categories</label>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {metadata?.eventTypes?.map((e: string) => (
                            <button type="button" key={e} onClick={() => toggleGenre(e, 'eventCategories')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.eventCategories.includes(e) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border">
                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">Travel Nationwide</span>
                    <button type="button" onClick={() => update('travelNationwide', !form.travelNationwide)} className={`w-14 h-7 rounded-full transition-all ${form.travelNationwide ? 'bg-primary' : 'bg-border/50'}`}>
                        <div className={`w-6 h-6 rounded-full bg-card shadow-sm transition-transform ${form.travelNationwide ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
            </section>

            {/* Event & Budget Chart */}
            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-2xl flex items-center gap-2">
                        <CheckCircle2 size={24} className="text-primary"/> 4. Event & Budget Chart
                    </h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => update('budgetChart', [...form.budgetChart, { eventType: '', budgetRange: '10001-20000', price: 0 }])}
                        className="h-9 px-4 border-primary/50 text-primary hover:bg-primary/5 rounded-xl font-bold"
                    >
                        <Plus size={16} className="mr-2" /> Add Event
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {form.budgetChart.map((item: any, index: number) => (
                        <div key={index} className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4 relative">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Event Type</label>
                                    <div className="flex gap-3">
                                        <input
                                            value={item.eventType}
                                            onChange={e => {
                                                const newChart = [...form.budgetChart];
                                                newChart[index].eventType = e.target.value;
                                                update('budgetChart', newChart);
                                            }}
                                            className="flex-1 h-11 px-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                                            placeholder="Wedding, Corporate, Concert..."
                                        />
                                        {form.budgetChart.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => update('budgetChart', form.budgetChart.filter((_: any, i: number) => i !== index))}
                                                className="w-11 h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Budget Range</label>
                                    <select
                                        value={item.budgetRange}
                                        onChange={e => {
                                            const newChart = [...form.budgetChart];
                                            newChart[index].budgetRange = e.target.value;
                                            update('budgetChart', newChart);
                                        }}
                                        className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm font-medium"
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={e => {
                                            const newChart = [...form.budgetChart];
                                            newChart[index].price = parseInt(e.target.value) || 0;
                                            update('budgetChart', newChart);
                                        }}
                                        className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm font-bold"
                                        placeholder="Enter price"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Links */}
            <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-6">
                    5. Online Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['instagram', 'youtube', 'facebook', 'website'].map(s => (
                        <div key={s} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s}</label>
                            <input value={(form as any)[s]} onChange={e => update(s, e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-xs" placeholder={`${s} url`} />
                        </div>
                    ))}
                </div>
            </section>

            <Button type="submit" disabled={loading} className="w-full rounded-2xl h-16 text-xl font-black shadow-xl shadow-primary/20 tracking-wide uppercase">
                {loading ? 'Creating Artist...' : 'Create Artist Profile'}
            </Button>
        </form>
    );
}
