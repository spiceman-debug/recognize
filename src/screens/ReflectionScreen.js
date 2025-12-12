// src/screens/ReflectionScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import useSessionStore from '../store/useSessionStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReflectionScreen() {
  const selectedFeeling = useSessionStore((state) => state.selectedFeeling);

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    contentOpacity.setValue(0);

    const fadeInTitle = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const holdCenter = Animated.delay(1200);

    const slideUpTitle = Animated.timing(titleTranslateY, {
      toValue: -SCREEN_HEIGHT * 0.18,
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
  }, []);

  const feelingLabel = selectedFeeling?.label || "this feeling";

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
        <Text style={styles.preTitle}>Next step</Text>
        <Text style={styles.feelingText}>Self-awareness check-in</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.contentBlock,
          { opacity: contentOpacity },
        ]}
      >
        <Text style={styles.mainText}>
          In this next part of Recognize, you will gently reflect on how you have been
          treating yourself while feeling {feelingLabel.toLowerCase()}.
        </Text>
        <Text style={styles.mainText}>
          We will keep this simple and focused, so it feels like a small act of care,
          not another task.
        </Text>
      </Animated.View>

      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>Swipe down to revisit the quote</Text>
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
    fontSize: 17,
    color: '#6b7280',
    marginBottom: 6,
  },
  feelingText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 28,
    color: '#111827',
    textAlign: 'center',
  },
  contentBlock: {
    marginTop: SCREEN_HEIGHT * 0.18,
    width: '100%',
  },
  mainText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 14,
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
