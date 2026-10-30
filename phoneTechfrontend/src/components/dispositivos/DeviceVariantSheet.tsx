import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { SelectionSheet } from '@/components/dispositivos/SelectionSheet';
import type { UnlockToolSupportStatusDto } from '@/types/api';

export type VarianteDispositivoMock = {
  id: string;
  codigo: string;
  ram: string;
  almacenamiento: string;
  precio: number | null;
  comun?: boolean;
  imagenUri?: string | null;
  unlockToolStatus?: UnlockToolSupportStatusDto;
  nombreVariante?: string | null;
};

type DeviceVariantSheetProps = {
  cargando?: boolean;
  error?: string | null;
  visible: boolean;
  variantes: VarianteDispositivoMock[];
  varianteSeleccionadaId: string;
  onClose: () => void;
  onConfirm: (varianteId: string) => void;
};

export function DeviceVariantSheet({
  cargando = false,
  error = null,
  visible,
  variantes,
  varianteSeleccionadaId,
  onClose,
  onConfirm,
}: DeviceVariantSheetProps) {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionTemporal, setSeleccionTemporal] = useState(varianteSeleccionadaId);
  const [imagenesFallidas, setImagenesFallidas] = useState<Record<string, boolean>>({});

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
    <SelectionSheet
      closeLabel="Cerrar selector de variante"
      description="Elegí la versión exacta de este modelo para ver la compatibilidad de los repuestos."
      footer={(
        <>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.84}
            onPress={confirmSelection}
            disabled={cargando || !seleccionTemporal}
            style={[styles.continueButton, (cargando || !seleccionTemporal) && styles.continueButtonDisabled]}
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
        </>
      )}
      onClose={closeSheet}
      title="Seleccionar variante"
      visible={visible}
    >
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

          {cargando ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator color="#0879D9" size="large" />
              <Text style={styles.emptyText}>Cargando variantes...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <Text style={styles.emptyText}>{error}</Text>
            </View>
          ) : (
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
                  <View style={styles.phonePreview}>
                    {variante.imagenUri && !imagenesFallidas[variante.imagenUri] ? (
                      <Image
                        onError={() => setImagenesFallidas((current) => ({
                          ...current,
                          [variante.imagenUri as string]: true,
                        }))}
                        source={{ uri: variante.imagenUri }}
                        style={styles.variantImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={25} color="#94A3B8" />
                      </View>
                    )}
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionCode}>{variante.nombreVariante ?? variante.codigo}</Text>
                    <Text style={styles.optionSpecs}>
                      {variante.codigo} · {variante.ram} · {variante.almacenamiento}
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
          )}

    </SelectionSheet>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    backgroundColor: '#F3F7FA',
    borderColor: '#DCE7EF',
    borderRadius: 10,
    borderWidth: 1,
    height: 70,
    marginRight: 14,
    overflow: 'hidden',
    width: 70,
  },
  variantImage: { height: '100%', width: '100%' },
  imagePlaceholder: { alignItems: 'center', flex: 1, justifyContent: 'center', width: '100%' },
  optionCopy: { flex: 1 },
  optionCode: { color: Colors.analisis.title, fontSize: 18, fontWeight: '800', letterSpacing: -0.55 },
  optionSpecs: { color: '#586F9D', fontSize: 13.5, fontWeight: '500', marginTop: 2 },
  commonBadge: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#D8EEFF', borderRadius: 13, flexDirection: 'row', gap: 4, marginTop: 7, paddingHorizontal: 9, paddingVertical: 4 },
  commonText: { color: '#0879D9', fontSize: 10.5, fontWeight: '800' },
  emptyText: { color: Colors.textSecondary, fontSize: 14, paddingVertical: 24, textAlign: 'center' },
  stateContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 150, paddingHorizontal: 20 },
  continueButton: { alignItems: 'center', backgroundColor: '#D9F1FF', borderRadius: 27, flexDirection: 'row', gap: 9, height: 55, justifyContent: 'center', marginTop: 2 },
  continueButtonDisabled: { opacity: 0.55 },
  continueText: { color: '#0879D9', fontSize: 17, fontWeight: '700' },
  hintRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, paddingHorizontal: 15, paddingTop: 15 },
  hintText: { color: '#526B9C', flex: 1, fontSize: 11.5, lineHeight: 15 },
});
