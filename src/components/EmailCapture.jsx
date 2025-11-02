import { useState, useEffect } from 'react';
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
    <section className="relative py-16 md:py-24 bg-slate-50">
      <div className="container relative">
        <div className="grid grid-cols-1">
          <div className="text-center mb-10" data-aos="fade-up">
            <span className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-4xl mb-4">
              📧
            </span>
            <h3 className="mb-4 md:text-4xl text-3xl md:leading-normal leading-normal font-bold">
              Your Information
            </h3>
            <p className="text-slate-600 max-w-xl mx-auto">
              Please provide your details to receive your personalized assessment results and free chapter from "Am I Called?".
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-md p-8" data-aos="fade-up" data-aos-delay="100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-600' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-600' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Your Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-600' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Present Role <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.role ? 'border-red-600' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white`}
                  >
                    <option value="">—Please choose an option—</option>
                    <option value="plant">I hope to plant a church</option>
                    <option value="pastor">I want to pastor on a team</option>
                    <option value="student">I am a Bible or seminary student</option>
                    <option value="leader">I am a local church leader curious about my calling</option>
                  </select>
                  {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Are you married? <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.maritalStatus ? 'border-red-600' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white`}
                  >
                    <option value="">—Please choose an option—</option>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-600 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
                  <div className="flex gap-3">
                    <span className="text-xl">🔒</span>
                    <p className="text-sm text-slate-600 mb-0">
                      Your information is secure and will only be used to send you your assessment results and the free chapter. We respect your privacy.
                    </p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="text-slate-600 hover:text-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-8 inline-flex items-center gap-2 font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-primary hover:bg-primary-dark border-primary hover:border-primary-dark text-white rounded-md shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Next'}
                    {!isSubmitting && <span>→</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailCapture;
