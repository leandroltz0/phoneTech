import React from 'react';
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

export interface OpcionProyectoItem {
  id: string;
  titulo: string;
  subtitulo: string;
  icono: keyof typeof Ionicons.glyphMap;
  esDestructiva?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (id: string) => void;
}

const OPCIONES: OpcionProyectoItem[] = [
  {
    id: 'editar-datos',
    titulo: 'Editar datos del proyecto',
    subtitulo: 'Modelo, variante, precios, notas.',
    icono: 'create-outline',
  },
  {
    id: 'editar-diagnostico',
    titulo: 'Editar diagnóstico',
    subtitulo: 'Modificar o agregar fallas.',
    icono: 'color-wand-outline',
  },
  {
    id: 'modificar-precios',
    titulo: 'Modificar precios',
    subtitulo: 'Compra, venta, ganancia estimada.',
    icono: 'speedometer-outline',
  },
  {
    id: 'cambiar-estado',
    titulo: 'Cambiar estado del proyecto',
    subtitulo: 'En evaluación, reparación, venta o vendido.',
    icono: 'swap-horizontal-outline',
  },
  {
    id: 'archivar-proyecto',
    titulo: 'Archivar proyecto',
    subtitulo: 'Guardar sin que aparezca en la lista.',
    icono: 'archive-outline',
  },
  {
    id: 'eliminar-proyecto',
    titulo: 'Eliminar proyecto',
    subtitulo: 'Eliminar permanentemente.',
    icono: 'trash-outline',
    esDestructiva: true,
  },
];

export const OpcionesProyectoSheet = ({
  visible,
  onClose,
  onSelectOption,
}: Props) => {
  const insets = useSafeAreaInsets();

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
          {/* Título del slider */}
          <Text style={styles.sheetTitle}>Opciones del proyecto</Text>

          {/* Lista de opciones en tarjetas individuales */}
          <View style={styles.opcionesLista}>
            {OPCIONES.map((opcion) => {
              const isDestructive = opcion.esDestructiva;

              return (
                <TouchableOpacity
                  key={opcion.id}
                  style={styles.cardItem}
                  onPress={() => onSelectOption(opcion.id)}
                  activeOpacity={0.7}
                >
                  {/* Contenedor circular del icono */}
                  <View
                    style={[
                      styles.iconCircle,
                      isDestructive
                        ? styles.iconCircleDestructive
                        : styles.iconCircleNormal,
                    ]}
                  >
                    <Ionicons
                      name={opcion.icono}
                      size={20}
                      color={isDestructive ? '#EF4444' : Colors.primary}
                    />
                  </View>

                  {/* Textos: título y subtítulo */}
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.opcionTitulo,
                        isDestructive && styles.opcionTituloDestructive,
                      ]}
                    >
                      {opcion.titulo}
                    </Text>
                    <Text style={styles.opcionSubtitulo}>
                      {opcion.subtitulo}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón Cancelar */}
          <TouchableOpacity
            style={styles.cancelarButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelarText}>Cancelar</Text>
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
    paddingHorizontal: 16,
    paddingTop: 24,
    shadowColor: '#071B49',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  opcionesLista: {
    gap: 8,
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleNormal: {
    backgroundColor: '#EFF7FC',
  },
  iconCircleDestructive: {
    backgroundColor: '#FEECEC',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  opcionTitulo: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 2,
  },
  opcionTituloDestructive: {
    color: '#EF4444',
  },
  opcionSubtitulo: {
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  cancelarButton: {
    backgroundColor: '#EFF7FC',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelarText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});
