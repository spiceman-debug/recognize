// src/data/reflectionQuestions.js

// Option sets (values are what we store; labels are what we show)
const OPTION_SETS = {
  AMOUNT_4: [
    { key: 'none', label: 'None' },
    { key: 'little', label: 'Little' },
    { key: 'some', label: 'Some' },
    { key: 'a_lot', label: 'A lot' },
  ],
  AMOUNT_3: [
    { key: 'little', label: 'Little' },
    { key: 'some', label: 'Some' },
    { key: 'a_lot', label: 'A lot' },
  ],
  FREQUENCY_4: [
    { key: 'never', label: 'Never' },
    { key: 'rarely', label: 'Rarely' },
    { key: 'sometimes', label: 'Sometimes' },
    { key: 'often', label: 'Often' },
  ],
  QUALITY_3: [
    { key: 'low', label: 'Low' },
    { key: 'okay', label: 'Okay' },
    { key: 'good', label: 'Good' },
  ],
};

const GROUPS = {
  anxious: ['anxious', 'overwhelmed', 'stressed', 'nervous'],
  low: ['sad', 'lonely', 'down', 'empty'],
  angry: ['angry', 'frustrated', 'irritated'],
  positive: ['happy', 'excited', 'calm', 'grateful', 'content', 'relaxed', 'proud'],
};

function getGroup(feelingKey) {
  const key = (feelingKey || '').toLowerCase();
  if (GROUPS.anxious.includes(key)) return 'anxious';
  if (GROUPS.low.includes(key)) return 'low';
  if (GROUPS.angry.includes(key)) return 'angry';
  if (GROUPS.positive.includes(key)) return 'positive';
  return 'default';
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Build questions in a consistent “feel”:
// - Core 4 questions (always)
// - Optional 1 bonus question (rotating)
// Keep the option labels fitting the prompt.
export function getReflectionQuestionsForFeeling(feelingKey) {
  const group = getGroup(feelingKey);

  // Core pools (we pick one variant from each category)
  const sleepPool = [
    { key: 'sleep', prompt: 'How would you rate your sleep lately?', options: OPTION_SETS.QUALITY_3 },
    { key: 'sleep', prompt: 'How much sleep have you been getting lately?', options: OPTION_SETS.AMOUNT_4 },
  ];

  const restPool = [
    { key: 'rest', prompt: 'How much rest have you allowed yourself lately?', options: OPTION_SETS.AMOUNT_4 },
    { key: 'rest', prompt: 'How often have you truly slowed down lately?', options: OPTION_SETS.FREQUENCY_4 },
  ];

  const screenPool = [
    { key: 'screen', prompt: 'How much social media have you consumed lately?', options: OPTION_SETS.AMOUNT_3 },
    { key: 'screen', prompt: 'How much scrolling have you been doing lately?', options: OPTION_SETS.AMOUNT_3 },
  ];

  // This fixes the weird “spoken to yourself” issue by matching the scale.
  const selfPool = [
    { key: 'self_compassion', prompt: 'How often have you been kind to yourself lately?', options: OPTION_SETS.FREQUENCY_4 },
    { key: 'self_compassion', prompt: 'How much self-compassion have you shown yourself lately?', options: OPTION_SETS.AMOUNT_3 },
  ];

  // Emotion-aware substitutions (keeps it relevant without becoming complex)
  const connectionPool = [
    { key: 'connection', prompt: 'How much meaningful connection have you had lately?', options: OPTION_SETS.AMOUNT_4 },
    { key: 'connection', prompt: 'How often have you felt connected to someone lately?', options: OPTION_SETS.FREQUENCY_4 },
  ];

  const calmPool = [
    { key: 'calm', prompt: 'How often have you had a quiet moment lately?', options: OPTION_SETS.FREQUENCY_4 },
    { key: 'calm', prompt: 'How much mental space have you had lately?', options: OPTION_SETS.AMOUNT_3 },
  ];

  const stressContentPool = [
    { key: 'content', prompt: 'How much stressful content have you consumed lately?', options: OPTION_SETS.AMOUNT_3 },
    { key: 'content', prompt: 'How often have you felt overstimulated lately?', options: OPTION_SETS.FREQUENCY_4 },
  ];

  const movementPool = [
    { key: 'movement', prompt: 'How much movement have you gotten lately?', options: OPTION_SETS.AMOUNT_4 },
    { key: 'movement', prompt: 'How often have you moved your body lately?', options: OPTION_SETS.FREQUENCY_4 },
  ];

  const sunlightPool = [
    { key: 'outside', prompt: 'How much time outside have you had lately?', options: OPTION_SETS.AMOUNT_4 },
    { key: 'outside', prompt: 'How often have you stepped outside lately?', options: OPTION_SETS.FREQUENCY_4 },
  ];

  // Build the core set, tuned by group
  let core = [];

  if (group === 'low') {
    core = [
      pickOne(sleepPool),
      pickOne(connectionPool),
      pickOne(restPool),
      pickOne(selfPool),
    ];
  } else if (group === 'anxious') {
    core = [
      pickOne(sleepPool),
      pickOne(stressContentPool),
      pickOne(calmPool),
      pickOne(selfPool),
    ];
  } else if (group === 'angry') {
    core = [
      pickOne(sleepPool),
      pickOne(stressContentPool),
      { key: 'pause', prompt: 'How often have you paused before reacting lately?', options: OPTION_SETS.FREQUENCY_4 },
      pickOne(selfPool),
    ];
  } else if (group === 'positive') {
    core = [
      pickOne(sleepPool),
      { key: 'presence', prompt: 'How often have you stayed present lately?', options: OPTION_SETS.FREQUENCY_4 },
      pickOne(restPool),
      { key: 'appreciation', prompt: 'How often have you appreciated yourself lately?', options: OPTION_SETS.FREQUENCY_4 },
    ];
  } else {
    core = [
      pickOne(sleepPool),
      pickOne(screenPool),
      pickOne(restPool),
      pickOne(selfPool),
    ];
  }

  // Bonus pool (we add 1 optional extra to increase variation)
  const bonusPoolByGroup = {
    anxious: [pickOne(movementPool), pickOne(sunlightPool)],
    low: [pickOne(sunlightPool), pickOne(movementPool)],
    angry: [pickOne(movementPool), { key: 'cool_off', prompt: 'How often have you had space to cool off lately?', options: OPTION_SETS.FREQUENCY_4 }],
    positive: [pickOne(movementPool), { key: 'gratitude', prompt: 'How often have you noticed something good lately?', options: OPTION_SETS.FREQUENCY_4 }],
    default: [pickOne(movementPool), pickOne(sunlightPool)],
  };

  const bonus = pickOne(bonusPoolByGroup[group] || bonusPoolByGroup.default);

  // To keep it “simple”, only add bonus sometimes (50/50)
  const includeBonus = Math.random() < 0.5;

  const finalList = includeBonus ? [...core, bonus] : [...core];

  // Keep order stable enough to feel consistent, but you can also shuffle if you want.
  // Returning stable order is usually calmer.
  return finalList;
}

export default getReflectionQuestionsForFeeling;
