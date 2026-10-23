import React from 'react';
import './styles/design-tokens.css';
import './styles/global.css';
import './styles/components.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppStateProvider } from './context/AppStateContext';
import { Router } from './router';
import Header from './components/Header';
import Footer from './components/Footer';
import GuidedTour from './components/GuidedTour';
import HelpPanel from './components/HelpPanel';

// Pages
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import ResultPage from './pages/ResultPage';
import EyeExplorerPage from './pages/EyeExplorerPage';
import BodyExplorerPage from './pages/BodyExplorerPage';
import LearnPage from './pages/LearnPage';
import AboutPage from './pages/AboutPage';
import SpecialistPage from './pages/SpecialistPage';

const routes = [
  { path: '#/', component: HomePage },
  { path: '#/analyze', component: AnalyzePage },
  { path: '#/result', component: ResultPage },
  { path: '#/eye-explorer', component: EyeExplorerPage },
  { path: '#/body-explorer', component: BodyExplorerPage },
  { path: '#/learn', component: LearnPage },
  { path: '#/about', component: AboutPage },
  { path: '#/specialist', component: SpecialistPage },
];

export default function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <div className="app-container">
          <Header />
          <main className="page-content">
            <Router routes={routes} />
          </main>
          <Footer />
          <GuidedTour />
          <HelpPanel />
        </div>
      </AppStateProvider>
    </LanguageProvider>
  );
}
