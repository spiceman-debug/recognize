// src/screens/ReasonScreen.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import useSessionStore from '../store/useSessionStore';
import { getAffirmationForFeeling } from '../data/affirmations';
import { getQuoteForFeeling } from '../data/quotes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReasonScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);
  const reasonPhase = useSessionStore((state) => state.reasonPhase);

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const phaseProgress = useRef(new Animated.Value(0)).current; // 0 = affirmation, 1 = quote

  const [quoteText, setQuoteText] = useState(null);

  if (!selectedFeeling) {
    return <View style={styles.emptyContainer} />;
  }

  const feelingLabel = selectedFeeling.label;

  const affirmation = useMemo(
    () => getAffirmationForFeeling(selectedFeeling.key),
    [selectedFeeling.key]
  );

  useEffect(() => {
    const q = getQuoteForFeeling(selectedFeeling.key);
    setQuoteText(q);
  }, [selectedFeeling.key]);

  // Initial entrance animation
  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    contentOpacity.setValue(0);

    // Set initial phase progress based on reasonPhase
    phaseProgress.setValue(reasonPhase === 1 ? 1 : 0);

    const fadeInTitle = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const holdCenter = Animated.delay(1500);

    const slideUpTitle = Animated.timing(titleTranslateY, {
      toValue: -SCREEN_HEIGHT * 0.2,
      duration: 500,
      useNativeDriver: true,
    });

    const fadeInContent = Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });

    Animated.sequence([
      fadeInTitle,
      holdCenter,
      slideUpTitle,
      fadeInContent,
    ]).start();
  }, [selectedFeeling.key]);

  // Smooth crossfade between affirmation and quote when phase changes
  useEffect(() => {
    Animated.timing(phaseProgress, {
      toValue: reasonPhase === 1 ? 1 : 0,
      duration: 380,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [reasonPhase]);

  // Derived opacities
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
      {/* Title block */}
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

      {/* Content block with crossfading layers */}
      <Animated.View
        style={[
          styles.contentBlock,
          { opacity: contentOpacity },
        ]}
      >
        {/* Affirmation layer */}
        <Animated.View
          style={[
            styles.layer,
            { opacity: affirmationOpacity },
          ]}
        >
          <Text style={styles.sectionLabel}>Awareness matters</Text>
          <Text style={styles.mainText}>{affirmation}</Text>
          <Text style={styles.subtleHint}>
            Take a moment with this. When you are ready, swipe up for a quote.
          </Text>
        </Animated.View>

        {/* Quote layer */}
        <Animated.View
          style={[
            styles.layer,
            { opacity: quoteOpacity },
          ]}
        >
          <Text style={styles.sectionLabel}>A thought for this feeling</Text>
          {quoteText && <Text style={styles.quoteText}>{quoteText}</Text>}
        </Animated.View>
      </Animated.View>

      {/* Swipe hint at the bottom */}
      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>Swipe up to continue</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1 },

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

  // Layers overlap each other and crossfade
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
    marginBottom: 14,
  },
  subtleHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
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
