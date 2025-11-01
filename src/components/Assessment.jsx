import { useState } from 'react';
import { assessmentCategories, scoreLabels } from '../data/assessmentData';

function Assessment({ initialResponses, onComplete, onBack }) {
  const [responses, setResponses] = useState(initialResponses || {});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const currentCategory = assessmentCategories[currentCategoryIndex];
  const totalCategories = assessmentCategories.length;

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
    const totalQuestions = assessmentCategories.reduce(
      (sum, cat) => sum + cat.questions.length,
      0
    );
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const categoryIcons = ['🙏', '🏠', '📖', '💙', '✝️', '👥', '⛪'];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-dark">Am I Called? Assessment</h1>
              <p className="text-sm text-gray-600 mt-1">
                Category {currentCategoryIndex + 1} of {totalCategories}
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-semibold text-primary">{getTotalProgress()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>

          {/* Category Progress Pills */}
          <div className="flex flex-wrap gap-2">
            {assessmentCategories.map((cat, index) => {
              const isCompleted = index < currentCategoryIndex;
              const isCurrent = index === currentCategoryIndex;

              return (
                <div
                  key={cat.id}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-success/10 text-success border border-success/20'
                      : isCurrent
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                  title={cat.title}
                >
                  {categoryIcons[index]} {cat.title}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-4">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
              {categoryIcons[currentCategoryIndex]}
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-dark mb-2">
                {currentCategory.title}
              </h2>
              <p className="text-gray-600">{currentCategory.description}</p>
            </div>
          </div>

          {/* Score Legend */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm font-semibold text-dark mb-3">Rating Scale:</p>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {scoreLabels.map((label) => (
                <div key={label.value} className="text-center">
                  <div className="font-bold text-dark mb-1">{label.value}</div>
                  <div className="text-gray-600">{label.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentCategory.questions.map((question, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <p className="text-base text-dark mb-4 font-medium leading-relaxed">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-primary/10 text-primary rounded-full text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {question}
                </p>

                {/* Score Buttons */}
                <div className="grid grid-cols-5 gap-3 ml-10">
                  {scoreLabels.map((scoreLabel) => {
                    const isSelected = getScore(index) === scoreLabel.value;
                    return (
                      <button
                        key={scoreLabel.value}
                        onClick={() => handleScoreChange(index, scoreLabel.value)}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          isSelected
                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                        title={scoreLabel.description}
                      >
                        <div className={`font-bold text-2xl mb-1 ${isSelected ? 'text-white' : 'text-primary'}`}>
                          {scoreLabel.value}
                        </div>
                        <div className={`text-xs leading-tight ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                          {scoreLabel.label.split(' ').slice(0, 2).join(' ')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                currentCategoryIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-dark hover:bg-gray-300 shadow-sm hover:shadow'
              }`}
            >
              ← Previous
            </button>

            <div className="text-center">
              {!isCategoryComplete() && (
                <div className="flex items-center gap-2 text-warning">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm font-medium">
                    Please answer all questions to continue
                  </p>
                </div>
              )}
              {isCategoryComplete() && (
                <div className="flex items-center gap-2 text-success">
                  <span className="text-xl">✓</span>
                  <p className="text-sm font-medium">
                    Category complete! Ready to proceed
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!isCategoryComplete()}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                !isCategoryComplete()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : currentCategoryIndex === totalCategories - 1
                  ? 'bg-success text-white hover:bg-success/90 shadow-sm hover:shadow-md'
                  : 'bg-primary text-white hover:bg-primary-600 shadow-sm hover:shadow-md'
              }`}
            >
              {currentCategoryIndex === totalCategories - 1 ? 'View Results →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
