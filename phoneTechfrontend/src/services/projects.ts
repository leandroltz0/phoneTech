import type { ProjectDetailDto, ProjectDetailsDto, ProjectImageDto, ProjectSummaryDto } from '@/types/api';
import { API_URL, pedirJson } from './api';

/** Imagen seleccionada en el dispositivo (Expo ImagePicker / FormData). */
export interface ImagenNueva {
  uri: string;
  nombre: string;
  tipo: string;
}

/** GET /api/v1/projects */
export function obtenerProyectos(): Promise<ProjectSummaryDto[]> {
  return pedirJson<ProjectSummaryDto[]>('/api/v1/projects');
}

/** GET /api/v1/projects/{id} */
export function obtenerProyecto(id: number): Promise<ProjectDetailDto> {
  return pedirJson<ProjectDetailDto>(`/api/v1/projects/${id}`);
}

/** GET /api/v1/projects/{id}/details */
export function obtenerProyectoDetallado(id: number): Promise<ProjectDetailsDto> {
  return pedirJson<ProjectDetailsDto>(`/api/v1/projects/${id}/details`);
}

/** GET /api/v1/projects/{id}/images */
export function obtenerImagenesProyecto(id: number): Promise<ProjectImageDto[]> {
  return pedirJson<ProjectImageDto[]>(`/api/v1/projects/${id}/images`);
}

/** POST /api/v1/projects/{id}/images (multipart/form-data) */
export function subirImagenProyecto(id: number, imagen: ImagenNueva): Promise<ProjectImageDto> {
  const datos = new FormData();
  const archivo = { uri: imagen.uri, name: imagen.nombre, type: imagen.tipo };
  datos.append('file', archivo as unknown as Blob);

  return pedirJson<ProjectImageDto>(`/api/v1/projects/${id}/images`, {
    method: 'POST',
    body: datos,
  });
}

/** Convierte la ruta relativa que devuelve el backend (`/uploads/x.jpg`) en una URL absoluta. */
export function urlImagen(rutaRelativa: string): string {
  return `${API_URL}${rutaRelativa}`;
}
