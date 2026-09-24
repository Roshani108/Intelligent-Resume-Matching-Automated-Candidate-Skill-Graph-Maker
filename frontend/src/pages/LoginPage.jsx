import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    toast.success(`Welcome back!`);
    onLogin({ email, name: email.split('@')[0] });
  };

  const handleDemoLogin = () => {
    setEmail('recruiter@meetmux.io');
    setPassword('demo123456');
    setTimeout(() => {
      toast.success('Welcome to meetMux!');
      onLogin({ email: 'recruiter@meetmux.io', name: 'Recruiter' });
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0F172A',
    }}>
      {/* LEFT PANEL — Brand & Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative gradient orbs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* Brand Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 64, position: 'relative', zIndex: 1,
          animation: 'fadeUp 0.6s ease',
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.35)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 26,
            fontWeight: 400,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
          }}>
            meetMux
          </span>
        </div>

        {/* Hero Text */}
        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeUp 0.8s ease' }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 52,
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: 24,
            letterSpacing: '-1px',
          }}>
            See the talent{' '}
            <span style={{ color: '#F59E0B' }}>between</span>{' '}
            the lines.
          </h1>
          <p style={{
            fontSize: 17,
            color: '#94A3B8',
            lineHeight: 1.7,
            maxWidth: 460,
            fontWeight: 400,
          }}>
            meetMux turns unstructured resumes into a clear,
            explainable view of your candidate universe. Upload,
            analyze, and make smarter hiring decisions.
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 56,
          position: 'relative', zIndex: 1,
          animation: 'fadeUp 1s ease',
        }}>
          {[
            { value: '50+', label: 'Skills Tracked' },
            { value: '4', label: 'Score Dimensions' },
            { value: '< 5s', label: 'Analysis Time' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28,
                color: '#F59E0B',
                marginBottom: 4,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 13,
                color: '#64748B',
                fontWeight: 500,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div style={{
        width: 480,
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 52px',
        animation: 'slideInRight 0.6s ease',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#94A3B8',
          marginBottom: 12,
        }}>
          WELCOME BACK
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 30,
          fontWeight: 400,
          color: '#0F172A',
          marginBottom: 6,
        }}>
          Sign in to meetMux
        </h2>

        <p style={{
          fontSize: 14,
          color: '#64748B',
          marginBottom: 36,
        }}>
          Your hiring workspace is ready.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 8,
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: 10,
                border: '1.5px solid #E2E8F0',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#0F172A',
                background: '#FFFFFF',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#D97706';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 8,
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  borderRadius: 10,
                  border: '1.5px solid #E2E8F0',
                  outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#0F172A',
                  background: '#FFFFFF',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94A3B8', fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 10,
              border: 'none',
              background: '#0F172A',
              color: '#FFFFFF',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              letterSpacing: '-0.2px',
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#1E293B'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0F172A'; }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFFFFF',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              <>
                Enter workspace
                <span style={{ fontSize: 16 }}>↗</span>
              </>
            )}
          </button>
        </form>

        {/* Demo access hint */}
        <div style={{
          marginTop: 24,
          textAlign: 'center',
        }}>
          <button
            onClick={handleDemoLogin}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 13,
              color: '#94A3B8',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#D97706'}
            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
          >
            Demo access is pre-filled — <span style={{ color: '#D97706', fontWeight: 600 }}>recruiter@meetmux.io</span>
          </button>
        </div>
      </div>
    </div>
  );
}
