import User from '../models/User';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// Sign up a new user
export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate request body
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
    //   password: hashedPassword
    password
    });

    // // Generate token
    // const token = jwt.sign(
    //   { userId: user._id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '2h' }
    // );

    // res.status(201).json({ token, userId: user._id });
    res.status(201).json({ userName: user.firstName + ' ' + user.lastName, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Log in an existing user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!(email && password)) {
      res.status(400).send("All input is required");
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user with this email' });
    }

    // Check password
    // if (await bcrypt.compare(password, user.password)) {
        if (password === user.password) {
      // Generate token
    //   const token = jwt.sign(
    //     { userId: user._id },
    //     process.env.JWT_SECRET,
    //     { expiresIn: '2h' }
    //   );

      // res.status(200).json({ token, userId: user._id });
      res.status(200).json({ userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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
