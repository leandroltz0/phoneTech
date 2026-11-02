import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProjectIdentityHeader } from '@/components/proyectos/ProjectIdentityHeader';

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
  return (
    <View style={styles.card}>
      <ProjectIdentityHeader
        numero={numero}
        modelo={`${marca} ${modelo}`.trim()}
        variante={variante}
        imageSource={imageUri ? { uri: imageUri } : undefined}
        status={{
          label: 'Pendiente',
          icon: 'time',
          backgroundColor: '#FFF0D5',
          textColor: '#C97900',
        }}
      />

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
  divider: { backgroundColor: '#D9E5F5', height: 1, marginTop: 8 },
  diagnosisLabel: { color: '#71809E', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.7, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 7 },
  chip: { alignItems: 'center', backgroundColor: '#DFF1FC', borderRadius: 99, flexBasis: '48%', flexDirection: 'row', flexGrow: 1, gap: 7, justifyContent: 'center', minHeight: 43, paddingHorizontal: 8 },
  chipText: { color: '#173D73', fontSize: 12.5, fontWeight: '700' },
  emptyDiagnosis: { color: '#506795', fontSize: 13, paddingVertical: 10 },
});
