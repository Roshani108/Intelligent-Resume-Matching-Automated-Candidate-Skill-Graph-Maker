import React, { useState, useEffect } from 'react';
import {
  Network, Layers, CheckCircle2, Star, AlertTriangle,
  PlusCircle, Zap, ArrowRight
} from 'lucide-react';
import { getCandidateSkillGraph } from '../services/api';

export default function SkillGraphView({ candidateSkills, requiredSkills, preferredSkills }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const data = await getCandidateSkillGraph(candidateSkills, requiredSkills, preferredSkills);
        setGraphData(data);
      } catch (err) {
        console.error('Failed to load skill graph:', err);
      } finally {
        setLoading(false);
      }
    };

    if (candidateSkills && candidateSkills.length > 0) {
      fetchGraph();
    } else {
      setLoading(false);
    }
  }, [candidateSkills, requiredSkills, preferredSkills]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <div>
            <div className="skeleton" style={{ width: '200px', height: '16px', marginBottom: '6px' }} />
            <div className="skeleton" style={{ width: '300px', height: '12px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ width: `${80 + Math.random() * 60}px`, height: '32px', borderRadius: '20px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!graphData || graphData.nodes?.length === 0) {
    return null;
  }

  const matchedRequired = graphData.nodes.filter(n => n.status === 'matched_required');
  const matchedPreferred = graphData.nodes.filter(n => n.status === 'matched_preferred');
  const missingRequired = graphData.nodes.filter(n => n.status === 'missing_required');
  const missingPreferred = graphData.nodes.filter(n => n.status === 'missing_preferred');
  const candidateExtra = graphData.nodes.filter(n => n.status === 'candidate_extra');

  const sections = [
    {
      key: 'matched_req',
      items: matchedRequired,
      icon: <CheckCircle2 size={15} />,
      title: 'Matched Required',
      badgeClass: 'badge-success',
      badgeLabel: 'Must-Have',
      chipBg: 'var(--accent-emerald-glow)',
      chipBorder: 'rgba(16,185,129,0.35)',
      chipColor: 'var(--accent-emerald)',
      prefix: '✓',
    },
    {
      key: 'missing_req',
      items: missingRequired,
      icon: <AlertTriangle size={15} />,
      title: 'Missing Required',
      badgeClass: 'badge-danger',
      badgeLabel: 'Gap',
      chipBg: 'var(--accent-rose-glow)',
      chipBorder: 'rgba(244,63,94,0.3)',
      chipColor: 'var(--accent-rose)',
      prefix: '✕',
    },
    {
      key: 'preferred',
      items: [...matchedPreferred, ...missingPreferred],
      icon: <Star size={15} />,
      title: 'Preferred Skills',
      badgeClass: 'badge-info',
      badgeLabel: 'Bonus',
      chipBg: 'var(--accent-indigo-glow)',
      chipBorder: 'rgba(99,102,241,0.3)',
      chipColor: 'var(--accent-indigo)',
      prefix: '★',
      renderCustom: true,
      matchedPreferred,
      missingPreferred,
    },
    {
      key: 'extra',
      items: candidateExtra,
      icon: <PlusCircle size={15} />,
      title: 'Additional Skills',
      badgeClass: 'badge-violet',
      badgeLabel: 'Extra',
      chipBg: 'var(--accent-violet-glow)',
      chipBorder: 'rgba(139,92,246,0.3)',
      chipColor: 'var(--accent-violet)',
      prefix: '+',
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: 'var(--accent-indigo-glow)',
          padding: '10px', borderRadius: '10px',
          color: 'var(--accent-indigo)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Network size={18} />
        </div>
        <div>
          <h3 style={{
            fontSize: '1.05rem', fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Skill Ecosystem Breakdown
          </h3>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            Candidate competencies mapped against job requirements
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sections.map(section => {
          if (section.items.length === 0) return null;

          return (
            <div key={section.key} style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${section.chipBorder}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: section.chipColor,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  {section.icon}
                  {section.title}
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    marginLeft: '4px',
                  }}>
                    ({section.items.length})
                  </span>
                </span>
                <span className={`badge ${section.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                  {section.badgeLabel}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {section.renderCustom ? (
                  <>
                    {section.matchedPreferred.map(node => (
                      <span key={node.id} style={{
                        background: section.chipBg,
                        border: `1px solid ${section.chipBorder}`,
                        color: section.chipColor,
                        padding: '5px 14px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem', fontWeight: 600,
                      }}>
                        ★ {node.label}
                      </span>
                    ))}
                    {section.missingPreferred.map(node => (
                      <span key={node.id} style={{
                        background: 'var(--accent-amber-glow)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        color: 'var(--accent-amber)',
                        padding: '5px 14px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem', fontWeight: 500,
                      }}>
                        ○ {node.label}
                      </span>
                    ))}
                  </>
                ) : (
                  section.items.map(node => (
                    <span key={node.id} style={{
                      background: section.chipBg,
                      border: `1px solid ${section.chipBorder}`,
                      color: section.chipColor,
                      padding: '5px 14px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem', fontWeight: 600,
                    }}>
                      {section.prefix} {node.label}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ecosystem Edges */}
      {graphData.edges?.length > 0 && (
        <div style={{
          marginTop: '20px', paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{
            fontSize: '0.78rem', fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Layers size={14} color="var(--accent-indigo)" />
            Ecosystem Relationships
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {graphData.edges.map((edge, idx) => (
              <span key={idx} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'capitalize' }}>
                  {edge.source.replace(/_/g, ' ')}
                </span>
                <ArrowRight size={10} color="var(--text-tertiary)" />
                <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '0.7rem' }}>
                  {edge.relation}
                </span>
                <ArrowRight size={10} color="var(--text-tertiary)" />
                <span style={{ color: 'var(--accent-indigo)', fontWeight: 600, textTransform: 'capitalize' }}>
                  {edge.target.replace(/_/g, ' ')}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
