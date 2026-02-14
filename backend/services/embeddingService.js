const axios = require('axios');
const voyageConfig = require('../config/voyageConfig');

/**
 * Gets embeddings for a given input (string or array of strings)
 * @param {string|string[]} input 
 * @returns {Promise<number[][]>}
 */
const getEmbeddings = async (input, inputType = 'document') => {
    try {
        const response = await axios.post(
            voyageConfig.baseUrl,
            {
                input: Array.isArray(input) ? input : [input],
                model: voyageConfig.model,
                input_type: inputType
            },
            {
                headers: {
                    'Authorization': `Bearer ${voyageConfig.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Voyage returns data array with embedding field
        return response.data.data.map(item => item.embedding);
    } catch (error) {
        console.error('Embedding Service Error:', error.response?.data || error.message);
        throw new Error('Failed to generate embeddings via Voyage');
    }
};

module.exports = { getEmbeddings };
