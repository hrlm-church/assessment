import { useEffect, useState } from 'react';
import { assessmentCategories, interpretationGuide } from '../data/assessmentData';
import { supabase } from '../lib/supabase';

function Results({ assessmentId, responses, onRestart }) {
  const [isSaving, setIsSaving] = useState(true);
  // Calculate category scores
  const calculateCategoryScore = (categoryId) => {
    const category = assessmentCategories.find(cat => cat.id === categoryId);
    if (!category) return null;

    const scores = category.questions.map((_, index) => {
      const key = `${categoryId}_${index}`;
      return responses[key] || 0;
    });

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return {
      average: average,
      total: scores.reduce((sum, score) => sum + score, 0),
      count: scores.length
    };
  };

  // Get interpretation for a score
  const getInterpretation = (average, type = 'category') => {
    const guide = type === 'category'
      ? interpretationGuide.categoryAverage
      : interpretationGuide.overallAverage;

    if (average <= (guide.low?.max || 0)) return { level: 'low', ...guide.low };
    if (average <= (guide.moderate?.max || 0)) return { level: 'moderate', ...guide.moderate };
    if (average < (guide.excellent?.min || 5)) return { level: 'good', ...guide.good };
    return { level: 'excellent', ...guide.excellent };
  };

  // Calculate all category results
  const categoryResults = assessmentCategories.map(category => {
    const score = calculateCategoryScore(category.id);
    const interpretation = getInterpretation(score.average, 'category');
    return {
      ...category,
      score,
      interpretation
    };
  });

  // Calculate overall score
  const overallAverage = categoryResults.reduce((sum, cat) => sum + cat.score.average, 0) / categoryResults.length;
  const overallInterpretation = getInterpretation(overallAverage, 'overall');

  // Identify strengths (categories with avg >= 4.0)
  const strengths = categoryResults.filter(cat => cat.score.average >= 4.0);

  // Identify growth areas (categories with avg < 3.5)
  const growthAreas = categoryResults.filter(cat => cat.score.average < 3.5);

  // Save final results to Supabase
  useEffect(() => {
    if (!assessmentId) {
      setIsSaving(false);
      return;
    }

    const saveResults = async () => {
      try {
        // Prepare results data
        const resultsData = {
          categoryScores: categoryResults.map(cat => ({
            id: cat.id,
            title: cat.title,
            average: cat.score.average,
            interpretation: cat.interpretation.interpretation
          })),
          overallScore: overallAverage,
          overallInterpretation: overallInterpretation.interpretation,
          strengths: strengths.map(s => ({ id: s.id, title: s.title, score: s.score.average })),
          growthAreas: growthAreas.map(g => ({ id: g.id, title: g.title, score: g.score.average }))
        };

        const { error } = await supabase
          .from('assessments')
          .update({
            results: resultsData,
            overall_score: overallAverage,
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', assessmentId);

        if (error) {
          console.error('Error saving results:', error);
        }
      } catch (err) {
        console.error('Unexpected error saving results:', err);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [assessmentId]); // Only run once on mount

  // Get color for score
  const getScoreColor = (average) => {
    if (average >= 4.5) return 'text-green-700 bg-green-50 border-green-300';
    if (average >= 3.5) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (average >= 2.5) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-red-700 bg-red-50 border-red-300';
  };

  const getBarColor = (average) => {
    if (average >= 4.5) return 'bg-green-500';
    if (average >= 3.5) return 'bg-blue-500';
    if (average >= 2.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const downloadResults = () => {
    const resultsText = `
AM I CALLED? - ASSESSMENT RESULTS
Date: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${overallAverage.toFixed(2)} / 5.0
${overallInterpretation.interpretation}

CATEGORY BREAKDOWN:
${categoryResults.map(cat => `
${cat.title}: ${cat.score.average.toFixed(2)} / 5.0
${cat.interpretation.interpretation}
`).join('\n')}

STRENGTHS:
${strengths.length > 0 ? strengths.map(cat => `- ${cat.title} (${cat.score.average.toFixed(2)})`).join('\n') : 'Continue developing all areas'}

GROWTH AREAS:
${growthAreas.length > 0 ? growthAreas.map(cat => `- ${cat.title} (${cat.score.average.toFixed(2)})`).join('\n') : 'All areas show good foundation'}
`;

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `am-i-called-results-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Your Assessment Results
          </h1>
          <p className="text-center text-gray-600">
            Review your scores, identify strengths, and determine next steps
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Assessment</h2>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {overallAverage.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">out of 5.0</div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className={`p-4 rounded-lg border-2 ${getScoreColor(overallAverage)}`}>
                <p className="text-lg font-medium">
                  {overallInterpretation.interpretation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
          <div className="space-y-6">
            {categoryResults.map((category) => (
              <div key={category.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.title}
                  </h3>
                  <span className="text-2xl font-bold text-gray-700">
                    {category.score.average.toFixed(2)}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getBarColor(category.score.average)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(category.score.average / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {category.interpretation.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-green-600 mr-2">✓</span> Your Strengths
            </h2>
            <p className="text-gray-600 mb-4">
              These areas are significant strengths you can leverage in ministry:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strengths.map((category) => (
                <div
                  key={category.id}
                  className="bg-green-50 border-2 border-green-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-green-800">{category.title}</h3>
                    <span className="text-xl font-bold text-green-700">
                      {category.score.average.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Areas */}
        {growthAreas.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-amber-600 mr-2">→</span> Growth Areas
            </h2>
            <p className="text-gray-600 mb-4">
              These areas need attention and development before pursuing ministry:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {growthAreas.map((category) => (
                <div
                  key={category.id}
                  className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-amber-800">{category.title}</h3>
                    <span className="text-xl font-bold text-amber-700">
                      {category.score.average.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 mt-2">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Next Steps</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">1. Reflect & Pray</h3>
              <p className="text-gray-700">
                Take time to pray about these results. Ask God to confirm or clarify your calling.
                Share these results with trusted mentors and spiritual leaders.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">2. Seek Feedback</h3>
              <p className="text-gray-700">
                Ask people who know you well (spouse, close friends, church leaders) to evaluate
                you in these same categories. Their perspective may reveal blind spots.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">3. Create a Development Plan</h3>
              <p className="text-gray-700">
                Focus on your growth areas. What specific steps can you take to develop in weak
                areas? Consider training, mentorship, or ministry opportunities that build these skills.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-gray-800 mb-2">4. Connect with Leadership</h3>
              <p className="text-gray-700">
                Reach out to GCC leadership to discuss your assessment results and explore potential
                paths forward in ministry or church planting.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadResults}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Download Results
            </button>
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Start New Assessment
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Your results have been saved locally. You can return anytime to review them.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Results;
