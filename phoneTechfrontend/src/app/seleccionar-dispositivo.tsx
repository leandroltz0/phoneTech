import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { UnlockToolSupportBadge } from '@/components/dispositivos/UnlockToolSupportBadge';
import { mensajeDeError } from '@/services/api';
import { obtenerDispositivos, urlImagenDispositivo } from '@/services/devices';
import type { DeviceSummaryDto } from '@/types/api';
import { resolverImagenProyecto } from '@/utils/images';

export default function SeleccionarDispositivoScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [dispositivos, setDispositivos] = useState<DeviceSummaryDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<number | null>(null);

  const cargarCatalogo = useCallback(async (query: string) => {
    setCargando(true);
    try {
      const data = await obtenerDispositivos({ query, size: 50 });
      setDispositivos(data.items);
      setError(null);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void cargarCatalogo(busqueda);
    }, 250);
    return () => clearTimeout(timer);
  }, [busqueda, cargarCatalogo]);

  const renderDevice: ListRenderItem<DeviceSummaryDto> = ({ item }) => {
    const selected = dispositivoSeleccionado === item.id;
    const urlAbsoluta = urlImagenDispositivo(item.imageUri);
    const localFallback = resolverImagenProyecto(item.commercialName);
    const fuenteImagen = urlAbsoluta ? { uri: urlAbsoluta } : localFallback;

    return (
      <TouchableOpacity
        accessibilityLabel={`${item.brand} ${item.commercialName}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        activeOpacity={0.82}
        onPress={() => setDispositivoSeleccionado(item.id)}
        style={[styles.deviceCard, selected && styles.deviceCardSelected]}
      >
        <View style={styles.previewArea}>
          {fuenteImagen ? (
            <Image
              source={fuenteImagen}
              style={styles.deviceImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.phonePlaceholder}>
              <Ionicons name="phone-portrait-outline" size={40} color="#94A3B8" />
            </View>
          )}
        </View>

        <View style={styles.deviceInfo}>
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.model} numberOfLines={1}>
            {item.commercialName}
          </Text>
          <UnlockToolSupportBadge status={item.unlockToolStatus} />
        </View>
      </TouchableOpacity>
    );
  };

  const selectedDevice = dispositivos.find((item) => item.id === dispositivoSeleccionado);

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
        {dispositivos.length} {dispositivos.length === 1 ? 'dispositivo disponible' : 'dispositivos disponibles'}
      </Text>

      {cargando && dispositivos.length === 0 ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={Colors.proyectoNuevo.action} />
          <Text style={styles.stateText}>Cargando dispositivos...</Text>
        </View>
      ) : error && dispositivos.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Ionicons name="cloud-offline-outline" size={40} color={Colors.proyectoNuevo.muted} />
          <Text style={styles.stateTitle}>Error al cargar dispositivos</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void cargarCatalogo(busqueda)}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : dispositivos.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Ionicons name="search-outline" size={38} color={Colors.proyectoNuevo.muted} />
          <Text style={styles.stateTitle}>Sin resultados</Text>
          <Text style={styles.stateSubtitle}>{`No encontramos dispositivos para "${busqueda}"`}</Text>
        </View>
      ) : (
        <FlatList
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          data={dispositivos}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={renderDevice}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.selectionFooter}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedDevice }}
          activeOpacity={selectedDevice ? 0.85 : 1}
          disabled={!selectedDevice}
          onPress={() => {
            if (selectedDevice) {
              router.push({
                pathname: '/seleccionar-telefono',
                params: {
                  dispositivoId: String(selectedDevice.id),
                  marca: selectedDevice.brand,
                  modelo: selectedDevice.commercialName,
                  imageUri: selectedDevice.imageUri ?? '',
                  unlockToolStatus: selectedDevice.unlockToolStatus,
                },
              });
            }
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
    color: '#7C8B9E',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 18,
    marginTop: 16,
    marginBottom: 4,
  },
  gridContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  deviceCard: {
    backgroundColor: Colors.surface,
    borderColor: 'transparent',
    borderRadius: 24,
    borderWidth: 2,
    flex: 1,
    height: 246,
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 15,
    paddingTop: 16,
    shadowColor: '#10264C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  deviceCardSelected: {
    borderColor: Colors.proyectoNuevo.action,
    shadowOpacity: 0.12,
  },
  previewArea: {
    alignItems: 'center',
    height: 122,
    justifyContent: 'center',
    width: '100%',
  },
  deviceImage: {
    height: '100%',
    width: '100%',
  },
  phonePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    borderRadius: 16,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  deviceInfo: {
    width: '100%',
  },
  brand: {
    color: '#7C8B9E',
    fontSize: 12.5,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 16,
    marginBottom: 2,
  },
  model: {
    color: '#0B1A2C',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 10,
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
  centeredContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateText: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 13,
    marginTop: 12,
  },
  stateTitle: {
    color: Colors.proyectoNuevo.title,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  stateSubtitle: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.proyectoNuevo.action,
    borderRadius: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
});
