import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getMetadata = async (req: Request, res: Response) => {
  try {
    const [categories, genres, cities, testimonials] = await Promise.all([
      prisma.category.findMany(),
      prisma.genre.findMany(),
      prisma.city.findMany(),
      prisma.testimonial.findMany(),
    ]);

    res.status(200).json({
      categories,
      genres,
      cities,
      testimonials,
      languages: ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam'],
      eventTypes: ['Corporate', 'Wedding', 'Private Event', 'House Party', 'Cafe & Lounges', 'Hotels & Villas', 'College Fest', 'Club Night', 'Virtual Event']
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch metadata', error: error.message });
  }
};
