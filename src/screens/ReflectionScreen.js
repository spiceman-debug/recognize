// src/screens/ReflectionScreen.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import useSessionStore from '../store/useSessionStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReflectionScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);
  const selectedReasons = useSessionStore((state) => state.selectedReasons);

  const [stepIndex, setStepIndex] = useState(0);

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedFeeling) return;

    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    cardOpacity.setValue(0);
    setStepIndex(0);

    const fadeInTitle = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const holdCenter = Animated.delay(1400);

    const slideUpTitle = Animated.timing(titleTranslateY, {
      toValue: -SCREEN_HEIGHT * 0.18,
      duration: 500,
      useNativeDriver: true,
    });

    const fadeInCard = Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });

    Animated.sequence([
      fadeInTitle,
      holdCenter,
      slideUpTitle,
      fadeInCard,
    ]).start();
  }, [selectedFeeling?.label]);

  if (!selectedFeeling) {
    return <View style={styles.emptyContainer} />;
  }

  const feelingLabel = selectedFeeling.label;

  // Build a small, tap-through reflection flow
  const reflectionSteps = useMemo(() => {
    const reasonsLabels = (selectedReasons || []).map((r) => r.label);
    const hasReasons = reasonsLabels.length > 0;

    const reasonsSentence = (() => {
      if (!hasReasons) return null;
      if (reasonsLabels.length === 1) {
        return `You connected this feeling to "${reasonsLabels[0]}".`;
      }
      if (reasonsLabels.length === 2) {
        return `You connected this feeling to "${reasonsLabels[0]}" and "${reasonsLabels[1]}".`;
      }
      const allButLast = reasonsLabels.slice(0, -1).join('", "');
      const last = reasonsLabels[reasonsLabels.length - 1];
      return `You connected this feeling to "${allButLast}", and "${last}".`;
    })();

    // Gentle reframe-ish text based on feeling
    const lower = feelingLabel.toLowerCase();
    let reframe;
    if (['lonely', 'sad'].includes(lower)) {
      reframe =
        "Feeling this way doesn’t mean anything is wrong with you. It’s your mind asking for care and maybe a bit more connection.";
    } else if (['anxious', 'overwhelmed', 'stressed'].includes(lower)) {
      reframe =
        "Your system is trying to protect you by staying alert. You don’t have to solve everything right now — naming it is already a way of calming your nervous system.";
    } else if (['tired'].includes(lower)) {
      reframe =
        "Tired is a signal, not a flaw. Even small pockets of rest or softness toward yourself are valid responses.";
    } else if (['angry', 'frustrated'].includes(lower)) {
      reframe =
        "Anger often shows up where something matters to you or a boundary feels crossed. Noticing it is the first step toward responding instead of just reacting.";
    } else if (
      ['grateful', 'calm', 'content', 'relaxed', 'happy', 'excited', 'proud'].includes(
        lower
      )
    ) {
      reframe =
        "It’s worth pausing to let this feeling register. Your brain learns from the good moments too — not just what’s hard.";
    } else {
      reframe =
        "Whatever this feeling is, it makes sense in the context of what you’re carrying. You’re allowed to meet it with curiosity instead of judgment.";
    }

    const steps = [];

    // Step 0 – Recognition
    steps.push({
      title: 'You showed up',
      body: `You took the time to notice that you feel ${feelingLabel.toLowerCase()}. That alone is a real act of awareness.`,
    });

    // Step 1 – Connection to reasons (if any)
    if (reasonsSentence) {
      steps.push({
        title: 'You made a connection',
        body: reasonsSentence,
      });
    } else {
      steps.push({
        title: 'You named it',
        body: "You might not be sure what’s underneath this yet — and that’s okay. Just putting a word to how you feel is already progress.",
      });
    }

    // Step 2 – Gentle reframe
    steps.push({
      title: 'This feeling makes sense',
      body: reframe,
    });

    // Step 3 – Small, present-focused invitation
    steps.push({
      title: 'What would help right now?',
      body:
        "There’s nothing you *have* to do next — but if you’d like, you can pause for a moment and ask:\n\n“What’s one small thing that might support me over the next few hours?”",
    });

    // Step 4 – Closing kindness
    steps.push({
      title: 'This counts as care',
      body:
        "You don’t have to fix your whole day in one go. Coming here, noticing what you feel, and staying with it for a moment already matters.",
    });

    return steps;
  }, [feelingLabel, selectedReasons]);

  const currentStep = reflectionSteps[Math.min(stepIndex, reflectionSteps.length - 1)];

  const handleAdvanceStep = () => {
    if (stepIndex < reflectionSteps.length - 1) {
      // simple fade transition
      Animated.sequence([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      setStepIndex((prev) => prev + 1);
    } else {
      // Last step – for now we just stay; later we could reset flow or go home
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
        <Text style={styles.preTitle}>Thanks for checking in</Text>
        <Text style={styles.feelingText}>{feelingLabel}</Text>
      </Animated.View>

      {/* Tap-through reflection card */}
      <Animated.View
        style={[
          styles.cardWrapper,
          { opacity: cardOpacity },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAdvanceStep}
          style={styles.cardTouchable}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{currentStep.title}</Text>
            <Text style={styles.cardBody}>{currentStep.body}</Text>

            <Text style={styles.cardFooter}>
              {stepIndex < reflectionSteps.length - 1
                ? 'Tap to continue'
                : 'You can stay here as long as you like.'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
  },
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
    fontSize: 17,
    color: '#6b7280',
    marginBottom: 6,
  },
  feelingText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 34,
    color: '#111827',
    textAlign: 'center',
  },

  cardWrapper: {
    marginTop: SCREEN_HEIGHT * 0.18,
    width: '100%',
  },
  cardTouchable: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(17,24,39,0.04)',
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  cardBody: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
});
