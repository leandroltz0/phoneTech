import type { ImageSourcePropType } from 'react-native';

/**
 * Resuelve la fuente de imagen para un proyecto.
 * 
 * Reglas de resolución:
 * 1. Si el proyecto cuenta con una URL de imagen (remota o desde el backend), se utiliza esa URI.
 * 2. Si no cuenta con URL pero el modelo coincide con un asset local disponible
 *    (por ejemplo, Samsung Galaxy A03), se utiliza el asset empaquetado correspondiente.
 * 3. En cualquier otro caso, devuelve null para que la interfaz muestre el placeholder adecuado.
 */
export function resolverImagenProyecto(
  modelo?: string,
  imagenUrl?: string | null
): ImageSourcePropType | null {
  if (imagenUrl && imagenUrl.trim()) {
    return { uri: imagenUrl };
  }

  const modeloNormalizado = (modelo ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (modeloNormalizado.includes('a03')) {
    return require('@/assets/images/phone-preview-a03.png');
  }

  return null;
}
