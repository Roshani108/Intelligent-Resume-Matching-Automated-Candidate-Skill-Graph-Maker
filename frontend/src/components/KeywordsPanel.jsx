import React from 'react';

export default function KeywordsPanel({ candidate, job }) {
  const matchedRequired = candidate?.matched_required_skills || [];
  const missingRequired = candidate?.missing_required_skills || [];
  const matchedPreferred = candidate?.matched_preferred_skills || [];
  const missingPreferred = candidate?.missing_preferred_skills || [];
  const extraSkills = (candidate?.profile?.skills || []).filter(
    s => !matchedRequired.includes(s) && !matchedPreferred.includes(s)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Missing Keywords */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
          border: '1px solid #FECACA', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'fadeUp 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#FEF2F2', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800,
            }}>✗</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              Missing Required
            </h3>
            <span style={{
              marginLeft: 'auto', fontFamily: "'DM Serif Display', serif",
              fontSize: 22, color: '#DC2626',
            }}>
              {missingRequired.length}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16, lineHeight: 1.5 }}>
            Add these keywords naturally into your Skills and Experience sections.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {missingRequired.length === 0 ? (
              <div style={{ color: '#0D9488', fontSize: 13, fontWeight: 700 }}>
                ✓ All required keywords present!
              </div>
            ) : (
              missingRequired.map(k => (
                <span key={k} style={{
                  background: '#FEF2F2', color: '#DC2626',
                  border: '1px solid #FECACA', padding: '6px 14px',
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                }}>
                  ✗ {k}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Matched Keywords */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
          border: '1px solid #99F6E4', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'fadeUp 0.5s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#F0FDFA', color: '#0D9488',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800,
            }}>✓</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              Verified Match
            </h3>
            <span style={{
              marginLeft: 'auto', fontFamily: "'DM Serif Display', serif",
              fontSize: 22, color: '#0D9488',
            }}>
              {matchedRequired.length}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16, lineHeight: 1.5 }}>
            These required skills are already confirmed in your resume.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {matchedRequired.length === 0 ? (
              <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600 }}>
                No core keywords matched yet.
              </div>
            ) : (
              matchedRequired.map(k => (
                <span key={k} style={{
                  background: '#F0FDFA', color: '#0D9488',
                  border: '1px solid #99F6E4', padding: '6px 14px',
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                }}>
                  ✓ {k}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bonus & Additional Skills */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        animation: 'fadeUp 0.6s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#FEF3C7', color: '#D97706',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800,
          }}>★</span>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
            Bonus & Additional Skills
          </h4>
        </div>
        <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
          Extra capabilities that strengthen your candidacy.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {matchedPreferred.map(s => (
            <span key={s} style={{
              background: '#EFF6FF', color: '#2563EB',
              border: '1px solid #BFDBFE', padding: '5px 12px',
              borderRadius: 8, fontSize: 12, fontWeight: 700,
            }}>
              ✓ {s} (Preferred)
            </span>
          ))}
          {extraSkills.slice(0, 12).map(s => (
            <span key={s} style={{
              background: '#FEF3C7', color: '#D97706',
              border: '1px solid #FDE68A', padding: '5px 12px',
              borderRadius: 8, fontSize: 12, fontWeight: 700,
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
