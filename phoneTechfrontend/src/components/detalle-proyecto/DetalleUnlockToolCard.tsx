import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { UnlockToolSupportBadge } from '@/components/dispositivos/UnlockToolSupportBadge';

interface Props {
  supported: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Mini componente contenedor independiente para mostrar el soporte
 * de UnlockTool del dispositivo justo debajo del encabezado.
 */
export const DetalleUnlockToolCard = ({ supported, style }: Props) => {
  return (
    <View
      accessibilityLabel={`Soporte UnlockTool: ${supported ? 'Compatible' : 'Sin soporte'}`}
      accessibilityRole="summary"
      style={[styles.card, style]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconWrapper,
            supported ? styles.iconWrapperSupported : styles.iconWrapperUnsupported,
          ]}
        >
          <Ionicons
            color={supported ? '#27866E' : '#718398'}
            name={supported ? 'shield-checkmark' : 'shield-outline'}
            size={16}
          />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.title}>UnlockTool</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {supported ? 'Compatible con este modelo' : 'Sin soporte para este modelo'}
          </Text>
        </View>
      </View>

      <UnlockToolSupportBadge supported={supported} style={styles.badge} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#1A334A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  leftSection: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginRight: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  iconWrapperSupported: {
    backgroundColor: '#E8F7F0',
  },
  iconWrapperUnsupported: {
    backgroundColor: '#EEF2F5',
  },
  textGroup: {
    flex: 1,
  },
  title: {
    color: '#10264C',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  badge: {
    marginTop: 0,
  },
});
