import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
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

  // Identify strengths and growth areas
  const strengths = categoryResults.filter(cat => cat.score.average >= 4.0);
  const growthAreas = categoryResults.filter(cat => cat.score.average < 3.5);

  // Prepare data for charts
  const radarData = categoryResults.map(cat => ({
    category: cat.title,
    score: Number(cat.score.average.toFixed(2)),
    fullMark: 5
  }));

  const barData = categoryResults.map(cat => ({
    name: cat.title.length > 15 ? cat.title.substring(0, 12) + '...' : cat.title,
    score: Number(cat.score.average.toFixed(2))
  }));

  // Get color for score
  const getScoreColor = (average) => {
    if (average >= 4.5) return '#10b981'; // green
    if (average >= 3.5) return '#3b82f6'; // blue
    if (average >= 2.5) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // blue-600
    doc.text('AM I CALLED?', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Assessment Results', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: 'center' });

    // Overall Score
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Overall Score', 20, 50);

    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(`${overallAverage.toFixed(2)} / 5.0`, 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const interpretationLines = doc.splitTextToSize(overallInterpretation.interpretation, pageWidth - 40);
    doc.text(interpretationLines, 20, 68);

    // Category Scores
    let yPos = 85;
    doc.setFontSize(14);
    doc.text('Category Breakdown', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    categoryResults.forEach(cat => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(`${cat.title}: ${cat.score.average.toFixed(2)} / 5.0`, 20, yPos);

      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      const catInterp = doc.splitTextToSize(cat.interpretation.interpretation, pageWidth - 40);
      doc.text(catInterp, 20, yPos + 5);

      yPos += 5 + (catInterp.length * 5) + 5;
    });

    // Strengths
    if (strengths.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 5;
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129); // green
      doc.text('Your Strengths', 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      strengths.forEach(cat => {
        doc.text(`• ${cat.title} (${cat.score.average.toFixed(2)})`, 25, yPos);
        yPos += 6;
      });
    }

    // Growth Areas
    if (growthAreas.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 5;
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11); // amber
      doc.text('Growth Areas', 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      growthAreas.forEach(cat => {
        doc.text(`• ${cat.title} (${cat.score.average.toFixed(2)})`, 25, yPos);
        yPos += 6;
      });
    }

    // Recommendations
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Recommended Next Steps', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    const recommendations = [
      '1. Reflect & Pray: Take time to pray about these results.',
      '2. Seek Feedback: Ask trusted mentors to evaluate you in these categories.',
      '3. Create a Development Plan: Focus on your growth areas.',
      '4. Connect with Leadership: Reach out to GCC leadership.'
    ];

    recommendations.forEach(rec => {
      const lines = doc.splitTextToSize(rec, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += (lines.length * 6) + 3;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Based on Dave Harvey\'s "Am I Called?" Assessment', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save
    doc.save(`am-i-called-results-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Save results to Supabase
  useEffect(() => {
    if (!assessmentId) {
      setIsSaving(false);
      return;
    }

    const saveResults = async () => {
      try {
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

        if (error) console.error('Error saving results:', error);
      } catch (err) {
        console.error('Unexpected error saving results:', err);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [assessmentId]);

  // Progress Ring Component
  const ProgressRing = ({ score, size = 120 }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (score / 5) * 100;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = getScoreColor(score);

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-black" style={{ color }}>{score.toFixed(1)}</span>
          <span className="text-xs text-gray-500">out of 5.0</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Your Assessment Results
            </h1>
            <p className="text-gray-600 text-lg">Review your scores, identify strengths, and determine next steps</p>
          </motion.div>

          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8 md:p-12 mb-8"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Overall Assessment</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <ProgressRing score={overallAverage} size={160} />
              <div className="flex-1 max-w-2xl">
                <div className={`p-6 rounded-2xl border-2 shadow-lg ${
                  overallAverage >= 4.5 ? 'bg-green-50 border-green-300' :
                  overallAverage >= 3.5 ? 'bg-blue-50 border-blue-300' :
                  overallAverage >= 2.5 ? 'bg-amber-50 border-amber-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  <p className="text-lg font-medium leading-relaxed text-gray-800">
                    {overallInterpretation.interpretation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Category Overview</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#475569' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Category Progress Rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8 mb-8"
          >
            <h3 className="text-2xl font-black text-gray-900 mb-8 text-center">All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {categoryResults.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex flex-col items-center gap-3"
                >
                  <ProgressRing score={cat.score.average} size={100} />
                  <p className="text-sm font-semibold text-gray-700 text-center leading-tight">{cat.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Strengths and Growth Areas */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8"
              >
                <h3 className="text-2xl font-black text-green-700 mb-6 flex items-center gap-3">
                  <span className="text-3xl">✓</span> Your Strengths
                </h3>
                <p className="text-gray-600 mb-6">These areas are significant strengths you can leverage in ministry:</p>
                <div className="space-y-4">
                  {strengths.map(cat => (
                    <div key={cat.id} className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-green-900">{cat.title}</h4>
                        <span className="text-2xl font-black text-green-700">{cat.score.average.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-green-700">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {growthAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8"
              >
                <h3 className="text-2xl font-black text-amber-700 mb-6 flex items-center gap-3">
                  <span className="text-3xl">→</span> Growth Areas
                </h3>
                <p className="text-gray-600 mb-6">These areas need attention and development:</p>
                <div className="space-y-4">
                  {growthAreas.map(cat => (
                    <div key={cat.id} className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-amber-900">{cat.title}</h4>
                        <span className="text-2xl font-black text-amber-700">{cat.score.average.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-amber-700">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8 md:p-12 mb-8"
          >
            <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Recommended Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full text-xl">1</span>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2">Reflect & Pray</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Take time to pray about these results. Ask God to confirm or clarify your calling.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full text-xl">2</span>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2">Seek Feedback</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Ask people who know you well to evaluate you in these categories.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full text-xl">3</span>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2">Create Development Plan</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Focus on your growth areas. What specific steps can you take?
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold rounded-full text-xl">4</span>
                  <div>
                    <h4 className="font-black text-gray-900 mb-2">Connect with Leadership</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Reach out to GCC leadership to discuss your results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/70 p-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePDF}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <span className="text-2xl">📄</span>
                Download PDF Results
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start New Assessment
              </motion.button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-6">
              Your results have been saved. You can download them as PDF anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Results;
