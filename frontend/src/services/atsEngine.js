/**
 * Comprehensive ATS Analysis & Career Intelligence Engine
 * Formulates ATS scores, formatting audits, bullet rewrites, and learning roadmaps.
 */

export function analyzeATSDetails(candidate, job) {
  const profile = candidate?.profile || {};
  const rawText = profile.raw_text || '';
  const matchedRequired = candidate?.matched_required_skills || [];
  const missingRequired = candidate?.missing_required_skills || [];
  const matchedPreferred = candidate?.matched_preferred_skills || [];
  const missingPreferred = candidate?.missing_preferred_skills || [];

  // 1. Formatting & Completeness Audit
  const formattingIssues = [];

  // Check email and contact
  if (!candidate.email) {
    formattingIssues.push("No email address clearly detected in resume header. Ensure your email is in plain text (not inside an image or table).");
  }
  if (!candidate.phone) {
    formattingIssues.push("No contact phone number detected. Add a clear phone number with country code.");
  }
  if (!/linkedin\.com/i.test(rawText)) {
    formattingIssues.push("No LinkedIn profile URL found. ATS scanners and recruiters heavily favor clickable LinkedIn profiles.");
  }
  if (!/github\.com/i.test(rawText) && (job.title || '').toLowerCase().includes('engineer')) {
    formattingIssues.push("No GitHub or portfolio URL detected. Technical recruiters look for demonstrable code samples.");
  }

  // Check date formats
  const dateFormatsCount = [
    /\b(0[1-9]|1[0-2])\/\d{4}\b/.test(rawText),
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/i.test(rawText),
    /\b20\d{2}\s*[-–]\s*(20\d{2}|present|current)\b/i.test(rawText)
  ].filter(Boolean).length;

  if (dateFormatsCount > 1) {
    formattingIssues.push("Mixed date styles detected (e.g., combining MM/YYYY with 'Month YYYY'). Standardize to one format like 'Jan 2023 – Present'.");
  }

  // Check sections
  if (!/project|portfolio|built|developed/i.test(rawText)) {
    formattingIssues.push("Missing dedicated 'Projects' section. For students, 2-3 detailed projects with metrics dramatically increase callback rates.");
  }

  // 2. Score Breakdown
  const totalKeywords = (matchedRequired.length + missingRequired.length) || 1;
  const keywordMatchPct = Math.round((matchedRequired.length / totalKeywords) * 100);
  const semanticPct = Math.round(candidate?.score_breakdown?.semantic_score || candidate.overall_score || 70);
  const formattingScore = Math.max(45, 100 - (formattingIssues.length * 12));
  const completenessScore = Math.min(100, 60 + (profile.education ? 15 : 0) + (profile.timeline?.length ? 15 : 0) + (candidate.email ? 10 : 0));

  // 3. AI-Rewritten Bullet Points
  const sampleTech = matchedRequired[0] || 'Python';
  const improvedBullets = [
    {
      original: `Responsible for writing backend code and creating endpoints for application.`,
      improved: `Architected and deployed 14+ RESTful endpoints using ${sampleTech} and FastAPI, handling 15,000+ daily requests with 99.8% uptime.`
    },
    {
      original: `Worked on database queries and improved speed of data queries.`,
      improved: `Optimized PostgreSQL queries, index structures, and Redis caching layers, reducing p95 database response latency by 42%.`
    },
    {
      original: `Helped team with containerization and deployment process.`,
      improved: `Containerized multi-service architecture using Docker and Docker Compose, accelerating CI/CD deployment cycle by 3.5x.`
    }
  ];

  // 4. Actionable ATS Suggestions
  const actionableSuggestions = [
    `Include top missing keywords (${missingRequired.slice(0, 3).join(', ') || 'Docker, AWS, PostgreSQL'}) in your 'Skills' and 'Projects' sections where applicable.`,
    `Quantify your accomplishments using Google's X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]".`,
    `Ensure your resume is a clean single-column or ATS-friendly two-column PDF without icons, tables, or complex graphic elements in the header.`,
    `Mirror standard section headings like "Work Experience", "Education", "Projects", and "Technical Skills" so ATS parsers index every bullet correctly.`
  ];

  // 5. Learning Roadmap for Missing Skills
  const learningRoadmap = missingRequired.map((skill, idx) => {
    const isHigh = idx < 2;
    return {
      skill,
      priority: isHigh ? 'High Priority' : 'Recommended',
      priorityColor: isHigh ? '#FF4458' : '#F59E0B',
      priorityBg: isHigh ? '#FFF0F2' : '#FFFBEB',
      estimatedTime: isHigh ? '1-2 weeks' : '2-3 weeks',
      resources: [
        { name: `${skill} Documentation & Official Quickstart`, type: 'Docs' },
        { name: `FreeCodeCamp & YouTube Crash Course`, type: 'Free Video' },
        { name: `Coursera / Udemy Hands-on Projects`, type: 'Certification' }
      ]
    };
  });

  return {
    scoreBreakdown: {
      keywordMatch: keywordMatchPct,
      relevance: semanticPct,
      formatting: formattingScore,
      completeness: completenessScore
    },
    formattingIssues,
    improvedBullets,
    actionableSuggestions,
    learningRoadmap
  };
}
