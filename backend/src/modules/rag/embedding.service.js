const voyageConfig = require("../../config/voyage");

/**
 * Generate Embeddings in Batches via Voyage AI
 * Ensures API limits are respected.
 * 
 * @param {string[]} texts - Array of text chunks
 * @param {number} batchSize - How many chunks per request (default 10)
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
const generateEmbeddingsBatch = async (texts, batchSize = 10) => {
    const embeddings = [];

    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(`Processing embedding batch ${Math.floor(i / batchSize) + 1} / ${Math.ceil(texts.length / batchSize)}`);

        try {
            const response = await fetch(voyageConfig.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${voyageConfig.apiKey}`
                },
                body: JSON.stringify({
                    input: batch,
                    model: voyageConfig.model
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Voyage AI API error: ${response.status} - ${errorData}`);
            }

            const result = await response.json();
            if (result.data) {
                embeddings.push(...result.data.map(item => item.embedding));
            }
        } catch (error) {
            console.error(`Batch processing failed for index ${i}:`, error.message);
            throw error;
        }
    }
    return embeddings;
};

module.exports = { generateEmbeddingsBatch };
