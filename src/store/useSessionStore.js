// src/store/useSessionStore.js
import create from 'zustand';

const useSessionStore = create((set) => ({
  currentScreen: 0,
  setCurrentScreen: (screenIndex) => set({ currentScreen: screenIndex }),

  selectedFeeling: null,
  setFeeling: (feeling) =>
    set({
      selectedFeeling: feeling,
      selectedReasons: [],
      reasonPhase: 0,
    }),

  selectedReasons: [],
  toggleReason: (reason) =>
    set((state) => {
      const exists = state.selectedReasons.some((r) => r.key === reason.key);
      return {
        selectedReasons: exists
          ? state.selectedReasons.filter((r) => r.key !== reason.key)
          : [...state.selectedReasons, reason],
      };
    }),

  reasonPhase: 0,
  setReasonPhase: (phase) => set({ reasonPhase: phase }),

  clearSession: () =>
    set({
      currentScreen: 0,
      selectedFeeling: null,
      selectedReasons: [],
      reasonPhase: 0,
    }),
}));

export default useSessionStore;
