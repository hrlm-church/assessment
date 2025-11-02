/**
 * Simple TF-IDF based vector store for text similarity search
 */

class VectorStore {
  constructor() {
    this.documents = [];
    this.vocabularyIDF = {};
    this.documentVectors = [];
  }

  /**
   * Tokenize text into words
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Calculate term frequency for a document
   */
  calculateTF(tokens) {
    const tf = {};
    const totalTokens = tokens.length;

    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });

    // Normalize by document length
    Object.keys(tf).forEach(token => {
      tf[token] = tf[token] / totalTokens;
    });

    return tf;
  }

  /**
   * Calculate IDF for the entire corpus
   */
  calculateIDF() {
    const documentCount = this.documents.length;
    const vocabulary = {};

    // Count how many documents contain each term
    this.documents.forEach(doc => {
      const uniqueTokens = new Set(doc.tokens);
      uniqueTokens.forEach(token => {
        vocabulary[token] = (vocabulary[token] || 0) + 1;
      });
    });

    // Calculate IDF
    Object.keys(vocabulary).forEach(token => {
      this.vocabularyIDF[token] = Math.log(documentCount / vocabulary[token]);
    });
  }

  /**
   * Create TF-IDF vector for a document
   */
  createTFIDFVector(tf) {
    const vector = {};

    Object.keys(tf).forEach(token => {
      if (this.vocabularyIDF[token]) {
        vector[token] = tf[token] * this.vocabularyIDF[token];
      }
    });

    return vector;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    // Get all unique keys
    const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

    allKeys.forEach(key => {
      const val1 = vec1[key] || 0;
      const val2 = vec2[key] || 0;

      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    });

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  /**
   * Add documents to the vector store
   */
  addDocuments(chunks) {
    this.documents = chunks.map((chunk, index) => {
      const tokens = this.tokenize(chunk.text);
      const tf = this.calculateTF(tokens);

      return {
        id: index,
        text: chunk.text,
        metadata: {
          page: chunk.page,
          chunkIndex: chunk.chunkIndex
        },
        tokens,
        tf
      };
    });

    // Calculate IDF for the corpus
    this.calculateIDF();

    // Create TF-IDF vectors for all documents
    this.documentVectors = this.documents.map(doc => ({
      id: doc.id,
      vector: this.createTFIDFVector(doc.tf),
      text: doc.text,
      metadata: doc.metadata
    }));
  }

  /**
   * Search for similar documents
   */
  search(query, topK = 5) {
    // Tokenize and vectorize the query
    const queryTokens = this.tokenize(query);
    const queryTF = this.calculateTF(queryTokens);
    const queryVector = this.createTFIDFVector(queryTF);

    // Calculate similarity with all documents
    const similarities = this.documentVectors.map(doc => ({
      ...doc,
      similarity: this.cosineSimilarity(queryVector, doc.vector)
    }));

    // Sort by similarity and return top K
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter(result => result.similarity > 0);
  }

  /**
   * Get all documents
   */
  getAllDocuments() {
    return this.documents;
  }

  /**
   * Clear the vector store
   */
  clear() {
    this.documents = [];
    this.vocabularyIDF = {};
    this.documentVectors = [];
  }
}

export default VectorStore;
