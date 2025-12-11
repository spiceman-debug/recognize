// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import useSessionStore from './src/store/useSessionStore';
import WelcomeScreen from './src/screens/WelcomeScreen';
import FeelingScreen from './src/screens/FeelingScreen';
import ReasonScreen from './src/screens/ReasonScreen';
import ReflectionScreen from './src/screens/ReflectionScreen';
import { createSwipeGesture } from './src/data/gestures';

export default function App() {
  const currentScreen = useSessionStore((state) => state.currentScreen);
  const setCurrentScreen = useSessionStore((state) => state.setCurrentScreen);
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);
  const selectedReasons = useSessionStore((state) => state.selectedReasons);

  const swipeGesture = createSwipeGesture(
    currentScreen,
    setCurrentScreen,
    selectedFeeling,
    selectedReasons
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <FeelingScreen />;
      case 2:
        return <ReasonScreen />;
      case 3:
        return <ReflectionScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  // We'll show dots for the main flow screens (Feeling, Reason, Reflection)
  const totalSteps = 3;
  const stepIndex = Math.min(Math.max(currentScreen - 1, 0), totalSteps - 1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <LinearGradient
          colors={['#f9fafb', '#e5e7eb']}
          style={styles.gradient}
        >
          <View style={styles.screenContainer}>{renderScreen()}</View>

          <View style={styles.dotsContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === stepIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#111827',
    transform: [{ scale: 1.2 }],
  },
});
