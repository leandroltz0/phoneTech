import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type DeviceAnalysisHeaderProps = {
  marca: string;
  modelo: string;
  variante: string;
};

export function DeviceAnalysisHeader({
  marca,
  modelo,
  variante,
}: DeviceAnalysisHeaderProps) {
  return (
    <View style={styles.card}>
      <Image
        source={require('@/assets/images/phone-preview-a03.png')}
        style={styles.phoneImage}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.deviceName}>{marca} {modelo}</Text>
        <Text style={styles.deviceSpecs}>{variante}</Text>
        <View style={styles.completeBadge}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.completeText}>Diagnóstico completo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.analisis.divider,
    borderRadius: 31,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 137,
    paddingHorizontal: 17,
    paddingVertical: 14,
    shadowColor: Colors.analisis.shadow,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.09,
    shadowRadius: 17,
  },
  phoneImage: {
    height: 108,
    marginRight: 13,
    width: 122,
  },
  content: { flex: 1 },
  deviceName: {
    color: Colors.analisis.title,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  deviceSpecs: {
    color: '#516A9F',
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 3,
  },
  completeBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.analisis.successSoft,
    borderRadius: 99,
    flexDirection: 'row',
    gap: 6,
    marginTop: 13,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 13,
    paddingTop: 7,
  },
  checkmark: {
    backgroundColor: Colors.analisis.success,
    borderRadius: 10,
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '900',
    height: 20,
    lineHeight: 20,
    overflow: 'hidden',
    textAlign: 'center',
    width: 20,
  },
  completeText: {
    color: '#07845A',
    fontSize: 12,
    fontWeight: '700',
  },
});
