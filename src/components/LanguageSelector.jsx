import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import './LanguageSelector.css';

export default function LanguageSelector({ expanded = false }) {
  const { language, setLanguage, languages, languageNames } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (expanded) {
    return (
      <div className="lang-expanded">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`lang-expanded-btn ${lang === language ? 'lang-expanded-btn-active' : ''}`}
            onClick={() => setLanguage(lang)}
          >
            {languageNames[lang]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="lang-selector" ref={ref}>
      <button className="lang-trigger" onClick={() => setOpen(!open)} aria-label="Change language">
        <Globe size={16} />
        <span className="lang-code">{language.toUpperCase()}</span>
      </button>
      {open && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`lang-option ${lang === language ? 'lang-option-active' : ''}`}
              onClick={() => { setLanguage(lang); setOpen(false); }}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
