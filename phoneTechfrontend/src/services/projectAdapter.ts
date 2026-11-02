import { getIconForComponente } from '@/constants/componentes';
import type { ProjectDetailsDto, ProjectStatusDto, ProjectSummaryDto } from '@/types/api';
import type { EstadoProyecto, FallaDiagnostico, Proyecto } from '@/types/proyecto';
import { urlImagen } from './projects';

/** Estado del backend → estado del dominio de la app. */
const ESTADO: Record<ProjectStatusDto, EstadoProyecto> = {
  PENDING: 'evaluacion',
  IN_REPAIR: 'reparacion',
  READY_TO_SELL: 'venta',
  FOR_SALE: 'venta',
  SOLD: 'vendido',
};

/** GET /api/v1/projects → Proyecto con su imagen principal, si tiene. */
export function adaptarProyectoResumen(resumen: ProjectSummaryDto): Proyecto {
  return {
    ...crearBase(resumen.id, resumen.projectNumber, resumen.phoneModel, resumen.status, resumen.estimatedProfit),
    imagen: resumen.imageUrl ? urlImagen(resumen.imageUrl) : '',
    diagnostico: partirDiagnostico(resumen.diagnosis),
    gananciaTipo: resumen.status === 'SOLD' ? 'real' : 'estimada',
  };
}

/** GET /api/v1/projects/{id}/details → Proyecto completo. */
export function adaptarProyectoDetalle(detalle: ProjectDetailsDto): Proyecto {
  const fallas: FallaDiagnostico[] = detalle.diagnosis.map((fallo) => ({
    id: `${fallo.componentCode}-${fallo.faultCode}`,
    componente: fallo.componentName,
    descripcion: [fallo.faultName, fallo.description].filter(Boolean).join(' · '),
    icono: getIconForComponente(fallo.componentName),
    confirmada: fallo.confirmed,
  }));

  return {
    ...crearBase(
      detalle.id,
      detalle.projectNumber,
      detalle.phoneModel,
      detalle.status,
      detalle.estimatedProfit
    ),
    imagen: detalle.imageUrl ? urlImagen(detalle.imageUrl) : '',
    diagnostico: fallas.map((f) => `${f.componente} ${f.descripcion}`),
    fallas,
    fechaCreacion: detalle.createdAt,
    gananciaTipo: detalle.status === 'SOLD' ? 'real' : 'estimada',
    variante: formatearVariante(detalle),
    precioVentaEstimado: detalle.salePrice ?? undefined,
    totalGastos: detalle.repairCost,
    unlockToolStatus: detalle.unlockToolStatus,
    unlockToolSupported: detalle.unlockToolStatus === 'SUPPORTED',
  };
}

function formatearVariante(detalle: ProjectDetailsDto): string | undefined {
  const codigo = detalle.modelCode || detalle.variantName;
  const especificaciones = [
    typeof detalle.ramGb === 'number' ? `${detalle.ramGb} GB RAM` : null,
    typeof detalle.storageGb === 'number' ? `${detalle.storageGb} GB almacenamiento` : null,
  ].filter((valor): valor is string => valor !== null);

  if (!codigo && especificaciones.length === 0) return undefined;
  if (!codigo) return especificaciones.join(' / ');
  if (especificaciones.length === 0) return codigo;

  return `${codigo} · ${especificaciones.join(' / ')}`;
}

function crearBase(
  id: number,
  numero: number,
  modelo: string,
  status: ProjectStatusDto,
  ganancia: number | null
): Omit<Proyecto, 'imagen' | 'gananciaTipo'> {
  return {
    id: String(id),
    numero,
    modelo,
    marca: extraerMarca(modelo),
    diagnostico: [],
    estado: ESTADO[status],
    ganancia: ganancia ?? 0,
  };
}

/** El diagnóstico del resumen viene como `"Módulo roto, Tapa dañada"`. */
function partirDiagnostico(diagnosis: string): string[] {
  if (!diagnosis.trim()) return [];
  return diagnosis
    .split(', ')
    .map((item) => item.trim())
    .filter(Boolean);
}

function extraerMarca(phoneModel: string): string {
  const [primeraPalabra] = phoneModel.trim().split(' ');
  return primeraPalabra ?? '';
}
