import React from 'react';
import { generateJobMatches } from '../services/jobsService';

function MatchScoreMini({ score }) {
  const col = score >= 80 ? '#0D9488' : score >= 60 ? '#D97706' : '#DC2626';
  const bg = score >= 80 ? '#F0FDFA' : score >= 60 ? '#FFFBEB' : '#FEF2F2';
  const circ = 2 * Math.PI * 18;
  const off = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
      <div style={{
        position: 'relative', width: 52, height: 52,
        background: bg, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="52" height="52" viewBox="0 0 52 52" style={{ position: 'absolute' }}>
          <circle cx="26" cy="26" r="18" fill="none" stroke="#F1F5F9" strokeWidth="4" />
          <circle
            cx="26" cy="26" r="18"
            fill="none" stroke={col} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
            transform="rotate(-90 26 26)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 13, color: col, position: 'relative', zIndex: 1,
        }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

export default function JobsPanel({ candidate, job }) {
  const candidateSkills = candidate?.profile?.skills || candidate?.matched_required_skills || [];
  const jobTitle = job.title || candidateSkills[0] || 'Software Engineer';
  const jobsList = generateJobMatches(jobTitle, candidateSkills);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Notice */}
      <div style={{
        padding: '12px 18px', background: '#F0FDFA',
        border: '1px solid #99F6E4', borderRadius: 12,
        fontSize: 13, color: '#0D9488', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'fadeUp 0.3s ease',
      }}>
        <span style={{ fontSize: 16 }}>→</span>
        Showing {jobsList.length} job portals matching your skills — click any card to search openings.
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {jobsList.map((item, i) => (
          <a
            key={item.id}
            href={item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                background: '#FFFFFF', border: '1px solid #E2E8F0',
                borderRadius: 14, padding: '20px',
                boxShadow: '0 1px 4px rgba(15,23,42,0.03)',
                transition: 'all 0.22s ease', height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                animation: `fadeUp ${0.3 + i * 0.08}s ease`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D97706';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: item.logoColor, color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, flexShrink: 0,
                    }}>
                      {item.logo}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                          {item.company}
                        </span>
                        {item.badge && (
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            background: '#FEF3C7', color: '#D97706',
                            padding: '1px 6px', borderRadius: 4,
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <MatchScoreMini score={item.matchScore} />
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94A3B8', marginBottom: 10, flexWrap: 'wrap' }}>
                  <span>{item.location}</span>
                  <span>{item.salary}</span>
                </div>

                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                  {item.description}
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 12, borderTop: '1px solid #F1F5F9',
              }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {item.matchedSkills?.slice(0, 4).map(s => (
                    <span key={s} style={{
                      fontSize: 10, fontWeight: 700,
                      background: '#F8F7F4', color: '#475569',
                      border: '1px solid #E2E8F0',
                      padding: '2px 7px', borderRadius: 4,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: '#D97706',
                }}>
                  Search →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
