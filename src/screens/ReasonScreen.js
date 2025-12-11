// src/screens/ReasonScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import useSessionStore from '../store/useSessionStore';
import { getReasonsForFeeling } from '../data/reasons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReasonScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);
  const selectedReasons = useSessionStore((state) => state.selectedReasons);
  const toggleReason = useSessionStore((state) => state.toggleReason);

  if (!selectedFeeling) return <View style={styles.emptyContainer} />;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(1)).current;
  const reasonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    subtitleOpacity.setValue(1);
    reasonsOpacity.setValue(0);

    const fadeInTitle = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const holdCenter = Animated.delay(1500);

    const fadeOutSubtitle = Animated.timing(subtitleOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    });

    const slideTitleUp = Animated.timing(titleTranslateY, {
      toValue: -SCREEN_HEIGHT * 0.2,
      duration: 500,
      useNativeDriver: true,
    });

    const fadeInReasons = Animated.timing(reasonsOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    });

    Animated.sequence([
      fadeInTitle,
      holdCenter,
      fadeOutSubtitle,
      slideTitleUp,
      fadeInReasons,
    ]).start();
  }, [selectedFeeling.label]);

  const subtitleText = "Let’s take a moment to understand what’s behind this.";
  const reasons = getReasonsForFeeling(selectedFeeling.key);

  const isSelected = (reason) =>
    selectedReasons.some((r) => r.key === reason.key);

  const handleToggleReason = async (reason) => {
    toggleReason(reason);
    try {
      await Haptics.selectionAsync();
    } catch {
      // ignore
    }
  };

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

        <Text style={styles.feelingText}>{selectedFeeling.label}</Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          {subtitleText}
        </Animated.Text>
      </Animated.View>

      {/* Prompt + reason selection */}
      <Animated.View
        style={[
          styles.reasonArea,
          { opacity: reasonsOpacity },
        ]}
      >
        <Text style={styles.reasonPrompt}>
          What do you think is contributing to this feeling today?
        </Text>

        <Text style={styles.reasonHint}>
          Tap one or a few that resonate with you.
        </Text>

        <View style={styles.chipsWrapper}>
          {reasons.map((reason) => {
            const selected = isSelected(reason);
            return (
              <TouchableOpacity
                key={reason.key}
                activeOpacity={0.9}
                onPress={() => handleToggleReason(reason)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Swipe up hint glued to bottom – identical to FeelingScreen */}
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
  subtitle: {
    marginTop: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 17,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },

  reasonArea: {
    marginTop: SCREEN_HEIGHT * 0.18,
    width: '100%',
    alignItems: 'center',
  },
  reasonPrompt: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  reasonHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },

  chipsWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  chip: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.06)',
    marginBottom: 8,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#111827',
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#111827',
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },

  // EXACT same as FeelingScreen
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
