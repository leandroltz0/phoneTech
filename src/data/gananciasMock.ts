import { Colors } from '@/constants/colors';
import { ResumenGanancias, VistaGanancias } from '@/types/ganancias';

const ventasRecientes = [
  {
    id: 'venta-1',
    modelo: 'Samsung Galaxy A03',
    numeroProyecto: 1,
    fechaVenta: '14 oct.',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a03-1.jpg',
    ganancia: 25000,
  },
  {
    id: 'venta-2',
    modelo: 'Motorola Moto E13',
    numeroProyecto: 2,
    fechaVenta: '08 oct.',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-e13-1.jpg',
    ganancia: 18500,
  },
  {
    id: 'venta-3',
    modelo: 'Samsung Galaxy A10',
    numeroProyecto: 3,
    fechaVenta: '02 oct.',
    imagen: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a10-1.jpg',
    ganancia: 22000,
  },
];

export const resumenesGananciasMock: Record<VistaGanancias, ResumenGanancias> = {
  mes: {
    etiquetaHero: 'Ganancia neta',
    descripcionHero: 'Resultado del período',
    valorHero: 180000,
    descripcionValorHero: 'Solo proyectos vendidos',
    capitalActual: 300000,
    invertidoEnEquipos: 180000,
    disponibleParaInvertir: 120000,
    metricas: [
      { id: 'ganancia-total', titulo: 'Ganancia total', valor: 650000, icono: 'trending-up-outline', color: Colors.profit },
      { id: 'ganancia-proyectada', titulo: 'Ganancia proyectada', valor: 95000, icono: 'ellipse-outline', color: Colors.primary },
      { id: 'total-invertido', titulo: 'Total invertido', valor: 1250000, icono: 'receipt-outline', color: Colors.primary },
      { id: 'gastos-mes', titulo: 'Gastos del mes', valor: 75000, icono: 'trending-down-outline', color: Colors.profit },
    ],
    historial: [
      { mes: 'May', altura: 28 },
      { mes: 'Jun', altura: 52 },
      { mes: 'Jul', altura: 42 },
      { mes: 'Ago', altura: 66 },
      { mes: 'Sep', altura: 74 },
      { mes: 'Oct', altura: 88 },
    ],
    ventas: ventasRecientes,
  },
  proyectadas: {
    etiquetaHero: 'Ganancia proyectada',
    descripcionHero: 'Equipos actualmente en venta',
    valorHero: 95000,
    descripcionValorHero: 'No se suma a la ganancia realizada',
    capitalActual: 300000,
    invertidoEnEquipos: 180000,
    disponibleParaInvertir: 120000,
    metricas: [
      { id: 'ganancia-total', titulo: 'Ganancia total', valor: 650000, icono: 'trending-up-outline', color: Colors.profit },
      { id: 'equipos-venta', titulo: 'Equipos en venta', valor: 3, icono: 'phone-portrait-outline', color: Colors.primary },
      { id: 'capital-actual', titulo: 'Capital actual', valor: 300000, icono: 'wallet-outline', color: Colors.primary },
      { id: 'total-invertido', titulo: 'Total invertido', valor: 1250000, icono: 'receipt-outline', color: Colors.profit },
    ],
    historial: [
      { mes: 'May', altura: 24 },
      { mes: 'Jun', altura: 42 },
      { mes: 'Jul', altura: 36 },
      { mes: 'Ago', altura: 55 },
      { mes: 'Sep', altura: 62 },
      { mes: 'Oct', altura: 72 },
    ],
    ventas: ventasRecientes,
  },
  perdidas: {
    etiquetaHero: 'Pérdidas del mes',
    descripcionHero: 'Gastos sin retorno registrado',
    valorHero: 0,
    descripcionValorHero: 'No registraste pérdidas este mes',
    capitalActual: 300000,
    invertidoEnEquipos: 180000,
    disponibleParaInvertir: 120000,
    metricas: [
      { id: 'perdidas-mes', titulo: 'Pérdidas del mes', valor: 0, icono: 'trending-down-outline', color: Colors.profit },
      { id: 'gastos-mes', titulo: 'Gastos del mes', valor: 75000, icono: 'receipt-outline', color: Colors.primary },
      { id: 'capital-actual', titulo: 'Capital actual', valor: 300000, icono: 'wallet-outline', color: Colors.primary },
      { id: 'ganancia-total', titulo: 'Ganancia total', valor: 650000, icono: 'trending-up-outline', color: Colors.profit },
    ],
    historial: [
      { mes: 'May', altura: 20 },
      { mes: 'Jun', altura: 28 },
      { mes: 'Jul', altura: 18 },
      { mes: 'Ago', altura: 24 },
      { mes: 'Sep', altura: 20 },
      { mes: 'Oct', altura: 12 },
    ],
    ventas: [],
  },
};
