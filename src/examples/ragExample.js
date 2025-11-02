/**
 * RAG Service Usage Examples
 *
 * This file demonstrates how to use the RAG service programmatically
 */

import ragService from '../lib/ragService';

/**
 * Example 1: Basic initialization and search
 */
export async function basicExample() {
  try {
    // Initialize the RAG service with the PDF
    console.log('Initializing RAG service...');
    const initResult = await ragService.initialize(
      '/src/Am I Called_ - Updatded and Revised Version.pdf',
      {
        chunkSize: 1000,
        overlap: 200
      }
    );

    console.log('Initialization complete:', initResult);

    // Perform a search
    const query = 'What does it mean to be called to ministry?';
    const results = ragService.query(query, {
      topK: 3,
      includeContext: true
    });

    console.log(`\nSearch results for: "${query}"\n`);
    results.results.forEach((result, index) => {
      console.log(`Result ${index + 1}:`);
      console.log(`  Page: ${result.page}`);
      console.log(`  Relevance: ${result.similarity}`);
      console.log(`  Text: ${result.text.substring(0, 200)}...`);
      console.log('---');
    });

    return results;
  } catch (error) {
    console.error('Error in basic example:', error);
  }
}

/**
 * Example 2: Get document statistics
 */
export function getDocumentStats() {
  const stats = ragService.getStats();

  if (!stats) {
    console.log('RAG service not initialized');
    return null;
  }

  console.log('Document Statistics:');
  console.log(`  Total Pages: ${stats.totalPages}`);
  console.log(`  Total Chunks: ${stats.totalChunks}`);
  console.log(`  Average Chunk Size: ${stats.averageChunkSize} characters`);

  return stats;
}

/**
 * Example 3: Multiple queries
 */
export async function multipleQueriesExample() {
  const queries = [
    'What are the signs of a calling?',
    'How do I prepare for ministry?',
    'What qualifications are needed?',
    'How do I know if God is calling me?'
  ];

  console.log('Running multiple queries...\n');

  queries.forEach(query => {
    const results = ragService.query(query, { topK: 2 });

    console.log(`Query: ${query}`);
    console.log(`Found ${results.totalResults} results`);

    if (results.results.length > 0) {
      const topResult = results.results[0];
      console.log(`  Top result (Page ${topResult.page}, ${topResult.similarity} relevance):`);
      console.log(`  ${topResult.text.substring(0, 150)}...`);
    }
    console.log('---\n');
  });
}

/**
 * Example 4: Search with specific page context
 */
export function searchWithPageContext(query, pageNumber) {
  // Get all chunks from a specific page
  const pageChunks = ragService.getChunksByPage(pageNumber);

  console.log(`\nPage ${pageNumber} has ${pageChunks.length} chunks`);

  // Perform general search
  const results = ragService.query(query, { topK: 5 });

  // Filter results to show which ones are from the specified page
  const resultsFromPage = results.results.filter(r => r.page === pageNumber);

  console.log(`\nResults from page ${pageNumber}: ${resultsFromPage.length}`);

  return {
    allResults: results,
    pageResults: resultsFromPage,
    pageChunks
  };
}

/**
 * Example 5: Context extraction for AI integration
 */
export async function extractContextForAI(userQuestion) {
  // Search for relevant context
  const results = ragService.query(userQuestion, {
    topK: 3,
    includeContext: true
  });

  // Format context for AI consumption
  const contextForAI = {
    question: userQuestion,
    context: results.context,
    sources: results.results.map(r => ({
      page: r.page,
      relevance: r.similarity,
      text: r.text
    }))
  };

  console.log('Context prepared for AI:');
  console.log(JSON.stringify(contextForAI, null, 2));

  return contextForAI;
}

/**
 * Example 6: Custom chunk size experiment
 */
export async function experimentWithChunkSizes() {
  const pdfPath = '/src/Am I Called_ - Updatded and Revised Version.pdf';
  const testQuery = 'What is calling?';
  const chunkConfigs = [
    { chunkSize: 500, overlap: 100 },
    { chunkSize: 1000, overlap: 200 },
    { chunkSize: 1500, overlap: 300 }
  ];

  console.log('Testing different chunk configurations...\n');

  for (const config of chunkConfigs) {
    // Reset and reinitialize with new config
    ragService.reset();
    await ragService.initialize(pdfPath, config);

    const stats = ragService.getStats();
    const results = ragService.query(testQuery, { topK: 3 });

    console.log(`Config: ${config.chunkSize}/${config.overlap}`);
    console.log(`  Total Chunks: ${stats.totalChunks}`);
    console.log(`  Top Result Relevance: ${results.results[0]?.similarity || 'N/A'}`);
    console.log('---');
  }
}

// Export all examples
export default {
  basicExample,
  getDocumentStats,
  multipleQueriesExample,
  searchWithPageContext,
  extractContextForAI,
  experimentWithChunkSizes
};
