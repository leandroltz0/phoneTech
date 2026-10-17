import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { dispositivosMock, DispositivoMock } from '@/data/dispositivosMock';

function PhonePreview({ dispositivo }: { dispositivo: DispositivoMock }) {
  return (
    <View
      style={[
        styles.phonePreview,
        { backgroundColor: dispositivo.color, borderColor: dispositivo.colorOscuro },
      ]}
    >
      <View style={[styles.phoneSpeaker, { backgroundColor: dispositivo.colorOscuro }]} />
      <View style={[styles.cameraRing, { borderColor: dispositivo.colorOscuro }]}>
        <View style={[styles.cameraLens, { backgroundColor: dispositivo.colorOscuro }]} />
      </View>
      <View style={[styles.cameraLens, styles.lowerLens, { backgroundColor: dispositivo.colorOscuro }]} />
    </View>
  );
}

export default function SeleccionarDispositivoScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<string | null>(null);

  const dispositivosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return dispositivosMock;
    }

    return dispositivosMock.filter(({ marca, modelo }) =>
      `${marca} ${modelo}`.toLowerCase().includes(termino),
    );
  }, [busqueda]);

  const renderDevice: ListRenderItem<DispositivoMock> = ({ item }) => {
    const selected = dispositivoSeleccionado === item.id;

    return (
      <TouchableOpacity
        accessibilityLabel={`${item.marca} ${item.modelo}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        activeOpacity={0.8}
        onPress={() => setDispositivoSeleccionado(item.id)}
        style={[styles.deviceCard, selected && styles.deviceCardSelected]}
      >
        <View style={styles.previewArea}>
          <PhonePreview dispositivo={item} />
        </View>
        <Text style={styles.brand}>{item.marca}</Text>
        <Text style={styles.model}>{item.modelo}</Text>
      </TouchableOpacity>
    );
  };

  const selectedDevice = dispositivosMock.find((item) => item.id === dispositivoSeleccionado);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Volver a nuevo proyecto"
          accessibilityRole="button"
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={21} color={Colors.proyectoNuevo.title} />
        </TouchableOpacity>
        <Text style={styles.title}>Seleccionar dispositivo</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={17} color={Colors.proyectoNuevo.muted} />
        <TextInput
          accessibilityLabel="Buscar marca o modelo"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setBusqueda}
          placeholder="Buscar marca o modelo..."
          placeholderTextColor={Colors.proyectoNuevo.muted}
          style={styles.searchInput}
          value={busqueda}
        />
      </View>

      <Text style={styles.availableCount}>
        {dispositivosFiltrados.length} dispositivos disponibles
      </Text>

      <FlatList
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        data={dispositivosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderDevice}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.selectionFooter}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedDevice }}
          activeOpacity={selectedDevice ? 0.85 : 1}
          disabled={!selectedDevice}
          onPress={() => {
            // El modelo seleccionado se usará para comenzar el diagnóstico en el siguiente paso.
          }}
          style={[styles.useButton, selectedDevice && styles.useButtonEnabled]}
        >
          <Text style={[styles.useButtonText, selectedDevice && styles.useButtonTextEnabled]}>
            Usar este dispositivo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.proyectoNuevo.background,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    shadowColor: Colors.proyectoNuevo.title,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 9,
    width: 40,
  },
  title: {
    color: Colors.proyectoNuevo.title,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.7,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    flexDirection: 'row',
    height: 44,
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: Colors.proyectoNuevo.title,
    flex: 1,
    fontSize: 13,
    height: '100%',
    marginLeft: 10,
    padding: 0,
  },
  availableCount: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 11,
    marginLeft: 20,
    marginTop: 15,
  },
  gridContent: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 11,
  },
  gridRow: {
    gap: 10,
    marginBottom: 10,
  },
  deviceCard: {
    backgroundColor: Colors.surface,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    flex: 1,
    height: 182,
    overflow: 'hidden',
    paddingBottom: 17,
    paddingHorizontal: 13,
  },
  deviceCardSelected: {
    borderColor: Colors.proyectoNuevo.action,
  },
  previewArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  phonePreview: {
    borderRadius: 12,
    borderWidth: 4,
    height: 95,
    position: 'relative',
    shadowColor: Colors.proyectoNuevo.title,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    width: 60,
  },
  phoneSpeaker: {
    borderRadius: 4,
    height: 3,
    left: 19,
    opacity: 0.7,
    position: 'absolute',
    top: 6,
    width: 15,
  },
  cameraRing: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    height: 21,
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    top: 9,
    width: 21,
  },
  cameraLens: {
    borderRadius: 10,
    height: 11,
    width: 11,
  },
  lowerLens: {
    position: 'absolute',
    right: 8,
    top: 33,
  },
  brand: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 9,
    lineHeight: 12,
  },
  model: {
    color: Colors.proyectoNuevo.modelText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
  },
  selectionFooter: {
    backgroundColor: Colors.proyectoNuevo.background,
    borderTopColor: Colors.proyectoNuevo.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  useButton: {
    alignItems: 'center',
    backgroundColor: Colors.proyectoNuevo.buttonDisabled,
    borderRadius: 15,
    height: 49,
    justifyContent: 'center',
    marginBottom: 1,
  },
  useButtonEnabled: {
    backgroundColor: Colors.proyectoNuevo.action,
  },
  useButtonText: {
    color: Colors.proyectoNuevo.buttonDisabledText,
    fontSize: 13,
    fontWeight: '700',
  },
  useButtonTextEnabled: {
    color: Colors.surface,
  },
});
