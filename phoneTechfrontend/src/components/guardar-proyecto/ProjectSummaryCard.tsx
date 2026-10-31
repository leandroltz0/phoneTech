import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

type ProjectSummaryCardProps = {
  marca: string;
  modelo: string;
  numero: number;
  variante: string;
  diagnostico: string[];
  imageUri?: string | null;
};

export function ProjectSummaryCard({
  marca,
  modelo,
  numero,
  variante,
  diagnostico,
  imageUri,
}: ProjectSummaryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.imageArea}>
          <View style={styles.imageHalo} />
          {imageUri && !imageFailed ? (
            <Image
              onError={() => setImageFailed(true)}
              source={{ uri: imageUri }}
              resizeMode="contain"
              style={styles.phoneImage}
            />
          ) : (
            <Ionicons name="phone-portrait-outline" size={48} color="#94A3B8" />
          )}
        </View>
        <View style={styles.projectCopy}>
          <Text style={styles.projectNumber}>PROYECTO #{String(numero).padStart(3, '0')}</Text>
          <Text style={styles.model}>{marca} {modelo}</Text>
          <Text style={styles.variant}>{variante}</Text>
          <View style={styles.pendingBadge}>
            <Ionicons name="time" size={20} color="#E99200" />
            <Text style={styles.pendingText}>Pendiente</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />
      <Text style={styles.diagnosisLabel}>DIAGNÓSTICO REGISTRADO</Text>
      <View style={styles.chips}>
        {diagnostico.length ? diagnostico.map((falla, index) => (
          <View key={`${index}-${falla}`} style={styles.chip}>
            <Ionicons
              name={index === 0 ? 'construct' : 'phone-portrait'}
              size={23}
              color="#1576D5"
            />
            <Text style={styles.chipText}>{falla}</Text>
          </View>
        )) : (
          <Text style={styles.emptyDiagnosis}>No hay fallas registradas.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: '#E1EAF7',
    borderRadius: 31,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#284E8F',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  topRow: { flexDirection: 'row' },
  imageArea: { alignItems: 'center', height: 108, justifyContent: 'center', width: 129 },
  imageHalo: { backgroundColor: '#E5F2FF', borderRadius: 33, height: 108, position: 'absolute', width: 129 },
  phoneImage: { height: 108, width: 169 },
  projectCopy: { flex: 1, paddingLeft: 8, paddingTop: 2 },
  projectNumber: { color: '#58709D', fontSize: 13, fontWeight: '800', letterSpacing: 0.9 },
  model: { color: '#071B49', fontSize: 18, fontWeight: '800', letterSpacing: -0.65, marginTop: 2 },
  variant: { color: '#506795', fontSize: 13, fontWeight: '600', marginTop: 1 },
  pendingBadge: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFF0D5', borderRadius: 99, flexDirection: 'row', gap: 6, marginTop: 8, paddingHorizontal: 11, paddingVertical: 6 },
  pendingText: { color: '#C97900', fontSize: 12.5, fontWeight: '700' },
  divider: { backgroundColor: '#D9E5F5', height: 1, marginTop: 8 },
  diagnosisLabel: { color: '#71809E', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.7, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 7 },
  chip: { alignItems: 'center', backgroundColor: '#DFF1FC', borderRadius: 99, flexBasis: '48%', flexDirection: 'row', flexGrow: 1, gap: 7, justifyContent: 'center', minHeight: 43, paddingHorizontal: 8 },
  chipText: { color: '#173D73', fontSize: 12.5, fontWeight: '700' },
  emptyDiagnosis: { color: '#506795', fontSize: 13, paddingVertical: 10 },
});
