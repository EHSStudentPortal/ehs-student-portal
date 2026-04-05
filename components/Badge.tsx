import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color = '#34d399', bg, size = 'sm' }: BadgeProps) {
  const bgColor = bg ?? `${color}20`;
  const fontSize = size === 'sm' ? 10 : 12;
  const px = size === 'sm' ? 8 : 10;
  const py = size === 'sm' ? 3 : 5;

  return (
    <View style={{ backgroundColor: bgColor, borderColor: `${color}40`, borderWidth: 1, borderRadius: 100, paddingHorizontal: px, paddingVertical: py }}>
      <Text style={{ color, fontFamily: 'DMMono_400Regular', fontSize, letterSpacing: 0.3 }}>{label}</Text>
    </View>
  );
}
