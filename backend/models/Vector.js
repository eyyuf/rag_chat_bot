const mongoose = require('mongoose');

const vectorSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    pageNumber: {
        type: Number,
        required: true,
        default: 1
    },
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vector', vectorSchema);
