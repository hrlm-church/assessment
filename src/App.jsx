import { useState } from 'react';
import './assets/css/tailwind.css';
import Hero from './components/Hero';
import GettingStarted from './components/GettingStarted';
import EmailCapture from './components/EmailCapture';
import AboutAssessment from './components/AboutAssessment';
import Assessment from './components/Assessment';
import Results from './components/Results';

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
    </div>
  );
}

export default App;
