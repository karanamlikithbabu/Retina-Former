import React, { createContext, useContext, useState, useCallback } from 'react';
import en from './translations/en.json';
import hi from './translations/hi.json';
import te from './translations/te.json';

const translations = { en, hi, te };

const LANGUAGE_KEY = 'retinaformer_language';

const languageNames = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు'
};

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch (e) {
    // localStorage unavailable
  }
  return 'en';
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem(LANGUAGE_KEY, lang);
      } catch (e) {
        // localStorage unavailable
      }
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback((key) => {
    const value = getNestedValue(translations[language], key);
    if (value !== undefined) return value;
    // Fallback to English
    const fallback = getNestedValue(translations.en, key);
    if (fallback !== undefined) return fallback;
    // Return key as last resort
    return key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    languages: Object.keys(translations),
    languageNames
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
