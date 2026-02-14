const Vector = require('../models/Vector');
const { cosineSimilarity } = require('../utils/vectorUtils');

/**
 * Stores multiple chunks with embeddings and metadata
 */
const saveVectors = async (vectors) => {
    return await Vector.insertMany(vectors);
};

/**
 * Searches for top K similar vectors using MongoDB Atlas Vector Search
 * Falls back to local computation if Vector Search is not available
 */
const searchSimilar = async (queryEmbedding, threshold = 0.35, topK = 8) => {
    try {
        // Use MongoDB Atlas Vector Search for optimal performance
        const pipeline = [
            {
                $vectorSearch: {
                    index: 'vector_index', // Match the index name you created in Atlas
                    path: 'embedding',
                    queryVector: queryEmbedding,
                    numCandidates: 100, // Number of candidates to consider (adjust based on dataset size)
                    limit: topK
                }
            },
            {
                $addFields: {
                    similarity: { $meta: 'vectorSearchScore' }
                }
            },
            {
                $match: {
                    similarity: { $gte: threshold }
                }
            },
            {
                $project: {
                    _id: 1,
                    documentId: 1,
                    filename: 1,
                    pageNumber: 1,
                    content: 1,
                    similarity: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        console.log(`Starting vector search through database...`);
        const results = await Vector.aggregate(pipeline);
        console.log(`Vector search completed, found ${results.length} results`);
        
        return results;
    } catch (error) {
        // Fallback to local computation if Vector Search index is not set up
        console.warn('Vector Search failed, falling back to local computation:', error.message);
        console.log('To use Vector Search, create an index named "vector_index" in MongoDB Atlas');
        
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
    }
};

/**
 * Deletes vectors associated with a document
 */
const deleteByDocumentId = async (documentId) => {
    return await Vector.deleteMany({ documentId });
};

module.exports = { saveVectors, searchSimilar, deleteByDocumentId };
