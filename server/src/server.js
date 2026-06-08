// Load environment variables
require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");

// Initialize app
const app = express();

// gets port from .env
// defaults to 3000
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // parse JSON bodies
// parse URL-encoded bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Connect Mongoose to MongoDB Atlas.
// Uses `process.env.MONGO_URI` from your .env file.
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error("MongoDB connection error:", err));

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, minlength: 3 },
  lastName: { type: String, required: true, trim: true, minlength: 3 },
  profilePicture: { type: String, default: "" },
  hoursFocused: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  badges: [{ type: String }],
  preferences: {
    pushNotifications: { type: Boolean, default: true },
    weeklyEmailReport: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: false },
    appTheme: { type: String, enum: ["light", "dark", "system"], default: "system" },
  },
});

const Profile = mongoose.model("Profile", profileSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  variant: { type: String, default: "green" },
  time: { type: String, default: "All day" },
});

const Event = mongoose.model("Event", eventSchema);

//Schemas for the notes page
const filesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  tree: { type: Array, required: true}
});

const Files = mongoose.model("Files", filesSchema);

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  notes: { type: Array, required: true}
});

const Note = mongoose.model("Note", noteSchema);


function authenticate(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
}

function validateInputs({ firstName, lastName, email, password}){
    if(!firstName || firstName.length < 3){
        return new Error("first name must be at least 3 characters long");
    }

    if(!lastName || lastName.length < 3){
        return new Error("Username must be at least 3 characters long");
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return new Error("Please enter a valid email address.");
      }
    }
    if(!password || password.length < 8){
        return new Error("Password must be at least 8 characters long")
    }
  return "";
}

