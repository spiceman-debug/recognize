// src/data/gestures.js
import { Gesture } from 'react-native-gesture-handler';

export const createSwipeGesture = (
  currentScreen,
  goToScreen,
  selectedFeeling,
  selectedReasons
) => {
  const maxScreenIndex = 3; // 0: Welcome, 1: Feeling, 2: Reason, 3: Reflection

  return Gesture.Pan().onEnd((e) => {
    const dy = e.translationY;

    // Guard forward swipes based on what the user has done
    let canSwipeNext = true;

    // From Feeling -> Reason requires a feeling
    if (currentScreen === 1 && !selectedFeeling) {
      canSwipeNext = false;
    }

    // From Reason -> Reflection requires at least one reason
    if (
      currentScreen === 2 &&
      (!selectedReasons || selectedReasons.length === 0)
    ) {
      canSwipeNext = false;
    }

    // Swipe up (next)
    if (dy < -20 && currentScreen < maxScreenIndex && canSwipeNext) {
      goToScreen(currentScreen + 1);
    }
    // Swipe down (back)
    else if (dy > 20 && currentScreen > 0) {
      goToScreen(currentScreen - 1);
    }
  });
};
