import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { 
    CheckCircle2, Search, User, Mail, Phone, MapPin, 
    Camera, Image as ImageIcon, Video, Trash2, 
    UploadCloud, LayoutPanelTop, Plus, Save, X, ArrowLeft, Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function EditArtist() {
    const queryClient = useQueryClient();
    const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    // 1. Artist Selection State & Logic
    const { data: artists, isLoading: isLoadingArtists } = useQuery<any[]>({
        queryKey: ['admin-artists-search', searchQuery],
        queryFn: () => apiFetch(`/api/artists?search=${searchQuery}`),
        enabled: !selectedArtistId
    });

    // 2. Selected Artist Data
    const { data: artistProfile, isLoading: isLoadingProfile } = useQuery<any>({
        queryKey: ['artist-edit', selectedArtistId],
        queryFn: () => apiFetch(`/api/artists/${selectedArtistId}`),
        enabled: !!selectedArtistId
    });

    const [form, setForm] = useState<any>(null);
    const [files, setFiles] = useState<any>({
        profile: null,
        cover: null,
        gallery: []
    });
    /**
     * Safely parse a Prisma Json field into an array.
     * Handles: null, undefined, actual arrays, and stringified JSON.
     */
    const parseJsonArray = (val: any, fallback: any[] = []): any[] => {
        if (!val) return fallback;
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : fallback; } 
            catch { return fallback; }
        }
        return fallback;
    };

    useEffect(() => {
        if (artistProfile) {
            const langs = parseJsonArray(artistProfile.languages);
            const evtCats = parseJsonArray(artistProfile.eventCategories);
            const chart = parseJsonArray(artistProfile.budgetChart, [{ eventType: '', budgetRange: '10001-20000', price: 0 }]);

            setForm({
                fullName: artistProfile.name || '',
                email: artistProfile.user?.email || '',
                bio: artistProfile.bio || '',
                priceRange: artistProfile.priceRange || '',
                instagram: artistProfile.instagram || '',
                youtube: artistProfile.youtube || '',
                website: artistProfile.website || '',
                facebook: artistProfile.facebook || '',
                categoryId: artistProfile.categoryId || '',
                cityId: artistProfile.cityId || '',
                phone: artistProfile.phone || '',
                gender: artistProfile.gender || '',
                area: artistProfile.area || '',
                languages: langs,
                genreIds: artistProfile.genres?.map((g: any) => g.id) || [],
                eventCategories: evtCats,
                travelNationwide: !!artistProfile.travelNationwide,
                budgetChart: chart.length > 0 ? chart : [{ eventType: '', budgetRange: '10001-20000', price: 0 }],
            });
            setIsDirty(false);
        }
    }, [artistProfile]);

    const updateField = (field: string, value: any) => {
        setForm((f: any) => ({ ...f, [field]: value }));
        setIsDirty(true);
    };

    const toggleArrayItem = (id: string, field: string) => {
        const arr = form[field] as string[];
        updateField(field, arr.includes(id) ? arr.filter(item => item !== id) : [...arr, id]);
    };

    // Metadata for dropdowns
    const { data: metadata } = useQuery<any>({ 
        queryKey: ['metadata'], 
        queryFn: () => apiFetch('/api/metadata') 
    });

    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (endpoint: string, file: File | FileList, isMultiple = false) => {
        setUploading(endpoint);
        const formData = new FormData();
        formData.append('artistId', selectedArtistId!);
        
        if (isMultiple) {
            Array.from(file as FileList).forEach(f => formData.append('files', f));
        } else {
            formData.append('file', file as File);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://15.206.66.202:5001'}/api/media/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || 'Upload failed');
            }
            
            toast.success('Media updated successfully');
            queryClient.invalidateQueries({ queryKey: ['artist-edit', selectedArtistId] });
        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(error.message);
        } finally {
            setUploading(null);
        }
    };

    const handleDeleteMedia = async (mediaId: string) => {
        if (!confirm('Are you sure you want to delete this media?')) return;
        
        try {
            await apiFetch(`/api/media/${mediaId}`, { method: 'DELETE' });
            toast.success('Media deleted');
            queryClient.invalidateQueries({ queryKey: ['artist-edit', selectedArtistId] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch(`/api/artists/${selectedArtistId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...form,
                    name: form.fullName // Aligning with backend model
                })
            });
            toast.success('Artist profile updated successfully');
            setIsDirty(false);
            queryClient.invalidateQueries({ queryKey: ['admin-artists-search'] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!selectedArtistId) {
        return (
            <div className="space-y-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search artists by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary">
                            <tr>
                                <th className="text-left p-4 font-medium text-muted-foreground">Artist</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                                <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingArtists ? (
                                <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">Searching artists...</td></tr>
                            ) : artists?.map(a => (
                                <tr key={a.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden">
                                                {a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover" /> : a.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-card-foreground">{a.name}</p>
                                                <p className="text-xs text-muted-foreground lowercase">{a.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{a.category?.name || 'Uncategorized'}</td>
                                    <td className="p-4 text-muted-foreground">{a.city?.name || 'Remote'}</td>
                                    <td className="p-4 text-right">
                                        <Button 
                                            size="sm" 
                                            onClick={() => setSelectedArtistId(a.id)}
                                            className="rounded-lg font-bold"
                                        >
                                            Edit Profile
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoadingArtists && artists?.length === 0 && (
                                <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">No artists found matching "{searchQuery}"</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (isLoadingProfile || !form) return <div className="p-12 text-center">Loading artist profile data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between sticky top-24 z-40 bg-background/80 backdrop-blur-md py-4 border-b border-border">
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        if (isDirty && !confirm('You have unsaved changes. Are you sure you want to go back?')) return;
                        setSelectedArtistId(null);
                    }}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={18} /> Back to Search
                </Button>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setSelectedArtistId(null)}
                        className="rounded-xl border-border"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        className={`rounded-xl gap-2 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 ${isDirty ? 'gradient-bg' : 'bg-muted text-muted-foreground'}`}
                        disabled={!isDirty}
                    >
                        <Save size={18} /> Save Changes
                    </Button>
                </div>
            </div>

            {isDirty && (
                <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl flex items-center gap-3 text-primary text-sm font-bold animate-pulse">
                    <CheckCircle2 size={16} /> You have unsaved modifications. Don't forget to save!
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-10">
                {/* 1. Account & Identity */}
                <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                    <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-8">
                        <User size={24} className="text-primary"/> 1. Account & Identity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                            <input 
                                required 
                                value={form.fullName} 
                                onChange={e => updateField('fullName', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" 
                            />
                        </div>
                        <div className="space-y-2 opacity-50 cursor-not-allowed">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address (Read-only)</label>
                            <input 
                                disabled
                                value={form.email} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-sm" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                            <input 
                                value={form.phone} 
                                onChange={e => updateField('phone', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gender</label>
                            <select 
                                value={form.gender} 
                                onChange={e => updateField('gender', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm font-bold"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 2. Media Management */}
                <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                    <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-8">
                        <Camera size={24} className="text-primary"/> 2. Media Management
                    </h3>

                    <div className="space-y-8">
                        {/* Hero Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Profile Image</label>
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-secondary group bg-secondary">
                                    {artistProfile.profileImage ? (
                                        <img src={artistProfile.profileImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><ImageIcon size={40} /></div>
                                    )}
                                    
                                    {/* Upload/Loading Overlay */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer ${uploading === 'profile-pill' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={() => uploading !== 'profile-pill' && profileInputRef.current?.click()}>
                                        {uploading === 'profile-pill' ? (
                                            <Loader2 className="text-white animate-spin" size={24} />
                                        ) : (
                                            <Camera className="text-white" size={24} />
                                        )}
                                    </div>

                                    <input 
                                        type="file" 
                                        ref={profileInputRef} 
                                        className="hidden" 
                                        onChange={e => e.target.files && handleFileUpload('profile-pill', e.target.files[0])} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Cover Banner</label>
                                <div className="relative h-32 rounded-2xl overflow-hidden border-2 border-dashed border-border group bg-secondary/30">
                                    {artistProfile.coverImage ? (
                                        <img src={artistProfile.coverImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><LayoutPanelTop size={32} /></div>
                                    )}

                                    {/* Upload/Loading Overlay */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer ${uploading === 'cover-wide' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={() => uploading !== 'cover-wide' && coverInputRef.current?.click()}>
                                        {uploading === 'cover-wide' ? (
                                            <Loader2 className="text-white animate-spin" size={24} />
                                        ) : (
                                            <Camera className="text-white" size={24} />
                                        )}
                                    </div>

                                    <input 
                                        type="file" 
                                        ref={coverInputRef} 
                                        className="hidden" 
                                        onChange={e => e.target.files && handleFileUpload('cover-wide', e.target.files[0])} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Gallery</label>
                                <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="outline"
                                    disabled={uploading === 'upload'}
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="rounded-xl gap-2 h-9 border-dashed border-primary/30 text-primary hover:bg-primary/5"
                                >
                                    {uploading === 'upload' ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={16} /> Add Media
                                        </>
                                    )}
                                </Button>
                                <input 
                                    type="file" 
                                    multiple 
                                    ref={galleryInputRef} 
                                    className="hidden" 
                                    onChange={e => e.target.files && handleFileUpload('upload', e.target.files, true)} 
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {artistProfile.media?.map((m: any) => (
                                    <div key={m.id} className="relative aspect-square group rounded-2xl overflow-hidden border border-border bg-secondary shadow-sm">
                                        {m.type === 'IMAGE' ? (
                                            <img src={m.url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-foreground/5">
                                                <Video size={24} className="text-muted-foreground" />
                                                <span className="text-[10px] font-bold opacity-50 uppercase">Video</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteMedia(m.id)}
                                                className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!artistProfile.media || artistProfile.media.length === 0) && (
                                    <div className="col-span-full py-12 text-center opacity-30 bg-secondary/50 rounded-2xl border border-dashed border-border">
                                        <ImageIcon className="mx-auto mb-2" size={32} />
                                        <p className="text-xs font-bold uppercase tracking-widest font-sans">No Portfolio Assets Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Professional Profile */}
                <section className="bg-card border border-border p-8 rounded-3xl shadow-lg space-y-8">
                    <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-2">
                        <CheckCircle2 size={24} className="text-primary"/> 3. Professional Profile
                    </h3>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Professional Bio</label>
                        <textarea 
                            required 
                            rows={6}
                            value={form.bio} 
                            onChange={e => updateField('bio', e.target.value)} 
                            className="w-full px-5 py-4 rounded-2xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm leading-relaxed font-medium" 
                            placeholder="Describe the artist's experience, style, and unique value..." 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starting Price (Display)</label>
                            <input 
                                required 
                                value={form.priceRange} 
                                onChange={e => updateField('priceRange', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" 
                                placeholder="e.g. ₹ 50,000 onwards"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Category</label>
                            <select 
                                required 
                                value={form.categoryId} 
                                onChange={e => updateField('categoryId', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm font-bold"
                            >
                                <option value="">Choose category</option>
                                {metadata?.categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary City</label>
                            <select 
                                required 
                                value={form.cityId} 
                                onChange={e => updateField('cityId', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border outline-none text-sm font-bold"
                            >
                                <option value="">Select city</option>
                                {metadata?.cities?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specific Area</label>
                            <input 
                                value={form.area} 
                                onChange={e => updateField('area', e.target.value)} 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-bold" 
                                placeholder="Bandra, Mumbai..."
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genres & Styles</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {metadata?.genres?.map((g: any) => (
                                    <button 
                                        type="button" 
                                        key={g.id} 
                                        onClick={() => toggleArrayItem(g.id, 'genreIds')} 
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.genreIds.includes(g.id) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Languages</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {metadata?.languages?.map((l: string) => (
                                    <button 
                                        type="button" 
                                        key={l} 
                                        onClick={() => toggleArrayItem(l, 'languages')} 
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.languages.includes(l) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Event Categories</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {metadata?.eventTypes?.map((et: string) => (
                                    <button 
                                        type="button" 
                                        key={et} 
                                        onClick={() => toggleArrayItem(et, 'eventCategories')} 
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${form.eventCategories.includes(et) ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}
                                    >
                                        {et}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/50 border border-border">
                            <div>
                                <span className="text-sm font-black text-foreground uppercase tracking-widest">Travel Nationwide</span>
                                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">Does this artist travel outside primary city?</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => updateField('travelNationwide', !form.travelNationwide)} 
                                className={`w-14 h-7 rounded-full transition-all ${form.travelNationwide ? 'bg-primary' : 'bg-border/50'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-card shadow-sm transition-transform ${form.travelNationwide ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 4. Pricing Chart */}
                <section className="bg-card border border-border p-8 rounded-3xl shadow-lg space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading font-black text-2xl flex items-center gap-2">
                            <Save size={24} className="text-primary"/> 4. Detailed Pricing Chart
                        </h3>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => updateField('budgetChart', [...form.budgetChart, { eventType: '', budgetRange: '10001-20000', price: 0 }])}
                            className="h-10 px-5 border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-bold gap-2"
                        >
                            <Plus size={18} /> Add Package
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        {form.budgetChart.map((item: any, index: number) => (
                            <div key={index} className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-5 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Event Type</label>
                                        <input
                                            value={item.eventType}
                                            onChange={e => {
                                                const newChart = [...form.budgetChart];
                                                newChart[index].eventType = e.target.value;
                                                updateField('budgetChart', newChart);
                                            }}
                                            className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm font-bold"
                                            placeholder="Wedding, Concert, Private Event..."
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Budget Tier</label>
                                        <select
                                            value={item.budgetRange}
                                            onChange={e => {
                                                const newChart = [...form.budgetChart];
                                                newChart[index].budgetRange = e.target.value;
                                                updateField('budgetChart', newChart);
                                            }}
                                            className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm font-bold"
                                        >
                                            <option value="0-5000">0 - 5000</option>
                                            <option value="5001-10000">5001 - 10000</option>
                                            <option value="10001-20000">10001 - 20000</option>
                                            <option value="20001-50000">20001 - 50000</option>
                                            <option value="50001-100000">50001 - 100000</option>
                                            <option value="100000+">100000+</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Exact Price (₹)</label>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={e => {
                                                const newChart = [...form.budgetChart];
                                                newChart[index].price = parseInt(e.target.value) || 0;
                                                updateField('budgetChart', newChart);
                                            }}
                                            className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                                        {form.budgetChart.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => updateField('budgetChart', form.budgetChart.filter((_: any, i: number) => i !== index))}
                                                className="w-11 h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Online Presence */}
                <section className="bg-card border border-border p-8 rounded-3xl shadow-lg">
                    <h3 className="font-heading font-black text-2xl flex items-center gap-2 mb-8">
                        5. Online Presence & Socials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['instagram', 'youtube', 'facebook', 'website'].map(s => (
                            <div key={s} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s}</label>
                                <input 
                                    value={form[s]} 
                                    onChange={e => updateField(s, e.target.value)} 
                                    className="w-full h-11 px-4 rounded-xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none text-xs font-bold" 
                                    placeholder={`${s} handle or link`} 
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </form>
        </div>
    );
}
