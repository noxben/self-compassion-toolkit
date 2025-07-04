import React from 'react';
import { Screen } from '../types';
import { HeartIcon, CheckIcon, ChatIcon, TrophyIcon } from './icons';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeButton: React.FC<{
  onClick: () => void;
  gradient: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ onClick, gradient, icon, title, subtitle }) => (
  <button
    onClick={onClick}
    className={`home-button ${gradient} text-white rounded-xl p-6 shadow-lg flex flex-col items-center justify-center h-[150px] transition-transform duration-300 hover:-translate-y-1`}
  >
    {icon}
    <div className="text-xl font-bold">{title}</div>
    <div className="text-sm chinese-text mt-1">{subtitle}</div>
  </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <HomeButton
        onClick={() => onNavigate('affirmations')}
        gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
        icon={<HeartIcon className="h-10 w-10 mb-3" />}
        title="Affirmations"
        subtitle="正面肯定"
      />
      <HomeButton
        onClick={() => onNavigate('control')}
        gradient="bg-gradient-to-r from-green-500 to-teal-500"
        icon={<CheckIcon className="h-10 w-10 mb-3" />}
        title="What's in My Control"
        subtitle="我能控制的事情"
      />
      <HomeButton
        onClick={() => onNavigate('self-talk')}
        gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
        icon={<ChatIcon className="h-10 w-10 mb-3" />}
        title="Self-Talk Helper"
        subtitle="自我对话助手"
      />
      <HomeButton
        onClick={() => onNavigate('wins')}
        gradient="bg-gradient-to-r from-amber-500 to-orange-500"
        icon={<TrophyIcon className="h-10 w-10 mb-3" />}
        title="Tiny Wins Tracker"
        subtitle="小小胜利记录"
      />
    </div>
  );
};

export default HomeScreen;
