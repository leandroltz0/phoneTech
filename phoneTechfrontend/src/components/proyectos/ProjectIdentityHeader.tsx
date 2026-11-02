import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

export interface ProjectIdentityHeaderStatus {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  textColor: string;
}

interface ProjectIdentityHeaderProps {
  numero: number;
  modelo: string;
  variante?: string;
  imageSource?: ImageSourcePropType;
  status: ProjectIdentityHeaderStatus;
}

export function ProjectIdentityHeader({
  numero,
  modelo,
  variante,
  imageSource,
  status,
}: ProjectIdentityHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={styles.topRow}>
      <View style={styles.imageArea}>
        <View style={styles.imageHalo} />
        {imageSource && !imageFailed ? (
          <Image
            onError={() => setImageFailed(true)}
            source={imageSource}
            resizeMode="contain"
            style={styles.phoneImage}
          />
        ) : (
          <Ionicons name="phone-portrait-outline" size={48} color="#94A3B8" />
        )}
      </View>

      <View style={styles.projectCopy}>
        <Text style={styles.projectNumber}>PROYECTO #{String(numero).padStart(3, '0')}</Text>
        <Text style={styles.model} numberOfLines={2}>{modelo}</Text>
        {variante ? (
          <Text style={styles.variant} numberOfLines={2}>{variante}</Text>
        ) : null}
        <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
          <Ionicons name={status.icon} size={16} color={status.textColor} />
          <Text style={[styles.statusText, { color: status.textColor }]}>{status.label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row' },
  imageArea: { alignItems: 'center', height: 108, justifyContent: 'center', width: 108 },
  imageHalo: { backgroundColor: '#E5F2FF', borderRadius: 24, height: 104, position: 'absolute', width: 96 },
  phoneImage: { height: 104, width: 108 },
  projectCopy: { flex: 1, paddingLeft: 10, paddingTop: 2 },
  projectNumber: { color: '#58709D', fontSize: 11, fontWeight: '800', letterSpacing: 0.75 },
  model: { color: '#071B49', fontSize: 18, fontWeight: '800', letterSpacing: -0.55, lineHeight: 22, marginTop: 2 },
  variant: { color: '#506795', fontSize: 12.5, fontWeight: '600', lineHeight: 17, marginTop: 2 },
  statusBadge: { alignItems: 'center', alignSelf: 'flex-start', borderRadius: 99, flexDirection: 'row', gap: 5, marginTop: 7, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },
});
