function Welcome({ onStart, onContinue, hasExistingResponses }) {
  const categories = [
    { icon: '🙏', title: 'Godliness', desc: 'Personal character & spiritual maturity', color: 'bg-purple/10 text-purple' },
    { icon: '🏠', title: 'Home Life', desc: 'Marriage, family & household', color: 'bg-success/10 text-success' },
    { icon: '📖', title: 'Preaching', desc: 'Teaching God\'s Word effectively', color: 'bg-primary/10 text-primary' },
    { icon: '💙', title: 'Shepherding', desc: 'Care & spiritual guidance', color: 'bg-info/10 text-info' },
    { icon: '✝️', title: 'Evangelism', desc: 'Passion for reaching the lost', color: 'bg-danger/10 text-danger' },
    { icon: '👥', title: 'Leadership', desc: 'Vision-casting & team building', color: 'bg-warning/10 text-warning' },
    { icon: '⛪', title: 'GCC Alignment', desc: 'Fit with church values', color: 'bg-pink/10 text-pink' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-2">
              Am I Called?
            </h1>
            <p className="text-lg text-gray-600">
              Self-Assessment for Pastoral Ministry & Church Planting
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center mb-6">
              Based on Dave Harvey's framework, this assessment helps prospective pastors and church planters
              evaluate their readiness across seven critical areas.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-dark text-sm mb-1">{category.title}</h3>
                  <p className="text-xs text-gray-600">{category.desc}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-dashed border-primary/30 p-5 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">56 Questions</p>
              <p className="text-xs text-gray-600">8 per category</p>
            </div>
          </div>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* How it Works */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">?</span>
              </div>
              <h3 className="font-semibold text-dark">How It Works</h3>
            </div>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Rate each statement (1-5 scale)</li>
              <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Be honest and thoughtful</li>
              <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Review your results</li>
              <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Identify next steps</li>
            </ol>
          </div>

          {/* Time Commitment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="font-semibold text-dark">Time Needed</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Approximately <span className="font-semibold text-dark">15-20 minutes</span> to complete all 56 questions.
            </p>
            <p className="text-xs text-gray-600">
              ✓ Your progress is automatically saved<br/>
              ✓ Resume anytime from where you left off
            </p>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-dark">Your Privacy</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              All responses are stored <span className="font-semibold text-dark">locally in your browser</span>.
            </p>
            <p className="text-xs text-gray-600">
              ✓ No data sent to servers<br/>
              ✓ Completely private<br/>
              ✓ Under your control
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hasExistingResponses && (
              <button
                onClick={onContinue}
                className="px-8 py-3 bg-success text-white rounded-lg font-semibold hover:bg-success/90 transition-all shadow-sm hover:shadow-md min-w-[200px]"
              >
                ↻ Continue Assessment
              </button>
            )}
            <button
              onClick={onStart}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-sm hover:shadow-md min-w-[200px]"
            >
              {hasExistingResponses ? '🔄 Start New Assessment' : '▶ Begin Assessment'}
            </button>
          </div>
          {hasExistingResponses && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Starting a new assessment will clear your previous responses
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
