import { useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import AOS from 'aos';
import BackgroundImage from '../assets/images/bg/1.jpg';

function Hero({ onNext }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <section
      style={{ backgroundImage: `url(${BackgroundImage})` }}
      className="py-36 lg:py-64 w-full table relative bg-center bg-cover"
      id="home"
    >
      <div className="absolute inset-0 bg-slate-900/70"></div>
      <div className="container relative z-1">
        <div className="grid grid-cols-1 mt-12 text-center md:text-start">
          <h4 className="text-white lg:text-6xl text-5xl lg:leading-normal leading-normal font-bold mb-7" data-aos="fade-up">
            AM I CALLED?
          </h4>

          <p className="text-white/90 mb-0 max-w-2xl text-xl md:text-2xl leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            A free church planter assessment from the ministries of{' '}
            <span className="font-semibold text-primary">RevDaveHarvey.com</span> and{' '}
            <span className="font-semibold text-primary">Great Commission Collective</span>.
          </p>

          <div className="flex flex-wrap gap-4 mt-8" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white inline-flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="font-medium">7 Key Areas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white inline-flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span className="font-medium">5-10 Minutes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white inline-flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="font-medium">Free Chapter</span>
            </div>
          </div>

          <div className="relative mt-10" data-aos="fade-up" data-aos-delay="300">
            <button
              onClick={onNext}
              className="py-3 px-8 inline-flex items-center gap-3 font-semibold tracking-wide border align-middle duration-500 text-lg text-center bg-primary hover:bg-primary-dark border-primary hover:border-primary-dark text-white rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Get Started</span>
              <span className="text-2xl">→</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-6 text-center md:text-start">
              <div className="text-5xl mb-4">✓</div>
              <h5 className="text-white font-semibold text-lg mb-2">Proven Framework</h5>
              <p className="text-white/70 text-sm mb-0">Based on Dave Harvey's trusted "Am I Called?" methodology</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-6 text-center md:text-start">
              <div className="text-5xl mb-4">🔒</div>
              <h5 className="text-white font-semibold text-lg mb-2">Completely Free</h5>
              <p className="text-white/70 text-sm mb-0">No cost, no credit card required. Just honest self-reflection.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-6 text-center md:text-start">
              <div className="text-5xl mb-4">📊</div>
              <h5 className="text-white font-semibold text-lg mb-2">Instant Results</h5>
              <p className="text-white/70 text-sm mb-0">Detailed analysis with actionable insights immediately</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
