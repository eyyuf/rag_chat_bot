const { generateEmbeddingsBatch } = require("../rag/embedding.service");
const Chunk = require("../rag/vector.model");
const { calculateSimilarity } = require("../rag/similarity");
const { buildRagPrompt } = require("../rag/prompt.builder");
const grokConfig = require("../../config/grok");

/**
 * Find relevant chunks for a query
 * @param {string} query 
 * @returns {Promise<object[]>} Array of chunks with score
 */
const findRelevantChunks = async (query) => {
    // 1. Generate Query Embedding
    const embeddings = await generateEmbeddingsBatch([query]);
    const queryEmbedding = embeddings[0];

    // 2. Fetch all chunks (Optimization: In production, use MongoDB Vector Search or specialized DB)
    const chunks = await Chunk.find({}, "text embedding").lean();

    if (chunks.length === 0) return [];

    // 3. Score & Sort
    const scoredChunks = chunks.map(chunk => ({
        ...chunk,
        score: calculateSimilarity(queryEmbedding, chunk.embedding)
    }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5

    // 4. Threshold Logic
    const isGenericQuery = /summary|overview|what.*info/i.test(query);
    const threshold = isGenericQuery ? 0.15 : 0.25;

    const relevantChunks = scoredChunks.filter(c => c.score > threshold);

    // If generic and no relevant, force top results
    if (isGenericQuery && relevantChunks.length === 0) {
        return scoredChunks.slice(0, 3);
    }

    return relevantChunks;
};

/**
 * Call Grok AI
 * @param {string} context 
 * @param {string} query 
 * @returns {Promise<string>} AI Response
 */
const getGrokResponse = async (context, query) => {
    try {
        const response = await fetch(grokConfig.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${grokConfig.apiKey}`
            },
            body: JSON.stringify({
                model: grokConfig.model,
                messages: buildRagPrompt(context, query),
                max_tokens: 800,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`Grok API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        // Fallback or rethrow? 
        // For simplicity, let controller handle fallback or return null
        return null;
    }
};

module.exports = { findRelevantChunks, getGrokResponse };
