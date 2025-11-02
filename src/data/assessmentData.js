// Assessment data with new copy - DO NOT CHANGE UI STYLING
export const assessmentCategories = [
  {
    id: 'godliness',
    title: 'Godliness',
    description: 'Life with God that shapes life with people.',
    questions: [
      'I pursue Christ through regular disciplines (prayer, Scripture, confession, fasting).',
      'People close to me see consistent humility.',
      'I\'m patient, kind, and gracious in conflict.',
      'My lifestyle shows emotional and physical self-control.',
      'Leaders see me growing in understanding and applying the gospel.',
      'My giving to the local church has been faithful.',
      'I\'m not marked by love of money, power, or status; I\'m respected at work/community.',
      'I walk transparently with trusted brothers for accountability.'
    ],
    questionKeys: [
      'godliness_disciplines',
      'godliness_humility',
      'godliness_patience',
      'godliness_self_control',
      'godliness_gospel_growth',
      'godliness_generosity',
      'godliness_money_power',
      'godliness_accountability'
    ]
  },
  {
    id: 'home_life',
    title: 'Home Life',
    description: 'Health at home that supports ministry.',
    questions: [
      'My wife and I are aligned on big issues (parenting, finances, priorities, ministry).',
      'My wife experiences tangible care and loving leadership.',
      'She understands and supports the cost of ministry.',
      'I lead our family\'s spiritual rhythms.',
      'I discipline my children with love, without harshness, building lasting trust.',
      'We can make financial sacrifices if needed for ministry.',
      'Our home is hospitable; people feel welcome.',
      'We steward family finances wisely.',
      'My wife (and kids, if applicable) affirm my call.',
      'My private life matches my public words.'
    ],
    questionKeys: [
      'home_alignment',
      'home_care',
      'home_support_call',
      'home_spiritual_rhythms',
      'home_parenting',
      'home_financial_margin',
      'home_hospitality',
      'home_stewardship',
      'home_affirmation',
      'home_integrity'
    ]
  },
  {
    id: 'preaching',
    title: 'Preaching',
    description: 'Clarity, gospel centrality, and application.',
    questions: [
      'I desire and am able to proclaim the gospel to believers and non-believers.',
      'Leaders affirm my grasp of the gospel\'s storyline and centrality.',
      'My life patterns do not contradict my preaching.',
      'I\'m committed to expositional preaching and its principles.',
      'People stay engaged when I teach.',
      'I receive positive feedback on organization and clarity.',
      'I connect Scripture to everyday life.'
    ],
    questionKeys: [
      'preach_desire',
      'preach_centrality',
      'preach_integrity',
      'preach_expositional',
      'preach_engagement',
      'preach_clarity',
      'preach_application'
    ]
  },
  {
    id: 'shepherding',
    title: 'Shepherding',
    description: 'Care and courage for people in real life.',
    questions: [
      'I apply Scripture wisely to people\'s needs.',
      'I consistently encourage and name God\'s work in others.',
      'I move toward people in trial and crisis.',
      'People open up to me about hurts and struggles.',
      'I can point to fruit from discipling others.',
      'I speak truth in love, including gentle correction.',
      'I spot cultural drift and pastorally re-center on Scripture.'
    ],
    questionKeys: [
      'shep_wisdom',
      'shep_encourage',
      'shep_crisis_care',
      'shep_access',
      'shep_discipleship_fruit',
      'shep_admonish',
      'shep_culture_discern'
    ]
  },
  {
    id: 'evangelism',
    title: 'Evangelistic Focus',
    description: 'A heart for the lost and the nations.',
    questions: [
      'I understand the people and culture where I hope to serve.',
      'I\'ve recently shared the gospel with a non-believer.',
      'I see mission as reaching the lost, not just building a service.',
      'I connect outsiders to church people and activities.',
      'I maintain friendships with non-Christians.',
      'My reputation among outsiders commends me for pastoral work.',
      'I value multiplying disciples, leaders, elders, and churches.',
      'I contextualize without compromising Scripture.',
      'I care about the nations beyond my church.'
    ],
    questionKeys: [
      'ev_context',
      'ev_recent_share',
      'ev_beyond_service',
      'ev_connect_outsiders',
      'ev_friends',
      'ev_reputation',
      'ev_multiplication',
      'ev_contextualize',
      'ev_nations'
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Vision, resilience, and team building.',
    questions: [
      'I cast vision that stirs faith.',
      'I build rapport and trust quickly.',
      'I show steady, resilient follow-through.',
      'My leadership is clear, gospel-driven, and appropriately passionate.',
      'I identify and address what truly matters.',
      'I value a healthy plurality of elders.',
      'I mobilize people to do quality work together.',
      'I make complex things simple and motivating.',
      'Leaders recognize my leadership and communication gifts.'
    ],
    questionKeys: [
      'lead_vision',
      'lead_rapport',
      'lead_resilience',
      'lead_clarity',
      'lead_priorities',
      'lead_plurality',
      'lead_execute',
      'lead_simplify',
      'lead_recognized'
    ]
  },
  {
    id: 'gcc_alignment',
    title: 'GCC Alignment',
    description: 'Shared doctrine, culture, and mission.',
    questions: [
      'I embrace interdependence among churches as biblical.',
      'I value gifted extra-local leaders who serve churches.',
      'I have a current relationship with a GCC pastor/church.',
      'I understand and am drawn to GCC culture and fruit.',
      'I\'ve connected with GCC pastors at events.',
      'I want to receive from and contribute to a network.',
      'After reviewing GCC values/attributes, I\'m eager to explore planting with GCC.',
      'My wife and I can affirm the GCC Statement of Faith.'
    ],
    questionKeys: [
      'gcc_interdependence',
      'gcc_extra_local',
      'gcc_relationship',
      'gcc_culture_fit',
      'gcc_events',
      'gcc_receive_contribute',
      'gcc_eager',
      'gcc_statement'
    ]
  }
];

export const scoreLabels = [
  { value: 1, label: 'Strongly Disagree', description: 'This does not describe me' },
  { value: 2, label: 'Disagree', description: 'This rarely describes me' },
  { value: 3, label: 'Neutral', description: 'This sometimes describes me' },
  { value: 4, label: 'Agree', description: 'This often describes me' },
  { value: 5, label: 'Strongly Agree', description: 'This consistently describes me' }
];

export const interpretationGuide = {
  categoryAverage: {
    low: {
      max: 3.5,
      interpretation: 'Priority growth area.',
      nudges: {
        godliness: 'Meet weekly with a mature believer for prayer and accountability.',
        home_life: 'Seek pastoral counsel; consider delaying ministry until home health improves.',
        preaching: 'Study preaching (books, podcasts), and practice teaching in small settings.',
        shepherding: 'Shadow an elder doing pastoral care; read one shepherding book this quarter.',
        evangelism: 'Build one new friendship with a non-Christian; share the gospel this month.',
        leadership: 'Lead a small team project; read a leadership book; ask for feedback.',
        gcc_alignment: 'Attend a GCC event; schedule a call with a GCC pastor; explore the Statement of Faith.'
      }
    },
    moderate: {
      min: 3.5,
      max: 4.5,
      interpretation: 'Growing strength with a few gaps.',
      nudge: 'Choose one practice this month; review with a mentor.'
    },
    excellent: {
      min: 4.5,
      interpretation: 'Grace is evident here.',
      nudge: 'Keep rhythms; mentor someone in this area.'
    }
  },
  overallAverage: {
    low: {
      max: 3.5,
      interpretation: 'Build foundations, then re-assess with your pastor in 3–6 months.',
      tier: 'developing'
    },
    moderate: {
      min: 3.5,
      max: 4.5,
      interpretation: 'Many strengths with a few areas to develop. Work a 90-day plan with your leaders.',
      tier: 'growing'
    },
    excellent: {
      min: 4.5,
      interpretation: 'Strong indicators of pastoral calling. Share these results with your elders and begin a formal pathway.',
      tier: 'affirmed'
    }
  }
};
