export interface Affirmation {
  en: string;
  zh: string;
  isCustom: boolean;
}

export interface SelfTalkScript {
  title: string;
  en: string;
  zh: string;
}

export interface TinyWin {
  date: string;
  survived: string;
  action: string;
  selfcare: string;
}

export type Screen = 'home' | 'affirmations' | 'control' | 'self-talk' | 'wins';
