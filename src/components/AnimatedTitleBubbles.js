import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AnimatedTitleBubbles({
  title,
  positiveItems = [],
  negativeItems = [],
  selectedItem,
  onSelectItem,
  titleFontSize = 28,
}) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;
  const bubbleOpacities = useRef([]).current;
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(titleTranslateY, { toValue: -60, duration: 600, useNativeDriver: true }), // moved up more
    ]).start(() => {
      setShowBubbles(true);
      animateBubbles();
    });
  }, []);

  const animateBubbles = () => {
    const allItems = [...positiveItems, ...negativeItems];
    bubbleOpacities.length = allItems.length;
    allItems.forEach((_, i) => (bubbleOpacities[i] = new Animated.Value(0)));

    Animated.stagger(
      100,
      allItems.map((_, i) =>
        Animated.timing(bubbleOpacities[i], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const renderBubbles = (list, startIndex = 0) =>
    list.map((item, i) => {
      const isSelected = selectedItem?.key === item.key;
      const opacity = bubbleOpacities[startIndex + i] || 1;

      return (
        <TouchableOpacity key={item.key} onPress={() => onSelectItem(item)}>
          <Animated.View
            style={[
              styles.bubble,
              { backgroundColor: item.color, opacity },
              isSelected && styles.selectedBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.label}</Text>
          </Animated.View>
        </TouchableOpacity>
      );
    });

  return (
    <View style={styles.container}>
      {/* Absolute title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={[styles.titleText, { fontSize: titleFontSize, fontWeight: 'bold' }]}>
          {title}
        </Text>
        {/* Bubble wrapper directly under title */}
        {showBubbles && (
          <View style={styles.bubbleWrapper}>
            <View style={styles.bubbleSection}>{renderBubbles(positiveItems, 0)}</View>
            <View style={styles.bubbleSection}>{renderBubbles(negativeItems, positiveItems.length)}</View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 60, // slightly higher to center bubbles
    alignItems: 'center',
    width: '100%',
  },
  titleText: { textAlign: 'center', fontFamily: 'PlusJakartaSans_400Regular' },
  bubbleWrapper: { marginTop: 30, alignItems: 'center' }, // more space between title and bubbles
  bubbleSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  bubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, margin: 5 },
  bubbleText: { color: '#fff', fontFamily: 'PlusJakartaSans_400Regular' },
  selectedBubble: { borderWidth: 2, borderColor: '#000', transform: [{ scale: 1.1 }] },
});
