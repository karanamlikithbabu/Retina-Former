import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { navigate } from '../router';

export default function ErrorState({ title, message, onRetry, showHome = true }) {
  const { t } = useLanguage();

  return (
    <div className="error-state animate-fade-in-up">
      <div className="error-state-icon">
        <AlertTriangle size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>
        {title || t('errors.generic_title')}
      </h2>
      <p className="text-body" style={{ marginBottom: 'var(--space-6)', maxWidth: 400, textAlign: 'center' }}>
        {message || t('errors.generic_message')}
      </p>
      <div className="error-state-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={16} />
            {t('errors.try_again')}
          </button>
        )}
        {showHome && (
          <button className="btn btn-secondary" onClick={() => navigate('/') }>
            <Home size={16} />
            {t('errors.return_home')}
          </button>
        )}
      </div>

      <style>{`
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-16) var(--space-4);
        }
        .error-state-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background-color: var(--color-warning-bg);
          color: var(--color-warning);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-6);
        }
        .error-state-actions {
          display: flex;
          gap: var(--space-3);
        }
      `}</style>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action, actionLabel }) {
  return (
    <div className="error-state animate-fade-in-up">
      {Icon && (
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--surface-tertiary)', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <Icon size={36} strokeWidth={1.5} />
        </div>
      )}
      {title && <h3 className="text-h4" style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>}
      {message && <p className="text-body" style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>{message}</p>}
      {action && actionLabel && (
        <button className="btn btn-primary" onClick={action}>{actionLabel}</button>
      )}
      <style>{`
        .error-state { display:flex; flex-direction:column; align-items:center; padding:var(--space-16) var(--space-4); }
      `}</style>
    </div>
  );
}
