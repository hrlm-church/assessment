import { useEffect } from 'react';
import AOS from 'aos';

function AboutAssessment({ onNext, onBack }) {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-slate-50">
      <div className="container relative">
        <div className="grid grid-cols-1">
          <div className="text-center mb-10" data-aos="fade-up">
            <span className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-4xl mb-4">
              📖
            </span>
            <h3 className="mb-4 md:text-4xl text-3xl md:leading-normal leading-normal font-bold">
              About the Assessment
            </h3>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-md p-8" data-aos="fade-up" data-aos-delay="100">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Welcome to the <span className="font-semibold text-slate-900">Am I Called? Assessment!</span> This tool is designed to help you evaluate God's calling to plant or pastor. While assessments are hardly new ideas, AIC takes the step of using data analytics to help interpret the results for you.
              </p>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-md p-8 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-5xl flex-shrink-0">📊</span>
                  <div>
                    <h5 className="text-2xl font-bold text-slate-900 mb-4">Data-Driven Insights</h5>
                    <p className="text-slate-600 mb-4">
                      Specifically, we spent the first two years collecting data from <span className="font-semibold text-slate-900">over 700 respondents</span> who used the 1.0 version of the assessment. We analyzed items using <span className="font-semibold text-slate-900">state-of-the-art statistical analyses</span> to ensure what you see on the results page is a precise and constructive result.
                    </p>
                    <p className="text-slate-600 mb-0">
                      We pray this tool is as interesting and helpful to you as the process of development has been for us!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="text-4xl mb-3">⏱️</div>
                  <h6 className="font-semibold text-slate-900 text-lg mb-2">Quick & Easy</h6>
                  <p className="text-slate-600 text-sm mb-0">
                    The AIC Assessment will take about <span className="font-semibold">5-10 minutes</span> and is designed to be completed in one session.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h6 className="font-semibold text-slate-900 text-lg mb-2">Focused & Relevant</h6>
                  <p className="text-slate-600 text-sm mb-0">
                    Built around the seven questions that form the <span className="font-semibold">GCC Church Planter Profile</span>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="text-4xl mb-3">✓</div>
                  <h6 className="font-semibold text-slate-900 text-lg mb-2">Scientifically Validated</h6>
                  <p className="text-slate-600 text-sm mb-0">
                    Based on data from <span className="font-semibold">700+ respondents</span> and rigorous statistical analysis.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="text-4xl mb-3">📖</div>
                  <h6 className="font-semibold text-slate-900 text-lg mb-2">Bonus Content</h6>
                  <p className="text-slate-600 text-sm mb-0">
                    Receive a <span className="font-semibold text-primary">free chapter</span> from "Am I Called?" with your results.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 border-s-4 border-primary rounded-e-md p-6 mb-6">
                <h6 className="font-semibold text-slate-900 text-lg mb-3">What Happens Next?</h6>
                <ol className="space-y-2 text-slate-600 mb-0">
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

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-200">
                <button
                  onClick={onBack}
                  className="text-slate-600 hover:text-primary font-medium transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={onNext}
                  className="py-3 px-8 inline-flex items-center gap-2 font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md shadow-md hover:shadow-lg"
                >
                  Start Assessment
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutAssessment;
