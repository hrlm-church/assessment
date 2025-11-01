function GettingStarted({ onNext, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-4">
              Let's Get Started
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-10">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The <strong>Am I Called Assessment</strong> test is designed to help you assess certain strengths and weaknesses as you prayerfully evaluate the call from God to plant or pastor a church. The test is built around the seven questions that form the GCC Church Planter Profile. Taking the test helps you measure your suitability for church planting in and through Great Commission Collective.
            </p>

            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-dark mb-3">How It Works</h3>
              <p className="text-gray-700 mb-4">
                Each question on the test is scored on a scale of <strong>1-5</strong>, with "1" representing a <span className="text-danger font-semibold">significant weakness</span> and "5" representing a <span className="text-success font-semibold">significant strength</span>.
              </p>
              <p className="text-gray-700">
                On the results page, you will receive a <strong>detailed analysis</strong> on your answers as well as a <strong>free chapter</strong> from "Am I Called?".
              </p>
            </div>

            <div className="bg-info/5 border border-info/20 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">⏱️</div>
                <div>
                  <h3 className="text-lg font-semibold text-dark mb-2">Time Commitment</h3>
                  <p className="text-gray-700 mb-0">
                    The AIC Assessment will take about <strong>5-10 minutes</strong> and is designed to be completed in one session.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-success/5 border border-success/20 rounded-lg p-5">
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-semibold text-dark mb-2">What You'll Get</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Personalized assessment results</li>
                  <li>• Strengths & growth areas</li>
                  <li>• Free chapter from the book</li>
                  <li>• Actionable next steps</li>
                </ul>
              </div>
              <div className="bg-purple/5 border border-purple/20 rounded-lg p-5">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-semibold text-dark mb-2">7 Assessment Areas</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Godliness</li>
                  <li>• Home Life</li>
                  <li>• Preaching</li>
                  <li>• Shepherding & more</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
