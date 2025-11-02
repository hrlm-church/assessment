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
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Left Sidebar - Desktop/Tablet */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#E5E7EB] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-[#18181B] mb-4">Assessment Sections</h3>
          <nav className="space-y-2">
            {assessmentCategories.map((cat, index) => {
              const progress = getSectionProgress(index);
              const isCurrent = index === currentCategoryIndex;

              return (
                <button
                  key={cat.id}
                  onClick={() => navigateToSection(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all ${
                    isCurrent
                      ? 'bg-[#EEF2FF] text-[#6366F1]'
                      : 'text-[#71717A] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    progress.isComplete
                      ? 'bg-[#DCFCE7] text-[#059669]'
                      : isCurrent
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#F3F4F6] text-[#A1A1AA]'
                  }`}>
                    {progress.isComplete ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{cat.title}</div>
                    <div className="text-xs text-[#A1A1AA]">
                      {progress.answered} of {progress.total}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#E5E7EB] overflow-y-auto z-50 transform transition-transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#18181B]">Assessment Sections</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#71717A] hover:text-[#18181B]"
            >
              ✕
            </button>
          </div>
          <nav className="space-y-2">
            {assessmentCategories.map((cat, index) => {
              const progress = getSectionProgress(index);
              const isCurrent = index === currentCategoryIndex;

              return (
                <button
                  key={cat.id}
                  onClick={() => navigateToSection(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-all ${
                    isCurrent
                      ? 'bg-[#EEF2FF] text-[#6366F1]'
                      : 'text-[#71717A] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    progress.isComplete
                      ? 'bg-[#DCFCE7] text-[#059669]'
                      : isCurrent
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#F3F4F6] text-[#A1A1AA]'
                  }`}>
                    {progress.isComplete ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{cat.title}</div>
                    <div className="text-xs text-[#A1A1AA]">
                      {progress.answered} of {progress.total}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
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

              {/* Right: Question Counter */}
              <div className="text-[13px] text-[#71717A]">
                Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
              </div>
            </div>

            {/* Center: Section Title + Subtitle */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#18181B] mb-1">
                {currentCategory.title}
              </h2>
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
              const questionNumber = getCurrentQuestionNumber() + index;

              return (
                <div
                  key={index}
                  className="group bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Question Header with Badge */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[#6366F1] text-white rounded-full text-sm font-semibold">
                      {questionNumber}
                    </div>
                    <h3 className="flex-1 text-base font-medium text-[#18181B] leading-relaxed pt-1">
                      {question}
                    </h3>
                  </div>

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
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white border-t border-[#E5E7EB] py-4">
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
