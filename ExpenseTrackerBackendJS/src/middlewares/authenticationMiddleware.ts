import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config"; // Import your centralized configuration
import prisma from "../lib/prisma"; // Your Prisma client instance

// Extend the Express Request interface to include the 'user' property.
// This allows TypeScript to recognize req.user without casting.
declare global {
  namespace Express {
    interface Request {
      user?: {
        // Make user optional, as it won't be present on unauthenticated requests
        userId: string;
        userEmail: string;
        // Add any other essential user properties you want accessible on req.user
        // e.g., role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using JWT.
 * Verifies the token, fetches user from DB, and attaches user info to req.
 */
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // 2. Extract the token (e.g., from "Bearer TOKEN")
  const token = authHeader && authHeader.split(" ")[1];

  // 3. Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" }); // 401 Unauthorized
  }

  try {
    // 4. Verify the token using your JWT secret
    // This will throw an error if the token is invalid or expired
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      userEmail: string;
      iat: number;
      exp: number;
    };

    // 5. (Optional but recommended for stronger security):
    // Fetch the user from the database to ensure they still exist and are active.
    // This adds a DB query on every protected request. If you only rely on token payload, skip this.
    const user = await prisma.userData.findUnique({
      where: { userId: decoded.userId }, // Select only necessary fields for req.user
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid token: User not found or inactive" }); // 403 Forbidden
    }

    // 6. Attach the authenticated user's essential information to the request object.
    // This makes user data available in subsequent route handlers (e.g., req.user.id)
    req.user = {
      userId: user.userId,
      userEmail: user.userEmail /*, name: user.name */,
    }; // Include only necessary data

    // 7. Call next() to pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT authentication error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // Catches malformed, invalid signature, etc.
      return res.status(403).json({ message: "Invalid token" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
};

export default authenticateToken;
