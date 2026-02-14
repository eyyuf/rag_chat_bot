/**
 * Chunks text into segments of fixed size with overlap
 * @param {string} text - The input text to chunk
 * @param {number} size - Maximum size of each chunk
 * @param {number} overlap - Overlap between consecutive chunks
 * @returns {string[]} Array of text chunks
 */
const chunkText = (text, size = 450, overlap = 100) => {
    if (!text) return [];

    const chunks = [];
    let currentPos = 0;

    while (currentPos < text.length) {
        const end = Math.min(currentPos + size, text.length);
        chunks.push(text.substring(currentPos, end));

        if (end === text.length) break;

        currentPos += (size - overlap);
    }

    return chunks;
};

module.exports = { chunkText };
