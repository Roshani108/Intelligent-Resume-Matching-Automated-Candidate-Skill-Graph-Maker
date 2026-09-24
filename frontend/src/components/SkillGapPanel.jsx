import React from 'react';

export default function SkillGapPanel({ candidate, job, atsData }) {
  const { learningRoadmap = [] } = atsData;
  const missingRequired = candidate?.missing_required_skills || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Gap Overview */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        animation: 'fadeUp 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
            Skill Gap Summary
          </h3>
          <span style={{
            marginLeft: 'auto', fontFamily: "'DM Serif Display', serif",
            fontSize: 22, color: missingRequired.length > 0 ? '#DC2626' : '#0D9488',
          }}>
            {missingRequired.length} {missingRequired.length === 1 ? 'Gap' : 'Gaps'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16, lineHeight: 1.6 }}>
          Target role: <strong style={{ color: '#475569' }}>{job.title || 'Selected Role'}</strong>. Prioritized skills to bridge the gap.
        </p>
        {missingRequired.length === 0 ? (
          <div style={{ color: '#0D9488', fontSize: 14, fontWeight: 700 }}>
            ✓ You already possess all essential required skills!
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {missingRequired.map(s => (
              <span key={s} style={{
                background: '#FEF2F2', color: '#DC2626',
                border: '1px solid #FECACA', padding: '6px 14px',
                borderRadius: 8, fontSize: 13, fontWeight: 700,
              }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Learning Roadmap */}
      {learningRoadmap.length > 0 && (
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'fadeUp 0.5s ease',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#94A3B8', marginBottom: 18,
          }}>
            LEARNING ROADMAP
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {learningRoadmap.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '16px 18px', background: '#F8F7F4',
                  border: '1px solid #E2E8F0', borderRadius: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: item.priorityBg,
                  border: `1px solid ${item.priorityColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, color: item.priorityColor, fontWeight: 800,
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                      {item.skill}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px',
                      borderRadius: 6, background: item.priorityBg, color: item.priorityColor,
                      border: `1px solid ${item.priorityColor}30`,
                      textTransform: 'uppercase', letterSpacing: '0.4px',
                    }}>
                      {item.priority}
                    </span>
                    <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                      Est: {item.estimatedTime}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {item.resources.map((res, rIdx) => (
                      <span key={rIdx} style={{
                        background: '#FFFFFF', border: '1px solid #E2E8F0',
                        padding: '4px 10px', borderRadius: 6,
                        fontSize: 11, fontWeight: 600, color: '#475569',
                      }}>
                        {res.name} ({res.type})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
