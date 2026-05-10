import express from "express";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());

// --- Database Connectivity ---
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Session middleware for Passport
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MONGODB_URI ? MongoStore.create({ mongoUrl: MONGODB_URI }) : undefined,
  cookie: { 
    secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

async function seedData() {
  if (MONGODB_URI) {
    const count = await Minister.countDocuments();
    if (count === 0) {
      const initialMinisters = [
        { name: 'The Rt Hon Rishi Sunak MP', title: 'Prime Minister, First Lord of the Treasury and Minister for the Civil Service', department: 'Prime Minister\'s Office, 10 Downing Street', isCabinet: true, sortOrder: 1 },
        { name: 'The Rt Hon Oliver Dowden CBE MP', title: 'Deputy Prime Minister and Chancellor of the Duchy of Lancaster', department: 'Cabinet Office', isCabinet: true, sortOrder: 2 },
        { name: 'The Rt Hon Jeremy Hunt MP', title: 'Chancellor of the Exchequer', department: 'HM Treasury', isCabinet: true, sortOrder: 3 },
        { name: 'The Rt Hon James Cleverly TD MP', title: 'Secretary of State for the Home Department', department: 'Home Office', isCabinet: true, sortOrder: 4 },
        { name: 'The Rt Hon David Cameron', title: 'Secretary of State for Foreign, Commonwealth and Development Affairs', department: 'Foreign, Commonwealth & Development Office', isCabinet: true, sortOrder: 5 },
      ];
      await Minister.insertMany(initialMinisters);
      console.log("Seeded initial ministers");
    }
  }
}

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      seedData();
    })
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI not found. Running in mock mode.");
}

// --- Models ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google
  googleId: { type: String },
  name: { type: String },
  role: { type: String, enum: ['USER', 'CLERK', 'MEMBER', 'ADMIN'], default: 'USER' },
  followedBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
  followedPetitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Petition' }],
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  }
});

const gazetteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['State', 'Parliament', 'Public Notices', 'Appointments'], default: 'State' },
  noticeNumber: { type: String, unique: true },
  date: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now }
});

const statementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
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
    date: String,
    hideEmail: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const billSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  summary: { type: String }, // For full information
  status: { type: String, required: true },
  house: { type: String, required: true },
  type: { type: String, required: true },
  sponsor: { type: String },
  department: { type: String },
  stage: { type: String, default: 'First Reading' },
  history: [{
    action: String,
    date: String,
    house: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

const ministerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  photoUrl: { type: String },
  isCabinet: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 99 }
});

const User = mongoose.model("User", userSchema);
const Statement = mongoose.model("Statement", statementSchema);
const Petition = mongoose.model("Petition", petitionSchema);
const Bill = mongoose.model("Bill", billSchema);
const Minister = mongoose.model("Minister", ministerSchema);
const Gazette = mongoose.model("Gazette", gazetteSchema);

// --- Passport Google Strategy ---
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id }, 
          { email: profile.emails?.[0].value }
        ]
      });

      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
          role: profile.emails?.[0].value === "crowntechrblx@gmail.com" ? "ADMIN" : "USER"
        });
        await user.save();
      } else if (!user.googleId) {
        user.googleId = profile.id;
        if (!user.name) user.name = profile.displayName;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

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

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    googleAuth: !!GOOGLE_CLIENT_ID,
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

const ADMIN_EMAIL = "crowntechrblx@gmail.com";
const ADMIN_SETUP_PASSWORD = process.env.ADMIN_SETUP_PASSWORD || "gov-admin-2026"; // Fallback for first time only

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!MONGODB_URI) {
    return res.status(503).json({ message: "Database not connected. Please configure MONGODB_URI in settings." });
  }

  try {
    let user = await User.findOne({ email });
    const isInitialAdmin = email === ADMIN_EMAIL;

    if (!user) {
      if (isInitialAdmin) {
        // Only allow auto-creation if the provided password matches the setup secret
        if (password !== ADMIN_SETUP_PASSWORD) {
          return res.status(401).json({ message: "Initial Admin account setup required. Incorrect setup password." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ 
          email, 
          password: hashedPassword,
          role: 'ADMIN',
          name: 'System Admin'
        });
        await user.save();
      } else {
        return res.status(401).json({ message: "No account found. Please contact an administrator." });
      }
    } else {
      if (!user.password && user.googleId) {
        return res.status(401).json({ message: "Please use 'Sign in with Google' for this account." });
      }
      const validPassword = await bcrypt.compare(password, user.password!);
      if (!validPassword) return res.status(403).json({ message: "Invalid credentials" });
      
      if (isInitialAdmin && user.role !== 'ADMIN') {
        user.role = 'ADMIN';
        await user.save();
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET);
    res.json({ token, email: user.email, role: user.role, name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Google Auth Routes
app.get("/api/auth/google", (req, res, next) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: "Google OAuth not configured." });
  }
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login?error=google-failed" }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    }, JWT_SECRET);
    
    // Redirect back to frontend with token
    res.redirect(`/?auth_token=${token}&email=${user.email}&role=${user.role}&name=${encodeURIComponent(user.name || '')}`);
  }
);

// --- Admin: User Management ---
app.get("/api/users", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.delete("/api/users/:id", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ message: "User not found" });
    
    if (userToDelete.email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Cannot delete the primary administrator." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// --- Password Management ---
app.post("/api/users/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById((req as any).user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(403).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

app.post("/api/users/:id/reset-password", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "User password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// --- Public Petitions ---
app.get("/api/petitions", async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ signatures: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch petitions" });
  }
});

app.get("/api/petitions/:id", async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch petition" });
  }
});

