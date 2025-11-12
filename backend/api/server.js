const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./authRoutes");
const itemRoutes = require("./itemRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("E-commerce backend running 🚀");
});

// ✅ Connect MongoDB properly
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

startServer(); // 👈 run it properly
