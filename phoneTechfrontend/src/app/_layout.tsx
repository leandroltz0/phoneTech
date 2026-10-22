import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#378CC4',
    secondary: '#246B96',
    background: '#F5F9FC',
    surface: '#FFFFFF',
    outline: '#DCE7EF',
    onSurface: '#263746',
    onSurfaceVariant: '#718398',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="seleccionar-dispositivo"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="seleccionar-telefono"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="analisis-equipo"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="guardar-proyecto"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="detalle-proyecto"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="modificar-precios"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </PaperProvider>
  );
}