app.post("/api/petitions", async (req, res) => {
  const { title, content, creatorName, creatorEmail } = req.body;
  try {
    const petition = new Petition({ 
      title, 
      content, 
      status: 'Open',
      signatures: 1, // First signer is the creator
      signedBy: [creatorEmail || 'anonymous'] // Use email for signature tracking
    });
    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    res.status(500).json({ error: "Failed to create petition" });
  }
});

app.post("/api/petitions/:id/sign", async (req, res) => {
  const { email } = req.body;
  const authHeader = req.headers['authorization'];
  let signerId = email; 

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      signerId = decoded.userId || decoded.email;
    } catch (e) {}
  }

  if (!signerId) return res.status(400).json({ message: "Email is required to sign." });

  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (petition.signedBy.includes(signerId)) {
      return res.status(400).json({ message: "You have already signed this petition." });
    }

    petition.signedBy.push(signerId);
    petition.signatures = petition.signedBy.length;
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

app.get("/api/bills/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bill" });
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

app.get("/api/statements/:id", async (req, res) => {
  try {
    const statement = await Statement.findById(req.params.id);
    if (!statement) return res.status(404).json({ message: "Statement not found" });
    res.json(statement);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch statement" });
  }
});

// Ministers
app.get("/api/ministers", async (req, res) => {
  try {
    const ministers = await Minister.find().sort({ sortOrder: 1, name: 1 });
    res.json(ministers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ministers" });
  }
});

app.post("/api/ministers", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  try {
    const minister = new Minister(req.body);
    await minister.save();
    res.status(201).json(minister);
  } catch (err) {
    res.status(500).json({ error: "Failed to create minister" });
  }
});

app.patch("/api/ministers/:id", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  try {
    const minister = await Minister.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(minister);
  } catch (err) {
    res.status(500).json({ error: "Failed to update minister" });
  }
});

app.delete("/api/ministers/:id", authenticateToken, checkRole(['ADMIN']), async (req, res) => {
  try {
    await Minister.findByIdAndDelete(req.params.id);
    res.json({ message: "Minister removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete minister" });
  }
});

// Gazette
app.get("/api/gazette", async (req, res) => {
  try {
    const notices = await Gazette.find().sort({ publishedAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Gazette" });
  }
});

app.post("/api/gazette", authenticateToken, checkRole(['ADMIN', 'CLERK']), async (req, res) => {
  try {
    const noticeNumber = `L-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const notice = new Gazette({ ...req.body, noticeNumber, date });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Gazette notice" });
  }
});

// User Preferences & Following
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.userId)
      .populate('followedBills')
      .populate('followedPetitions');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/profile/follow/:type/:id", authenticateToken, async (req, res) => {
  const { type, id } = req.params;
  try {
    const user = await User.findById((req as any).user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const collection = type === 'bill' ? 'followedBills' : 'followedPetitions';
    const list = user[collection] as any[];
    
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update follows" });
  }
});

// Search
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  
  const query = q.toString();
  const searchRegex = new RegExp(query, 'i');
  
  try {
    const [petitions, bills, statements] = await Promise.all([
      Petition.find({ $or: [{ title: searchRegex }, { content: searchRegex }] }).limit(5),
      Bill.find({ $or: [{ title: searchRegex }, { description: searchRegex }] }).limit(5),
      Statement.find({ $or: [{ title: searchRegex }, { content: searchRegex }] }).limit(5)
    ]);
    
    const results = [
      ...petitions.map(p => ({ id: p._id, title: p.title, type: 'Petition', path: `/petitions/${p._id}` })),
      ...bills.map(b => ({ id: b._id, title: b.title, type: 'Bill', path: `/bills` })), // Adjust path if bill detail exists
      ...statements.map(s => ({ id: s._id, title: s.title, type: 'News', path: `/statements/${s._id}` }))
    ];
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Create Statement
app.post("/api/statements", authenticateToken, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  
  if (!MONGODB_URI) {
    return res.status(503).json({ message: "Database not connected" });
  }

  try {
    const statement = new Statement({
      title,
      content,
      imageUrl,
      date,
      publisher: (req as any).user.email
    });
    await statement.save();
    res.status(201).json(statement);
  } catch (err) {
    res.status(500).json({ error: "Failed to create statement" });
  }
});

// Final API catch-all
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// --- Vite Integration ---
export default app;

async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
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

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();
