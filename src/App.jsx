import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import GettingStarted from './components/GettingStarted';
import EmailCapture from './components/EmailCapture';
import AboutAssessment from './components/AboutAssessment';
import Assessment from './components/Assessment';
import Results from './components/Results';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [responses, setResponses] = useState({});

  // Load saved responses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('assessmentResponses');
    if (saved) {
      setResponses(JSON.parse(saved));
    }
  }, []);

  // Save responses to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem('assessmentResponses', JSON.stringify(responses));
    }
  }, [responses]);

  const handleCompleteAssessment = (finalResponses) => {
    setResponses(finalResponses);
    setCurrentView('results');
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? This will clear all your responses and start over.')) {
      setResponses({});
      localStorage.removeItem('assessmentResponses');
      localStorage.removeItem('userInfo');
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
          onNext={() => setCurrentView('about')}
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
          initialResponses={responses}
          onComplete={handleCompleteAssessment}
          onBack={() => setCurrentView('about')}
        />
      )}
      {currentView === 'results' && (
        <Results
          responses={responses}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
