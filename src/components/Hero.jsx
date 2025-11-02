import { useEffect } from 'react';
import { motion } from 'framer-motion';

function Hero({ onNext }) {
  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const elements = document.querySelectorAll('[data-speed]');
      elements.forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-purple-300 text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    Powered by Data Analytics
                  </span>
                </motion.div>

                <motion.h1
                  className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="block text-white">AM I</span>
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    CALLED?
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Discover your calling with our AI-powered assessment. Built on data from 700+ church planters, validated by{' '}
                  <span className="text-purple-400 font-semibold">Dave Harvey</span> and{' '}
                  <span className="text-purple-400 font-semibold">Great Commission Collective</span>.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg overflow-hidden shadow-2xl"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Assessment
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 rounded-full text-white font-bold text-lg backdrop-blur-sm transition-all"
                  >
                    Learn More
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="flex flex-wrap gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div>
                    <div className="text-3xl font-black text-purple-400">700+</div>
                    <div className="text-sm text-gray-400">Respondents</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-400">7</div>
                    <div className="text-sm text-gray-400">Key Areas</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-400">5-10</div>
                    <div className="text-sm text-gray-400">Minutes</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                {/* Central Circle */}
                <div className="relative mx-auto w-96 h-96">
                  {/* Rotating Ring */}
                  <motion.div
                    className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full"></div>
                  </motion.div>

                  {/* Middle Ring */}
                  <motion.div
                    className="absolute inset-8 border-4 border-pink-500/30 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full"></div>
                  </motion.div>

                  {/* Inner Circle */}
                  <div className="absolute inset-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="text-6xl font-black text-white mb-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ?
                      </motion.div>
                      <div className="text-purple-300 font-semibold">Discover</div>
                      <div className="text-gray-400 text-sm">Your Calling</div>
                    </div>
                  </div>

                  {/* Floating Icons */}
                  {[
                    { icon: '📊', pos: 'top-4 left-4', delay: 0 },
                    { icon: '🎯', pos: 'top-4 right-4', delay: 0.5 },
                    { icon: '📖', pos: 'bottom-4 left-4', delay: 1 },
                    { icon: '✨', pos: 'bottom-4 right-4', delay: 1.5 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${item.pos} w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-2xl`}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: item.delay,
                      }}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </div>

                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/20 rounded-full filter blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>

          {/* Features Bar */}
          <motion.div
            className="mt-20 grid grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { title: 'Data-Driven', desc: 'Statistical validation', icon: '📈' },
              { title: 'Proven Framework', desc: 'Dave Harvey methodology', icon: '✓' },
              { title: 'Instant Results', desc: 'Immediate analysis', icon: '⚡' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-24">
          <path fill="#0f172a" fillOpacity="0.3" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </section>
  );
}

export default Hero;
