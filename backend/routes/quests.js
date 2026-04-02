import express from "express";
import Quest from "../models/Quest.js";

const router = express.Router();

// Get all quests
router.get("/", async (req, res) => {
  try {
    const quests = await Quest.find();
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coding quests" });
  }
});

// Add a new quest
router.post("/", async (req, res) => {
  try {
    const newQuest = new Quest(req.body);
    await newQuest.save();
    res.status(201).json(newQuest);
  } catch (error) {
    res.status(400).json({ message: "Error adding coding quest" });
  }
});

export default router;
