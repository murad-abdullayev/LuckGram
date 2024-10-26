import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./mongoose/schemas/user.mjs";
import authRoutes from "./routes/auth.mjs";
import publicationRoutes from "./routes/publication.mjs";
import commentRoutes from "./routes/comment.mjs";
import "./auth/local-strategy.mjs";
import passport from "passport";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

export const PORT = process.env.PORT || 3000;

const app = express();
const adminPassword = encodeURIComponent(process.env.DB_PASSWORD);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../application/assets"))
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/comment", commentRoutes);

app.use("/publication", publicationRoutes);

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function connectToDb() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${adminPassword}@cluster0.8hvmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
}

connectToDb()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));
