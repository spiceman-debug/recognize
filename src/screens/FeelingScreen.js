// src/screens/FeelingScreen.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import useSessionStore from '../store/useSessionStore';
import emotions from '../data/emotions';
import AnimatedTitleBubbles from '../components/AnimatedTitleBubbles';

export default function FeelingScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);
  const setFeeling = useSessionStore((state) => state.setFeeling);

  const positiveItems = emotions.filter((e) => e.color === '#4CAF50');
  const negativeItems = emotions.filter((e) => e.color === '#2196F3');

  const handleSelectFeeling = async (item) => {
    setFeeling(item);

    try {
      await Haptics.selectionAsync();
    } catch (e) {
      // ignore haptics error
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedTitleBubbles
        title="How are you feeling today?"
        positiveItems={positiveItems}
        negativeItems={negativeItems}
        selectedItem={selectedFeeling}
        onSelectItem={handleSelectFeeling}
      />

      {/* Swipe up hint glued to bottom */}
      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>Swipe up to continue</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeHintContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
});
