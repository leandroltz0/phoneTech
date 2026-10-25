import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '@/services/api';
import { adaptarProyectoDetalle } from '@/services/projectAdapter';
import { obtenerProyectoCompleto } from '@/services/projects';
import { EstadoProyecto, Proyecto } from '@/types/proyecto';

export interface UseProyectoDetalle {
  proyecto: Proyecto | null;
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  /** Cambio optimista local. El PUT de estado todavía no existe en el backend. */
  cambiarEstadoLocal: (estado: EstadoProyecto) => void;
}

type ProyectoCompleto = Awaited<ReturnType<typeof obtenerProyectoCompleto>>;

/** Detalle de un proyecto (GET /{id} + GET /{id}/images en paralelo). */
export function useProyectoDetalle(id?: string): UseProyectoDetalle {
  const idNumerico = Number(id);
  const idValido = Boolean(id) && !Number.isNaN(idNumerico);

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [cargando, setCargando] = useState(idValido);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(idValido ? null : 'Proyecto no encontrado');

  const aplicarExito = useCallback(({ detalle, imagenes }: ProyectoCompleto) => {
    setProyecto(adaptarProyectoDetalle(detalle, imagenes));
    setError(null);
    setCargando(false);
    setRefrescando(false);
  }, []);

  const aplicarFallo = useCallback((e: unknown) => {
    setProyecto(null);
    setError(mensajeDeError(e));
    setCargando(false);
    setRefrescando(false);
  }, []);

  useEffect(() => {
    if (!idValido) return;
    let activo = true;
    void obtenerProyectoCompleto(idNumerico).then(
      (completo) => {
        if (activo) aplicarExito(completo);
      },
      (e) => {
        if (activo) aplicarFallo(e);
      }
    );
    return () => {
      activo = false;
    };
  }, [idNumerico, idValido, aplicarExito, aplicarFallo]);

  const refrescar = useCallback(async () => {
    if (!idValido) return;
    setRefrescando(true);
    await obtenerProyectoCompleto(idNumerico).then(aplicarExito, aplicarFallo);
  }, [idNumerico, idValido, aplicarExito, aplicarFallo]);

  const cambiarEstadoLocal = useCallback((estado: EstadoProyecto) => {
    setProyecto((actual) => (actual ? { ...actual, estado } : actual));
  }, []);

  return {
    proyecto,
    cargando: cargando || refrescando,
    error,
    refrescar,
    cambiarEstadoLocal,
  };
}
