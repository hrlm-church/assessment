import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
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

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

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
      // Create new assessment record in Supabase
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

      // Pass the assessment ID to parent component
      onNext(data.id);
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      <div className="container relative px-4 z-10">
        <div className="max-w-4xl mx-auto">
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
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50 text-4xl mb-6"
            >
              📧
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Your Information
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Please provide your details to receive your personalized assessment results and free chapter from "Am I Called?".
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      First Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.firstName ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors text-white placeholder-gray-500`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Last Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.lastName ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors text-white placeholder-gray-500`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Your Email <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors text-white placeholder-gray-500`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Present Role <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.role ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors text-white`}
                  >
                    <option value="" className="bg-slate-800">—Please choose an option—</option>
                    <option value="plant" className="bg-slate-800">I hope to plant a church</option>
                    <option value="pastor" className="bg-slate-800">I want to pastor on a team</option>
                    <option value="student" className="bg-slate-800">I am a Bible or seminary student</option>
                    <option value="leader" className="bg-slate-800">I am a local church leader curious about my calling</option>
                  </select>
                  {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Are you married? <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.maritalStatus ? 'border-red-500' : 'border-purple-500/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors text-white`}
                  >
                    <option value="" className="bg-slate-800">—Please choose an option—</option>
                    <option value="married" className="bg-slate-800">Married</option>
                    <option value="single" className="bg-slate-800">Single</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-400 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>

                <div className="bg-gradient-to-br from-purple-950/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-5 shadow-sm">
                  <div className="flex gap-3">
                    <span className="text-2xl">🔒</span>
                    <p className="text-sm text-gray-300 mb-0 leading-relaxed">
                      Your information is secure and will only be used to send you your assessment results and the free chapter. We respect your privacy.
                    </p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4">
                    <p className="text-red-400 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-purple-500/20">
                  <motion.button
                    type="button"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-purple-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>←</span> Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {isSubmitting ? 'Saving...' : 'Next'}
                    {!isSubmitting && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
        </div>
      </div>
    </section>
  );
}

export default EmailCapture;
