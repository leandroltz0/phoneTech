import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { ItemResumenAnalisis } from '@/data/analisisMock';

type AnalysisSummaryCardProps = {
  items: ItemResumenAnalisis[];
  onSeeMore: () => void;
};

export function AnalysisSummaryCard({ items, onSeeMore }: AnalysisSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <Ionicons name="bar-chart" size={27} color="#0879D9" />
          </View>
          <Text style={styles.title}>Resumen del análisis</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={onSeeMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Ver más</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.scoreArea}>
          <View style={styles.scoreRing}>
            <View style={styles.scoreProgress} />
            <View style={styles.scoreCenter}>
              <Text style={styles.score}>70%</Text>
              <Text style={styles.scoreCaption}>Funcionalidad</Text>
            </View>
          </View>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.statusList}>
          {items.map((item) => {
            const isWarning = item.estado === 'alerta';
            return (
              <View key={item.titulo} style={styles.statusRow}>
                <Ionicons
                  name={isWarning ? 'alert-circle' : 'checkmark-circle'}
                  color={isWarning ? Colors.analisis.warning : Colors.analisis.success}
                  size={20}
                />
                <View style={styles.statusCopy}>
                  <Text style={styles.statusTitle}>{item.titulo}</Text>
                  <Text style={styles.statusDescription}>{item.descripcion}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
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
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 13 },
  iconBox: {
    alignItems: 'center',
    backgroundColor: Colors.analisis.softBlueStrong,
    borderRadius: 22,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  title: { color: Colors.analisis.title, fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  seeMoreButton: { backgroundColor: Colors.analisis.softBlue, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 },
  seeMoreText: { color: '#16427D', fontSize: 11.5, fontWeight: '700' },
  details: { flexDirection: 'row', marginTop: 14 },
  scoreArea: { alignItems: 'center', justifyContent: 'center', paddingRight: 13, width: '42%' },
  scoreRing: {
    alignItems: 'center',
    borderColor: Colors.analisis.ringTrack,
    borderRadius: 65,
    borderWidth: 11,
    height: 130,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: 130,
  },
  scoreProgress: {
    borderBottomColor: Colors.primary,
    borderLeftColor: Colors.primary,
    borderRadius: 65,
    borderRightColor: Colors.primary,
    borderTopColor: 'transparent',
    borderWidth: 11,
    height: 130,
    left: -11,
    position: 'absolute',
    top: -11,
    transform: [{ rotate: '-34deg' }],
    width: 130,
  },
  scoreCenter: { alignItems: 'center' },
  score: { color: Colors.analisis.title, fontSize: 29, fontWeight: '800', letterSpacing: -1.2 },
  scoreCaption: { color: '#60749D', fontSize: 10.5, fontWeight: '500', marginTop: -1 },
  verticalDivider: { backgroundColor: Colors.analisis.divider, marginVertical: 2, width: 1 },
  statusList: { flex: 1, gap: 11, paddingLeft: 13, paddingTop: 2 },
  statusRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 9 },
  statusCopy: { flex: 1, paddingTop: 1 },
  statusTitle: { color: Colors.analisis.title, fontSize: 12.5, fontWeight: '800' },
  statusDescription: { color: '#60749D', fontSize: 11.5, fontWeight: '500', lineHeight: 14, marginTop: 1 },
});
