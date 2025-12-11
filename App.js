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
  const currentScreen = useSessionStore((state) => state.currentScreen);
  const gesture = createSwipeGesture(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <FeelingScreen />;
      case 2:
      default:
        return <ReasonScreen />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <LinearGradient
        colors={['#f5f7fb', '#e8ecf7']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <GestureDetector gesture={gesture}>
          <View style={styles.screenContainer}>
            {renderScreen()}
          </View>
        </GestureDetector>

        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentScreen && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c4cad4',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
});
