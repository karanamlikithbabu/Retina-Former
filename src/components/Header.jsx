import React, { useState, useEffect } from 'react';
import { Eye, Menu, X, HelpCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppState } from '../context/AppStateContext';
import { Link, useRoute } from '../router';
import LanguageSelector from './LanguageSelector';
import './Header.css';

export default function Header() {
  const { t } = useLanguage();
  const { setShowHelp, setShowMobileNav, state } = useAppState();
  const currentRoute = useRoute();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 16); }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '#/', label: t('nav.home') },
    { path: '#/analyze', label: t('nav.analyze') },
    { path: '#/learn', label: t('nav.learn') },
    { path: '#/about', label: t('nav.about') },
  ];

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner container">
        <Link to="/" className="header-brand">
          <div className="header-logo">
            <Eye size={20} strokeWidth={2} />
          </div>
          <span className="header-title">RetinaFormer</span>
        </Link>

        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path.replace('#', '')}
              className={`header-nav-link ${currentRoute === link.path ? 'header-nav-link-active' : ''}`}
            >
              {link.label}
              {currentRoute === link.path && <span className="header-nav-indicator" />}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSelector />
          <button className="btn btn-ghost btn-icon header-help-btn" onClick={() => setShowHelp(true)} aria-label={t('nav.help')}>
            <HelpCircle size={18} />
          </button>
          <button className="btn btn-ghost btn-icon header-menu-btn" onClick={() => setShowMobileNav(true)} aria-label={t('nav.menu')}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {state.showMobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <Link to="/" className="header-brand" onClick={() => setShowMobileNav(false)}>
                <div className="header-logo"><Eye size={20} strokeWidth={2} /></div>
                <span className="header-title">RetinaFormer</span>
              </Link>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowMobileNav(false)} aria-label={t('nav.close')}>
                <X size={20} />
              </button>
            </div>
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path.replace('#', '')}
                  className={`mobile-nav-link ${currentRoute === link.path ? 'mobile-nav-link-active' : ''}`}
                  onClick={() => setShowMobileNav(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mobile-nav-footer">
              <LanguageSelector expanded />
              <button className="btn btn-secondary mobile-nav-help-btn" onClick={() => { setShowMobileNav(false); setShowHelp(true); }}>
                <HelpCircle size={16} /> {t('nav.help')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
