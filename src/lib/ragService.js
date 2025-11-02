import { extractTextByPage } from './pdfExtractor';
import { chunkWithMetadata } from './textChunker';
import VectorStore from './vectorStore';

/**
 * RAG (Retrieval Augmented Generation) Service
 * Handles PDF processing, chunking, and semantic search
 */
class RAGService {
  constructor() {
    this.vectorStore = new VectorStore();
    this.isInitialized = false;
    this.pdfPath = null;
    this.chunks = [];
  }

  /**
   * Initialize the RAG service with a PDF file
   * @param {string} pdfPath - Path to the PDF file
   * @param {Object} options - Configuration options
   * @param {number} options.chunkSize - Size of each text chunk
   * @param {number} options.overlap - Overlap between chunks
   */
  async initialize(pdfPath, options = {}) {
    const { chunkSize = 1000, overlap = 200 } = options;

    try {
      console.log('Extracting text from PDF...');
      this.pdfPath = pdfPath;

      // Extract text from PDF by page
      const pages = await extractTextByPage(pdfPath);
      console.log(`Extracted ${pages.length} pages`);

      // Chunk the text with metadata
      this.chunks = chunkWithMetadata(pages, chunkSize, overlap);
      console.log(`Created ${this.chunks.length} chunks`);

      // Add chunks to vector store
      this.vectorStore.addDocuments(this.chunks);
      console.log('Vector store initialized');

      this.isInitialized = true;

      return {
        success: true,
        totalPages: pages.length,
        totalChunks: this.chunks.length
      };
    } catch (error) {
      console.error('Error initializing RAG service:', error);
      throw error;
    }
  }

  /**
   * Query the RAG system
   * @param {string} query - The user's query
   * @param {Object} options - Query options
   * @param {number} options.topK - Number of results to return
   * @param {boolean} options.includeContext - Whether to include surrounding context
   */
  query(query, options = {}) {
    if (!this.isInitialized) {
      throw new Error('RAG service not initialized. Call initialize() first.');
    }

    const { topK = 5, includeContext = true } = options;

    // Search for similar chunks
    const results = this.vectorStore.search(query, topK);

    // Format results
    const formattedResults = results.map(result => ({
      text: result.text,
      page: result.metadata.page,
      chunkIndex: result.metadata.chunkIndex,
      similarity: result.similarity.toFixed(4)
    }));

    // Create a context string from all results
    const context = formattedResults
      .map((r, i) => `[Page ${r.page}, Relevance: ${r.similarity}]\n${r.text}`)
      .join('\n\n---\n\n');

    return {
      query,
      results: formattedResults,
      context,
      totalResults: results.length
    };
  }

  /**
   * Get a specific chunk by index
   */
  getChunk(chunkIndex) {
    return this.chunks[chunkIndex] || null;
  }

  /**
   * Get all chunks for a specific page
   */
  getChunksByPage(pageNumber) {
    return this.chunks.filter(chunk => chunk.page === pageNumber);
  }

  /**
   * Get statistics about the loaded document
   */
  getStats() {
    if (!this.isInitialized) {
      return null;
    }

    const pages = new Set(this.chunks.map(c => c.page));

    return {
      isInitialized: this.isInitialized,
      pdfPath: this.pdfPath,
      totalChunks: this.chunks.length,
      totalPages: pages.size,
      averageChunkSize: Math.round(
        this.chunks.reduce((sum, c) => sum + c.text.length, 0) / this.chunks.length
      )
    };
  }

  /**
   * Reset the RAG service
   */
  reset() {
    this.vectorStore.clear();
    this.isInitialized = false;
    this.pdfPath = null;
    this.chunks = [];
  }
}

// Create a singleton instance
const ragService = new RAGService();

export default ragService;
