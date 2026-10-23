import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function GradCAMViewer({ originalImage, heatmapImage, overlayImage }) {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState('overlay'); // 'heatmap' or 'overlay'
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const comparisonImage = mode === 'overlay' ? overlayImage : heatmapImage;
  const hasComparison = !!comparisonImage;

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    handleMove(e.clientX);
  }, [handleMove]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => handleMove(e.clientX || e.touches?.[0]?.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, handleMove]);

  if (!originalImage) return null;

  return (
    <div className="gcv-root">
      <div className="gcv-header">
        <h3 className="text-h4">{t('result.why_title')}</h3>
        <p className="text-caption">{t('result.why_desc')}</p>
      </div>

      {/* Mode toggle */}
      {(heatmapImage || overlayImage) && (
        <div className="gcv-toggle">
          {heatmapImage && (
            <button
              className={`gcv-toggle-btn ${mode === 'heatmap' ? 'gcv-toggle-active' : ''}`}
              onClick={() => setMode('heatmap')}
            >
              {t('result.tab_heatmap')}
            </button>
          )}
          {overlayImage && (
            <button
              className={`gcv-toggle-btn ${mode === 'overlay' ? 'gcv-toggle-active' : ''}`}
              onClick={() => setMode('overlay')}
            >
              {t('result.tab_overlay')}
            </button>
          )}
        </div>
      )}

      {/* Interactive slider */}
      <div
        ref={containerRef}
        className="gcv-slider"
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => { setDragging(true); handleMove(e.touches[0].clientX); }}
        role="slider"
        aria-label="Image comparison"
        aria-valuenow={Math.round(sliderPos)}
      >
        {/* Base (comparison) image — full width */}
        {hasComparison ? (
          <img src={comparisonImage} alt="AI analysis" className="gcv-img" />
        ) : (
          <img src={originalImage} alt={t('result.tab_original')} className="gcv-img" />
        )}

        {/* Original image — clipped by slider position */}
        {hasComparison && (
          <div className="gcv-clip" style={{ width: `${sliderPos}%` }}>
            <img
              src={originalImage}
              alt={t('result.tab_original')}
              className="gcv-img"
              style={{ width: `${containerRef.current?.offsetWidth || 600}px`, maxWidth: 'none' }}
            />
          </div>
        )}

        {/* Slider handle */}
        {hasComparison && (
          <div className="gcv-handle" style={{ left: `${sliderPos}%` }}>
            <div className="gcv-handle-line" />
            <div className="gcv-handle-knob">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8L1 5M4 8L1 11M4 8H0M12 8L15 5M12 8L15 11M12 8H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        {/* Labels */}
        <div className="gcv-label gcv-label-left">{t('result.tab_original')}</div>
        {hasComparison && (
          <div className="gcv-label gcv-label-right">
            {mode === 'overlay' ? t('result.tab_overlay') : t('result.tab_heatmap')}
          </div>
        )}
      </div>

      {!hasComparison && (
        <div className="disclaimer" style={{ marginTop: 'var(--space-4)' }}>
          <span>{t('result.explanation_unavailable')}</span>
        </div>
      )}

      <style>{`
        .gcv-root {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          backdrop-filter: blur(var(--glass-blur));
        }
        .gcv-header { margin-bottom: var(--space-4); }
        .gcv-header h3 { margin-bottom: var(--space-1); }
        .gcv-toggle {
          display: flex;
          gap: var(--space-1);
          background: rgba(0,0,0,0.04);
          padding: var(--space-1);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          width: fit-content;
          border: 1px solid var(--border-subtle);
        }
        .gcv-toggle-btn {
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .gcv-toggle-btn:hover { color: var(--text-secondary); }
        .gcv-toggle-active {
          background: var(--glass-bg-heavy);
          color: var(--text-primary);
          box-shadow: var(--shadow-xs);
        }
        .gcv-slider {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          cursor: ew-resize;
          user-select: none;
          -webkit-user-select: none;
          background: var(--surface-primary);
          aspect-ratio: 1;
          touch-action: none;
        }
        .gcv-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        .gcv-clip {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 2;
        }
        .gcv-handle {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 5;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }
        .gcv-handle-line {
          flex: 1;
          width: 2px;
          background: white;
          box-shadow: 0 0 8px rgba(0,0,0,0.4);
        }
        .gcv-handle-knob {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.4);
          pointer-events: auto;
          cursor: ew-resize;
        }
        .gcv-label {
          position: absolute;
          bottom: var(--space-3);
          padding: var(--space-1) var(--space-3);
          font-size: var(--text-xs);
          font-weight: var(--weight-semibold);
          color: white;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          border-radius: var(--radius-sm);
          z-index: 6;
          pointer-events: none;
        }
        .gcv-label-left { left: var(--space-3); }
        .gcv-label-right { right: var(--space-3); }
      `}</style>
    </div>
  );
}
