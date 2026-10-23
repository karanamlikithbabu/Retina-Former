import React from 'react';
import { Eye, Shield, Brain, ArrowRight, Zap, Target, BarChart, Server } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import { navigate } from '../router';

export default function AboutPage() {
  const { t } = useLanguage();
  const reveal = useScrollReveal();

  const pipelineSteps = [
    { icon: Eye, title: t('about.step1_title'), desc: t('about.step1_desc') },
    { icon: Server, title: t('about.step2_title'), desc: t('about.step2_desc') },
    { icon: Brain, title: t('about.step3_title'), desc: t('about.step3_desc') },
    { icon: Target, title: t('about.step4_title'), desc: t('about.step4_desc') },
    { icon: Zap, title: t('about.step5_title'), desc: t('about.step5_desc') }
  ];

  return (
    <div className="page-content">
      {/* Hero */}
      <section className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-primary-glow), transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
        
        <div className="container container-narrow" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header reveal" ref={reveal}>
            <span className="text-overline">{t('nav.about')}</span>
            <h1 className="text-h1 mt-2 mb-4">{t('about.hero_title_1')}<br /><span className="text-gradient">{t('about.hero_title_2')}</span></h1>
            <p className="text-body text-lg max-w-600 mx-auto">
              {t('about.hero_desc')}
            </p>
          </div>
        </div>

        <div className="container container-wide" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-12)' }}>
          <div className="reveal" ref={reveal}>
            <div style={{ 
              background: '#ffffff', 
              padding: 'var(--space-4)', 
              borderRadius: 'var(--radius-xl)', 
              boxShadow: 'var(--shadow-glow-md)', 
              border: '1px solid var(--border-light)' 
            }}>
              <img 
                src="/assets/methodology.png" 
                alt={t('about.methodology_alt')} 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: 'var(--radius-md)',
                  display: 'block',
                  imageRendering: 'high-quality'
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="page-section" style={{ background: 'var(--surface-elevated)' }}>
        <div className="container">
          <div className="text-center mb-12 reveal" ref={reveal}>
            <h2 className="text-h2 mb-4">{t('about.how_it_works')}</h2>
            <p className="text-body max-w-600 mx-auto">{t('about.how_it_works_desc')}</p>
          </div>

          <div className="pipeline-grid">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="card card-hover pipeline-card reveal" ref={reveal}>
                <div className="pipeline-num">0{i + 1}</div>
                <div className="pipeline-icon">
                  <step.icon size={24} />
                </div>
                <h3 className="text-h4 mb-2">{step.title}</h3>
                <p className="text-body text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Spec */}
      <section className="page-section">
        <div className="container container-narrow reveal" ref={reveal}>
          <div className="card card-elevated" style={{ padding: 'var(--space-10)' }}>
            <h2 className="text-h2 mb-6">{t('about.tech_arch')}</h2>
            
            <div className="tech-stats mb-8">
              <div className="tech-stat">
                <div className="ts-val">ViT</div>
                <div className="ts-lbl">{t('about.tech_arch_val1')}</div>
              </div>
              <div className="tech-stat">
                <div className="ts-val text-accent-primary">92%</div>
                <div className="ts-lbl">{t('about.tech_arch_val2')}</div>
              </div>
              <div className="tech-stat">
                <div className="ts-val">Grad-CAM</div>
                <div className="ts-lbl">{t('about.tech_arch_val3')}</div>
              </div>
            </div>

            <p className="text-body mb-6">
              {t('about.tech_arch_desc')}
            </p>

            <h3 className="text-h4 mb-4 mt-6">{t('about.data_privacy')}</h3>
            <p className="text-body mb-8">
              {t('about.data_privacy_desc')}
            </p>

            <div className="disclaimer mt-8">
              <Shield size={16} className="disclaimer-icon" />
              <span>{t('about.disclaimer')}</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .pipeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-6);
        }
        .pipeline-card {
          position: relative;
          padding: var(--space-8) var(--space-6) var(--space-6);
          overflow: hidden;
        }
        .pipeline-num {
          position: absolute;
          top: var(--space-2);
          right: var(--space-4);
          font-size: 64px;
          font-weight: var(--weight-bold);
          color: rgba(0,0,0,0.03);
          pointer-events: none;
        }
        .pipeline-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--accent-primary-subtle);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
        }
        
        .tech-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          padding: var(--space-6);
          background: var(--surface-bg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
        }
        .tech-stat {
          text-align: center;
        }
        .ts-val {
          font-size: var(--text-3xl);
          font-weight: var(--weight-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }
        .ts-lbl {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }

        .mb-2 { margin-bottom: var(--space-2); }
        .mb-4 { margin-bottom: var(--space-4); }
        .mb-6 { margin-bottom: var(--space-6); }
        .mb-8 { margin-bottom: var(--space-8); }
        .mb-12 { margin-bottom: var(--space-12); }
        .mt-2 { margin-top: var(--space-2); }
        .text-center { text-align: center; }
        .max-w-600 { max-width: 600px; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-lg { font-size: var(--text-lg); }
        .text-sm { font-size: var(--text-sm); }
        .text-accent-primary { color: var(--accent-primary); }

        @media (max-width: 639px) {
          .tech-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
