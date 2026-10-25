/**
 * Contratos de la API del backend (Spring Boot).
 * Espejan exactamente los DTO que devuelve el servidor: ProjectSummaryResponse,
 * ProjectDetailResponse, ProjectFaultResponse y ProjectImageResponse.
 */

export type ProjectStatusDto =
  | 'PENDING'
  | 'IN_REPAIR'
  | 'READY_TO_SELL'
  | 'FOR_SALE'
  | 'SOLD';

/** GET /api/v1/projects — fila liviana para la pantalla de listado. */
export interface ProjectSummaryDto {
  id: number;
  projectNumber: number;
  phoneModel: string;
  estimatedProfit: number | null;
  diagnosis: string;
  status: ProjectStatusDto;
}

/** Falla individual dentro del diagnóstico del detalle. */
export interface ProjectFaultDto {
  componentCode: string;
  componentName: string;
  faultCode: string;
  faultName: string;
  description: string;
  imageUri: string | null;
  confirmed: boolean;
  notes: string | null;
}

/** GET /api/v1/projects/{id} — detalle completo con la colección de fallas. */
export interface ProjectDetailDto {
  id: number;
  projectNumber: number;
  phoneModel: string;
  estimatedProfit: number | null;
  status: ProjectStatusDto;
  createdAt: string;
  diagnosis: ProjectFaultDto[];
}

/** GET/POST /api/v1/projects/{id}/images */
export interface ProjectImageDto {
  id: number;
  projectId: number;
  fileName: string;
  url: string;
  sortOrder: number;
}
