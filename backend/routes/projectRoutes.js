const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");

// Define the programs directory
const programsDir = path.join(__dirname, "../../frontend/public/programs");

// Ensure the directory exists
if (!fs.existsSync(programsDir)) {
  fs.mkdirSync(programsDir, { recursive: true });
}

// Save project code as a file
router.post("/:userId/projects", authenticateUser, async (req, res) => {
  try {
    const { title, code, language } = req.body;
    const { userId } = req.params;

    if (!title || !code || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a safe filename
    const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}.${language.toLowerCase()}`;
    const filePath = path.join(programsDir, filename);

    // Save the code as a file
    fs.writeFileSync(filePath, code, "utf-8");

    res.status(201).json({ message: "Project saved successfully", filePath, filename });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
