import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '@/services/api';
import { adaptarProyectoResumen } from '@/services/projectAdapter';
import { obtenerProyectos } from '@/services/projects';
import { Proyecto } from '@/types/proyecto';

export interface UseProyectos {
  proyectos: Proyecto[];
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
}

/** Lista de proyectos (GET /api/v1/projects). */
export function useProyectos(): UseProyectos {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aplicarExito = useCallback((resumenes: Awaited<ReturnType<typeof obtenerProyectos>>) => {
    setProyectos(resumenes.map(adaptarProyectoResumen));
    setError(null);
    setCargando(false);
    setRefrescando(false);
  }, []);

  const aplicarFallo = useCallback((e: unknown) => {
    setError(mensajeDeError(e));
    setCargando(false);
    setRefrescando(false);
  }, []);

  useEffect(() => {
    let activo = true;
    void obtenerProyectos().then(
      (resumenes) => {
        if (activo) aplicarExito(resumenes);
      },
      (e) => {
        if (activo) aplicarFallo(e);
      }
    );
    return () => {
      activo = false;
    };
  }, [aplicarExito, aplicarFallo]);

  const refrescar = useCallback(async () => {
    setRefrescando(true);
    await obtenerProyectos().then(aplicarExito, aplicarFallo);
  }, [aplicarExito, aplicarFallo]);

  return { proyectos, cargando: cargando || refrescando, error, refrescar };
}
