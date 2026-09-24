import React, { useState } from 'react';

export default function CandidateDetailModal({ candidate, onClose }) {
  const [activeTab, setActiveTab] = useState('skills');

  if (!candidate) return null;

  const {
    candidate_name,
    email,
    phone,
    filename,
    overall_score,
    score_breakdown = {},
    matched_required_skills = [],
    missing_required_skills = [],
    matched_preferred_skills = [],
    missing_preferred_skills = [],
    experience_summary,
    profile = {}
  } = candidate;

  const scoreColor = overall_score >= 75 ? '#00C896' : overall_score >= 50 ? '#F59E0B' : '#FF4458';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(28, 27, 41, 0.55)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 860,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(28, 27, 41, 0.2)',
        border: '1px solid #E8E7F0',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 36px',
          borderBottom: '1px solid #E8E7F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAF9F6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Score Badge */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: `3px solid ${scoreColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 14px ${scoreColor}33`,
            }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                {Math.round(overall_score)}
              </span>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#8E8CA6' }}>MATCH</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 900, color: '#1C1B29' }}>
                  {candidate_name}
                </h2>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 100,
                  background: '#EEEAFF',
                  color: '#5B4CF5',
                }}>
                  Rank #{candidate.rank || 1}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 4, fontSize: 13, color: '#4A4960' }}>
                {email && <span>✉️ {email}</span>}
                {phone && <span>📞 {phone}</span>}
                <span>📄 {filename}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1px solid #E8E7F0',
              background: '#FFFFFF',
              fontSize: 18,
              fontWeight: 700,
              color: '#8E8CA6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#1C1B29'; e.currentTarget.style.background = '#F0EFEA'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8E8CA6'; e.currentTarget.style.background = '#FFFFFF'; }}
          >
            ✕
          </button>
        </div>

        {/* Tab Strip */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E8E7F0',
          padding: '0 36px',
          background: '#FFFFFF',
        }}>
          {[
            { id: 'skills', label: 'Skills Breakdown' },
            { id: 'experience', label: 'Timeline & Experience' },
            { id: 'scores', label: 'Algorithmic Scores' },
            { id: 'raw', label: 'Normalized Resume Text' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'transparent',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: activeTab === t.id ? '#5B4CF5' : '#8E8CA6',
                borderBottom: `2px solid ${activeTab === t.id ? '#5B4CF5' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ padding: '28px 36px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: SKILLS */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Matched Required */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, color: '#1C1B29' }}>
                    Matched Required Skills ({matched_required_skills.length})
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {matched_required_skills.map(s => (
                    <span key={s} style={{
                      background: '#E0FAF4',
                      color: '#009872',
                      border: '1px solid rgba(0, 200, 150, 0.3)',
                      padding: '6px 14px',
                      borderRadius: 100,
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      ✓ {s}
                    </span>
                  ))}
                  {matched_required_skills.length === 0 && (
                    <span style={{ fontSize: 13, color: '#8E8CA6' }}>No required skills matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Required */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, color: '#FF4458' }}>
                    Missing Required Skills ({missing_required_skills.length})
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {missing_required_skills.map(s => (
                    <span key={s} style={{
                      background: '#FFF0F2',
                      color: '#FF4458',
                      border: '1px solid rgba(255, 68, 88, 0.25)',
                      padding: '6px 14px',
                      borderRadius: 100,
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      ✕ {s}
                    </span>
                  ))}
                  {missing_required_skills.length === 0 && (
                    <span style={{ fontSize: 13, color: '#009872' }}>All required skills satisfied!</span>
                  )}
                </div>
              </div>

              {/* Matched Preferred */}
              {matched_preferred_skills.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>⭐</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, color: '#1C1B29' }}>
                      Bonus Preferred Skills ({matched_preferred_skills.length})
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {matched_preferred_skills.map(s => (
                      <span key={s} style={{
                        background: '#EEF8FF',
                        color: '#0EA5E9',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        padding: '6px 14px',
                        borderRadius: 100,
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        ★ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                background: '#FAF9F6',
                borderRadius: 16,
                padding: '20px 24px',
                border: '1px solid #E8E7F0',
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#8E8CA6', textTransform: 'uppercase', marginBottom: 4 }}>
                  Experience Overview
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1B29' }}>
                  {experience_summary || 'Standard career profile extracted from resume.'}
                </div>
              </div>

              {/* Education */}
              {profile?.education && (
                <div>
                  <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                    🎓 Education
                  </h4>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 14,
                    background: '#FFFFFF',
                    border: '1px solid #E8E7F0',
                    fontSize: 14,
                    color: '#4A4960',
                  }}>
                    {Array.isArray(profile.education) ? profile.education.join(', ') : JSON.stringify(profile.education)}
                  </div>
                </div>
              )}

              {/* Previous Roles */}
              {profile?.timeline && (
                <div>
                  <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
                    💼 Career Timeline
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Array.isArray(profile.timeline) ? profile.timeline.map((item, idx) => (
                      <div key={idx} style={{
                        padding: '14px 18px',
                        borderRadius: 12,
                        background: '#FAF9F6',
                        border: '1px solid #E8E7F0',
                        fontSize: 14,
                        color: '#1C1B29',
                      }}>
                        {typeof item === 'object' ? `${item.role || item.title || 'Role'} — ${item.company || ''} (${item.duration || item.years || ''})` : String(item)}
                      </div>
                    )) : (
                      <div style={{ fontSize: 14, color: '#4A4960' }}>{JSON.stringify(profile.timeline)}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCORES */}
          {activeTab === 'scores' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'Overall Composite Match', val: overall_score, color: scoreColor },
                { label: 'Required Skills Match', val: score_breakdown?.required_skills_score ?? score_breakdown?.skills_score ?? 0, color: '#00C896' },
                { label: 'Preferred Skills Bonus', val: score_breakdown?.preferred_skills_score ?? 0, color: '#0EA5E9' },
                { label: 'Semantic Text Similarity (Sentence-Transformers)', val: score_breakdown?.semantic_score ?? score_breakdown?.embedding_similarity ?? 0, color: '#5B4CF5' },
                { label: 'Experience Match', val: score_breakdown?.experience_score ?? 0, color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#FAF9F6',
                  borderRadius: 16,
                  padding: '20px 24px',
                  border: '1px solid #E8E7F0',
                }}>
                  <div style={{ fontSize: 12, color: '#8E8CA6', fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                    {typeof s.val === 'number' ? Math.round(s.val > 1 ? s.val : s.val * 100) : s.val}%
                  </div>
                  <div style={{
                    height: 6,
                    background: '#E8E7F0',
                    borderRadius: 10,
                    marginTop: 12,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, typeof s.val === 'number' ? (s.val > 1 ? s.val : s.val * 100) : 0)}%`,
                      background: s.color,
                      borderRadius: 10,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RAW TEXT */}
          {activeTab === 'raw' && (
            <div>
              <div style={{
                background: '#FAF9F6',
                border: '1px solid #E8E7F0',
                borderRadius: 14,
                padding: '20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#4A4960',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                maxHeight: '360px',
                overflowY: 'auto',
              }}>
                {profile?.raw_text || candidate.profile?.raw_text || 'No raw text stored.'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 36px',
          borderTop: '1px solid #E8E7F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          background: '#FAF9F6',
        }}>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
