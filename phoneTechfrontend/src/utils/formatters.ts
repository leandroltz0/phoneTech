/**
 * Funciones de formateo reutilizables para toda la aplicación.
 */

/**
 * Formatea un valor numérico a pesos argentinos según el estándar del proyecto.
 * Ejemplo: 125000 -> "$125.000"
 */
export function formatPeso(monto?: number | null, fallback = '—'): string {
  if (monto === undefined || monto === null) {
    return fallback;
  }
  return `$${monto.toLocaleString('es-AR')}`;
}

/**
 * Formatea el número identificador visible del proyecto.
 * Ejemplo: 1 -> "Proyecto #001" (o "PROYECTO #001" si uppercase es true)
 */
export function formatNumeroProyecto(numero: number, uppercase = false): string {
  const pad = String(numero).padStart(3, '0');
  return uppercase ? `PROYECTO #${pad}` : `Proyecto #${pad}`;
}

/**
 * Formatea una fecha ISO a texto legible en español.
 * Ejemplo: "2025-10-18T10:00:00Z" -> "Creado el 18 de octubre de 2025"
 */
export function formatFecha(iso: string): string {
  const d = new Date(iso);
  const dia = d.getUTCDate();
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const mes = meses[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  return `Creado el ${dia} de ${mes} de ${anio}`;
}
