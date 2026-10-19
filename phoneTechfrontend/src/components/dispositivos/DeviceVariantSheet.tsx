import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export type VarianteDispositivoMock = {
  id: string;
  codigo: string;
  ram: string;
  almacenamiento: string;
  precio: number;
  comun?: boolean;
};

type DeviceVariantSheetProps = {
  visible: boolean;
  variantes: VarianteDispositivoMock[];
  varianteSeleccionadaId: string;
  onClose: () => void;
  onConfirm: (varianteId: string) => void;
};

export function DeviceVariantSheet({
  visible,
  variantes,
  varianteSeleccionadaId,
  onClose,
  onConfirm,
}: DeviceVariantSheetProps) {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionTemporal, setSeleccionTemporal] = useState(varianteSeleccionadaId);

  const variantesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return variantes;

    return variantes.filter((variante) =>
      `${variante.codigo} ${variante.ram} ${variante.almacenamiento}`
        .toLowerCase()
        .includes(termino),
    );
  }, [busqueda, variantes]);

  const closeSheet = () => {
    setBusqueda('');
    onClose();
  };

  const confirmSelection = () => {
    onConfirm(seleccionTemporal);
    setBusqueda('');
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={closeSheet}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        <TouchableOpacity
          accessibilityLabel="Cerrar selector de variante"
          accessibilityRole="button"
          activeOpacity={1}
          onPress={closeSheet}
          style={styles.backdrop}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Seleccionar variante</Text>
          <Text style={styles.description}>
            Elegí la versión exacta de este modelo para ver la compatibilidad de los repuestos.
          </Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={23} color="#7187B0" />
            <TextInput
              accessibilityLabel="Buscar variante por código de modelo"
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setBusqueda}
              placeholder="Buscar por código de modelo..."
              placeholderTextColor="#7187B0"
              style={styles.searchInput}
              value={busqueda}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.optionsContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {variantesFiltradas.map((variante) => {
              const isSelected = seleccionTemporal === variante.id;
              return (
                <TouchableOpacity
                  key={variante.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  activeOpacity={0.82}
                  onPress={() => setSeleccionTemporal(variante.id)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <View style={[styles.phonePreview, variante.id.includes('f') && styles.phonePreviewBlue, variante.id.includes('g') && styles.phonePreviewRed]}>
                    <View style={styles.cameraDot} />
                    <View style={[styles.cameraDot, styles.lowerCameraDot]} />
                    <View style={styles.phoneScreen} />
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionCode}>{variante.codigo}</Text>
                    <Text style={styles.optionSpecs}>
                      {variante.ram} · {variante.almacenamiento}
                    </Text>
                    {variante.comun && (
                      <View style={styles.commonBadge}>
                        <Ionicons name="checkmark-circle" size={15} color="#0879D9" />
                        <Text style={styles.commonText}>Más común</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    color={isSelected ? '#0879D9' : '#7187B0'}
                    size={31}
                  />
                </TouchableOpacity>
              );
            })}
            {variantesFiltradas.length === 0 && (
              <Text style={styles.emptyText}>No encontramos una variante con ese código.</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.84}
            onPress={confirmSelection}
            style={styles.continueButton}
          >
            <Ionicons name="play-forward" size={21} color="#0879D9" />
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.hintRow}>
            <Ionicons name="information-circle" color="#526B9C" size={24} />
            <Text style={styles.hintText}>
              Si no conocés la variante exacta, podés continuar. La compatibilidad de los repuestos se verificará después.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 20, 52, 0.52)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    maxHeight: '78%',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  handle: { alignSelf: 'center', backgroundColor: '#9BAAC9', borderRadius: 4, height: 5, marginBottom: 22, width: 59 },
  title: { color: Colors.analisis.title, fontSize: 25, fontWeight: '800', letterSpacing: -0.8 },
  description: { color: '#566C9B', fontSize: 15, lineHeight: 20, marginTop: 4 },
  searchBox: {
    alignItems: 'center',
    borderColor: '#CDDCF5',
    borderRadius: 22,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 57,
    marginTop: 14,
    paddingHorizontal: 17,
  },
  searchInput: { color: Colors.analisis.title, flex: 1, fontSize: 15.5, height: '100%', marginLeft: 14, padding: 0 },
  optionsContent: { gap: 9, paddingVertical: 11 },
  option: {
    alignItems: 'center',
    borderColor: '#D5E1F6',
    borderRadius: 23,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 91,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  optionSelected: { backgroundColor: '#F4FAFF', borderColor: '#1397F6', borderWidth: 2 },
  phonePreview: {
    backgroundColor: '#273039',
    borderColor: '#101B2B',
    borderRadius: 7,
    borderWidth: 2,
    height: 66,
    marginRight: 14,
    overflow: 'hidden',
    position: 'relative',
    width: 48,
  },
  phonePreviewBlue: { backgroundColor: '#1A569D' },
  phonePreviewRed: { backgroundColor: '#A61932' },
  cameraDot: { backgroundColor: '#050C17', borderColor: '#536071', borderRadius: 5, borderWidth: 1, height: 10, left: 5, position: 'absolute', top: 7, width: 10 },
  lowerCameraDot: { top: 21 },
  phoneScreen: { backgroundColor: '#7EB4FE', borderTopLeftRadius: 4, bottom: 3, position: 'absolute', right: 3, top: 3, width: 22 },
  optionCopy: { flex: 1 },
  optionCode: { color: Colors.analisis.title, fontSize: 18, fontWeight: '800', letterSpacing: -0.55 },
  optionSpecs: { color: '#586F9D', fontSize: 13.5, fontWeight: '500', marginTop: 2 },
  commonBadge: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#D8EEFF', borderRadius: 13, flexDirection: 'row', gap: 4, marginTop: 7, paddingHorizontal: 9, paddingVertical: 4 },
  commonText: { color: '#0879D9', fontSize: 10.5, fontWeight: '800' },
  emptyText: { color: Colors.textSecondary, fontSize: 14, paddingVertical: 24, textAlign: 'center' },
  continueButton: { alignItems: 'center', backgroundColor: '#D9F1FF', borderRadius: 27, flexDirection: 'row', gap: 9, height: 55, justifyContent: 'center', marginTop: 2 },
  continueText: { color: '#0879D9', fontSize: 17, fontWeight: '700' },
  hintRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, paddingHorizontal: 15, paddingTop: 15 },
  hintText: { color: '#526B9C', flex: 1, fontSize: 11.5, lineHeight: 15 },
});
