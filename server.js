require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Define Resume Schema
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  linkedin: String,
  industry: String,
  specialization: String,
  jobs: Array,
  education: Array,
  skills: Array,
  certifications: String,
  volunteering: String,
  targetJob: String,
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Resume API. Use /api/resumes to fetch resumes.");
});

// Save Resume to MongoDB
app.post("/api/resume", async (req, res) => {
  try {
    const newResume = new Resume(req.body);
    await newResume.save();
    res.status(201).json({ message: "Resume saved successfully!", newResume });
  } catch (error) {
    res.status(500).json({ message: "Error saving resume", error });
  }
});

// Get All Resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error });
  }
});

// Get Resume by Email
app.get("/api/resume/:email", async (req, res) => {
  try {
    const resume = await Resume.findOne({ email: req.params.email });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume", error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
