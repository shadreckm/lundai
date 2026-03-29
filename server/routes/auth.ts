import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "email, password, and fullName are required" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // In production this would persist to DB via Drizzle
    const user = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: role || "student",
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Registration failed", message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // Mock user lookup – in prod, query DB
    const mockUsers: Record<string, { id: string; email: string; fullName: string; role: string; hash: string }> = {
      "student@lundai.com": {
        id: "user-001",
        email: "student@lundai.com",
        fullName: "Demo Student",
        role: "student",
        hash: await bcrypt.hash("password123", 10),
      },
      "landlord@lundai.com": {
        id: "user-002",
        email: "landlord@lundai.com",
        fullName: "Demo Landlord",
        role: "landlord",
        hash: await bcrypt.hash("password123", 10),
      },
      "admin@lundai.com": {
        id: "user-003",
        email: "admin@lundai.com",
        fullName: "LUNDAI Admin",
        role: "admin",
        hash: await bcrypt.hash("admin123", 10),
      },
    };

    const user = mockUsers[email.toLowerCase()];
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Login failed", message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    res.json({ user: payload });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
