import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FallaDiagnostico } from '@/types/proyecto';
import {
  COMPONENTES_DIAGNOSTICO,
  obtenerComponenteIdDeFalla,
} from '@/constants/componentes';

interface Props {
  fallas: FallaDiagnostico[];
  onPressComponente: (componenteId: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_HORIZONTAL_PADDING = 16;
const GRID_GAP = 10;
const GRID_ITEM_WIDTH =
  (SCREEN_WIDTH - 2 * GRID_HORIZONTAL_PADDING - 2 * GRID_GAP) / 3;

export const ComponentesGrid = ({ fallas, onPressComponente }: Props) => {
  // Contar fallas por componente
  const fallasPorComponente = new Map<string, number>();
  for (const falla of fallas) {
    const compId = obtenerComponenteIdDeFalla(falla.componente);
    if (compId) {
      fallasPorComponente.set(
        compId,
        (fallasPorComponente.get(compId) ?? 0) + 1
      );
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Componentes del dispositivo</Text>
      <Text style={styles.subtitle}>
        Revisá o agregá los componentes que correspondan.
      </Text>

      <View style={styles.grid}>
        {COMPONENTES_DIAGNOSTICO.map((comp) => {
          const count = fallasPorComponente.get(comp.id) ?? 0;
          const isActive = count > 0;

          return (
            <TouchableOpacity
              key={comp.id}
              style={[styles.gridItem, isActive && styles.gridItemActive]}
              onPress={() => onPressComponente(comp.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconBox,
                    isActive && styles.iconBoxActive,
                  ]}
                >
                  <Ionicons
                    name={comp.icono}
                    size={28}
                    color={isActive ? Colors.primary : '#9BB2C9'}
                  />
                </View>

                {/* Badge superpuesto */}
                <View
                  style={[
                    styles.badge,
                    isActive ? styles.badgeActive : styles.badgeInactive,
                  ]}
                >
                  <Ionicons
                    name={isActive ? 'checkmark' : 'add'}
                    size={13}
                    color={isActive ? '#FFFFFF' : Colors.primary}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.compName,
                  isActive && styles.compNameActive,
                ]}
              >
                {comp.nombre}
              </Text>
              <Text
                style={[
                  styles.compCount,
                  isActive && styles.compCountActive,
                ]}
              >
                {count} {count === 1 ? 'falla' : 'fallas'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Hint banner */}
      <View style={styles.hintCard}>
        <Ionicons
          name="bulb-outline"
          size={20}
          color={Colors.primary}
          style={styles.hintIcon}
        />
        <Text style={styles.hintText}>
          Tocá un componente para ver y editar sus fallas.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_WIDTH,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#E8F1F7',
  },
  gridItemActive: {
    backgroundColor: '#F0F8FF',
    borderColor: '#BCE1F9',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#E1F1FD',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  badgeActive: {
    backgroundColor: Colors.primary,
  },
  badgeInactive: {
    backgroundColor: '#E1F1FD',
  },
  compName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556878',
    textAlign: 'center',
  },
  compNameActive: {
    color: '#10264C',
    fontWeight: '700',
  },
  compCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  compCountActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF7FC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    gap: 12,
  },
  hintIcon: {},
  hintText: {
    fontSize: 13,
    color: '#246B96',
    fontWeight: '500',
    flex: 1,
  },
});
