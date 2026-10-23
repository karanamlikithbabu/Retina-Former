import React, { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { navigate } from '../router';
import { analyzeImage } from '../services/api';
import UploadZone from '../components/UploadZone';
import AnalysisProgress from '../components/AnalysisProgress';
import useScrollReveal from '../hooks/useScrollReveal';
import './AnalyzePage.css';

export default function AnalyzePage() {
  const { t } = useLanguage();
  const { setUploadedImage, analysisSuccess } = useAppState();
  const reveal = useScrollReveal();
  
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  const handleImageSelect = (imgData) => {
    setImage(imgData);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    setStep(0);
    setError(null);
    
    try {
      // Simulate progress steps
      const stepInterval = setInterval(() => {
        setStep(s => Math.min(s + 1, 3));
      }, 800);
      
      const result = await analyzeImage(image.file);
      
      clearInterval(stepInterval);
      setStep(4); // Complete
      
      // Save to global state
      setUploadedImage(image);
      analysisSuccess(result);
      
      // Short delay for final animation before navigating
      setTimeout(() => {
        navigate('/result');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setError(t('errors.network'));
      setAnalyzing(false);
    }
  };

  return (
    <div className="analyze-page page-content container container-narrow">
      <div className="analyze-header reveal" ref={reveal}>
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> {t('nav.home')}
        </button>
        <h1 className="text-h2 analyze-title">{t('analyze.title')}</h1>
        <p className="text-body analyze-subtitle">{t('analyze.subtitle')}</p>
      </div>

      <div className="analyze-card card card-elevated reveal reveal-delay-1" ref={reveal}>
        {analyzing ? (
          <AnalysisProgress currentStep={step} image={image} />
        ) : !image ? (
          <UploadZone onImageSelect={handleImageSelect} />
        ) : (
          <div className="preview-container animate-fade-in">
            <div className="preview-image-wrapper">
              <img src={image.dataUrl} alt="Retinal scan preview" className="preview-image" />
              <div className="preview-overlay">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setImage(null)}
                >
                  {t('analyze.upload_new')}
                </button>
              </div>
            </div>
            
            <div className="preview-actions">
              {error && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                  <AlertCircle className="alert-icon" />
                  <span>{error}</span>
                </div>
              )}
              <button 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%' }}
                onClick={startAnalysis}
              >
                {t('analyze.start_analysis')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
