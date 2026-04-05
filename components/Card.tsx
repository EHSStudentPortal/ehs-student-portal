import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
  className?: string;
}

export default function Card({ children, onPress, style, padded = true, className }: CardProps) {
  const inner = (
    <View
      style={[
        {
          backgroundColor: Colors.bgCard,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: padded ? 16 : 0,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
}
