const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const chatRoutes = require("./src/routes/chatRoute");
const documentRoutes = require("./src/routes/documentRoute");

app = express();

dotenv.config();
connectDB();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})