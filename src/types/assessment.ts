// types.ts — TypeScript types for Am I Called? Assessment

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

export type SectionKey =
  | 'godliness'
  | 'home_life'
  | 'preaching'
  | 'shepherding'
  | 'evangelism'
  | 'leadership'
  | 'gcc_alignment';

export type ResultTier = 'affirmed' | 'growing' | 'developing';

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export type EmailEventType =
  | 'results_sent'
  | 'welcome'
  | 'reminder'
  | 'bounce'
  | 'unsubscribe';

export const SECTION_KEYS: SectionKey[] = [
  'godliness',
  'home_life',
  'preaching',
  'shepherding',
  'evangelism',
  'leadership',
  'gcc_alignment',
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  godliness: 'Godliness',
  home_life: 'Home Life',
  preaching: 'Preaching',
  shepherding: 'Shepherding',
  evangelism: 'Evangelistic Focus',
  leadership: 'Leadership',
  gcc_alignment: 'GCC Alignment',
};

export const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  godliness: 'Life with God that shapes life with people.',
  home_life: 'Health at home that supports ministry.',
  preaching: 'Clarity, gospel centrality, and application.',
  shepherding: 'Care and courage for people in real life.',
  evangelism: 'A heart for the lost and the nations.',
  leadership: 'Vision, resilience, and team building.',
  gcc_alignment: 'Shared doctrine, culture, and mission.',
};

// ==========================================
// DATABASE DTOs
// ==========================================

