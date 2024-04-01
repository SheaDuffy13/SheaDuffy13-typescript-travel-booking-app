import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";

interface RequestWithUser extends Request {
    userId?: string;
    role?: string;
}

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    bookings: string[];
    role: string;
}

interface RequestWithUser extends Request {
    user: User;
}

// Middleware for error handling
export const handleError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    res.status(500).json({ message: err.message });
};

// Sign up a new user
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        // Hash password and create new user in parallel
        const [hashedPassword, user] = await Promise.all([
            bcrypt.hash(password, 10),
            new User({
                firstName,
                lastName,
                email,
                password: "", // set the password later
                role: "user", // Always set role to 'user' for new signups
            }),
        ]);

        // Set the hashed password
        user.password = hashedPassword;

        const savedUser = await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: savedUser._id, role: savedUser.role }, // Include role in the payload
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            token,
            userId: savedUser._id,
            redirectTo: "/profile",
        });
    } catch (err) {
        next(err);
    }
};

// Log in an existing user
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate and sanitize input
        body("email").isEmail().normalizeEmail();
        body("password").isLength({ min: 5 });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            token,
            userId: user._id,
            redirectTo: "/profile",
        });
    } catch (err) {
        next(err);
    }
};

// Delete user by ID
export const deleteProfile = async (req: RequestWithUser, res: Response) => {
    try {
        // Check if the user is trying to delete their own profile or if they're an admin
        if (req.params.id !== req.userId && req.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Deleted user" });
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
export const getUser = async (req: RequestWithUser, res: Response) => {
    try {
        // Check if the user is trying to access their own profile or if they're an admin
        if (req.params.id !== req.userId && req.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Cannot find user" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT update user
export const updateProfile = async (req: RequestWithUser, res: Response) => {
  try {
      // Check if the user is trying to update their own profile or if they're an admin
      if (req.params.id !== req.userId && req.role !== "admin") {
          return res.status(403).json({ message: "Unauthorized" });
      }

      const { firstName, lastName, email, currentPassword, newPassword } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "Cannot find user" });
      }

      if (currentPassword && newPassword) {
          const passwordMatch = await bcrypt.compare(currentPassword, user.password);
          if (!passwordMatch) {
              return res.status(401).json({ message: "Current password is incorrect" });
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;

      const updatedUser = await user.save();

      res.json(updatedUser);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};