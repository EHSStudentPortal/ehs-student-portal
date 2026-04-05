import React from 'react';
import { View } from 'react-native';

const stressColors = ['', '#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

interface StressBarProps {
  value: number; // 1-5
}

export default function StressBar({ value }: StressBarProps) {
  const color = stressColors[value] ?? '#10b981';
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 2,
            backgroundColor: i <= value ? color : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </View>
  );
}
