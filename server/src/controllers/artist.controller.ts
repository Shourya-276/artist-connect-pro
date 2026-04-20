import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getArtists = async (req: Request, res: Response) => {
  try {
    const { category, city, genre, search } = req.query;

    const where: any = {};
    
    if (category) where.category = { name: category as string };
    if (city) where.city = { name: city as string };
    if (genre) where.genres = { some: { name: genre as string } };
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { bio: { contains: search as string } },
      ];
    }

    const artists = await prisma.artistProfile.findMany({
      where,
      include: {
        category: true,
        city: true,
        genres: true,
        stats: true,
        media: true,
        user: {
          select: {
            email: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(artists);
  } catch (error: any) {
    console.error('❌ GetArtists Error:', error);
    res.status(500).json({ message: 'Failed to fetch artists', error: error.message });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const artist = await prisma.artistProfile.findUnique({
      where: { id },
      include: {
        category: true,
        city: true,
        genres: true,
        stats: true,
        media: true,
        reviews: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (error: any) {
    console.error('❌ GetArtistById Error:', error);
    res.status(500).json({ message: 'Failed to fetch artist', error: error.message });
  }
};

export const getArtistProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        let profile = await prisma.artistProfile.findUnique({
            where: { userId },
            include: {
                category: true,
                city: true,
                genres: true,
                stats: true,
                media: true,
            },
        });

        // Auto-create for legacy accounts or failed authentications
        if (!profile && req.user.role === 'ARTIST') {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user) {
                profile = await prisma.artistProfile.create({
                    data: {
                        userId,
                        name: 'New Artist',
                        profileImage: `https://ui-avatars.com/api/?name=Artist&background=random`,
                    },
                    include: {
                        category: true,
                        city: true,
                        genres: true,
                        stats: true,
                        media: true,
                    }
                });
            }
        }

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error: any) {
        console.error('❌ GetArtistProfile Error:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
};

export const updateArtistProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { bio, priceRange, categoryId, cityId, genreIds, budgetChart, travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website } = req.body;

        const updatedProfile = await prisma.artistProfile.upsert({
            where: { userId },
            update: {
                bio,
                priceRange,
                budgetChart,
                travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                city: cityId ? { connect: { id: cityId } } : undefined,
                genres: genreIds ? { set: genreIds.map((id: string) => ({ id })) } : undefined,
            },
            create: {
                user: { connect: { id: userId } },
                name: 'Artist',
                bio,
                priceRange,
                budgetChart,
                travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website,
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                city: cityId ? { connect: { id: cityId } } : undefined,
                genres: genreIds ? { connect: genreIds.map((id: string) => ({ id })) } : undefined,
            }
        });

        res.status(200).json(updatedProfile);
    } catch (error: any) {
        console.error('❌ UpdateArtistProfile Error:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};

export const updateArtistFlags = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { isTrending, isTopSeller } = req.body;

        const updatedProfile = await prisma.artistProfile.update({
            where: { id },
            data: {
                ...(isTrending !== undefined && { isTrending }),
                ...(isTopSeller !== undefined && { isTopSeller }),
            },
        });

        res.status(200).json(updatedProfile);
    } catch (error: any) {
        console.error('❌ UpdateArtistFlags Error:', error);
        res.status(500).json({ message: 'Failed to update artist flags', error: error.message });
    }
};

export const deleteArtist = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        
        const artist = await prisma.artistProfile.findUnique({ where: { id } });
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        
        // Deleting the user will automatically cascade and delete the ArtistProfile and Media
        await prisma.user.delete({ where: { id: artist.userId } });
        
        res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete artist', error: error.message });
    }
};
