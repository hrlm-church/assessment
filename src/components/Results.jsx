import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { assessmentCategories, interpretationGuide } from '../data/assessmentData';
import { supabase } from '../lib/supabase';
import { getResultParagraph } from '../data/resultsTexts';
import { guidanceVideos } from '../data/guidanceVideos';
import VideoPlayer from './VideoPlayer';

// Required category IDs
const REQUIRED_CATEGORY_IDS = ['godliness', 'home_life', 'preaching', 'shepherding', 'evangelism', 'leadership', 'ministry_alignment'];

// Category title mapping
const CATEGORY_TITLES = {
  'godliness': 'Are You Godly?',
  'home_life': 'Is your home healthy?',
  'preaching': 'Can You Preach?',
  'shepherding': 'Can You Shepherd?',
  'evangelism': 'Do You Love the Lost?',
  'leadership': 'Do You Lead Well?',
  'ministry_alignment': 'Theology/Ministry/Culture Alignment'
};

// Ensure all 7 categories are present
function ensureSevenCategories(categoryResults) {
  const resultMap = new Map(categoryResults.map(cat => [cat.id, cat]));

  // Add missing categories with score of 0
  for (const categoryId of REQUIRED_CATEGORY_IDS) {
    if (!resultMap.has(categoryId)) {
      resultMap.set(categoryId, {
        id: categoryId,
        title: CATEGORY_TITLES[categoryId] || categoryId,
        description: '',
        score: { average: 0, total: 0, count: 0 },
        interpretation: { level: 'low', interpretation: '' }
      });
    }
  }

  return Array.from(resultMap.values());
}

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

  // Ensure all 7 categories are present
  const allCategoryResults = ensureSevenCategories(categoryResults);

  // Calculate overall score
  const overallAverage = allCategoryResults.reduce((sum, cat) => sum + cat.score.average, 0) / allCategoryResults.length;
  const overallInterpretation = getInterpretation(overallAverage, 'overall');

  // Identify strengths and growth areas using 3.6 threshold
  const strengths = allCategoryResults
    .filter(cat => cat.score.average >= 3.6)
    .sort((a, b) => b.score.average - a.score.average); // Sort highest first

  const growthAreas = allCategoryResults
    .filter(cat => cat.score.average < 3.6)
    .sort((a, b) => a.score.average - b.score.average); // Sort lowest first

  // Prepare data for charts
  const radarData = allCategoryResults.map(cat => ({
    category: cat.title,
    score: Number(cat.score.average.toFixed(2)),
    fullMark: 5
  }));

  const barData = allCategoryResults.map(cat => ({
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
    doc.setTextColor(243, 98, 51); // #F36233 indigo
    doc.text('AM I CALLED?', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(24, 24, 27); // #18181B
    doc.text('Your Calling Profile', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(161, 161, 170); // #A1A1AA
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: 'center' });

    // Overall Score
    doc.setFontSize(14);
    doc.setTextColor(24, 24, 27); // #18181B
    doc.text('Overall Score', 20, 50);

    doc.setFontSize(20);
    doc.setTextColor(243, 98, 51); // #F36233
    doc.text(`${overallAverage.toFixed(2)} / 5.0`, 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122); // #71717A
    const interpretationLines = doc.splitTextToSize(overallInterpretation.interpretation, pageWidth - 40);
    doc.text(interpretationLines, 20, 68);

    // Category Scores
    let yPos = 85;
    doc.setFontSize(14);
    doc.setTextColor(24, 24, 27); // #18181B
    doc.text('Dimension Scores', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    allCategoryResults.forEach(cat => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(24, 24, 27); // #18181B
      doc.setFont(undefined, 'bold');
      doc.text(`${cat.title}: ${cat.score.average.toFixed(2)} / 5.0`, 20, yPos);

      doc.setFont(undefined, 'normal');
      doc.setTextColor(113, 113, 122); // #71717A
      const paragraph = getResultParagraph(cat.id, cat.score.average);
      const catInterp = doc.splitTextToSize(paragraph, pageWidth - 40);
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
      doc.setTextColor(5, 150, 105); // #059669 success green
      doc.text('Your Strengths', 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(24, 24, 27); // #18181B
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
      doc.setTextColor(217, 119, 6); // #D97706 warning amber
      doc.text('Growth Areas', 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(24, 24, 27); // #18181B
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
    doc.setTextColor(24, 24, 27); // #18181B
    doc.text('Recommended Next Steps', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(113, 113, 122); // #71717A
    const recommendations = [
      '1. Reflect & Pray: Take time to pray about these results and seek God\'s guidance.',
      '2. Seek Feedback: Ask trusted mentors to evaluate you in these areas.',
      '3. Create Plan: Develop a specific plan to address your growth areas.',
      '4. Connect: Reach out to church leadership to discuss your journey.'
    ];

    recommendations.forEach(rec => {
      const lines = doc.splitTextToSize(rec, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += (lines.length * 6) + 3;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170); // #A1A1AA
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
          categoryScores: allCategoryResults.map(cat => ({
            id: cat.id,
            title: cat.title,
            average: cat.score.average,
            interpretation: getResultParagraph(cat.id, cat.score.average)
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

  // Progress Ring Component (Minimalist Donut Chart)
  const ProgressRing = ({ score, size = 200 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (score / 5) * 100;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F36233"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-[32px] font-semibold text-[#18181B]">{score.toFixed(1)}</span>
          <span className="text-[13px] text-[#A1A1AA]">out of 5.0</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="mb-4">
            <p className="text-sm text-[#A1A1AA]">Assessment / Results</p>
          </div>
          <h1 className="text-[36px] font-semibold text-[#18181B] mb-3">
            Your Calling Profile
          </h1>
          <p className="text-lg text-[#71717A] leading-relaxed">
            Review your scores, identify strengths, and determine next steps for your calling journey
          </p>
        </motion.div>

        {/* Your Calling Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-3">Your Calling Profile</h2>
          <p className="text-base text-[#71717A] leading-relaxed mb-6">
            This overview shows where grace is visible and where maturity is still forming. Treat it as an invitation to deeper dependence on Christ—not a verdict.
          </p>

          {/* Summary Cards - 3 Column Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-[#18181B] mb-6">Overall Score</h3>
            <div className="flex flex-col items-center mb-6">
              <ProgressRing score={overallAverage} size={200} />
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md p-4">
              <p className="text-base text-[#71717A] leading-relaxed">
                {overallInterpretation.interpretation}
              </p>
            </div>
          </motion.div>

          {/* Radar Chart - Dimension Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-[#18181B] mb-4">Dimension Snapshot</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#F3F4F6" strokeWidth={1} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: '#71717A', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fill: '#A1A1AA', fontSize: 10 }}
                  stroke="#E5E7EB"
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#F36233"
                  fill="transparent"
                  strokeWidth={2}
                  dot={{ fill: '#F36233', r: 3 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart - Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white border border-[#E5E7EB] rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-[#18181B] mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 5]} tick={{ fill: '#A1A1AA', fontSize: 11 }} stroke="#E5E7EB" />
                <YAxis type="category" dataKey="name" tick={{ fill: '#71717A', fontSize: 10 }} width={80} stroke="#E5E7EB" />
                <Bar dataKey="score" fill="#818CF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          </div>
        </motion.div>

        {/* Your Strengths Section */}
        {strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#18181B] mb-3">Your Strengths</h2>
            <p className="text-base text-[#71717A] leading-relaxed mb-6">
              These are evidences of grace to steward with humility. Let them fuel service, not self-confidence.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {strengths.map(cat => {
                const score = cat.score.average;
                const paragraph = getResultParagraph(cat.id, score);

                // Determine badge color based on score
                let badgeBg, badgeText;
                if (score >= 4.5) {
                  badgeBg = 'bg-[#DCFCE7]';
                  badgeText = 'text-[#059669]';
                } else if (score >= 3.5) {
                  badgeBg = 'bg-[#DBEAFE]';
                  badgeText = 'text-[#2563EB]';
                } else {
                  badgeBg = 'bg-[#FEF3C7]';
                  badgeText = 'text-[#D97706]';
                }

                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-[#E5E7EB] rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
                  >
                    <h3 className="text-lg font-medium text-[#18181B] mb-3">{cat.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 ${badgeBg} ${badgeText} rounded text-base font-medium`}>
                        {score.toFixed(2)} / 5
                      </span>
                    </div>
                    <p className="text-base text-[#71717A] leading-relaxed">{paragraph}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Areas for Growth Section */}
        {growthAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-[#18181B] mb-3">Areas for Growth</h2>
            <p className="text-base text-[#71717A] leading-relaxed mb-6">
              Every calling matures through correction. Use these areas to shape prayer, feedback, and a concrete growth plan.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {growthAreas.map(cat => {
                const score = cat.score.average;
                const paragraph = getResultParagraph(cat.id, score);

                // Determine badge color based on score
                let badgeBg, badgeText;
                if (score >= 2.5) {
                  badgeBg = 'bg-[#FEF3C7]';
                  badgeText = 'text-[#D97706]';
                } else {
                  badgeBg = 'bg-[#FEE2E2]';
                  badgeText = 'text-[#DC2626]';
                }

                return (
                  <div
                    key={cat.id}
                    className="bg-white border border-[#E5E7EB] rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
                  >
                    <h3 className="text-lg font-medium text-[#18181B] mb-3">{cat.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 ${badgeBg} ${badgeText} rounded text-base font-medium`}>
                        {score.toFixed(2)} / 5
                      </span>
                    </div>
                    <p className="text-base text-[#71717A] leading-relaxed">{paragraph}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-6">Recommended Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: 'Pray and reflect',
                description: 'Take time to pray about these results and seek God\'s guidance'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: 'Seek feedback',
                description: 'Show trusted friends and church leaders this score and invite them to interact with you on what it reveals'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
                title: 'Take the Next Steps Course',
                description: 'Take the next steps on this journey by enrolling in this free course to better understand what a call to plant or pastor really means'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white border border-[#E5E7EB] rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#F36233] text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="text-[#F36233]">{step.icon}</div>
                </div>
                <h4 className="text-base font-medium text-[#18181B] mb-2">{step.title}</h4>
                <p className="text-base text-[#71717A] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Guidance Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-[#18181B] mb-3">Guidance Videos</h2>
          <p className="text-base text-[#71717A] leading-relaxed mb-6">
            Watch these videos to understand your results and learn about the next steps in your journey.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {guidanceVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white border border-[#E5E7EB] rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="mb-4">
                  <VideoPlayer vimeoId={video.vimeoId} title={video.title} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#F36233] text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {video.order}
                  </div>
                  <h3 className="text-base font-medium text-[#18181B]">{video.title}</h3>
                </div>
                <p className="text-base text-[#71717A] leading-relaxed">{video.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-white border border-[#E5E7EB] rounded-lg p-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={generatePDF}
              className="px-6 py-2.5 bg-[#059669] text-white text-sm font-medium rounded-md hover:bg-[#047857] transition-all shadow-sm hover:shadow-md hover:-translate-y-px flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF Results
            </button>
            <button
              onClick={onRestart}
              className="px-6 py-2.5 bg-transparent text-[#F36233] text-sm font-medium rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all"
            >
              Start New Assessment
            </button>
          </div>
          <p className="text-center text-base text-[#A1A1AA] mt-6">
            Your results have been saved and can be downloaded anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Results;
