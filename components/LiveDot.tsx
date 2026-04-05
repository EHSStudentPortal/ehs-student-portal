import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface LiveDotProps {
  color?: string;
  size?: number;
}

export default function LiveDot({ color = '#10b981', size = 8 }: LiveDotProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.8, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.4,
          transform: [{ scale: pulse }],
        }}
      />
      <View style={{ width: size * 0.7, height: size * 0.7, borderRadius: (size * 0.7) / 2, backgroundColor: color }} />
    </View>
  );
}
