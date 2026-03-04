import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useShortlist = (artistId: string, artistName: string) => {
    const [isShortlisted, setIsShortlisted] = useState(false);

    const checkStatus = useCallback(() => {
        const shortlisted = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
        setIsShortlisted(shortlisted.includes(artistId));
    }, [artistId]);

    useEffect(() => {
        checkStatus();
        // Listen for changes from other components
        window.addEventListener('storage', checkStatus);
        return () => window.removeEventListener('storage', checkStatus);
    }, [checkStatus]);

    const toggleShortlist = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const shortlisted = JSON.parse(localStorage.getItem('shortlistedArtists') || '[]');
        let newShortlisted;

        if (isShortlisted) {
            newShortlisted = shortlisted.filter((id: string) => id !== artistId);
            toast.info(`Removed ${artistName} from shortlist`);
        } else {
            newShortlisted = [...shortlisted, artistId];
            toast.success(`Added ${artistName} to shortlist`);
        }

        localStorage.setItem('shortlistedArtists', JSON.stringify(newShortlisted));
        setIsShortlisted(!isShortlisted);
        window.dispatchEvent(new Event('storage'));
    };

    return { isShortlisted, toggleShortlist };
};
