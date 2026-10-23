import React from 'react';
import {
  ArrowRight, Eye, ScanLine, BookOpen, Brain,
  Languages, Shield, Sparkles, FileImage, Layers,
  Stethoscope, ClipboardList, Syringe, Plus, Activity
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link, navigate } from '../router';
import useScrollReveal from '../hooks/useScrollReveal';
import './HomePage.css';

export default function HomePage() {
  const { t } = useLanguage();
  const reveal = useScrollReveal();

  const steps = [
    { icon: FileImage, label: t('home.step_upload'), desc: t('home.step_upload_desc'), num: '01' },
    { icon: ScanLine, label: t('home.step_analyze'), desc: t('home.step_analyze_desc'), num: '02' },
    { icon: Eye, label: t('home.step_understand'), desc: t('home.step_understand_desc'), num: '03' },
    { icon: BookOpen, label: t('home.step_learn'), desc: t('home.step_learn_desc'), num: '04' },
  ];

  const features = [
    { icon: Brain, title: t('home.feature_screening'), desc: t('home.feature_screening_desc') },
    { icon: Layers, title: t('home.feature_explanation'), desc: t('home.feature_explanation_desc') },
    { icon: Sparkles, title: t('home.feature_results'), desc: t('home.feature_results_desc') },
    { icon: Languages, title: t('home.feature_multilingual'), desc: t('home.feature_multilingual_desc') },
  ];

  return (
    <div className="home-page">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
        </div>
        
        <div className="container hero-content">
          <div className="hero-text">
            <div className="badge badge-neutral reveal reveal-delay-1" ref={reveal} style={{ marginBottom: 'var(--space-6)' }}>
              <Shield size={14} className="text-accent-primary" style={{ color: 'var(--accent-primary)' }} />
              <span>{t('result.screening_note')}</span>
            </div>
            
            <h1 className="text-display hero-title reveal reveal-delay-2" ref={reveal}>
              <span className="text-gradient">RetinaFormer</span><br />
              {t('home.tagline').replace('RetinaFormer', '')}
            </h1>
            
            <p className="text-body hero-subtitle reveal reveal-delay-3" ref={reveal} style={{ fontSize: 'var(--text-lg)' }}>
              {t('home.subtitle')}
            </p>
            
            <div className="hero-actions reveal reveal-delay-4" ref={reveal}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
                {t('home.cta_primary')}
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                {t('home.cta_secondary')}
              </button>
            </div>
          </div>
          
          <div className="hero-visual hero-visual-illustration" ref={reveal}>
            {/* Background Medical Symbols */}
            <div className="hero-bg-symbols">
              <Stethoscope className="hero-symbol hs-1" size={32} />
              <ClipboardList className="hero-symbol hs-2" size={32} />
              <Syringe className="hero-symbol hs-3" size={32} />
              <Plus className="hero-symbol hs-4" size={24} />
              <Activity className="hero-symbol hs-5" size={32} />
              <Plus className="hero-symbol hs-6" size={20} />
            </div>
            
            {/* Illustration Placeholder */}
            <div className="hero-illustration-container">
              <img 
                src="/assets/doctor-consultation.png" 
                alt="Doctor consultation illustration" 
                className="hero-illustration"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hero-illustration-fallback">
                <p className="text-sm text-muted" style={{ textAlign: 'center' }}>
                  Place your image at<br/>
                  <code style={{ background: 'var(--surface-bg)', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>public/assets/doctor-consultation.png</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works (Vertical Timeline) ──────────── */}
      <section id="how-it-works" className="page-section" style={{ background: 'var(--surface-elevated)' }}>
        <div className="container container-narrow">
          <div className="section-header" ref={reveal}>
            <span className="text-overline">{t('home.how_it_works')}</span>
            <h2 className="text-h2" style={{ marginTop: 'var(--space-2)' }}>{t('home.how_it_works')}</h2>
          </div>
          
          <div className="timeline">
            {steps.map((step, i) => (
              <div key={i} className="timeline-item reveal" ref={reveal} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="timeline-node">
                  <step.icon size={20} />
                </div>
                <div className="timeline-content card card-hover">
                  <div className="timeline-num">{step.num}</div>
                  <h3 className="text-h4" style={{ marginBottom: 'var(--space-2)' }}>{step.label}</h3>
                  <p className="text-body">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (Bento Grid) ─────────────────────── */}
      <section className="page-section">
        <div className="container">
          <div className="section-header" ref={reveal}>
            <span className="text-overline">{t('home.why_title')}</span>
            <h2 className="text-h2" style={{ marginTop: 'var(--space-2)' }}>{t('home.product_desc')}</h2>
          </div>
          
          <div className="bento-grid">
            {features.map((f, i) => (
              <div 
                key={i} 
                className={`bento-card card card-hover reveal bento-card-${i}`}
                ref={reveal}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="bento-icon">
                  <f.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-h4" style={{ marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                <p className="text-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learn CTA ─────────────────────────────────── */}
      <section className="page-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner reveal" ref={reveal}>
            <div className="cta-bg-glow" />
            <div className="cta-content">
              <h2 className="text-h2" style={{ marginBottom: 'var(--space-4)' }}>
                {t('home.learn_cta_title')}
              </h2>
              <p className="text-body" style={{ color: 'var(--text-primary)', opacity: 0.9, marginBottom: 'var(--space-6)', maxWidth: '500px' }}>
                {t('home.learn_cta_desc')}
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/learn')} style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}>
                {t('home.learn_cta_button')}
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="cta-visual animate-float">
              <BookOpen size={120} strokeWidth={0.5} opacity={0.2} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
