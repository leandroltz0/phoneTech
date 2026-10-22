import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FallaDiagnostico } from '@/types/proyecto';

interface Props {
  visible: boolean;
  fallasActuales: FallaDiagnostico[];
  onClose: () => void;
  onGuardar: (nuevasFallas: FallaDiagnostico[]) => void;
}

const COMPONENTES_RAPIDOS = [
  { nombre: 'Módulo', icono: 'phone-portrait-outline' as const, defecto: 'Módulo roto · Sin imagen' },
  { nombre: 'Batería', icono: 'battery-dead-outline' as const, defecto: 'Batería agotada · No retiene carga' },
  { nombre: 'Pin de carga', icono: 'battery-charging-outline' as const, defecto: 'Pin dañado · No carga' },
  { nombre: 'Tapa', icono: 'tablet-portrait-outline' as const, defecto: 'Tapa trasera rota / dañada' },
  { nombre: 'Cámara', icono: 'camera-outline' as const, defecto: 'Cámara sin funcionar / lente roto' },
  { nombre: 'Botones', icono: 'power-outline' as const, defecto: 'Botón de encendido / volumen roto' },
  { nombre: 'Audio', icono: 'volume-high-outline' as const, defecto: 'Parlante / auricular dañado' },
  { nombre: 'Placa', icono: 'hardware-chip-outline' as const, defecto: 'No enciende · Daño interno' },
];

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
  if (comp.includes('audio') || comp.includes('parlante') || comp.includes('mic')) {
    return 'volume-high-outline';
  }
  if (comp.includes('placa') || comp.includes('humedad') || comp.includes('corto')) {
    return 'hardware-chip-outline';
  }
  return 'construct-outline';
};

