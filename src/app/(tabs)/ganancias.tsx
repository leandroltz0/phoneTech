import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export default function GananciasScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Ganancias</Text>
        <Text style={styles.subtitulo}>Resumen de tu negocio</Text>
        <Text style={styles.placeholder}>Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textMain,
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    marginTop: 40,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
