import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FallaDiagnostico } from '@/types/proyecto';
import { getIconForComponente } from '@/constants/componentes';

interface Props {
  fallas: FallaDiagnostico[];
  onPressFalla: (falla: FallaDiagnostico) => void;
}

export const ResumenFallasEditor = ({ fallas, onPressFalla }: Props) => {
  const totalFallas = fallas.length;

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Resumen de fallas</Text>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {totalFallas} {totalFallas === 1 ? 'falla' : 'fallas'}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </View>
      </View>

      {/* Listado de fallas */}
      {totalFallas === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={36} color="#94A3B8" />
          <Text style={styles.emptyText}>
            No hay fallas registradas.{'\n'}Tocá un componente abajo para agregar.
          </Text>
        </View>
      ) : (
        <View style={styles.fallasList}>
          {fallas.map((falla) => {
            const iconName = getIconForComponente(falla.componente);
            return (
              <TouchableOpacity
                key={falla.id}
                style={styles.fallaCard}
                onPress={() => onPressFalla(falla)}
                activeOpacity={0.7}
              >
                <View style={styles.iconBox}>
                  <Ionicons name={iconName} size={20} color={Colors.primary} />
                </View>
                <View style={styles.fallaInfo}>
                  <Text style={styles.fallaComponente}>{falla.componente}</Text>
                  <Text style={styles.fallaDescripcion} numberOfLines={1}>
                    {falla.descripcion}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9BB2C9" />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10264C',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  fallasList: {
    gap: 8,
  },
  fallaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fallaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fallaComponente: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 2,
  },
  fallaDescripcion: {
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
});
