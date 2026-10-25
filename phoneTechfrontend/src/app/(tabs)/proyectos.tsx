import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useProyectos } from '@/hooks/useProyectos';
import { ProyectoCard } from '@/components/proyectos/ProyectoCard';
import { ProyectosSearch } from '@/components/proyectos/ProyectosSearch';
import { ProyectosFilters, FiltroProyecto } from '@/components/proyectos/ProyectosFilters';
import { Proyecto } from '@/types/proyecto';

export default function ProyectosScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroProyecto>('todos');
  const { proyectos, cargando, error, refrescar } = useProyectos();

  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter((p: Proyecto) => {
      const coincideBusqueda =
        busqueda.trim() === '' ||
        p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.numero).includes(busqueda);

      const coincideFiltro = filtro === 'todos' || p.estado === filtro;

      return coincideBusqueda && coincideFiltro;
    });
  }, [busqueda, filtro, proyectos]);

  const onRefresh = useCallback(() => {
    void refrescar();
  }, [refrescar]);

  const renderVacio = () => {
    if (cargando && proyectos.length === 0) {
      return <ActivityIndicator size="large" color={Colors.primary} style={styles.vacioSpinner} />;
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.reintentarBtn} onPress={onRefresh} activeOpacity={0.8}>
            <Text style={styles.reintentarText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay proyectos que coincidan.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <FlatList
        data={proyectosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProyectoCard
            proyecto={item}
            onPress={() =>
              router.push({
                pathname: '/detalle-proyecto',
                params: { id: item.id },
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={cargando && proyectos.length > 0}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Encabezado */}
            <View style={styles.header}>
              <View>
                <Text style={styles.titulo}>Proyectos</Text>
                <Text style={styles.subtitulo}>Tus compras y reparaciones</Text>
              </View>
              <View style={styles.contador}>
                <Text style={styles.contadorText}>
                  {proyectos.length} proyectos
                </Text>
              </View>
            </View>

            {/* Buscador */}
            <ProyectosSearch value={busqueda} onChangeText={setBusqueda} />

            {/* Filtros */}
            <ProyectosFilters filtroActivo={filtro} onFiltroChange={setFiltro} />

            <View style={styles.listSpacer} />
          </View>
        }
        ListEmptyComponent={renderVacio()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textMain,
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  contador: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  contadorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  listSpacer: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  vacioSpinner: {
    marginTop: 48,
  },
  reintentarBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reintentarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
