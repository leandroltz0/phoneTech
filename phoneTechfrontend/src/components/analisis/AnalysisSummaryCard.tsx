import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import type { ItemResumenAnalisis } from '@/data/analisisMock';

type AnalysisSummaryCardProps = {
  items: ItemResumenAnalisis[];
  onSeeMore: () => void;
  viabilityPercentage?: number;
};

const RING_SIZE = 130;
const RING_STROKE_WIDTH = 11;
const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function AnalysisSummaryCard({
  items,
  onSeeMore,
  viabilityPercentage = 70,
}: AnalysisSummaryCardProps) {
  const boundedPercentage = Math.min(100, Math.max(0, viabilityPercentage));
  const progressOffset = RING_CIRCUMFERENCE * (1 - boundedPercentage / 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconBox}>
            <Ionicons name="bar-chart" size={27} color="#0879D9" />
          </View>
        <Text style={styles.title}>Índice de viabilidad</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={onSeeMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Ver más</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.scoreArea}>
          <View style={styles.scoreRing}>
            <Svg
              accessible={false}
              height={RING_SIZE}
              pointerEvents="none"
              style={styles.scoreSvg}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              width={RING_SIZE}
            >
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                fill="none"
                r={RING_RADIUS}
                stroke={Colors.analisis.ringTrack}
                strokeWidth={RING_STROKE_WIDTH}
              />
              {boundedPercentage > 0 && (
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  fill="none"
                  r={RING_RADIUS}
                  rotation={-90}
                  originX={RING_SIZE / 2}
                  originY={RING_SIZE / 2}
                  stroke={Colors.primary}
                  strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  strokeWidth={RING_STROKE_WIDTH}
                />
              )}
            </Svg>
            <View style={styles.scoreCenter}>
              <Text style={styles.score}>{Math.round(boundedPercentage)}%</Text>
            <Text style={styles.scoreCaption}>Viabilidad</Text>
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
                  name={isWarning ? 'close-circle' : 'checkmark-circle'}
                  color={isWarning ? '#D92D20' : Colors.analisis.success}
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
    height: RING_SIZE,
    justifyContent: 'center',
    position: 'relative',
    width: RING_SIZE,
  },
  scoreSvg: {
    position: 'absolute',
    left: 0,
    top: 0,
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
