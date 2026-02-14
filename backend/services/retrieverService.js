const { getEmbeddings } = require('./embeddingService');
const { searchSimilar } = require('./vectorStoreService');

/**
 * High level retrieval logic: Embed query -> Search vectors
 */
const retrieveRelevantContext = async (query) => {
    const [queryEmbedding] = await getEmbeddings(query, 'query');
    const results = await searchSimilar(queryEmbedding, 0.35, 8);

    if (results.length > 0) {
        console.log(`Max similarity found: ${results[0].similarity.toFixed(4)}`);
    } else {
        console.log('No chunks found above threshold.');
    }

    // Requirement: Pass only top 3 to LLM
    return results.slice(0, 3);
};

module.exports = { retrieveRelevantContext };
