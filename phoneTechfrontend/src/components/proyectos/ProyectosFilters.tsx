import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { EstadoProyecto } from '@/types/proyecto';

export type FiltroProyecto = 'todos' | EstadoProyecto;

interface FiltroItem {
  key: FiltroProyecto;
  label: string;
}

const FILTROS: FiltroItem[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'evaluacion', label: 'En evaluación' },
  { key: 'reparacion', label: 'En reparación' },
  { key: 'venta', label: 'En venta' },
  { key: 'vendido', label: 'Vendidos' },
];

interface Props {
  filtroActivo: FiltroProyecto;
  onFiltroChange: (filtro: FiltroProyecto) => void;
}

export const ProyectosFilters = ({ filtroActivo, onFiltroChange }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTROS.map((item) => {
        const isActive = filtroActivo === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => onFiltroChange(item.key)}
            style={[styles.chip, isActive && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
});
