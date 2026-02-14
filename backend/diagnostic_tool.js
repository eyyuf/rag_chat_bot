require('dotenv').config();
const mongoose = require('mongoose');
const Vector = require('./models/Vector');
const { getEmbeddings } = require('./services/embeddingService');
const { cosineSimilarity } = require('./utils/vectorUtils');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const vector = await Vector.findOne({});
        if (!vector) {
            console.log('No vectors found.');
            process.exit(0);
        }

        console.log('--- VECTOR CONTENT BEGIN ---');
        console.log(vector.content);
        console.log('--- VECTOR CONTENT END ---');

        const query = "What is the project overview?";
        console.log(`Query: "${query}"`);

        try {
            const [queryEmbedding] = await getEmbeddings(query, 'query');
            const similarity = cosineSimilarity(queryEmbedding, vector.embedding);
            console.log(`Similarity: ${similarity.toFixed(4)}`);
        } catch (e) {
            console.error(e);
        }

        process.exit(0);
    })
    .catch(console.error);
