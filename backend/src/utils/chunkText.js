/**
 * Advanced Text Splitting (Recursive Character Splitter Logic)
 * Splits text into semantic chunks with overlap to preserve context.
 * 
 * @param {string} text - The full text content
 * @param {number} maxLength - Chunk size target (default 1500)
 * @param {number} overlap - Overlap size (default 300)
 */
const splitTextIntoChunks = (text, maxLength = 1500, overlap = 300) => {
    if (!text) return [];

    const chunks = [];
    let start = 0;

    while (start < text.length) {
        let end = Math.min(start + maxLength, text.length);

        if (end < text.length) {
            // Check for natural break points (paragraph, then sentence, then word)
            const breakPoints = ["\n\n", "\n", ". ", " "];

            for (const separator of breakPoints) {
                const lastSeparatorIndex = text.lastIndexOf(separator, end);
                if (lastSeparatorIndex > start + (maxLength * 0.5)) { // Ensure chunk isn't too small
                    end = lastSeparatorIndex + separator.length;
                    break;
                }
            }
        }

        const chunkText = text.slice(start, end).trim();
        if (chunkText.length > 50) { // Ignore tiny fragments
            chunks.push(chunkText);
        }

        // Move window forward, minus overlap
        start += (end - start) - overlap;

        // Ensure forward progress
        if (start >= end) start = end;
    }

    return chunks;
};

module.exports = { splitTextIntoChunks };
