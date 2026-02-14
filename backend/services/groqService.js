const Groq = require('groq-sdk');
const groqConfig = require('../config/groqConfig');

const groq = new Groq({
    apiKey: groqConfig.apiKey
});

/**
 * Generates completion using Groq API
 * @param {string} systemPrompt 
 * @param {string} userPrompt 
 * @returns {Promise<string>}
 */
const getCompletion = async (systemPrompt, userPrompt) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: groqConfig.model,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            stream: false
        });

        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Groq Service Error:', error);
        throw new Error('Failed to generate response from Groq');
    }
};

module.exports = { getCompletion };
