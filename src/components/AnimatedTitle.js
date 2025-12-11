import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function AnimatedTitle({
  title,
  nextText,
  titleFontSize = 36,
  nextTextFontSize = 24,
}) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(12)).current;
  const nextTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(12);
    nextTextOpacity.setValue(0);

    const titleAnim = Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    const nextAnim = nextText
      ? Animated.timing(nextTextOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      : null;

    if (nextAnim) {
      Animated.sequence([
        titleAnim,
        Animated.delay(250),
        nextAnim,
      ]).start();
    } else {
      titleAnim.start();
    }
  }, [title, nextText, titleOpacity, titleTranslateY, nextTextOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.titleText,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
            fontSize: titleFontSize,
          },
        ]}
      >
        {title}
      </Animated.Text>

      {nextText ? (
        <Animated.Text
          style={[
            styles.nextText,
            {
              opacity: nextTextOpacity,
              fontSize: nextTextFontSize,
            },
          ]}
        >
          {nextText}
        </Animated.Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    maxWidth: '80%',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827',
    lineHeight: 1.15 * 36, // will be scaled by fontSize in practice
  },
  nextText: {
    maxWidth: '80%',
    textAlign: 'center',
    marginTop: 18,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4b5563',
    lineHeight: 1.25 * 22,
  },
});
