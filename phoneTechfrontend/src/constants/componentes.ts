import { Ionicons } from '@expo/vector-icons';

/**
 * Catálogo de componentes disponibles para diagnóstico.
 * Se utiliza en la pantalla de edición de diagnóstico y su grilla de componentes.
 */

export interface ComponenteDiagnostico {
  id: string;
  nombre: string;
  icono: keyof typeof Ionicons.glyphMap;
  fallasPreDefinidas: string[];
}

export const COMPONENTES_DIAGNOSTICO: ComponenteDiagnostico[] = [
  {
    id: 'modulo',
    nombre: 'Módulo',
    icono: 'phone-portrait-outline',
    fallasPreDefinidas: [
      'Módulo roto',
      'Sin imagen',
      'Falla táctil',
      'Manchas o líneas',
    ],
  },
  {
    id: 'camara',
    nombre: 'Cámara',
    icono: 'camera-outline',
    fallasPreDefinidas: [
      'Cámara sin funcionar',
      'Vidrio de cámara roto',
      'Lente dañado',
      'Cámara desenfocada',
    ],
  },
  {
    id: 'tapa',
    nombre: 'Tapa',
    icono: 'tablet-portrait-outline',
    fallasPreDefinidas: [
      'Tapa trasera rota',
      'Marco doblado',
      'Carcasa dañada',
    ],
  },
  {
    id: 'bateria',
    nombre: 'Batería',
    icono: 'battery-dead-outline',
    fallasPreDefinidas: [
      'Batería agotada',
      'No retiene carga',
      'Batería hinchada',
    ],
  },
  {
    id: 'carga',
    nombre: 'Carga',
    icono: 'battery-charging-outline',
    fallasPreDefinidas: [
      'Pin de carga dañado',
      'No carga',
      'Flex de carga dañado',
      'Carga lenta',
    ],
  },
  {
    id: 'botones',
    nombre: 'Botones',
    icono: 'radio-button-on-outline',
    fallasPreDefinidas: [
      'Botón de encendido roto',
      'Botones de volumen dañados',
      'Flex dañado',
    ],
  },
];

/** Obtener el ID del componente al que pertenece una falla según su nombre */
export function obtenerComponenteIdDeFalla(componente: string): string | null {
  const comp = componente.toLowerCase();

  if (
    comp.includes('módulo') || comp.includes('modulo') ||
    comp.includes('pantalla') || comp.includes('display') ||
    comp.includes('táctil') || comp.includes('tactil')
  ) {
    return 'modulo';
  }
  if (comp.includes('cámara') || comp.includes('camara') || comp.includes('lente')) {
    return 'camara';
  }
  if (comp.includes('tapa') || comp.includes('carcasa') || comp.includes('marco')) {
    return 'tapa';
  }
  if (comp.includes('batería') || comp.includes('bateria')) {
    return 'bateria';
  }
  if (comp.includes('pin') || comp.includes('carga') || comp.includes('flex de carga')) {
    return 'carga';
  }
  if (
    comp.includes('botón') || comp.includes('boton') || comp.includes('botones') ||
    comp.includes('power') || comp.includes('volumen')
  ) {
    return 'botones';
  }

  return null;
}

/** Obtener el ícono correspondiente a un nombre de componente */
export function getIconForComponente(
  componente: string
): keyof typeof Ionicons.glyphMap {
  const comp = componente.toLowerCase();

  if (
    comp.includes('módulo') || comp.includes('modulo') ||
    comp.includes('pantalla') || comp.includes('display')
  ) {
    return 'phone-portrait-outline';
  }
  if (comp.includes('tapa') || comp.includes('carcasa') || comp.includes('marco')) {
    return 'tablet-portrait-outline';
  }
  if (comp.includes('pin') || comp.includes('carga')) {
    return 'battery-charging-outline';
  }
  if (comp.includes('batería') || comp.includes('bateria')) {
    return 'battery-dead-outline';
  }
  if (comp.includes('cámara') || comp.includes('camara') || comp.includes('lente')) {
    return 'camera-outline';
  }
  if (
    comp.includes('botón') || comp.includes('boton') ||
    comp.includes('power') || comp.includes('volumen')
  ) {
    return 'radio-button-on-outline';
  }
  if (comp.includes('placa') || comp.includes('humedad') || comp.includes('corto')) {
    return 'hardware-chip-outline';
  }
  return 'construct-outline';
}
