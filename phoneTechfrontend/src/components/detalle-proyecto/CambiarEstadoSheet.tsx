import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { EstadoProyecto } from '@/types/proyecto';

interface Props {
  visible: boolean;
  estadoActual: EstadoProyecto;
  onClose: () => void;
  onGuardar: (nuevoEstado: EstadoProyecto) => void;
}

interface EstadoOption {
  key: EstadoProyecto;
  titulo: string;
  subtitulo: string;
  colorDot: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
  checkColor: string;
}

const OPCIONES_ESTADO: EstadoOption[] = [
  {
    key: 'evaluacion',
    titulo: 'En evaluación',
    subtitulo: 'Aún no se compró el teléfono.',
    colorDot: '#8B5CF6',
    selectedBg: '#F5F3FF',
    selectedBorder: '#DDD6FE',
    selectedText: '#6D55A1',
    checkColor: '#8B5CF6',
  },
  {
    key: 'reparacion',
    titulo: 'En reparación',
    subtitulo: 'Ya se compró y está en arreglo.',
    colorDot: '#F59E0B',
    selectedBg: '#FFFBEB',
    selectedBorder: '#FDE68A',
    selectedText: '#946315',
    checkColor: '#378CC4',
  },
  {
    key: 'venta',
    titulo: 'En venta',
    subtitulo: 'Publicado en redes o marketplace.',
    colorDot: '#378CC4',
    selectedBg: '#EFF7FC',
    selectedBorder: '#BAE6FD',
    selectedText: '#246B96',
    checkColor: '#378CC4',
  },
  {
    key: 'vendido',
    titulo: 'Vendido',
    subtitulo: 'Operación finalizada.',
    colorDot: '#10B981',
    selectedBg: '#ECFDF5',
    selectedBorder: '#A7F3D0',
    selectedText: '#237653',
    checkColor: '#10B981',
  },
];

export const CambiarEstadoSheet = ({
  visible,
  estadoActual,
  onClose,
  onGuardar,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [seleccionado, setSeleccionado] = useState<EstadoProyecto>(estadoActual);

  useEffect(() => {
    if (visible) {
      setSeleccionado(estadoActual);
    }
  }, [visible, estadoActual]);

  const handleGuardar = () => {
    onGuardar(seleccionado);
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
          <Text style={styles.title}>Cambiar estado del proyecto</Text>
          <Text style={styles.subtitle}>
            Seleccioná el nuevo estado para este celular.
          </Text>

          {/* Lista de estados */}
          <View style={styles.optionsList}>
            {OPCIONES_ESTADO.map((item) => {
              const isSelected = seleccionado === item.key;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.card,
                    isSelected && {
                      backgroundColor: item.selectedBg,
                      borderColor: item.selectedBorder,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => setSeleccionado(item.key)}
                  activeOpacity={0.7}
                >
                  {/* Punto de color */}
                  <View
                    style={[styles.dot, { backgroundColor: item.colorDot }]}
                  />

                  {/* Textos */}
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.cardTitle,
                        isSelected && { color: item.selectedText },
                      ]}
                    >
                      {item.titulo}
                    </Text>
                    <Text
                      style={[
                        styles.cardSubtitle,
                        isSelected && { color: item.selectedText, opacity: 0.85 },
                      ]}
                    >
                      {item.subtitulo}
                    </Text>
                  </View>

                  {/* Icono a la derecha: Checkmark si seleccionado, chevron si no */}
                  {isSelected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={item.checkColor}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#9BB2C9"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            style={styles.guardarButton}
            onPress={handleGuardar}
            activeOpacity={0.88}
          >
            <Text style={styles.guardarText}>Guardar</Text>
          </TouchableOpacity>
        </Pressable>
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
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
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
  optionsList: {
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
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
