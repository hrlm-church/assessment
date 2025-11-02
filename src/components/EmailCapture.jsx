import { useState } from 'react';
import { motion } from 'framer-motion';

function EmailCapture({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.consent) newErrors.consent = 'You must agree to receive emails';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const response = await fetch(`${supabaseUrl}/functions/v1/start-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          consent: formData.consent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start assessment');
      }

      const data = await response.json();

      // Store session info in localStorage
      localStorage.setItem('aic_session_id', data.sessionId);
      localStorage.setItem('aic_assessment_id', data.assessmentId);
      localStorage.setItem('aic_contact_id', data.contactId);
      localStorage.setItem('aic_session_token', data.sessionToken);

      onNext(data.assessmentId);
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] py-16">
      <div className="mx-auto max-w-[720px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-4">Your Information</h2>
          <p className="text-[15px] text-[#71717A] max-w-[600px] mx-auto">
            Enter your name and email to receive your results and a free chapter from Am I Called?
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-[#E5E7EB] rounded-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-2">
                  First Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 text-[15px] bg-white border ${
                    errors.firstName ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2 transition-all`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-[13px] text-[#DC2626] mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-2">
                  Last Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 text-[15px] bg-white border ${
                    errors.lastName ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2 transition-all`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-[13px] text-[#DC2626] mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-2">
                Email Address <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-[15px] bg-white border ${
                  errors.email ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2 transition-all`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-[13px] text-[#DC2626] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-[#6366F1] border-[#E5E7EB] rounded focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2"
                />
                <div className="flex-1">
                  <label htmlFor="consent" className="text-[13px] text-[#71717A] leading-relaxed cursor-pointer">
                    I agree to receive emails as described. We'll send occasional resources from Dave Harvey. Unsubscribe anytime.
                  </label>
                  {errors.consent && (
                    <p className="text-[13px] text-[#DC2626] mt-2">{errors.consent}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-[#FEE2E2] border border-[#DC2626] rounded-md p-4">
                <p className="text-[13px] text-[#DC2626]">{errors.submit}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors disabled:opacity-40"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#6366F1] text-white text-sm font-medium rounded-md hover:bg-[#4F46E5] transition-all shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Next →'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default EmailCapture;
