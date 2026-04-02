import express from "express";
import { Project } from "../models/Project.js";

const router = express.Router();

// Get all projects of a user
router.get("/users/:userId/projects", async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

export default router;
