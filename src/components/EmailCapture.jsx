import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

function EmailCapture({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    maritalStatus: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.role) newErrors.role = 'Please select your present role';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Please select your marital status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            role: formData.role,
            marital_status: formData.maritalStatus,
            responses: {},
            completed: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        setErrors({ submit: 'Failed to save your information. Please try again.' });
        setIsSubmitting(false);
        return;
      }

      onNext(data.id);
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
            Please provide your details to receive your personalized assessment results and free chapter from "Am I Called?".
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

            {/* Role */}
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-2">
                Present Role <span className="text-[#DC2626]">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-[15px] bg-white border ${
                  errors.role ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2 transition-all`}
              >
                <option value="">—Please choose an option—</option>
                <option value="plant">I hope to plant a church</option>
                <option value="pastor">I want to pastor on a team</option>
                <option value="student">I am a Bible or seminary student</option>
                <option value="leader">I am a local church leader curious about my calling</option>
              </select>
              {errors.role && (
                <p className="text-[13px] text-[#DC2626] mt-1">{errors.role}</p>
              )}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-2">
                Marital Status <span className="text-[#DC2626]">*</span>
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-[15px] bg-white border ${
                  errors.maritalStatus ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#A5B4FC] focus:ring-offset-2 transition-all`}
              >
                <option value="">—Please choose an option—</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
              </select>
              {errors.maritalStatus && (
                <p className="text-[13px] text-[#DC2626] mt-1">{errors.maritalStatus}</p>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-md p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-[#71717A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  Your information is secure and will only be used to send you your assessment results and the free chapter. We respect your privacy.
                </p>
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
