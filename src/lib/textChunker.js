/**
 * Split text into chunks with overlap
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Maximum size of each chunk (in characters)
 * @param {number} overlap - Number of characters to overlap between chunks
 * @returns {Array<string>} - Array of text chunks
 */
export function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);

    chunks.push(chunk.trim());

    // Move forward by chunkSize minus overlap
    startIndex += chunkSize - overlap;

    // Prevent infinite loop if chunk is smaller than overlap
    if (startIndex <= 0 || chunkSize <= overlap) {
      break;
    }
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Split text into chunks by sentences to avoid breaking mid-sentence
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Approximate size of each chunk (in characters)
 * @param {number} overlap - Number of sentences to overlap
 * @returns {Array<string>} - Array of text chunks
 */
export function chunkTextBySentence(text, chunkSize = 1000, sentenceOverlap = 2) {
  // Split text into sentences (simple approach)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const sentenceLength = sentence.length;

    // If adding this sentence would exceed chunk size and we have content
    if (currentLength + sentenceLength > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push(currentChunk.join(' ').trim());

      // Start new chunk with overlap from previous chunk
      const overlapStart = Math.max(0, currentChunk.length - sentenceOverlap);
      currentChunk = currentChunk.slice(overlapStart);
      currentLength = currentChunk.join(' ').length;
    }

    currentChunk.push(sentence);
    currentLength += sentenceLength;
  }

  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' ').trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Create chunks with metadata
 * @param {Array<{page: number, text: string}>} pages - Array of page objects
 * @param {number} chunkSize - Size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {Array<{text: string, page: number, chunkIndex: number}>} - Array of chunk objects with metadata
 */
export function chunkWithMetadata(pages, chunkSize = 1000, overlap = 200) {
  const chunksWithMetadata = [];
  let globalChunkIndex = 0;

  pages.forEach(({ page, text }) => {
    const chunks = chunkText(text, chunkSize, overlap);

    chunks.forEach((chunk) => {
      chunksWithMetadata.push({
        text: chunk,
        page: page,
        chunkIndex: globalChunkIndex++
      });
    });
  });

  return chunksWithMetadata;
}
