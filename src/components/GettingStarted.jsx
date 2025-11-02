import { useEffect } from 'react';
import AOS from 'aos';

function GettingStarted({ onNext, onBack }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-slate-50">
      <div className="container relative">
        <div className="grid grid-cols-1">
          <div className="text-center mb-10" data-aos="fade-up">
            <span className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-4xl mb-4">
              🚀
            </span>
            <h3 className="mb-4 md:text-4xl text-3xl md:leading-normal leading-normal font-bold">
              Let's Get Started
            </h3>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-md p-8" data-aos="fade-up" data-aos-delay="100">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                The <span className="font-semibold text-slate-900">Am I Called Assessment</span> test is designed to help you assess certain strengths and weaknesses as you prayerfully evaluate the call from God to plant or pastor a church. The test is built around the seven questions that form the GCC Church Planter Profile. Taking the test helps you measure your suitability for church planting in and through Great Commission Collective.
              </p>

              <div className="bg-primary/5 border-s-4 border-primary rounded-e-md p-6 mb-6">
                <h5 className="text-xl font-semibold text-slate-900 mb-3">How It Works</h5>
                <p className="text-slate-600 mb-4">
                  Each question on the test is scored on a scale of <span className="font-semibold text-slate-900">1-5</span>, with "1" representing a <span className="font-semibold text-red-600">significant weakness</span> and "5" representing a <span className="font-semibold text-green-600">significant strength</span>.
                </p>
                <p className="text-slate-600 mb-0">
                  On the results page, you will receive a <span className="font-semibold text-slate-900">detailed analysis</span> on your answers as well as a <span className="font-semibold text-primary">free chapter</span> from "Am I Called?".
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">⏱️</span>
                    <div>
                      <h6 className="text-lg font-semibold text-slate-900 mb-2">Time Commitment</h6>
                      <p className="text-slate-600 text-sm mb-0">
                        The AIC Assessment will take about <span className="font-semibold">5-10 minutes</span> and is designed to be completed in one session.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">📋</span>
                    <div>
                      <h6 className="text-lg font-semibold text-slate-900 mb-2">7 Assessment Areas</h6>
                      <p className="text-slate-600 text-sm mb-0">
                        Godliness • Home Life • Preaching • Shepherding • Evangelism • Leadership • GCC Alignment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-200">
                <button
                  onClick={onBack}
                  className="text-slate-600 hover:text-primary font-medium transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={onNext}
                  className="py-3 px-8 inline-flex items-center gap-2 font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-primary hover:bg-primary-dark border-primary hover:border-primary-dark text-white rounded-md shadow-md hover:shadow-lg"
                >
                  Continue
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

export default GettingStarted;
