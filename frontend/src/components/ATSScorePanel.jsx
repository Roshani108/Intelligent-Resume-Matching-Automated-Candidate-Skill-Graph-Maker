import React from 'react';

function ScoreProgressBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 10, background: color,
          width: `${value}%`,
          transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'progressFill 1.5s ease',
        }} />
      </div>
    </div>
  );
}

export default function ATSScorePanel({ score, scoreColor, scoreBreakdown, formattingIssues, candidate, job }) {
  const circ = 2 * Math.PI * 44;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score + Breakdown Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Main Score Ring */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '32px 28px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'scaleIn 0.5s ease',
        }}>
          <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 16 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="44" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="65" cy="65" r="44"
                fill="none" stroke={scoreColor} strokeWidth="8"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                transform="rotate(-90 65 65)"
                style={{
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(0 0 6px ${scoreColor}50)`,
                }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 38, color: scoreColor, lineHeight: 1,
              }}>
                {score}
              </div>
              <div style={{
                fontSize: 10, color: '#94A3B8', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                out of 100
              </div>
            </div>
          </div>

          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17, color: '#0F172A', marginBottom: 4, textAlign: 'center',
          }}>
            {score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Work'}
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, textAlign: 'center' }}>
            {score >= 75
              ? 'Resume is well-aligned with the target role requirements.'
              : score >= 50
              ? 'Apply the keyword and formatting suggestions to improve.'
              : 'Several essential skills and formatting adjustments needed.'}
          </div>
        </div>

        {/* Score Breakdown Card */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '32px 28px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'scaleIn 0.6s ease',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#94A3B8', marginBottom: 20,
          }}>
            SCORE BREAKDOWN
          </div>

          <ScoreProgressBar label="Keyword Match" value={scoreBreakdown.keywordMatch || 0} color="#0D9488" />
          <ScoreProgressBar label="Semantic Relevance" value={scoreBreakdown.relevance || 0} color="#2563EB" />
          <ScoreProgressBar label="Formatting" value={scoreBreakdown.formatting || 0} color="#D97706" />
          <ScoreProgressBar label="Completeness" value={scoreBreakdown.completeness || 0} color="#7C3AED" />
        </div>
      </div>

      {/* Section Analysis Card */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '28px 28px',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        display: 'flex', flexDirection: 'column', gap: 14,
        animation: 'fadeUp 0.7s ease',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
          textTransform: 'uppercase', color: '#94A3B8',
        }}>
          ANALYSIS SUMMARY
        </div>

        {[
          {
            color: '#0F172A', label: 'TARGET ROLE',
            text: `Matched against ${job.title || 'Selected Role'}. Detected ${candidate.matched_required_skills?.length || 0} of ${job.required_skills?.length || 0} core skills.`,
          },
          {
            color: '#0D9488', label: 'CANDIDATE PROFILE',
            text: `Identified ${candidate.candidate_name}. Contact: ${candidate.email || 'Detected'}, ${candidate.phone || 'Detected'}.`,
          },
          {
            color: '#D97706', label: 'EXPERIENCE',
            text: candidate.experience_summary || 'Career timeline and educational background indexed.',
          },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '14px 18px', background: '#F8F7F4', borderRadius: 12,
            border: '1px solid #E2E8F0', borderLeft: `3px solid ${item.color}`,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: item.color,
              letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 4,
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Formatting Issues */}
      {formattingIssues.length > 0 && (
        <div style={{
          background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: 16,
          padding: '24px 28px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'fadeUp 0.8s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#FFFBEB', color: '#D97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800,
            }}>
              !
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                Formatting Warnings
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Fixing these can boost your parse rate by 10-15 points.
              </div>
            </div>
            <span style={{
              marginLeft: 'auto',
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22, color: '#D97706',
            }}>
              {formattingIssues.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {formattingIssues.map((issue, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '12px 14px', background: '#FFFBEB',
                borderRadius: 10, border: '1px solid #FDE68A',
              }}>
                <span style={{ color: '#D97706', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>!</span>
                <span style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6, fontWeight: 500 }}>
                  {issue}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
