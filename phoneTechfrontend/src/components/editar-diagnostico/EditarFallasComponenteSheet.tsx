import React, { useState } from 'react';
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
import {
  COMPONENTES_DIAGNOSTICO,
  obtenerComponenteIdDeFalla,
  ComponenteDiagnostico,
} from '@/constants/componentes';

let contadorId = 1000;
const generarIdFalla = (prefix: string) => {
  contadorId += 1;
  return `${prefix}-${contadorId}`;
};

interface ContentProps {
  componente: ComponenteDiagnostico;
  fallasIniciales: FallaDiagnostico[];
  onClose: () => void;
  onAplicar: (componenteId: string, fallasComponente: FallaDiagnostico[]) => void;
}

const EditarFallasComponenteContent = ({
  componente,
  fallasIniciales,
  onClose,
  onAplicar,
}: ContentProps) => {
  const insets = useSafeAreaInsets();
  const [fallasLocales, setFallasLocales] = useState<FallaDiagnostico[]>(fallasIniciales);
  const [textoPersonalizada, setTextoPersonalizada] = useState('');

  const handleEliminarFalla = (idFalla: string) => {
    setFallasLocales((prev) => prev.filter((f) => f.id !== idFalla));
  };

  const handleToggleConfirmada = (idFalla: string) => {
    setFallasLocales((prev) =>
      prev.map((f) =>
        f.id === idFalla ? { ...f, confirmada: !f.confirmada } : f
      )
    );
  };

  const handleAgregarPreDefinida = (descripcion: string) => {
    const nueva: FallaDiagnostico = {
      id: generarIdFalla(`falla-${componente.id}`),
      componente: componente.nombre,
      descripcion,
      icono: componente.icono,
      confirmada: true,
    };
    setFallasLocales((prev) => [...prev, nueva]);
  };

  const handleAgregarPersonalizada = () => {
    const texto = textoPersonalizada.trim();
    if (!texto) return;

    const nueva: FallaDiagnostico = {
      id: generarIdFalla(`falla-custom-${componente.id}`),
      componente: componente.nombre,
      descripcion: texto,
      icono: componente.icono,
      confirmada: false,
    };
    setFallasLocales((prev) => [...prev, nueva]);
    setTextoPersonalizada('');
  };

  const handleAplicar = () => {
    onAplicar(componente.id, fallasLocales);
    onClose();
  };

  // Descripciones ya activas para deshabilitarlas en la lista de predefinidas
  const descripcionesActivas = new Set(
    fallasLocales.map((f) => f.descripcion.toLowerCase())
  );

  return (
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
          {/* Barra de arrastre */}
          <View style={styles.dragBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconBox}>
              <Ionicons
                name={componente.icono}
                size={22}
                color={Colors.primary}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                Fallas de {componente.nombre}
              </Text>
              <Text style={styles.headerSubtitle}>
                Agregá o quitá fallas de este componente.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Fallas actuales de este componente ─── */}
            {fallasLocales.length > 0 && (
              <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>
                  Fallas actuales ({fallasLocales.length})
                </Text>
                <View style={styles.fallasActualesList}>
                  {fallasLocales.map((falla) => (
                    <View key={falla.id} style={styles.fallaItemCard}>
                      <View style={styles.fallaItemInfo}>
                        <Text style={styles.fallaDescripcion}>
                          {falla.descripcion}
                        </Text>
                        <TouchableOpacity
                          style={styles.confirmadaToggle}
                          onPress={() => handleToggleConfirmada(falla.id)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.confirmadaBadge,
                              {
                                backgroundColor: falla.confirmada
                                  ? '#E5F7EE'
                                  : '#FFF4D8',
                              },
                            ]}
                          >
                            <Ionicons
                              name={
                                falla.confirmada
                                  ? 'checkmark-circle'
                                  : 'help-circle'
                              }
                              size={12}
                              color={
                                falla.confirmada ? '#237653' : '#946315'
                              }
                              style={{ marginRight: 3 }}
                            />
                            <Text
                              style={[
                                styles.confirmadaText,
                                {
                                  color: falla.confirmada
                                    ? '#237653'
                                    : '#946315',
                                },
                              ]}
                            >
                              {falla.confirmada ? 'Confirmada' : 'A verificar'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleEliminarFalla(falla.id)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ─── Agregar falla predefinida ─── */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Agregar falla</Text>
              <View style={styles.chipsContainer}>
                {componente.fallasPreDefinidas.map((desc) => {
                  const yaExiste = descripcionesActivas.has(
                    desc.toLowerCase()
                  );
                  return (
                    <TouchableOpacity
                      key={desc}
                      style={[
                        styles.chipItem,
                        yaExiste && styles.chipItemDisabled,
                      ]}
                      onPress={() => {
                        if (!yaExiste) handleAgregarPreDefinida(desc);
                      }}
                      activeOpacity={yaExiste ? 1 : 0.7}
                    >
                      <Ionicons
                        name={yaExiste ? 'checkmark' : 'add'}
                        size={14}
                        color={yaExiste ? '#94A3B8' : Colors.primary}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          yaExiste && styles.chipTextDisabled,
                        ]}
                      >
                        {desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ─── Falla personalizada ─── */}
            <View style={styles.seccion}>
              <Text style={styles.seccionTitulo}>Falla personalizada</Text>
              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  value={textoPersonalizada}
                  onChangeText={setTextoPersonalizada}
                  placeholder="Ej: Vidrio frontal fisurado..."
                  placeholderTextColor="#9BB2C9"
                />
                <TouchableOpacity
                  style={[
                    styles.addCustomBtn,
                    !textoPersonalizada.trim() &&
                      styles.addCustomBtnDisabled,
                  ]}
                  onPress={handleAgregarPersonalizada}
                  activeOpacity={0.85}
                  disabled={!textoPersonalizada.trim()}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* ─── Botón Aplicar ─── */}
          <TouchableOpacity
            style={styles.aplicarButton}
            onPress={handleAplicar}
            activeOpacity={0.88}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.aplicarText}>Aplicar</Text>
          </TouchableOpacity>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
};

interface Props {
  visible: boolean;
  componenteId: string | null;
  fallasActuales: FallaDiagnostico[];
  onClose: () => void;
  onAplicar: (componenteId: string, fallasComponente: FallaDiagnostico[]) => void;
}

export const EditarFallasComponenteSheet = ({
  visible,
  componenteId,
  fallasActuales,
  onClose,
  onAplicar,
}: Props) => {
  const componente = COMPONENTES_DIAGNOSTICO.find((c) => c.id === componenteId);

  return (
    <Modal
      visible={visible && Boolean(componente)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {componente && (
        <EditarFallasComponenteContent
          key={componente.id}
          componente={componente}
          fallasIniciales={fallasActuales.filter(
            (f) => obtenerComponenteIdDeFalla(f.componente) === componente.id
          )}
          onClose={onClose}
          onAplicar={onAplicar}
        />
      )}
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
    maxHeight: '80%',
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
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#10264C',
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    marginBottom: 14,
    maxHeight: 380,
  },
  seccion: {
    marginBottom: 16,
  },
  seccionTitulo: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 8,
  },
  fallasActualesList: {
    gap: 8,
  },
  fallaItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fallaItemInfo: {
    flex: 1,
  },
  fallaDescripcion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10264C',
    marginBottom: 4,
  },
  confirmadaToggle: {
    alignSelf: 'flex-start',
  },
  confirmadaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  confirmadaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF7FC',
    borderWidth: 1,
    borderColor: '#C2DFF2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipItemDisabled: {
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E8EF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  chipTextDisabled: {
    color: '#94A3B8',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#10264C',
  },
  addCustomBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCustomBtnDisabled: {
    backgroundColor: '#B8CEE0',
  },
  aplicarButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aplicarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
