import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';


// Middleware for error handling
export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
};

// Sign up a new user
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const savedUser = await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({ token, userId: savedUser._id, redirectTo: '/profile' });
  } catch (err) {
    next(err);
  }
};

// Log in an existing user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate and sanitize input
    body('email').isEmail().normalizeEmail();
    body('password').isLength({ min: 5 });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user with this email' });
    }

    // Check password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(200).json({ token, userId: user._id, redirectTo: '/profile' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
};


// Delete user by ID
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Deleted user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update user
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updatedUser) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET all user flight bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate('bookings');
    if (!user) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user.bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
