function AboutAssessment({ onNext, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <span className="text-4xl">📖</span>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-4">
              About the Assessment
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-10">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Welcome to the <strong>Am I Called? Assessment!</strong> This tool is designed to help you evaluate God's calling to plant or pastor. While assessments are hardly new ideas, AIC takes the step of using data analytics to help interpret the results for you.
            </p>

            <div className="bg-gradient-to-br from-primary/5 to-purple/5 border border-primary/20 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Data-Driven Insights
              </h3>
              <p className="text-gray-700 mb-4">
                Specifically, we spent the first two years collecting data from <strong>over 700 respondents</strong> who used the 1.0 version of the assessment. We analyzed items using <strong>state-of-the-art statistical analyses</strong> to ensure what you see on the results page is a precise and constructive result.
              </p>
              <p className="text-gray-700">
                We pray this tool is as interesting and helpful to you as the process of development has been for us!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-success/5 border border-success/20 rounded-lg p-6">
                <div className="text-3xl mb-3">⏱️</div>
                <h4 className="font-semibold text-dark text-lg mb-2">Quick & Easy</h4>
                <p className="text-gray-700 text-sm">
                  The AIC Assessment will take about <strong>5-10 minutes</strong> and is designed to be completed in one session.
                </p>
              </div>

              <div className="bg-info/5 border border-info/20 rounded-lg p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-dark text-lg mb-2">Focused & Relevant</h4>
                <p className="text-gray-700 text-sm">
                  Built around the seven questions that form the <strong>GCC Church Planter Profile</strong>.
                </p>
              </div>

              <div className="bg-purple/5 border border-purple/20 rounded-lg p-6">
                <div className="text-3xl mb-3">✓</div>
                <h4 className="font-semibold text-dark text-lg mb-2">Scientifically Validated</h4>
                <p className="text-gray-700 text-sm">
                  Based on data from <strong>700+ respondents</strong> and rigorous statistical analysis.
                </p>
              </div>

              <div className="bg-warning/5 border border-warning/20 rounded-lg p-6">
                <div className="text-3xl mb-3">📖</div>
                <h4 className="font-semibold text-dark text-lg mb-2">Bonus Content</h4>
                <p className="text-gray-700 text-sm">
                  Receive a <strong>free chapter</strong> from "Am I Called?" with your results.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6">
              <h4 className="font-semibold text-dark text-lg mb-3">What Happens Next?</h4>
              <ol className="space-y-2 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1.</span>
                  <span>You'll answer questions across 7 key ministry areas</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2.</span>
                  <span>Each question is rated on a 1-5 scale</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3.</span>
                  <span>Receive detailed analysis of your strengths and growth areas</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4.</span>
                  <span>Get actionable next steps for your calling journey</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-success text-white rounded-lg font-semibold hover:bg-success/90 transition-all shadow-sm hover:shadow-md"
            >
              Start Assessment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutAssessment;
