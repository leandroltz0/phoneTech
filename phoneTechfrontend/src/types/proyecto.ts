/**
 * Tipos del dominio — Proyectos de celulares
 */

export type EstadoProyecto = 'evaluacion' | 'reparacion' | 'venta' | 'vendido';

export interface Proyecto {
  id: string;
  numero: number; // Ej: 1 → se muestra como PROYECTO #001
  modelo: string;
  marca: string;
  imagen: string; // URL o require()
  diagnostico: string[]; // Lista de fallas seleccionadas
  estado: EstadoProyecto;
  gananciaTipo: 'estimada' | 'real';
  ganancia: number; // En pesos argentinos
  fechaCreacion: string; // ISO string
  fechaVenta?: string; // Solo si estado === 'vendido'
}
