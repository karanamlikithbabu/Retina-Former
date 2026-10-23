import React from 'react';
import { CheckCircle, FileImage, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ImagePreview({ image, onChangeImage, onAnalyze, loading }) {
  const { t } = useLanguage();

  if (!image) return null;

  return (
    <div className="image-preview animate-fade-in-up">
      <div className="card card-elevated" style={{ overflow: 'hidden' }}>
        <div className="image-preview-header">
          <div className="alert alert-success" style={{ margin: 0 }}>
            <CheckCircle size={18} className="alert-icon" />
            <span>{t('analyze.review_success')}</span>
          </div>
        </div>

        <div className="image-preview-image-container">
          <img
            src={image.dataUrl}
            alt="Uploaded retinal image"
            className="image-preview-img"
          />
        </div>

        <div className="image-preview-info">
          <div className="image-preview-meta">
            <div className="image-preview-meta-item">
              <span className="text-caption">{t('analyze.review_filename')}</span>
              <span className="image-preview-meta-value">{image.name}</span>
            </div>
            <div className="image-preview-meta-item">
              <span className="text-caption">{t('analyze.review_type')}</span>
              <span className="image-preview-meta-value">{image.type.split('/')[1].toUpperCase()}</span>
            </div>
            {image.width && image.height && (
              <div className="image-preview-meta-item">
                <span className="text-caption">{t('analyze.review_dimensions')}</span>
                <span className="image-preview-meta-value">{image.width} × {image.height}</span>
              </div>
            )}
          </div>
        </div>

        <div className="image-preview-actions">
          <button className="btn btn-secondary" onClick={onChangeImage} disabled={loading}>
            <RefreshCw size={16} />
            {t('analyze.review_change')}
          </button>
          <button className="btn btn-primary btn-lg" onClick={onAnalyze} disabled={loading}>
            {loading ? (
              <><span className="spinner spinner-sm" /> {t('common.loading')}</>
            ) : (
              <>{t('analyze.review_analyze')}</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .image-preview-header {
          margin-bottom: var(--space-4);
        }
        .image-preview-image-container {
          background-color: var(--surface-inverse);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-4);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 400px;
        }
        .image-preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .image-preview-info {
          margin-bottom: var(--space-6);
        }
        .image-preview-meta {
          display: flex;
          gap: var(--space-6);
          flex-wrap: wrap;
        }
        .image-preview-meta-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .image-preview-meta-value {
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
        }
        .image-preview-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: flex-end;
        }
        @media (max-width: 639px) {
          .image-preview-actions {
            flex-direction: column;
          }
          .image-preview-actions .btn {
            width: 100%;
          }
          .image-preview-meta {
            gap: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
