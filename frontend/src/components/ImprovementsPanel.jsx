import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ImprovementsPanel({ atsData }) {
  const { actionableSuggestions = [], improvedBullets = [] } = atsData;
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Actionable Tips */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
        border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        animation: 'fadeUp 0.4s ease',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
          textTransform: 'uppercase', color: '#94A3B8', marginBottom: 16,
        }}>
          ACTIONABLE ENHANCEMENTS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actionableSuggestions.map((tip, idx) => (
            <div key={idx} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              background: '#F8F7F4', borderRadius: 12,
              border: '1px solid #E2E8F0', alignItems: 'flex-start',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: '#0F172A', color: '#F59E0B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, paddingTop: 2 }}>
                {tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewritten Bullet Points */}
      {improvedBullets.length > 0 && (
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '24px 24px',
          border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
          animation: 'fadeUp 0.5s ease',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#94A3B8', marginBottom: 6,
          }}>
            REWRITTEN BULLET POINTS
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 18 }}>
            Replace weak statements with metric-driven achievements.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {improvedBullets.map((b, idx) => (
              <div key={idx} style={{
                border: '1px solid #E2E8F0', borderRadius: 12,
                overflow: 'hidden', background: '#FFFFFF',
              }}>
                {/* Original */}
                <div style={{
                  padding: '12px 16px', background: '#FEF2F2',
                  borderBottom: '1px solid #FECACA',
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: '#DC2626',
                    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4,
                  }}>
                    BEFORE
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                    {b.original}
                  </div>
                </div>
                {/* Improved */}
                <div style={{
                  padding: '12px 16px', background: '#FFFFFF',
                  display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: '#0D9488',
                      letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4,
                    }}>
                      AFTER (OPTIMIZED)
                    </div>
                    <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.6, fontWeight: 600 }}>
                      {b.improved}
                    </div>
                  </div>
                  <button
                    onClick={() => copyBullet(b.improved, idx)}
                    style={{
                      flexShrink: 0, padding: '7px 14px', borderRadius: 8,
                      border: '1px solid',
                      borderColor: copiedIdx === idx ? '#99F6E4' : '#E2E8F0',
                      background: copiedIdx === idx ? '#F0FDFA' : '#F8F7F4',
                      color: copiedIdx === idx ? '#0D9488' : '#475569',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {copiedIdx === idx ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