// ============================================================
// POST /api/register
// ============================================================
app.post("/api/register", async(req, res) => {
  const {firstName, lastName, email, password } = req.body || {};

  const validationError = validateInputs({ firstName, lastName, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  try{
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(409).json({ error: "email already taken"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile document
    const profileDoc = await Profile.create({ firstName, lastName });

    const newUser = await User.create({
      email,
      password: hashedPassword,
      profile: profileDoc._id,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        email: newUser.email,
        profiles: profileDoc,
      },
      token,
    });

  }catch(error){
    console.error("Register error:", error);
    if(error.code === 11000) {
      return res.status(409).json({error: "email already taken"})
    }
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/login
// ============================================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // fetch linked profile document
    let profileDoc = null;
    if (user.profile) {
      profileDoc = await Profile.findById(user.profile).lean();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            email: user.email,
            profiles: profileDoc || {},
        },
        token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ============================================================
// GET /api/events
// return the authenticated user's events
// ============================================================
app.get("/api/events", authenticate, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId }).lean();
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/events
// add a new event for the authenticated user
// ============================================================
app.post("/api/events", authenticate, async (req, res) => {
  const { date, title, variant, time } = req.body || {};
  if (!date || !title) {
    return res.status(400).json({ error: "Date and title are required." });
  }

  try {
    const event = await Event.create({
      user: req.userId,
      date,
      title,
      variant: variant || "green",
      time: time || "All day",
    });
    return res.status(201).json({ event });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// PATCH /api/events/:id
// update an event owned by the authenticated user
// ============================================================
app.patch("/api/events/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { date, title, variant, time } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID." });
  }

  if (!title && !date && !variant && !time) {
    return res.status(400).json({ error: "At least one field must be provided to update." });
  }

  try {
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (date !== undefined) updates.date = date;
    if (variant !== undefined) updates.variant = variant;
    if (time !== undefined) updates.time = time;

    const event = await Event.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: updates },
      { new: true },
    ).lean();

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.status(200).json({ event });
  } catch (error) {
    console.error("Update event error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// DELETE /api/events/:id
// remove an event owned by the authenticated user
// ============================================================
app.delete("/api/events/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID." });
  }

  try {
    const event = await Event.findOneAndDelete({ _id: id, user: req.userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.status(200).json({ message: "Event deleted." });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// GET /api/files
// return the file tree
// ============================================================
app.get("/api/files", authenticate, async (req, res) => {
  try {
    const files = await Files.findOne({ user: req.userId });
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Get files error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/files
// add a new file tree (only runs once for every user)
// ============================================================
app.post("/api/files", authenticate, async (req, res) => {
  const { tree } = req.body || {};

  try {
    let files = await Files.findOne({ user: req.userId });
    if(!files){
      files = await Files.create({
        user: req.userId,
        tree: tree || [],
      });
    }
    return res.status(201).json({ files });
  } catch (error) {
    console.error("Create files error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// PATCH /api/files
// updates the user's files in the database when they are changed
// ============================================================
app.patch("/api/files", authenticate, async (req, res) => {
  const files = req.body || {};
  try {
    const newTree = await Files.findOneAndUpdate(
      { user: req.userId },
      { $set: { tree: files } },
      { returnDocument: 'after' }
    );
    return res.status(200).json({ newTree });
  } catch (error) {
    console.error("Error updating files:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// GET /api/note
// return the note collection
// ============================================================
app.get("/api/note", authenticate, async (req, res) => {
  try {
    const foundNotes = await Note.findOne({ user: req.userId });
    return res.status(200).json({ foundNotes });
  } catch (error) {
    console.error("Get note error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/note
// add a new note collection (only runs once for every user)
// ============================================================
app.post("/api/note", authenticate, async (req, res) => {
  try {
    let foundNotes = await Note.findOne({ user: req.userId });
    if(!foundNotes){
      foundNotes = await Note.create({
        user: req.userId,
        notes: [],
      });
    }
    return res.status(201).json({ foundNotes });
  } catch (error) {
    console.error("Create note error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// PATCH /api/note
// updates notes in database when changed
// ============================================================
app.patch("/api/note", authenticate, async (req, res) => {
  const notes = req.body || {};
  try {
    const newNotes = await Note.findOneAndUpdate(
      { user: req.userId },
      { $set: { notes } },
      { returnDocument: 'after' }
    );
    return res.status(200).json({ newNotes });
  } catch (error) {
    console.error("Error updating notes:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// POST /api/logout
// ============================================================
app.post("/api/logout", (req, res) => {
    
    req.headers.authorization = req.headers.authorization || "";
    if (!req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token." });
    }
    
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token." });
    }

  return res.status(200).json({ message: "Logged out." });
});

// ============================================================
// PATCH /api/profile
// Update the authenticated user's profile information
// ============================================================
app.patch("/api/profile", authenticate, async (req, res) => {
  const { firstName, lastName } = req.body || {};

  if (!firstName || firstName.trim().length < 3) {
    return res.status(400).json({ error: "First name must be at least 3 characters." });
  }

  if (!lastName || lastName.trim().length < 3) {
    return res.status(400).json({ error: "Last name must be at least 3 characters." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const profile = await Profile.findById(user.profile);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    profile.firstName = firstName.trim();
    profile.lastName = lastName.trim();
    await profile.save();

    return res.status(200).json({ message: "Profile updated.", profiles: profile });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// ============================================================
// PATCH /api/profile/preferences
// Update the authenticated user's profile preferences
// Requires `Authorization: Bearer <token>` header
// ============================================================
app.patch("/api/profile/preferences", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token." });
    }

    const token = auth.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const userId = payload.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (!user.profile) return res.status(404).json({ error: "Profile not found." });

    const allowed = ["pushNotifications", "weeklyEmailReport", "publicProfile", "appTheme"];
    const updates = (req.body && req.body.preferences) || {};
    const filtered = {};
    for (const key of Object.keys(updates)) {
      if (allowed.includes(key)) filtered[key] = updates[key];
    }

    const profile = await Profile.findById(user.profile);
    if (!profile) return res.status(404).json({ error: "Profile not found." });

    profile.preferences = Object.assign({}, profile.preferences || {}, filtered);
    await profile.save();

    return res.status(200).json({ message: "Preferences updated.", profiles: profile });
  } catch (error) {
    console.error("Preferences update error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// 404 fallback — must come AFTER every route or it'll eat them.
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});