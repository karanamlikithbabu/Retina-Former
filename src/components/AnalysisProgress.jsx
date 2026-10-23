import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AnalysisProgress({ currentStep, image }) {
  const { t } = useLanguage();
  const [showScanLine, setShowScanLine] = useState(true);

  const steps = [
    t('analyze.processing_step1'),
    t('analyze.processing_step2'),
    t('analyze.processing_step3'),
    t('analyze.processing_step4'),
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="ap-root animate-fade-in">
      {/* Full-width retina image with scanning overlay */}
      <div className="ap-visual">
        {image?.dataUrl && (
          <div className="ap-image-container">
            <img src={image.dataUrl} alt="Retinal scan" className="ap-image" />
            {/* Scan line */}
            <div className="ap-scan-overlay">
              <div className="ap-scan-line" />
            </div>
            {/* Processing particles */}
            <div className="ap-particles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="ap-particle" style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        {/* Progress ring overlaid */}
        <div className="ap-ring-container">
          <svg viewBox="0 0 100 100" className="ap-ring">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
            />
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06D6A0" />
                <stop offset="50%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ap-ring-text">
            <span className="ap-ring-num">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <h2 className="text-h3" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
        {t('analyze.processing_title')}
      </h2>
      <p className="text-caption" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        {t('analyze.processing_wait')}
      </p>

      {/* Neural network steps */}
      <div className="ap-steps">
        {steps.map((step, i) => (
          <div key={i} className={`ap-step ${i < currentStep ? 'ap-step-done' : ''} ${i === currentStep ? 'ap-step-active' : ''}`}>
            <div className="ap-step-node">
              {i < currentStep ? (
                <CheckCircle size={18} />
              ) : i === currentStep ? (
                <div className="ap-step-pulse" />
              ) : (
                <div className="ap-step-dot" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`ap-step-line ${i < currentStep ? 'ap-step-line-done' : ''}`} />
            )}
            <span className="ap-step-label">{step}</span>
          </div>
        ))}
      </div>

      <style>{`
        .ap-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-8) 0;
        }
        .ap-visual {
          position: relative;
          width: 240px;
          height: 240px;
          margin-bottom: var(--space-8);
        }
        .ap-image-container {
          position: absolute;
          inset: 20px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface-primary);
        }
        .ap-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }
        .ap-scan-overlay {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .ap-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent-primary), var(--accent-secondary), transparent);
          box-shadow: 0 0 24px var(--accent-primary-glow), 0 0 60px var(--accent-primary-glow);
          animation: scanLine 2.5s ease-in-out infinite;
        }
        .ap-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .ap-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--accent-primary);
          opacity: 0;
          animation: particleFade 3s ease-in-out infinite;
        }
        @keyframes particleFade {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .ap-ring-container {
          position: absolute;
          inset: 0;
        }
        .ap-ring {
          width: 100%;
          height: 100%;
        }
        .ap-ring-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .ap-ring-num {
          font-size: var(--text-xs);
          font-weight: var(--weight-bold);
          color: var(--accent-primary);
          background: var(--glass-bg-heavy);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          position: absolute;
          bottom: 0;
        }
        .ap-steps {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
          max-width: 600px;
          padding: 0 var(--space-4);
        }
        .ap-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          color: var(--text-dim);
          transition: color var(--transition-base);
        }
        .ap-step-done { color: var(--color-success); }
        .ap-step-active { color: var(--accent-primary); }
        .ap-step-node {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-elevated);
          border: 2px solid var(--border-light);
          position: relative;
          z-index: 2;
          margin-bottom: var(--space-2);
          transition: all var(--transition-base);
        }
        .ap-step-done .ap-step-node {
          border-color: var(--color-success);
          background: var(--color-success-bg);
        }
        .ap-step-active .ap-step-node {
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-glow-sm);
          background: var(--accent-primary-subtle);
        }
        .ap-step-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-primary);
          animation: glowPulse 1.5s ease-in-out infinite;
        }
        .ap-step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--border-default);
        }
        .ap-step-line {
          position: absolute;
          top: 16px;
          left: calc(50% + 18px);
          right: calc(-50% + 18px);
          height: 2px;
          background: var(--border-light);
          z-index: 1;
        }
        .ap-step-line-done {
          background: var(--color-success);
        }
        .ap-step-label {
          font-size: var(--text-xs);
          text-align: center;
          max-width: 80px;
          line-height: var(--leading-snug);
        }
        @media (max-width: 639px) {
          .ap-visual { width: 180px; height: 180px; }
          .ap-steps { flex-direction: column; align-items: stretch; max-width: 280px; }
          .ap-step { flex-direction: row; gap: var(--space-3); }
          .ap-step-line { display: none; }
          .ap-step-label { max-width: none; text-align: left; }
        }
      `}</style>
    </div>
  );
}
