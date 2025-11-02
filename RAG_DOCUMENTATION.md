# RAG (Retrieval Augmented Generation) System Documentation

## Overview

This project now includes a complete RAG system for the "Am I Called?" book. The RAG system allows users to semantically search through the book content and find relevant passages based on natural language queries.

## Features

- **PDF Text Extraction**: Automatically extracts text from PDF files using PDF.js
- **Smart Chunking**: Breaks down the book into manageable chunks with configurable overlap for better context preservation
- **Vector Search**: Uses TF-IDF (Term Frequency-Inverse Document Frequency) for semantic similarity matching
- **Interactive UI**: User-friendly interface to search and explore the book content
- **Page References**: All search results include the source page number for easy reference

## Architecture

### Components

1. **pdfExtractor.js** (`src/lib/pdfExtractor.js`)
   - Extracts text from PDF files
   - Provides functions to extract full text or page-by-page
   - Built on PDF.js library

2. **textChunker.js** (`src/lib/textChunker.js`)
   - Splits text into chunks with configurable size and overlap
   - Supports sentence-based chunking to avoid breaking mid-sentence
   - Includes metadata (page number, chunk index) with each chunk

3. **vectorStore.js** (`src/lib/vectorStore.js`)
   - Implements TF-IDF vectorization
   - Provides cosine similarity search
   - In-memory storage for fast retrieval

4. **ragService.js** (`src/lib/ragService.js`)
   - Main service that orchestrates PDF processing, chunking, and search
   - Singleton pattern for easy access across the application
   - Provides query interface with configurable parameters

5. **BookRAG.jsx** (`src/components/BookRAG.jsx`)
   - React component with search interface
   - Displays search results with relevance scores
   - Shows document statistics

## Usage

### Accessing the RAG System

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application in your browser

3. Click on "Search Book" in the navigation bar

4. Wait for the PDF to be processed (this happens automatically on first load)

5. Enter your query and search!

### Example Queries

- "What does it mean to be called?"
- "How do I know if I am called to ministry?"
- "What are the qualifications for ministry?"
- "How should I prepare for ministry?"

### Programmatic Usage

You can also use the RAG service programmatically in your code:

```javascript
import ragService from './lib/ragService';

// Initialize with a PDF
await ragService.initialize('/path/to/pdf', {
  chunkSize: 1000,
  overlap: 200
});

// Query the document
const results = ragService.query('What is calling?', {
  topK: 5,
  includeContext: true
});

// Access results
results.results.forEach(result => {
  console.log(`Page ${result.page}: ${result.text}`);
  console.log(`Relevance: ${result.similarity}`);
});

// Get statistics
const stats = ragService.getStats();
console.log(stats);
```

## Configuration

### Chunk Size and Overlap

You can configure the chunking parameters when initializing the RAG service:

```javascript
await ragService.initialize(pdfPath, {
  chunkSize: 1000,  // Characters per chunk
  overlap: 200      // Characters to overlap between chunks
});
```

**Recommended values:**
- `chunkSize`: 800-1200 characters
  - Smaller chunks: More precise matches, less context
  - Larger chunks: More context, potentially less precise
- `overlap`: 100-300 characters
  - Helps maintain context across chunk boundaries
  - Recommended: 15-25% of chunk size

### Search Parameters

Configure search behavior when querying:

```javascript
const results = ragService.query(query, {
  topK: 5,              // Number of results to return
  includeContext: true  // Include formatted context string
});
```

## How It Works

### 1. PDF Processing
When initialized, the RAG service:
1. Loads the PDF using PDF.js
2. Extracts text from each page
3. Maintains page number information

### 2. Chunking
The text is then chunked:
1. Text is split into overlapping chunks
2. Each chunk maintains metadata (page number, chunk index)
3. Overlap ensures important context isn't lost at chunk boundaries

### 3. Vectorization
Each chunk is converted to a TF-IDF vector:
1. Text is tokenized (lowercased, punctuation removed)
2. Term Frequency (TF) is calculated for each token
3. Inverse Document Frequency (IDF) is calculated across all chunks
4. TF-IDF vectors are created for efficient similarity search

### 4. Search
When a user queries:
1. Query is converted to a TF-IDF vector using the same vocabulary
2. Cosine similarity is calculated between query and all document vectors
3. Results are ranked by similarity score
4. Top K results are returned with metadata

## Performance Considerations

- **Initialization Time**: First load takes 3-10 seconds depending on PDF size
- **Search Time**: Queries typically complete in <100ms
- **Memory Usage**: All chunks and vectors are stored in memory
- **Browser Compatibility**: Requires modern browser with ES6 support

## Limitations

1. **Client-Side Processing**: PDF processing happens in the browser, which may be slow for very large PDFs
2. **TF-IDF Limitations**: Uses simple TF-IDF instead of advanced embeddings like BERT or GPT
3. **No Persistence**: Vector store is recreated on each page load
4. **Memory Constraints**: Large PDFs may cause memory issues in the browser

## Future Enhancements

Potential improvements:
- [ ] Use advanced embeddings (OpenAI, Sentence Transformers)
- [ ] Add persistence layer (IndexedDB, Supabase)
- [ ] Server-side processing for better performance
- [ ] Support for multiple PDFs
- [ ] Highlighted excerpts in results
- [ ] Export results functionality
- [ ] Filter by page ranges
- [ ] Semantic search improvements

## File Structure

```
src/
├── lib/
│   ├── pdfExtractor.js    # PDF text extraction
│   ├── textChunker.js     # Text chunking utilities
│   ├── vectorStore.js     # Vector storage and search
│   └── ragService.js      # Main RAG orchestration
├── components/
│   └── BookRAG.jsx        # RAG UI component
└── Am I Called_ - Updatded and Revised Version.pdf
```

## Dependencies

- `pdfjs-dist`: PDF parsing and text extraction
- React: UI components
- Tailwind CSS: Styling

## Troubleshooting

### PDF Not Loading
- Check that the PDF path is correct in `BookRAG.jsx`
- Ensure the PDF is accessible from the public directory
- Check browser console for errors

### Search Returns No Results
- Try rephrasing your query
- Use more specific keywords
- Check that the PDF was successfully processed (look for initialization message)

### Slow Performance
- Reduce chunk size for faster processing
- Reduce topK parameter when querying
- Consider server-side processing for large PDFs

## Support

For issues or questions, please refer to the main project repository.
