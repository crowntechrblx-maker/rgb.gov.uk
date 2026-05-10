import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// --- Database Connectivity ---
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI not found. Running in mock mode.");
}

// --- Models ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const statementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  publisher: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Statement = mongoose.model("Statement", statementSchema);

// --- Auth Middleware ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

const checkAdmin = (req: any, res: any, next: any) => {
  if (!(req as any).user || !(req as any).user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// --- API Routes ---

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = "crowntechrblx@gmail.com";
  
  if (!MONGODB_URI) {
    // Mock successful login for prototype if no DB
    const token = jwt.sign({ email, isAdmin: email === ADMIN_EMAIL }, JWT_SECRET);
    return res.json({ token, email, isAdmin: email === ADMIN_EMAIL });
  }

  try {
    let user = await User.findOne({ email });
    const isAdmin = email === ADMIN_EMAIL;

    if (!user) {
      // For prototype, create user if doesn't exist (Auto-register)
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ 
        email, 
        password: hashedPassword,
        isAdmin: isAdmin
      });
      await user.save();
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(403).json({ message: "Invalid credentials" });
      
      // Ensure admin status is synced if email matches
      if (isAdmin && !user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, email: user.email, isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Statements
app.get("/api/statements", async (req, res) => {
  if (!MONGODB_URI) {
    return res.json([]); // Return empty or mock data
  }
  try {
    const statements = await Statement.find().sort({ createdAt: -1 });
    res.json(statements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch statements" });
  }
});

// Create Statement
app.post("/api/statements", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  
  if (!MONGODB_URI) {
    return res.status(503).json({ message: "Database not connected" });
  }

  try {
    const statement = new Statement({
      title,
      content,
      date,
      publisher: (req as any).user.email
    });
    await statement.save();
    res.status(201).json(statement);
  } catch (err) {
    res.status(500).json({ error: "Failed to create statement" });
  }
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
