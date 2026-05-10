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
  role: { type: String, enum: ['USER', 'CLERK', 'MEMBER', 'ADMIN'], default: 'USER' },
});

const statementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  publisher: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  signatures: { type: Number, default: 1 },
  signedBy: [{ type: String }], // User IDs
  status: { type: String, default: 'Open' },
  responses: [{
    content: String,
    author: String,
    authorRole: String,
    date: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const billSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  house: { type: String, required: true },
  type: { type: String, required: true },
  history: [{
    action: String,
    date: String,
    house: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Statement = mongoose.model("Statement", statementSchema);
const Petition = mongoose.model("Petition", petitionSchema);
const Bill = mongoose.model("Bill", billSchema);

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

const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
  if (!(req as any).user || !roles.includes((req as any).user.role)) {
    return res.status(403).json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

// --- API Routes ---

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = "crowntechrblx@gmail.com";
  
  if (!MONGODB_URI) {
    const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';
    const token = jwt.sign({ email, role }, JWT_SECRET);
    return res.json({ token, email, role });
  }

  try {
    let user = await User.findOne({ email });
    const isInitialAdmin = email === ADMIN_EMAIL;

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ 
        email, 
        password: hashedPassword,
        role: isInitialAdmin ? 'ADMIN' : 'USER'
      });
      await user.save();
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(403).json({ message: "Invalid credentials" });
      
      if (isInitialAdmin && user.role !== 'ADMIN') {
        user.role = 'ADMIN';
        await user.save();
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, email: user.email, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Petitions
app.get("/api/petitions", async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ signatures: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch petitions" });
  }
});

app.post("/api/petitions", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const petition = new Petition({ title, content, signedBy: [(req as any).user.userId] });
    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    res.status(500).json({ error: "Failed to create petition" });
  }
});

app.post("/api/petitions/:id/sign", authenticateToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });
    
    if (petition.signedBy.includes((req as any).user.userId)) {
      return res.status(400).json({ message: "You have already signed this petition" });
    }

    petition.signedBy.push((req as any).user.userId);
    petition.signatures += 1;
    await petition.save();
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: "Failed to sign petition" });
  }
});

app.post("/api/petitions/:id/reply", authenticateToken, checkRole(['MEMBER', 'ADMIN']), async (req, res) => {
  const { content } = req.body;
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    petition.responses.push({
      content,
      author: (req as any).user.email,
      authorRole: (req as any).user.role,
      date: new Date().toLocaleDateString('en-GB')
    });
    
    if (petition.signatures >= 100000) {
      petition.status = 'Debated in Parliament';
    } else if (petition.signatures >= 10000) {
      petition.status = 'Government responded';
    }

    await petition.save();
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: "Failed to reply to petition" });
  }
});

// Bills
app.get("/api/bills", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ updatedAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

app.post("/api/bills", authenticateToken, checkRole(['CLERK', 'ADMIN']), async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: "Failed to create bill" });
  }
});

app.patch("/api/bills/:id", authenticateToken, checkRole(['CLERK', 'ADMIN']), async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: "Failed to update bill" });
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
