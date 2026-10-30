import type {
  RepairPriceCalculationRequestDto,
  RepairPriceCalculationResponseDto,
} from '@/types/api';
import { pedirJson } from './api';

/** POST /api/v1/repair-price-calculations */
export function calcularPrecioReparacion(
  request: RepairPriceCalculationRequestDto,
): Promise<RepairPriceCalculationResponseDto> {
  return pedirJson<RepairPriceCalculationResponseDto>('/api/v1/repair-price-calculations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}
