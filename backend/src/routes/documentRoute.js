const express = require("express");
const router = express.Router();

const { uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin-only routes
router.post("/upload", protect, adminOnly, uploadDocument);
router.get("/", protect, adminOnly, getDocuments);
router.delete("/:id", protect, adminOnly, deleteDocument);

module.exports = router;
