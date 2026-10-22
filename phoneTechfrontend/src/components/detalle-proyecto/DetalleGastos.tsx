import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto } from '@/types/proyecto';

interface Props {
  proyecto: Proyecto;
}

const formatPeso = (n: number | undefined) => {
  if (n === undefined || n === null) return '$0';
  return `$${n.toLocaleString('es-AR')}`;
};

export const DetalleGastos = ({ proyecto }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const gastos = proyecto.gastos ?? [];
  const total =
    proyecto.totalGastos !== undefined
      ? proyecto.totalGastos
      : gastos.reduce((acc, g) => acc + g.monto, 0);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.info}>
          <Text style={styles.title}>Gastos registrados</Text>
          <Text style={styles.amount}>{formatPeso(total)}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#9BB2C9" />
      </TouchableOpacity>

      {/* Modal Desglose de Gastos */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetDragBar} />
            <Text style={styles.sheetTitle}>Gastos registrados</Text>
            <Text style={styles.sheetSubtitle}>
              Total acumulado: {formatPeso(total)}
            </Text>

            {gastos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={44} color="#C4D7E8" />
                <Text style={styles.emptyText}>No hay gastos registrados todavía en este proyecto.</Text>
              </View>
            ) : (
              <ScrollView style={styles.gastosScroll} showsVerticalScrollIndicator={false}>
                {gastos.map((gasto) => (
                  <View key={gasto.id} style={styles.gastoRow}>
                    <View style={styles.gastoIcon}>
                      <Ionicons name="receipt-outline" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.gastoTextContainer}>
                      <Text style={styles.gastoConcepto}>{gasto.concepto}</Text>
                      <Text style={styles.gastoFecha}>
                        {new Date(gasto.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.gastoMonto}>{formatPeso(gasto.monto)}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.sheetCloseButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  info: {
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10264C',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 38, 76, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  sheetDragBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10264C',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  gastosScroll: {
    marginBottom: 16,
  },
  gastoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  gastoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gastoTextContainer: {
    flex: 1,
  },
  gastoConcepto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10264C',
  },
  gastoFecha: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  gastoMonto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10264C',
  },
  sheetCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sheetCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
