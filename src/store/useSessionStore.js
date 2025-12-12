// src/store/useSessionStore.js
import create from 'zustand';
import { getAffirmationForFeeling } from '../data/affirmations';
import { getQuoteForFeeling } from '../data/quotes';

const useSessionStore = create((set) => ({
  currentScreen: 0,
  setCurrentScreen: (screenIndex) => set({ currentScreen: screenIndex }),

  selectedFeeling: null,

  // Reason screen session-locked content
  reasonAffirmationText: '',
  reasonQuoteText: '',
  reasonPhase: 0, // 0 = affirmation, 1 = quote
  setReasonPhase: (phase) => set({ reasonPhase: phase }),

  // Play Reason intro animation only once per session
  reasonIntroPlayed: false,
  setReasonIntroPlayed: (played) => set({ reasonIntroPlayed: played }),

  // Reflection flow state (session-locked)
  reflectionStepIndex: 0,
  reflectionAnswers: {},
  reflectionComplete: false,

  setReflectionAnswer: (questionKey, value, totalQuestions) =>
    set((state) => {
      const nextAnswers = { ...state.reflectionAnswers, [questionKey]: value };
      const nextIndex = Math.min(state.reflectionStepIndex + 1, totalQuestions);
      const done = nextIndex >= totalQuestions;

      return {
        reflectionAnswers: nextAnswers,
        reflectionStepIndex: nextIndex,
        reflectionComplete: done,
      };
    }),

  // New session begins when a new feeling is selected
  setFeeling: (feeling) =>
    set(() => ({
      selectedFeeling: feeling,

      // Lock quote + affirmation for the session
      reasonAffirmationText: getAffirmationForFeeling(feeling.key),
      reasonQuoteText: getQuoteForFeeling(feeling.key),
      reasonPhase: 0,

      // Reset intro animation for this new session
      reasonIntroPlayed: false,

      // Reset reflection flow for the new session
      reflectionStepIndex: 0,
      reflectionAnswers: {},
      reflectionComplete: false,
    })),

  clearSession: () =>
    set({
      currentScreen: 0,
      selectedFeeling: null,
      reasonAffirmationText: '',
      reasonQuoteText: '',
      reasonPhase: 0,
      reasonIntroPlayed: false,
      reflectionStepIndex: 0,
      reflectionAnswers: {},
      reflectionComplete: false,
    }),
}));

export default useSessionStore;
