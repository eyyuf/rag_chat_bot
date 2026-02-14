/**
 * Calculate Cosine Similarity between two vectors.
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} similarity score (-1 to 1)
 */
const calculateSimilarity = (vecA, vecB) => {
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};

module.exports = { calculateSimilarity };
