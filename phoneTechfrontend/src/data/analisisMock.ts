import { ImageSourcePropType } from 'react-native';

export type EstadoDiagnostico = 'ok' | 'alerta';

export type ItemResumenAnalisis = {
  titulo: string;
  descripcion: string;
  estado: EstadoDiagnostico;
};

export type RepuestoMock = {
  id: string;
  nombre: string;
  proveedor: string;
  descripcion: string;
  precio: number;
  imagen?: ImageSourcePropType;
  icono?: 'camera';
};

export const resumenAnalisisMock: ItemResumenAnalisis[] = [
  { titulo: 'Pantalla', descripcion: 'En buen estado', estado: 'ok' },
  { titulo: 'Cámaras', descripcion: 'Funcionan correctamente', estado: 'ok' },
  { titulo: 'Batería', descripcion: 'Desgaste moderado', estado: 'alerta' },
  { titulo: 'Conectividad', descripcion: 'Sin problemas', estado: 'ok' },
];

export const repuestosMock: RepuestoMock[] = [
  {
    id: 'bateria',
    nombre: 'Batería',
    proveedor: 'Shamy',
    descripcion: 'Desgaste moderado. Se recomienda reemplazo a futuro.',
    precio: 18000,
    imagen: require('@/assets/images/phone-preview-a03.png'),
  },
  {
    id: 'camara-trasera',
    nombre: 'Cámara trasera',
    proveedor: 'Shamy',
    descripcion: 'Vidrio exterior roto. Puede seguir funcionando, pero se recomienda cambio.',
    precio: 12000,
    icono: 'camera',
  },
];

export const analisisEconomicoMock = {
  costoReparacion: 30000,
  precioCompraMinimo: 80000,
  precioCompraMaximo: 85000,
  precioVentaMinimo: 145000,
  precioVentaMaximo: 155000,
  gananciaMinima: 35000,
  gananciaMaxima: 40000,
  margen: '45% – 50%',
};
