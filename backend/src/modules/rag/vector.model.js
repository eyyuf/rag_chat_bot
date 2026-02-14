const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true,
        select: false // Optimization: Don't load vector by default
    },
    metadata: {
        pageNumber: Number,
        source: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Chunk", chunkSchema);
