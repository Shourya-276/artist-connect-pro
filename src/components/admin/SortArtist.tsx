import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SortArtist() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');

    const { data: artists = [], isLoading } = useQuery({
        queryKey: ['admin-artists-list'],
        queryFn: () => apiFetch('/api/artists')
    });

    const toggleFlags = useMutation({
        mutationFn: ({ id, flags }: { id: string, flags: { isTrending?: boolean, isTopSeller?: boolean } }) => 
            apiFetch(`/api/artists/${id}/flags`, {
                method: 'PUT',
                body: JSON.stringify(flags)
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-artists-list'] });
            toast.success('Artist flags updated!');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to update flags');
        }
    });

    const deleteArtist = useMutation({
        mutationFn: (id: string) => apiFetch(`/api/artists/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-artists-list'] });
            toast.success('Artist deleted successfully!');
        },
        onError: (err: any) => {
            toast.error(err.message || 'Failed to delete artist');
        }
    });

    const filteredArtists = artists.filter((a: any) => 
        a.name?.toLowerCase().includes(search.toLowerCase()) || 
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading artists...</div>;

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search artists..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Total: {filteredArtists.length} artists
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="text-left p-4 font-medium text-muted-foreground">Artist Details</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Trending This Week</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Top Seller</th>
                            <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArtists.map((artist: any) => (
                            <tr key={artist.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random`} 
                                            alt={artist.name} 
                                            className="w-10 h-10 rounded-full object-cover border border-border"
                                        />
                                        <div>
                                            <p className="font-semibold text-foreground">{artist.name}</p>
                                            <p className="text-xs text-muted-foreground">{artist.category?.name || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <Switch 
                                        checked={artist.isTrending || false} 
                                        onCheckedChange={(checked) => toggleFlags.mutate({ id: artist.id, flags: { isTrending: checked } })}
                                        disabled={toggleFlags.isPending}
                                    />
                                </td>
                                <td className="p-4 text-center">
                                    <Switch 
                                        checked={artist.isTopSeller || false} 
                                        onCheckedChange={(checked) => toggleFlags.mutate({ id: artist.id, flags: { isTopSeller: checked } })}
                                        disabled={toggleFlags.isPending}
                                    />
                                </td>
                                <td className="p-4 text-center">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            if(window.confirm('Are you sure you want to permanently delete this artist (and all media)?')) {
                                                deleteArtist.mutate(artist.id);
                                            }
                                        }}
                                        disabled={deleteArtist.isPending}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {filteredArtists.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No artists found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
