import { Response } from 'express';
import prisma from '../config/db.js';

/**
 * Get the current client profile and bookings
 */
export const getClientProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const profile = await prisma.clientProfile.findUnique({
            where: { userId },
            include: {
                bookings: {
                    include: {
                        artist: {
                            select: { id: true, name: true, profileImage: true, category: { select: { name: true } } }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                enquiries: {
                    include: {
                        artist: { select: { name: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!profile) return res.status(404).json({ message: 'Client not found' });

        res.status(200).json(profile);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
    }
};
