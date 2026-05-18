import { Response } from 'express';
import prisma from '../config/db.js';

/**
 * Submit a review for an artist
 */
export const submitReview = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { artistId, bookingId, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
        }

        // 1. Verify the client exists
        const client = await prisma.clientProfile.findUnique({ where: { userId } });
        if (!client) return res.status(404).json({ message: 'Client profile not found' });

        // 2. Verify the booking if bookingId is provided
        if (bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
            });

            if (!booking || booking.clientId !== client.id || booking.status !== 'COMPLETED') {
                return res.status(400).json({ message: 'You can only review completed events' });
            }

            if (booking.hasBeenReviewed) {
                return res.status(400).json({ message: 'You have already reviewed this event' });
            }

            // Update the booking flag
            await prisma.booking.update({
                where: { id: bookingId },
                data: { hasBeenReviewed: true },
            });
        }

        // 3. Create the review
        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment: comment || '',
                artistId,
                clientId: client.id,
                reviewerName: client.name,
                isApproved: true, // Auto-approve
            } as any,
        });

        // 4. Update Artist Profile Rating (Recalculate average)
        const allReviews = await prisma.review.findMany({
            where: { artistId, isApproved: true },
            select: { rating: true },
        });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = allReviews.length > 0 ? parseFloat((totalRating / allReviews.length).toFixed(1)) : Number(rating);

        await prisma.artistProfile.update({
            where: { id: artistId },
            data: {
                rating: avgRating,
                totalReviews: allReviews.length,
            },
        });

        res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error: any) {
        console.error('❌ Review Submission Error:', error);
        res.status(500).json({ message: 'Failed to submit review', error: error.message });
    }
};

/**
 * Get reviews for an artist
 */
export const getArtistReviews = async (req: Request | any, res: Response) => {
    try {
        const { artistId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { artistId, isApproved: true },
            include: { client: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};
