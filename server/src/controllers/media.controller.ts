import { Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import prisma from '../config/db.js';

/**
 * Handle Single or Multiple file uploads (Gallery)
 */
export const uploadMedia = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const artist = await prisma.artistProfile.findUnique({ where: { userId } });
        if (!artist) return res.status(404).json({ message: 'Artist not found' });

        const uploadPromises = files.map(async (file) => {
            const url = await uploadToCloudinary(file.buffer, 'gallery') as string;
            const type = file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
            return prisma.media.create({
                data: { url, type, artistProfileId: artist.id },
            });
        });

        const results = await Promise.all(uploadPromises);
        res.status(200).json({ message: 'Gallery updated', media: results });
    } catch (error: any) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

/**
 * Upload Profile Image specifically
 */
export const uploadProfileImage = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const file = req.file as Express.Multer.File;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const url = await uploadToCloudinary(file.buffer, 'profile-pics') as string;
        
        await prisma.artistProfile.update({
            where: { userId },
            data: { profileImage: url }
        });

        res.status(200).json({ message: 'Profile picture updated', url });
    } catch (error: any) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

/**
 * Upload Cover Image specifically
 */
export const uploadCoverImage = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const file = req.file as Express.Multer.File;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const url = await uploadToCloudinary(file.buffer, 'cover-images') as string;
        
        await prisma.artistProfile.update({
            where: { userId },
            data: { coverImage: url }
        });

        res.status(200).json({ message: 'Cover image updated', url });
    } catch (error: any) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

export const deleteMedia = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const media = await prisma.media.findUnique({
            where: { id },
            include: { artistProfile: true },
        });

        if (!media || media.artistProfile.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await prisma.media.delete({ where: { id } });
        res.status(200).json({ message: 'Media deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};
