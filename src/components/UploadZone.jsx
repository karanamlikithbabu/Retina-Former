import React, { useRef, useState, useCallback } from 'react';
import { Upload, Camera, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadZone({ onImageSelect }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return t('analyze.validation_format');
    if (file.size > MAX_SIZE) return t('analyze.validation_size');
    return null;
  }, [t]);

  const processFile = useCallback((file) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageSelect({ file, dataUrl: e.target.result, width: img.width, height: img.height });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [validateFile, onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  return (
    <div
      className={`upload-zone ${dragActive ? 'upload-zone-active' : ''} ${error ? 'upload-zone-error' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      role="button"
      tabIndex={0}
      aria-label={t('analyze.upload_title')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {/* Scan line animation */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit',
        pointerEvents: 'none', opacity: dragActive ? 0.6 : 0,
        transition: 'opacity 300ms ease'
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'var(--gradient-brand)',
          boxShadow: '0 0 20px var(--accent-primary-glow)',
          animation: 'scanLine 2s ease-in-out infinite',
        }} />
      </div>

      <div className="upload-icon-wrapper">
        <Upload size={28} strokeWidth={1.5} />
      </div>
      <div>
        <div className="upload-text-title">{t('analyze.upload_desc')}</div>
        <div className="upload-text-desc">{t('analyze.upload_formats')}</div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          <Upload size={14} /> {t('analyze.upload_browse')}
        </button>
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          color: 'var(--color-error)', fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-2)',
        }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
}
