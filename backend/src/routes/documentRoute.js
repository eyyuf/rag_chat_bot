const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "text/plain") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and Text files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

// Admin-only routes
router.post("/upload", protect, adminOnly, upload.single("file"), uploadDocument);
router.get("/", protect, adminOnly, getDocuments);
router.delete("/:id", protect, adminOnly, deleteDocument);

module.exports = router;
