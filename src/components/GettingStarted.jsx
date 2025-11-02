import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
              🚀
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Let's Get Started
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
              The <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Am I Called Assessment</span> test is designed to help you assess certain strengths and weaknesses as you prayerfully evaluate the call from God to plant or pastor a church. The test is built around the seven questions that form the GCC Church Planter Profile.
            </p>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
              <h5 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                How It Works
              </h5>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Each question on the test is scored on a scale of <span className="font-bold px-2 py-1 bg-white/70 rounded-lg">1-5</span>, with "1" representing a <span className="font-bold text-red-600">significant weakness</span> and "5" representing a <span className="font-bold text-green-600">significant strength</span>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                On the results page, you will receive a <span className="font-bold text-gray-900">detailed analysis</span> on your answers as well as a <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">free chapter</span> from "Am I Called?".
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl group-hover:scale-110 transition-transform">⏱️</span>
                  <div>
                    <h6 className="text-xl font-bold text-gray-900 mb-2">Time Commitment</h6>
                    <p className="text-gray-600">
                      The AIC Assessment will take about <span className="font-bold text-blue-600">5-10 minutes</span> and is designed to be completed in one session.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-white/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl group-hover:scale-110 transition-transform">📋</span>
                  <div>
                    <h6 className="text-xl font-bold text-gray-900 mb-2">7 Assessment Areas</h6>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Godliness • Home Life • Preaching • Shepherding • Evangelism • Leadership • GCC Alignment
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="text-gray-600 hover:text-blue-600 font-semibold transition-colors flex items-center gap-2"
              >
                <span>←</span> Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                Continue
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

export default GettingStarted;
