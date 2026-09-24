import React from 'react';

export default function Navbar({ onReset, isResultsPage, user, onLogout }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#0F172A',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <div
        onClick={isResultsPage ? onReset : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: isResultsPage ? 'pointer' : 'default',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(217, 119, 6, 0.3)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 20,
          color: '#FFFFFF',
          letterSpacing: '-0.3px',
        }}>
          meetMux
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* User avatar & name */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#1E293B',
              border: '1.5px solid #334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#F59E0B',
              textTransform: 'uppercase',
            }}>
              {(user.name || 'U')[0]}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1' }}>
              {user.name || user.email}
            </span>
          </div>
        )}

        {/* If on results page, show Analyze Another button */}
        {isResultsPage && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#1E293B',
              color: '#F59E0B',
              border: '1px solid #334155',
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#334155';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#1E293B';
            }}
          >
            + New Analysis
          </button>
        )}

        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: '1px solid #334155',
              color: '#64748B',
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#DC2626';
              e.currentTarget.style.color = '#FCA5A5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
