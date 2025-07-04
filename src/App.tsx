import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import AffirmationsSection from './components/AffirmationsSection';
import ControlSection from './components/ControlSection';
import SelfTalkSection from './components/SelfTalkSection';
import WinsSection from './components/WinsSection';
import BackButton from './components/BackButton';
import { Screen } from './types';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'affirmations':
        return <AffirmationsSection />;
      case 'control':
        return <ControlSection />;
      case 'self-talk':
        return <SelfTalkSection />;
      case 'wins':
        return <WinsSection />;
      case 'home':
      default:
        return <HomeScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen text-[#312e81]">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Self-Compassion Toolkit</h1>
          <p className="text-indigo-700 mt-2 chinese-text">自我关怀工具箱</p>
        </header>
        
        <main>
          {renderScreen()}
        </main>
        
        {activeScreen !== 'home' && <BackButton onBack={() => setActiveScreen('home')} />}
      </div>
    </div>
  );
}

export default App;
