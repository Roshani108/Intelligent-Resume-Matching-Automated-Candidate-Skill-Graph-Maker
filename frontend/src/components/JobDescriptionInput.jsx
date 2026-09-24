import React, { useState } from 'react';
import { Briefcase, Sparkles, CheckCircle, Tag, Loader2 } from 'lucide-react';
import { analyzeJobDescription } from '../services/api';

const SAMPLE_JDS = [
  {
    title: 'Senior Python & React Fullstack Engineer',
    desc: `We are looking for a Senior Fullstack Engineer to build our next-generation AI platforms.

Requirements:
- 4+ years of professional experience building web APIs with Python, FastAPI, and PostgreSQL.
- Solid experience with containerization using Docker.
- Experience with REST APIs and database schema design.

Nice to have:
- Hands-on experience with React, TypeScript, or GraphQL.
- Cloud deployment experience on AWS or Kubernetes.`
  },
  {
    title: 'Backend AI / Machine Learning Engineer',
    desc: `Join our machine learning infrastructure team to scale production inference services.

Requirements:
- Strong proficiency in Python, PyTorch, and Machine Learning.
- Experience deploying models using FastAPI and Docker.
- Strong fundamentals in Natural Language Processing (NLP) or Computer Vision.

Nice to have:
- Deep Learning, Pandas, Scikit-Learn, and AWS experience.`
  }
];

export default function JobDescriptionInput({ jobData, setJobData, onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (titleToUse, descToUse) => {
    const title = titleToUse !== undefined ? titleToUse : jobData.title;
    const desc = descToUse !== undefined ? descToUse : jobData.description;

    if (!desc || desc.trim().length < 10) {
      setError('Please provide at least a brief job description (10+ characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeJobDescription(title, desc);
      setJobData({
        ...jobData,
        title: title,
        description: desc,
        analysis: result
      });
      if (onAnalyzed) onAnalyzed(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze Job Description. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset) => {
    setJobData({
      ...jobData,
      title: preset.title,
      description: preset.desc
    });
    handleAnalyze(preset.title, preset.desc);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '8px', color: '#818cf8' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>1. Job Description</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Paste target job requirements for matching</p>
          </div>
        </div>

        {/* Quick Demo Presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            onClick={() => loadPreset(SAMPLE_JDS[0])}
          >
            Sample: Fullstack Dev
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            onClick={() => loadPreset(SAMPLE_JDS[1])}
          >
            Sample: AI Engineer
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Target Job Title
        </label>
        <input
          type="text"
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
          placeholder="e.g. Senior Python Developer"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Job Description & Requirements
        </label>
        <textarea
          rows={6}
          value={jobData.description}
          onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
          placeholder="Paste full job description, must-haves, and qualifications here..."
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={() => handleAnalyze()}
        disabled={loading || !jobData.description.trim()}
        style={{ width: '100%' }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing JD with spaCy NER...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Extract & Normalize Job Skills
          </>
        )}
      </button>

      {/* Extracted Skills Preview */}
      {jobData.analysis && (
        <div className="animate-fade-in" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} />
              Extracted Required Skills ({jobData.analysis.required_skills?.length || 0}):
            </span>
            {jobData.analysis.min_experience_years > 0 && (
              <span className="badge badge-preferred">
                Exp: {jobData.analysis.min_experience_years}+ Years
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {jobData.analysis.required_skills?.map((skill) => (
              <span key={skill} className="badge badge-matched">
                ✓ {skill}
              </span>
            ))}
          </div>

          {jobData.analysis.preferred_skills?.length > 0 && (
            <>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Preferred / Bonus Skills ({jobData.analysis.preferred_skills.length}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {jobData.analysis.preferred_skills.map((skill) => (
                  <span key={skill} className="badge badge-preferred">
                    + {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
