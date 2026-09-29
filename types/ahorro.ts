export type ImpactoTicket = "bajo" | "medio" | "alto" | "critico";

export type CategoriaFalla =
  | "Red y Conectividad"
  | "Validación de Datos"
  | "Gestión de Archivos"
  | "Integridad de Base de Datos"
  | "Usabilidad y Flujo";

export interface TicketEvitado {
  id: string;
  codigo: string;
  titulo: string;
  categoria: CategoriaFalla;
  impacto: ImpactoTicket;
  horasEstimadas: number;
  costoPorHoraCLP: number;
  ahorroTotalCLP: number;
  fechaEvitado: string;
  problemaHistorico: string;
  mecanismoSNE: string;
  afectado: string;
}

export interface ResumenImpacto {
  impacto: ImpactoTicket;
  etiqueta: string;
  tarifaHoraCLP: number;
  cantidadTickets: number;
  horasAhorradas: number;
  montoAhorradoCLP: number;
  porcentajeAhorro: number;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface ParametrosROI {
  solicitudesMensuales: number;
  tasaFallaHistoricaPct: number;
  costoHoraPromedioCLP: number;
}
