import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = (role || 'CLIENT').toUpperCase();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: userRole as any,
        // Automatically create a profile based on role
        ...(userRole === 'ARTIST' ? {
            artistProfile: {
                create: {
                    name,
                    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                }
            }
        } : {
            clientProfile: {
                create: {
                    name,
                    phone: phone || '',
                }
            }
        })
      },
      include: {
          artistProfile: true,
          clientProfile: true
      }
    });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.artistProfile?.name || user.clientProfile?.name || 'User',
        role: user.role,
        artistId: user.artistProfile?.id || null,
        clientId: user.clientProfile?.id || null
      },
    });
  } catch (error: any) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
        where: { email },
        include: {
            artistProfile: { select: { id: true, name: true } },
            clientProfile: { select: { id: true, name: true } }
        }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        // Fallback to name from profile if not on user
        name: user.artistProfile?.name || user.clientProfile?.name || 'User',
        role: user.role,
        artistId: user.artistProfile?.id || null,
        clientId: user.clientProfile?.id || null
      },
    });
  } catch (error: any) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
