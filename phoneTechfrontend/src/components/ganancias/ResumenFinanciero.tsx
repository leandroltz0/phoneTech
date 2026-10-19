import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { MetricaFinanciera } from '@/types/ganancias';

interface ResumenFinancieroProps {
  metricas: MetricaFinanciera[];
}

const formatPesos = (valor: number) => `$${valor.toLocaleString('es-AR')}`;

export const ResumenFinanciero = ({ metricas }: ResumenFinancieroProps) => {
  return (
    <View>
      <Text style={styles.titulo}>Resumen</Text>
      <View style={styles.grid}>
        {metricas.map((metrica) => (
          <View key={metrica.id} style={styles.card}>
            <Ionicons name={metrica.icono} size={15} color={metrica.color} />
            <Text style={styles.etiqueta}>{metrica.titulo}</Text>
            <Text style={styles.valor}>{formatPesos(metrica.valor)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titulo: {
    color: Colors.textMain,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 9,
  },
  card: {
    width: '48.7%',
    minHeight: 90,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  etiqueta: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 8,
  },
  valor: {
    color: Colors.textMain,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.45,
    marginTop: 3,
  },
});
