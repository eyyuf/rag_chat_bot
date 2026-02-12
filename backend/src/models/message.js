const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    source: [
        {
            documentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "document"

            },
            chunkId: String,
            textSnippet: String
        }
    ]
}, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;