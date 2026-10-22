export type DispositivoMock = {
  id: string;
  marca: string;
  modelo: string;
  color: string;
  colorOscuro: string;
  unlockToolSupported: boolean;
};

export const dispositivosMock: DispositivoMock[] = [
  { id: 'samsung-a03', marca: 'Samsung', modelo: 'Galaxy A03', color: '#A9BEC0', colorOscuro: '#23343A', unlockToolSupported: true },
  { id: 'samsung-a10', marca: 'Samsung', modelo: 'Galaxy A10', color: '#597486', colorOscuro: '#213643', unlockToolSupported: true },
  { id: 'samsung-a14', marca: 'Samsung', modelo: 'Galaxy A14', color: '#6A95E3', colorOscuro: '#1B316C', unlockToolSupported: false },
  { id: 'moto-e13', marca: 'Motorola', modelo: 'Moto E13', color: '#A9B9BD', colorOscuro: '#354349', unlockToolSupported: false },
  { id: 'samsung-a04', marca: 'Samsung', modelo: 'Galaxy A04', color: '#70AFC1', colorOscuro: '#1D4654', unlockToolSupported: true },
  { id: 'moto-g22', marca: 'Motorola', modelo: 'Moto G22', color: '#A7C1C4', colorOscuro: '#263D43', unlockToolSupported: false },
  { id: 'samsung-a12', marca: 'Samsung', modelo: 'Galaxy A12', color: '#D1B18B', colorOscuro: '#594937', unlockToolSupported: true },
  { id: 'moto-g32', marca: 'Motorola', modelo: 'Moto G32', color: '#8CA3C4', colorOscuro: '#2F496D', unlockToolSupported: false },
];
