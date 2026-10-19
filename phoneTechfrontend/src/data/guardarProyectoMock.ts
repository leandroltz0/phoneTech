export type EstadoGuardadoProyecto = 'pendiente' | 'evaluacion' | 'reparacion' | 'venta';

export const proyectoPendienteMock = {
  numero: 4,
  variante: 'SM-A035M · 4 GB / 64 GB',
  diagnostico: ['Módulo roto', 'Tapa dañada'],
  gananciaEstimada: 25000,
  gastoEstimado: 45000,
  fechaInicio: '19 oct. 2026',
};

export const estadosGuardadoProyecto: Record<
  EstadoGuardadoProyecto,
  { titulo: string; descripcion: string; icono: 'time' | 'search' | 'construct' | 'pricetag'; color: string; fondo: string }
> = {
  pendiente: {
    titulo: 'Pendiente',
    descripcion: 'Todavía no compraste el celular',
    icono: 'time',
    color: '#C97900',
    fondo: '#FFF0D5',
  },
  evaluacion: {
    titulo: 'En evaluación',
    descripcion: 'Estás revisando la compra',
    icono: 'search',
    color: '#6D55A1',
    fondo: '#EDE9FE',
  },
  reparacion: {
    titulo: 'En reparación',
    descripcion: 'El equipo está en reparación',
    icono: 'construct',
    color: '#946315',
    fondo: '#FFF1D6',
  },
  venta: {
    titulo: 'En venta',
    descripcion: 'El equipo está publicado para vender',
    icono: 'pricetag',
    color: '#246B96',
    fondo: '#DFF1FC',
  },
};
