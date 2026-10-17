import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export default function CrearProyectoScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityLabel="Volver a proyectos"
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={() => router.replace('/(tabs)/proyectos')}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={21} color={Colors.proyectoNuevo.title} />
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo proyecto</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.illustration}>
            <View style={[styles.orb, styles.orbTop]} />
            <View style={[styles.orb, styles.orbBottom]} />
            <View style={styles.phoneFrame}>
              <View style={styles.phoneScreen}>
                <View style={styles.speaker} />
                <Text style={styles.questionMark}>?</Text>
              </View>
            </View>
          </View>

          <Text style={styles.kicker}>PRIMER PASO</Text>
          <Text style={styles.heading}>¿Qué dispositivo{`\n`}compraste?</Text>
          <Text style={styles.description}>
            Seleccioná el modelo para comenzar a{`\n`}registrar tu proyecto.
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.86}
            onPress={() => router.push('/seleccionar-dispositivo')}
            style={styles.selectButton}
          >
            <Ionicons name="add" size={19} color={Colors.surface} />
            <Text style={styles.selectButtonText}>Seleccionar dispositivo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Elegí el dispositivo antes de cargar sus datos.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.proyectoNuevo.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
    paddingTop: 12,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    shadowColor: Colors.proyectoNuevo.title,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 9,
    width: 40,
  },
  title: {
    color: Colors.proyectoNuevo.title,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.55,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 35,
  },
  illustration: {
    alignItems: 'center',
    backgroundColor: Colors.proyectoNuevo.artwork,
    borderRadius: 48,
    height: 198,
    justifyContent: 'center',
    marginBottom: 29,
    shadowColor: Colors.proyectoNuevo.artworkShadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    width: 198,
  },
  orb: {
    backgroundColor: Colors.proyectoNuevo.artworkBlue,
    borderRadius: 50,
    position: 'absolute',
  },
  orbTop: {
    height: 69,
    right: -16,
    top: 19,
    width: 69,
  },
  orbBottom: {
    bottom: 15,
    height: 37,
    left: -10,
    width: 37,
  },
  phoneFrame: {
    backgroundColor: Colors.proyectoNuevo.action,
    borderRadius: 20,
    height: 130,
    padding: 5,
    shadowColor: Colors.proyectoNuevo.action,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    width: 78,
  },
  phoneScreen: {
    alignItems: 'center',
    backgroundColor: Colors.proyectoNuevo.deviceScreen,
    borderColor: Colors.surface,
    borderRadius: 15,
    borderWidth: 4,
    flex: 1,
    paddingTop: 8,
  },
  speaker: {
    backgroundColor: Colors.proyectoNuevo.action,
    borderRadius: 10,
    height: 4,
    width: 22,
  },
  questionMark: {
    color: Colors.proyectoNuevo.action,
    fontSize: 41,
    fontWeight: '700',
    lineHeight: 57,
  },
  kicker: {
    color: Colors.proyectoNuevo.action,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  heading: {
    color: Colors.proyectoNuevo.title,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 24,
    textAlign: 'center',
  },
  description: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    textAlign: 'center',
  },
  selectButton: {
    alignItems: 'center',
    backgroundColor: Colors.proyectoNuevo.action,
    borderRadius: 17,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 20,
    shadowColor: Colors.proyectoNuevo.action,
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.28,
    shadowRadius: 15,
  },
  selectButtonText: {
    color: Colors.surface,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },
  hint: {
    color: Colors.proyectoNuevo.muted,
    fontSize: 10,
    marginBottom: 12,
    textAlign: 'center',
  },
});
