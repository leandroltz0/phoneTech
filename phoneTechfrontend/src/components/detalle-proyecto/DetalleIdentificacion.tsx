import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Proyecto, EstadoProyecto } from '@/types/proyecto';

interface Props {
  proyecto: Proyecto;
}

const formatNumero = (n: number) => `Proyecto #${String(n).padStart(3, '0')}`;

const formatFecha = (iso: string) => {
  const d = new Date(iso);
  const dia = d.getUTCDate();
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const mes = meses[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  return `Creado el ${dia} de ${mes} de ${anio}`;
};

const estadoConfig: Record<
  EstadoProyecto,
  { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  evaluacion: { label: 'En evaluación', ...Colors.estados.evaluacion, icon: 'time-outline' },
  reparacion: { label: 'En reparación', ...Colors.estados.reparacion, icon: 'checkmark-circle' },
  venta: { label: 'En venta', ...Colors.estados.venta, icon: 'pricetag-outline' },
  vendido: { label: 'Vendido', ...Colors.estados.vendido, icon: 'checkmark-done-circle' },
};

export const DetalleIdentificacion = ({ proyecto }: Props) => {
  const estado = estadoConfig[proyecto.estado];

  const imageSource =
    proyecto.modelo.includes('A03')
      ? require('@/assets/images/phone-preview-a03.png')
      : { uri: proyecto.imagen };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Contenedor de la imagen con fondo suave */}
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.imagen}
            resizeMode="contain"
          />
        </View>

        {/* Información del dispositivo */}
        <View style={styles.info}>
          <Text style={styles.modelo} numberOfLines={2}>
            {proyecto.modelo}
          </Text>

          {proyecto.variante && (
            <Text style={styles.variante} numberOfLines={1}>
              {proyecto.variante}
            </Text>
          )}

          {/* Badge de estado con icono */}
          <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
            <Ionicons name={estado.icon} size={14} color={estado.text} style={styles.estadoIcon} />
            <Text style={[styles.estadoText, { color: estado.text }]}>
              {estado.label}
            </Text>
          </View>

          <Text style={styles.projectInfo}>
            {formatNumero(proyecto.numero)}
          </Text>
          <Text style={styles.fecha}>
            {formatFecha(proyecto.fechaCreacion)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  imageContainer: {
    width: 96,
    height: 116,
    borderRadius: 14,
    backgroundColor: '#EFF7FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
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
    fontSize: 19,
    fontWeight: '700',
    color: '#10264C',
    lineHeight: 23,
  },
  variante: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
    marginBottom: 6,
    fontWeight: '500',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  estadoIcon: {
    marginRight: 5,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectInfo: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  fecha: {
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
});

