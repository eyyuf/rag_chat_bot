const pdf = require('pdf-parse');
const Document = require('../models/Document');
const { chunkText } = require('../utils/textChunker');
const { getEmbeddings } = require('./embeddingService');
const { saveVectors, deleteByDocumentId } = require('./vectorStoreService');

const processDocument = async (file) => {
    let text = '';

    try {
        if (file.mimetype === 'application/pdf') {
            const data = await pdf(file.buffer);
            text = data.text;
        } else {
            text = file.buffer.toString('utf-8');
        }
    } catch (err) {
        console.error('Text Extraction Error:', err.message);
        throw new Error('Failed to extract text from file');
    }

    // Create document metadata record
    const doc = await Document.create({
        filename: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
    });

    console.log(`Extracted text length: ${text.length} characters`);

    // Chunk text
    const chunks = chunkText(text, 450, 100);
    console.log(`Split into ${chunks.length} chunks`);

    // Generate embeddings for chunks
    const embeddings = await getEmbeddings(chunks);

    // Prepare vector records
    const vectorRecords = chunks.map((chunk, i) => ({
        documentId: doc._id,
        filename: doc.filename,
        content: chunk,
        embedding: embeddings[i],
        pageNumber: 1 // Default to 1; more advanced PDF parsing would track pages
    }));

    // Save to vector store
    await saveVectors(vectorRecords);

    return doc;
};

const deleteDocument = async (id) => {
    await Document.findByIdAndDelete(id);
    await deleteByDocumentId(id);
};

const getAllDocuments = async () => {
    return await Document.find({}).sort('-createdAt');
};

module.exports = { processDocument, deleteDocument, getAllDocuments };
