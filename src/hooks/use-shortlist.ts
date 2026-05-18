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

            // Add local notification
            const notifications = JSON.parse(localStorage.getItem('clientNotifications') || '[]');
            const newNotif = {
                id: Math.random().toString(36).substring(2, 9),
                title: 'Artist Removed',
                message: `You removed ${artistName} from your shortlist.`,
                createdAt: new Date().toISOString(),
                type: 'info',
                read: false
            };
            localStorage.setItem('clientNotifications', JSON.stringify([newNotif, ...notifications]));
        } else {
            newShortlisted = [...shortlisted, artistId];
            toast.success(`Added ${artistName} to shortlist`);

            // Add local notification
            const notifications = JSON.parse(localStorage.getItem('clientNotifications') || '[]');
            const newNotif = {
                id: Math.random().toString(36).substring(2, 9),
                title: 'Artist Shortlisted',
                message: `You added ${artistName} to your shortlist.`,
                createdAt: new Date().toISOString(),
                type: 'success',
                read: false
            };
            localStorage.setItem('clientNotifications', JSON.stringify([newNotif, ...notifications]));
        }

        localStorage.setItem('shortlistedArtists', JSON.stringify(newShortlisted));
        setIsShortlisted(!isShortlisted);
        window.dispatchEvent(new Event('storage'));
    };

    return { isShortlisted, toggleShortlist };
};
