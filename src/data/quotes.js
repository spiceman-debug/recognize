// src/data/quotes.js

const quotesByFeeling = {
  anxious: [
    "It is not things themselves that disturb us, but our opinions about them. - Epictetus",
    "You have power over your mind, not outside events. - Marcus Aurelius",
    "Do not anticipate trouble, or worry about what may never happen. - Benjamin Franklin",
  ],
  sad: [
    "There is a sacredness in tears, not a mark of weakness but of power. - Washington Irving",
    "The wound is the place where the light enters you. - Rumi",
    "Even the darkest night will end and the sun will rise. - Victor Hugo",
  ],
  lonely: [
    "We are all just walking each other home. - Ram Dass",
    "If you are lonely when you are alone, you are in bad company. - Jean Paul Sartre",
    "What is to give light must endure burning. - Viktor Frankl",
  ],
  angry: [
    "Anger, if not restrained, is often more harmful than the injury that provokes it. - Seneca",
    "The best revenge is to be unlike him who performed the injury. - Marcus Aurelius",
    "No man is free who is not master of himself. - Epictetus",
  ],
  overwhelmed: [
    "The happiness of your life depends upon the quality of your thoughts. - Marcus Aurelius",
    "If you are distressed by anything external, the pain is in your estimate of it. - Marcus Aurelius",
    "When everything is urgent, nothing truly is. - Unknown",
  ],
  tired: [
    "Sometimes the most important thing in a whole day is the rest between two deep breaths. - Etty Hillesum",
    "Be gentle first with yourself if you wish to be gentle with others. - Lama Yeshe",
    "If you are tired, learn to rest, not to quit. - Banksy",
  ],
  grateful: [
    "When you arise in the morning, remember it is a privilege to be alive. - Marcus Aurelius",
    "He is a wise man who does not grieve for the things which he has not. - Epictetus",
    "The thankful heart opens our eyes to a thousand blessings. - James E. Faust",
  ],
  calm: [
    "Silence is a source of great strength. - Lao Tzu",
    "Peace comes from within. Do not seek it without. - Buddha",
    "The nearer a man comes to a calm mind, the closer he is to strength. - Marcus Aurelius",
  ],
  happy: [
    "Dwell on the beauty of life. Watch the stars. - Marcus Aurelius",
    "Happiness depends upon ourselves. - Aristotle",
    "Joy is not in things, it is in us. - Richard Wagner",
  ],
  default: [
    "Knowing yourself is the beginning of all wisdom. - Aristotle",
    "When I let go of what I am, I become what I might be. - Lao Tzu",
    "We cannot direct the wind, but we can adjust the sails. - Dolly Parton",
    "The soul becomes dyed with the color of its thoughts. - Marcus Aurelius",
  ],
};

export function getQuoteForFeeling(feelingKey) {
  const list = quotesByFeeling[feelingKey] || quotesByFeeling.default;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
