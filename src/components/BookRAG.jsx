import { useState, useEffect } from 'react';
import ragService from '../lib/ragService';

function BookRAG() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Initialize RAG service on component mount
  useEffect(() => {
    initializeRAG();
  }, []);

  const initializeRAG = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pdfPath = '/src/Am I Called_ - Updatded and Revised Version.pdf';
      const result = await ragService.initialize(pdfPath, {
        chunkSize: 1000,
        overlap: 200
      });

      setIsInitialized(true);
      setStats(ragService.getStats());
      console.log('RAG initialized:', result);
    } catch (err) {
      setError(`Failed to initialize: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      const searchResults = ragService.query(query, {
        topK: 5,
        includeContext: true
      });

      setResults(searchResults);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Book RAG - "Am I Called?"
          </h1>
          <p className="text-gray-600">
            Search and explore the book using AI-powered semantic search
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800">Processing PDF and creating embeddings...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={initializeRAG}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Document Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalPages}</div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.totalChunks}</div>
                <div className="text-sm text-gray-600">Chunks</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.averageChunkSize}</div>
                <div className="text-sm text-gray-600">Avg Chunk Size</div>
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        {isInitialized && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSearch}>
              <label className="block text-lg font-semibold mb-3">
                Ask a question about the book:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What are the signs of being called to ministry?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Example Queries */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Example questions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'What does it mean to be called?',
                  'How do I know if I am called to ministry?',
                  'What are the qualifications for ministry?',
                  'How should I prepare for ministry?'
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Search Results for: "{results.query}"
            </h2>
            <p className="text-gray-600 mb-6">
              Found {results.totalResults} relevant passages
            </p>

            <div className="space-y-6">
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Page {result.page}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Relevance: {(parseFloat(result.similarity) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">Result #{index + 1}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{result.text}</p>
                </div>
              ))}
            </div>

            {/* Full Context */}
            <details className="mt-8 border-t pt-6">
              <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-blue-600">
                View Full Context (for AI integration)
              </summary>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {results.context}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookRAG;
