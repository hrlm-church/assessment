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
    return count + 1;
  };

  const getCurrentSectionQuestionCount = () => {
    return currentCategory.questions.length;
  };

  const getSectionState = (categoryIndex) => {
    const progress = getSectionProgress(categoryIndex);
    const isCurrent = categoryIndex === currentCategoryIndex;

    if (isCurrent) return 'active';
    if (categoryIndex < currentCategoryIndex && progress.isComplete) return 'completed';
    return 'upcoming';
  };

  // Auto-save responses to Supabase (debounced)
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
    }, 1000);

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
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
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
    // Update URL hash
    const sectionId = assessmentCategories[index].id;
    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Sync hash with current section on mount and navigation
  useEffect(() => {
    const sectionId = currentCategory.id;
    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  }, [currentCategoryIndex, currentCategory.id]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left Sidebar - Desktop/Tablet - Progress Ladder */}
      <aside className="hidden lg:block sticky top-0 h-screen w-60 bg-[#F9FAFB] border-r border-[#E5E7EB] overflow-y-auto shadow-sm">
        <nav className="pt-[5rem] pb-8 px-4">
          <div className="relative">
            {assessmentCategories.map((cat, index) => {
              const state = getSectionState(index);
              const isLast = index === assessmentCategories.length - 1;

              // Circle styles based on state
              const circleClasses = {
                active: 'bg-[#6366F1] border-[#6366F1] shadow-sm',
                completed: 'bg-[#6366F1] border-[#6366F1]',
                upcoming: 'bg-transparent border-[#D1D5DB]'
              }[state];

              // Label styles based on state
              const labelClasses = {
                active: 'font-bold text-[#6366F1]',
                completed: 'font-medium text-[#71717A]',
                upcoming: 'font-medium text-[#A1A1AA]'
              }[state];

              // Connector line style based on state
              const connectorOpacity = {
                active: 'opacity-40',
                completed: 'opacity-25',
                upcoming: 'opacity-100'
              }[state];

              const connectorColor = state === 'upcoming' ? 'bg-[#E5E7EB]' : 'bg-[#6366F1]';

              return (
                <div key={cat.id} className="relative">
                  <button
                    onClick={() => navigateToSection(index)}
                    className="group relative flex items-center gap-3 py-3 w-full text-left transition-all hover:translate-x-[2px] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 rounded"
                  >
                    {/* Circle Node */}
                    <div className={`relative z-10 flex-shrink-0 w-[14px] h-[14px] rounded-full border-2 transition-all ${circleClasses}`} />

                    {/* Label */}
                    <span className={`text-sm transition-all ${labelClasses}`}>
                      {cat.title}
                    </span>
                  </button>

                  {/* Vertical Connector Line */}
                  {!isLast && (
                    <div className={`absolute left-[6px] top-[3rem] w-[2px] h-[calc(100%-3rem)] ${connectorColor} ${connectorOpacity} transition-all`} />
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer - Progress Ladder */}
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-[#F9FAFB] border-r border-[#E5E7EB] overflow-y-auto z-50 shadow-sm transform transition-transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-semibold text-[#18181B]">Assessment Sections</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#71717A] hover:text-[#18181B]"
            >
              ✕
            </button>
          </div>
          <nav>
            <div className="relative">
              {assessmentCategories.map((cat, index) => {
                const state = getSectionState(index);
                const isLast = index === assessmentCategories.length - 1;

                // Circle styles based on state
                const circleClasses = {
                  active: 'bg-[#6366F1] border-[#6366F1] shadow-sm',
                  completed: 'bg-[#6366F1] border-[#6366F1]',
                  upcoming: 'bg-transparent border-[#D1D5DB]'
                }[state];

                // Label styles based on state
                const labelClasses = {
                  active: 'font-bold text-[#6366F1]',
                  completed: 'font-medium text-[#71717A]',
                  upcoming: 'font-medium text-[#A1A1AA]'
                }[state];

                // Connector line style based on state
                const connectorOpacity = {
                  active: 'opacity-40',
                  completed: 'opacity-25',
                  upcoming: 'opacity-100'
                }[state];

                const connectorColor = state === 'upcoming' ? 'bg-[#E5E7EB]' : 'bg-[#6366F1]';

                return (
                  <div key={cat.id} className="relative">
                    <button
                      onClick={() => navigateToSection(index)}
                      className="group relative flex items-center gap-3 py-3 w-full text-left transition-all hover:translate-x-[2px] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 rounded"
                    >
                      {/* Circle Node */}
                      <div className={`relative z-10 flex-shrink-0 w-[14px] h-[14px] rounded-full border-2 transition-all ${circleClasses}`} />

                      {/* Label */}
                      <span className={`text-sm transition-all ${labelClasses}`}>
                        {cat.title}
                      </span>
                    </button>

                    {/* Vertical Connector Line */}
                    {!isLast && (
                      <div className={`absolute left-[6px] top-[3rem] w-[2px] h-[calc(100%-3rem)] ${connectorColor} ${connectorOpacity} transition-all`} />
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-60">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB]">
          {/* Thin Progress Line */}
          <div className="h-0.5 bg-[#E5E7EB]">
            <div
              className="h-full bg-[#6366F1] transition-all duration-300"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>

          {/* Header Content */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              {/* Left: Menu (mobile) + Exit */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden text-[#71717A] hover:text-[#6366F1]"
                >
                  ☰
                </button>
                <button
                  onClick={onBack}
                  className="text-[13px] text-[#71717A] hover:text-[#6366F1] transition-colors"
                >
                  ← Exit
                </button>
              </div>

              {/* Right: Section Question Counter */}
              <div className="text-[13px] text-[#71717A]">
                Question 1 of {getCurrentSectionQuestionCount()}
              </div>
            </div>

            {/* Center: Section Title + Subtitle */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#18181B] mb-1">
                {currentCategory.title}
              </h1>
              <p className="text-sm text-[#71717A]">
                Answer as others who know you best would see you.
              </p>
              {currentCategory.description && (
                <p className="text-xs text-[#A1A1AA] mt-1">{currentCategory.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Question Cards */}
        <div className="px-6 py-8 pb-32">
          <div className="mx-auto max-w-[720px] space-y-6">
            {currentCategory.questions.map((question, index) => {
              const currentScore = getScore(index);

              return (
                <div
                  key={index}
                  role="group"
                  aria-labelledby={`question-${currentCategory.id}-${index}`}
                  className="group bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus-within:shadow-md focus-within:-translate-y-1"
                >
                  {/* Question Text */}
                  <h3
                    id={`question-${currentCategory.id}-${index}`}
                    className="text-base font-medium text-[#18181B] leading-relaxed mb-6"
                  >
                    {question}
                  </h3>

                  {/* Response Options - Desktop Horizontal */}
                  <div className="hidden md:block">
                    <div className="flex justify-between items-center gap-4 mb-2">
                      {scoreLabels.map((scoreLabel) => {
                        const isSelected = currentScore === scoreLabel.value;
                        return (
                          <button
                            key={scoreLabel.value}
                            onClick={() => handleScoreChange(index, scoreLabel.value)}
                            className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-[#6366F1] border-[#6366F1] text-white scale-105 shadow-md'
                                : 'bg-white border-[#E5E7EB] text-[#71717A] hover:border-[#6366F1]'
                            }`}
                            title={scoreLabel.description}
                          >
                            {scoreLabel.value}
                          </button>
                        );
                      })}
                    </div>
                    {/* Labels */}
                    <div className="flex justify-between text-xs text-[#A1A1AA]">
                      <span>Strongly Disagree</span>
                      <span>Strongly Agree</span>
                    </div>
                  </div>

                  {/* Response Options - Mobile Vertical */}
                  <div className="md:hidden space-y-2">
                    {scoreLabels.map((scoreLabel) => {
                      const isSelected = currentScore === scoreLabel.value;
                      return (
                        <button
                          key={scoreLabel.value}
                          onClick={() => handleScoreChange(index, scoreLabel.value)}
                          className={`w-full p-4 rounded-md border-2 flex items-center gap-4 transition-all ${
                            isSelected
                              ? 'bg-[#6366F1] border-[#6366F1] text-white'
                              : 'bg-white border-[#E5E7EB] text-[#71717A]'
                          }`}
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-medium text-sm">
                            {scoreLabel.value}
                          </span>
                          <span className="text-sm font-medium">{scoreLabel.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white border-t border-[#E5E7EB] py-4">
          <div className="max-w-[720px] mx-auto px-6 flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                currentCategoryIndex === 0
                  ? 'text-[#A1A1AA] cursor-not-allowed'
                  : 'text-[#6366F1] hover:text-[#4F46E5]'
              }`}
            >
              ← Previous
            </button>

            <div className="text-center">
              {!isCategoryComplete() ? (
                <p className="text-xs text-[#A1A1AA]">Answer all questions to continue</p>
              ) : (
                <p className="text-xs text-[#059669]">✓ Ready to proceed</p>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!isCategoryComplete()}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                !isCategoryComplete()
                  ? 'bg-[#E5E7EB] text-[#A1A1AA] cursor-not-allowed'
                  : currentCategoryIndex === totalCategories - 1
                  ? 'bg-[#059669] text-white hover:bg-[#047857] shadow-sm hover:shadow-md hover:-translate-y-px'
                  : 'bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm hover:shadow-md hover:-translate-y-px'
              }`}
            >
              {currentCategoryIndex === totalCategories - 1 ? 'View Results →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollbar hide utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Assessment;
