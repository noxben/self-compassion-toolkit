import { Affirmation, SelfTalkScript } from './types';

export const DEFAULT_AFFIRMATIONS: Affirmation[] = [
  { en: "I am allowed to feel tired - it doesn't mean I've failed.", zh: "我可以感到疲倦，这并不意味着我失败了。", isCustom: false },
  { en: "I am learning, not failing.", zh: "我在学习，而不是在失败。", isCustom: false },
  { en: "My worth is not measured by my productivity.", zh: "我的价值不是由我的生产力来衡量的。", isCustom: false },
  { en: "I am enough just as I am right now.", zh: "我现在的样子已经足够好了。", isCustom: false },
  { en: "It's okay to take things one step at a time.", zh: "一步一步慢慢来是可以的。", isCustom: false },
  { en: "I deserve kindness, especially from myself.", zh: "我值得被善待，尤其是来自我自己的善待。", isCustom: false },
  { en: "My feelings are valid, even when they're difficult.", zh: "我的感受是有效的，即使它们很困难。", isCustom: false },
  { en: "I can be both a work in progress and worthy of love.", zh: "我可以是一个正在进步的人，同时也值得被爱。", isCustom: false },
];

export const SELF_TALK_SCRIPTS: SelfTalkScript[] = [
  {
    title: "When Feeling Overwhelmed",
    en: "I don't have to solve everything today – just one small thing.",
    zh: "我不需要今天就解决所有问题，只要做一件小事就好。",
  },
  {
    title: "When Feeling Anxious",
    en: "I feel scared right now – that's okay. It means I care.",
    zh: "我现在感到害怕 - 这没关系。这表示我在乎。",
  },
  {
    title: "When Feeling Inadequate",
    en: "I am doing my best with what I have right now, and that is enough.",
    zh: "我正在尽我所能，用我现有的资源做到最好，这已经足够了。",
  },
  {
    title: "When Feeling Stuck",
    en: "This is just a moment in time. I've moved through difficult moments before.",
    zh: "这只是时间中的一个时刻。我以前也曾度过困难的时刻。",
  },
];

export const DEFAULT_IN_CONTROL_ITEMS: string[] = ['My responses to situations', 'How I spend my time', 'My self-care practices'];
export const DEFAULT_NOT_CONTROL_ITEMS: string[] = ["Other people's actions", 'Past events', 'Global circumstances'];
