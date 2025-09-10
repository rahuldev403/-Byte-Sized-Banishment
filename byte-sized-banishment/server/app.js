import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gauntletRoutes from "./routes/gauntletRoutes.js";
import skillTreeRoutes from "./routes/skillTreeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import duelRoutes from "./routes/duelRoutes.js";
import config from "./config/index.js";
import cookieParser from "cookie-parser";

connectDB();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gauntlet", gauntletRoutes);
app.use("/api/skill-tree", skillTreeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/duels", duelRoutes);

app.get("/", (req, res) => res.send("Byte-Sized Banishment API is running..."));
const PORT = config.PORT;
app.listen(PORT, () => console.log("Server running 😈"));
