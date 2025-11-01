import { useState } from 'react';

function EmailCapture({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    maritalStatus: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(formData));
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <span className="text-4xl">📧</span>
            </div>
            <h1 className="text-4xl font-bold text-dark mb-4">
              Your Information
            </h1>
            <p className="text-gray-600">
              Please provide your details to receive your personalized assessment results and free chapter from "Am I Called?".
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-dark mb-2">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.firstName ? 'border-danger' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-danger text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-dark mb-2">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.lastName ? 'border-danger' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-danger text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-dark mb-2">
                Your Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.email ? 'border-danger' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Present Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-dark mb-2">
                Present Role <span className="text-danger">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.role ? 'border-danger' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white`}
              >
                <option value="">—Please choose an option—</option>
                <option value="plant">I hope to plant a church</option>
                <option value="pastor">I want to pastor on a team</option>
                <option value="student">I am a Bible or seminary student</option>
                <option value="leader">I am a local church leader curious about my calling</option>
              </select>
              {errors.role && <p className="text-danger text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Marital Status */}
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-semibold text-dark mb-2">
                Are you married? <span className="text-danger">*</span>
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.maritalStatus ? 'border-danger' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white`}
              >
                <option value="">—Please choose an option—</option>
                <option value="married">Married</option>
                <option value="single">Single</option>
              </select>
              {errors.maritalStatus && <p className="text-danger text-sm mt-1">{errors.maritalStatus}</p>}
            </div>

            {/* Privacy Notice */}
            <div className="bg-info/5 border border-info/20 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">🔒</div>
                <p className="text-sm text-gray-700">
                  Your information is secure and will only be used to send you your assessment results and the free chapter. We respect your privacy.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
              >
                Next →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmailCapture;
