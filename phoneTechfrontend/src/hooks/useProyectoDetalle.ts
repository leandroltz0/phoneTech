import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '@/services/api';
import { adaptarProyectoDetalle } from '@/services/projectAdapter';
import { obtenerProyectoDetallado } from '@/services/projects';
import { EstadoProyecto, Proyecto } from '@/types/proyecto';
import type { ProjectDetailsDto } from '@/types/api';

export interface UseProyectoDetalle {
  proyecto: Proyecto | null;
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  /** Cambio optimista local. El PUT de estado todavía no existe en el backend. */
  cambiarEstadoLocal: (estado: EstadoProyecto) => void;
}

/** Detalle de un proyecto (GET /{id}/details). */
export function useProyectoDetalle(id?: string): UseProyectoDetalle {
  const idNumerico = Number(id);
  const idValido = Boolean(id) && !Number.isNaN(idNumerico);

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [cargando, setCargando] = useState(idValido);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(idValido ? null : 'Proyecto no encontrado');

  const aplicarExito = useCallback((detalle: ProjectDetailsDto) => {
    setProyecto(adaptarProyectoDetalle(detalle));
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
    void obtenerProyectoDetallado(idNumerico).then(
      (detalle) => {
        if (activo) aplicarExito(detalle);
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
    await obtenerProyectoDetallado(idNumerico).then(aplicarExito, aplicarFallo);
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
