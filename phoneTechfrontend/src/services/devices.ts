import type {
  DeviceDetailDto,
  DevicePageDto,
  DeviceSelectionDataDto,
} from '@/types/api';
import { API_URL, pedirJson } from './api';

export interface ObtenerDispositivosParams {
  query?: string;
  page?: number;
  size?: number;
}

/** Archivo de imagen seleccionado para subir (Expo ImagePicker / FormData). */
export interface ImagenDispositivoNueva {
  uri: string;
  nombre: string;
  tipo: string;
}

/** GET /api/v1/devices */
export function obtenerDispositivos(
  params?: ObtenerDispositivosParams
): Promise<DevicePageDto> {
  const queryParams = new URLSearchParams();
  if (params?.query && params.query.trim()) {
    queryParams.append('query', params.query.trim());
  }
  if (params?.page !== undefined) {
    queryParams.append('page', String(params.page));
  }
  if (params?.size !== undefined) {
    queryParams.append('size', String(params.size));
  }

  const queryStr = queryParams.toString();
  const ruta = `/api/v1/devices${queryStr ? `?${queryStr}` : ''}`;
  return pedirJson<DevicePageDto>(ruta);
}

/** GET /api/v1/devices/{id} */
export function obtenerDispositivo(id: number): Promise<DeviceDetailDto> {
  return pedirJson<DeviceDetailDto>(`/api/v1/devices/${id}`);
}

/** GET /api/v1/devices/{id}/selection-data */
export function obtenerDatosSeleccionDispositivo(
  id: number,
): Promise<DeviceSelectionDataDto> {
  return pedirJson<DeviceSelectionDataDto>(`/api/v1/devices/${id}/selection-data`);
}

/** POST /api/v1/devices/{id}/image (multipart/form-data) */
export function subirImagenDispositivo(
  id: number,
  imagen: ImagenDispositivoNueva
): Promise<DeviceDetailDto> {
  const datos = new FormData();
  const archivo = { uri: imagen.uri, name: imagen.nombre, type: imagen.tipo };
  datos.append('file', archivo as unknown as Blob);

  return pedirJson<DeviceDetailDto>(`/api/v1/devices/${id}/image`, {
    method: 'POST',
    body: datos,
  });
}

/** POST /api/v1/devices/{deviceId}/variants/{variantId}/image */
export function subirImagenVariante(
  deviceId: number,
  variantId: number,
  imagen: ImagenDispositivoNueva,
): Promise<DeviceSelectionDataDto> {
  const datos = new FormData();
  const archivo = { uri: imagen.uri, name: imagen.nombre, type: imagen.tipo };
  datos.append('file', archivo as unknown as Blob);

  return pedirJson<DeviceSelectionDataDto>(
    `/api/v1/devices/${deviceId}/variants/${variantId}/image`,
    { method: 'POST', body: datos },
  );
}

/** Convierte la ruta relativa que devuelve el backend (`/uploads/x.jpg`) en una URL absoluta. */
export function urlImagenDispositivo(rutaRelativa: string | null | undefined): string | null {
  if (!rutaRelativa) return null;
  if (rutaRelativa.startsWith('http://') || rutaRelativa.startsWith('https://')) {
    return rutaRelativa;
  }
  return `${API_URL}${rutaRelativa}`;
}
