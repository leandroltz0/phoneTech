import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { PuntoHistorial } from '@/types/ganancias';

interface HistorialMensualProps {
  valorActual: number;
  puntos: PuntoHistorial[];
}

const formatPesos = (valor: number) => `$${valor.toLocaleString('es-AR')}`;

export const HistorialMensual = ({ valorActual, puntos }: HistorialMensualProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.titulo}>Historial mensual</Text>
        <Text style={styles.periodo}>Octubre</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.valor}>{formatPesos(valorActual)}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Ganancia neta</Text>
          </View>
        </View>

        <View style={styles.chart}>
          {puntos.map((punto, index) => {
            const isActive = index === puntos.length - 1;

            return (
              <View key={punto.mes} style={styles.columna}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barra,
                      { height: punto.altura },
                      isActive ? styles.barraActiva : styles.barraInactiva,
                    ]}
                  />
                </View>
                <Text style={styles.mes}>{punto.mes}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  titulo: {
    color: Colors.textMain,
    fontSize: 15,
    fontWeight: '700',
  },
  periodo: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    paddingHorizontal: 13,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valor: {
    color: Colors.textMain,
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  badge: {
    backgroundColor: Colors.dashboard.successBackground,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },
  badgeText: {
    color: Colors.profit,
    fontSize: 10,
    fontWeight: '600',
  },
  chart: {
    height: 95,
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  columna: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 88,
    justifyContent: 'flex-end',
  },
  barra: {
    width: 22,
    borderRadius: 7,
  },
  barraInactiva: {
    backgroundColor: Colors.dashboard.chartBar,
  },
  barraActiva: {
    backgroundColor: Colors.dashboard.chartBarActive,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  mes: {
    color: Colors.textSecondary,
    fontSize: 9,
    marginTop: 4,
  },
});
