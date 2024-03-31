import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
  userId?: string;
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assumes 'Bearer <token>' format

  console.log('Token:', token);  // Log the token

  if (!token) {
    return res.status(403).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);  // Log any errors
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    console.log('Decoded token:', decoded);  // Log the decoded token

    req.userId = (decoded as JwtPayload).userId; // Save user ID for use in other routes
    next();
  });
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assumes 'Bearer <token>' format

  console.log('Token:', token);  // Log the token

  if (!token) {
    return res.status(403).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);  // Log any errors
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    console.log('Decoded token:', decoded);  // Log the decoded token

    if ((decoded as any).role !== 'admin') { // Check if the user is an admin
      return res.status(403).json({ message: 'Requires admin role' });
    }

    next();
  });
};

  
