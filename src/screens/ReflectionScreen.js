// src/screens/ReflectionScreen.js
import React, { useMemo, useRef } from 'react';
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
import { getReflectionQuestionsForFeeling } from '../data/reflectionQuestions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const RESTING_TITLE_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

export default function ReflectionScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);

  const reflectionStepIndex = useSessionStore((state) => state.reflectionStepIndex);
  const reflectionAnswers = useSessionStore((state) => state.reflectionAnswers);
  const reflectionComplete = useSessionStore((state) => state.reflectionComplete);
  const setReflectionAnswer = useSessionStore((state) => state.setReflectionAnswer);

  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;

  const feelingKey = selectedFeeling?.key || 'default';
  const feelingLabel = selectedFeeling?.label || 'this feeling';

  const questions = useMemo(() => getReflectionQuestionsForFeeling(feelingKey), [feelingKey]);
  const total = questions.length;

  const clampedIndex = Math.min(reflectionStepIndex, total);
  const showComplete = reflectionComplete || clampedIndex >= total;

  const currentQuestion = !showComplete
    ? questions[Math.min(clampedIndex, total - 1)]
    : null;

  const subtitle = "Now let’s reflect on how you’ve been treating yourself lately.";

  const animateToNext = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 0, duration: 130, useNativeDriver: true }),
        Animated.timing(cardTranslateY, { toValue: 10, duration: 130, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 210, useNativeDriver: true }),
        Animated.timing(cardTranslateY, { toValue: 0, duration: 210, useNativeDriver: true }),
      ]),
    ]).start();
  };

  const handleSelect = async (questionKey, optionKey) => {
    try { await Haptics.selectionAsync(); } catch {}
    animateToNext();
    setReflectionAnswer(questionKey, optionKey, total);
  };

  return (
    <View style={styles.container}>
      {/* Same exact resting title placement as Reason */}
      <Animated.View
        style={[
          styles.titleBlock,
          { opacity: 1, transform: [{ translateY: RESTING_TITLE_TRANSLATE_Y }] },
        ]}
      >
        <Text style={styles.preTitle}>You chose</Text>
        <Text style={styles.feelingText}>{feelingLabel}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>

      {/* Card */}
      <View style={styles.cardArea}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] },
          ]}
        >
          {!showComplete ? (
            <>
              <Text style={styles.progressText}>
                {clampedIndex + 1} of {total}
              </Text>

              <Text style={styles.questionText}>{currentQuestion.prompt}</Text>

              <View style={styles.optionsWrapper}>
                {currentQuestion.options.map((opt) => {
                  const selected = reflectionAnswers[currentQuestion.key] === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.9}
                      onPress={() => handleSelect(currentQuestion.key, opt.key)}
                      style={[
                        styles.optionButton,
                        selected && styles.optionButtonSelected,
                      ]}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.progressText}>Complete</Text>
              <Text style={styles.questionText}>Thanks for checking in.</Text>
              <Text style={styles.completeHint}>Swipe up to continue.</Text>
            </>
          )}
        </Animated.View>
      </View>

      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>
          {showComplete ? 'Swipe up to continue' : 'Choose an option to continue'}
        </Text>
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
    fontSize: 34,
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },

  cardArea: {
    marginTop: SCREEN_HEIGHT * 0.22,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(17,24,39,0.04)',
  },

  progressText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  questionText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 14,
  },

  optionsWrapper: { width: '100%' },

  optionButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.06)',
    marginBottom: 10,
    alignItems: 'center',
  },
  optionButtonSelected: { backgroundColor: '#111827' },
  optionText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#111827',
  },
  optionTextSelected: { color: '#ffffff', fontWeight: '600' },

  completeHint: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
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
