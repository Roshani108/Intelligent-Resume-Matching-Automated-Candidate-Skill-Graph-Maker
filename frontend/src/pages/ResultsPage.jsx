import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ATSScorePanel from '../components/ATSScorePanel';
import SkillGraphCanvas from '../components/SkillGraphCanvas';
import KeywordsPanel from '../components/KeywordsPanel';
import ImprovementsPanel from '../components/ImprovementsPanel';
import SkillGapPanel from '../components/SkillGapPanel';
import JobsPanel from '../components/JobsPanel';
import { analyzeATSDetails } from '../services/atsEngine';

const NAV_ITEMS = [
  { id: 'ats', icon: '◎', label: 'Match Score' },
  { id: 'graph', icon: '◈', label: 'Skill Map' },
  { id: 'keywords', icon: '⊞', label: 'Keywords' },
  { id: 'improve', icon: '↗', label: 'Improvements' },
  { id: 'gaps', icon: '⊘', label: 'Skill Gaps' },
  { id: 'jobs', icon: '⊕', label: 'Job Matches' },
  { id: 'print_view', icon: '↓', label: 'Export Report' },
];

export default function ResultsPage({ result, onReset, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('ats');

  const job = result?.job || {};
  const candidates = result?.ranked_candidates || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeCandidate = candidates[selectedIdx] || candidates[0] || {};

  // Formulate rich ATS analysis
  const atsData = useMemo(() => {
    return analyzeATSDetails(activeCandidate, job);
  }, [activeCandidate, job]);

  const score = Math.round(activeCandidate.overall_score || 0);
  const scoreColor = score >= 75 ? '#0D9488' : score >= 50 ? '#D97706' : '#DC2626';

  // Comprehensive CSV Export
  const handleExportCSV = () => {
    const matchedStr = (activeCandidate.matched_required_skills || []).join('; ');
    const missingStr = (activeCandidate.missing_required_skills || []).join('; ');
    const tipsStr = (atsData.actionableSuggestions || []).join(' | ');

    const rows = [
      ["METRIC / FIELD", "CANDIDATE ANALYSIS VALUE"],
      ["Candidate Name", `"${activeCandidate.candidate_name || 'Candidate'}"`],
      ["Email Address", `"${activeCandidate.email || 'N/A'}"`],
      ["Phone Number", `"${activeCandidate.phone || 'N/A'}"`],
      ["Resume File", `"${activeCandidate.filename || 'resume.pdf'}"`],
      ["Target Job Role", `"${job.title || 'Target Role'}"`],
      ["Overall Score (%)", `${score}%`],
      ["Keyword Match Score (%)", `${atsData.scoreBreakdown.keywordMatch}%`],
      ["Semantic Relevance Score (%)", `${atsData.scoreBreakdown.relevance}%`],
      ["Formatting Score (%)", `${atsData.scoreBreakdown.formatting}%`],
      ["Section Completeness Score (%)", `${atsData.scoreBreakdown.completeness}%`],
      ["Total Matched Keywords Count", activeCandidate.matched_required_skills?.length || 0],
      ["Matched Keywords", `"${matchedStr}"`],
      ["Total Missing Keywords Count", activeCandidate.missing_required_skills?.length || 0],
      ["Missing Keywords", `"${missingStr}"`],
      ["Key Recommendations", `"${tipsStr}"`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Resume_Analysis_${(activeCandidate.candidate_name || 'Report').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Print-only report component
  const PrintableReport = () => (
    <div className="print-only" style={{
      padding: '24px 20px',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 700,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #0F172A', paddingBottom: 12, marginBottom: 20,
      }}>
        <div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#0F172A' }}>
            meetMux — Resume Analysis Report
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {activeCandidate.candidate_name} · {job.title || 'Target Role'}
          </div>
        </div>
        <div style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 32,
          color: scoreColor, fontWeight: 400,
        }}>
          {score}%
        </div>
      </div>

      {/* Score Breakdown Strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, padding: '12px 16px', background: '#F8F7F4',
        borderRadius: 10, border: '1px solid #E2E8F0',
        marginBottom: 20, textAlign: 'center',
      }}>
        <div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>Keyword Match</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#0D9488' }}>
            {atsData.scoreBreakdown.keywordMatch}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>Relevance</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#2563EB' }}>
            {atsData.scoreBreakdown.relevance}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>Formatting</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#D97706' }}>
            {atsData.scoreBreakdown.formatting}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>Completeness</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#7C3AED' }}>
            {atsData.scoreBreakdown.completeness}%
          </div>
        </div>
      </div>

      {/* SECTION 1: CRITICAL MISSING KEYWORDS */}
      <div style={{ marginBottom: 18, pageBreakInside: 'avoid' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.8px', color: '#DC2626',
          borderBottom: '1.5px solid #DC2626', paddingBottom: 4, marginBottom: 8,
        }}>
          1. Critical Missing Keywords
        </h3>
        <p style={{ fontSize: 11, color: '#475569', marginBottom: 8, lineHeight: 1.5 }}>
          Include these terms naturally under <strong>Technical Skills</strong> and within <strong>Project Bullet Points</strong>:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(activeCandidate.missing_required_skills || []).map(s => (
            <span key={s} style={{
              background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA',
              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
            }}>
              ✗ {s}
            </span>
          ))}
          {(!activeCandidate.missing_required_skills || activeCandidate.missing_required_skills.length === 0) && (
            <span style={{ fontSize: 11, color: '#0D9488', fontWeight: 700 }}>✓ All mandatory keywords present!</span>
          )}
        </div>
      </div>

      {/* SECTION 2: IMPORTANT NOTES */}
      <div style={{ marginBottom: 20, pageBreakInside: 'avoid' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.8px', color: '#0F172A',
          borderBottom: '1.5px solid #0F172A', paddingBottom: 4, marginBottom: 10,
        }}>
          2. Important Notes & Guidelines to Improve Your CV
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Use Google\'s X-Y-Z Impact Formula', body: 'Format bullets as: "Accomplished [X], as measured by [Y], by doing [Z]".' },
            { title: 'Standardize Section Headings', body: 'Use "Work Experience", "Technical Skills", "Projects", and "Education".' },
            { title: 'Single-Column Clean Layout', body: 'Avoid multi-column Canva templates that confuse parsers.' },
            { title: 'Include Clickable Links', body: 'Add GitHub and LinkedIn URLs for verifiability.' },
          ].map((note, i) => (
            <div key={i} style={{
              padding: '8px 12px', background: '#F8F7F4', borderRadius: 8,
              border: '1px solid #E2E8F0', fontSize: 11, lineHeight: 1.55,
            }}>
              <strong>Note {String.fromCharCode(65 + i)} — {note.title}:</strong><br />
              {note.body}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: REWRITTEN BULLET POINTS */}
      <div style={{ marginBottom: 18, pageBreakInside: 'avoid' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.8px', color: '#0D9488',
          borderBottom: '1.5px solid #0D9488', paddingBottom: 4, marginBottom: 8,
        }}>
          3. Rewritten Bullet Points (Ready to Copy)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {atsData.improvedBullets.slice(0, 2).map((b, i) => (
            <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', fontSize: 11 }}>
              <div style={{ padding: '6px 10px', background: '#FEF2F2', color: '#64748B' }}>
                <span style={{ fontWeight: 800, color: '#DC2626' }}>BEFORE: </span>{b.original}
              </div>
              <div style={{ padding: '6px 10px', background: '#FFFFFF', color: '#0F172A', fontWeight: 600 }}>
                <span style={{ fontWeight: 800, color: '#0D9488' }}>AFTER: </span>{b.improved}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TOP SKILLS TO LEARN */}
      <div style={{ pageBreakInside: 'avoid' }}>
        <h3 style={{
          fontSize: 13, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.8px', color: '#D97706',
          borderBottom: '1.5px solid #D97706', paddingBottom: 4, marginBottom: 8,
        }}>
          4. Top Skills to Learn Next
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {atsData.learningRoadmap.slice(0, 4).map((item, i) => (
            <div key={i} style={{
              background: '#FFFBEB', border: '1px solid #FDE68A',
              padding: '6px 12px', borderRadius: 6, fontSize: 11,
            }}>
              <strong>{item.skill}</strong> ({item.priority}) — Est: {item.estimatedTime}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4' }}>
      <div className="no-print">
        <Navbar onReset={onReset} isResultsPage={true} user={user} onLogout={onLogout} />
      </div>

      {/* Print-only version */}
      <PrintableReport />

      {/* MAIN LAYOUT: Sidebar + Content */}
      <div className="no-print" style={{
        display: 'flex',
        minHeight: 'calc(100vh - 60px)',
      }}>
        {/* SIDEBAR */}
        <div style={{
          width: 220,
          background: '#0F172A',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          animation: 'slideInLeft 0.4s ease',
        }}>
          {/* Candidate Info at top */}
          <div style={{
            padding: '0 20px 20px',
            borderBottom: '1px solid #1E293B',
            marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: '#FFFFFF',
              marginBottom: 10,
            }}>
              {(activeCandidate.candidate_name || 'C')[0]}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 2 }}>
              {activeCandidate.candidate_name || 'Candidate'}
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              {job.title || 'Target Role'}
            </div>

            {/* Score badge */}
            <div style={{
              marginTop: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28, color: scoreColor,
              }}>
                {score}%
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#94A3B8',
                lineHeight: 1.3,
              }}>
                overall<br />match
              </div>
            </div>
          </div>

          {/* Candidate Switcher */}
          {candidates.length > 1 && (
            <div style={{ padding: '8px 20px 16px', borderBottom: '1px solid #1E293B', marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 8 }}>
                CANDIDATES ({candidates.length})
              </div>
              {candidates.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: idx === selectedIdx ? '#1E293B' : 'transparent',
                    color: idx === selectedIdx ? '#F59E0B' : '#94A3B8',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    marginBottom: 2,
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: idx === selectedIdx ? '#334155' : '#1E293B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, flexShrink: 0,
                  }}>
                    #{c.rank}
                  </span>
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {c.candidate_name || c.filename}
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 800,
                    color: c.overall_score >= 75 ? '#0D9488' : c.overall_score >= 50 ? '#D97706' : '#DC2626',
                  }}>
                    {Math.round(c.overall_score)}%
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Nav Items */}
          <div style={{ padding: '0 12px', flex: 1 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#475569',
              letterSpacing: '1.2px', textTransform: 'uppercase',
              padding: '8px 8px 12px',
            }}>
              ANALYSIS
            </div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === item.id ? '#1E293B' : 'transparent',
                  color: activeTab === item.id ? '#F59E0B' : '#94A3B8',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: activeTab === item.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginBottom: 2,
                  textAlign: 'left',
                  borderLeft: activeTab === item.id ? '3px solid #D97706' : '3px solid transparent',
                }}
                onMouseEnter={e => {
                  if (activeTab !== item.id) e.currentTarget.style.background = '#1E293B50';
                }}
                onMouseLeave={e => {
                  if (activeTab !== item.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #1E293B' }}>
            <button
              onClick={handleExportCSV}
              style={{
                width: '100%', padding: '8px 12px',
                borderRadius: 8, border: '1px solid #334155',
                background: '#1E293B', color: '#94A3B8',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                marginBottom: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#D97706'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
            >
              ↓ Export CSV
            </button>
            <button
              onClick={handlePrint}
              style={{
                width: '100%', padding: '8px 12px',
                borderRadius: 8, border: '1px solid #334155',
                background: '#1E293B', color: '#94A3B8',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#D97706'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
            >
              ↓ Print PDF
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{
          flex: 1,
          padding: '32px 36px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 60px)',
          animation: 'fadeUp 0.5s ease',
        }}>
          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 26, color: '#0F172A', marginBottom: 4,
            }}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h2>
            <div style={{ fontSize: 13, color: '#64748B' }}>
              {activeCandidate.candidate_name} · {job.title || 'Target Role'}
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === 'ats' && (
            <ATSScorePanel
              score={score}
              scoreColor={scoreColor}
              scoreBreakdown={atsData.scoreBreakdown}
              formattingIssues={atsData.formattingIssues}
              candidate={activeCandidate}
              job={job}
            />
          )}
          {activeTab === 'graph' && (
            <SkillGraphCanvas candidate={activeCandidate} job={job} />
          )}
          {activeTab === 'keywords' && (
            <KeywordsPanel candidate={activeCandidate} job={job} />
          )}
          {activeTab === 'improve' && (
            <ImprovementsPanel atsData={atsData} />
          )}
          {activeTab === 'gaps' && (
            <SkillGapPanel candidate={activeCandidate} job={job} atsData={atsData} />
          )}
          {activeTab === 'jobs' && (
            <JobsPanel candidate={activeCandidate} job={job} />
          )}
          {activeTab === 'print_view' && (
            <div style={{
              background: '#FFFFFF', borderRadius: 16,
              padding: '36px 32px', border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20, color: '#0F172A', marginBottom: 8,
              }}>
                Export Options
              </div>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 1.7 }}>
                Download a comprehensive analysis report with scores, missing keywords,
                improvement notes, and rewritten bullet points.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleExportCSV} className="btn-primary" style={{ padding: '12px 24px' }}>
                  ↓ Download CSV Report
                </button>
                <button onClick={handlePrint} className="btn-accent" style={{ padding: '12px 24px' }}>
                  ↓ Print / Save as PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
