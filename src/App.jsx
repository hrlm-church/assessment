import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { assessmentCategories } from './data/assessmentData';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
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

  const handleStartAssessment = () => {
    setCurrentView('assessment');
  };

  const handleCompleteAssessment = (finalResponses) => {
    setResponses(finalResponses);
    setCurrentView('results');
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? This will clear all your responses.')) {
      setResponses({});
      localStorage.removeItem('assessmentResponses');
      setCurrentView('welcome');
    }
  };

  const handleContinue = () => {
    setCurrentView('assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentView === 'welcome' && (
        <Welcome
          onStart={handleStartAssessment}
          onContinue={handleContinue}
          hasExistingResponses={Object.keys(responses).length > 0}
        />
      )}
      {currentView === 'assessment' && (
        <Assessment
          initialResponses={responses}
          onComplete={handleCompleteAssessment}
          onBack={() => setCurrentView('welcome')}
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
