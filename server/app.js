const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");  // Ensure correct path
const cardRoutes = require("./routes/cards");
const columnRoutes = require("./routes/columns");
const boardRoutes = require("./routes/boards");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);  // Public routes, no auth middleware
app.use("/api/boards", authMiddleware, boardRoutes);  // Auth required
app.use("/api/cards", authMiddleware, cardRoutes);    // Auth required
app.use("/api/columns", authMiddleware, columnRoutes); // Auth required

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
