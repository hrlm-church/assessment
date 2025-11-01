function Welcome({ onStart, onContinue, hasExistingResponses }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Am I Called?
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Self-Assessment for Pastoral Ministry & Church Planting
        </p>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700">
            This assessment tool is based on Dave Harvey's "Am I Called?" framework and helps
            prospective pastors and church planters evaluate their readiness across seven critical areas:
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Godliness</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Home Life</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Preaching</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Shepherding</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Evangelistic Focus</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>Leadership</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">✓</span>
              <span>GCC Family Alignment</span>
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Rate yourself on each statement using a 1-5 scale</li>
              <li>Be honest and thoughtful in your responses</li>
              <li>Review your category summaries and overall results</li>
              <li>Identify strengths, growth areas, and next steps</li>
            </ol>
          </div>

          <p className="text-gray-700">
            <strong>Time commitment:</strong> Approximately 15-20 minutes
          </p>

          <p className="text-sm text-gray-600 italic mt-4">
            Your responses are saved locally in your browser and are never sent to a server.
            You can pause and return anytime to complete the assessment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {hasExistingResponses && (
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Assessment
            </button>
          )}
          <button
            onClick={onStart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {hasExistingResponses ? 'Start New Assessment' : 'Begin Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
