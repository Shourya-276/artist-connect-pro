import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const lead = await prisma.lead.create({
      data: { name, email, message },
    });

    res.status(201).json({ message: 'Lead captured successfully', lead });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(leads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
