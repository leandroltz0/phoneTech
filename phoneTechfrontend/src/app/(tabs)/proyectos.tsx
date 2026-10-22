import React, { useMemo, useState, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { obtenerProyectosMock, suscribirProyectosMock } from '@/data/proyectosMock';
import { ProyectoCard } from '@/components/proyectos/ProyectoCard';
import { ProyectosSearch } from '@/components/proyectos/ProyectosSearch';
import { ProyectosFilters, FiltroProyecto } from '@/components/proyectos/ProyectosFilters';
import { Proyecto } from '@/types/proyecto';

export default function ProyectosScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroProyecto>('todos');
  const proyectosMock = useSyncExternalStore(suscribirProyectosMock, obtenerProyectosMock, obtenerProyectosMock);

  const proyectosFiltrados = useMemo(() => {
    return proyectosMock.filter((p: Proyecto) => {
      const coincideBusqueda =
        busqueda.trim() === '' ||
        p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.numero).includes(busqueda);

      const coincideFiltro = filtro === 'todos' || p.estado === filtro;

      return coincideBusqueda && coincideFiltro;
    });
  }, [busqueda, filtro, proyectosMock]);

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
                  {proyectosMock.length} proyectos
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proyectos que coincidan.</Text>
          </View>
        }
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
  },
});
