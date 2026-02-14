const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const { errorHandler } = require("./middleware/error.middleware");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const documentRoutes = require("./modules/document/document.routes");
const chatRoutes = require("./modules/chat/chat.routes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Route Mounitng
app.use("/api/auth", authRoutes);
app.use("/api/admin", documentRoutes); // Admin routes (upload, delete)
app.use("/api/chat", chatRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
