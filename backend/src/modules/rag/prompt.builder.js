/**
 * Build RAG Prompt for Grok AI
 * @param {string} context - Retrieved chunks text
 * @param {string} query - User question
 * @returns {object[]} messages array for Grok API
 */
const buildRagPrompt = (context, query) => {
    return [
        {
            role: "system",
            content: `You are an assistant that answers strictly using the provided context. If the answer is not in the context, say you do not have enough information.`
        },
        {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${query}`
        }
    ];
};

module.exports = { buildRagPrompt };
