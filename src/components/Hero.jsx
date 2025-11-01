function Hero({ onNext }) {
  return (
    <div className="relative min-h-screen">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-700 to-primary-900"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AM I CALLED?
            </h1>
            <div className="w-24 h-1 bg-white/30 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              A free church planter assessment from the ministries of{' '}
              <span className="font-semibold text-white">RevDaveHarvey.com</span> and{' '}
              <span className="font-semibold text-white">Great Commission Collective</span>.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white">
              <span className="font-medium">📋 7 Key Areas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white">
              <span className="font-medium">⏱️ 5-10 Minutes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white">
              <span className="font-medium">📖 Free Chapter</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <button
              onClick={onNext}
              className="group relative inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              <span>Get Started</span>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-white font-semibold mb-2">Proven Framework</h3>
              <p className="text-white/70 text-sm">Based on Dave Harvey's trusted methodology</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-white font-semibold mb-2">Completely Free</h3>
              <p className="text-white/70 text-sm">No cost, no credit card required</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-white font-semibold mb-2">Instant Results</h3>
              <p className="text-white/70 text-sm">Detailed analysis with actionable insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero;
