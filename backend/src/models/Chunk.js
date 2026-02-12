const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "document",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

// Optional: Index for vector search if using MongoDB Atlas Vector Search
// chunkSchema.index({ embedding: "2dsphere" }); 

const Chunk = mongoose.model("Chunk", chunkSchema);
module.exports = Chunk;
