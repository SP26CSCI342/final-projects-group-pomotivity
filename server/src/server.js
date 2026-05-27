// Load environment variables
require("dotenv").config();


const express = require("express");
const cors = require("cors");

// Initialize app
const app = express();

// gets port from .env
// defaults to 3000
const PORT = process.env.PORT || 3000;

// In-memory "database". Cleared every time nodemon restarts.
// will replace when MongoDB is implemented
const users = [];


app.use(cors({
  origin: "http://localhost:5173/", // frontend origin
  credentials: true
}));
app.use(express.json()); // parse JSON bodies


// input validation imported from assignment 6
// TODO: improve input validation
function validateInputs({ firstName, lastName, email, password}){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!firstName || firstName.length < 3){
        return new Error("Username must be at least 3 characters long");
    }

    if(!lastName || lastName.length < 3){
        return new Error("Username must be at least 3 characters long");
    }

    if(!email || !emailRegex.test(email)){
        return new Error("email must be in the form of example@example.example")
    }
    
    if(!password || password.length < 8){
        return new Error("Password must be at least 8 characters long")
    }
}

app.post("/api/register", (req, res) => {
  const {firstName, lastName, email, password } = req.body;

  const validationError = validateInputs({ firstName, lastName, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  const duplicateUser = users.find(user => user.email === email);

  if(duplicateUser){
    return res.status(409).json({error : "email already exists"})
  }

  const newUser = {
    firstName,
    lastName,
    email,
    password,
  };
  users.push(newUser);

  return res.status(201).json({
    message: "User registered successfully.",
    user: {
      firstName : newUser.firstName,
      lastName : newUser.lastName,
      email: newUser.email,
    },
  });
});

// handles login requests
// password is not encrypted
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const user = users.find(user => user.email === email);
    if(!email || user.password !== password){
        return res.status(401).json({error: "Invalid email or password"})
    }


    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            firstName : user.firstName,
            lastName : user.lastName,
            email : email
        }
    });
    

    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


// 404 fallback â€” must come AFTER all routes so they match first.
app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found.",
  });
});

// checks if server is running
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});