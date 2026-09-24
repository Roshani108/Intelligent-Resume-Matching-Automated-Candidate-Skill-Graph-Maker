import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar';
import { matchResumes, fetchSampleResumes } from '../services/api';

const SAMPLE_ROLES = [
  {
    label: 'Fullstack Engineer',
    title: 'Senior Python & React Fullstack Engineer',
    desc: `We are looking for a Fullstack Engineer to build high-scale web platforms.

Requirements:
- Strong proficiency with Python, FastAPI, and PostgreSQL database design.
- Hands-on experience with containerization using Docker.
- Experience with modern frontend development in React and TypeScript.
- Strong understanding of RESTful APIs, authentication, and state management.

Nice to have:
- Cloud deployment experience on AWS or Google Cloud.
- Knowledge of GraphQL, Redis caching, or microservices architecture.`
  },
  {
    label: 'ML Engineer',
    title: 'Machine Learning Infrastructure Engineer',
    desc: `Join our machine learning team to build and scale production systems.

Requirements:
- Strong proficiency in Python, PyTorch, and Machine Learning engineering.
- Experience deploying ML models using FastAPI, Docker, and REST APIs.
- Solid understanding of Natural Language Processing (NLP) or Computer Vision.

Nice to have:
- Deep Learning, Scikit-Learn, Pandas, and AWS experience.
- Experience with vector search, embeddings, and LLM fine-tuning.`
  },
  {
    label: 'Data Analyst',
    title: 'Data Analyst & BI Specialist',
    desc: `We are looking for an analytical thinker to transform raw data into high-impact business strategy.

Requirements:
- 2+ years of experience with SQL, Python, and data visualization tools.
- Strong proficiency with Tableau or Power BI dashboards.
- Experience with statistical analysis and A/B testing frameworks.

Nice to have:
- Experience with dbt, Airflow, or modern ETL pipelines.
- Fundamental knowledge of machine learning.`
  },
  {
    label: 'Frontend Dev',
    title: 'Frontend React Developer',
    desc: `We are seeking a Frontend Engineer passionate about crafting pixel-perfect, responsive user interfaces.

Requirements:
- Strong proficiency with React, JavaScript (ES6+), HTML5, and CSS3.
- Experience with modern state management, hooks, and responsive web design.
- Experience with RESTful APIs and Git version control.

Nice to have:
- Experience with Next.js, TypeScript, and TailwindCSS or Styled Components.`
  }
];

const STEPS = [
  'Extracting resume content...',
  'Identifying skills & experience...',
  'Mapping against job requirements...',
  'Computing match scores...',
  'Generating recommendations...',
];

