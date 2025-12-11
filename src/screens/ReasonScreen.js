import React from 'react';
import { View, StyleSheet } from 'react-native';
import useSessionStore from '../store/useSessionStore';
import AnimatedTitle from '../components/AnimatedTitle';

export default function ReasonScreen() {
  const selectedFeeling = useSessionStore(state => state.selectedFeeling);

  if (!selectedFeeling) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <AnimatedTitle
        title={`You chose\n${selectedFeeling.label}`}
        nextText="Let's figure out why you feel this way and how to recognize it."
        titleFontSize={36}
        nextTextFontSize={22}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
