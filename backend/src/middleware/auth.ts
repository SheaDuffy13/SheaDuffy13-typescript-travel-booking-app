import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
    userId?: string;
}

export const authMiddleware = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assumes 'Bearer <token>' format

    if (!token) {
        return res
            .status(403)
            .json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err); // Log any errors
            if (err instanceof jwt.TokenExpiredError) {
                return res
                    .status(401)
                    .json({ message: "Token expired" });
            } else {
                return res
                    .status(403)
                    .json({ message: "Invalid token" });
            }
        }
        req.userId = (decoded as JwtPayload).userId; // Save user ID for use in other routes
        next();
    });
};

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assumes 'Bearer <token>' format

    if (!token) {
        return res
            .status(403)
            .json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err); // Log any errors
            if (err instanceof jwt.TokenExpiredError) {
                return res
                    .status(401)
                    .json({ message: "Token expired" });
            } else {
                return res
                    .status(403)
                    .json({ message: "Invalid token" });
            }
        }
        if ((decoded as any).role !== "admin") {
            // Check if the user is an admin
            return res.status(403).json({ message: "Requires admin role" });
        }

        next();
    });
};

