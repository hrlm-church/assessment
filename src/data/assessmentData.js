export const assessmentCategories = [
  {
    id: 'godliness',
    title: 'Godliness',
    description: 'Personal character and spiritual maturity',
    questions: [
      'I consistently demonstrate the fruit of the Spirit (love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control)',
      'I maintain regular spiritual disciplines (prayer, Bible study, meditation)',
      'I demonstrate humility and teachability in relationships',
      'I handle conflict and criticism in a godly manner',
      'My private life reflects my public testimony',
      'I actively fight against sin and pursue holiness',
      'Others would describe me as a person of integrity',
      'I have a growing relationship with God'
    ]
  },
  {
    id: 'homeLife',
    title: 'Home Life',
    description: 'Marriage, family, and household management',
    questions: [
      'My spouse is supportive of my calling to ministry (if married)',
      'I prioritize quality time with my family',
      'My children respect me and are following Christ (if applicable)',
      'I manage my household well and provide for my family',
      'My home is characterized by hospitality and welcome',
      'I maintain healthy boundaries between ministry and family time',
      'My marriage reflects Christ and the church (if married)',
      'My family sees ministry as a shared calling, not a competitor'
    ]
  },
  {
    id: 'preaching',
    title: 'Preaching',
    description: 'Ability to teach and communicate God\'s Word',
    questions: [
      'I can clearly explain biblical passages and their meaning',
      'People tell me my teaching is helpful and clear',
      'I prepare messages with diligence and prayer',
      'I can make Scripture relevant to everyday life',
      'I am passionate about proclaiming God\'s Word',
      'I study the Bible regularly and deeply',
      'I can adapt my teaching to different audiences',
      'My teaching produces life change in others'
    ]
  },
  {
    id: 'shepherding',
    title: 'Shepherding',
    description: 'Care, counseling, and spiritual guidance',
    questions: [
      'I genuinely care about people\'s spiritual wellbeing',
      'People seek me out for counsel and prayer',
      'I am patient with people in their struggles and growth',
      'I can speak truth in love when needed',
      'I follow up with people and their spiritual journey',
      'I notice when people are struggling or absent',
      'I can handle confidential information with discretion',
      'I find joy in helping others grow spiritually'
    ]
  },
  {
    id: 'evangelism',
    title: 'Evangelistic Focus',
    description: 'Passion for reaching the lost',
    questions: [
      'I regularly share the gospel with non-Christians',
      'I have relationships with non-believers',
      'I pray regularly for people\'s salvation',
      'I look for opportunities to share my faith',
      'I am burdened for those who don\'t know Christ',
      'I can clearly articulate the gospel message',
      'I create environments where non-Christians feel welcome',
      'I disciple new believers effectively'
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Vision-casting, decision-making, and team building',
    questions: [
      'People naturally follow my leadership',
      'I can cast vision and inspire others',
      'I make difficult decisions with wisdom',
      'I can build and develop teams',
      'I delegate effectively and empower others',
      'I handle criticism and opposition with grace',
      'I can resolve conflicts and bring unity',
      'I think strategically about long-term impact'
    ]
  },
  {
    id: 'gccAlignment',
    title: 'GCC Family Alignment',
    description: 'Fit with Grace City Church values and culture',
    questions: [
      'I embrace the theological convictions of GCC',
      'I am excited about the mission and vision of GCC',
      'I work well within team-based ministry structures',
      'I am committed to the GCC church planting model',
      'I value and practice GCC\'s ministry philosophy',
      'I have strong relationships within the GCC network',
      'I am willing to be coached and receive feedback',
      'I can articulate how my gifts fit GCC\'s needs'
    ]
  }
];

export const scoreLabels = [
  { value: 1, label: 'Significant Weakness', description: 'This is a major area of concern that requires substantial growth' },
  { value: 2, label: 'Needs Development', description: 'Some evidence is present, but significant improvement is needed' },
  { value: 3, label: 'Adequate', description: 'Meeting basic expectations with room for growth' },
  { value: 4, label: 'Strength', description: 'Consistently demonstrating competency in this area' },
  { value: 5, label: 'Significant Strength', description: 'Exceptional ability that can be leveraged to help others' }
];

export const interpretationGuide = {
  categoryAverage: {
    low: { max: 2.5, interpretation: 'This category needs significant attention and development before pursuing ministry.' },
    moderate: { min: 2.5, max: 3.5, interpretation: 'This category shows adequate foundation but needs continued growth.' },
    good: { min: 3.5, max: 4.5, interpretation: 'This category demonstrates readiness for ministry with ongoing development.' },
    excellent: { min: 4.5, interpretation: 'This category is a significant strength that you can leverage in ministry.' }
  },
  overallAverage: {
    low: { max: 2.5, interpretation: 'Consider additional preparation, training, or seasoning before pursuing pastoral ministry or church planting.' },
    moderate: { min: 2.5, max: 3.5, interpretation: 'You show promise but would benefit from focused development in key areas before launching into ministry.' },
    good: { min: 3.5, max: 4.25, interpretation: 'You demonstrate readiness for ministry with the understanding that growth is ongoing.' },
    excellent: { min: 4.25, interpretation: 'You show strong indicators of calling and readiness for pastoral ministry or church planting.' }
  }
};
