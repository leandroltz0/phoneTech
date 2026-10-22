import React, { useState, useCallback, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import {
  obtenerProyectoPorIdMock,
  obtenerProyectosMock,
  suscribirProyectosMock,
  actualizarEstadoProyectoMock,
} from '@/data/proyectosMock';
import { EstadoProyecto } from '@/types/proyecto';
import { DetalleIdentificacion } from '@/components/detalle-proyecto/DetalleIdentificacion';
import { DetalleResumenEconomico } from '@/components/detalle-proyecto/DetalleResumenEconomico';
import { DetalleDiagnostico } from '@/components/detalle-proyecto/DetalleDiagnostico';
import { DetalleGastos } from '@/components/detalle-proyecto/DetalleGastos';
import { DetalleMovimientos } from '@/components/detalle-proyecto/DetalleMovimientos';
import { OpcionesProyectoSheet } from '@/components/detalle-proyecto/OpcionesProyectoSheet';
import { CambiarEstadoSheet } from '@/components/detalle-proyecto/CambiarEstadoSheet';

const accionPorEstado: Record<
  EstadoProyecto,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  evaluacion: { label: 'Registrar compra', icon: 'cart-outline' },
  reparacion: { label: 'Registrar venta', icon: 'pricetag-outline' },
  venta: { label: 'Registrar venta', icon: 'pricetag-outline' },
  vendido: { label: 'Ver historial completo', icon: 'time-outline' },
};

export default function DetalleProyectoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [cambiarEstadoVisible, setCambiarEstadoVisible] = useState(false);

  // Sincronización reactiva con los proyectos mock
  const proyectos = useSyncExternalStore(
    suscribirProyectosMock,
    obtenerProyectosMock,
    obtenerProyectosMock
  );

  const proyecto =
    (id ? proyectos.find((p) => p.id === id) : undefined) ?? proyectos[0];

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/proyectos');
    }
  }, [router]);

  const handleGuardarEstado = useCallback(
    (nuevoEstado: EstadoProyecto) => {
      if (!proyecto) return;
      actualizarEstadoProyectoMock(proyecto.id, nuevoEstado);
    },
    [proyecto]
  );

  const handleSelectOption = useCallback((optionId: string) => {
    setSheetVisible(false);

    switch (optionId) {
      case 'editar-datos':
        Alert.alert('Editar datos', `Editar datos de ${proyecto?.modelo}.`);
        break;
      case 'editar-diagnostico':
        Alert.alert('Editar diagnóstico', `Modificar fallas de ${proyecto?.modelo}.`);
        break;
      case 'modificar-precios':
        router.push({
          pathname: '/modificar-precios',
          params: { id: proyecto?.id },
        });
        break;
      case 'cambiar-estado':
        setCambiarEstadoVisible(true);
        break;
      case 'archivar-proyecto':
        Alert.alert(
          'Archivar proyecto',
          '¿Deseas archivar este proyecto? Dejará de aparecer en la lista activa.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Archivar', onPress: () => router.back() },
          ]
        );
        break;
      case 'eliminar-proyecto':
        Alert.alert(
          'Eliminar proyecto',
          '¿Estás seguro de que deseas eliminar permanentemente este proyecto? Esta acción no se puede deshacer.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Eliminar',
              style: 'destructive',
              onPress: () => router.back(),
            },
          ]
        );
        break;
      default:
        break;
    }
  }, [proyecto, router]);

  const handleAccionPrincipal = useCallback(() => {
    if (!proyecto) return;
    const accion = accionPorEstado[proyecto.estado];
    Alert.alert(
      accion.label,
      `Formulario para "${accion.label}" en desarrollo para ${proyecto.modelo}.`
    );
  }, [proyecto]);

  if (!proyecto) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del proyecto</Text>
          <View style={styles.headerBtn} />
        </View>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.notFoundText}>No se encontró el proyecto seleccionado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accion = accionPorEstado[proyecto.estado];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ─── Encabezado ─── */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalle del proyecto</Text>

        <TouchableOpacity
          onPress={() => setSheetVisible(true)}
          style={styles.headerBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ─── Contenido con scroll ─── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 95 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DetalleIdentificacion proyecto={proyecto} />
        <DetalleResumenEconomico proyecto={proyecto} />
        <DetalleDiagnostico proyecto={proyecto} />
        <DetalleGastos proyecto={proyecto} />
        <DetalleMovimientos proyecto={proyecto} />
      </ScrollView>

      {/* ─── Botón inferior de acción principal ─── */}
      <View
        style={[
          styles.actionWrapper,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAccionPrincipal}
          activeOpacity={0.88}
        >
          <Ionicons
            name={accion.icon}
            size={20}
            color="#FFFFFF"
            style={styles.actionIcon}
          />
          <Text style={styles.actionButtonText}>{accion.label}</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Slider Bottom Sheet con Opciones del Proyecto ─── */}
      <OpcionesProyectoSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelectOption={handleSelectOption}
      />

      {/* ─── Slider Bottom Sheet para Cambiar Estado ─── */}
      {proyecto && (
        <CambiarEstadoSheet
          visible={cambiarEstadoVisible}
          estadoActual={proyecto.estado}
          onClose={() => setCambiarEstadoVisible(false)}
          onGuardar={handleGuardarEstado}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actionWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(245, 249, 252, 0.95)',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E4EDF3',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
