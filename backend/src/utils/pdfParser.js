const fs = require("fs");
const pdf = require("pdf-parse");

/**
 * Extract text from PDF buffer or file path
 * @param {Buffer|string} source - File buffer (memory storage) or filepath (disk storage)
 * @param {string} mimetype 
 */
const extractText = async (source, mimetype) => {
    let text = "";

    if (mimetype === "application/pdf") {
        // Handle both buffer (memory storage) and filepath (disk storage)
        const dataBuffer = Buffer.isBuffer(source) ? source : fs.readFileSync(source);
        const data = await pdf(dataBuffer);
        text = data.text;
    } else if (Buffer.isBuffer(source)) {
        // Text file from buffer
        text = source.toString("utf8");
    } else {
        // Text file from path
        text = fs.readFileSync(source, "utf8");
    }

    return text.replace(/\s+/g, " ").trim();
};

module.exports = { extractText };
