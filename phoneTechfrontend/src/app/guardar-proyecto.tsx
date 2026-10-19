import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProjectFinancialSnapshot } from '@/components/guardar-proyecto/ProjectFinancialSnapshot';
import { ProjectStatusCard } from '@/components/guardar-proyecto/ProjectStatusCard';
import { ProjectSummaryCard } from '@/components/guardar-proyecto/ProjectSummaryCard';
import { Colors } from '@/constants/colors';
import { EstadoGuardadoProyecto, proyectoPendienteMock } from '@/data/guardarProyectoMock';
import { dispositivosMock } from '@/data/dispositivosMock';

export default function GuardarProyectoScreen() {
  const { dispositivoId } = useLocalSearchParams<{ dispositivoId?: string }>();
  const dispositivo = dispositivosMock.find(({ id }) => id === dispositivoId) ?? dispositivosMock[0];
  const [estado, setEstado] = useState<EstadoGuardadoProyecto>('pendiente');
  const [statusExpanded, setStatusExpanded] = useState(false);

  const updateStatus = (newStatus: EstadoGuardadoProyecto) => {
    setEstado(newStatus);
    setStatusExpanded(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View pointerEvents="none" style={styles.backgroundBubble} />
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Volver al análisis" accessibilityRole="button" activeOpacity={0.75} onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" color="#071B49" size={25} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Armar proyecto</Text>
          <Text style={styles.subtitle}>Revisá los datos antes de guardar</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProjectSummaryCard
          diagnostico={proyectoPendienteMock.diagnostico}
          marca={dispositivo.marca}
          modelo={dispositivo.modelo}
          numero={proyectoPendienteMock.numero}
          variante={proyectoPendienteMock.variante}
        />
        <ProjectFinancialSnapshot
          fechaInicio={proyectoPendienteMock.fechaInicio}
          ganancia={proyectoPendienteMock.gananciaEstimada}
          gasto={proyectoPendienteMock.gastoEstimado}
        />
        <ProjectStatusCard
          estado={estado}
          expanded={statusExpanded}
          onChange={updateStatus}
          onToggle={() => setStatusExpanded((current) => !current)}
        />
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.78}
          onPress={() => router.push({ pathname: '/analisis-equipo', params: { dispositivoId: dispositivo.id } })}
          style={styles.detailsLink}
        >
          <View style={styles.detailsIcon}>
            <Ionicons name="document-text" color="#315DA8" size={24} />
          </View>
          <Text style={styles.detailsText}>Ver diagnóstico y costos</Text>
          <Ionicons name="chevron-forward" color="#315DA8" size={25} />
        </TouchableOpacity>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" color="#315DA8" size={21} />
          <Text style={styles.infoText}>Podrás editar los datos más adelante.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityLabel="Guardar proyecto"
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => router.replace('/(tabs)/proyectos')}
          style={styles.saveButton}
        >
          <Text style={styles.saveText}>Guardar proyecto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  backgroundBubble: { backgroundColor: '#E2EEFF', borderRadius: 190, height: 275, position: 'absolute', right: -110, top: -105, width: 350 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 17, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  backButton: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 26, height: 53, justifyContent: 'center', shadowColor: '#284E8F', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 10, width: 53 },
  title: { color: '#071B49', fontSize: 24, fontWeight: '800', letterSpacing: -0.9 },
  subtitle: { color: '#526583', fontSize: 14.5, fontWeight: '500', marginTop: 1 },
  content: { gap: 17, paddingHorizontal: 20, paddingBottom: 22 },
  detailsLink: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 28, flexDirection: 'row', minHeight: 76, paddingHorizontal: 20 },
  detailsIcon: { marginRight: 17 },
  detailsText: { color: '#365183', flex: 1, fontSize: 16, fontWeight: '600' },
  infoRow: { alignItems: 'center', flexDirection: 'row', gap: 11, justifyContent: 'center', paddingVertical: 2 },
  infoText: { color: '#405B8B', fontSize: 13, fontWeight: '500' },
  footer: { backgroundColor: 'rgba(245,249,252,0.94)', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  saveButton: { alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 29, height: 59, justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12 },
  saveText: { color: Colors.surface, fontSize: 21, fontWeight: '700', letterSpacing: -0.6 },
});
