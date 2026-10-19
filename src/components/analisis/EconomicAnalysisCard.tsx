import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { analisisEconomicoMock } from '@/data/analisisMock';

const formatCurrency = (value: number) => `$${value.toLocaleString('es-AR')}`;

export function EconomicAnalysisCard() {
  const data = analisisEconomicoMock;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="calculator" size={25} color="#16427D" />
        </View>
        <Text style={styles.title}>Análisis económico</Text>
      </View>

      <View style={styles.metrics}>
        <Metric label="Costo estimado de reparación" value={formatCurrency(data.costoReparacion)} />
        <View style={styles.metricDivider} />
        <Metric
          label="Precio recomendado de compra"
          value={`${formatCurrency(data.precioCompraMinimo)} – ${formatCurrency(data.precioCompraMaximo)}`}
        />
      </View>

      <View style={styles.saleMetric}>
        <View style={styles.saleMetricIcon}>
          <Ionicons name="pricetag" size={17} color={Colors.primary} />
        </View>
        <View>
          <Text style={styles.saleMetricLabel}>Precio estimado de venta</Text>
          <Text style={styles.saleMetricValue}>
            {formatCurrency(data.precioVentaMinimo)} – {formatCurrency(data.precioVentaMaximo)}
          </Text>
        </View>
      </View>

      <View style={styles.profitBanner}>
        <Ionicons name="bar-chart" size={33} color={Colors.analisis.success} />
        <View style={styles.profitCopy}>
          <Text style={styles.profitLabel}>Margen de ganancia estimado</Text>
          <Text style={styles.profitValue}>
            {formatCurrency(data.gananciaMinima)} – {formatCurrency(data.gananciaMaxima)}
          </Text>
        </View>
        <View style={styles.marginBadge}>
          <Text style={styles.marginText}>{data.margen}</Text>
        </View>
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.analisis.divider,
    borderRadius: 29,
    borderWidth: 1,
    padding: 16,
    shadowColor: Colors.analisis.shadow,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
  },
  header: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  iconBox: { alignItems: 'center', backgroundColor: Colors.analisis.softBlueStrong, borderRadius: 17, height: 49, justifyContent: 'center', width: 49 },
  title: { color: Colors.analisis.title, fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  metrics: { flexDirection: 'row', marginTop: 17 },
  metric: { flex: 1 },
  metricDivider: { backgroundColor: '#BAD5F4', marginHorizontal: 12, width: 1 },
  metricLabel: { color: '#40598C', fontSize: 10.5, fontWeight: '500', lineHeight: 13 },
  metricValue: { color: Colors.analisis.title, fontSize: 19, fontWeight: '800', letterSpacing: -0.8, marginTop: 5 },
  saleMetric: {
    alignItems: 'center',
    backgroundColor: Colors.analisis.softBlue,
    borderRadius: 15,
    flexDirection: 'row',
    marginTop: 14,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  saleMetricIcon: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 30,
    justifyContent: 'center',
    marginRight: 9,
    width: 30,
  },
  saleMetricLabel: { color: '#40598C', fontSize: 10.5, fontWeight: '500' },
  saleMetricValue: { color: Colors.analisis.title, fontSize: 17, fontWeight: '800', letterSpacing: -0.55, marginTop: 2 },
  profitBanner: {
    alignItems: 'center',
    backgroundColor: Colors.analisis.successSoft,
    borderColor: '#BFEEDF',
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 17,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  profitCopy: { flex: 1, marginLeft: 12 },
  profitLabel: { color: '#27577C', fontSize: 11.5, fontWeight: '500' },
  profitValue: { color: '#07845A', fontSize: 18.5, fontWeight: '800', letterSpacing: -0.6, marginTop: 3 },
  marginBadge: { backgroundColor: Colors.surface, borderRadius: 99, paddingHorizontal: 11, paddingVertical: 9 },
  marginText: { color: '#07845A', fontSize: 11.5, fontWeight: '800' },
});
