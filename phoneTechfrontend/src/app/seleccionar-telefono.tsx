import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import {
  DeviceVariantSheet,
  VarianteDispositivoMock,
} from '@/components/dispositivos/DeviceVariantSheet';
import {
  COMPONENT_ISSUES,
  ComponentIssueSheet,
} from '@/components/dispositivos/ModuleIssueSheet';
import { DetalleUnlockToolCard } from '@/components/detalle-proyecto/DetalleUnlockToolCard';
import { dispositivosMock, verificarSoporteUnlockTool } from '@/data/dispositivosMock';

// ─── Categorías de fallas ────────────────────────────────────────────────────

const CATEGORIAS_FALLAS = [
  { id: 'modulo', label: 'Módulo / pantalla', description: 'Vidrio roto, sin imagen, líneas o fallas táctiles.' },
  { id: 'bateria', label: 'Batería', description: 'Se descarga rápido, no carga bien o está hinchada.' },
  { id: 'carga', label: 'Carga', description: 'Pin dañado, flex de carga o conexión intermitente.' },
  { id: 'tapa', label: 'Tapa y carcasa', description: 'Tapa rota, marco doblado o carcasa dañada.' },
  { id: 'camara', label: 'Cámara', description: 'Cámara que no funciona, lente o vidrio roto.' },
  { id: 'audio', label: 'Audio', description: 'Parlante, auricular o micrófono sin funcionar.' },
  { id: 'botones', label: 'Botones y flex', description: 'Encendido, volumen o flex sin respuesta.' },
  { id: 'sim', label: 'SIM y conectividad', description: 'No reconoce SIM, problemas de señal o Wi-Fi.' },
  { id: 'placa', label: 'Placa y otros', description: 'Fallos de placa, reinicios, humedad u otros daños internos.' },
] as const;

type CategoriaFallaId = (typeof CATEGORIAS_FALLAS)[number]['id'];

// ─── Variantes y estimaciones de reventa mock ────────────────────────────────

const VARIANTES_MOCK: Record<string, VarianteDispositivoMock[]> = {
  'samsung-a03': [
    { id: 'a03-m', codigo: 'SM-A035M', ram: '4 GB RAM', almacenamiento: '64 GB almacenamiento', precio: 150000, comun: true },
    { id: 'a03-f', codigo: 'SM-A035F', ram: '3 GB RAM', almacenamiento: '32 GB almacenamiento', precio: 135000 },
    { id: 'a03-g', codigo: 'SM-A035G', ram: '4 GB RAM', almacenamiento: '128 GB almacenamiento', precio: 165000 },
    { id: 'a03-g-ds', codigo: 'SM-A035G/DS', ram: '4 GB RAM', almacenamiento: '64 GB almacenamiento', precio: 150000 },
  ],
  'samsung-a10': [{ id: 'a10-m', codigo: 'SM-A105M', ram: '2 GB RAM', almacenamiento: '32 GB almacenamiento', precio: 95000, comun: true }],
  'samsung-a14': [{ id: 'a14-m', codigo: 'SM-A145M', ram: '4 GB RAM', almacenamiento: '128 GB almacenamiento', precio: 180000, comun: true }],
  'moto-e13': [{ id: 'e13', codigo: 'XT2345-5', ram: '2 GB RAM', almacenamiento: '64 GB almacenamiento', precio: 105000, comun: true }],
  'samsung-a04': [{ id: 'a04-m', codigo: 'SM-A045M', ram: '4 GB RAM', almacenamiento: '64 GB almacenamiento', precio: 110000, comun: true }],
  'moto-g22': [{ id: 'g22', codigo: 'XT2231-2', ram: '4 GB RAM', almacenamiento: '128 GB almacenamiento', precio: 150000, comun: true }],
  'samsung-a12': [{ id: 'a12-m', codigo: 'SM-A125M', ram: '4 GB RAM', almacenamiento: '64 GB almacenamiento', precio: 130000, comun: true }],
  'moto-g32': [{ id: 'g32', codigo: 'XT2235-2', ram: '4 GB RAM', almacenamiento: '128 GB almacenamiento', precio: 160000, comun: true }],
};

