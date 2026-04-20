import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
    booking: any;
    onClose: () => void;
}

export default function ReviewModal({ booking, onClose }: ReviewModalProps) {
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const mutation = useMutation({
        mutationFn: (data: any) => apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            toast.success('Review submitted! Thank you.');
            queryClient.invalidateQueries({ queryKey: ['client-dashboard'] }); // Refresh bookings list
            onClose();
        },
        onError: (e: any) => toast.error(e.message)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return toast.error('Please select a rating');
        mutation.mutate({
            bookingId: booking.id,
            artistId: booking.artistId,
            rating,
            comment
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-card border border-border rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="font-heading font-black text-3xl mb-2">Event Complete! 🎉</h2>
                            <p className="text-muted-foreground">How was your experience with <span className="text-primary font-bold">{booking.artist?.name}</span>?</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Star Rating Section */}
                        <div className="flex flex-col items-center gap-4 py-6 bg-secondary/50 rounded-3xl border border-border/50">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHover(s)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-transform active:scale-95"
                                    >
                                        <Star 
                                            size={40} 
                                            className={`${(hover || rating) >= s ? 'fill-primary text-primary' : 'text-muted-foreground/30'} transition-colors`}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="font-bold text-sm tracking-widest text-primary uppercase">
                                {rating === 5 ? 'Mind-Blowing' : rating === 4 ? 'Great Show' : rating === 3 ? 'Good Service' : rating >= 1 ? 'Needs Improvement' : 'Rate the artist'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Tell us more (Optional)</label>
                            <textarea 
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="w-full h-32 px-5 py-4 rounded-3xl bg-secondary border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="What did you love about the performance? Mention special moments..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button 
                                type="submit" 
                                disabled={mutation.isPending}
                                className="flex-1 rounded-2xl h-14 text-lg font-black tracking-wide uppercase shadow-lg shadow-primary/20"
                            >
                                {mutation.isPending ? 'Sending...' : 'Submit Review'}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
