import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto, EstadoProyecto } from '@/types/proyecto';

interface Props {
  proyecto: Proyecto;
  onCambiarEstado: () => void;
}

const estadoConfig: Record<
  EstadoProyecto,
  { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  evaluacion: { label: 'En evaluación', ...Colors.estados.evaluacion, icon: 'time-outline' },
  reparacion: { label: 'En reparación', ...Colors.estados.reparacion, icon: 'checkmark-circle' },
  venta: { label: 'En venta', ...Colors.estados.venta, icon: 'pricetag-outline' },
  vendido: { label: 'Vendido', ...Colors.estados.vendido, icon: 'checkmark-done-circle' },
};

export const DetalleEstadoCard = ({ proyecto, onCambiarEstado }: Props) => {
  const estado = estadoConfig[proyecto.estado];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Estado</Text>

      <View style={styles.contentRow}>
        {/* Badge de estado actual */}
        <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
          <Ionicons
            name={estado.icon}
            size={16}
            color={estado.text}
            style={styles.estadoIcon}
          />
          <Text style={[styles.estadoText, { color: estado.text }]}>
            {estado.label}
          </Text>
        </View>

        {/* Botón Cambiar estado */}
        <TouchableOpacity
          style={styles.cambiarBtn}
          onPress={onCambiarEstado}
          activeOpacity={0.75}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={16}
            color={Colors.primary}
            style={styles.btnIcon}
          />
          <Text style={styles.cambiarText}>Cambiar estado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  estadoIcon: {
    marginRight: 6,
  },
  estadoText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  cambiarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF7FC',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D4E9F5',
  },
  btnIcon: {
    marginRight: 6,
  },
  cambiarText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
