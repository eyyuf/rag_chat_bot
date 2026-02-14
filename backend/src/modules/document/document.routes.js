const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../../middleware/auth.middleware");
const { admin } = require("../../middleware/role.middleware");
const { uploadDocument, getDocuments, deleteDocument } = require("./document.controller");

// Multer Memory Storage (keeps files in memory as buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Admin Routes
router.post("/upload", protect, admin, upload.single("file"), uploadDocument);
router.get("/documents", protect, admin, getDocuments);
router.delete("/document/:id", protect, admin, deleteDocument);

module.exports = router;
