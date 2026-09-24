import React, { useState, useMemo } from 'react';

export default function SkillGraphCanvas({ candidate, job }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const matchedRequired = candidate?.matched_required_skills || [];
  const missingRequired = candidate?.missing_required_skills || [];
  const matchedPreferred = candidate?.matched_preferred_skills || [];
  const missingPreferred = candidate?.missing_preferred_skills || [];
  const jobTitle = job.title || 'Target Role';
  const candidateName = candidate?.candidate_name || 'Candidate';

  const skillCategories = useMemo(() => [
    {
      id: 'matched_req',
      title: 'Core Matched',
      subtitle: 'Required skills found in resume',
      icon: '✓',
      color: '#0D9488',
      bg: '#F0FDFA',
      border: '#99F6E4',
      skills: matchedRequired.map(s => ({
        name: s,
        advice: `"${s}" is already verified in your resume. Keep it prominently listed under Technical Skills and reinforce it with project examples.`,
      })),
    },
    {
      id: 'missing_req',
      title: 'Critical Gaps',
      subtitle: 'Required skills missing from resume',
      icon: '✗',
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      skills: missingRequired.map(s => ({
        name: s,
        advice: `"${s}" is a required skill for this role. Add it to your Technical Skills section and reference it in at least one project bullet point.`,
      })),
    },
    {
      id: 'matched_pref',
      title: 'Bonus Skills',
      subtitle: 'Preferred skills already present',
      icon: '★',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      skills: matchedPreferred.map(s => ({
        name: s,
        advice: `"${s}" is a bonus preferred skill. Highlighting it gives you an edge. Feature it in project descriptions.`,
      })),
    },
    {
      id: 'missing_pref',
      title: 'Nice to Have',
      subtitle: 'Optional skills to strengthen profile',
      icon: '○',
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      skills: missingPreferred.map(s => ({
        name: s,
        advice: `"${s}" is a nice-to-have skill. Learning it can differentiate you from other applicants.`,
      })),
    },
  ], [matchedRequired, missingRequired, matchedPreferred, missingPreferred]);

  const totalSkillsCount = matchedRequired.length + missingRequired.length + matchedPreferred.length + missingPreferred.length;

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 16,
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      overflow: 'hidden',
      animation: 'fadeUp 0.5s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 28px',
        borderBottom: '1px solid #F1F5F9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h3 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 18, color: '#0F172A',
            }}>
              Skill Competency Map
            </h3>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: '#FEF3C7', color: '#D97706',
              padding: '2px 10px', borderRadius: 100,
            }}>
              {totalSkillsCount} Skills
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B' }}>
            Visual mapping of resume skills against job requirements.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'matched_req', label: `Matched (${matchedRequired.length})`, col: '#0D9488' },
            { id: 'missing_req', label: `Gaps (${missingRequired.length})`, col: '#DC2626' },
            { id: 'matched_pref', label: `Bonus (${matchedPreferred.length})`, col: '#2563EB' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              style={{
                background: activeFilter === btn.id ? '#0F172A' : '#FFFFFF',
                color: activeFilter === btn.id ? '#F59E0B' : '#475569',
                border: '1px solid',
                borderColor: activeFilter === btn.id ? '#0F172A' : '#E2E8F0',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 28px' }}>
        {/* Central Hub */}
        <div style={{
          maxWidth: 380, margin: '0 auto 28px',
          background: '#F8F7F4', borderRadius: 14,
          padding: '16px 20px', border: '2px solid #0F172A',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#D97706', marginBottom: 4,
          }}>
            TARGET ROLE
          </div>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 17, color: '#0F172A',
          }}>
            {jobTitle}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>
            Candidate: <strong style={{ color: '#475569' }}>{candidateName}</strong>
          </div>
        </div>

        {/* Skill Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {skillCategories
            .filter(cat => activeFilter === 'all' || activeFilter === cat.id)
            .map((cat, catIdx) => (
              <div
                key={cat.id}
                style={{
                  background: '#FFFFFF', borderRadius: 14,
                  padding: '20px', border: `1.5px solid ${cat.border}`,
                  boxShadow: '0 1px 4px rgba(15,23,42,0.03)',
                  animation: `fadeUp ${0.3 + catIdx * 0.1}s ease`,
                }}
              >
                {/* Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: cat.bg, color: cat.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800,
                    }}>
                      {cat.icon}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                      {cat.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 800,
                    background: cat.bg, color: cat.color,
                    padding: '2px 8px', borderRadius: 100,
                  }}>
                    {cat.skills.length}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                  {cat.subtitle}
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.skills.length === 0 ? (
                    <span style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>
                      None in this category.
                    </span>
                  ) : (
                    cat.skills.map(s => {
                      const isSelected = selectedSkill?.name === s.name;
                      return (
                        <button
                          key={s.name}
                          onClick={() => setSelectedSkill(isSelected ? null : s)}
                          style={{
                            background: isSelected ? cat.color : cat.bg,
                            color: isSelected ? '#FFFFFF' : cat.color,
                            border: `1.5px solid ${cat.border}`,
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12, fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? `0 3px 10px ${cat.color}30` : 'none',
                            transform: isSelected ? 'scale(1.05)' : 'none',
                          }}
                        >
                          {s.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Selected Skill Detail */}
        {selectedSkill && (
          <div style={{
            marginTop: 20, background: '#F8F7F4', borderRadius: 12,
            padding: '16px 20px', border: '1.5px solid #D97706',
            animation: 'fadeUp 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1px', color: '#D97706',
                }}>
                  Recommendation
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                  — {selectedSkill.name}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, maxWidth: 580 }}>
                {selectedSkill.advice}
              </div>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="btn-outline"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
