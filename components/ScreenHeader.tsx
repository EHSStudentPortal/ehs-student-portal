import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function ScreenHeader({ title, subtitle, right, badge, badgeColor }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 12, backgroundColor: Colors.bgSecondary, borderBottomColor: Colors.border, borderBottomWidth: 1 }}
      className="px-5 pb-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text style={{ color: Colors.textPrimary, fontFamily: 'Syne_700Bold', fontSize: 22 }}>
              {title}
            </Text>
            {badge && (
              <View style={{ backgroundColor: badgeColor ?? Colors.emerald800 }} className="px-2 py-0.5 rounded-full">
                <Text style={{ color: Colors.emerald400, fontFamily: 'DMMono_400Regular', fontSize: 10 }}>
                  {badge}
                </Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text style={{ color: Colors.textDim, fontFamily: 'DMSans_400Regular', fontSize: 13 }}>
              {subtitle}
            </Text>
          )}
        </View>
        {right && <View>{right}</View>}
      </View>
    </View>
  );
}
