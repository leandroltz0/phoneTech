import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

interface GananciaMensualProps {
  etiqueta: string;
  descripcion: string;
  valor: number;
  detalle: string;
}

const formatPesos = (valor: number) => `$${valor.toLocaleString('es-AR')}`;

export const GananciaMensual = ({ etiqueta, descripcion, valor, detalle }: GananciaMensualProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.orbitaGrande} />
      <View style={styles.orbitaChica} />

      <View style={styles.header}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <View style={styles.periodo}>
          <Text style={styles.periodoText}>Octubre 2026</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.surface} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <Text style={styles.valor}>{formatPesos(valor)}</Text>
        <Text style={styles.detalle}>{detalle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 166,
    backgroundColor: Colors.dashboard.hero,
    borderRadius: 22,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 18,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
  },
  orbitaGrande: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 87,
    right: -18,
    top: -56,
    borderWidth: 1,
    borderColor: Colors.dashboard.heroOverlay,
  },
  orbitaChica: {
    position: 'absolute',
    width: 102,
    height: 102,
    borderRadius: 51,
    right: 18,
    bottom: -69,
    borderWidth: 1,
    borderColor: Colors.dashboard.heroOverlay,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  periodo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: Colors.dashboard.heroOverlay,
  },
  periodoText: {
    color: Colors.surface,
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    marginTop: 31,
  },
  descripcion: {
    color: Colors.surface,
    fontSize: 12,
    opacity: 0.88,
  },
  valor: {
    color: Colors.surface,
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -0.9,
    marginTop: 4,
  },
  detalle: {
    color: Colors.surface,
    fontSize: 11,
    marginTop: 4,
    opacity: 0.88,
  },
});
