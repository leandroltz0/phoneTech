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
    ? 'UnlockTool compatible'
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
      ? 'help-circle'
      : 'close-circle';

  const iconColor = isSupported ? '#15803D' : isUnknown ? '#8A97A6' : '#64748B';

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="text"
      style={[styles.badge, badgeStyle, style]}
    >
      <Ionicons
        color={iconColor}
        name={iconName}
        size={14}
      />
      <Text style={[styles.label, textStyle]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  supportedBadge: {
    backgroundColor: '#E6F8EE',
  },
  unsupportedBadge: {
    backgroundColor: '#F1F4F8',
  },
  unknownBadge: {
    backgroundColor: '#F3F4F7',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  supportedLabel: {
    color: '#15803D',
  },
  unsupportedLabel: {
    color: '#64748B',
  },
  unknownLabel: {
    color: '#8A97A6',
  },
});
