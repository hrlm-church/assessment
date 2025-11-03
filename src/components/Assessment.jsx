import { useState, useEffect, useRef } from 'react';
import { assessmentCategories, scoreLabels } from '../data/assessmentData';
import { supabase } from '../lib/supabase';

function Assessment({ assessmentId, initialResponses, onComplete, onBack }) {
  const [responses, setResponses] = useState(initialResponses || {});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const saveTimeoutRef = useRef(null);

  const currentCategory = assessmentCategories[currentCategoryIndex];
  const totalCategories = assessmentCategories.length;

  // Calculate total questions and current question number
  const getTotalQuestions = () => {
    return assessmentCategories.reduce((sum, cat) => sum + cat.questions.length, 0);
  };

  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentCategoryIndex; i++) {
      count += assessmentCategories[i].questions.length;
    }
    // Count answered questions in current section
    const answeredInCurrent = currentCategory.questions.filter((_, index) => getScore(index) !== null).length;
    return count + answeredInCurrent + 1;
  };

  const getSectionState = (categoryIndex) => {
    const progress = getSectionProgress(categoryIndex);
    const isCurrent = categoryIndex === currentCategoryIndex;

    if (isCurrent) return 'active';
    if (categoryIndex < currentCategoryIndex && progress.isComplete) return 'completed';
    return 'upcoming';
  };

  // Auto-save responses to Supabase (debounced 300ms)
  useEffect(() => {
    if (!assessmentId || Object.keys(responses).length === 0) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('assessments')
          .update({
            responses: responses,
            updated_at: new Date().toISOString()
          })
          .eq('id', assessmentId);

        if (error) {
          console.error('Error saving responses:', error);
        }
      } catch (err) {
        console.error('Unexpected error saving:', err);
      } finally {
        setIsSaving(false);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [responses, assessmentId]);

  const handleScoreChange = (questionIndex, score) => {
    const key = `${currentCategory.id}_${questionIndex}`;
    setResponses(prev => ({
      ...prev,
      [key]: score
    }));
  };

  const getScore = (questionIndex) => {
    const key = `${currentCategory.id}_${questionIndex}`;
    return responses[key] || null;
  };

  const isCategoryComplete = () => {
    return currentCategory.questions.every((_, index) => getScore(index) !== null);
  };

  const handleNext = () => {
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      // Scroll to top of section
      const nextSection = assessmentCategories[currentCategoryIndex + 1];
      const element = document.getElementById(nextSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      // Scroll to top of section
      const prevSection = assessmentCategories[currentCategoryIndex - 1];
      const element = document.getElementById(prevSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getTotalProgress = () => {
    const totalQuestions = getTotalQuestions();
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const getSectionProgress = (categoryIndex) => {
    const category = assessmentCategories[categoryIndex];
    const answeredCount = category.questions.filter((_, qIndex) => {
      const key = `${category.id}_${qIndex}`;
      return responses[key] !== undefined && responses[key] !== null;
    }).length;
    return {
      answered: answeredCount,
      total: category.questions.length,
      isComplete: answeredCount === category.questions.length
    };
  };

  const navigateToSection = (index) => {
    setCurrentCategoryIndex(index);
    setIsMobileMenuOpen(false);
    // Scroll to section heading
    const sectionId = assessmentCategories[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Update URL hash
    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Sync hash with current section
  useEffect(() => {
    const sectionId = currentCategory.id;
    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  }, [currentCategoryIndex, currentCategory.id]);

  // Section label mapping (exact as specified)
  const sectionLabels = {
    'godliness': 'Godliness',
    'home_life': 'Home Life',
    'preaching': 'Preaching',
    'shepherding': 'Shepherding',
    'evangelism': 'Evangelistic Focus',
    'leadership': 'Leadership',
    'gcc_alignment': 'GCC Alignment'
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200" style={{ height: 'var(--header-h)' }}>
        {/* Thin Progress Line */}
        <div className="h-0.5 bg-slate-200">
          <div
            className="h-full bg-[#4F8EF7] transition-all duration-300"
            style={{ width: `${getTotalProgress()}%` }}
          />
        </div>

        {/* Header Content */}
        <div className="h-[calc(var(--header-h)-2px)] px-4 md:px-6 flex items-center justify-between">
          {/* Left: Menu (mobile) + Exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden text-slate-600 hover:text-[#4F8EF7]"
              aria-label="Open menu"
            >
              ☰
            </button>
            <button
              onClick={onBack}
              className="text-sm text-slate-600 hover:text-[#4F8EF7] transition-colors"
            >
              ← Exit
            </button>
          </div>

          {/* Center: Title (hidden on mobile) */}
          <h1 className="hidden md:block text-lg font-semibold text-slate-900">
            Am I Called?
          </h1>

          {/* Right: Question Counter */}
          <div className="text-sm text-slate-600">
            Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Grid Layout - starts below header */}
      <div className="grid sm:grid-cols-1 md:[grid-template-columns:200px_minmax(0,1fr)] lg:[grid-template-columns:240px_minmax(0,1fr)] pt-[var(--header-h)]">

        {/* Progress Ladder Sidebar - Desktop/Tablet */}
        <aside className="hidden sm:block sticky top-[var(--header-h)] h-[calc(100dvh-var(--header-h))] overflow-y-auto bg-[#F9FAFB] border-r border-slate-200 px-4 pb-8 pt-6 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.03)]">
          {/* Anchor Label */}
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-3">Sections</div>

          {/* Ladder with vertical rule */}
          <div className="relative flex flex-col items-start pl-4 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-slate-200">
            {assessmentCategories.map((cat, index) => {
              const state = getSectionState(index);
              const isLast = index === assessmentCategories.length - 1;

              // Circle styles
              const circleClasses = {
                active: 'bg-[#4F8EF7] border-[#4F8EF7] shadow-sm',
                completed: 'bg-[#4F8EF7] border-[#4F8EF7]',
                upcoming: 'bg-white border-slate-300'
              }[state];

              // Label styles
              const labelClasses = {
                active: 'text-[#1E40AF] font-semibold',
                completed: 'text-slate-500',
                upcoming: 'text-slate-400'
              }[state];

              // Connector color (only for active/completed)
              const connectorColor = {
                active: 'bg-[#4F8EF7]/40',
                completed: 'bg-[#4F8EF7]/25',
                upcoming: 'bg-slate-200'
              }[state];

              return (
                <div key={cat.id} className="w-full">
                  {/* Node Button */}
                  <button
                    onClick={() => navigateToSection(index)}
                    className="group relative flex items-center gap-3 w-full text-left px-2 py-2 rounded-md transition hover:bg-white hover:shadow-sm hover:translate-x-[2px] focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  >
                    {/* Circle */}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${circleClasses} group-hover:border-[#4F8EF7]`} />

                    {/* Label */}
                    <span className={`text-sm transition-all ${labelClasses}`}>
                      {sectionLabels[cat.id] || cat.title}
                    </span>
                  </button>

                  {/* Connector Line (between nodes only) */}
                  {!isLast && (
                    <div className={`ml-[6px] h-4 w-px ${connectorColor}`} />
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Mobile Drawer */}
        <aside className={`sm:hidden fixed left-0 top-0 bottom-0 w-60 bg-[#F9FAFB] border-r border-slate-200 overflow-y-auto z-50 shadow-lg transform transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-900">Sections</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Same ladder for mobile */}
            <div className="relative flex flex-col items-start pl-4 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-slate-200">
              {assessmentCategories.map((cat, index) => {
                const state = getSectionState(index);
                const isLast = index === assessmentCategories.length - 1;

                const circleClasses = {
                  active: 'bg-[#4F8EF7] border-[#4F8EF7] shadow-sm',
                  completed: 'bg-[#4F8EF7] border-[#4F8EF7]',
                  upcoming: 'bg-white border-slate-300'
                }[state];

                const labelClasses = {
                  active: 'text-[#1E40AF] font-semibold',
                  completed: 'text-slate-500',
                  upcoming: 'text-slate-400'
                }[state];

                const connectorColor = {
                  active: 'bg-[#4F8EF7]/40',
                  completed: 'bg-[#4F8EF7]/25',
                  upcoming: 'bg-slate-200'
                }[state];

                return (
                  <div key={cat.id} className="w-full">
                    <button
                      onClick={() => navigateToSection(index)}
                      className="group relative flex items-center gap-3 w-full text-left px-2 py-2 rounded-md transition hover:bg-white hover:shadow-sm hover:translate-x-[2px] focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${circleClasses} group-hover:border-[#4F8EF7]`} />
                      <span className={`text-sm transition-all ${labelClasses}`}>
                        {sectionLabels[cat.id] || cat.title}
                      </span>
                    </button>
                    {!isLast && (
                      <div className={`ml-[6px] h-4 w-px ${connectorColor}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Column */}
        <main className="max-w-3xl mx-auto px-4 md:px-6 pb-24 w-full">
          {/* Section Heading (scroll target) */}
          <div id={currentCategory.id} className="scroll-mt-20 pt-8 pb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {currentCategory.title}
            </h2>
            <p className="text-sm text-slate-600">
              Answer as others who know you best would see you.
            </p>
          </div>

          {/* Question Cards */}
          <div className="space-y-5 md:space-y-6">
            {currentCategory.questions.map((question, index) => {
              const currentScore = getScore(index);

              return (
                <div
                  key={index}
                  className="w-full rounded-xl bg-white shadow-sm border border-slate-200 px-5 py-5 hover:shadow-md transition-shadow"
                >
                  {/* Question Text */}
                  <h3 className="text-base font-medium text-slate-900 leading-relaxed mb-4 max-w-[60ch]">
                    {question}
                  </h3>

                  {/* Likert Row - Even 5-column layout */}
                  <div className="grid grid-cols-5 gap-3 items-center justify-items-center mt-4">
                    {scoreLabels.map((scoreLabel) => {
                      const isSelected = currentScore === scoreLabel.value;
                      return (
                        <div key={scoreLabel.value} className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(index, scoreLabel.value)}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-[#4F8EF7] border-[#4F8EF7] text-white scale-105 shadow-md'
                                : 'bg-white border-slate-300 text-slate-600 hover:border-[#4F8EF7]'
                            }`}
                            title={scoreLabel.description}
                          >
                            {scoreLabel.value}
                          </button>
                          {/* End labels only */}
                          {(scoreLabel.value === 1 || scoreLabel.value === 5) && (
                            <span className="text-xs text-slate-500 text-center max-w-[80px]">
                              {scoreLabel.value === 1 ? 'Strongly Disagree' : 'Strongly Agree'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Sticky Action Bar (bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4 z-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentCategoryIndex === 0}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
              currentCategoryIndex === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-[#4F8EF7] hover:text-[#1E40AF]'
            }`}
          >
            ← Previous
          </button>

          <div className="text-center">
            {!isCategoryComplete() ? (
              <p className="text-xs text-slate-500">Answer all questions to continue</p>
            ) : (
              <p className="text-xs text-green-600">✓ Ready to proceed</p>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!isCategoryComplete()}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
              !isCategoryComplete()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : currentCategoryIndex === totalCategories - 1
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                : 'bg-[#4F8EF7] text-white hover:bg-[#1E40AF] shadow-sm hover:shadow-md'
            }`}
          >
            {currentCategoryIndex === totalCategories - 1 ? 'View Results →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
