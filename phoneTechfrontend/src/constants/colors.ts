/**
 * Paleta de colores oficial del proyecto — Soft Blue Tech
 * Usar siempre estas constantes, nunca hardcodear colores en los componentes.
 */

export const Colors = {
  // Fondos
  background: '#F5F9FC',
  surface: '#FFFFFF',
  surfaceAlt: '#DFF1FC',

  // Marca
  primary: '#378CC4',
  primaryDark: '#246B96',

  // Textos
  textMain: '#263746',
  textSecondary: '#718398',

  // Bordes
  border: '#DCE7EF',

  // Resultado positivo
  profit: '#27866E',

  // Pantalla de análisis del equipo
  analisis: {
    title: '#071B49',
    softBlue: '#E9F4FF',
    softBlueStrong: '#D7ECFF',
    ringTrack: '#DBEAFE',
    success: '#0DAA77',
    successSoft: '#DDF8F0',
    warning: '#F6A400',
    warningSoft: '#FFF4D8',
    divider: '#D7E5F8',
    shadow: '#284E8F',
  },

  // Panel de ganancias
  dashboard: {
    hero: '#438FE8',
    heroLight: '#5BB6E8',
    heroOverlay: 'rgba(255, 255, 255, 0.16)',
    chartBar: '#C6E6F7',
    chartBarActive: '#378CC4',
    successBackground: '#E5F7EE',
    infoBackground: '#EAF6FD',
    investmentBorder: '#C9E4F5',
    investmentTrack: '#B6E2F5',
  },

  // Estados de proyecto (fondo / texto)
  estados: {
    evaluacion: { bg: '#EDE9FE', text: '#6D55A1' },
    reparacion: { bg: '#FFF1D6', text: '#946315' },
    venta: { bg: '#DFF1FC', text: '#246B96' },
    vendido: { bg: '#DDF5E9', text: '#237653' },
  },

  // Flujo de creación de proyecto
  proyectoNuevo: {
    background: '#E8EBFF',
    title: '#10264C',
    muted: '#97A4BF',
    action: '#4B87F7',
    actionLight: '#5B96F8',
    artwork: '#FCFCFF',
    artworkBlue: '#DBEDFC',
    deviceScreen: '#E6F3FD',
    artworkShadow: '#536FA7',
    modelText: '#020C1E',
    divider: '#DBE1F2',
    buttonDisabled: '#D9E2F0',
    buttonDisabledText: '#96ADD0',
  },
} as const;
