import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto } from '@/types/proyecto';
import { formatPeso } from '@/utils/formatters';

interface Props {
  proyecto: Proyecto;
  onEditar?: () => void;
}

export const DetalleResumenEconomico = ({ proyecto, onEditar }: Props) => {
  const [expandido, setExpandido] = useState(false);

  const esVendido = proyecto.estado === 'vendido';
  const gananciaLabel = esVendido ? 'Ganancia real' : 'Ganancia estimada';
  const precioVentaLabel = esVendido ? 'Precio de venta final' : 'Precio de venta estimado';
  const precioVenta = esVendido ? proyecto.precioVentaFinal : proyecto.precioVentaEstimado;

  // Calculamos compra + gastos registrados
  const compra = proyecto.precioCompra ?? 0;
  const gastos = proyecto.totalGastos ?? (proyecto.gastos?.reduce((acc, g) => acc + g.monto, 0) ?? 0);
  const compraYGastos = compra + gastos;

  return (
    <View style={styles.card}>
      {/* Encabezado con título y botón Editar */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderTitle}>Resumen económico</Text>
        {onEditar && (
          <TouchableOpacity
            style={styles.editarBtn}
            onPress={onEditar}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="pencil"
              size={12}
              color={Colors.primary}
              style={styles.editarIcon}
            />
            <Text style={styles.editarText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Fila principal: Ganancia y Precio de Venta con separador vertical */}
      <View style={styles.topRow}>
        <View style={styles.columna}>
          <Text style={styles.label}>{gananciaLabel}</Text>
          <Text style={styles.gananciaValue}>{formatPeso(proyecto.ganancia)}</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.columna}>
          <Text style={styles.label}>{precioVentaLabel}</Text>
          <Text style={styles.ventaValue}>{formatPeso(precioVenta)}</Text>
        </View>
      </View>

      {/* Fila inferior: Compra + gastos registrados */}
      <TouchableOpacity
        style={styles.bottomRow}
        onPress={() => setExpandido(!expandido)}
        activeOpacity={0.7}
      >
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Compra + gastos registrados</Text>
          <Text style={styles.bottomValue}>{formatPeso(compraYGastos)}</Text>
        </View>
        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-forward'}
          size={18}
          color={Colors.primary}
        />
      </TouchableOpacity>

      {/* Desglose desplegable opcional */}
      {expandido && (
        <View style={styles.desgloseContainer}>
          <View style={styles.desgloseDivider} />
          
          <View style={styles.desgloseRow}>
            <Text style={styles.desgloseLabel}>Precio de compra</Text>
            <Text style={styles.desgloseValue}>{formatPeso(proyecto.precioCompra)}</Text>
          </View>

          <View style={styles.desgloseRow}>
            <Text style={styles.desgloseLabel}>Total gastos repuestos/mano de obra</Text>
            <Text style={styles.desgloseValue}>{formatPeso(gastos)}</Text>
          </View>

          {proyecto.gastos && proyecto.gastos.length > 0 && (
            <View style={styles.gastosLista}>
              {proyecto.gastos.map((g) => (
                <View key={g.id} style={styles.gastoItem}>
                  <Text style={styles.gastoConcepto}>• {g.concepto}</Text>
                  <Text style={styles.gastoMonto}>{formatPeso(g.monto)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF7FC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4E9F5',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10264C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4E9F5',
  },
  editarIcon: {
    marginRight: 4,
  },
  editarText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  columna: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#D4E5F2',
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  label: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  gananciaValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0DAA77',
    letterSpacing: -0.5,
  },
  ventaValue: {
    fontSize: 21,
    fontWeight: '700',
    color: '#10264C',
    letterSpacing: -0.5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2F0F9',
  },
  bottomLeft: {
    gap: 3,
  },
  bottomLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
  },
  desgloseContainer: {
    marginTop: 8,
  },
  desgloseDivider: {
    height: 1,
    backgroundColor: '#D8ECF8',
    marginBottom: 10,
  },
  desgloseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  desgloseLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  desgloseValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10264C',
  },
  gastosLista: {
    marginTop: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#C8E3F5',
  },
  gastoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gastoConcepto: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  gastoMonto: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMain,
  },
});
