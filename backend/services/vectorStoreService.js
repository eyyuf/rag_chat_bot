const Vector = require('../models/Vector');
const { cosineSimilarity } = require('../utils/vectorUtils');

/**
 * Stores multiple chunks with embeddings and metadata
 */
const saveVectors = async (vectors) => {
    return await Vector.insertMany(vectors);
};

/**
 * Searches for top K similar vectors above threshold
 */
const searchSimilar = async (queryEmbedding, threshold = 0.35, topK = 8) => {
    // Production Note: For large scale, use Atlas Vector Search $vectorSearch
    // For this exercise, we retrieve all and calculate similarity locally
    const allVectors = await Vector.find({});
    console.log(`Starting similarity search through ${allVectors.length} chunks...`);

    const results = allVectors.map(vec => {
        const similarity = cosineSimilarity(queryEmbedding, vec.embedding);
        return {
            ...vec.toObject(),
            similarity
        };
    })
        .filter(r => r.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

    return results;
};

/**
 * Deletes vectors associated with a document
 */
const deleteByDocumentId = async (documentId) => {
    return await Vector.deleteMany({ documentId });
};

module.exports = { saveVectors, searchSimilar, deleteByDocumentId };
