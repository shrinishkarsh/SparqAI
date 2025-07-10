import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Request, Response, NextFunction } from "express";
import { seedUserDemoData } from "./seedUserDemoData";

// Simple JWT-like session management
const sessions = new Map<string, string>();

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await verifyPassword(password, user.passwordHash || "");
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create session
    const token = generateSessionToken();
    sessions.set(token, user.id);
    
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.json({ user, token });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with generated ID
    const userId = Date.now().toString();
    const user = await storage.createUser({
      id: userId,
      email,
      passwordHash,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || null,
      profileImageUrl: null,
      isSetupComplete: false,
    } as any);

    // Create session
    const token = generateSessionToken();
    sessions.set(token, user.id);
    
    req.session.userId = user.id;
    
    // Seed demo data for new user
    await seedUserDemoData(user.id);
    
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.json({ user, token });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
}

export const isAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;