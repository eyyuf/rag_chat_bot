const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        default: "new chat"
    },
    lastMessage: {
        type: String,
    }
})

const Conversation = mongoose.model("Conversation", chatSchema);
module.exports = Conversation;
