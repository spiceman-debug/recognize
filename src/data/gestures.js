// src/data/gestures.js
import { Gesture } from 'react-native-gesture-handler';
import useSessionStore from '../store/useSessionStore';

export const createSwipeGesture = (
  currentScreen,
  goToScreen,
  selectedFeeling,
  selectedReasons // still accepted for future use
) => {
  const maxScreenIndex = 3; // 0: Welcome, 1: Feeling, 2: Reason, 3: Reflection

  return Gesture.Pan().onEnd((e) => {
    const dy = e.translationY;
    const { reasonPhase, setReasonPhase } = useSessionStore.getState();

    let canSwipeNext = true;

    // Feeling -> Reason requires a feeling
    if (currentScreen === 1 && !selectedFeeling) {
      canSwipeNext = false;
    }

    // Swipe up
    if (dy < -20) {
      // Special handling on Reason screen (index 2)
      if (currentScreen === 2) {
        if (reasonPhase === 0) {
          // First swipe: show quote instead of moving screens
          setReasonPhase(1);
          return;
        }
        // If already in quote phase, allow normal forward navigation
      }

      if (currentScreen < maxScreenIndex && canSwipeNext) {
        goToScreen(currentScreen + 1);
      }
    }
    // Swipe down
    else if (dy > 20 && currentScreen > 0) {
      // Reset reason phase if leaving Reason
      if (currentScreen === 2 && reasonPhase !== 0) {
        setReasonPhase(0);
      }
      goToScreen(currentScreen - 1);
    }
  });
};
