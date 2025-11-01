# Am I Called? Assessment Tool

A web-based self-assessment application for prospective pastors and church planters, based on Dave Harvey's "Am I Called?" framework.

## Overview

This tool helps prospective pastors and church planters evaluate their readiness across seven critical areas:

1. **Godliness** - Personal character and spiritual maturity
2. **Home Life** - Marriage, family, and household management
3. **Preaching** - Ability to teach and communicate God's Word
4. **Shepherding** - Care, counseling, and spiritual guidance
5. **Evangelistic Focus** - Passion for reaching the lost
6. **Leadership** - Vision-casting, decision-making, and team building
7. **GCC Family Alignment** - Fit with Grace City Church values and culture

## Features

- **Comprehensive Assessment**: 8 questions per category (56 total questions)
- **1-5 Scoring System**: Clear labels from "Significant Weakness" to "Significant Strength"
- **Progress Tracking**: Visual progress bars and category completion indicators
- **Local Storage**: Automatically saves responses in your browser
- **Results Synthesis**:
  - Category-by-category breakdown with scores and interpretations
  - Overall assessment score and guidance
  - Identification of strengths (scores ≥ 4.0)
  - Identification of growth areas (scores < 3.5)
  - Recommended next steps
- **Export Functionality**: Download results as a text file
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling framework
- **Local Storage API** - Data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assessment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Welcome Screen**: Read the overview and click "Begin Assessment"
2. **Assessment**:
   - Answer all questions in each category using the 1-5 scale
   - Navigate between categories using Previous/Next buttons
   - Your progress is automatically saved
3. **Results**:
   - Review your overall score and category breakdown
   - Identify your strengths and growth areas
   - Read recommended next steps
   - Download your results for discussion with mentors

## Scoring Interpretation

### Individual Scores
- **5** - Significant Strength: Exceptional ability that can be leveraged to help others
- **4** - Strength: Consistently demonstrating competency in this area
- **3** - Adequate: Meeting basic expectations with room for growth
- **2** - Needs Development: Some evidence present, but significant improvement needed
- **1** - Significant Weakness: Major area of concern requiring substantial growth

### Category Averages
- **4.5+** - Significant strength to leverage in ministry
- **3.5-4.5** - Demonstrates readiness with ongoing development
- **2.5-3.5** - Adequate foundation but needs continued growth
- **< 2.5** - Needs significant attention before pursuing ministry

### Overall Assessment
- **4.25+** - Strong indicators of calling and readiness
- **3.5-4.25** - Demonstrates readiness with understanding that growth is ongoing
- **2.5-3.5** - Shows promise but benefits from focused development
- **< 2.5** - Consider additional preparation before pursuing ministry

## Data Privacy

All assessment data is stored locally in your browser using the Local Storage API. No data is transmitted to any server. Your responses remain completely private and under your control.

## Project Structure

```
assessment/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Welcome.jsx       # Landing page
│   │   ├── Assessment.jsx    # Question interface
│   │   └── Results.jsx       # Results display
│   ├── data/
│   │   └── assessmentData.js # Questions and interpretation guide
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Future Enhancements

Potential improvements for future versions:
- Print-friendly results page
- PDF export with detailed reports
- Comparison with previous assessments
- Share results with mentors/leaders
- Add coaching questions for each category
- Multi-language support
- Biblical references for each category

## Contributing

This is a ministry tool for Grace City Church. If you have suggestions or improvements, please reach out to the development team.

## License

ISC

## Support

For questions or support, please contact the GCC ministry team.
