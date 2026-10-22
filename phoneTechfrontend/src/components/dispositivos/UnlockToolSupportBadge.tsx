import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type UnlockToolSupportBadgeProps = {
  supported: boolean;
};

/** Estado reutilizable de compatibilidad con UnlockTool para un dispositivo. */
export function UnlockToolSupportBadge({ supported }: UnlockToolSupportBadgeProps) {
  const label = supported ? 'Compatible con UnlockTool' : 'No compatible con UnlockTool';

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="text"
      style={[styles.badge, supported ? styles.supportedBadge : styles.unsupportedBadge]}
    >
      <Ionicons
        color={supported ? '#27866E' : '#718398'}
        name={supported ? 'checkmark-circle' : 'close-circle'}
        size={10}
      />
      <Text style={[styles.label, supported ? styles.supportedLabel : styles.unsupportedLabel]}>
        {supported ? 'UnlockTool' : 'Sin soporte'}
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
  label: { fontSize: 8.5, fontWeight: '700' },
  supportedLabel: { color: '#27866E' },
  unsupportedLabel: { color: '#718398' },
});
