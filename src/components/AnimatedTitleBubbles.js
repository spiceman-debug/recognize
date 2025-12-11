import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AnimatedTitleBubbles({
  title,
  positiveItems = [],
  negativeItems = [],
  selectedItem,
  onSelectItem,
  titleFontSize = 32,
}) {
  // Title animation
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;

  // Bubble container animation
  const bubbleContainerOpacity = useRef(new Animated.Value(0)).current;
  const bubbleContainerTranslateY = useRef(new Animated.Value(20)).current;

  // Individual bubble fade-in
  const bubbleItemOpacities = useRef([]).current;
  const allItems = [...positiveItems, ...negativeItems];

  if (bubbleItemOpacities.length !== allItems.length) {
    bubbleItemOpacities.length = 0;
    allItems.forEach(() => {
      bubbleItemOpacities.push(new Animated.Value(0));
    });
  }

  useEffect(() => {
    // reset
    titleOpacity.setValue(0);
    titleTranslateY.setValue(0);
    bubbleContainerOpacity.setValue(0);
    bubbleContainerTranslateY.setValue(20);
    bubbleItemOpacities.forEach((v) => v.setValue(0));

    const fadeInTitle = Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const holdCenter = Animated.delay(750);

    const slideTitleUp = Animated.timing(titleTranslateY, {
      toValue: -SCREEN_HEIGHT * 0.25, // moved a bit higher for spacing
      duration: 500,
      useNativeDriver: true,
    });

    const revealBubbleContainer = Animated.parallel([
      Animated.timing(bubbleContainerOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleContainerTranslateY, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]);

    const bubbleItemAnims = bubbleItemOpacities.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 260,
        delay: i * 70,
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      fadeInTitle,
      holdCenter,
      slideTitleUp,
      revealBubbleContainer,
      Animated.stagger(70, bubbleItemAnims),
    ]).start();
  }, [title, positiveItems.length, negativeItems.length]);

  const renderBubble = (item, itemIndex) => {
    const isSelected = selectedItem?.key === item.key;
    const anim = bubbleItemOpacities[itemIndex] || new Animated.Value(1);

    const backgroundColor = isSelected
      ? item.color
      : 'rgba(15,23,42,0.06)'; // neutral until selected

    const textColor = isSelected ? '#ffffff' : '#111827';

    return (
      <Animated.View
        key={item.key}
        style={[
          styles.bubbleWrapper,
          {
            opacity: anim,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onSelectItem && onSelectItem(item)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Animated.View
            style={[
              styles.bubble,
              {
                backgroundColor,
                transform: [{ scale: isSelected ? 1.06 : 1 }],
              },
              isSelected && styles.selectedBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                { color: textColor },
                isSelected && styles.bubbleTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title: centered, then moves up */}
      <Animated.Text
        style={[
          styles.titleText,
          {
            fontSize: titleFontSize,
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        {title}
      </Animated.Text>

      {/* Bubbles: appear after title finishes motion */}
      <Animated.View
        style={[
          styles.bubbleContainer,
          {
            opacity: bubbleContainerOpacity,
            transform: [{ translateY: bubbleContainerTranslateY }],
          },
        ]}
      >
        <View style={styles.bubbleSection}>
          {positiveItems.map((item, i) => renderBubble(item, i))}
        </View>

        <View style={styles.bubbleSection}>
          {negativeItems.map((item, i) =>
            renderBubble(item, positiveItems.length + i)
          )}
        </View>

        {/* Swipe up hint (text only) */}
        <View style={styles.swipeHintContainer}>
          <Text style={styles.swipeHintText}>Swipe up to continue</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // centers title initially
    paddingHorizontal: 24,
  },
  titleText: {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#111827',
    width: '80%',
  },
  bubbleContainer: {
    width: '100%',
    marginTop: 200, // where title "lands" and bubbles live
    alignItems: 'center',
  },
  bubbleSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bubbleWrapper: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  bubble: {
    minWidth: 120,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
  },
  bubbleTextSelected: {
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  selectedBubble: {
    shadowColor: '#111827',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  swipeHintContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
  swipeHintText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
});
