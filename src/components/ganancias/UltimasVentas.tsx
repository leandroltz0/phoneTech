import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { VentaReciente } from '@/types/ganancias';

interface UltimasVentasProps {
  ventas: VentaReciente[];
}

const formatPesos = (valor: number) => `+$${valor.toLocaleString('es-AR')}`;

export const UltimasVentas = ({ ventas }: UltimasVentasProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.titulo}>Ganancias por proyecto</Text>
        <Text style={styles.verTodos}>Ver todos</Text>
      </View>

      {ventas.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Todavía no hay ventas para mostrar.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {ventas.map((venta) => (
            <View key={venta.id} style={styles.card}>
              <Image source={{ uri: venta.imagen }} style={styles.imagen} resizeMode="cover" />
              <View style={styles.info}>
                <Text style={styles.modelo} numberOfLines={1}>{venta.modelo}</Text>
                <Text style={styles.descripcion}>
                  Proyecto #{String(venta.numeroProyecto).padStart(3, '0')} · {venta.fechaVenta}
                </Text>
              </View>
              <View style={styles.resultado}>
                <Text style={styles.ganancia}>{formatPesos(venta.ganancia)}</Text>
                <Text style={styles.estado}>Vendido</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  titulo: {
    color: Colors.textMain,
    fontSize: 15,
    fontWeight: '700',
  },
  verTodos: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 8,
  },
  card: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  imagen: {
    width: 36,
    height: 38,
    borderRadius: 8,
    backgroundColor: Colors.dashboard.infoBackground,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  modelo: {
    color: Colors.textMain,
    fontSize: 11,
    fontWeight: '700',
  },
  descripcion: {
    color: Colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },
  resultado: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  ganancia: {
    color: Colors.profit,
    fontSize: 11,
    fontWeight: '800',
  },
  estado: {
    color: Colors.textSecondary,
    fontSize: 8,
    marginTop: 3,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
