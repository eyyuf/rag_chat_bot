const asyncHandler = require("express-async-handler");
const Document = require("../models/Documents");

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Admin
const uploadDocument = asyncHandler(async (req, res) => {
    const { filename, filepath, fileType } = req.body;

    const document = await Document.create({
        filename,
        filepath,
        fileType,
    });

    res.status(201).json(document);
});

// @desc    Get all documents
// @route   GET /api/documents
// @access  Admin
const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find();
    res.status(200).json(documents);
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Admin
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document) {
        res.status(404);
        throw new Error("Document not found");
    }

    await document.remove();
    res.status(200).json({ message: "Document removed" });
});

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
};
