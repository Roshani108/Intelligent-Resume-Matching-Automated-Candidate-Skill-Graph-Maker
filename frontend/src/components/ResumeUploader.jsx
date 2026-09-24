import React, { useRef } from 'react';
import { UploadCloud, FileText, X, Check, FileCheck } from 'lucide-react';

export default function ResumeUploader({ files, setFiles }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    // Deduplicate by name
    const existingNames = new Set(files.map(f => f.name));
    const newFiles = selected.filter(f => !existingNames.has(f.name));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '8px', color: '#06b6d4' }}>
          <UploadCloud size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>2. Upload Candidate Resumes</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Upload 1 or more PDF resumes to match and rank</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {/* Drop Zone Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-card)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-card)'; }}
      >
        <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%', marginBottom: '10px', color: '#818cf8' }}>
          <FileText size={28} />
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
          Click to choose PDF resumes
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
          Supports multiple PDF files simultaneously
        </p>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Selected Files ({files.length})</span>
            <button
              type="button"
              onClick={() => setFiles([])}
              style={{ background: 'none', border: 'none', color: '#fb7185', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Clear all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
            {files.map((file, idx) => (
              <div
                key={file.name + idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <FileCheck size={16} color="#34d399" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                    {file.name}
                  </span>
                  <span style={{ color: 'var(--text-sub)', fontSize: '0.75rem' }}>
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
