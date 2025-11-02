import { useState, useEffect, useRef } from 'react';
import { assessmentCategories, scoreLabels } from '../data/assessmentData';
import { supabase } from '../lib/supabase';

function Assessment({ assessmentId, initialResponses, onComplete, onBack }) {
  const [responses, setResponses] = useState(initialResponses || {});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]">
        {/* Thin Progress Line */}
        <div className="h-0.5 bg-[#E5E7EB]">
          <div
            className="h-full bg-[#6366F1] transition-all duration-300"
            style={{ width: `${getTotalProgress()}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-[13px] text-[#71717A] hover:text-[#6366F1] transition-colors"
          >
            ← Exit
          </button>
          <div className="text-[13px] text-[#71717A]">
            Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
          </div>
        </div>

        {/* Dimension Pills */}
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {assessmentCategories.map((cat, index) => {
              const isCompleted = index < currentCategoryIndex;
              const isCurrent = index === currentCategoryIndex;

              return (
                <div
                  key={cat.id}
                  className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-[#DCFCE7] text-[#059669]'
                      : isCurrent
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#F3F4F6] text-[#71717A]'
                  }`}
                >
                  {cat.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="pt-40 pb-32 px-6">
        <div className="mx-auto max-w-[680px]">
          {currentCategory.questions.map((question, index) => {
            const currentScore = getScore(index);

            return (
              <div key={index} className="mb-16 last:mb-0">
                {/* Question Number Badge */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[#F3F4F6] text-[#18181B] rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-medium text-[#18181B] leading-relaxed">
                    {question}
                  </h2>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] py-4">
        <div className="max-w-[680px] mx-auto px-6 flex justify-between items-center gap-4">
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