export interface ContactDTO {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  consent: boolean;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface SessionDTO {
  id: string;
  contact_id: string;
  status: SessionStatus;
  expires_at: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface AssessmentDTO {
  id: string;
  contact_id: string;
  session_id: string;
  started_at: string;
  completed_at: string | null;
  overall_score: number | null;
  tier: ResultTier | null;
  scores_by_category: Record<SectionKey, number>;
  created_at: string;
  updated_at: string;
}

export interface ResponseDTO {
  id: string;
  assessment_id: string;
  section: SectionKey;
  question_key: string;
  value: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface EmailEventDTO {
  id: string;
  contact_id: string;
  type: EmailEventType;
  metadata: Record<string, any>;
  created_at: string;
}

// ==========================================
// API REQUEST/RESPONSE TYPES
// ==========================================

export interface StartAssessmentRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  consent: boolean;
}

export interface StartAssessmentResponse {
  sessionId: string;
  assessmentId: string;
  contactId: string;
  sessionToken: string; // JWT with session_id claim
}

export interface SaveResponseRequest {
  assessmentId: string;
  section: SectionKey;
  questionKey: string;
  value: number;
}

export interface CompleteAssessmentRequest {
  assessmentId: string;
}

export interface CompleteAssessmentResponse {
  overall_score: number;
  tier: ResultTier;
  scores_by_category: Record<SectionKey, number>;
}

export interface RestartAssessmentRequest {
  sessionId: string;
}

export interface RestartAssessmentResponse {
  sessionId: string;
  assessmentId: string;
}

export interface SendResultsRequest {
  contactId: string;
  assessmentId: string;
}

// ==========================================
// COMPUTED RESULTS
// ==========================================

export interface CategoryScore {
  section: SectionKey;
  score: number;
  message: string;
  nudge: string;
}

export interface AssessmentResults {
  overall: number;
  tier: ResultTier;
  tierMessage: string;
  byCategory: CategoryScore[];
}

// ==========================================
// SCORE COMPUTATION HELPER
// ==========================================

export function computeResults(responses: ResponseDTO[]): AssessmentResults {
  // Group by section
  const bySection = responses.reduce((acc, r) => {
    if (!acc[r.section]) acc[r.section] = [];
    acc[r.section].push(r.value);
    return acc;
  }, {} as Record<SectionKey, number[]>);

  // Calculate averages
  const categoryScores: CategoryScore[] = SECTION_KEYS.map((section) => {
    const values = bySection[section] || [];
    const avg = values.length
      ? values.reduce((sum, v) => sum + v, 0) / values.length
      : 0;
    return {
      section,
      score: parseFloat(avg.toFixed(2)),
      message: getScoreMessage(avg),
      nudge: getNudge(section, avg),
    };
  });

  // Overall average
  const overall =
    responses.reduce((sum, r) => sum + r.value, 0) / responses.length;
  const overallScore = parseFloat(overall.toFixed(2));

  // Tier
  let tier: ResultTier;
  let tierMessage: string;

  if (overallScore >= 4.5) {
    tier = 'affirmed';
    tierMessage =
      'Strong indicators of pastoral calling. Share these results with your elders and begin a formal pathway.';
  } else if (overallScore >= 3.5) {
    tier = 'growing';
    tierMessage =
      'Many strengths with a few areas to develop. Work a 90-day plan with your leaders.';
  } else {
    tier = 'developing';
    tierMessage =
      'Build foundations, then re-assess with your pastor in 3–6 months.';
  }

  return {
    overall: overallScore,
    tier,
    tierMessage,
    byCategory: categoryScores,
  };
}

// ==========================================
// COPY BANK
// ==========================================

function getScoreMessage(score: number): string {
  if (score >= 4.5) return 'Grace is evident here.';
  if (score >= 3.5) return 'Growing strength with a few gaps.';
  return 'Priority growth area.';
}

function getNudge(section: SectionKey, score: number): string {
  if (score >= 4.5) {
    return 'Keep rhythms; mentor someone in this area.';
  }
  if (score >= 3.5) {
    return 'Choose one practice this month; review with a mentor.';
  }

  // Low score nudges by category
  const lowScoreNudges: Record<SectionKey, string> = {
    godliness:
      'Meet weekly with a mature believer for prayer and accountability.',
    home_life:
      'Seek pastoral counsel; consider delaying ministry until home health improves.',
    preaching:
      'Study preaching (books, podcasts), and practice teaching in small settings.',
    shepherding:
      'Shadow an elder doing pastoral care; read one shepherding book this quarter.',
    evangelism:
      'Build one new friendship with a non-Christian; share the gospel this month.',
    leadership:
      'Lead a small team project; read a leadership book; ask for feedback.',
    gcc_alignment:
      'Attend a GCC event; schedule a call with a GCC pastor; explore the Statement of Faith.',
  };

  return lowScoreNudges[section];
}

// ==========================================
// QUESTION MAPPING
// ==========================================

export interface Question {
  key: string;
  text: string;
  section: SectionKey;
}

export const QUESTIONS: Question[] = [
  // GODLINESS
  {
    key: 'godliness_disciplines',
    text: 'I pursue Christ through regular disciplines (prayer, Scripture, confession, fasting).',
    section: 'godliness',
  },
  {
    key: 'godliness_humility',
    text: 'People close to me see consistent humility.',
    section: 'godliness',
  },
  {
    key: 'godliness_patience',
    text: "I'm patient, kind, and gracious in conflict.",
    section: 'godliness',
  },
  {
    key: 'godliness_self_control',
    text: 'My lifestyle shows emotional and physical self-control.',
    section: 'godliness',
  },
  {
    key: 'godliness_gospel_growth',
    text: 'Leaders see me growing in understanding and applying the gospel.',
    section: 'godliness',
  },
  {
    key: 'godliness_generosity',
    text: 'My giving to the local church has been faithful.',
    section: 'godliness',
  },
  {
    key: 'godliness_money_power',
    text: "I'm not marked by love of money, power, or status; I'm respected at work/community.",
    section: 'godliness',
  },
  {
    key: 'godliness_accountability',
    text: 'I walk transparently with trusted brothers for accountability.',
    section: 'godliness',
  },

  // HOME LIFE
  {
    key: 'home_alignment',
    text: 'My wife and I are aligned on big issues (parenting, finances, priorities, ministry).',
    section: 'home_life',
  },
  {
    key: 'home_care',
    text: 'My wife experiences tangible care and loving leadership.',
    section: 'home_life',
  },
  {
    key: 'home_support_call',
    text: 'She understands and supports the cost of ministry.',
    section: 'home_life',
  },
  {
    key: 'home_spiritual_rhythms',
    text: "I lead our family's spiritual rhythms.",
    section: 'home_life',
  },
  {
    key: 'home_parenting',
    text: 'I discipline my children with love, without harshness, building lasting trust.',
    section: 'home_life',
  },
  {
    key: 'home_financial_margin',
    text: 'We can make financial sacrifices if needed for ministry.',
    section: 'home_life',
  },
  {
    key: 'home_hospitality',
    text: 'Our home is hospitable; people feel welcome.',
    section: 'home_life',
  },
  {
    key: 'home_stewardship',
    text: 'We steward family finances wisely.',
    section: 'home_life',
  },
  {
    key: 'home_affirmation',
    text: 'My wife (and kids, if applicable) affirm my call.',
    section: 'home_life',
  },
  {
    key: 'home_integrity',
    text: 'My private life matches my public words.',
    section: 'home_life',
  },

  // PREACHING
  {
    key: 'preach_desire',
    text: 'I desire and am able to proclaim the gospel to believers and non-believers.',
    section: 'preaching',
  },
  {
    key: 'preach_centrality',
    text: "Leaders affirm my grasp of the gospel's storyline and centrality.",
    section: 'preaching',
  },
  {
    key: 'preach_integrity',
    text: 'My life patterns do not contradict my preaching.',
    section: 'preaching',
  },
  {
    key: 'preach_expositional',
    text: "I'm committed to expositional preaching and its principles.",
    section: 'preaching',
  },
  {
    key: 'preach_engagement',
    text: 'People stay engaged when I teach.',
    section: 'preaching',
  },
  {
    key: 'preach_clarity',
    text: 'I receive positive feedback on organization and clarity.',
    section: 'preaching',
  },
  {
    key: 'preach_application',
    text: 'I connect Scripture to everyday life.',
    section: 'preaching',
  },

  // SHEPHERDING
  {
    key: 'shep_wisdom',
    text: "I apply Scripture wisely to people's needs.",
    section: 'shepherding',
  },
  {
    key: 'shep_encourage',
    text: "I consistently encourage and name God's work in others.",
    section: 'shepherding',
  },
  {
    key: 'shep_crisis_care',
    text: 'I move toward people in trial and crisis.',
    section: 'shepherding',
  },
  {
    key: 'shep_access',
    text: 'People open up to me about hurts and struggles.',
    section: 'shepherding',
  },
  {
    key: 'shep_discipleship_fruit',
    text: 'I can point to fruit from discipling others.',
    section: 'shepherding',
  },
  {
    key: 'shep_admonish',
    text: 'I speak truth in love, including gentle correction.',
    section: 'shepherding',
  },
  {
    key: 'shep_culture_discern',
    text: 'I spot cultural drift and pastorally re-center on Scripture.',
    section: 'shepherding',
  },

  // EVANGELISM
  {
    key: 'ev_context',
    text: 'I understand the people and culture where I hope to serve.',
    section: 'evangelism',
  },
  {
    key: 'ev_recent_share',
    text: "I've recently shared the gospel with a non-believer.",
    section: 'evangelism',
  },
  {
    key: 'ev_beyond_service',
    text: 'I see mission as reaching the lost, not just building a service.',
    section: 'evangelism',
  },
  {
    key: 'ev_connect_outsiders',
    text: 'I connect outsiders to church people and activities.',
    section: 'evangelism',
  },
  {
    key: 'ev_friends',
    text: 'I maintain friendships with non-Christians.',
    section: 'evangelism',
  },
  {
    key: 'ev_reputation',
    text: 'My reputation among outsiders commends me for pastoral work.',
    section: 'evangelism',
  },
  {
    key: 'ev_multiplication',
    text: 'I value multiplying disciples, leaders, elders, and churches.',
    section: 'evangelism',
  },
  {
    key: 'ev_contextualize',
    text: 'I contextualize without compromising Scripture.',
    section: 'evangelism',
  },
  {
    key: 'ev_nations',
    text: 'I care about the nations beyond my church.',
    section: 'evangelism',
  },

  // LEADERSHIP
  {
    key: 'lead_vision',
    text: 'I cast vision that stirs faith.',
    section: 'leadership',
  },
  {
    key: 'lead_rapport',
    text: 'I build rapport and trust quickly.',
    section: 'leadership',
  },
  {
    key: 'lead_resilience',
    text: 'I show steady, resilient follow-through.',
    section: 'leadership',
  },
  {
    key: 'lead_clarity',
    text: 'My leadership is clear, gospel-driven, and appropriately passionate.',
    section: 'leadership',
  },
  {
    key: 'lead_priorities',
    text: 'I identify and address what truly matters.',
    section: 'leadership',
  },
  {
    key: 'lead_plurality',
    text: 'I value a healthy plurality of elders.',
    section: 'leadership',
  },
  {
    key: 'lead_execute',
    text: 'I mobilize people to do quality work together.',
    section: 'leadership',
  },
  {
    key: 'lead_simplify',
    text: 'I make complex things simple and motivating.',
    section: 'leadership',
  },
  {
    key: 'lead_recognized',
    text: 'Leaders recognize my leadership and communication gifts.',
    section: 'leadership',
  },

  // GCC ALIGNMENT
  {
    key: 'gcc_interdependence',
    text: 'I embrace interdependence among churches as biblical.',
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_extra_local',
    text: 'I value gifted extra-local leaders who serve churches.',
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_relationship',
    text: 'I have a current relationship with a GCC pastor/church.',
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_culture_fit',
    text: 'I understand and am drawn to GCC culture and fruit.',
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_events',
    text: "I've connected with GCC pastors at events.",
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_receive_contribute',
    text: 'I want to receive from and contribute to a network.',
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_eager',
    text: "After reviewing GCC values/attributes, I'm eager to explore planting with GCC.",
    section: 'gcc_alignment',
  },
  {
    key: 'gcc_statement',
    text: 'My wife and I can affirm the GCC Statement of Faith.',
    section: 'gcc_alignment',
  },
];
