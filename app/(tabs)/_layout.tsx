import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

const TABS: TabConfig[] = [
  { name: 'index',     title: 'Home',      icon: 'home-outline',       iconFocused: 'home' },
  { name: 'schedule',  title: 'Schedule',  icon: 'time-outline',        iconFocused: 'time' },
  { name: 'staff',     title: 'Staff',     icon: 'people-outline',      iconFocused: 'people' },
  { name: 'classes',   title: 'Courses',   icon: 'book-outline',        iconFocused: 'book' },
  { name: 'map',       title: 'Map',       icon: 'map-outline',         iconFocused: 'map' },
  { name: 'lunch',     title: 'Lunch',     icon: 'restaurant-outline',  iconFocused: 'restaurant' },
  { name: 'calendar',  title: 'Calendar',  icon: 'calendar-outline',    iconFocused: 'calendar' },
  { name: 'voice',     title: 'Voice',     icon: 'chatbubble-outline',  iconFocused: 'chatbubble' },
  { name: 'resources', title: 'Resources', icon: 'grid-outline',        iconFocused: 'grid' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgSecondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.emerald400,
        tabBarInactiveTintColor: Colors.textDim,
        tabBarLabelStyle: {
          fontFamily: 'DMSans_400Regular',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
