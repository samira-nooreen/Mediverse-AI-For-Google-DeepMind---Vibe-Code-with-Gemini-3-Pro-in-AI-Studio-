import React, { useState } from 'react';
import { AppModule } from './types';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

type ViewState = 'LANDING' | 'DASHBOARD';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.TRIAGE);

  const navigateToModule = (module: AppModule) => {
    setActiveModule(module);
    setView('DASHBOARD');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView('LANDING');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {view === 'LANDING' && (
        <LandingPage 
          onNavigate={navigateToModule} 
        />
      )}

      {view === 'DASHBOARD' && (
        <Dashboard 
          initialTab={activeModule} 
          onGoHome={goHome}
        />
      )}
    </>
  );
};

export default App;