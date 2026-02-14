const { retrieveRelevantContext } = require('./retrieverService');
const { getCompletion } = require('./groqService');

const chatWithRAG = async (userQuestion) => {
    console.log('[RAG] Starting retrieval...');
    const retrievalStart = Date.now();
    const topChunks = await retrieveRelevantContext(userQuestion);
    console.log(`[RAG] Retrieval took ${Date.now() - retrievalStart}ms, found ${topChunks.length} chunks`);

    if (topChunks.length === 0) {
        return {
            answer: "I could not find relevant information in the knowledge base.",
            sources: [],
            confidence: 0
        };
    }

    const contextText = topChunks.map(c => c.content).join('\n\n---\n\n');
    const sources = topChunks.map(c => ({
        filename: c.filename,
        pageNumber: c.pageNumber
    }));

    const systemPrompt = `You are a helpful AI assistant. Use the provided context to answer the user's question safely and accurately. 
    If the answer is not explicitly in the context, you can say "I don't have that specific information in my documents," but try to be helpful based on what you do found. Do not make up facts.`;

    const userPrompt = `CONTEXT:
${contextText}

QUESTION:
${userQuestion}`;

    console.log('[RAG] Calling LLM...');
    const llmStart = Date.now();
    const answer = await getCompletion(systemPrompt, userPrompt);
    console.log(`[RAG] LLM response took ${Date.now() - llmStart}ms`);

    // Calculate confidence as average similarity of retrieved chunks
    const avgSimilarity = topChunks.reduce((sum, c) => sum + c.similarity, 0) / topChunks.length;

    return {
        answer,
        sources,
        confidence: avgSimilarity
    };
};

module.exports = { chatWithRAG };
