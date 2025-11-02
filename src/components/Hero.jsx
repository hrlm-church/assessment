import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';

function Hero({ onNext }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Main glassmorphic card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 lg:p-16"
          >
            <div className="text-center">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
              >
                <span className="text-4xl">🌟</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
              >
                AM I CALLED?
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-700 text-lg md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                A free church planter assessment from the ministries of
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mb-10"
              >
                <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-sm md:text-base shadow-md">
                  RevDaveHarvey.com
                </span>
                <span className="text-gray-600 text-2xl">+</span>
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-sm md:text-base shadow-md">
                  Great Commission Collective
                </span>
              </motion.div>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                <div className="group backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl px-6 py-4 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">📋</span>
                    <span className="font-semibold text-gray-700">7 Key Areas</span>
                  </div>
                </div>
                <div className="group backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl px-6 py-4 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">⏱️</span>
                    <span className="font-semibold text-gray-700">5-10 Minutes</span>
                  </div>
                </div>
                <div className="group backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl px-6 py-4 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">📖</span>
                    <span className="font-semibold text-gray-700">Free Chapter</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNext}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Get Started</span>
                  <motion.span
                    className="relative text-2xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              >
                <div className="backdrop-blur-md bg-white/50 border border-white/70 rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-5xl mb-4">✓</div>
                  <h5 className="text-gray-800 font-bold text-lg mb-2">Proven Framework</h5>
                  <p className="text-gray-600 text-sm">Based on Dave Harvey's trusted "Am I Called?" methodology</p>
                </div>
                <div className="backdrop-blur-md bg-white/50 border border-white/70 rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-5xl mb-4">🔒</div>
                  <h5 className="text-gray-800 font-bold text-lg mb-2">Completely Free</h5>
                  <p className="text-gray-600 text-sm">No cost, no credit card required. Just honest self-reflection.</p>
                </div>
                <div className="backdrop-blur-md bg-white/50 border border-white/70 rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="text-5xl mb-4">📊</div>
                  <h5 className="text-gray-800 font-bold text-lg mb-2">Instant Results</h5>
                  <p className="text-gray-600 text-sm">Detailed analysis with actionable insights immediately</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
