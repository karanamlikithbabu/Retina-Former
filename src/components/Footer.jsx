import React from 'react';
import { Eye } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from '../router';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-border" />
      <div className="container footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <Eye size={18} strokeWidth={2} />
            </div>
            <span className="footer-brand-name">RetinaFormer</span>
          </div>
          <p className="footer-desc">{t('footer.description')}</p>
        </div>
        <div className="footer-links">
          <Link to="/learn">{t('nav.learn')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/specialist">{t('result.find_specialist')}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
