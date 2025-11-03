// Personalized paragraphs for results cards based on Dave Harvey's pastoral tone
// Each category has 4 paragraphs corresponding to score ranges

export const RESULTS_TEXTS = {
  godliness: [
    {min: 1, max: 2.4, body: "Your spiritual disciplines are inconsistent, and others may sense uneven fruit. This is not failure but invitation—bring habits of prayer, confession, and accountability under renewed grace."},
    {min: 2.5, max: 3.4, body: "Your devotion is visible though irregular. Strengthen rhythms of Scripture and fellowship; God often deepens calling through ordinary faithfulness."},
    {min: 3.5, max: 4.4, body: "Your life reflects credible godliness that encourages others. Guard humility and dependence; lasting ministry flows from daily repentance."},
    {min: 4.5, max: 5, body: "Maturity and tenderness mark your walk with Christ. Keep short accounts and remain teachable; godliness is the backbone of enduring ministry."}
  ],
  homeLife: [
    {min: 1, max: 2.4, body: "Strain or neglect at home suggests ministry should pause until unity and rest return. Shepherd your household before shepherding the church."},
    {min: 2.5, max: 3.4, body: "Your home shows stability with areas needing intentional attention—shared prayer, time, and communication. Lead gently and model reconciliation."},
    {min: 3.5, max: 4.4, body: "A healthy home supports your calling. Maintain sabbath rhythms and openness with family during demanding seasons."},
    {min: 4.5, max: 5, body: "Your household radiates partnership and peace. Protect that culture; it's your clearest sermon."}
  ],
  preaching: [
    {min: 1, max: 2.4, body: "Your handling of Scripture lacks clarity and confidence. Focus on exegesis and gospel clarity before delivery; let truth shape tone."},
    {min: 2.5, max: 3.4, body: "You communicate well at times but need steadier depth and structure. Seek mentoring and consistent feedback after each sermon."},
    {min: 3.5, max: 4.4, body: "You teach effectively and often move hearts. Continue refining illustration, pacing, and dependence on the Spirit."},
    {min: 4.5, max: 5, body: "Your preaching regularly feeds others. Keep humility before the text and let grace guard against performance."}
  ],
  shepherding: [
    {min: 1, max: 2.4, body: "Care feels occasional or reactive. Begin with presence—listening, praying, visiting. Shepherding grows by showing up."},
    {min: 2.5, max: 3.4, body: "Compassion is visible but rhythms are uneven. Create systems of follow-up and learn to bear burdens patiently."},
    {min: 3.5, max: 4.4, body: "People trust you with their wounds. Guard rest and soul health so empathy stays strong."},
    {min: 4.5, max: 5, body: "You model steady, Christlike care. Multiply that heart by mentoring other caregivers."}
  ],
  evangelism: [
    {min: 1, max: 2.4, body: "Evangelistic passion has cooled. Pray for compassion for the lost and schedule time in unbelieving circles."},
    {min: 2.5, max: 3.4, body: "You engage outsiders occasionally but inconsistently. Pair accountability with prayer and practice simple gospel conversation."},
    {min: 3.5, max: 4.4, body: "You regularly initiate spiritual conversations. Keep equipping others and celebrate small advances of grace."},
    {min: 4.5, max: 5, body: "You naturally pursue the lost. Protect that impulse with prayer and partnership; keep boldness gentle."}
  ],
  leadership: [
    {min: 1, max: 2.4, body: "Leadership instincts are forming but untested. Practice service first; learn structure, delegation, and clarity."},
    {min: 2.5, max: 3.4, body: "You influence others yet need steadier direction and pace. Clarify goals, communicate simply, and welcome critique."},
    {min: 3.5, max: 4.4, body: "You lead teams effectively and inspire trust. Continue raising other leaders and remain approachable."},
    {min: 4.5, max: 5, body: "You lead with conviction and humility. Guard sabbath and community so strength stays gentle."}
  ],
  alignment: [
    {min: 1, max: 2.4, body: "Your convictions or relationships don't yet align with GCC's mission. Immerse in doctrine, attend gatherings, and seek mentoring."},
    {min: 2.5, max: 3.4, body: "You agree in principle but need deeper participation. Engage actively in cohorts and collaborative work."},
    {min: 3.5, max: 4.4, body: "You share core values and serve alongside others faithfully. Keep fostering openness and accountability."},
    {min: 4.5, max: 5, body: "Your convictions and partnerships fully resonate with GCC culture. Model this unity for others."}
  ]
};

// Category ID mapping from assessment data to results texts
const CATEGORY_ID_MAP = {
  'godliness': 'godliness',
  'home_life': 'homeLife',
  'preaching': 'preaching',
  'shepherding': 'shepherding',
  'evangelism': 'evangelism',
  'leadership': 'leadership',
  'gcc_alignment': 'alignment'
};

/**
 * Get the personalized paragraph for a category based on score
 * @param {string} categoryId - The category ID from assessment data
 * @param {number} score - The score value (1-5)
 * @returns {string} The personalized paragraph text
 */
export function getResultParagraph(categoryId, score) {
  const mappedCategory = CATEGORY_ID_MAP[categoryId];
  if (!mappedCategory || !RESULTS_TEXTS[mappedCategory]) {
    return "";
  }

  const paragraph = RESULTS_TEXTS[mappedCategory].find(
    r => score >= r.min && score <= r.max
  );

  return paragraph?.body ?? "";
}

/**
 * Get the score range label for display
 * @param {number} score - The score value (1-5)
 * @returns {string} The label (Needs Growth, Developing, Strong, Exemplary)
 */
export function getScoreLabel(score) {
  if (score >= 4.5) return "Exemplary";
  if (score >= 3.5) return "Strong";
  if (score >= 2.5) return "Developing";
  return "Needs Growth";
}
