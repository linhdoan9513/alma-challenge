import { Request, Response } from 'express';
import { authenticateUser, generateToken } from '../config/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required',
      });
      return;
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // The user is already attached to req by the auth middleware
    const { user } = req as any;

    res.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
