import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto, MovimientoProyecto } from '@/types/proyecto';

interface Props {
  proyecto: Proyecto;
}

const formatFechaCorta = (iso: string) => {
  const d = new Date(iso);
  const dia = d.getUTCDate();
  const meses = [
    'ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.',
    'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'
  ];
  const mes = meses[d.getUTCMonth()];
  return `${dia} ${mes}`;
};

export const DetalleMovimientos = ({ proyecto }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const movimientos = proyecto.movimientos ?? [
    {
      id: 'm-default-1',
      tipo: 'creacion',
      descripcion: 'Proyecto creado',
      fecha: proyecto.fechaCreacion,
    },
  ];

  // Mostramos los 2 primeros como en la captura
  const visibles = movimientos.slice(0, 2);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Movimientos recientes</Text>

      <View style={styles.timelineContainer}>
        {visibles.map((mov, index) => {
          const isLast = index === visibles.length - 1;
          return (
            <View key={mov.id} style={styles.timelineRow}>
              {/* Columna icono y línea vertical */}
              <View style={styles.iconColumn}>
                <View style={styles.nodeIcon}>
                  <Ionicons name="time-outline" size={14} color="#718398" />
                </View>
                {!isLast && <View style={styles.verticalLine} />}
              </View>

              {/* Contenido fecha y descripción */}
              <View style={styles.contentRow}>
                <Text style={styles.fechaText}>{formatFechaCorta(mov.fecha)}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.descripcionText}>{mov.descripcion}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Ver historial si hay más */}
      {movimientos.length > 2 && (
        <TouchableOpacity
          style={styles.verHistorialBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.verHistorialText}>Ver historial ({movimientos.length})</Text>
        </TouchableOpacity>
      )}

      {/* Modal Historial Completo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetDragBar} />
            <Text style={styles.sheetTitle}>Historial de movimientos</Text>
            <Text style={styles.sheetSubtitle}>
              {proyecto.modelo} — Proyecto #{String(proyecto.numero).padStart(3, '0')}
            </Text>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              {movimientos.map((mov, index) => {
                const isLast = index === movimientos.length - 1;
                return (
                  <View key={mov.id} style={styles.timelineRow}>
                    <View style={styles.iconColumn}>
                      <View style={styles.nodeIcon}>
                        <Ionicons name="time-outline" size={14} color={Colors.primary} />
                      </View>
                      {!isLast && <View style={styles.verticalLine} />}
                    </View>
                    <View style={[styles.contentRow, { paddingBottom: 16 }]}>
                      <Text style={styles.fechaText}>{formatFechaCorta(mov.fecha)}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.descripcionText}>{mov.descripcion}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 12,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  nodeIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    width: 1.5,
    height: 24,
    backgroundColor: '#D0DFED',
    marginVertical: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 1,
    paddingBottom: 18,
    gap: 8,
  },
  fechaText: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    fontSize: 13.5,
    color: Colors.textSecondary,
  },
  descripcionText: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  verHistorialBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: -8,
  },
  verHistorialText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
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
    marginBottom: 18,
  },
  scroll: {
    marginBottom: 16,
  },
  sheetCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
