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

// In-memory "database". Cleared every time nodemon restarts.
// will replace when MongoDB is implemented
const users = [];


app.use(cors());
app.use(express.json()); // parse JSON bodies
// parse URL-encoded bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Connect Mongoose to MongoDB Atlas.
// Uses `process.env.MONGO_URI` from your .env file.
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  lastName: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);


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

    await User.create({ firstName, lastName, email, password : hashedPassword })

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            firstName : user.firstName,
            lastName : user.lastName,
            email : email
        },
        token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
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

// 404 fallback — must come AFTER every route or it'll eat them.
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});