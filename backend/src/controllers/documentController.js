const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const asyncHandler = require("express-async-handler");
const Document = require("../models/documents");
const Chunk = require("../models/Chunk");

// @desc    Upload document and generate embeddings
// @route   POST /api/documents/upload
// @access  Admin
const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("No file uploaded");
    }

    const { filename, path: filepath, mimetype } = req.file;

    // 1. Create initial document record
    const document = await Document.create({
        filename,
        filepath,
        fileType: mimetype,
        status: "pending",
    });

    try {
        // 2. Extract text based on file type
        let text = "";
        if (mimetype === "application/pdf") {
            const dataBuffer = fs.readFileSync(filepath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else {
            text = fs.readFileSync(filepath, "utf8");
        }

        // 3. Chunk text (simple split by characters, approx 1000 chars each)
        const chunkSize = 1000;
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }

        // 4. Generate Embeddings using Voyager AI
        // Assuming Voyager AI has an embeddings endpoint
        const response = await fetch("https://api.voyager.ai/v1/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.VOYAGER_AI_API_KEY}`
            },
            body: JSON.stringify({
                input: chunks,
                model: "voyager-embed-v1"
            })
        });

        const result = await response.json();

        if (result.data) {
            // 5. Store embeddings in MongoDB
            const chunkDocs = chunks.map((chunkText, index) => ({
                documentId: document._id,
                text: chunkText,
                embedding: result.data[index].embedding
            }));

            await Chunk.insertMany(chunkDocs);

            // 6. Update document stats
            document.vectorCount = chunkDocs.length;
            document.status = "processed";
            await document.save();

            res.status(201).json(document);
        } else {
            throw new Error(result.error || "Failed to generate embeddings from Voyager AI");
        }
    } catch (error) {
        document.status = "failed";
        await document.save();
        console.error("Upload error:", error);
        res.status(500);
        throw new Error(`Document processing failed: ${error.message}`);
    }
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

    // Also delete associated chunks
    await Chunk.deleteMany({ documentId: document._id });
    await document.deleteOne();

    // Attempt to delete physical file
    if (fs.existsSync(document.filepath)) {
        fs.unlinkSync(document.filepath);
    }

    res.status(200).json({ message: "Document and associated vectors removed" });
});

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
};
