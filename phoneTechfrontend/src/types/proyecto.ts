/**
 * Tipos del dominio — Proyectos de celulares
 */

export type EstadoProyecto = 'evaluacion' | 'reparacion' | 'venta' | 'vendido';

/** Falla diagnosticada de un componente */
export interface FallaDiagnostico {
  id: string;
  componente: string;       // Ej: 'Módulo', 'Tapa', 'Batería'
  descripcion: string;      // Ej: 'Roto · Sin imagen'
  icono?: string;            // Ionicons name
  confirmada: boolean;       // true = confirmada, false = sospechada
}

/** Gasto individual registrado */
export interface GastoRegistrado {
  id: string;
  concepto: string;          // Ej: 'Módulo de pantalla', 'Envío', 'Mano de obra'
  monto: number;
  fecha: string;             // ISO string
}

/** Movimiento cronológico del proyecto */
export interface MovimientoProyecto {
  id: string;
  tipo: 'creacion' | 'diagnostico' | 'compra' | 'gasto' | 'estado' | 'venta';
  descripcion: string;
  fecha: string;             // ISO string
}

export interface Proyecto {
  id: string;
  numero: number;            // Ej: 1 → se muestra como PROYECTO #001
  modelo: string;
  marca: string;
  variante?: string;         // Ej: 'SM-A035M / 64 GB'
  imagen: string;            // URL o require()
  diagnostico: string[];     // Lista de fallas seleccionadas (legacy, kept for card)
  fallas?: FallaDiagnostico[];  // Detailed diagnosis for detail screen
  estado: EstadoProyecto;
  gananciaTipo: 'estimada' | 'real';
  ganancia: number;          // En pesos argentinos
  precioCompra?: number;     // Precio pagado por el celular
  precioVentaEstimado?: number;  // Precio de venta estimado
  precioVentaFinal?: number;     // Precio final de venta (solo si vendido)
  gastos?: GastoRegistrado[];    // Gastos detallados
  totalGastos?: number;          // Suma de todos los gastos
  movimientos?: MovimientoProyecto[];  // Historial de movimientos
  fechaCreacion: string;     // ISO string
  fechaVenta?: string;       // Solo si estado === 'vendido'
}
