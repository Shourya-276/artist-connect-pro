import { Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import prisma from '../config/db.js';

/**
 * Handle Single or Multiple file uploads (Gallery)
 */
export const uploadMedia = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const targetArtistId = req.body.artistId;
        const files = (req.files ? req.files : (req.file ? [req.file] : [])) as Express.Multer.File[];

        if (files.length === 0) {
            return res.status(400).json({ 
                message: 'No files uploaded or field name mismatch. Expected "files" for multiple or "file" for single.',
                debug: { hasFiles: !!req.files, hasFile: !!req.file, body: req.body }
            });
        }

        let artist;
        if (req.user.role === 'ADMIN' && targetArtistId) {
            artist = await prisma.artistProfile.findUnique({ where: { id: targetArtistId } });
        } else {
            artist = await prisma.artistProfile.findUnique({ where: { userId } });
        }
        
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

export const uploadProfileImage = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const targetArtistId = req.body.artistId;
        const file = req.file as Express.Multer.File;
        if (!file) return res.status(400).json({ 
            message: 'No file uploaded. Expected field: "file"', 
            debug: { body: req.body, hasFiles: !!req.files } 
        });

        const url = await uploadToCloudinary(file.buffer, 'profile-pics') as string;
        
        if (req.user.role === 'ADMIN' && targetArtistId) {
            await prisma.artistProfile.update({
                where: { id: targetArtistId },
                data: { profileImage: url }
            });
        } else {
            await prisma.artistProfile.update({
                where: { userId },
                data: { profileImage: url }
            });
        }

        res.status(200).json({ message: 'Profile picture updated', url });
    } catch (error: any) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

export const uploadCoverImage = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const targetArtistId = req.body.artistId;
        const file = req.file as Express.Multer.File;
        if (!file) return res.status(400).json({ 
            message: 'No file uploaded. Expected field: "file"', 
            debug: { body: req.body, hasFiles: !!req.files } 
        });

        const url = await uploadToCloudinary(file.buffer, 'cover-images') as string;
        
        if (req.user.role === 'ADMIN' && targetArtistId) {
            await prisma.artistProfile.update({
                where: { id: targetArtistId },
                data: { coverImage: url }
            });
        } else {
            await prisma.artistProfile.update({
                where: { userId },
                data: { coverImage: url }
            });
        }

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

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        const isOwner = media.artistProfile.userId === userId;
        const isAdmin = req.user.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await prisma.media.delete({ where: { id } });
        res.status(200).json({ message: 'Media deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};
