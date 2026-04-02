import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "./models/User.js"; // Import User Model
import { verifyToken } from "./middleware/authMiddleware.js"; // Import middleware
import Project from "./models/Project.js" // Import Project Model
import questsRoutes from "./routes/quests.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


// Middleware
app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5173'], // Add your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/quests", questsRoutes);
// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Default Route
app.get("/", (req, res) => res.send("CollabCode Backend Running ✅"));

// ============================
// Authentication Routes
// ============================

// Signup Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/save-code", async (req, res) => {
    const { fileName, language, code } = req.body;
  
    try {
      await CodeModel.create({ fileName, language, code });
      res.json({ message: "Code saved successfully!" });
    } catch (error) {
      console.error("Save error:", error);
      res.status(500).json({ error: "Failed to save code." });
    }
  });
  app.get("/get-saved-codes", async (req, res) => {
    const codes = await CodeModel.find();
    res.json(codes);
  });
  
// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("Generated Token:", token);
    res.json({ token });
});

// ============================
// User Profile & Projects Route
// ============================

// Save a new project
app.post("/projects", verifyToken, async (req, res) => {
    try {
        const { title, code, language } = req.body;
        const newProject = new Project({ userId: req.user.userId, title, code, language });
        await newProject.save();
        res.status(201).json({ success: true, message: "Project saved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// Get all projects of a user
app.get("/users/:userId/projects", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// ============================
// Real-time Collaboration with Socket.io
// ============================
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("codeUpdate", (code) => {
        socket.broadcast.emit("codeUpdate", code);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: `Welcome, User ID: ${req.user.userId}` });
});

// ============================
// Execute Code via Judge0 API
// ============================

app.post("/execute", async (req, res) => {
    const { language, code } = req.body;
    const languageIds = { javascript: 63, python: 71, cpp: 54 };

    if (!languageIds[language]) {
        return res.status(400).json({ error: "Unsupported language" });
    }

    if (!process.env.RAPIDAPI_KEY) {
        return res.status(500).json({ error: "Missing RapidAPI Key" });
    }

    try {
        console.log(`Executing ${language} code`);
        const { data } = await axios.post(
            "https://judge029.p.rapidapi.com/submissions",
            {
                source_code: code,
                language_id: languageIds[language],
                stdin: "",
                expected_output: null,
                redirect_stderr_to_stdout: true,
            },
            {
                params: { base64_encoded: "false", wait: "false", fields: "*" },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "judge029.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
            }
        );

        const token = data.token;
        console.log("Execution Token:", token);

        let attempts = 0;
        const maxAttempts = 10;
        const checkResult = async () => {
            if (attempts >= maxAttempts) {
                return res.status(500).json({ error: "Execution timeout" });
            }
            try {
                const result = await axios.get(
                    `https://judge029.p.rapidapi.com/submissions/${token}`,
                    {
                        params: { base64_encoded: "false", fields: "*" },
                        headers: { "X-RapidAPI-Key": process.env.RAPIDAPI_KEY },
                    }
                );
                if (result.data.status.id <= 2) {
                    attempts++;
                    setTimeout(checkResult, 1000);
                } else {
                    res.json({
                        output: result.data.stdout || result.data.stderr || "No output",
                        status: result.data.status.description,
                    });
                }
            } catch (fetchError) {
                console.error("Fetching Execution Result Failed:", fetchError);
                res.status(500).json({ error: "Failed to fetch execution result" });
            }
        };
        checkResult();
    } catch (error) {
        console.error("Execution Error:", error);
        res.status(500).json({ error: "Execution failed" });
    }
});

// ============================
// MongoDB Connection
// ============================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ============================
// Global Error Handler
// ============================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!", 
        error: process.env.NODE_ENV === 'development' ? err.message : {} 
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
