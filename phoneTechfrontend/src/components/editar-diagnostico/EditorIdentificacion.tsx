import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { ESTADO_CONFIG } from '@/constants/estados';
import { Proyecto } from '@/types/proyecto';
import { formatNumeroProyecto } from '@/utils/formatters';

interface Props {
  proyecto: Proyecto;
}

export const EditorIdentificacion = ({ proyecto }: Props) => {
  const estado = ESTADO_CONFIG[proyecto.estado];

  const imageSource =
    proyecto.modelo.includes('A03')
      ? require('@/assets/images/phone-preview-a03.png')
      : { uri: proyecto.imagen };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.imagen}
            resizeMode="contain"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.modelo} numberOfLines={1}>
            {proyecto.modelo}
          </Text>

          {proyecto.variante && (
            <Text style={styles.variante} numberOfLines={1}>
              {proyecto.variante}
            </Text>
          )}

          <Text style={styles.numero}>{formatNumeroProyecto(proyecto.numero)}</Text>

          <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
            <Ionicons
              name={estado.icon}
              size={12}
              color={estado.text}
              style={styles.estadoIcon}
            />
            <Text style={[styles.estadoText, { color: estado.text }]}>
              {estado.label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  imageContainer: {
    width: 76,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  modelo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#10264C',
    lineHeight: 21,
  },
  variante: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  numero: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 14,
    marginTop: 6,
  },
  estadoIcon: {
    marginRight: 4,
  },
  estadoText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
