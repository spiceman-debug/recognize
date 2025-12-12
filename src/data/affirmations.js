// src/data/affirmations.js

const affirmationsByFeeling = {
  anxious: [
    "Noticing your anxiety is a form of courage.",
    "You are meeting your mind with awareness, not avoidance.",
    "You caught the feeling instead of letting it quietly run the day.",
  ],
  sad: [
    "Seeing your sadness is a kind of strength.",
    "You are letting the feeling be seen, not buried.",
    "You are honoring something tender in you instead of ignoring it.",
  ],
  lonely: [
    "Recognizing loneliness is a way of reaching back toward connection.",
    "You are honest about needing closeness. That matters.",
    "You are not pretending you are fine. That is emotional maturity.",
  ],
  angry: [
    "You noticed your anger instead of just acting from it.",
    "You are paying attention to where a boundary might be speaking up.",
    "You are choosing awareness over automatic reaction.",
  ],
  overwhelmed: [
    "You paused long enough to notice you are at capacity.",
    "You are giving your nervous system a name, not just a workload.",
    "You are recognizing “too much” instead of pushing past yourself.",
  ],
  tired: [
    "Admitting you are tired is a gentle kind of honesty.",
    "You are noticing your limits instead of pretending you have none.",
    "You are letting your body’s signal be heard.",
  ],
  grateful: [
    "You paused to notice something good. That shapes your inner climate.",
    "You are letting appreciation register instead of rushing past it.",
    "You are training your mind to notice what is steadying.",
  ],
  calm: [
    "You are noticing calm instead of taking it for granted.",
    "You are registering safety in your system. That is powerful.",
    "You are allowing ease to be fully felt.",
  ],
  happy: [
    "You are letting this moment count, not just pass by.",
    "You are registering joy on purpose.",
    "You are allowing yourself to feel good without apologizing for it.",
  ],
  default: [
    "You are displaying emotional maturity by naming what you feel.",
    "Awareness is the first step, and you have already taken it.",
    "Most people rush past their emotions. You chose to pause.",
    "Simply recognizing your state is a meaningful act of self-care.",
  ],
};

export function getAffirmationForFeeling(feelingKey) {
  const list =
    affirmationsByFeeling[feelingKey] || affirmationsByFeeling.default;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
