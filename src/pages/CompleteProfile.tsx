import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Image as ImageIcon, Video, Trash2, UploadCloud, Camera, LayoutPanelTop, CheckCircle2, Plus } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface Genre {
    id: string;
    name: string;
}

interface Media {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
}

interface ArtistProfile {
    bio?: string;
    priceRange?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
    categoryId?: string;
    cityId?: string;
    genres?: Genre[];
    coverImage?: string;
    profileImage?: string;
    name?: string;
    media?: Media[];
    budgetChart?: any;
    phone?: string;
    gender?: string;
    area?: string;
    languages?: string[];
    eventCategories?: string[];
    facebook?: string;
    travelNationwide?: boolean;
}

interface Metadata {
    categories: Category[];
    genres: Genre[];
    languages: string[];
    eventTypes: string[];
}

export default function CompleteProfile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState<string | null>(null);
    const [form, setForm] = useState({
        bio: '',
        priceRange: '',
        instagram: '',
        youtube: '',
        website: '',
        categoryId: '',
        cityId: '',
        genreIds: [] as string[],
        phone: '',
        gender: '',
        area: '',
        facebook: '',
        languages: [] as string[],
        eventCategories: [] as string[],
        travelNationwide: false,
        budgetChart: [
            { eventType: '', budgetRange: '10001-20000', price: 0 },
        ],
    });

    // Fetch Metadata
    const { data: metadata } = useQuery<Metadata>({ 
        queryKey: ['metadata'], 
        queryFn: () => apiFetch('/api/metadata') 
    });

    // Fetch Current Profile
    const { data: profile } = useQuery<ArtistProfile>({
        queryKey: ['artist-profile'],
        queryFn: () => apiFetch('/api/artists/me'),
    });

    useEffect(() => {
        if (profile) {
            setForm({
                bio: profile.bio || '',
                priceRange: profile.priceRange || '',
                instagram: profile.instagram || '',
                youtube: profile.youtube || '',
                website: profile.website || '',
                categoryId: profile.categoryId || '',
                cityId: profile.cityId || '',
                genreIds: profile.genres?.map((g) => g.id) || [],
                phone: profile.phone || '',
                gender: profile.gender || '',
                area: profile.area || '',
                facebook: profile.facebook || '',
                languages: Array.isArray(profile.languages) ? profile.languages : [],
                eventCategories: Array.isArray(profile.eventCategories) ? profile.eventCategories : [],
                travelNationwide: !!profile.travelNationwide,
                budgetChart: Array.isArray(profile.budgetChart) && profile.budgetChart.length > 0 
                    ? profile.budgetChart 
                    : [{ eventType: '', budgetRange: '10001-20000', price: 0 }],
            });
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: (data: any) => apiFetch('/api/artists/me', { method: 'PUT', body: JSON.stringify(data) }),
        onSuccess: () => { 
            toast.success('Profile saved!'); 
            queryClient.invalidateQueries({ queryKey: ['artist-profile'] }); 
            navigate('/artist/dashboard'); 
        },
    });

    const uploadMediaAction = async (endpoint: string, files: FileList | File, multiple = false) => {
        setUploading(endpoint);
        const formData = new FormData();
        if (multiple) { Array.from(files as FileList).forEach(f => formData.append('files', f)); } 
        else { formData.append('file', files as File); }
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/media/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            toast.success('Media updated!');
            queryClient.invalidateQueries({ queryKey: ['artist-profile'] });
        } catch (e: any) { toast.error(e.message); }
        setUploading(null);
    };

    const deleteMedia = useMutation({
        mutationFn: (id: string) => apiFetch(`/api/media/${id}`, { method: 'DELETE' }),
        onSuccess: () => { 
            toast.success('Removed!'); 
            queryClient.invalidateQueries({ queryKey: ['artist-profile'] }); 
        }
    });

    const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

    return (
        <div className="min-h-screen pt-20 bg-background pb-20">
            <div className="container-wide max-w-5xl py-12">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="font-heading font-black text-4xl text-foreground mb-3 flex items-center gap-3">
                                Build Your Identity <span className="text-primary"><CheckCircle2 size={32} /></span>
                            </h1>
                            <p className="text-muted-foreground text-lg">Make your profile shine to attract premium clients.</p>
                        </div>
                        <Button variant="ghost" className="hover:bg-secondary" onClick={() => navigate('/artist/dashboard')}>Save for later</Button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* Visuals Sidebar */}
                        <div className="xl:col-span-5 space-y-8">
                            {/* Profile Header Visualizer */}
                            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl relative">
                                {/* Cover Image Upload */}
                                <div className="h-48 w-full bg-secondary relative group overflow-hidden">
                                    {profile?.coverImage ? (
                                        <img src={profile.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                                            <LayoutPanelTop size={48} />
                                            <span className="text-[10px] font-bold tracking-widest mt-2">NO COVER IMAGE</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && uploadMediaAction('cover-wide', e.target.files[0])} />
                                        <Button variant="secondary" className="gap-2 pointer-events-none">
                                            <Camera size={16} /> {uploading === 'cover-wide' ? 'Updating...' : 'Update Cover'}
                                        </Button>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-full font-bold">1200 x 400 recommended</div>
                                </div>

                                {/* Profile Pic Upload */}
                                <div className="absolute top-32 left-8 border-4 border-card rounded-full overflow-hidden w-32 h-32 bg-secondary group">
                                    {profile?.profileImage ? (
                                        <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ImageIcon size={40} /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && uploadMediaAction('profile-pill', e.target.files[0])} />
                                        <Camera className="text-white" size={32} />
                                    </div>
                                </div>

                                <div className="pt-20 px-8 pb-8">
                                    <h2 className="font-heading font-bold text-2xl mb-1">{profile?.name}</h2>
                                    <p className="text-sm text-primary font-medium">{metadata?.categories?.find((c) => c.id === form.categoryId)?.name || 'Uncategorized'}</p>
                                </div>
                            </div>

                            {/* Portfolio Gallery */}
                            <div className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-heading font-black text-xl">Portfolio Gallery</h3>
                                    <div className="relative">
                                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files && uploadMediaAction('upload', e.target.files, true)} />
                                        <Button size="sm" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-2">
                                            <UploadCloud size={16} /> {uploading === 'upload' ? 'Uploading...' : 'Add Work'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {profile?.media && profile.media.length > 0 ? profile.media.map((m) => (
                                        <div key={m.id} className="relative aspect-square group rounded-2xl overflow-hidden border border-border bg-secondary">
                                            {m.type === 'IMAGE' ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center flex-col gap-2 bg-foreground/10"><Video size={24} className="text-muted-foreground" /><span className="text-[10px] font-bold">VIDEO</span></div>}
                                            <button onClick={() => deleteMedia.mutate(m.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:scale-110"><Trash2 size={14} /></button>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 text-center py-10 opacity-30">
                                            <ImageIcon className="mx-auto mb-2" size={32} />
                                            <p className="text-xs uppercase tracking-widest font-bold font-sans">No Portfolio yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="xl:col-span-7 space-y-8">
                            <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} className="bg-card border border-border p-10 rounded-3xl shadow-xl space-y-10">
                                <section className="space-y-6">
                                    <h3 className="font-heading font-black text-2xl flex items-center gap-2">1. The Professional Bio <span className="h-1 w-12 bg-primary rounded-full"></span></h3>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About You</label>
                                        <textarea required value={form.bio} onChange={e => update('bio', e.target.value)} className="w-full h-40 px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm leading-relaxed" placeholder="Describe your artistry, experience, and the vibe you bring to events..." />
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="font-heading font-black text-2xl flex items-center gap-2">2. Pricing & Stats <span className="h-1 w-12 bg-primary rounded-full"></span></h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                                            <input value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gender</label>
                                            <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary border border-border outline-none text-sm">
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget Starting From</label>
                                            <input required value={form.priceRange} onChange={e => update('priceRange', e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" placeholder="₹ 30k onwards" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Category</label>
                                            <select required value={form.categoryId} onChange={e => update('categoryId', e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary border border-border outline-none text-sm">
                                                <option value="">Choose category</option>
                                                {metadata?.categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area</label>
                                        <input value={form.area} onChange={e => update('area', e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm" placeholder="e.g. Bandra, Andheri East..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genres & Styles</label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {metadata?.genres?.map((g) => (
                                                <button type="button" key={g.id} onClick={() => update('genreIds', form.genreIds.includes(g.id) ? form.genreIds.filter(i => i !== g.id) : [...form.genreIds, g.id])} className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.genreIds.includes(g.id) ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                                    {g.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Languages</label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {metadata?.languages?.map((l) => (
                                                <button type="button" key={l} onClick={() => update('languages', form.languages.includes(l) ? form.languages.filter(i => i !== l) : [...form.languages, l])} className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.languages.includes(l) ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Event Categories</label>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {metadata?.eventTypes?.map((e) => (
                                                <button type="button" key={e} onClick={() => update('eventCategories', form.eventCategories.includes(e) ? form.eventCategories.filter(i => i !== e) : [...form.eventCategories, e])} className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.eventCategories.includes(e) ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/50 border border-border">
                                        <div>
                                            <span className="text-sm font-bold text-foreground uppercase tracking-widest">Travel Nationwide</span>
                                            <p className="text-[10px] text-muted-foreground font-medium mt-1">Check this if you are willing to perform outside your city</p>
                                        </div>
                                        <button type="button" onClick={() => update('travelNationwide', !form.travelNationwide)} className={`w-14 h-7 rounded-full transition-all ${form.travelNationwide ? 'bg-primary' : 'bg-border/50'}`}>
                                            <div className={`w-6 h-6 rounded-full bg-card shadow-sm transition-transform ${form.travelNationwide ? 'translate-x-7' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="font-heading font-black text-2xl flex items-center gap-2">3. Event & Budget Chart <span className="h-1 w-12 bg-primary rounded-full"></span></h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground font-medium">Define your pricing for different event types</p>
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
                                            <div key={index} className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-4 relative group">
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
                                                                className="flex-1 h-12 px-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                                                                placeholder="Wedding, Corporate, Concert..."
                                                            />
                                                            {form.budgetChart.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    onClick={() => update('budgetChart', form.budgetChart.filter((_: any, i: number) => i !== index))}
                                                                    className="w-12 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                                                            className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm font-medium"
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
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Your Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={e => {
                                                                const newChart = [...form.budgetChart];
                                                                newChart[index].price = parseInt(e.target.value) || 0;
                                                                update('budgetChart', newChart);
                                                            }}
                                                            className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm font-bold"
                                                            placeholder="Enter price"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="font-heading font-black text-2xl flex items-center gap-2">4. Online Presence <span className="h-1 w-12 bg-primary rounded-full"></span></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {['instagram', 'youtube', 'facebook', 'website'].map(s => (
                                            <div key={s} className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s}</label>
                                                <input value={(form as any)[s]} onChange={e => update(s, e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-xs" placeholder={`${s} handle/url`} />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="pt-8 w-full">
                                    <Button type="submit" disabled={mutation.isPending} className="w-full rounded-2xl h-16 text-xl font-black shadow-xl shadow-primary/20 tracking-wide uppercase">
                                        <CheckCircle2 className="mr-3" size={24} /> {mutation.isPending ? 'Processing...' : 'Publish My Profile'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
