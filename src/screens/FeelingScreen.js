import React from 'react';
import { View, StyleSheet } from 'react-native';
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
      // Light, satisfying "tick" when they pick a feeling
      await Haptics.selectionAsync();
    } catch (e) {
      // fail silently if haptics not available
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
