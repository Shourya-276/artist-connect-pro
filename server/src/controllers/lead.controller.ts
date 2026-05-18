import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      } as any,
    });

    console.log('✅ Lead created:', lead.id);
    return res.status(201).json({ message: 'Lead captured successfully', lead });
  } catch (error: any) {
    console.error('❌ CreateLead Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAllLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(leads);
  } catch (error: any) {
    console.error('❌ GetAllLeads Error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
