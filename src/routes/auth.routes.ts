import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log(email, password);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET || "secretkey",
      { expiresIn: "30d" }
    );
    console.log(token);
    res.json({ token, user: user._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/setup-name", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Name updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Получить данные пользователя по токену
router.get("/me", verifyJWT, async (req: any, res) => {
  try {
    console.log("Me")
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user)
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;