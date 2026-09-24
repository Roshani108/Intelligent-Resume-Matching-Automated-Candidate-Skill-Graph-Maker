import React, { useState } from 'react';

/* Score Ring */
function ScoreCircle({ score, size = 76 }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const col = score >= 75 ? '#00C896' : score >= 50 ? '#F59E0B' : '#FF4458';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E8E7F0" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={col} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, color: col, lineHeight: 1 }}>
          {Math.round(score)}
        </span>
        <span style={{ fontSize: 9, fontWeight: 800, color: '#8E8CA6' }}>MATCH</span>
      </div>
    </div>
  );
}

export default function CandidateRanking({
  candidates,
  onSelectCandidate,
  onOpenGraph,
  selectedForCompare = [],
  onToggleCompare,
  shortlisted = [],
  onToggleShortlist,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Filtering
  const filtered = candidates.filter(c => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      c.candidate_name?.toLowerCase().includes(term) ||
      c.filename?.toLowerCase().includes(term) ||
      (c.matched_required_skills || []).some(s => s.toLowerCase().includes(term));

    // Score filter
    let matchesScore = true;
    if (scoreFilter === 'high') matchesScore = c.overall_score >= 75;
    else if (scoreFilter === 'mid') matchesScore = c.overall_score >= 50 && c.overall_score < 75;
    else if (scoreFilter === 'low') matchesScore = c.overall_score < 50;

    return matchesSearch && matchesScore;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Search & Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '16px 24px',
        border: '1px solid #E8E7F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 2px 8px rgba(28, 27, 41, 0.04)',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#8E8CA6' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Filter candidates by name or skill..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 100,
              border: '1.5px solid #E8E7F0',
              outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              color: '#1C1B29',
              background: '#FAF9F6',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#5B4CF5'}
            onBlur={e => e.currentTarget.style.borderColor = '#E8E7F0'}
          />
        </div>

        {/* Score Filter Pills */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8E8CA6' }}>Filter:</span>
          {[
            { id: 'all', label: `All (${candidates.length})` },
            { id: 'high', label: `Strong ≥75% (${candidates.filter(c => c.overall_score >= 75).length})` },
            { id: 'mid', label: `Moderate 50-74% (${candidates.filter(c => c.overall_score >= 50 && c.overall_score < 75).length})` },
            { id: 'low', label: `Review <50% (${candidates.filter(c => c.overall_score < 50).length})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setScoreFilter(f.id)}
              style={{
                background: scoreFilter === f.id ? '#1C1B29' : '#FAF9F6',
                color: scoreFilter === f.id ? '#FFFFFF' : '#4A4960',
                border: '1px solid',
                borderColor: scoreFilter === f.id ? '#1C1B29' : '#E8E7F0',
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List Cards */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '60px',
          textAlign: 'center',
          border: '1px solid #E8E7F0',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900 }}>No candidates match your criteria</div>
          <div style={{ fontSize: 13, color: '#8E8CA6', marginTop: 4 }}>Try adjusting your search query or score filter.</div>
        </div>
      ) : (
        filtered.map((c) => {
          const isSelected = selectedForCompare.includes(c.filename);
          const isShortlisted = shortlisted.includes(c.filename);
          const isExpanded = expandedId === c.filename;
          const score = c.overall_score || 0;
          const scoreColor = score >= 75 ? '#00C896' : score >= 50 ? '#F59E0B' : '#FF4458';

          return (
            <div
              key={c.filename}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: isSelected ? '2px solid #5B4CF5' : '1px solid #E8E7F0',
                boxShadow: isSelected ? '0 8px 30px rgba(91, 76, 245, 0.15)' : '0 2px 10px rgba(28, 27, 41, 0.04)',
                padding: '24px 28px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                {/* Compare Checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} title="Select for comparison">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleCompare && onToggleCompare(c.filename)}
                    style={{ width: 18, height: 18, accentColor: '#5B4CF5', cursor: 'pointer' }}
                  />
                </label>

                {/* Rank Badge */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: c.rank === 1 ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' :
                              c.rank === 2 ? 'linear-gradient(135deg, #94A3B8, #CBD5E1)' :
                              c.rank === 3 ? 'linear-gradient(135deg, #D97706, #B45309)' : '#F0EFEA',
                  color: c.rank <= 3 ? '#FFFFFF' : '#4A4960',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontWeight: 900,
                  boxShadow: c.rank <= 3 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  flexShrink: 0,
                }}>
                  {c.rank === 1 ? '👑' : `#${c.rank}`}
                </div>

                {/* Score Ring */}
                <ScoreCircle score={score} />

                {/* Candidate Info */}
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 20,
                      fontWeight: 900,
                      color: '#1C1B29',
                      letterSpacing: '-0.3px',
                    }}>
                      {c.candidate_name}
                    </h3>
                    {c.rank === 1 && (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: '#FFFBEB',
                        color: '#D97706',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '2px 8px',
                        borderRadius: 100,
                      }}>
                        TOP MATCH
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, fontSize: 13, color: '#4A4960', flexWrap: 'wrap' }}>
                    {c.email && <span>✉️ {c.email}</span>}
                    {c.phone && <span>📞 {c.phone}</span>}
                    <span style={{ color: '#8E8CA6' }}>📄 {c.filename}</span>
                  </div>

                  {/* Skills Snapshot */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {(c.matched_required_skills || []).slice(0, 4).map(s => (
                      <span key={s} style={{
                        background: '#E0FAF4',
                        color: '#009872',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 100,
                      }}>
                        ✓ {s}
                      </span>
                    ))}
                    {(c.matched_required_skills || []).length > 4 && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#8E8CA6', alignSelf: 'center' }}>
                        +{(c.matched_required_skills || []).length - 4} more
                      </span>
                    )}
                    {(c.missing_required_skills || []).slice(0, 2).map(s => (
                      <span key={s} style={{
                        background: '#FFF0F2',
                        color: '#FF4458',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 100,
                      }}>
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Shortlist star */}
                  <button
                    onClick={() => onToggleShortlist && onToggleShortlist(c.filename)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #E8E7F0',
                      background: isShortlisted ? '#FFFBEB' : '#FFFFFF',
                      fontSize: 18,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    title={isShortlisted ? 'Remove from shortlist' : 'Shortlist candidate'}
                  >
                    {isShortlisted ? '⭐' : '☆'}
                  </button>

                  {/* Skill Graph Button */}
                  <button
                    onClick={() => onOpenGraph && onOpenGraph(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#EEEAFF',
                      color: '#5B4CF5',
                      border: '1px solid #C4BEFB',
                      padding: '10px 16px',
                      borderRadius: 100,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#5B4CF5'; e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#EEEAFF'; e.currentTarget.style.color = '#5B4CF5'; }}
                  >
                    🕸️ Skill Graph
                  </button>

                  {/* Profile Details Button */}
                  <button
                    onClick={() => onSelectCandidate && onSelectCandidate(c)}
                    className="btn-outline"
                    style={{ padding: '9px 18px', fontSize: 13 }}
                  >
                    Inspect Profile
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