export const EditarDiagnosticoSheet = ({
  visible,
  fallasActuales,
  onClose,
  onGuardar,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [listaFallas, setListaFallas] = useState<FallaDiagnostico[]>(fallasActuales);
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);

  // Campos para agregar nueva falla
  const [nuevoComponente, setNuevoComponente] = useState('Módulo');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [esConfirmada, setEsConfirmada] = useState(true);

  useEffect(() => {
    if (visible) {
      setListaFallas(fallasActuales);
      setMostrarFormNuevo(false);
      setNuevoComponente('Módulo');
      setNuevaDescripcion('');
      setEsConfirmada(true);
    }
  }, [visible, fallasActuales]);

  const handleEliminarFalla = (idFalla: string) => {
    setListaFallas((prev) => prev.filter((f) => f.id !== idFalla));
  };

  const handleSeleccionarChipRapido = (item: (typeof COMPONENTES_RAPIDOS)[0]) => {
    setNuevoComponente(item.nombre);
    if (!nuevaDescripcion) {
      setNuevaDescripcion(item.defecto);
    }
  };

  const handleAgregarFalla = () => {
    if (!nuevoComponente.trim()) return;

    const nueva: FallaDiagnostico = {
      id: `falla-${Date.now()}`,
      componente: nuevoComponente.trim(),
      descripcion: nuevaDescripcion.trim() || 'Falla registrada',
      icono: getIconForComponente(nuevoComponente),
      confirmada: esConfirmada,
    };

    setListaFallas((prev) => [...prev, nueva]);
    setNuevaDescripcion('');
    setMostrarFormNuevo(false);
  };

  const handleGuardar = () => {
    onGuardar(listaFallas);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Pressable
            style={[
              styles.sheetContainer,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Barra superior de arrastre */}
            <View style={styles.dragBar} />

            {/* Botón de cierre superior derecho */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={Colors.primary} />
            </TouchableOpacity>

            {/* Encabezado */}
            <Text style={styles.title}>Editar diagnóstico</Text>
            <Text style={styles.subtitle}>
              Agregá o quitá fallas de este celular.
            </Text>

            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* ─── Lista de Fallas Actuales ─── */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Fallas registradas ({listaFallas.length})
                </Text>
              </View>

              {listaFallas.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkmark-done-circle-outline" size={40} color="#94A3B8" />
                  <Text style={styles.emptyText}>
                    No hay fallas en la lista. Podés agregar una abajo.
                  </Text>
                </View>
              ) : (
                <View style={styles.fallasList}>
                  {listaFallas.map((falla) => {
                    const iconName = getIconForComponente(falla.componente);

                    return (
                      <View key={falla.id} style={styles.fallaItemCard}>
                        {/* Icono del componente */}
                        <View style={styles.iconBox}>
                          <Ionicons name={iconName} size={20} color={Colors.primary} />
                        </View>

                        {/* Textos */}
                        <View style={styles.fallaItemInfo}>
                          <View style={styles.fallaRowTop}>
                            <Text style={styles.fallaComponente}>{falla.componente}</Text>
                            <View
                              style={[
                                styles.badgeStatus,
                                { backgroundColor: falla.confirmada ? '#E5F7EE' : '#FFF4D8' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  { color: falla.confirmada ? '#237653' : '#946315' },
                                ]}
                              >
                                {falla.confirmada ? 'Confirmada' : 'A verificar'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.fallaDescripcion}>{falla.descripcion}</Text>
                        </View>

                        {/* Botón eliminar (tacho rojo) */}
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleEliminarFalla(falla.id)}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* ─── Formulario / Botón para agregar falla ─── */}
              {!mostrarFormNuevo ? (
                <TouchableOpacity
                  style={styles.btnMostrarForm}
                  onPress={() => setMostrarFormNuevo(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add-circle"
                    size={20}
                    color={Colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.btnMostrarFormText}>Agregar otra falla</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.formAgregarCard}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Nueva falla</Text>
                    <TouchableOpacity
                      onPress={() => setMostrarFormNuevo(false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.formCancelText}>Ocultar</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Chips de selección rápida */}
                  <Text style={styles.formLabel}>Elegir componente rápido:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipsScroll}
                  >
                    {COMPONENTES_RAPIDOS.map((item) => {
                      const isSel = nuevoComponente === item.nombre;
                      return (
                        <TouchableOpacity
                          key={item.nombre}
                          style={[styles.chipItem, isSel && styles.chipItemActive]}
                          onPress={() => handleSeleccionarChipRapido(item)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={item.icono}
                            size={14}
                            color={isSel ? '#FFFFFF' : Colors.primary}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={[styles.chipText, isSel && styles.chipTextActive]}>
                            {item.nombre}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* Input Nombre de componente */}
                  <Text style={styles.formLabel}>Nombre del componente:</Text>
                  <TextInput
                    style={styles.formInput}
                    value={nuevoComponente}
                    onChangeText={setNuevoComponente}
                    placeholder="Ej: Módulo, Batería, etc."
                    placeholderTextColor={Colors.textSecondary}
                  />

                  {/* Input Descripción del problema */}
                  <Text style={styles.formLabel}>Descripción del problema:</Text>
                  <TextInput
                    style={styles.formInput}
                    value={nuevaDescripcion}
                    onChangeText={setNuevaDescripcion}
                    placeholder="Ej: Vidrio roto, sin imagen..."
                    placeholderTextColor={Colors.textSecondary}
                  />

                  {/* Selector Confirmada / A verificar */}
                  <View style={styles.toggleRow}>
                    <Text style={styles.formLabel}>¿Falla confirmada?</Text>
                    <View style={styles.toggleContainer}>
                      <TouchableOpacity
                        style={[
                          styles.toggleOption,
                          esConfirmada && styles.toggleOptionActive,
                        ]}
                        onPress={() => setEsConfirmada(true)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.toggleOptionText,
                            esConfirmada && styles.toggleOptionTextActive,
                          ]}
                        >
                          Sí
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.toggleOption,
                          !esConfirmada && styles.toggleOptionActive,
                        ]}
                        onPress={() => setEsConfirmada(false)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.toggleOptionText,
                            !esConfirmada && styles.toggleOptionTextActive,
                          ]}
                        >
                          A verificar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Botón Añadir */}
                  <TouchableOpacity
                    style={styles.btnAgregarFalla}
                    onPress={handleAgregarFalla}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.btnAgregarFallaText}>Añadir a la lista</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {/* ─── Botón Guardar Diagnóstico ─── */}
            <TouchableOpacity
              style={styles.guardarButton}
              onPress={handleGuardar}
              activeOpacity={0.88}
            >
              <Text style={styles.guardarText}>Guardar diagnóstico</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 38, 76, 0.45)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '88%',
    shadowColor: '#071B49',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  dragBar: {
    width: 44,
    height: 4,
    backgroundColor: '#DCE7EF',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 18.5,
    fontWeight: '700',
    color: '#10264C',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  scrollArea: {
    marginBottom: 16,
    maxHeight: 460,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fallasList: {
    gap: 8,
    marginBottom: 14,
  },
  fallaItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fallaItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fallaRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    paddingRight: 6,
  },
  fallaComponente: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
  },
  fallaDescripcion: {
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  badgeStatus: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  btnMostrarForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF7FC',
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BAE6FD',
    marginBottom: 12,
  },
  btnMostrarFormText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  formAgregarCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10264C',
  },
  formCancelText: {
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10264C',
    marginBottom: 6,
    marginTop: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE7EF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10264C',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
    color: '#10264C',
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toggleOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleOptionText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  toggleOptionTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  btnAgregarFalla: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 10,
    marginTop: 10,
  },
  btnAgregarFallaText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  guardarButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  guardarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
