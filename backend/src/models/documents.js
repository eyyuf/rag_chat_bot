const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'failed'],
        default: 'pending'
    },
    vectorCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const document = mongoose.model("document", documentSchema);
module.exports = document;
