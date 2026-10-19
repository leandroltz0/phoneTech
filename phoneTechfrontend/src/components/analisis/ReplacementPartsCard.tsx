import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { RepuestoMock } from '@/data/analisisMock';

type ReplacementPartsCardProps = {
  repuestos: RepuestoMock[];
  onSeeMore: () => void;
};

const formatCurrency = (value: number) => `$${value.toLocaleString('es-AR')}`;

export function ReplacementPartsCard({ repuestos, onSeeMore }: ReplacementPartsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.iconBox}>
          <Ionicons name="construct" size={26} color="#0879D9" />
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Repuestos necesarios</Text>
          <Text style={styles.subtitle}>Componentes con fallas detectadas</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={onSeeMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Ver más</Text>
        </TouchableOpacity>
      </View>

      {repuestos.map((repuesto, index) => (
        <View key={repuesto.id} style={[styles.partRow, index > 0 && styles.partRowBorder]}>
          <View style={styles.thumbnail}>
            {repuesto.imagen ? (
              <Image source={repuesto.imagen} style={styles.thumbnailImage} resizeMode="contain" />
            ) : (
              <Ionicons name="camera" color={Colors.analisis.title} size={37} />
            )}
          </View>
          <View style={styles.partCopy}>
            <Text style={styles.supplier}>{repuesto.proveedor}</Text>
            <Text style={styles.partName}>{repuesto.nombre}</Text>
            <Text style={styles.partDescription}>{repuesto.descripcion}</Text>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.estimate}>Estimado</Text>
            <Text style={styles.price}>{formatCurrency(repuesto.precio)}</Text>
          </View>
        </View>
      ))}
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
  headingRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 11 },
  iconBox: {
    alignItems: 'center',
    backgroundColor: Colors.analisis.softBlueStrong,
    borderRadius: 21,
    height: 58,
    justifyContent: 'center',
    marginRight: 12,
    width: 58,
  },
  headingCopy: { flex: 1 },
  title: { color: Colors.analisis.title, fontSize: 17, fontWeight: '800', letterSpacing: -0.45 },
  subtitle: { color: '#4F669A', fontSize: 11.5, fontWeight: '500', marginTop: 1 },
  seeMoreButton: { paddingLeft: 7, paddingVertical: 8 },
  seeMoreText: { color: Colors.primary, fontSize: 11.5, fontWeight: '700' },
  partRow: { alignItems: 'center', flexDirection: 'row', minHeight: 101, paddingVertical: 10 },
  partRowBorder: { borderTopColor: Colors.analisis.divider, borderTopWidth: 1 },
  thumbnail: {
    alignItems: 'center',
    backgroundColor: Colors.analisis.softBlue,
    borderRadius: 17,
    height: 80,
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
    width: 72,
  },
  thumbnailImage: { height: 72, width: 82 },
  partCopy: { flex: 1, paddingRight: 7 },
  partName: { color: Colors.analisis.title, fontSize: 15.5, fontWeight: '800' },
  supplier: { color: Colors.primary, fontSize: 10.5, fontWeight: '800', marginBottom: 1 },
  partDescription: { color: '#566B98', fontSize: 11.5, lineHeight: 14, marginTop: 3 },
  priceBox: { alignItems: 'flex-end', minWidth: 69 },
  estimate: { color: '#0879D9', fontSize: 10.5, fontWeight: '800' },
  price: { color: Colors.analisis.title, fontSize: 17.5, fontWeight: '800', letterSpacing: -0.4, marginTop: 4 },
});
