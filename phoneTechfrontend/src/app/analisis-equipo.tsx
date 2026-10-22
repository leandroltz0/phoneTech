import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnalysisSummaryCard } from '@/components/analisis/AnalysisSummaryCard';
import { DeviceAnalysisHeader } from '@/components/analisis/DeviceAnalysisHeader';
import { EconomicAnalysisCard } from '@/components/analisis/EconomicAnalysisCard';
import { ReplacementPartsCard } from '@/components/analisis/ReplacementPartsCard';
import { Colors } from '@/constants/colors';
import { repuestosMock, resumenAnalisisMock } from '@/data/analisisMock';
import { dispositivosMock } from '@/data/dispositivosMock';

const DEFAULT_VARIANT = 'SM-A035M · 4 GB RAM · 64 GB';

export default function AnalisisEquipoScreen() {
  const { dispositivoId, variante, diagnostico } = useLocalSearchParams<{
    dispositivoId?: string;
    variante?: string;
    diagnostico?: string;
  }>();
  const dispositivo = dispositivosMock.find(({ id }) => id === dispositivoId) ?? dispositivosMock[0];

  const showPendingDetails = (section: string) => {
    Alert.alert(section, 'El detalle completo estará disponible próximamente.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Volver al diagnóstico"
          accessibilityRole="button"
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color={Colors.analisis.title} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análisis del equipo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DeviceAnalysisHeader
          marca={dispositivo.marca}
          modelo={dispositivo.modelo}
          variante={variante ?? DEFAULT_VARIANT}
        />
        <AnalysisSummaryCard
          items={resumenAnalisisMock}
          onSeeMore={() => showPendingDetails('Resumen del análisis')}
        />
        <ReplacementPartsCard
          repuestos={repuestosMock}
          onSeeMore={() => showPendingDetails('Repuestos necesarios')}
        />
        <EconomicAnalysisCard />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityLabel="Guardar análisis y continuar"
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={() => router.push({
            pathname: '/guardar-proyecto',
            params: { dispositivoId: dispositivo.id, variante, diagnostico },
          })}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Guardar análisis y continuar</Text>
          <Ionicons name="arrow-forward" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingTop: 9, paddingBottom: 14 },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.analisis.divider,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    shadowColor: Colors.analisis.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 44,
  },
  headerTitle: { color: '#4E6696', fontSize: 17, fontWeight: '600', letterSpacing: -0.4 },
  content: { gap: 14, paddingHorizontal: 20, paddingBottom: 18 },
  footer: { backgroundColor: Colors.background, paddingHorizontal: 20, paddingTop: 9, paddingBottom: 12 },
  saveButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 27,
    flexDirection: 'row',
    height: 57,
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 11,
  },
  saveButtonText: { color: Colors.surface, fontSize: 18, fontWeight: '600', letterSpacing: -0.6 },
});
