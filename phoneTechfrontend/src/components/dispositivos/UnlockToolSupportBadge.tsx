import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { UnlockToolSupportStatusDto } from '@/types/api';

type UnlockToolSupportBadgeProps = {
  supported?: boolean;
  status?: UnlockToolSupportStatusDto;
  style?: StyleProp<ViewStyle>;
};

/** Estado reutilizable de compatibilidad con UnlockTool para un dispositivo. */
export function UnlockToolSupportBadge({ supported, status, style }: UnlockToolSupportBadgeProps) {
  const isSupported = status !== undefined ? status === 'SUPPORTED' : Boolean(supported);
  const isUnknown = status === 'UNKNOWN';

  const label = isSupported
    ? 'Compatible con UnlockTool'
    : isUnknown
      ? 'UnlockTool sin verificar'
      : 'No compatible con UnlockTool';

  const text = isSupported
    ? 'UnlockTool'
    : isUnknown
      ? 'Sin verificar'
      : 'Sin soporte';

  const badgeStyle = isSupported
    ? styles.supportedBadge
    : isUnknown
      ? styles.unknownBadge
      : styles.unsupportedBadge;

  const textStyle = isSupported
    ? styles.supportedLabel
    : isUnknown
      ? styles.unknownLabel
      : styles.unsupportedLabel;

  const iconName = isSupported
    ? 'checkmark-circle'
    : isUnknown
      ? 'help-circle-outline'
      : 'close-circle';

  const iconColor = isSupported ? '#27866E' : isUnknown ? '#8A97A6' : '#718398';

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="text"
      style={[styles.badge, badgeStyle, style]}
    >
      <Ionicons
        color={iconColor}
        name={iconName}
        size={10}
      />
      <Text style={[styles.label, textStyle]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 3,
    marginTop: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  supportedBadge: { backgroundColor: '#DDF5E9' },
  unsupportedBadge: { backgroundColor: '#EEF2F5' },
  unknownBadge: { backgroundColor: '#F1F4F7' },
  label: { fontSize: 8.5, fontWeight: '700' },
  supportedLabel: { color: '#27866E' },
  unsupportedLabel: { color: '#718398' },
  unknownLabel: { color: '#8A97A6' },
});
