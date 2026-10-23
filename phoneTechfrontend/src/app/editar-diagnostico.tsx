import React, { useState, useEffect, useCallback, useSyncExternalStore, useMemo } from 'react';
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
  obtenerProyectosMock,
  suscribirProyectosMock,
  actualizarDiagnosticoProyectoMock,
} from '@/data/proyectosMock';
import { FallaDiagnostico } from '@/types/proyecto';
import { EditorIdentificacion } from '@/components/editar-diagnostico/EditorIdentificacion';
import { ResumenFallasEditor } from '@/components/editar-diagnostico/ResumenFallasEditor';
import { ComponentesGrid } from '@/components/editar-diagnostico/ComponentesGrid';
import { EditarFallasComponenteSheet } from '@/components/editar-diagnostico/EditarFallasComponenteSheet';
import {
  obtenerComponenteIdDeFalla,
  getIconForComponente,
} from '@/constants/componentes';

export default function EditarDiagnosticoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Sincronización reactiva con datos mock
  const proyectos = useSyncExternalStore(
    suscribirProyectosMock,
    obtenerProyectosMock,
    obtenerProyectosMock
  );

  const proyecto =
    (id ? proyectos.find((p) => p.id === id) : undefined) ?? proyectos[0];

  // Inicializar fallas del proyecto
  const initialFallas: FallaDiagnostico[] = useMemo(() => {
    if (!proyecto) return [];
    if (proyecto.fallas && proyecto.fallas.length > 0) {
      return proyecto.fallas;
    }
    return (proyecto.diagnostico || []).map((d, index) => {
      const parts = d.split(' ');
      const comp = parts[0] ?? 'Componente';
      const desc = parts.slice(1).join(' ') || d;
      return {
        id: `gen-${index}`,
        componente: comp,
        descripcion: desc,
        icono: getIconForComponente(comp),
        confirmada: true,
      };
    });
  }, [proyecto]);

  const [fallas, setFallas] = useState<FallaDiagnostico[]>(initialFallas);

  useEffect(() => {
    setFallas(initialFallas);
  }, [initialFallas]);
  const [componenteSeleccionado, setComponenteSeleccionado] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Manejo de volver atrás
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/detalle-proyecto');
    }
  }, [router]);

  // Al tocar un componente en la grilla
  const handlePressComponente = useCallback((componenteId: string) => {
    setComponenteSeleccionado(componenteId);
    setSheetVisible(true);
  }, []);

  // Al tocar una falla en la lista de resumen
  const handlePressFalla = useCallback((falla: FallaDiagnostico) => {
    const compId = obtenerComponenteIdDeFalla(falla.componente);
    if (compId) {
      setComponenteSeleccionado(compId);
      setSheetVisible(true);
    }
  }, []);

  // Al aplicar cambios en el sheet de un componente
  const handleAplicarFallasComponente = useCallback(
    (componenteId: string, fallasComponente: FallaDiagnostico[]) => {
      setFallas((prev) => {
        // Quitar las fallas anteriores de este componente y agregar las nuevas
        const otrasFallas = prev.filter(
          (f) => obtenerComponenteIdDeFalla(f.componente) !== componenteId
        );
        return [...otrasFallas, ...fallasComponente];
      });
    },
    []
  );

  // Guardar cambios finales
  const handleGuardarCambios = useCallback(() => {
    if (!proyecto) return;

    actualizarDiagnosticoProyectoMock(proyecto.id, fallas);

    Alert.alert(
      'Diagnóstico actualizado',
      'Las fallas y componentes del diagnóstico fueron guardados con éxito.',
      [
        {
          text: 'Continuar',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace({
                pathname: '/detalle-proyecto',
                params: { id: proyecto.id },
              });
            }
          },
        },
      ]
    );
  }, [proyecto, fallas, router]);

  if (!proyecto) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Editar diagnóstico</Text>
          </View>
        </View>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.notFoundText}>No se encontró el proyecto seleccionado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ─── Encabezado ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.title}>Editar diagnóstico</Text>
          <Text style={styles.subtitle}>Modificá las fallas del dispositivo</Text>
        </View>
      </View>

      {/* ─── Contenido Scrolleable ─── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identificación del Dispositivo */}
        <EditorIdentificacion proyecto={proyecto} />

        {/* Resumen de fallas */}
        <ResumenFallasEditor
          fallas={fallas}
          onPressFalla={handlePressFalla}
        />

        {/* Grilla de componentes */}
        <ComponentesGrid
          fallas={fallas}
          onPressComponente={handlePressComponente}
        />
      </ScrollView>

      {/* ─── Botón Inferior: Guardar Cambios ─── */}
      <View
        style={[
          styles.actionWrapper,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGuardarCambios}
          activeOpacity={0.88}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color="#FFFFFF"
            style={styles.actionIcon}
          />
          <Text style={styles.actionButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Bottom Sheet para editar fallas de un componente ─── */}
      <EditarFallasComponenteSheet
        visible={sheetVisible}
        componenteId={componenteSeleccionado}
        fallasActuales={fallas}
        onClose={() => setSheetVisible(false)}
        onAplicar={handleAplicarFallasComponente}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2EDF5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10264C',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
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
    backgroundColor: 'rgba(245, 249, 252, 0.96)',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4EDF3',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 25,
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
