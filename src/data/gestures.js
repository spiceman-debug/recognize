import { Gesture } from 'react-native-gesture-handler';
import useSessionStore from '../store/useSessionStore';

export const createSwipeGesture = (currentScreen, goToScreen) => {
  return Gesture.Pan().onEnd((e) => {
    // Always get the latest selectedFeeling
    const { selectedFeeling } = useSessionStore.getState();

    // Only allow swipe forward from FeelingScreen if a feeling is selected
    const canSwipeNext = currentScreen !== 1 || selectedFeeling;

    if (e.translationY < -20 && currentScreen < 2 && canSwipeNext) {
      goToScreen(currentScreen + 1);
    } else if (e.translationY > 20 && currentScreen > 0) {
      goToScreen(currentScreen - 1);
    }
  });
};
