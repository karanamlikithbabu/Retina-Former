import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';

const ONBOARDING_KEY = 'retinaformer_onboarding_done';

export default function GuidedTour() {
  const { t } = useLanguage();
  const { state, setShowOnboarding } = useAppState();
  const [step, setStep] = useState(-1); // -1 = welcome screen
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done && !state.showOnboarding) {
        setShowOnboarding(true);
      }
    } catch (e) {}
  }, [state.showOnboarding, setShowOnboarding]);

  const steps = useMemo(() => [
    { text: t('onboarding.step_home'), target: 'a[href="#/"]' },
    { text: t('onboarding.step_analyze'), target: 'a[href="#/analyze"]' },
    { text: t('onboarding.step_learn'), target: 'a[href="#/learn"]' },
    { text: t('onboarding.step_language'), target: '.header-actions .language-selector' },
  ], [t]);

  const updateRect = useCallback(() => {
    if (step >= 0 && step < steps.length) {
      const selector = steps[step].target;
      if (selector) {
        // Find visible element (not hidden by mobile display:none)
        const el = Array.from(document.querySelectorAll(selector)).find(e => e.offsetParent !== null);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
          return;
        }
      }
    }
    setTargetRect(null);
  }, [step, steps]);

  useLayoutEffect(() => {
    if (state.showOnboarding) {
      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect, { passive: true });
      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
      };
    }
  }, [state.showOnboarding, updateRect, step]);

  const handleSkip = useCallback(() => {
    setShowOnboarding(false);
    setStep(-1);
    try { localStorage.setItem(ONBOARDING_KEY, 'true'); } catch (e) {}
  }, [setShowOnboarding]);

  const handleFinish = useCallback(() => {
    setShowOnboarding(false);
    setStep(-1);
    try { localStorage.setItem(ONBOARDING_KEY, 'true'); } catch (e) {}
  }, [setShowOnboarding]);

  if (!state.showOnboarding) return null;

  const isWelcome = step === -1;
  const isReady = step === steps.length;

  let modalStyle = { maxWidth: 440, textAlign: 'center', margin: '0 auto', position: 'relative' };
  
  if (targetRect && !isWelcome && !isReady) {
    const isMobile = window.innerWidth < 640;
    modalStyle = {
      position: 'absolute',
      top: targetRect.top + targetRect.height + 16,
      left: isMobile ? 16 : Math.max(16, Math.min(targetRect.left + (targetRect.width / 2) - 160, window.innerWidth - 336)),
      width: isMobile ? 'calc(100vw - 32px)' : 320,
      textAlign: 'left',
      padding: 'var(--space-6)'
    };
  }

  return (
    <>
      <div 
        className="modal-overlay" 
        style={{ 
          zIndex: 'var(--z-tour)', 
          alignItems: targetRect ? 'flex-start' : 'center',
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          pointerEvents: targetRect ? 'none' : 'auto' // allow clicking through highlight hole
        }}
      >
        {/* Full screen dark overlay OR Spotlight hole */}
        {!targetRect ? (
          <div style={{ position: 'fixed', inset: 0, background: 'var(--surface-overlay)', backdropFilter: 'blur(8px)', zIndex: -1 }} />
        ) : (
          <div style={{
            position: 'fixed',
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.7)',
            transition: 'all 0.3s ease-out',
            pointerEvents: 'none',
            zIndex: -1
          }} />
        )}

        {/* Modal / Tooltip */}
        <div className="modal" style={{ ...modalStyle, zIndex: 1, pointerEvents: 'auto' }}>
          {isWelcome ? (
            <>
              <div className="modal-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h2 className="modal-title">{t('onboarding.welcome')}</h2>
              </div>
              <div className="modal-body">
                <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                  {t('onboarding.welcome_desc')}
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-ghost" onClick={handleSkip}>
                  {t('onboarding.skip')}
                </button>
                <button className="btn btn-primary" onClick={() => setStep(0)}>
                  {t('onboarding.start_guide')}
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : isReady ? (
            <>
              <div className="modal-header" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)'
                }}>
                  <Check size={28} />
                </div>
                <h2 className="modal-title">{t('onboarding.ready')}</h2>
              </div>
              <div className="modal-body">
                <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
                  {t('onboarding.ready_desc')}
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button className="btn btn-primary btn-lg" onClick={handleFinish}>
                  {t('onboarding.start_using')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="modal-header">
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  <span className="text-caption">
                    {step + 1} {t('onboarding.step_of')} {steps.length}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={handleSkip} style={{ minHeight: 'auto', padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>
                {/* Step progress dots */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: targetRect ? 'flex-start' : 'center', marginBottom: 'var(--space-4)' }}>
                  {steps.map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: i <= step ? 'var(--accent-primary)' : 'var(--border-light)',
                      transition: 'background-color var(--transition-base)',
                    }} />
                  ))}
                </div>
              </div>
              <div className="modal-body">
                <p className="text-body" style={{
                  fontSize: targetRect ? 'var(--text-base)' : 'var(--text-lg)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-6)',
                  lineHeight: '1.4'
                }}>
                  {steps[step].text}
                </p>
              </div>
              <div className="modal-footer" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0}
                >
                  <ChevronLeft size={16} />
                  {t('onboarding.back')}
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>
                  {step === steps.length - 1 ? t('onboarding.ready') : t('onboarding.next')}
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function resetOnboarding() {
  try { localStorage.removeItem(ONBOARDING_KEY); } catch (e) {}
}
