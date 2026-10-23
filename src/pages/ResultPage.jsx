import React, { useEffect } from 'react';
import {
  Eye, ArrowRight, Heart, MapPin, RefreshCw, AlertCircle, ChevronDown, Activity
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { navigate } from '../router';
import ResultCard from '../components/ResultCard';
import GradCAMViewer from '../components/GradCAMViewer';
import ErrorState from '../components/ErrorState';
import useScrollReveal from '../hooks/useScrollReveal';
import './ResultPage.css';

export default function ResultPage() {
  const { t } = useLanguage();
  const { state, resetAnalysis } = useAppState();
  const reveal = useScrollReveal();
  const { result, uploadedImage } = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!result) {
    return (
      <div className="page-content">
        <div className="container container-narrow page-section">
          <ErrorState
            title={t('result.title')}
            message={t('errors.generic_message')}
            onRetry={() => navigate('/analyze')}
            showHome
          />
        </div>
      </div>
    );
  }

  const grade = result.predicted_class;
  const originalSrc = uploadedImage?.dataUrl;
  const heatmapSrc = result.heatmap_base64 
    ? (result.heatmap_base64.startsWith('data:') ? result.heatmap_base64 : `data:image/png;base64,${result.heatmap_base64}`)
    : null;
  const overlaySrc = result.overlay_base64
    ? (result.overlay_base64.startsWith('data:') ? result.overlay_base64 : `data:image/png;base64,${result.overlay_base64}`)
    : null;

  return (
    <div className="result-page page-content">
      <div className="container container-narrow">
        
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="result-header reveal" ref={reveal}>
          <span className="text-overline">{t('result.title')}</span>
          <p className="text-body" style={{ marginTop: 'var(--space-2)' }}>Scroll to review your complete analysis report.</p>
        </div>

        {/* ── Section 1: Result Reveal ───────────────────────── */}
        <div className="result-section reveal reveal-scale" ref={reveal}>
          <ResultCard
            grade={grade}
            confidence={result.confidence}
            isMock={result.is_mock}
          />
        </div>

        {/* ── Section 2: What This Means ─────────────────────── */}
        <div className="result-section reveal reveal-delay-2" ref={reveal}>
          <div className="card card-elevated p-6">
            <h3 className="text-h4 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} className="text-accent-primary" />
              {t('result.meaning_title')}
            </h3>
            <p className="text-body text-lg">
              {t(`result.grade_${grade}_meaning`)}
            </p>
          </div>
        </div>

        {/* ── Section 3: Grad-CAM Explanation ────────────────── */}
        {originalSrc && (
          <div className="result-section reveal" ref={reveal}>
            <GradCAMViewer
              originalImage={originalSrc}
              heatmapImage={heatmapSrc}
              overlayImage={overlaySrc}
            />
          </div>
        )}

        {/* ── Section 5: Disease Progression Strip ────────────── */}
        <div className="result-section reveal" ref={reveal}>
          <div className="progression-strip">
            <h3 className="text-h4 mb-4 text-center">{t('learn.stages')}</h3>
            <div className="grade-timeline">
              {[0, 1, 2, 3, 4].map((g) => (
                <div key={g} className={`grade-node ${grade === g ? 'grade-node-active' : ''}`}>
                  <div className={`grade-badge badge-grade-${g}`}>{g}</div>
                  <span className="grade-label text-xs mt-2 text-center">{t(`result.grade_${g}_label`)}</span>
                  {g < 4 && <div className="grade-connector" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sections 4 & 6: Explorers ─────────────────────── */}
        <div className="result-section reveal" ref={reveal}>
          <div className="explorer-grid">
            <div className="card card-interactive card-hover explorer-card" onClick={() => navigate('/eye-explorer')}>
              <div className="explorer-icon eye-icon"><Eye size={32} /></div>
              <h3 className="text-h4">{t('result.eye_explorer_title')}</h3>
              <p className="text-caption">{t('result.eye_explorer_desc')}</p>
              <ArrowRight className="explorer-arrow" size={20} />
            </div>
            
            <div className="card card-interactive card-hover explorer-card" onClick={() => navigate('/body-explorer')}>
              <div className="explorer-icon body-icon"><Heart size={32} /></div>
              <h3 className="text-h4">{t('result.body_explorer_title')}</h3>
              <p className="text-caption">{t('result.body_explorer_desc')}</p>
              <ArrowRight className="explorer-arrow" size={20} />
            </div>
          </div>
        </div>

        {/* ── Section 7: Action Plan ────────────────────────── */}
        <div className="result-section reveal" ref={reveal}>
          <div className="card card-elevated action-card">
            <h3 className="text-h3 mb-4">{t('result.next_title')}</h3>
            <p className="text-body text-lg mb-8">
              {t(`result.grade_${grade}_next`)}
            </p>
            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/specialist')}>
                <MapPin size={20} />
                {t('result.find_specialist')}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/learn')}>
                <BookOpenIcon /> {t('result.learn_more')}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ────────────────────────────────── */}
        <div className="result-footer reveal" ref={reveal}>
          <button className="btn btn-ghost" onClick={() => { resetAnalysis(); navigate('/analyze'); }}>
            <RefreshCw size={16} />
            {t('result.new_analysis')}
          </button>
        </div>
      </div>
    </div>
  );
}

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);
