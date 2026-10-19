import { Ionicons } from '@expo/vector-icons';

export type VistaGanancias = 'mes' | 'proyectadas' | 'perdidas';

export interface MetricaFinanciera {
  id: string;
  titulo: string;
  valor: number;
  icono: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

export interface PuntoHistorial {
  mes: string;
  altura: number;
}

export interface VentaReciente {
  id: string;
  modelo: string;
  numeroProyecto: number;
  fechaVenta: string;
  imagen: string;
  ganancia: number;
}

export interface ResumenGanancias {
  etiquetaHero: string;
  descripcionHero: string;
  valorHero: number;
  descripcionValorHero: string;
  capitalActual: number;
  invertidoEnEquipos: number;
  disponibleParaInvertir: number;
  metricas: MetricaFinanciera[];
  historial: PuntoHistorial[];
  ventas: VentaReciente[];
}