export default function SeleccionarTelefonoScreen() {
  const { dispositivoId } = useLocalSearchParams<{ dispositivoId: string }>();
  const [fallasSeleccionadas, setFallasSeleccionadas] = useState<Partial<Record<CategoriaFallaId, string>>>({});
  const [detallesExpandido, setDetallesExpandido] = useState(true);
  const [selectorVarianteVisible, setSelectorVarianteVisible] = useState(false);
  const [categoriaActivaId, setCategoriaActivaId] = useState<CategoriaFallaId>();

  const dispositivo =
    dispositivosMock.find((d) => d.id === dispositivoId) ?? dispositivosMock[0];
  const variantes = VARIANTES_MOCK[dispositivo.id] ?? VARIANTES_MOCK['samsung-a03'];
  const [varianteSeleccionadaId, setVarianteSeleccionadaId] = useState(variantes[0].id);
  const infoVariante = variantes.find((variante) => variante.id === varianteSeleccionadaId) ?? variantes[0];

  const categoriaActiva = CATEGORIAS_FALLAS.find((cat) => cat.id === categoriaActivaId);
  const fallasDetalladas = CATEGORIAS_FALLAS.flatMap((category) => {
    const issueId = fallasSeleccionadas[category.id];
    const issue = COMPONENT_ISSUES[category.id].find((item) => item.id === issueId);
    return issue ? [{ category, issue }] : [];
  });
  const fallasTotales = fallasDetalladas.length;
  const fallasTexto = fallasDetalladas.map(({ category }) => category.label).join(', ');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ─── Encabezado ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Volver"
          accessibilityRole="button"
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#263746" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar teléfono</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Vista previa del teléfono ──────────────────────────── */}
        <View style={styles.phoneArtworkContainer}>
          <Image
            source={require('@/assets/images/phone-preview-a03.png')}
            style={styles.phoneArtworkImage}
            resizeMode="contain"
          />
        </View>

        {/* ─── Nombre del dispositivo ─────────────────────────────── */}
        <Text style={styles.deviceName}>
          {dispositivo.marca} {dispositivo.modelo}
        </Text>

        {/* ─── Soporte UnlockTool ─────────────────────────────────── */}
        <DetalleUnlockToolCard supported={verificarSoporteUnlockTool(dispositivo)} />

        {/* ─── Card: Variante del dispositivo ─────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar variante del dispositivo"
          onPress={() => setSelectorVarianteVisible(true)}
          style={styles.card}
        >
          <View style={styles.variantRow}>
            <View style={styles.deviceIconWrapper}>
              <Ionicons name="phone-portrait-outline" size={24} color="#0E4268" />
            </View>
            <View style={styles.variantTextWrapper}>
              <Text style={styles.variantKicker}>VARIANTE DEL DISPOSITIVO</Text>
              <Text style={styles.variantCode}>{infoVariante.codigo}</Text>
              <Text style={styles.variantSpecs}>
                {infoVariante.ram} · {infoVariante.almacenamiento}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#378CC4" />
          </View>
        </TouchableOpacity>

        {/* ─── Card: Precio de venta en buen estado ───────────────── */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <View style={styles.priceInfoWrapper}>
              <Text style={styles.priceLabel}>Precio de venta en buen estado</Text>
              <Text style={styles.priceValue}>
                ${infoVariante.precio.toLocaleString('es-AR')}
              </Text>
              <View style={styles.estimationBadge}>
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color="#718398"
                />
                <Text style={styles.estimationText}>Estimación de reventa</Text>
              </View>
            </View>
            <View style={styles.chartWrapper}>
              <Image
                source={require('@/assets/images/trending-chart-icon.png')}
                style={styles.chartImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* ─── Card: Detalles (Diagnóstico de fallas) ─────────────── */}
        <View style={styles.detallesCard}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={() => setDetallesExpandido((prev) => !prev)}
            style={styles.detallesHeader}
          >
            <View style={styles.detallesHeaderLeft}>
              <Ionicons
                name={detallesExpandido ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#378CC4"
              />
              <Text style={styles.detallesTitle}>Detalles</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {fallasTotales} seleccionados
              </Text>
            </View>
          </TouchableOpacity>

          {detallesExpandido && (
            <View style={styles.detallesBody}>
              <Text style={styles.detallesSubtitle}>
                Seleccioná los componentes que presentan fallas
              </Text>

              <View style={styles.gridContainer}>
                {CATEGORIAS_FALLAS.map((cat) => {
                  const isSelected = Boolean(fallasSeleccionadas[cat.id]);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      accessibilityLabel={cat.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      activeOpacity={0.75}
                      onPress={() => setCategoriaActivaId(cat.id)}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark' : 'add'}
                        size={15}
                        color={isSelected ? '#FFFFFF' : '#378CC4'}
                      />
                      <Text
                        style={[
                          styles.chipLabel,
                          isSelected && styles.chipLabelSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* ─── Card Informativa: Resumen de fallas ────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrapper}>
            <Ionicons
              name={fallasTotales > 0 ? 'checkmark-circle' : 'clipboard-outline'}
              size={30}
              color="#378CC4"
            />
          </View>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoTitle}>
              {fallasTotales === 0
                ? 'Sin fallas seleccionadas'
                : `${fallasTotales} falla${fallasTotales > 1 ? 's' : ''} seleccionada${fallasTotales > 1 ? 's' : ''}`}
            </Text>
            <Text style={styles.infoSubtitle}>
              {fallasTotales === 0
                ? 'Agregá los componentes con problemas para continuar con el diagnóstico.'
                : `Componentes marcados: ${fallasTexto}`}
            </Text>
          </View>
        </View>

        {fallasDetalladas.map(({ category, issue }) => (
          <View key={category.id} style={styles.issueCard}>
            <View style={styles.issueCardIcon}>
              <Ionicons name="phone-portrait-outline" size={21} color="#167FB9" />
            </View>
            <View style={styles.issueCardContent}>
              <Text style={styles.issueCardComponent}>{category.label.toUpperCase()}</Text>
              <Text style={styles.issueCardTitle}>{issue.title}</Text>
              <Text style={styles.issueCardDescription}>{issue.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ─── Botón inferior Continuar ───────────────────────────── */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.88}
          onPress={() => {
            router.push({
              pathname: '/analisis-equipo',
              params: {
                dispositivoId: dispositivo.id,
                variante: `${infoVariante.codigo} · ${infoVariante.ram} / ${infoVariante.almacenamiento}`,
                diagnostico: JSON.stringify(fallasDetalladas.map(({ category, issue }) => `${category.label}: ${issue.title}`)),
              },
            });
          }}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>

      {selectorVarianteVisible && (
        <DeviceVariantSheet
          onClose={() => setSelectorVarianteVisible(false)}
          onConfirm={(varianteId) => {
            setVarianteSeleccionadaId(varianteId);
            setSelectorVarianteVisible(false);
          }}
          varianteSeleccionadaId={varianteSeleccionadaId}
          variantes={variantes}
          visible
        />
      )}

      <ComponentIssueSheet
        key={`${categoriaActivaId ?? 'none'}-${categoriaActiva ? fallasSeleccionadas[categoriaActiva.id] ?? 'none' : 'none'}`}
        componentLabel={categoriaActiva?.label ?? ''}
        componentDescription={categoriaActiva?.description ?? ''}
        issueId={categoriaActiva ? fallasSeleccionadas[categoriaActiva.id] : undefined}
        issues={categoriaActiva ? COMPONENT_ISSUES[categoriaActiva.id] : []}
        onClose={() => setCategoriaActivaId(undefined)}
        onConfirm={(issueId) => {
          if (categoriaActiva) {
            setFallasSeleccionadas((previous) => ({ ...previous, [categoriaActiva.id]: issueId }));
          }
          setCategoriaActivaId(undefined);
        }}
        visible={Boolean(categoriaActiva)}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 2,
    height: 40,
    justifyContent: 'center',
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    width: 40,
  },
  headerTitle: {
    color: '#718398',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  phoneArtworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    height: 146,
    width: '100%',
  },
  phoneArtworkImage: {
    width: '100%',
    height: 146,
  },
  deviceName: {
    color: '#10264C',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEF5',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  variantRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  deviceIconWrapper: {
    alignItems: 'center',
    backgroundColor: '#DFF1FC',
    borderRadius: 13,
    height: 44,
    justifyContent: 'center',
    marginRight: 13,
    width: 44,
  },
  variantTextWrapper: {
    flex: 1,
  },
  variantKicker: {
    color: '#718398',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  variantCode: {
    color: '#10264C',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 1,
  },
  variantSpecs: {
    color: '#718398',
    fontSize: 12,
    fontWeight: '500',
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInfoWrapper: {
    flex: 1,
  },
  priceLabel: {
    color: '#4A5F73',
    fontSize: 12.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceValue: {
    color: '#10264C',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  estimationBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  estimationText: {
    color: '#718398',
    fontSize: 11.5,
    fontWeight: '500',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    height: 62,
  },
  chartImage: {
    width: 62,
    height: 62,
  },
  detallesCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEF5',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  detallesHeader: {
    alignItems: 'center',
    backgroundColor: '#EBF5FC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detallesHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  detallesTitle: {
    color: '#10264C',
    fontSize: 15,
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: '#DFF1FC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countBadgeText: {
    color: '#378CC4',
    fontSize: 11,
    fontWeight: '700',
  },
  detallesBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
  },
  detallesSubtitle: {
    color: '#718398',
    fontSize: 12,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  chip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E8F0',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    height: 42,
    justifyContent: 'center',
    width: '31.5%',
  },
  chipSelected: {
    backgroundColor: '#378CC4',
    borderColor: '#378CC4',
  },
  chipLabel: {
    color: '#263746',
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#E8F4FC',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoTitle: {
    color: '#10264C',
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoSubtitle: {
    color: '#687D94',
    fontSize: 11.5,
    lineHeight: 16,
  },
  issueCard: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#D7EAF6',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 14,
  },
  issueCardIcon: {
    alignItems: 'center',
    backgroundColor: '#E5F5FE',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  issueCardContent: { flex: 1 },
  issueCardComponent: {
    color: '#378CC4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  issueCardTitle: { color: '#10264C', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  issueCardDescription: { color: '#718398', fontSize: 11.5, lineHeight: 16 },
  footerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: '#277EB7',
    borderRadius: 18,
    elevation: 3,
    height: 52,
    justifyContent: 'center',
    shadowColor: '#277EB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    width: '100%',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
