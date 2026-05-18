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
      where.name = { contains: search as string };
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
        user: {
          select: {
            email: true,
            id: true,
          }
        },
        reviews: {
          where: { isApproved: true },
          include: {
            client: true,
          },
          orderBy: {
            createdAt: 'desc',
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
        const { bio, priceRange, categoryId, cityId, genreIds, budgetChart, travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website, reviews } = req.body;

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

        if (reviews && Array.isArray(reviews)) {
            await syncAdminReviews(updatedProfile.id, reviews);
        }

        // Fetch final updated profile with relations
        const finalProfile = await prisma.artistProfile.findUnique({
            where: { id: updatedProfile.id },
            include: {
                category: true,
                city: true,
                genres: true,
                stats: true,
                media: true,
                user: {
                    select: {
                        email: true,
                        id: true,
                    }
                },
                reviews: {
                    include: {
                        client: true,
                    }
                }
            }
        });

        res.status(200).json(finalProfile);
    } catch (error: any) {
        console.error('❌ UpdateArtistProfile Error:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};

export const updateArtist = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { name, bio, priceRange, categoryId, cityId, genreIds, budgetChart, travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website, reviews } = req.body;

        const updatedProfile = await prisma.artistProfile.update({
            where: { id },
            data: {
                name,
                bio,
                priceRange,
                budgetChart,
                travelNationwide, phone, gender, area, languages, instruments, eventCategories, facebook, instagram, youtube, website,
                category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
                city: cityId ? { connect: { id: cityId } } : { disconnect: true },
                genres: genreIds ? { set: genreIds.map((gid: string) => ({ id: gid })) } : undefined,
            }
        });

        if (reviews && Array.isArray(reviews)) {
            await syncAdminReviews(id, reviews);
        }

        // Fetch final updated profile with relations
        const finalProfile = await prisma.artistProfile.findUnique({
            where: { id },
            include: {
                category: true,
                city: true,
                genres: true,
                stats: true,
                media: true,
                user: {
                    select: {
                        email: true,
                        id: true,
                    }
                },
                reviews: {
                    include: {
                        client: true,
                    }
                }
            }
        });

        res.status(200).json(finalProfile);
    } catch (error: any) {
        console.error('❌ UpdateArtist Error:', error);
        res.status(500).json({ message: 'Failed to update artist', error: error.message });
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

/**
 * Synchronizes admin-generated reviews (where clientId is null) for an artist profile
 */
const syncAdminReviews = async (artistId: string, reviewsInput: any[]) => {
    // 1. Fetch all admin reviews currently in database (clientId: null)
    const existingAdminReviews = await prisma.review.findMany({
        where: { artistId, clientId: null as any }
    });

    const existingIds = existingAdminReviews.map(r => r.id);
    const inputIds = reviewsInput.filter(r => r.id).map(r => r.id);

    // 2. Identify reviews to delete (present in DB with clientId: null, but not in input)
    const idsToDelete = existingIds.filter(id => !inputIds.includes(id));
    if (idsToDelete.length > 0) {
        await prisma.review.deleteMany({
            where: { id: { in: idsToDelete } }
        });
    }

    // 3. Process each input review
    for (const review of reviewsInput) {
        if (review.id && existingIds.includes(review.id)) {
            // Update existing admin review
            await prisma.review.update({
                where: { id: review.id },
                data: {
                    reviewerName: review.reviewerName || 'Anonymous',
                    rating: Number(review.rating) || 5,
                    comment: review.comment || '',
                    isApproved: true
                } as any
            });
        } else {
            // Create new admin review
            await prisma.review.create({
                data: {
                    artistId,
                    reviewerName: review.reviewerName || 'Anonymous',
                    rating: Number(review.rating) || 5,
                    comment: review.comment || '',
                    isApproved: true
                } as any
            });
        }
    }

    // 4. Recalculate average rating & total reviews
    const allReviews = await prisma.review.findMany({
        where: { artistId, isApproved: true },
        select: { rating: true }
    });

    const totalReviews = allReviews.length;
    const avgRating = totalReviews > 0 
        ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    await prisma.artistProfile.update({
        where: { id: artistId },
        data: {
            rating: avgRating,
            totalReviews
        }
    });
};

export const updateArtistAvailability = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { availability } = req.body;

        const updatedProfile = await prisma.artistProfile.update({
            where: { userId },
            data: {
                availability: availability || null,
            } as any,
        });

        res.status(200).json({ 
            message: 'Availability calendar updated successfully', 
            availability: (updatedProfile as any).availability 
        });
    } catch (error: any) {
        console.error('❌ UpdateArtistAvailability Error:', error);
        res.status(500).json({ message: 'Failed to update availability', error: error.message });
    }
};
