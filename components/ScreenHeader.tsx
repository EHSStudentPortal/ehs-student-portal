import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
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
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: Colors.bgSecondary,
        borderBottomColor: Colors.border,
        borderBottomWidth: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Text style={{ color: Colors.textPrimary, fontFamily: 'Syne_700Bold', fontSize: 22 }}>
              {title}
            </Text>
            {badge && (
              <View style={{ backgroundColor: badgeColor ?? Colors.emerald800, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 }}>
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
