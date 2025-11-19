// ==================== server.js ====================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== DATABASE CONNECTION ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==================== SCHEMAS ====================

// 👤 USER
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// 💡 SKILL
const skillSchema = new mongoose.Schema({
  name: String,
  level: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Skill = mongoose.model("Skill", skillSchema);

// 🎯 GOAL
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  targetDate: Date,
  completed: { type: Boolean, default: false },
});
const Goal = mongoose.model("Goal", goalSchema);

// 📈 PROGRESS (NEW)
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const Progress = mongoose.model("Progress", progressSchema);

// ==================== AUTH CONFIG ====================
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ==================== AUTH ROUTES ====================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ==================== AUTH MIDDLEWARE ====================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Authorization token required" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ==================== YOUTUBE HELPER ====================
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchYouTubeVideos(query, maxResults = 3) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing YOUTUBE_API_KEY");
      return [];
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=${maxResults}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      console.error("❌ YouTube API Error:", data);
      return [];
    }

    return data.items.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("❌ YouTube Fetch Error:", error);
    return [];
  }
}

// ==================== SKILL ROUTES ====================
app.get("/api/skills", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.userId });
    res.json({ skills });
  } catch {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

app.post("/api/skills", authMiddleware, async (req, res) => {
  try {
    const { name, level } = req.body;
    const newSkill = await Skill.create({ name, level, userId: req.user.userId });
    res.status(201).json({ message: "Skill added successfully", newSkill });
  } catch {
    res.status(500).json({ error: "Failed to add skill" });
  }
});

// ==================== GOALS ROUTES ====================
app.get("/api/goals", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

app.post("/api/goals", authMiddleware, async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;
    const goal = await Goal.create({
      userId: req.user.userId,
      title,
      description,
      targetDate,
    });
    res.status(201).json({ message: "Goal added successfully", goal });
  } catch (error) {
    res.status(500).json({ error: "Failed to add goal" });
  }
});

// ==================== PROGRESS ROUTES ====================

// 📤 Save topic progress
app.post("/api/progress", authMiddleware, async (req, res) => {
  try {
    const { topic, completed } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    let progress = await Progress.findOne({ userId: req.user.userId, topic });
    if (progress) {
      progress.completed = completed;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user.userId,
        topic,
        completed,
      });
    }

    res.json({ message: "Progress saved", progress });
  } catch (error) {
    console.error("❌ Progress Save Error:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

// 📥 Get user progress
app.get("/api/progress", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ✅ NEW — Update topic progress (Mark as Read)
app.put("/api/progress/:topic", authMiddleware, async (req, res) => {
  try {
    const { topic } = req.params;
    const { completed } = req.body;

    let progress = await Progress.findOne({ userId: req.user.userId, topic });
    if (!progress) {
      progress = await Progress.create({
        userId: req.user.userId,
        topic,
        completed,
      });
    } else {
      progress.completed = completed;
      await progress.save();
    }

    res.json({ message: "Progress updated successfully", progress });
  } catch (error) {
    console.error("❌ Progress Update Error:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// ==================== GEMINI + YOUTUBE RECOMMENDATION ====================
app.get("/api/recommendations", authMiddleware, async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const skills = await Skill.find({ userId: req.user.userId });
    const goals = await Goal.find({ userId: req.user.userId });

    const skillList = skills.map((s) => `${s.name} (${s.level})`).join(", ") || "No skills found";
    const goalList = goals.map((g) => g.title).join(", ") || "No goal set";

    console.log("🧠 Skills:", skillList);
    console.log("🎯 Goals:", goalList);

    const prompt = `
You are a professional career mentor AI.
The user has the following current skills: ${skillList}.
The user's career goal(s) are: ${goalList}.

Your task:
1. Analyze the gap between the user's skills and goals.
2. Suggest 5-7 topics to learn with reasons.
3. Include YouTube search terms for each topic.
4. Suggest 3 practice questions for each topic.
5. Suggest 3 matching careers.

Return JSON only in this format:
{
  "careers": [],
  "learning_path": [
    {
      "topic": "",
      "why_important": "",
      "youtube_queries": [],
      "practice_questions": []
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.output_text || response.text || "";
    console.log("🤖 Gemini Raw Output:", text);

    let data;
    try {
      const cleanText = text.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanText);
    } catch (e) {
      console.warn("⚠️ Invalid JSON, using fallback.");
      data = {};
    }

    const enrichedLearningPath = await Promise.all(
      (data.learning_path || []).map(async (item) => {
        const videos = await fetchYouTubeVideos(item.topic || "career development");
        return { ...item, videos };
      })
    );

    const finalResponse = {
      careers: data.careers?.length
        ? data.careers
        : ["Software Engineer", "Full Stack Developer", "AI Developer"],
      learning_path: enrichedLearningPath.length
        ? enrichedLearningPath
        : [
            {
              topic: "JavaScript Basics",
              why_important: "Essential for web app development",
              youtube_queries: ["JavaScript crash course"],
              practice_questions: [
                "Build a calculator app",
                "Reverse a string",
                "LeetCode: Two Sum",
              ],
              videos: await fetchYouTubeVideos("JavaScript crash course"),
            },
          ],
    };

    res.json(finalResponse);
  } catch (error) {
    console.error("❌ Gemini Recommendation Error:", error);
    res.status(500).json({ error: "AI recommendation failed" });
  }
});

// ==================== CHATBOT ROUTE ====================
app.post("/api/chat", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are an AI career guidance assistant.
User question: "${question}"

1. Provide a clear and helpful answer.
2. If the question is about a skill, technology, career role, or learning topic, suggest 2–4 YouTube search keywords.
3. Respond ONLY in JSON:

{
  "answer": "",
  "youtube_queries": []
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.output_text || response.text || "";
    const clean = text.replace(/```json|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(clean);
    } catch {
      data = { answer: "Sorry, I couldn't understand that.", youtube_queries: [] };
    }

    // 🔍 Fetch YouTube videos for each query
    let videos = [];
    if (data.youtube_queries && data.youtube_queries.length > 0) {
      const q = data.youtube_queries[0]; // use first query
      videos = await fetchYouTubeVideos(q, 3);
    }

    return res.json({
      answer: data.answer,
      videos,
    });

  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    res.status(500).json({ error: "Chatbot failed, try again." });
  }
});


// ==================== START SERVER ====================
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
