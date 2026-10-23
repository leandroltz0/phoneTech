import { Proyecto, EstadoProyecto, MovimientoProyecto, FallaDiagnostico } from '@/types/proyecto';

/**
 * Datos de prueba — se reemplazarán por llamadas a la API cuando el backend esté listo.
 * La estructura refleja exactamente el tipo Proyecto para facilitar la migración.
 */
let proyectosMock: Proyecto[] = [
  {
    id: '1',
    numero: 1,
    modelo: 'Samsung Galaxy A03',
    marca: 'Samsung',
    variante: 'SM-A035M / 64 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a03-1.jpg',
    diagnostico: ['Módulo roto', 'Tapa trasera dañada'],
    fallas: [
      { id: 'f1', componente: 'Módulo', descripcion: 'Roto · Sin imagen', icono: 'phone-portrait-outline', confirmada: true },
      { id: 'f2', componente: 'Tapa', descripcion: 'Rayada · Tapa dañada', icono: 'tablet-portrait-outline', confirmada: true },
    ],
    estado: 'reparacion',
    gananciaTipo: 'estimada',
    ganancia: 25000,
    precioCompra: 35000,
    precioVentaEstimado: 120000,
    totalGastos: 60000,
    gastos: [
      { id: 'g1', concepto: 'Módulo de pantalla', monto: 45000, fecha: '2026-10-02T10:00:00Z' },
      { id: 'g2', concepto: 'Tapa trasera', monto: 8000, fecha: '2026-10-02T10:00:00Z' },
      { id: 'g3', concepto: 'Mano de obra', monto: 7000, fecha: '2026-10-03T14:00:00Z' },
    ],
    movimientos: [
      { id: 'm1', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2025-10-18T10:00:00Z' },
      { id: 'm2', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2025-10-19T10:30:00Z' },
      { id: 'm3', tipo: 'compra', descripcion: 'Compra registrada', fecha: '2025-10-20T09:00:00Z' },
      { id: 'm4', tipo: 'gasto', descripcion: 'Gasto registrado: Módulo de pantalla', fecha: '2025-10-20T10:00:00Z' },
      { id: 'm5', tipo: 'estado', descripcion: 'Estado: En reparación', fecha: '2025-10-20T10:00:00Z' },
    ],
    fechaCreacion: '2025-10-18T10:00:00Z',
    unlockToolSupported: true,
  },
  {
    id: '2',
    numero: 2,
    modelo: 'Motorola Moto E13',
    marca: 'Motorola',
    variante: 'XT2345-2 / 64 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-e13-1.jpg',
    diagnostico: ['Pin de carga dañado', 'Batería agotada'],
    fallas: [
      { id: 'f3', componente: 'Pin de carga', descripcion: 'Dañado · No carga', icono: 'battery-charging-outline', confirmada: true },
      { id: 'f4', componente: 'Batería', descripcion: 'Agotada · No retiene carga', icono: 'battery-dead-outline', confirmada: true },
    ],
    estado: 'venta',
    gananciaTipo: 'estimada',
    ganancia: 18500,
    precioCompra: 20000,
    precioVentaEstimado: 55000,
    totalGastos: 16500,
    gastos: [
      { id: 'g4', concepto: 'Pin de carga', monto: 5500, fecha: '2026-10-06T11:00:00Z' },
      { id: 'g5', concepto: 'Batería', monto: 8000, fecha: '2026-10-06T11:00:00Z' },
      { id: 'g6', concepto: 'Mano de obra', monto: 3000, fecha: '2026-10-07T09:00:00Z' },
    ],
    movimientos: [
      { id: 'm6', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2026-10-05T14:00:00Z' },
      { id: 'm7', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2026-10-05T14:30:00Z' },
      { id: 'm8', tipo: 'compra', descripcion: 'Compra registrada', fecha: '2026-10-06T10:00:00Z' },
      { id: 'm9', tipo: 'gasto', descripcion: 'Gasto registrado: Pin de carga', fecha: '2026-10-06T11:00:00Z' },
      { id: 'm10', tipo: 'estado', descripcion: 'Estado: En venta', fecha: '2026-10-08T16:00:00Z' },
    ],
    fechaCreacion: '2026-10-05T14:00:00Z',
    unlockToolSupported: false,
  },
  {
    id: '3',
    numero: 3,
    modelo: 'Samsung Galaxy A10',
    marca: 'Samsung',
    variante: 'SM-A105M / 32 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a10-1.jpg',
    diagnostico: ['Pantalla sin imagen', 'Falla táctil'],
    fallas: [
      { id: 'f5', componente: 'Pantalla', descripcion: 'Sin imagen · Display dañado', icono: 'phone-portrait-outline', confirmada: true },
      { id: 'f6', componente: 'Táctil', descripcion: 'No responde · Falla táctil', icono: 'finger-print-outline', confirmada: true },
    ],
    estado: 'vendido',
    gananciaTipo: 'real',
    ganancia: 22000,
    precioCompra: 15000,
    precioVentaEstimado: 52000,
    precioVentaFinal: 50000,
    totalGastos: 13000,
    gastos: [
      { id: 'g7', concepto: 'Módulo de pantalla', monto: 10000, fecha: '2026-09-22T10:00:00Z' },
      { id: 'g8', concepto: 'Mano de obra', monto: 3000, fecha: '2026-09-23T14:00:00Z' },
    ],
    movimientos: [
      { id: 'm11', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2026-09-20T09:00:00Z' },
      { id: 'm12', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2026-09-20T09:30:00Z' },
      { id: 'm13', tipo: 'compra', descripcion: 'Compra registrada', fecha: '2026-09-21T10:00:00Z' },
      { id: 'm14', tipo: 'gasto', descripcion: 'Gasto registrado: Módulo de pantalla', fecha: '2026-09-22T10:00:00Z' },
      { id: 'm15', tipo: 'estado', descripcion: 'Estado: En venta', fecha: '2026-09-28T10:00:00Z' },
      { id: 'm16', tipo: 'venta', descripcion: 'Venta registrada', fecha: '2026-10-10T16:30:00Z' },
    ],
    fechaCreacion: '2026-09-20T09:00:00Z',
    fechaVenta: '2026-10-10T16:30:00Z',
    unlockToolSupported: true,
  },
  {
    id: '4',
    numero: 4,
    modelo: 'Xiaomi Redmi 9A',
    marca: 'Xiaomi',
    variante: 'M2006C3LG / 32 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-9a-1.jpg',
    diagnostico: ['No enciende', 'Daño por humedad'],
    fallas: [
      { id: 'f7', componente: 'Placa', descripcion: 'No enciende · Posible corto', icono: 'hardware-chip-outline', confirmada: false },
      { id: 'f8', componente: 'Placa', descripcion: 'Daño por humedad · Corrosión', icono: 'water-outline', confirmada: false },
    ],
    estado: 'evaluacion',
    gananciaTipo: 'estimada',
    ganancia: 15000,
    precioVentaEstimado: 40000,
    totalGastos: 0,
    gastos: [],
    movimientos: [
      { id: 'm17', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2026-10-14T11:00:00Z' },
      { id: 'm18', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2026-10-14T11:30:00Z' },
    ],
    fechaCreacion: '2026-10-14T11:00:00Z',
    unlockToolSupported: true,
  },
  {
    id: '5',
    numero: 5,
    modelo: 'Samsung Galaxy A03',
    marca: 'Samsung',
    variante: 'SM-A035M / 32 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a03-1.jpg',
    diagnostico: ['Botón de encendido roto'],
    fallas: [
      { id: 'f9', componente: 'Botón de encendido', descripcion: 'Roto · No responde', icono: 'power-outline', confirmada: true },
    ],
    estado: 'evaluacion',
    gananciaTipo: 'estimada',
    ganancia: 12000,
    precioVentaEstimado: 45000,
    totalGastos: 0,
    gastos: [],
    movimientos: [
      { id: 'm19', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2026-10-16T08:00:00Z' },
      { id: 'm20', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2026-10-16T08:15:00Z' },
    ],
    fechaCreacion: '2026-10-16T08:00:00Z',
    unlockToolSupported: true,
  },
  {
    id: '6',
    numero: 6,
    modelo: 'iPhone 11',
    marca: 'Apple',
    variante: 'A2221 / 64 GB',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-11-2019-1.jpg',
    diagnostico: ['Módulo roto', 'Cámara desenfocada'],
    fallas: [
      { id: 'f10', componente: 'Módulo', descripcion: 'Roto · Manchas en display', icono: 'phone-portrait-outline', confirmada: true },
      { id: 'f11', componente: 'Cámara', descripcion: 'Desenfocada · Lente dañado', icono: 'camera-outline', confirmada: true },
    ],
    estado: 'reparacion',
    gananciaTipo: 'estimada',
    ganancia: 75000,
    precioCompra: 80000,
    precioVentaEstimado: 250000,
    totalGastos: 95000,
    gastos: [
      { id: 'g9', concepto: 'Módulo OLED original', monto: 65000, fecha: '2026-10-13T10:00:00Z' },
      { id: 'g10', concepto: 'Cámara trasera', monto: 22000, fecha: '2026-10-13T10:00:00Z' },
      { id: 'g11', concepto: 'Mano de obra', monto: 8000, fecha: '2026-10-14T15:00:00Z' },
    ],
    movimientos: [
      { id: 'm21', tipo: 'creacion', descripcion: 'Proyecto creado', fecha: '2026-10-12T15:00:00Z' },
      { id: 'm22', tipo: 'diagnostico', descripcion: 'Diagnóstico agregado', fecha: '2026-10-12T15:30:00Z' },
      { id: 'm23', tipo: 'compra', descripcion: 'Compra registrada', fecha: '2026-10-13T09:00:00Z' },
      { id: 'm24', tipo: 'gasto', descripcion: 'Gasto registrado: Módulo OLED', fecha: '2026-10-13T10:00:00Z' },
      { id: 'm25', tipo: 'estado', descripcion: 'Estado: En reparación', fecha: '2026-10-13T10:00:00Z' },
    ],
    fechaCreacion: '2026-10-12T15:00:00Z',
    unlockToolSupported: false,
  },
];

const listeners = new Set<() => void>();

export function obtenerProyectosMock() {
  return proyectosMock;
}

export function obtenerProyectoPorIdMock(id: string): Proyecto | undefined {
  return proyectosMock.find((p) => p.id === id);
}

export function obtenerProximoNumeroProyectoMock() {
  return Math.max(0, ...proyectosMock.map((item) => item.numero)) + 1;
}

export function suscribirProyectosMock(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function guardarProyectoMock(proyecto: Omit<Proyecto, 'id' | 'numero'>) {
  const numero = obtenerProximoNumeroProyectoMock();
  const nuevoProyecto: Proyecto = {
    ...proyecto,
    id: `mock-${Date.now()}`,
    numero,
  };

  proyectosMock = [nuevoProyecto, ...proyectosMock];
  listeners.forEach((listener) => listener());

  return nuevoProyecto;
}

export function actualizarEstadoProyectoMock(id: string, nuevoEstado: EstadoProyecto) {
  const index = proyectosMock.findIndex((p) => p.id === id);
  if (index !== -1) {
    const estadoPrevio = proyectosMock[index];
    const movimientos = estadoPrevio.movimientos ?? [];

    const estadoLabels: Record<EstadoProyecto, string> = {
      evaluacion: 'En evaluación',
      reparacion: 'En reparación',
      venta: 'En venta',
      vendido: 'Vendido',
    };

    const nuevoMovimiento: MovimientoProyecto = {
      id: `m-estado-${Date.now()}`,
      tipo: nuevoEstado === 'vendido' ? 'venta' : 'estado',
      descripcion: `Estado: ${estadoLabels[nuevoEstado]}`,
      fecha: new Date().toISOString(),
    };

    proyectosMock[index] = {
      ...estadoPrevio,
      estado: nuevoEstado,
      gananciaTipo: nuevoEstado === 'vendido' ? 'real' : estadoPrevio.gananciaTipo,
      movimientos: [nuevoMovimiento, ...movimientos],
    };

    listeners.forEach((listener) => listener());
    return proyectosMock[index];
  }
  return undefined;
}

export function actualizarPrecioProyectoMock(id: string, nuevoPrecioVenta: number) {
  const index = proyectosMock.findIndex((p) => p.id === id);
  if (index !== -1) {
    const estadoPrevio = proyectosMock[index];
    const compra = estadoPrevio.precioCompra ?? 0;
    const gastos =
      estadoPrevio.totalGastos ??
      (estadoPrevio.gastos?.reduce((acc, g) => acc + g.monto, 0) ?? 0);
    const nuevaGanancia = nuevoPrecioVenta - compra - gastos;

    proyectosMock[index] = {
      ...estadoPrevio,
      precioVentaEstimado: nuevoPrecioVenta,
      precioVentaFinal:
        estadoPrevio.estado === 'vendido'
          ? nuevoPrecioVenta
          : estadoPrevio.precioVentaFinal,
      ganancia: nuevaGanancia,
    };

    listeners.forEach((listener) => listener());
    return proyectosMock[index];
  }
  return undefined;
}

export function actualizarDiagnosticoProyectoMock(
  id: string,
  nuevasFallas: FallaDiagnostico[]
) {
  const index = proyectosMock.findIndex((p) => p.id === id);
  if (index !== -1) {
    const estadoPrevio = proyectosMock[index];
    const legacyDiagnostico = nuevasFallas.map((f) => `${f.componente}: ${f.descripcion}`);
    const movimientos = estadoPrevio.movimientos ?? [];

    const nuevoMovimiento: MovimientoProyecto = {
      id: `m-diag-${Date.now()}`,
      tipo: 'diagnostico',
      descripcion: `Diagnóstico actualizado (${nuevasFallas.length} fallas)`,
      fecha: new Date().toISOString(),
    };

    proyectosMock[index] = {
      ...estadoPrevio,
      fallas: nuevasFallas,
      diagnostico: legacyDiagnostico,
      movimientos: [nuevoMovimiento, ...movimientos],
    };

    listeners.forEach((listener) => listener());
    return proyectosMock[index];
  }
  return undefined;
}
