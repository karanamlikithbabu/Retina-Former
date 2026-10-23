import React from 'react';
import { BookOpen, Activity, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import useScrollReveal from '../hooks/useScrollReveal';
import { navigate } from '../router';

export default function LearnPage() {
  const { t } = useLanguage();
  const reveal = useScrollReveal();

  const stages = [
    { grade: 0, label: t('result.grade_0_label'), desc: 'No abnormalities found. Regular annual screening is recommended to monitor eye health.', color: 'var(--grade-0)', bg: 'var(--grade-0-bg)' },
    { grade: 1, label: t('result.grade_1_label'), desc: 'Microaneurysms only. Small balloon-like swelling in tiny blood vessels. Often asymptomatic.', color: 'var(--grade-1)', bg: 'var(--grade-1-bg)' },
    { grade: 2, label: t('result.grade_2_label'), desc: 'More than just microaneurysms but less than severe. May include some fluid leakage (exudates) or minor hemorrhages.', color: 'var(--grade-2)', bg: 'var(--grade-2-bg)' },
    { grade: 3, label: t('result.grade_3_label'), desc: 'Many hemorrhages, microaneurysms, and signs of poor blood supply. High risk of progression.', color: 'var(--grade-3)', bg: 'var(--grade-3-bg)' },
    { grade: 4, label: t('result.grade_4_label'), desc: 'Growth of new, fragile blood vessels (neovascularization) that can bleed easily, leading to severe vision loss.', color: 'var(--grade-4)', bg: 'var(--grade-4-bg)' },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <section className="page-section" style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container container-narrow reveal" ref={reveal}>
          <div className="text-center">
            <BookOpen size={48} className="text-accent-primary mx-auto mb-6" style={{ color: 'var(--accent-primary)' }} />
            <h1 className="text-h1 mb-4">{t('nav.learn')}</h1>
            <p className="text-body text-lg max-w-600 mx-auto">
              Understanding Diabetic Retinopathy: Stages, symptoms, and the importance of early detection.
            </p>
          </div>
        </div>
      </section>

      {/* Disease Stages */}
      <section className="page-section">
        <div className="container container-narrow">
          <div className="section-header reveal" ref={reveal}>
            <h2 className="text-h2 text-center mb-12">{t('learn.stages')}</h2>
          </div>

          <div className="stages-list">
            {stages.map((stage) => (
              <div key={stage.grade} className="card stage-card reveal" ref={reveal}>
                <div className="stage-grade" style={{ color: stage.color, background: stage.bg, borderColor: stage.color }}>
                  {stage.grade}
                </div>
                <div className="stage-content">
                  <h3 className="text-h4 mb-2">{stage.label}</h3>
                  <p className="text-body">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors & Prevention */}
      <section className="page-section" style={{ background: 'var(--surface-elevated)' }}>
        <div className="container">
          <div className="grid-2 reveal-container">
            <div className="card card-elevated reveal p-8" ref={reveal}>
              <div className="icon-wrapper mb-6">
                <AlertCircle size={24} className="text-warning" style={{ color: 'var(--color-warning)' }} />
              </div>
              <h3 className="text-h3 mb-4">Risk Factors</h3>
              <ul className="custom-list">
                <li>Duration of diabetes (the longer you have it, the higher the risk)</li>
                <li>Poor control of blood sugar levels</li>
                <li>High blood pressure (Hypertension)</li>
                <li>High cholesterol</li>
                <li>Pregnancy</li>
                <li>Tobacco use</li>
              </ul>
            </div>

            <div className="card card-elevated reveal p-8" ref={reveal}>
              <div className="icon-wrapper mb-6">
                <Activity size={24} className="text-success" style={{ color: 'var(--color-success)' }} />
              </div>
              <h3 className="text-h3 mb-4">Prevention & Care</h3>
              <ul className="custom-list custom-list-success">
                <li>Strict control of blood glucose levels</li>
                <li>Maintain healthy blood pressure and cholesterol</li>
                <li>Quit smoking</li>
                <li>Attend comprehensive dilated eye exams at least once a year</li>
                <li>Notice vision changes immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="page-section">
        <div className="container container-narrow reveal" ref={reveal}>
          <div className="card card-elevated p-8 mb-8" style={{ background: 'var(--glass-bg)', borderColor: 'var(--accent-primary-subtle)' }}>
             <h2 className="text-h3 mb-4 text-accent-primary">Common Symptoms</h2>
             <p className="text-body mb-6">In the early stages of Diabetic Retinopathy, you might not notice any symptoms. As the condition progresses, symptoms may include:</p>
             <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                <ul className="custom-list">
                  <li>Spots or dark strings floating in your vision (floaters)</li>
                  <li>Blurred or fluctuating vision</li>
                </ul>
                <ul className="custom-list">
                  <li>Impaired color vision</li>
                  <li>Dark or empty areas in your vision</li>
                  <li>Gradual or sudden vision loss</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Explorers CTA */}
      <section className="page-section">
        <div className="container container-narrow text-center reveal" ref={reveal}>
          <h2 className="text-h2 mb-6">Visualize the Impact</h2>
          <p className="text-body mb-8">
            Use our interactive 3D explorers to understand how Diabetic Retinopathy affects the eye anatomy and correlates with other systemic conditions in the body.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/eye-explorer')}>
              <Eye size={20} /> Eye Explorer
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/body-explorer')}>
              Body Explorer <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .stages-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .stage-card {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-6);
        }
        .stage-grade {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-2xl);
          font-weight: var(--weight-bold);
          border: 2px solid;
          flex-shrink: 0;
        }
        .stage-content { flex: 1; }
        
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
        }
        
        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .custom-list li {
          position: relative;
          padding-left: var(--space-6);
          margin-bottom: var(--space-3);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }
        .custom-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--color-warning);
          font-size: var(--text-xl);
          line-height: 1;
        }
        .custom-list-success li::before {
          color: var(--color-success);
          content: '✓';
          font-size: var(--text-md);
          top: 4px;
        }
        
        .mb-2 { margin-bottom: var(--space-2); }
        .mb-3 { margin-bottom: var(--space-3); }
        .mb-4 { margin-bottom: var(--space-4); }
        .mb-6 { margin-bottom: var(--space-6); }
        .mb-8 { margin-bottom: var(--space-8); }
        .mb-12 { margin-bottom: var(--space-12); }
        .p-8 { padding: var(--space-8); }
        .text-center { text-align: center; }
        .max-w-600 { max-width: 600px; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-lg { font-size: var(--text-lg); }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .stage-card { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
