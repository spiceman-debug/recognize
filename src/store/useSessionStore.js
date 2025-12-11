import create from 'zustand';

const useSessionStore = create((set) => ({
  currentScreen: 0,
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  selectedFeeling: null, // single selection now
  setFeeling: (feeling) => set({ selectedFeeling: feeling }),
  resetFeeling: () => set({ selectedFeeling: null }),
}));

export default useSessionStore;
