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
  imageUrl: string | null;
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

/** Soporte de UnlockTool devuelto por el backend. */
export type UnlockToolSupportStatusDto = 'SUPPORTED' | 'UNSUPPORTED' | 'UNKNOWN';

/** GET /api/v1/devices — item del listado de dispositivos. */
export interface DeviceSummaryDto {
  id: number;
  brand: string;
  commercialName: string;
  imageUri: string | null;
  unlockToolStatus: UnlockToolSupportStatusDto;
}

/** GET /api/v1/devices — respuesta paginada del catálogo de dispositivos. */
export interface DevicePageDto {
  items: DeviceSummaryDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/** GET /api/v1/devices/{id} y POST /api/v1/devices/{id}/image — detalle de un dispositivo. */
export interface DeviceDetailDto {
  id: number;
  brand: string;
  commercialName: string;
  imageUri: string | null;
  unlockToolStatus: UnlockToolSupportStatusDto;
}

export interface UnlockToolSupportDto {
  status: UnlockToolSupportStatusDto;
  displayName?: string | null;
  description?: string | null;
  methods?: string[];
  lastVerifiedAt?: string | null;
}

export interface DeviceResaleEstimateDto {
  condition: string;
  amount: number;
  currency: string;
}

export interface DeviceSelectionVariantDto {
  id: number;
  modelCode: string;
  variantName?: string | null;
  ramGb: number | null;
  storageGb: number | null;
  chipset?: string | null;
  region?: string | null;
  unlockToolStatus: UnlockToolSupportStatusDto;
  imageUri?: string | null;
  isCommon?: boolean;
  resaleEstimate?: DeviceResaleEstimateDto | null;
}

/** GET /api/v1/devices/{deviceId}/variants */
export interface DeviceVariantDto {
  id: number;
  code: string;
  ram: string;
  storage: string;
  resalePrice: number | null;
  isCommon: boolean;
  imageUri: string | null;
}

export interface DiagnosisFaultDto {
  id: number;
  code: string;
  name: string;
  description: string;
  imageUri?: string | null;
  sortOrder?: number;
  active?: boolean;
}

export interface DiagnosisCategoryDto {
  id: number | null;
  code: string;
  name: string;
  description: string | null;
  icon?: string | null;
  sortOrder?: number;
  active?: boolean;
  faults: DiagnosisFaultDto[];
}

export type SaleConditionDto = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED';

export interface RepairPriceCalculationRequestDto {
  deviceId: number;
  variantId: number;
  faultIds: number[];
  saleCondition?: SaleConditionDto;
}

export interface RepairPriceCalculationResponseDto {
  deviceId: number;
  variantId: number;
  resalePrice: number;
  repairPartsCost: number;
  minimumProfit: number;
  maximumPurchasePrice: number;
  projectedProfit: number;
  purchaseAllowed: boolean;
  currency?: string;
}

export interface DeviceSelectionDataDto {
  device: DeviceSummaryDto;
  unlockTool: UnlockToolSupportDto;
  variants: DeviceSelectionVariantDto[];
  diagnosisCategories: DiagnosisCategoryDto[];
}
