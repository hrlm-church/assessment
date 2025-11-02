import { motion } from 'framer-motion';

function AboutAssessment({ onNext, onBack }) {
  return (
    <div className="bg-[#FAFAFA] py-16">
      <div className="mx-auto max-w-[720px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-4">About the Assessment</h2>
          <p className="text-[15px] text-[#71717A] leading-relaxed">
            Welcome to the Am I Called? Assessment! This tool is designed to help you evaluate God's calling to plant or pastor. While assessments are hardly new ideas, AIC takes the step of using data analytics to help interpret the results for you.
          </p>
        </motion.div>

        {/* Content Cards - Stacked */}
        <div className="space-y-4">
          {/* Data-Driven Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-[#6366F1] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <div>
                <h3 className="text-base font-medium text-[#18181B] mb-2">Data-Driven Insights</h3>
                <p className="text-sm text-[#71717A] leading-relaxed mb-3">
                  We spent the first two years collecting data from over 700 respondents who used the 1.0 version of the assessment. We analyzed items using state-of-the-art statistical analyses to ensure what you see on the results page is precise and constructive.
                </p>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  We pray this tool is as interesting and helpful to you as the process of development has been for us!
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2x2 Grid of Features */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Quick & Easy',
                description: 'Takes about 5-10 minutes and is designed to be completed in one session'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: 'Focused & Relevant',
                description: 'Built around the seven questions that form the GCC Church Planter Profile'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Scientifically Validated',
                description: 'Based on data from 700+ respondents and rigorous statistical analysis'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: 'Bonus Content',
                description: 'Receive a free chapter from "Am I Called?" with your results'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className="bg-white border border-[#E5E7EB] rounded-lg p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-[#6366F1] mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#18181B] mb-1">{feature.title}</h4>
                    <p className="text-sm text-[#71717A] leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-base font-medium text-[#18181B] mb-4">What Happens Next?</h3>
            <ol className="space-y-3">
              {[
                "You'll answer questions across 7 key ministry areas",
                "Each question is rated on a 1-5 scale",
                "Receive detailed analysis of your strengths and growth areas",
                "Get actionable next steps for your calling journey"
              ].map((step, index) => (
                <li key={index} className="flex gap-3 items-start text-sm text-[#71717A]">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-[#6366F1] text-white font-medium rounded-full text-xs">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="px-5 py-2 text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-[#059669] text-white text-sm font-medium rounded-md hover:bg-[#047857] transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            Start Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutAssessment;
