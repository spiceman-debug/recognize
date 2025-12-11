import React from 'react';
import { View, StyleSheet } from 'react-native';
import useSessionStore from '../store/useSessionStore';
import emotions from '../data/emotions';
import AnimatedTitleBubbles from '../components/AnimatedTitleBubbles';

export default function FeelingScreen() {
  const { selectedFeeling, setFeeling } = useSessionStore();

  // Split emotions into positive and negative
  const positiveItems = emotions.filter(e => ['happy','relaxed','excited','calm','grateful','proud','hopeful','joyful'].includes(e.key));
  const negativeItems = emotions.filter(e => !positiveItems.includes(e));

  return (
    <View style={styles.container}>
      <AnimatedTitleBubbles
        title="How are you feeling today?"
        positiveItems={positiveItems}
        negativeItems={negativeItems}
        selectedItem={selectedFeeling}
        onSelectItem={setFeeling}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
