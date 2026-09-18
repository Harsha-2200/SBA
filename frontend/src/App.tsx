import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { CalculatorView } from './views/CalculatorView';
import { AboutView } from './views/AboutView';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'calculator' | 'about'>('home');

  const handleNavigate = (view: 'home' | 'calculator' | 'about') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-100/60 text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-stone-900">
      {/* Top Navigation */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Container */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
          {currentView === 'calculator' && <CalculatorView />}
          {currentView === 'about' && <AboutView />}
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
