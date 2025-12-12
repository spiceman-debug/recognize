// src/screens/ReasonScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import useSessionStore from '../store/useSessionStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const RESTING_TITLE_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

export default function ReasonScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);

  const reasonPhase = useSessionStore((state) => state.reasonPhase);
  const reasonAffirmationText = useSessionStore((state) => state.reasonAffirmationText);
  const reasonQuoteText = useSessionStore((state) => state.reasonQuoteText);

  const reasonIntroPlayed = useSessionStore((state) => state.reasonIntroPlayed);
  const setReasonIntroPlayed = useSessionStore((state) => state.setReasonIntroPlayed);

  const titleOpacity = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(RESTING_TITLE_TRANSLATE_Y)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const phaseProgress = useRef(new Animated.Value(0)).current;
  const prevReasonPhaseRef = useRef(null);

  if (!selectedFeeling) return <View style={{ flex: 1 }} />;

  const feelingLabel = selectedFeeling.label;

  // Intro animation only once per session
  useEffect(() => {
    if (reasonIntroPlayed) {
      // Snap to resting state, no animation
      titleOpacity.setValue(1);
      titleTranslateY.setValue(RESTING_TITLE_TRANSLATE_Y);
      contentOpacity.setValue(1);
      return;
    }

    // Play intro once
    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    contentOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(titleTranslateY, {
        toValue: RESTING_TITLE_TRANSLATE_Y,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setReasonIntroPlayed(true);
    });
  }, [selectedFeeling.key]);

  // Hydrate phaseProgress statically
  useEffect(() => {
    phaseProgress.setValue(reasonPhase === 1 ? 1 : 0);
    prevReasonPhaseRef.current = reasonPhase;
  }, [selectedFeeling.key]);

  // Animate only 0 -> 1 transition
  useEffect(() => {
    const prev = prevReasonPhaseRef.current;
    prevReasonPhaseRef.current = reasonPhase;

    if (prev === 0 && reasonPhase === 1) {
      Animated.timing(phaseProgress, {
        toValue: 1,
        duration: 380,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [reasonPhase]);

  const affirmationOpacity = phaseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const quoteOpacity = phaseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleBlock,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.preTitle}>You chose</Text>
        <Text style={styles.feelingText}>{feelingLabel}</Text>
      </Animated.View>

      <Animated.View style={[styles.contentBlock, { opacity: contentOpacity }]}>
        <Animated.View style={[styles.layer, { opacity: affirmationOpacity }]}>
          <Text style={styles.sectionLabel}>Awareness matters</Text>
          <Text style={styles.mainText}>{reasonAffirmationText}</Text>
        </Animated.View>

        <Animated.View style={[styles.layer, { opacity: quoteOpacity }]}>
          <Text style={styles.sectionLabel}>A thought for this feeling</Text>
          <Text style={styles.quoteText}>{reasonQuoteText}</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>Swipe up to continue</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: {
    position: 'absolute',
    width: '85%',
    alignItems: 'center',
  },
  preTitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 6,
  },
  feelingText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 38,
    color: '#111827',
    textAlign: 'center',
  },

  contentBlock: {
    marginTop: SCREEN_HEIGHT * 0.18,
    width: '100%',
    minHeight: 120,
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  sectionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  mainText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  quoteText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
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
