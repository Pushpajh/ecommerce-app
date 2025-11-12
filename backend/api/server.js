import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

// MongoDB connect
await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo error:", err.message));

// ====== Schemas ======
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

// ====== Routes ======
app.get("/", (req, res) => res.send("E-commerce backend running 🚀"));

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });
    const hash = await bcrypt.hash(password, 10);
    await new User({ email, password: hash }).save();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email }).populate("cart wishlist");
    if (!u) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });
    res.json({ message: "Login successful", user: u });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// Items
app.get("/items", async (req, res) => res.json(await Item.find()));
app.post("/items/seed", async (req, res) => {
  await Item.insertMany([
    { name: "Smartphone", price: 12000 },
    { name: "Laptop", price: 48000 },
    { name: "Headphones", price: 2500 },
  ]);
  res.json({ message: "Seeded!" });
});

// Cart & wishlist
app.post("/items/cart", async (req, res) => {
  const { email, itemId } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(404).json({ message: "User not found" });
  if (!u.cart.includes(itemId)) u.cart.push(itemId);
  await u.save();
  res.json({ message: "Added to cart" });
});
app.post("/items/wishlist", async (req, res) => {
  const { email, itemId } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(404).json({ message: "User not found" });
  if (!u.wishlist.includes(itemId)) u.wishlist.push(itemId);
  await u.save();
  res.json({ message: "Added to wishlist" });
});

// export for Vercel
export default app;
