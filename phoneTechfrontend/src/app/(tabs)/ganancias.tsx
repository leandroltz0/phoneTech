import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GananciaMensual } from '@/components/ganancias/GananciaMensual';
import { HistorialMensual } from '@/components/ganancias/HistorialMensual';
import { ResumenFinanciero } from '@/components/ganancias/ResumenFinanciero';
import { UltimasVentas } from '@/components/ganancias/UltimasVentas';
import { Colors } from '@/constants/colors';
import { resumenesGananciasMock } from '@/data/gananciasMock';
import { VistaGanancias } from '@/types/ganancias';

const opciones: { id: VistaGanancias; etiqueta: string }[] = [
  { id: 'mes', etiqueta: 'Este mes' },
  { id: 'proyectadas', etiqueta: 'Proyectadas' },
  { id: 'perdidas', etiqueta: 'Pérdidas' },
];

export default function GananciasScreen() {
  const [vistaActiva, setVistaActiva] = useState<VistaGanancias>('mes');
  const resumen = resumenesGananciasMock[vistaActiva];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Ganancias</Text>
            <Text style={styles.subtitulo}>Tu negocio, en números</Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Más opciones de ganancias"
            style={styles.moreButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={21} color={Colors.textMain} />
          </TouchableOpacity>
        </View>

        <View style={styles.selector}>
          {opciones.map((opcion) => {
            const isActive = vistaActiva === opcion.id;

            return (
              <Pressable
                key={opcion.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setVistaActiva(opcion.id)}
                style={[styles.selectorOption, isActive && styles.selectorOptionActive]}
              >
                <Text style={[styles.selectorText, isActive && styles.selectorTextActive]}>
                  {opcion.etiqueta}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <GananciaMensual
          etiqueta={resumen.etiquetaHero}
          descripcion={resumen.descripcionHero}
          valor={resumen.valorHero}
          detalle={resumen.descripcionValorHero}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capital de inversión</Text>
          <View style={styles.capitalCard}>
            <View style={styles.capitalMain}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.capitalLabel}>Tu capital actual</Text>
                <Text style={styles.capitalValue}>${resumen.capitalActual.toLocaleString('es-AR')}</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressValue} />
            </View>

            <View style={styles.capitalDetails}>
              <View style={styles.capitalDetail}>
                <Text style={styles.detailLabel}>Invertido en equipos</Text>
                <Text style={styles.detailValue}>${resumen.invertidoEnEquipos.toLocaleString('es-AR')}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.capitalDetail}>
                <Text style={styles.detailLabel}>Disponible para invertir</Text>
                <Text style={styles.detailValue}>${resumen.disponibleParaInvertir.toLocaleString('es-AR')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ResumenFinanciero metricas={resumen.metricas} />
        </View>

        <View style={styles.section}>
          <HistorialMensual valorActual={resumen.valorHero} puntos={resumen.historial} />
        </View>

        <View style={styles.section}>
          <UltimasVentas ventas={resumen.ventas} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  titulo: {
    color: Colors.textMain,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  subtitulo: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  moreButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.textMain,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selector: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  selectorOption: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  selectorOptionActive: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.textMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  selectorTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    marginTop: 19,
  },
  sectionTitle: {
    color: Colors.textMain,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 9,
  },
  capitalCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.dashboard.investmentBorder,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  capitalMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  capitalLabel: {
    color: Colors.primaryDark,
    fontSize: 11,
  },
  capitalValue: {
    color: Colors.textMain,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 1,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.dashboard.investmentTrack,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressValue: {
    width: '60%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  capitalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  capitalDetail: {
    flex: 1,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 9,
  },
  detailValue: {
    color: Colors.textMain,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },
  detailDivider: {
    width: 1,
    height: 23,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
});
