import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type BottomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

/**
 * CustomBottomNavBar
 * 
 * Barra de navegación inferior adaptada a la plataforma:
 * - iOS: Borde superior redondeado (curva suave estilo capsule/card), sombra sutil y safe area inferior.
 * - Android: Navbar plano y cuadrado con borde superior sutil y elevación nativa.
 * 
 * Cumple con la identidad visual Soft Blue Tech:
 * - Pestaña activa en píldora celeste suave (#DFF1FC) con texto/icono azul (#378CC4).
 * - Botón central circular azul (#378CC4) con icono '+' blanco perfectamente centrado.
 */
export const CustomBottomNavBar = ({
  state,
  navigateToTab,
  insets,
}: BottomTabBarProps) => {
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute?.name;

  const proyectosRoute = state.routes.find((r) => r.name === 'proyectos');
  const crearRoute = state.routes.find((r) => r.name === 'crear-proyecto');
  const gananciasRoute = state.routes.find((r) => r.name === 'ganancias');

  const isProyectosActive = currentRouteName === 'proyectos';
  const isGananciasActive = currentRouteName === 'ganancias';

  if (currentRouteName === 'crear-proyecto') {
    return null;
  }

  const bottomPadding =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom, 16)
      : Math.max(insets.bottom, 10);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <View style={styles.contentRow}>
        {/* Pestaña: Proyectos */}
        <View style={styles.tabSlot}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              proyectosRoute && navigateToTab(proyectosRoute.key)
            }
            style={[
              styles.tabItem,
              isProyectosActive && styles.tabItemActive,
            ]}
          >
            <Ionicons
              name="folder-outline"
              size={22}
              color={isProyectosActive ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                isProyectosActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Proyectos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón Central: '+' Crear Proyecto */}
        <View style={styles.centerSlot}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              crearRoute && navigateToTab(crearRoute.key)
            }
            style={styles.addButton}
          >
            <Ionicons name="add" size={28} color={Colors.surface} />
          </TouchableOpacity>
        </View>

        {/* Pestaña: Ganancias */}
        <View style={styles.tabSlot}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              gananciasRoute && navigateToTab(gananciasRoute.key)
            }
            style={[
              styles.tabItem,
              isGananciasActive && styles.tabItemActive,
            ]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={22}
              color={isGananciasActive ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                isGananciasActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Ganancias
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#1A334A',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      default: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 1,
        borderColor: Colors.border,
        elevation: 8,
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 24,
    minWidth: 100,
    backgroundColor: 'transparent',
  },
  tabItemActive: {
    backgroundColor: Colors.surfaceAlt,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabLabelInactive: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
});
