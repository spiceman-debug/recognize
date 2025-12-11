// src/store/useSessionStore.js
import create from 'zustand';

const useSessionStore = create((set) => ({
  currentScreen: 0,
  setCurrentScreen: (screenIndex) => set({ currentScreen: screenIndex }),

  selectedFeeling: null,
  setFeeling: (feeling) =>
    set({
      selectedFeeling: feeling,
      // reset reasons when feeling changes
      selectedReasons: [],
    }),

  selectedReasons: [],
  toggleReason: (reason) =>
    set((state) => {
      const exists = state.selectedReasons.find((r) => r.key === reason.key);
      if (exists) {
        return {
          selectedReasons: state.selectedReasons.filter(
            (r) => r.key !== reason.key
          ),
        };
      }
      return {
        selectedReasons: [...state.selectedReasons, reason],
      };
    }),

  clearSession: () =>
    set({
      currentScreen: 0,
      selectedFeeling: null,
      selectedReasons: [],
    }),
}));

export default useSessionStore;
