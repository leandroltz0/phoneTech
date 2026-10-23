import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import {
  obtenerProyectoPorIdMock,
  obtenerProyectosMock,
  actualizarPrecioProyectoMock,
} from '@/data/proyectosMock';
import { ESTADO_CONFIG } from '@/constants/estados';
import { formatPeso } from '@/utils/formatters';

export default function ModificarPreciosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const proyecto =
    (id ? obtenerProyectoPorIdMock(id) : undefined) ?? obtenerProyectosMock()[0];

  const precioInicial = useMemo(() => {
    if (!proyecto) return 120000;
    return (
      (proyecto.estado === 'vendido'
        ? proyecto.precioVentaFinal
        : proyecto.precioVentaEstimado) ??
      proyecto.precioVentaEstimado ??
      120000
    );
  }, [proyecto]);

  const [precioTexto, setPrecioTexto] = useState(String(precioInicial));

  const compra = proyecto?.precioCompra ?? 35000;
  const gastos =
    proyecto?.totalGastos ??
    (proyecto?.gastos?.reduce((acc, g) => acc + g.monto, 0) ?? 25000);

  // Cálculo en tiempo real de la ganancia al modificar el precio
  const precioNumerico = useMemo(() => {
    const limpio = precioTexto.replace(/[^0-9]/g, '');
    return limpio ? parseInt(limpio, 10) : 0;
  }, [precioTexto]);

  const gananciaCalculada = useMemo(() => {
    return precioNumerico - compra - gastos;
  }, [precioNumerico, compra, gastos]);

  const handleGuardar = useCallback(() => {
    if (!proyecto) return;
    actualizarPrecioProyectoMock(proyecto.id, precioNumerico);
    router.back();
  }, [proyecto, precioNumerico, router]);

  if (!proyecto) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modificar precio</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Proyecto no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const estado = ESTADO_CONFIG[proyecto.estado];

  const imageSource =
    proyecto.modelo.includes('A03')
      ? require('@/assets/images/phone-preview-a03.png')
      : { uri: proyecto.imagen };

  const esVendido = proyecto.estado === 'vendido';
  const labelGanancia = esVendido ? 'Ganancia real' : 'Ganancia real';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ─── Encabezado ─── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modificar precio</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 85 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Tarjeta Identificación del Celular ─── */}
          <View style={styles.deviceCard}>
            <View style={styles.deviceImageContainer}>
              <Image
                source={imageSource}
                style={styles.deviceImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.deviceInfo}>
              <Text style={styles.deviceModel} numberOfLines={1}>
                {proyecto.modelo}
              </Text>
              <Text style={styles.deviceVariant} numberOfLines={1}>
                #{String(proyecto.numero).padStart(3, '0')} · {proyecto.variante ?? 'SM-A035M'}
              </Text>

              <View style={[styles.statusBadge, { backgroundColor: estado.bg }]}>
                <Ionicons
                  name={estado.icon}
                  size={14}
                  color={estado.text}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.statusText, { color: estado.text }]}>
                  {estado.label}
                </Text>
              </View>
            </View>
          </View>

          {/* ─── Input: Precio de venta ─── */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Precio de venta</Text>
            <View style={styles.inputBox}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.textInput}
                value={precioTexto}
                onChangeText={setPrecioTexto}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textSecondary}
                selectionColor={Colors.primary}
              />
            </View>
          </View>

          {/* ─── Tarjeta: Resumen de la operación ─── */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de la operación</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Compra</Text>
              <Text style={styles.summaryValue}>{formatPeso(compra)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gastos de reparación</Text>
              <Text style={styles.summaryValue}>{formatPeso(gastos)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Venta</Text>
              <Text style={styles.summaryValueBold}>{formatPeso(precioNumerico)}</Text>
            </View>

            <View style={styles.divider} />

            {/* Fila de ganancia que se actualiza dinámicamente */}
            <View style={styles.profitRow}>
              <Text style={styles.profitLabel}>{labelGanancia}</Text>
              <Text
                style={[
                  styles.profitValue,
                  gananciaCalculada < 0 && styles.profitNegative,
                ]}
              >
                {formatPeso(gananciaCalculada)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ─── Botón inferior Guardar ─── */}
        <View
          style={[
            styles.bottomAction,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.guardarBtn}
            onPress={handleGuardar}
            activeOpacity={0.88}
          >
            <Text style={styles.guardarBtnText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  backBtn: {
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8F1F7',
    padding: 14,
    marginBottom: 20,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  deviceImageContainer: {
    width: 80,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    padding: 4,
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceModel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 2,
  },
  deviceVariant: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE7EF',
    paddingHorizontal: 16,
    height: 54,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#10264C',
    paddingVertical: 0,
  },
  summaryCard: {
    backgroundColor: '#EFF7FC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8ECF8',
    padding: 18,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10264C',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13.5,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10264C',
  },
  summaryValueBold: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#10264C',
  },
  divider: {
    height: 1,
    backgroundColor: '#D8ECF8',
    marginVertical: 10,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  profitLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0DAA77',
  },
  profitValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0DAA77',
  },
  profitNegative: {
    color: '#EF4444',
  },
  bottomAction: {
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
  guardarBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  guardarBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
