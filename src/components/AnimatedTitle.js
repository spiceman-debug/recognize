import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function AnimatedTitle({ 
  title, 
  nextText, 
  titleFontSize = 36, 
  nextTextFontSize = 24 
}) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const nextTextOpacity = useRef(new Animated.Value(0)).current;

  const [showNextText, setShowNextText] = useState(false);

  useEffect(() => {
    Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(titleTranslateY, {
          toValue: -50,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          setShowNextText(true);
          Animated.timing(nextTextOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        });
      }, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
          alignItems: 'center',
        }}
      >
        <Text style={[styles.titleText, { fontSize: titleFontSize, fontWeight: 'bold' }]}>
          {title}
        </Text>
      </Animated.View>

      {showNextText && (
        <Animated.View style={{ opacity: nextTextOpacity, marginTop: 20 }}>
          <Text style={[styles.nextText, { fontSize: nextTextFontSize }]}>
            {nextText}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleText: { textAlign: 'center', fontFamily: 'PlusJakartaSans_400Regular' },
  nextText: { textAlign: 'center', fontFamily: 'PlusJakartaSans_400Regular', color: '#333', opacity: 0.9 },
});
