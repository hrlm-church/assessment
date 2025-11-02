import { motion } from 'framer-motion';

function Hero({ onNext }) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Research-Backed',
      description: 'Validated framework from pastoral studies'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: 'Confidential',
      description: 'Your data remains private and secure'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Instant Insights',
      description: 'Receive results immediately'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] py-24 sm:py-32">
      <div className="mx-auto max-w-[960px] px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Optional Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#71717A]">
              New Assessment Available
            </span>
          </div>

          {/* H1 Title */}
          <h1 className="text-4xl font-semibold tracking-tight text-[#18181B] sm:text-5xl mb-6">
            Clarify Your Calling
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-[600px] text-lg text-[#71717A] mb-8">
            A thoughtful assessment to explore pastoral readiness across seven key dimensions
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button
              onClick={onNext}
              className="px-5 py-2.5 bg-[#6366F1] text-white text-sm font-medium rounded-md hover:bg-[#4F46E5] transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
            >
              Begin Assessment
            </button>
            <button
              className="px-5 py-2.5 bg-transparent text-[#6366F1] text-sm font-medium rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 text-[13px] text-[#A1A1AA]">
            <span>700+ responses</span>
            <span>·</span>
            <span>7 dimensions</span>
            <span>·</span>
            <span>10 minutes</span>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-[#E5E7EB] rounded-lg p-6 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px"
            >
              <div className="text-[#6366F1] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-medium text-[#18181B] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
