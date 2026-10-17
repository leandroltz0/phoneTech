import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

// ─── Botón + central ─────────────────────────────────────────────────────────

interface AddButtonProps {
  // El onPress del tabBarButton acepta el evento nativo completo
   
  onPress?: ((...args: any[]) => void) | null;
}

const AddButton = ({ onPress }: AddButtonProps) => (
  <TouchableOpacity onPress={onPress ?? undefined} style={styles.addButton} activeOpacity={0.85}>
    <Ionicons name="add" size={28} color={Colors.surface} />
  </TouchableOpacity>
);

// ─── Layout de tabs ───────────────────────────────────────────────────────────

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      {/* Proyectos */}
      <Tabs.Screen
        name="proyectos"
        options={{
          title: 'Proyectos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-outline" size={size} color={color as string} />
          ),
        }}
      />

      {/* Botón + central (pantalla placeholder, el botón ocupa el slot visual) */}
      <Tabs.Screen
        name="crear-proyecto"
        options={{
          title: '',
          tabBarButton: ({ onPress }) => <AddButton onPress={onPress} />,
        }}
      />

      {/* Ganancias */}
      <Tabs.Screen
        name="ganancias"
        options={{
          title: 'Ganancias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 4,
    // Sombra sutil
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
