import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView, GestureDetector } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import useSessionStore from './src/store/useSessionStore';
import WelcomeScreen from './src/screens/WelcomeScreen';
import FeelingScreen from './src/screens/FeelingScreen';
import ReasonScreen from './src/screens/ReasonScreen';
import { createSwipeGesture } from './src/data/gestures';

export default function App() {
  const { currentScreen, setCurrentScreen, selectedFeeling } = useSessionStore();

  // Create swipe gesture with latest selectedFeeling
  const swipeGesture = createSwipeGesture(currentScreen, setCurrentScreen, selectedFeeling);

  // Screens in order
  const screens = [
    <WelcomeScreen key="welcome" />,
    <FeelingScreen key="feeling" />,
    <ReasonScreen key="reason" />,
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={['#cce7ff', '#ffffff']} style={styles.container}>
        <GestureDetector gesture={swipeGesture}>
          <View style={styles.screenContainer}>
            {screens[currentScreen]}
          </View>
        </GestureDetector>

        {/* Page indicator dots */}
        <View style={styles.dotsContainer}>
          {screens.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { opacity: i === currentScreen ? 1 : 0.3 }]}
            />
          ))}
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 }, // ensures screen fills gradient
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
});
