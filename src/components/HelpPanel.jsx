import React, { useState } from 'react';
import { X, ChevronDown, RotateCcw, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { resetOnboarding } from './GuidedTour';

export default function HelpPanel() {
  const { t } = useLanguage();
  const { state, setShowHelp, setShowOnboarding } = useAppState();

  if (!state.showHelp) return null;

  const items = [
    { q: t('help.how_upload'), a: t('help.how_upload_content') },
    { q: t('help.how_results'), a: t('help.how_results_content') },
    { q: t('help.how_gradcam'), a: t('help.how_gradcam_content') },
    { q: t('help.how_3d'), a: t('help.how_3d_content') },
    { q: t('help.change_language'), a: t('help.change_language_content') },
  ];

  return (
    <>
      <div className="modal-overlay" onClick={() => setShowHelp(false)}>
        <div className="help-panel" onClick={(e) => e.stopPropagation()}>
          <div className="help-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <HelpCircle size={20} />
              <h2 className="text-h4">{t('help.title')}</h2>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowHelp(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="help-panel-content">
            {items.map((item, i) => (
              <HelpItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>

          <div className="help-panel-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowHelp(false);
                resetOnboarding();
                setShowOnboarding(true);
              }}
              style={{ width: '100%' }}
            >
              <RotateCcw size={16} />
              {t('help.restart_tour')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .help-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(400px, 90vw);
          background-color: var(--surface-primary);
          display: flex;
          flex-direction: column;
          z-index: var(--z-modal);
          animation: slideInFromRight var(--transition-base) ease-out;
        }
        .help-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border-light);
        }
        .help-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4) var(--space-6);
        }
        .help-panel-footer {
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--border-light);
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

function HelpItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid var(--border-light)' }}>
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <ChevronDown
          size={16}
          className={`accordion-icon ${open ? 'accordion-icon-open' : ''}`}
        />
      </button>
      {open && (
        <div style={{
          padding: '0 var(--space-5) var(--space-4)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          animation: 'fadeIn var(--transition-fast)',
        }}>
          {answer}
        </div>
      )}
    </div>
  );
}
