const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const Document = require("./document.model");
const Chunk = require("../rag/vector.model");
const { splitTextIntoChunks } = require("../../utils/chunkText");
const { generateEmbeddingsBatch } = require("../rag/embedding.service");
const { extractText } = require("../../utils/pdfParser");

// Upload & Process Document
const uploadDocument = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        res.status(400); throw new Error("No file uploaded");
    }

    const { originalname, buffer, mimetype } = req.file;

    // 2. Create Document Record
    const document = await Document.create({
        filename: originalname,
        filepath: originalname, // Store filename (no physical path with memory storage)
        fileType: mimetype,
        status: "processing"
    });

    try {
        // 3. Extract Text (pass buffer directly)
        let text = await extractText(buffer, mimetype);

        if (!text || text.length === 0) throw new Error("Empty text content");

        // 4. Generate Embeddings & Save Chunks (Graceful Handling)
        try {
            const chunks = await splitTextIntoChunks(text);
            const vectors = await generateEmbeddingsBatch(chunks);

            // 5. Save Chunks
            const chunkRecords = chunks.map((chunk, index) => ({
                documentId: document._id,
                text: chunk, // Fixed: model expects 'text', not 'content'
                embedding: vectors[index],
                metadata: {
                    source: originalname,
                    index: index
                }
            }));

            await Chunk.insertMany(chunkRecords);

            // Update Status and count
            document.status = "processed";
            document.vectorCount = chunkRecords.length;
            await document.save();

            res.status(201).json({
                message: "Document uploaded and processed successfully",
                document
            });

        } catch (embeddingError) {
            console.error("Embedding generation failed:", embeddingError.message);

            // Allow upload to succeed even if embedding fails
            document.status = "embedding_failed";
            document.vectorCount = 0;
            await document.save();

            res.status(201).json({
                message: "Document uploaded but embedding failed (Search will not work)",
                warning: embeddingError.message,
                document
            });
        }

    } catch (error) {
        // If processing fails completely (e.g. text extraction), delete the document record
        await Document.deleteOne({ _id: document._id });
        res.status(500);
        throw new Error(`Processing failed: ${error.message}`);
    }
});

const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
});

const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document) { res.status(404); throw new Error("Document not found"); }

    await Chunk.deleteMany({ documentId: document._id });
    // No file cleanup needed with memory storage

    await document.deleteOne();
    res.status(200).json({ message: "Deleted successfully" });
});

module.exports = {
    uploadDocument, getDocuments, deleteDocument
};
