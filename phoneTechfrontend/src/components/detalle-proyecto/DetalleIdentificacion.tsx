import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { ESTADO_CONFIG } from '@/constants/estados';
import { Proyecto } from '@/types/proyecto';
import { resolverImagenProyecto } from '@/utils/images';
import { ProjectIdentityHeader } from '@/components/proyectos/ProjectIdentityHeader';

interface Props {
  proyecto: Proyecto;
}

export const DetalleIdentificacion = ({ proyecto }: Props) => {
  const estado = ESTADO_CONFIG[proyecto.estado];

  const imageSource = resolverImagenProyecto(proyecto.modelo, proyecto.imagen);

  return (
    <View style={styles.card}>
      <ProjectIdentityHeader
        numero={proyecto.numero}
        modelo={proyecto.modelo}
        variante={proyecto.variante}
        imageSource={imageSource ?? require('@/assets/images/phone-preview-a03.png')}
        status={{
          label: estado.label,
          icon: estado.icon,
          backgroundColor: estado.bg,
          textColor: estado.text,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
