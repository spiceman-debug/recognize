// src/data/reasons.js

// Small helper to build reason items
const r = (key, label) => ({ key, label });

const defaultReasons = [
  r('sleep_rest', "Sleep & rest"),
  r('stress_load', "Work / school load"),
  r('relationships', "People / relationships"),
  r('health_body', "Health / body"),
  r('self_talk', "How I’m talking to myself"),
  r('uncertainty', "Worry about the future"),
];

// Map of feeling.key -> reason chips
export const reasonsByFeelingKey = {
  // 🌤️ Lighter / positive feelings
  happy: [
    r('connection', "Time with people I care about"),
    r('good_news', "Good news or win today"),
    r('self_care', "I did something kind for myself"),
    r('progress', "I made progress on something important"),
  ],
  relaxed: [
    r('sleep_good', "I’ve been sleeping pretty well"),
    r('breaks', "I’ve had space to rest"),
    r('no_rush', "Today hasn’t felt rushed"),
    r('nature', "Time in nature / quiet space"),
  ],
  calm: [
    r('grounding', "I’ve been able to slow down"),
    r('clarity', "Things feel clear / in place"),
    r('support', "I feel supported"),
    r('less_noise', "Less noise / distraction than usual"),
  ],
  content: [
    r('routine', "My routine feels okay right now"),
    r('enough', "I feel like I have enough"),
    r('small_things', "I’m enjoying little things today"),
  ],
  grateful: [
    r('someone_helped', "Someone showed up for me"),
    r('saw_good', "I noticed something good"),
    r('perspective', "I’m seeing things in perspective"),
  ],
  proud: [
    r('effort', "I put in real effort"),
    r('courage', "I did something that took courage"),
    r('growth', "I handled something better than before"),
  ],
  excited: [
    r('looking_forward', "I’m looking forward to something"),
    r('new_thing', "Something new is starting"),
    r('opportunity', "There’s an opportunity I care about"),
  ],

  // 🌧️ Heavier feelings

  tired: [
    r('sleep_low', "I didn’t sleep enough"),
    r('rest_low', "I haven’t really rested"),
    r('busy', "It’s been non-stop / busy"),
    r('emotionally_drained', "Emotionally drained"),
    r('physically_unwell', "My body doesn’t feel great"),
  ],
  stressed: [
    r('work_school', "Work / school load"),
    r('deadlines', "Deadlines / expectations"),
    r('too_much', "Too many things at once"),
    r('money', "Money / bills"),
    r('uncertainty', "Not knowing what’s going to happen"),
  ],
  overwhelmed: [
    r('too_many_tasks', "Too many tasks or decisions"),
    r('responsibility', "A lot of responsibility"),
    r('not_enough_time', "Not enough time or space"),
    r('change', "A lot of change at once"),
  ],
  anxious: [
    r('future_worry', "Worry about the future"),
    r('health_worry', "Health worries (mine or others)"),
    r('social_worry', "Social situations / people"),
    r('performance', "Fear of not doing well enough"),
  ],
  sad: [
    r('loss', "Loss / disappointment"),
    r('disconnected', "Feeling disconnected from people"),
    r('let_down', "Feeling let down"),
    r('low_energy', "Emotionally low energy"),
  ],
  lonely: [
    r('time_alone', "I’ve been alone a lot"),
    r('no_one_to_talk', "I don’t feel like I have someone to talk to"),
    r('left_out', "Feeling left out or unseen"),
    r('new_chapter', "New place / change in my life"),
  ],
  angry: [
    r('boundary_crossed', "A boundary was crossed"),
    r('not_heard', "I don’t feel heard or respected"),
    r('unfair', "Something feels unfair"),
    r('frustration_buildup', "Built-up frustration"),
  ],
  frustrated: [
    r('blocked', "Feeling blocked or stuck"),
    r('repeating_patterns', "Same issue keeps happening"),
    r('others_behavior', "Someone’s behavior is getting to me"),
  ],
  disappointed: [
    r('expectations', "Things didn’t go how I hoped"),
    r('self_expectation', "I’m disappointed in myself"),
    r('others_expectation', "I’m disappointed in someone else"),
  ],

  // Fallback if we don't have a custom list for a feeling
  default: defaultReasons,
};

export const getReasonsForFeeling = (feelingKey) => {
  if (!feelingKey) return defaultReasons;
  return reasonsByFeelingKey[feelingKey] || defaultReasons;
};
