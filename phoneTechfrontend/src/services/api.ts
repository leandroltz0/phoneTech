/**
 * Cliente HTTP base de la aplicación.
 * Centraliza la URL del backend, el manejo de errores y la decodificación JSON
 * para que los servicios de dominio solo expresen la petición.
 */

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.50:8080';

/** Error de comunicación con el backend. `status === 0` significa sin conexión. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function pedirJson<T>(ruta: string, init?: RequestInit): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el backend. Verificá que esté corriendo.');
  }

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, await leerMensajeDeError(respuesta));
  }

  return (await respuesta.json()) as T;
}

/** Traduce la respuesta de error a un mensaje apto para la interfaz. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return 'Ocurrió un error inesperado.';
}

async function leerMensajeDeError(respuesta: Response): Promise<string> {
  const cuerpo = parsearProblemDetail(await respuesta.text());
  return cuerpo?.detail ?? `Error del servidor (${respuesta.status}).`;
}

/** El backend devuelve errores en formato RFC 7807 (`{ detail: "..." }`). */
function parsearProblemDetail(texto: string): { detail?: string } | null {
  try {
    return JSON.parse(texto) as { detail?: string };
  } catch {
    return null;
  }
}
