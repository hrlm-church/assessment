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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Am I Called? Assessment
            </h1>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Home
            </button>
          </div>

          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{getTotalProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>

          {/* Category Progress */}
          <div className="flex gap-2">
            {assessmentCategories.map((cat, index) => (
              <div
                key={cat.id}
                className={`flex-1 h-2 rounded ${
                  index < currentCategoryIndex
                    ? 'bg-green-500'
                    : index === currentCategoryIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
                title={cat.title}
              />
            ))}
          </div>
        </div>

        {/* Category Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-gray-800">
                {currentCategory.title}
              </h2>
              <span className="text-sm text-gray-500">
                Category {currentCategoryIndex + 1} of {totalCategories}
              </span>
            </div>
            <p className="text-gray-600">{currentCategory.description}</p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentCategory.questions.map((question, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <p className="text-lg text-gray-800 mb-4 font-medium">
                  {index + 1}. {question}
                </p>

                {/* Score Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {scoreLabels.map((scoreLabel) => (
                    <button
                      key={scoreLabel.value}
                      onClick={() => handleScoreChange(index, scoreLabel.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        getScore(index) === scoreLabel.value
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      title={scoreLabel.description}
                    >
                      <div className="font-bold text-lg">{scoreLabel.value}</div>
                      <div className="text-xs mt-1 leading-tight">
                        {scoreLabel.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
              className={`px-6 py-2 rounded-lg font-semibold ${
                currentCategoryIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            <div className="text-center">
              {!isCategoryComplete() && (
                <p className="text-sm text-amber-600 font-medium">
                  Please answer all questions to continue
                </p>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!isCategoryComplete()}
              className={`px-6 py-2 rounded-lg font-semibold ${
                !isCategoryComplete()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : currentCategoryIndex === totalCategories - 1
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentCategoryIndex === totalCategories - 1 ? 'View Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
