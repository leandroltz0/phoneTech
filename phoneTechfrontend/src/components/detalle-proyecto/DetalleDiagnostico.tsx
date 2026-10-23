import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto, FallaDiagnostico } from '@/types/proyecto';

interface Props {
  proyecto: Proyecto;
  onEditar?: () => void;
}

const getIconForComponente = (componente: string): keyof typeof Ionicons.glyphMap => {
  const comp = componente.toLowerCase();
  if (comp.includes('módulo') || comp.includes('modulo') || comp.includes('pantalla') || comp.includes('display')) {
    return 'phone-portrait-outline';
  }
  if (comp.includes('tapa') || comp.includes('carcasa') || comp.includes('marco')) {
    return 'tablet-portrait-outline';
  }
  if (comp.includes('pin') || comp.includes('carga')) {
    return 'battery-charging-outline';
  }
  if (comp.includes('batería') || comp.includes('bateria')) {
    return 'battery-dead-outline';
  }
  if (comp.includes('cámara') || comp.includes('camara') || comp.includes('lente')) {
    return 'camera-outline';
  }
  if (comp.includes('botón') || comp.includes('boton') || comp.includes('power')) {
    return 'power-outline';
  }
  if (comp.includes('placa') || comp.includes('humedad') || comp.includes('corto')) {
    return 'hardware-chip-outline';
  }
  return 'construct-outline';
};

export const DetalleDiagnostico = ({ proyecto, onEditar }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fallaSeleccionada, setFallaSeleccionada] = useState<FallaDiagnostico | null>(null);

  // Unificamos las fallas detalladas o generadas desde diagnostico simple
  const fallas: FallaDiagnostico[] =
    proyecto.fallas && proyecto.fallas.length > 0
      ? proyecto.fallas
      : proyecto.diagnostico.map((d, index) => {
          const parts = d.split(' ');
          const comp = parts[0] ?? 'Componente';
          const desc = parts.slice(1).join(' ') || d;
          return {
            id: `gen-${index}`,
            componente: comp,
            descripcion: desc,
            confirmada: true,
          };
        });

  const totalFallas = fallas.length;
  // Mostramos las 2 primeras en la vista resumida como en la captura
  const fallasVisibles = fallas.slice(0, 2);

  const handlePressFalla = (falla: FallaDiagnostico) => {
    setFallaSeleccionada(falla);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Diagnóstico</Text>
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

      {/* Lista de fallas resumidas */}
      <View style={styles.fallasLista}>
        {fallasVisibles.map((falla) => {
          const iconName = getIconForComponente(falla.componente);
          return (
            <TouchableOpacity
              key={falla.id}
              style={styles.fallaCard}
              onPress={() => handlePressFalla(falla)}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Ionicons name={iconName} size={22} color={Colors.primary} />
              </View>

              <View style={styles.fallaInfo}>
                <Text style={styles.fallaComponente}>{falla.componente}</Text>
                <Text style={styles.fallaDescripcion} numberOfLines={1}>
                  {falla.descripcion}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#9BB2C9" />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botón Editar / Agregar */}
      <TouchableOpacity
        style={styles.verTodasButton}
        onPress={onEditar ?? (() => setModalVisible(true))}
        activeOpacity={0.8}
      >
        <Ionicons
          name={totalFallas > 0 ? 'pencil' : 'add-circle-outline'}
          size={14}
          color={Colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.verTodasText}>
          {totalFallas > 0 ? 'Editar' : 'Agregar fallas'}
        </Text>
      </TouchableOpacity>

      {/* Modal para ver todas las fallas */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetDragBar} />
              <Text style={styles.sheetTitle}>Diagnóstico completo</Text>
              <Text style={styles.sheetSubtitle}>
                {proyecto.modelo} — {totalFallas} fallas registradas
              </Text>
            </View>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {fallas.map((falla) => {
                const iconName = getIconForComponente(falla.componente);
                return (
                  <View key={falla.id} style={styles.sheetFallaItem}>
                    <View style={styles.iconBox}>
                      <Ionicons name={iconName} size={22} color={Colors.primary} />
                    </View>
                    <View style={styles.sheetFallaInfo}>
                      <View style={styles.sheetRowTop}>
                        <Text style={styles.fallaComponente}>{falla.componente}</Text>
                        <View
                          style={[
                            styles.badgeConfirmada,
                            { backgroundColor: falla.confirmada ? '#E5F7EE' : '#FFF4D8' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeConfirmadaText,
                              { color: falla.confirmada ? '#237653' : '#946315' },
                            ]}
                          >
                            {falla.confirmada ? 'Confirmada' : 'A confirmar'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.fallaDescripcion}>{falla.descripcion}</Text>
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

      {/* Modal detalle individual de falla */}
      {fallaSeleccionada && (
        <Modal
          visible={!!fallaSeleccionada}
          transparent
          animationType="fade"
          onRequestClose={() => setFallaSeleccionada(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setFallaSeleccionada(null)}
          >
            <View style={styles.alertCard}>
              <View style={styles.alertIconHeader}>
                <Ionicons
                  name={getIconForComponente(fallaSeleccionada.componente)}
                  size={32}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.alertTitle}>{fallaSeleccionada.componente}</Text>
              <Text style={styles.alertDesc}>{fallaSeleccionada.descripcion}</Text>
              <Text style={styles.alertStatus}>
                Estado:{' '}
                {fallaSeleccionada.confirmada ? 'Falla confirmada' : 'Problema a verificar'}
              </Text>
              <TouchableOpacity
                style={styles.alertBtn}
                onPress={() => setFallaSeleccionada(null)}
              >
                <Text style={styles.alertBtnText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
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
  fallasLista: {
    gap: 8,
  },
  fallaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 2,
  },
  fallaDescripcion: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  verTodasButton: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#EFF7FC',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verTodasText: {
    fontSize: 14,
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
    maxHeight: '75%',
  },
  sheetDragBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    marginBottom: 14,
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
  },
  sheetScroll: {
    marginBottom: 14,
  },
  sheetFallaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  sheetFallaInfo: {
    flex: 1,
  },
  sheetRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeConfirmada: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeConfirmadaText: {
    fontSize: 11,
    fontWeight: '600',
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
  alertCard: {
    margin: 32,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  alertIconHeader: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 6,
  },
  alertDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  alertStatus: {
    fontSize: 12,
    color: '#237653',
    fontWeight: '600',
    marginBottom: 16,
  },
  alertBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  alertBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
