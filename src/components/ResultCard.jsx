import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCountUp } from '../hooks/useCountUp';

const gradeColors = {
  0: { color: 'var(--grade-0)', bg: 'var(--grade-0-bg)', border: 'var(--grade-0-border)', glow: 'var(--grade-0-glow)' },
  1: { color: 'var(--grade-1)', bg: 'var(--grade-1-bg)', border: 'var(--grade-1-border)', glow: 'var(--grade-1-glow)' },
  2: { color: 'var(--grade-2)', bg: 'var(--grade-2-bg)', border: 'var(--grade-2-border)', glow: 'var(--grade-2-glow)' },
  3: { color: 'var(--grade-3)', bg: 'var(--grade-3-bg)', border: 'var(--grade-3-border)', glow: 'var(--grade-3-glow)' },
  4: { color: 'var(--grade-4)', bg: 'var(--grade-4-bg)', border: 'var(--grade-4-border)', glow: 'var(--grade-4-glow)' },
};

export default function ResultCard({ grade, confidence, isMock }) {
  const { t } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const gc = gradeColors[grade] || gradeColors[0];
  const confValue = useCountUp(Math.round(confidence * 100), { active: revealed, duration: 1500 });

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="rc-root" style={{ '--gc': gc.color, '--gc-bg': gc.bg, '--gc-border': gc.border, '--gc-glow': gc.glow }}>
      {/* Ambient glow */}
      <div className="rc-ambient" />

      <div className="rc-content">
        {/* Grade circle */}
        <div className={`rc-grade-visual ${revealed ? 'rc-revealed' : ''}`}>
          <svg viewBox="0 0 120 120" className="rc-ring">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={gc.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={revealed ? circumference * (1 - confidence) : circumference}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s' }}
            />
          </svg>
          <div className="rc-grade-inner">
            <span className="rc-grade-num">{grade}</span>
          </div>
        </div>

        <div className="rc-info">
          <span className="text-overline" style={{ color: gc.color }}>{t('result.grade_label')}</span>
          <h2 className="rc-label">{t(`result.grade_${grade}_label`)}</h2>
          <div className="rc-confidence">
            <span className="rc-confidence-label">{t('result.confidence_label')}</span>
            <div className="rc-confidence-bar-track">
              <div
                className="rc-confidence-bar-fill"
                style={{ width: revealed ? `${confidence * 100}%` : '0%' }}
              />
            </div>
            <span className="rc-confidence-value">{confValue}%</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rc-disclaimer">
        <Shield size={13} />
        <span>{isMock ? t('errors.demo_mode') : t('result.disclaimer')}</span>
      </div>

      <style>{`
        .rc-root {
          position: relative;
          background: var(--glass-bg-heavy);
          border: 1px solid var(--gc-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          backdrop-filter: blur(var(--glass-blur));
          overflow: hidden;
        }
        .rc-ambient {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, var(--gc-glow), transparent 70%);
          pointer-events: none;
          opacity: 0.6;
        }
        .rc-content {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          position: relative;
          z-index: 1;
        }
        .rc-grade-visual {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          position: relative;
          opacity: 0;
          transform: scale(0.6);
          filter: blur(8px);
          transition: all 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .rc-revealed {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }
        .rc-ring { width: 100%; height: 100%; }
        .rc-grade-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rc-grade-num {
          font-size: var(--text-4xl);
          font-weight: var(--weight-bold);
          color: var(--gc);
          line-height: 1;
        }
        .rc-info { flex: 1; }
        .rc-label {
          font-size: var(--text-2xl);
          font-weight: var(--weight-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          margin-top: var(--space-1);
        }
        .rc-confidence {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .rc-confidence-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          white-space: nowrap;
        }
        .rc-confidence-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(0,0,0,0.06);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .rc-confidence-bar-fill {
          height: 100%;
          background: var(--gc);
          border-radius: var(--radius-full);
          transition: width 1.5s cubic-bezier(0.16,1,0.3,1) 0.8s;
          box-shadow: 0 0 12px var(--gc-glow);
        }
        .rc-confidence-value {
          font-size: var(--text-md);
          font-weight: var(--weight-bold);
          color: var(--gc);
          min-width: 40px;
          text-align: right;
        }
        .rc-disclaimer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-6);
          font-size: var(--text-xs);
          color: var(--text-dim);
          position: relative;
          z-index: 1;
        }
        @media (max-width: 639px) {
          .rc-content { flex-direction: column; text-align: center; }
          .rc-confidence { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
