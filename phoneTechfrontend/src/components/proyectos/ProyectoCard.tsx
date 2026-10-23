import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '@/constants/colors';
import { ESTADO_CONFIG } from '@/constants/estados';
import { Proyecto } from '@/types/proyecto';
import { formatNumeroProyecto, formatPeso } from '@/utils/formatters';

interface Props {
  proyecto: Proyecto;
  onPress?: () => void;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export const ProyectoCard = ({ proyecto, onPress }: Props) => {
  const { label, bg, text } = ESTADO_CONFIG[proyecto.estado];

  return (
    <Card style={styles.card} onPress={onPress}>
      {/* Número de proyecto */}
      <View style={styles.header}>
        <Text style={styles.numero}>{formatNumeroProyecto(proyecto.numero, true)}</Text>
      </View>

      {/* Contenido principal: imagen + info */}
      <View style={styles.body}>
        <Image
          source={{ uri: proyecto.imagen }}
          style={styles.imagen}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text style={styles.modelo} numberOfLines={1}>
            {proyecto.modelo}
          </Text>

          <Text style={styles.gananciaTipo}>
            Ganancia {proyecto.gananciaTipo}{' '}
            <Text style={styles.gananciaValor}>{formatPeso(proyecto.ganancia)}</Text>
          </Text>

          <Text style={styles.diagnosticoLabel}>
            Diagnóstico:{' '}
            <Text style={styles.diagnosticoValor}>
              {proyecto.diagnostico.join(', ')}
            </Text>
          </Text>
        </View>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Estado */}
      <View style={styles.footer}>
        <Text style={styles.estadoLabel}>Estado</Text>
        <View style={[styles.estadoBadge, { backgroundColor: bg }]}>
          <Text style={[styles.estadoText, { color: text }]}>{label}</Text>
        </View>
      </View>
    </Card>
  );
};

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: Colors.border,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  numero: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  imagen: {
    width: 72,
    height: 88,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  modelo: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textMain,
  },
  gananciaTipo: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  gananciaValor: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.profit,
  },
  diagnosticoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  diagnosticoValor: {
    color: Colors.textMain,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  estadoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
