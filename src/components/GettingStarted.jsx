import { motion } from 'framer-motion';

function GettingStarted({ onNext, onBack }) {
  return (
    <div className="bg-[#FAFAFA] py-16">
      <div className="mx-auto max-w-[720px] px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-xs text-[#A1A1AA]">Home / Assessment</p>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-4">How It Works</h2>
          <p className="text-[15px] text-[#71717A] leading-relaxed">
            The Am I Called Assessment is designed to help you assess certain strengths and weaknesses as you prayerfully evaluate the call from God to plant or pastor a church. The test is built around the seven questions that form the GCC Church Planter Profile.
          </p>
        </motion.div>

        {/* Content Cards - Stacked */}
        <div className="space-y-4">
          {/* Card 1: Understanding the Scale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-base font-medium text-[#18181B] mb-4">Understanding the Scale</h3>

            {/* 5-point scale visual */}
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    num === 3 ? 'bg-[#6366F1] text-white' : 'bg-[#F3F4F6] text-[#71717A]'
                  }`}>
                    {num}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-[#E5E7EB] mb-3"></div>
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>Strongly Disagree</span>
              <span>Neutral</span>
              <span>Strongly Agree</span>
            </div>
          </motion.div>

          {/* Card 2: Time & Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-base font-medium text-[#18181B] mb-4">Time & Structure</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-[#18181B]">35 questions across 7 dimensions</p>
                  <p className="text-sm text-[#71717A]">Approximately 8–10 minutes</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: The Dimensions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-base font-medium text-[#18181B] mb-4">The Dimensions</h3>
            <div className="space-y-3">
              {[
                { name: 'Godliness', desc: 'Personal walk with Christ' },
                { name: 'Home Life', desc: 'Family relationships and stewardship' },
                { name: 'Preaching', desc: 'Teaching and communication skills' },
                { name: 'Shepherding', desc: 'Care and discipleship abilities' },
                { name: 'Evangelism', desc: 'Gospel proclamation and outreach' },
                { name: 'Leadership', desc: 'Vision casting and team building' },
                { name: 'GCC Alignment', desc: 'Theological and methodological fit' }
              ].map((dim, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-[#F3F4F6] last:border-b-0 last:pb-0">
                  <svg className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-[#18181B]">{dim.name}</p>
                    <p className="text-sm text-[#71717A]">{dim.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            className="px-5 py-2 text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-[#6366F1] text-white text-sm font-medium rounded-md hover:bg-[#4F46E5] transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
