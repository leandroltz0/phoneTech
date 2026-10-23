import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { EstadoProyecto } from '@/types/proyecto';

export interface EstadoConfigItem {
  label: string;
  bg: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/**
 * Configuración centralizada de estados de proyectos (etiquetas, colores e iconos).
 */
export const ESTADO_CONFIG: Record<EstadoProyecto, EstadoConfigItem> = {
  evaluacion: {
    label: 'En evaluación',
    ...Colors.estados.evaluacion,
    icon: 'time-outline',
  },
  reparacion: {
    label: 'En reparación',
    ...Colors.estados.reparacion,
    icon: 'checkmark-circle',
  },
  venta: {
    label: 'En venta',
    ...Colors.estados.venta,
    icon: 'pricetag-outline',
  },
  vendido: {
    label: 'Vendido',
    ...Colors.estados.vendido,
    icon: 'checkmark-done-circle',
  },
};
