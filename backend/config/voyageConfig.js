module.exports = {
    apiKey: process.env.VOYAGE_API_KEY,
    model: process.env.VOYAGE_MODEL || 'voyage-3-large',
    baseUrl: 'https://api.voyageai.com/v1/embeddings'
};