export default function UploadPage({ onDone, user, onLogout }) {
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = (incoming) => {
    const pdfs = Array.from(incoming).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) {
      toast.error('Please upload PDF files only');
      return;
    }
    setFiles(pdfs);
    toast.success(`${pdfs.length} resume${pdfs.length > 1 ? 's' : ''} loaded`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleLoadSamples = async () => {
    setLoadingSamples(true);
    try {
      const samples = await fetchSampleResumes();
      if (samples.length > 0) {
        setFiles(samples);
        toast.success(`${samples.length} sample resumes loaded`);
      } else {
        toast.error('Could not load sample resumes');
      }
    } catch {
      toast.error('Failed to load sample resumes');
    }
    setLoadingSamples(false);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) { toast.error('Upload at least one resume'); return; }
    if (!jobDesc.trim()) { toast.error('Paste a job description'); return; }

    setIsAnalyzing(true);
    setStepIdx(0);

    const interval = setInterval(() => {
      setStepIdx(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);

    try {
      const data = await matchResumes(jobTitle, jobDesc, files);
      clearInterval(interval);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#D97706', '#F59E0B', '#0D9488', '#0F172A'] });
      toast.success('Analysis complete!');
      onDone(data);
    } catch (err) {
      clearInterval(interval);
      toast.error(err?.response?.data?.detail || 'Analysis failed. Check that the backend is running.');
    }
    setIsAnalyzing(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4' }}>
      <Navbar user={user} onLogout={onLogout} />

      {/* HERO SECTION */}
      <div style={{
        background: '#0F172A',
        padding: '56px 40px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
            padding: '5px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 700,
            color: '#FCD34D',
            marginBottom: 20,
            animation: 'fadeUp 0.5s ease',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#F59E0B',
              animation: 'pulseGlow 2s infinite',
            }} />
            Resume Intelligence
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 42,
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: 14,
            letterSpacing: '-0.5px',
            animation: 'fadeUp 0.6s ease',
          }}>
            Upload. Analyze. <span style={{ color: '#F59E0B' }}>Hire smarter.</span>
          </h1>

          <p style={{
            fontSize: 16,
            color: '#94A3B8',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7,
            animation: 'fadeUp 0.7s ease',
          }}>
            Drop your candidates' resumes against any job description.
            Get instant match scores, keyword analysis, and actionable insights.
          </p>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div style={{
        maxWidth: 720,
        margin: '-32px auto 60px',
        padding: '0 20px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '36px 36px',
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
          border: '1px solid #E2E8F0',
          animation: 'fadeUp 0.8s ease',
        }}>

          {/* STEP 1: RESUME UPLOAD */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: '#0F172A', color: '#F59E0B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800,
              }}>
                1
              </div>
              <span style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#0F172A',
              }}>
                Upload Resumes
              </span>
              <button
                onClick={handleLoadSamples}
                disabled={loadingSamples}
                style={{
                  marginLeft: 'auto',
                  background: '#F8F7F4',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D97706'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                {loadingSamples ? 'Loading...' : 'Use Sample Resumes'}
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#D97706' : files.length > 0 ? '#0D9488' : '#E2E8F0'}`,
                borderRadius: 12,
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: isDragging ? 'rgba(217, 119, 6, 0.04)' : files.length > 0 ? '#F0FDFA' : '#FAFAF8',
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                multiple
                style={{ display: 'none' }}
                onChange={e => handleFiles(e.target.files)}
              />
              {files.length > 0 ? (
                <>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: '#CCFBF1', color: '#0D9488',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, margin: '0 auto 10px',
                  }}>
                    ✓
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>
                    {files.length} resume{files.length > 1 ? 's' : ''} ready
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    {files.map(f => f.name).join(', ')}
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: '#FEF3C7', color: '#D97706',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, margin: '0 auto 10px',
                  }}>
                    ↑
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>
                    Click to upload or drag & drop
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    PDF format, up to 10MB per file
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0 28px' }} />

          {/* STEP 2: JOB DESCRIPTION */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#0F172A', color: '#F59E0B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800,
                }}>
                  2
                </div>
                <span style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#0F172A',
                }}>
                  Target Job Description
                </span>
              </div>

              {/* Template pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {SAMPLE_ROLES.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setJobTitle(p.title); setJobDesc(p.desc); toast.success(`Template: "${p.label}"`); }}
                    style={{
                      background: jobTitle === p.title ? '#0F172A' : '#F8F7F4',
                      color: jobTitle === p.title ? '#F59E0B' : '#64748B',
                      border: '1px solid',
                      borderColor: jobTitle === p.title ? '#0F172A' : '#E2E8F0',
                      padding: '4px 11px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Job Title Input */}
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="Target Job Title (e.g. Senior Fullstack Engineer)"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1.5px solid #E2E8F0',
                  outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0F172A',
                  background: '#FAFAF8',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#D97706';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.08)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Job Description Textarea */}
            <textarea
              rows={7}
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job requirements and skills list..."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 10,
                border: '1.5px solid #E2E8F0',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                color: '#0F172A',
                background: '#FAFAF8',
                resize: 'vertical',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#D97706';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.08)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>
                {jobDesc.length} characters
              </span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-accent"
            style={{
              padding: '15px 40px',
              fontSize: 15,
              fontWeight: 800,
              width: '100%',
              borderRadius: 10,
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resumes →'}
          </button>
        </div>
      </div>

      {/* PROCESSING OVERLAY MODAL */}
      {isAnalyzing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '44px 40px',
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(15, 23, 42, 0.25)',
            animation: 'scaleIn 0.3s ease',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '3px solid #FEF3C7',
              borderTopColor: '#D97706',
              animation: 'spin 0.7s linear infinite',
              margin: '0 auto 20px',
            }} />
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22,
              color: '#0F172A',
              marginBottom: 8,
            }}>
              Analyzing Resumes
            </div>
            <div style={{
              fontSize: 14,
              color: '#64748B',
              marginBottom: 24,
              minHeight: 22,
            }}>
              {STEPS[stepIdx]}
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 4,
                    width: i === stepIdx ? 32 : 12,
                    borderRadius: 10,
                    background: i <= stepIdx ? '#D97706' : '#E2E8F0',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
