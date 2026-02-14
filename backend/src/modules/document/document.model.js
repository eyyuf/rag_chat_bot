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
        default: 'pending' // No enum to avoid validation errors
    },
    vectorCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Document", documentSchema);
