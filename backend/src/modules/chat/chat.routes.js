const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware");
const { sendMessage, getUserConversations, getMessages } = require("./chat.controller");

router.post("/", protect, sendMessage);
router.get("/conversations", protect, getUserConversations);
router.get("/conversation/:id", protect, getMessages);

module.exports = router;
