import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';

function AboutAssessment({ onNext, onBack }) {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container relative px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-4xl mb-6"
            >
              📖
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              About the Assessment
            </h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8 md:p-12"
          >
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Welcome to the <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Am I Called? Assessment!</span> This tool is designed to help you evaluate God's calling to plant or pastor. While assessments are hardly new ideas, AIC takes the step of using data analytics to help interpret the results for you.
            </p>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
              <div className="flex items-start gap-4">
                <span className="text-6xl flex-shrink-0">📊</span>
                <div className="relative">
                  <h5 className="text-2xl font-black text-gray-900 mb-4">Data-Driven Insights</h5>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Specifically, we spent the first two years collecting data from <span className="font-bold px-2 py-1 bg-white/70 rounded-lg">over 700 respondents</span> who used the 1.0 version of the assessment. We analyzed items using <span className="font-bold">state-of-the-art statistical analyses</span> to ensure what you see on the results page is a precise and constructive result.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We pray this tool is as interesting and helpful to you as the process of development has been for us!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⏱️</div>
                <h6 className="font-black text-gray-900 text-xl mb-2">Quick & Easy</h6>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The AIC Assessment will take about <span className="font-bold text-blue-600">5-10 minutes</span> and is designed to be completed in one session.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                <h6 className="font-black text-gray-900 text-xl mb-2">Focused & Relevant</h6>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Built around the seven questions that form the <span className="font-bold">GCC Church Planter Profile</span>.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">✓</div>
                <h6 className="font-black text-gray-900 text-xl mb-2">Scientifically Validated</h6>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Based on data from <span className="font-bold">700+ respondents</span> and rigorous statistical analysis.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                <h6 className="font-black text-gray-900 text-xl mb-2">Bonus Content</h6>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receive a <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">free chapter</span> from "Am I Called?" with your results.
                </p>
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-8 mb-8 shadow-lg">
              <h6 className="font-black text-gray-900 text-2xl mb-4 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                What Happens Next?
              </h6>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full text-sm">1</span>
                  <span className="pt-1">You'll answer questions across 7 key ministry areas</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full text-sm">2</span>
                  <span className="pt-1">Each question is rated on a 1-5 scale</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full text-sm">3</span>
                  <span className="pt-1">Receive detailed analysis of your strengths and growth areas</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full text-sm">4</span>
                  <span className="pt-1">Get actionable next steps for your calling journey</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors flex items-center gap-2"
              >
                <span>←</span> Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                Start Assessment
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutAssessment;
