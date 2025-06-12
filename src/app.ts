import express, { Express } from "express";
import "./db/index.js";

import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Pharmacy API"); 
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log("Server listens on port", PORT);
});
