import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type ProjectFinancialSnapshotProps = {
  ganancia: number;
  gasto: number;
  fechaInicio: string;
};

const formatCurrency = (value: number) => `$${value.toLocaleString('es-AR')}`;

export function ProjectFinancialSnapshot({
  ganancia,
  gasto,
  fechaInicio,
}: ProjectFinancialSnapshotProps) {
  return (
    <>
      <View style={styles.profitCard}>
        <View style={styles.profitDecoration} />
        <View style={styles.profitIconBox}>
          <Ionicons name="bar-chart" size={45} color="#0879D9" />
        </View>
        <View>
          <Text style={styles.profitLabel}>Ganancia estimada</Text>
          <Text style={styles.profitValue}>{formatCurrency(ganancia)}</Text>
          <Text style={styles.profitCaption}>Si se vende al precio estimado</Text>
        </View>
      </View>

      <View style={styles.secondaryMetrics}>
        <MiniMetric icon="cash" label="Gasto estimado" value={formatCurrency(gasto)} />
        <MiniMetric icon="calendar" label="Fecha de inicio" value={fechaInicio} />
      </View>
    </>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: 'cash' | 'calendar';
  label: string;
  value: string;
}) {
  return (
    <View style={styles.miniCard}>
      <View style={styles.miniIconBox}>
        <Ionicons name={icon} size={31} color="#1B74D3" />
      </View>
      <View style={styles.miniCopy}>
        <Text style={styles.miniLabel}>{label}</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.miniValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profitCard: {
    alignItems: 'center',
    backgroundColor: '#1E97DD',
    borderRadius: 31,
    flexDirection: 'row',
    minHeight: 130,
    overflow: 'hidden',
    paddingHorizontal: 22,
    shadowColor: '#1E97DD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  profitDecoration: { backgroundColor: '#70D9F5', borderRadius: 160, height: 260, position: 'absolute', right: -106, top: -76, width: 260 },
  profitIconBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 24, height: 78, justifyContent: 'center', marginRight: 18, width: 78 },
  profitLabel: { color: Colors.surface, fontSize: 15.5, fontWeight: '600' },
  profitValue: { color: Colors.surface, fontSize: 31, fontWeight: '800', letterSpacing: -1.4, marginTop: 1 },
  profitCaption: { color: Colors.surface, fontSize: 11.5, fontWeight: '500', marginTop: 2 },
  secondaryMetrics: { flexDirection: 'row', gap: 10, marginTop: 17 },
  miniCard: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 24, flex: 1, flexDirection: 'row', minHeight: 96, paddingHorizontal: 11, shadowColor: '#284E8F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 13 },
  miniIconBox: { alignItems: 'center', backgroundColor: '#E7F3FF', borderColor: '#B9DDFD', borderRadius: 28, borderWidth: 1.5, height: 56, justifyContent: 'center', marginRight: 9, width: 56 },
  miniCopy: { flex: 1 },
  miniLabel: { color: '#405582', fontSize: 11.5, fontWeight: '600' },
  miniValue: { color: '#071B49', fontSize: 17, fontWeight: '800', letterSpacing: -0.6, marginTop: 4 },
});
