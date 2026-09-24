import React from 'react';

export default function CandidateComparison({ candidates, requiredSkills = [], preferredSkills = [] }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '60px 40px',
        textAlign: 'center',
        border: '1px solid #E8E7F0',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900 }}>
          Select 2 or More Candidates to Compare
        </div>
        <div style={{ fontSize: 14, color: '#8E8CA6', marginTop: 6 }}>
          Use the checkboxes on the Leaderboard cards to compare candidates side-by-side.
        </div>
      </div>
    );
  }

  const allSkills = Array.from(new Set([...requiredSkills, ...preferredSkills]));

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 24,
      border: '1px solid #E8E7F0',
      boxShadow: '0 4px 20px rgba(28, 27, 41, 0.05)',
      overflow: 'hidden',
    }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid #E8E7F0',
        background: '#FAF9F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, color: '#1C1B29' }}>
            Side-by-Side Candidate Evaluation
          </h3>
          <p style={{ fontSize: 13, color: '#4A4960', marginTop: 2 }}>
            Benchmarking {candidates.length} selected candidate{candidates.length > 1 ? 's' : ''} against job requirements.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto', padding: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '16px 20px',
                borderBottom: '2px solid #E8E7F0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: '#8E8CA6',
                textTransform: 'uppercase',
                width: '220px',
              }}>
                Feature / Candidate
              </th>
              {candidates.map(c => {
                const col = c.overall_score >= 75 ? '#00C896' : c.overall_score >= 50 ? '#F59E0B' : '#FF4458';
                return (
                  <th key={c.filename} style={{
                    textAlign: 'center',
                    padding: '16px 20px',
                    borderBottom: '2px solid #E8E7F0',
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#EEEAFF',
                      color: '#5B4CF5',
                      padding: '3px 10px',
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}>
                      Rank #{c.rank}
                    </div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 900, color: '#1C1B29' }}>
                      {c.candidate_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#8E8CA6', fontWeight: 600, marginTop: 2 }}>
                      {c.filename}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Overall Score */}
            <tr style={{ borderBottom: '1px solid #E8E7F0', background: '#FAF9F6' }}>
              <td style={{ padding: '16px 20px', fontWeight: 800, fontSize: 14, color: '#1C1B29' }}>
                Overall Match Score
              </td>
              {candidates.map(c => {
                const col = c.overall_score >= 75 ? '#00C896' : c.overall_score >= 50 ? '#F59E0B' : '#FF4458';
                return (
                  <td key={c.filename} style={{ textAlign: 'center', padding: '16px 20px' }}>
                    <span style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 28,
                      fontWeight: 900,
                      color: col,
                    }}>
                      {Math.round(c.overall_score)}%
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Required Skills Match Rate */}
            <tr style={{ borderBottom: '1px solid #E8E7F0' }}>
              <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: 13, color: '#4A4960' }}>
                Required Skills Matched
              </td>
              {candidates.map(c => (
                <td key={c.filename} style={{ textAlign: 'center', padding: '16px 20px' }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#009872',
                    background: '#E0FAF4',
                    padding: '4px 12px',
                    borderRadius: 100,
                  }}>
                    {c.matched_required_skills?.length || 0} / {requiredSkills.length}
                  </span>
                </td>
              ))}
            </tr>

            {/* Experience Summary */}
            <tr style={{ borderBottom: '1px solid #E8E7F0', background: '#FAF9F6' }}>
              <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: 13, color: '#4A4960' }}>
                Experience Assessment
              </td>
              {candidates.map(c => (
                <td key={c.filename} style={{ textAlign: 'center', padding: '16px 20px', fontSize: 13, color: '#1C1B29' }}>
                  {c.experience_summary || 'Standard profile'}
                </td>
              ))}
            </tr>

            {/* Individual Skills Checklist */}
            {allSkills.map(skill => {
              const isReq = requiredSkills.includes(skill);
              return (
                <tr key={skill} style={{ borderBottom: '1px solid #E8E7F0' }}>
                  <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#1C1B29' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{skill}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: isReq ? '#EEEAFF' : '#EEF8FF',
                        color: isReq ? '#5B4CF5' : '#0EA5E9',
                      }}>
                        {isReq ? 'Required' : 'Preferred'}
                      </span>
                    </div>
                  </td>
                  {candidates.map(c => {
                    const hasSkill = (c.matched_required_skills || []).includes(skill) ||
                                     (c.matched_preferred_skills || []).includes(skill) ||
                                     (c.profile?.skills || []).includes(skill);
                    return (
                      <td key={c.filename} style={{ textAlign: 'center', padding: '12px 20px' }}>
                        {hasSkill ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#E0FAF4',
                            color: '#00C896',
                            fontWeight: 900,
                            fontSize: 14,
                          }}>
                            ✓
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#FFF0F2',
                            color: '#FF4458',
                            fontWeight: 900,
                            fontSize: 14,
                          }}>
                            ✕
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
