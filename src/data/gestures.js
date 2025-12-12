// src/data/gestures.js
import { Gesture } from 'react-native-gesture-handler';
import useSessionStore from '../store/useSessionStore';

export const createSwipeGesture = (currentScreen, goToScreen, selectedFeeling) => {
  const maxScreenIndex = 3; // 0: Welcome, 1: Feeling, 2: Reason, 3: Reflection

  return Gesture.Pan().onEnd((e) => {
    const dy = e.translationY;

    const { reasonPhase, setReasonPhase, reflectionComplete } =
      useSessionStore.getState();

    // Swipe up
    if (dy < -20) {
      // Block Feeling -> Reason unless a feeling is selected
      if (currentScreen === 1 && !selectedFeeling) return;

      // Reason: first swipe reveals quote, no navigation
      if (currentScreen === 2 && reasonPhase === 0) {
        setReasonPhase(1);
        return;
      }

      // If later we add a screen after Reflection, require completion first
      if (currentScreen === 3 && !reflectionComplete) {
        return;
      }

      if (currentScreen < maxScreenIndex) {
        goToScreen(currentScreen + 1);
      }
      return;
    }

    // Swipe down
    if (dy > 20) {
      // Disable swipe-back from Reflection
      if (currentScreen === 3) return;

      if (currentScreen > 0) {
        goToScreen(currentScreen - 1);
      }
    }
  });
};
