import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppStateContext = createContext(null);

const initialState = {
  // Upload state
  uploadedImage: null,        // { file, dataUrl, name, type, width, height }
  
  // Analysis state
  analysisStatus: 'idle',     // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  analysisStep: 0,            // 0-3 for processing stages
  analysisError: null,
  
  // Result state
  result: null,               // { predicted_class, confidence, grade_label, heatmap_base64, overlay_base64, message, next_step }
  
  // UI state
  showOnboarding: false,
  showHelp: false,
  showMobileNav: false,
  demoMode: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_UPLOADED_IMAGE':
      return {
        ...state,
        uploadedImage: action.payload,
        analysisStatus: 'idle',
        analysisError: null,
        result: null,
      };
    
    case 'CLEAR_UPLOADED_IMAGE':
      return {
        ...state,
        uploadedImage: null,
        analysisStatus: 'idle',
        analysisError: null,
        result: null,
      };
    
    case 'START_ANALYSIS':
      return {
        ...state,
        analysisStatus: 'processing',
        analysisStep: 0,
        analysisError: null,
      };
    
    case 'UPDATE_ANALYSIS_STEP':
      return {
        ...state,
        analysisStep: action.payload,
      };
    
    case 'ANALYSIS_SUCCESS':
      return {
        ...state,
        analysisStatus: 'success',
        analysisStep: 4,
        result: action.payload,
      };
    
    case 'ANALYSIS_ERROR':
      return {
        ...state,
        analysisStatus: 'error',
        analysisError: action.payload,
      };
    
    case 'RESET_ANALYSIS':
      return {
        ...state,
        uploadedImage: null,
        analysisStatus: 'idle',
        analysisStep: 0,
        analysisError: null,
        result: null,
      };
    
    case 'SET_SHOW_ONBOARDING':
      return { ...state, showOnboarding: action.payload };
    
    case 'SET_SHOW_HELP':
      return { ...state, showHelp: action.payload };
    
    case 'SET_SHOW_MOBILE_NAV':
      return { ...state, showMobileNav: action.payload };
    
    case 'SET_DEMO_MODE':
      return { ...state, demoMode: action.payload };
    
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUploadedImage: useCallback((image) => 
      dispatch({ type: 'SET_UPLOADED_IMAGE', payload: image }), []),
    clearUploadedImage: useCallback(() => 
      dispatch({ type: 'CLEAR_UPLOADED_IMAGE' }), []),
    startAnalysis: useCallback(() => 
      dispatch({ type: 'START_ANALYSIS' }), []),
    updateAnalysisStep: useCallback((step) => 
      dispatch({ type: 'UPDATE_ANALYSIS_STEP', payload: step }), []),
    analysisSuccess: useCallback((result) => 
      dispatch({ type: 'ANALYSIS_SUCCESS', payload: result }), []),
    analysisError: useCallback((error) => 
      dispatch({ type: 'ANALYSIS_ERROR', payload: error }), []),
    resetAnalysis: useCallback(() => 
      dispatch({ type: 'RESET_ANALYSIS' }), []),
    setShowOnboarding: useCallback((show) => 
      dispatch({ type: 'SET_SHOW_ONBOARDING', payload: show }), []),
    setShowHelp: useCallback((show) => 
      dispatch({ type: 'SET_SHOW_HELP', payload: show }), []),
    setShowMobileNav: useCallback((show) => 
      dispatch({ type: 'SET_SHOW_MOBILE_NAV', payload: show }), []),
    setDemoMode: useCallback((demo) => 
      dispatch({ type: 'SET_DEMO_MODE', payload: demo }), []),
  };

  return (
    <AppStateContext.Provider value={{ state, ...actions }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export default AppStateContext;
