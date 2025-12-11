import { Gesture } from 'react-native-gesture-handler';
import useSessionStore from '../store/useSessionStore';

export const createSwipeGesture = (currentScreen) => {
  const goToScreen = (screen) => {
    const { setCurrentScreen } = useSessionStore.getState();
    setCurrentScreen(screen);
  };

  return Gesture.Pan().onEnd((event) => {
    const { translationY } = event;
    const { selectedFeeling } = useSessionStore.getState();

    // Only block forward swipe on Feeling screen if no feeling is selected
    const canSwipeNext = currentScreen !== 1 || !!selectedFeeling;

    if (translationY < -20 && currentScreen < 2 && canSwipeNext) {
      // Swipe up -> next screen
      goToScreen(currentScreen + 1);
    } else if (translationY > 20 && currentScreen > 0) {
      // Swipe down -> previous screen
      goToScreen(currentScreen - 1);
    }
  });
};
