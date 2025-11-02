import { useState } from 'react';
import './assets/css/tailwind.css';
import Hero from './components/Hero';
import GettingStarted from './components/GettingStarted';
import EmailCapture from './components/EmailCapture';
import AboutAssessment from './components/AboutAssessment';
import Assessment from './components/Assessment';
import Results from './components/Results';
import BookRAG from './components/BookRAG';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [assessmentId, setAssessmentId] = useState(null); // Supabase record ID
  const [responses, setResponses] = useState({});

  const handleEmailSubmit = (id) => {
    // Store the assessment ID from Supabase
    setAssessmentId(id);
    setCurrentView('about');
  };

  const handleCompleteAssessment = (finalResponses) => {
    setResponses(finalResponses);
    setCurrentView('results');
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? This will start a new assessment.')) {
      setResponses({});
      setAssessmentId(null);
      setCurrentView('hero');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation Header - Minimal, Floating */}
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-lg border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Wordmark */}
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-[#18181B] tracking-tight">
                Am I Called?
              </h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('hero')}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView !== 'bookRAG'
                    ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm'
                    : 'bg-transparent text-[#6366F1] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                Assessment
              </button>
              <button
                onClick={() => setCurrentView('bookRAG')}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView === 'bookRAG'
                    ? 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm'
                    : 'bg-transparent text-[#6366F1] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                Search Book
              </button>
            </div>
          </div>
        </div>
      </nav>

      {currentView === 'hero' && (
        <Hero onNext={() => setCurrentView('gettingStarted')} />
      )}
      {currentView === 'gettingStarted' && (
        <GettingStarted
          onNext={() => setCurrentView('emailCapture')}
          onBack={() => setCurrentView('hero')}
        />
      )}
      {currentView === 'emailCapture' && (
        <EmailCapture
          onNext={handleEmailSubmit}
          onBack={() => setCurrentView('gettingStarted')}
        />
      )}
      {currentView === 'about' && (
        <AboutAssessment
          onNext={() => setCurrentView('assessment')}
          onBack={() => setCurrentView('emailCapture')}
        />
      )}
      {currentView === 'assessment' && (
        <Assessment
          assessmentId={assessmentId}
          initialResponses={responses}
          onComplete={handleCompleteAssessment}
          onBack={() => setCurrentView('about')}
        />
      )}
      {currentView === 'results' && (
        <Results
          assessmentId={assessmentId}
          responses={responses}
          onRestart={handleRestart}
        />
      )}
      {currentView === 'bookRAG' && (
        <BookRAG />
      )}
    </div>
  );
}

export default App;
