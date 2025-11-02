import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';

function AboutAssessment({ onNext, onBack }) {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="container relative px-4 z-10">
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
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50 text-4xl mb-6"
            >
              📖
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About the Assessment
            </h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 md:p-12"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Welcome to the <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Am I Called? Assessment!</span> This tool is designed to help you evaluate God's calling to plant or pastor. While assessments are hardly new ideas, AIC takes the step of using data analytics to help interpret the results for you.
            </p>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/50 to-slate-900/50 border-l-4 border-purple-500 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
              <div className="flex items-start gap-4">
                <span className="text-6xl flex-shrink-0">📊</span>
                <div className="relative">
                  <h5 className="text-2xl font-black text-white mb-4">Data-Driven Insights</h5>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Specifically, we spent the first two years collecting data from <span className="font-bold px-2 py-1 bg-slate-800/70 rounded-lg text-purple-300">over 700 respondents</span> who used the 1.0 version of the assessment. We analyzed items using <span className="font-bold text-white">state-of-the-art statistical analyses</span> to ensure what you see on the results page is a precise and constructive result.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    We pray this tool is as interesting and helpful to you as the process of development has been for us!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⏱️</div>
                <h6 className="font-black text-white text-xl mb-2">Quick & Easy</h6>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The AIC Assessment will take about <span className="font-bold text-purple-400">5-10 minutes</span> and is designed to be completed in one session.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                <h6 className="font-black text-white text-xl mb-2">Focused & Relevant</h6>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Built around the seven questions that form the <span className="font-bold text-white">GCC Church Planter Profile</span>.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">✓</div>
                <h6 className="font-black text-white text-xl mb-2">Scientifically Validated</h6>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Based on data from <span className="font-bold text-white">700+ respondents</span> and rigorous statistical analysis.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                <h6 className="font-black text-white text-xl mb-2">Bonus Content</h6>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Receive a <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">free chapter</span> from "Am I Called?" with your results.
                </p>
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-purple-950/50 to-slate-900/50 border-l-4 border-purple-500 rounded-2xl p-8 mb-8 shadow-lg">
              <h6 className="font-black text-white text-2xl mb-4 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                What Happens Next?
              </h6>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm shadow-lg shadow-purple-500/50">1</span>
                  <span className="pt-1">You'll answer questions across 7 key ministry areas</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm shadow-lg shadow-purple-500/50">2</span>
                  <span className="pt-1">Each question is rated on a 1-5 scale</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm shadow-lg shadow-purple-500/50">3</span>
                  <span className="pt-1">Receive detailed analysis of your strengths and growth areas</span>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold rounded-full text-sm shadow-lg shadow-purple-500/50">4</span>
                  <span className="pt-1">Get actionable next steps for your calling journey</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-purple-500/20">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="text-gray-400 hover:text-purple-400 font-semibold transition-colors flex items-center gap-2"
              >
                <span>←</span> Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/70 transition-all duration-300 flex items-center gap-3"
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
