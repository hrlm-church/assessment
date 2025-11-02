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
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Am I Called Assessment</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('hero')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'hero' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Assessment
              </button>
              <button
                onClick={() => setCurrentView('bookRAG')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'bookRAG' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
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
