import { TicketEvitado, ImpactoTicket, ResumenImpacto } from "@/types/ahorro";

export const TARIFAS_TI: Record<ImpactoTicket, number> = {
  bajo: 15000,
  medio: 30000,
  alto: 45000,
  critico: 65000,
};

export const TICKETS_EVITADOS_CATALOGO: TicketEvitado[] = [
  {
    id: "1",
    codigo: "TK-8041",
    titulo: "Bloqueo por reinicio de formulario tras caída de red (504)",
    categoria: "Red y Conectividad",
    impacto: "critico",
    horasEstimadas: 3.5,
    costoPorHoraCLP: TARIFAS_TI.critico,
    ahorroTotalCLP: 3.5 * TARIFAS_TI.critico, // $227.500
    fechaEvitado: "28/09/2026",
    afectado: "Camila Soto (RRHH)",
    problemaHistorico:
      "Al ocurrir un micro-corte del gateway corporativo, el formulario se reiniciaba en blanco. El administrativo abría ticket urgente N3 exigiendo recuperación de datos en base de datos central.",
    mecanismoSNE:
      "Preservación de Estado en LocalStorage + Microcopy 'Reintentar (Tus datos están seguros)'. Cero pérdida de información y resolución autónoma en < 5s.",
  },
  {
    id: "2",
    codigo: "TK-8032",
    titulo: "Saturación del enlace corporativo por subida de PDF sin optimizar",
    categoria: "Gestión de Archivos",
    impacto: "alto",
    horasEstimadas: 2.0,
    costoPorHoraCLP: TARIFAS_TI.alto,
    ahorroTotalCLP: 2.0 * TARIFAS_TI.alto, // $90.000
    fechaEvitado: "27/09/2026",
    afectado: "Rodrigo Morales (Finanzas)",
    problemaHistorico:
      "Usuarios adjuntaban escaneos pesados de 12MB a 20MB. El servidor colapsaba por timeout en la subida, generando tickets reiterados a soporte de infraestructura.",
    mecanismoSNE:
      "Validación client-side de cuota máxima de 5MB (Slide 7) con alerta pedagógica y sugerencia inmediata de compresión.",
  },
  {
    id: "3",
    codigo: "TK-8015",
    titulo: "Inconsistencia de BD por reenvío múltiple (Conflicto 409 de RUT)",
    categoria: "Integridad de Base de Datos",
    impacto: "critico",
    horasEstimadas: 4.0,
    costoPorHoraCLP: TARIFAS_TI.critico,
    ahorroTotalCLP: 4.0 * TARIFAS_TI.critico, // $260.000
    fechaEvitado: "26/09/2026",
    afectado: "Lorena Valenzuela (Soporte TI)",
    problemaHistorico:
      "Falta de idempotencia y feedback en UI provocaba que el usuario hiciera clic repetidas veces, duplicando funcionarios o generando 'Unique Constraint Violation' en el backend.",
    mecanismoSNE:
      "Detección preventiva de conflicto 409 con banner guiado que indica con quién colisiona el RUT y ofrece botón directo para 'Modificar RUT'.",
  },
  {
    id: "4",
    codigo: "TK-7988",
    titulo: "Llamada a mesa de ayuda por código críptico 'Error 504 / SQL State'",
    categoria: "Red y Conectividad",
    impacto: "medio",
    horasEstimadas: 1.5,
    costoPorHoraCLP: TARIFAS_TI.medio,
    ahorroTotalCLP: 1.5 * TARIFAS_TI.medio, // $45.000
    fechaEvitado: "25/09/2026",
    afectado: "Camila Soto (RRHH)",
    problemaHistorico:
      "La administrativa recibía un volcado críptico en pantalla, generando pánico por posible pérdida de su cuenta o daño al sistema, escalando llamada inmediata al Call Center Nivel 1.",
    mecanismoSNE:
      "Arquitectura de Vistas Separadas (Slide 10): explicación clara para el administrativo y módulo plegable 'Ver detalle para soporte TI' con botón de copiado rápido.",
  },
  {
    id: "5",
    codigo: "TK-7945",
    titulo: "Rechazo masivo en API por RUT mal formado o dígito verificador erróneo",
    categoria: "Validación de Datos",
    impacto: "alto",
    horasEstimadas: 2.2,
    costoPorHoraCLP: TARIFAS_TI.alto,
    ahorroTotalCLP: 2.2 * TARIFAS_TI.alto, // $99.000
    fechaEvitado: "24/09/2026",
    afectado: "Diego Flores (Operaciones)",
    problemaHistorico:
      "Ingreso de RUTs sin puntos ni guion o con DV alterado. El backend rechazaba el lote completo con Error 422 Unprocessable Content requiriendo análisis de logs de soporte.",
    mecanismoSNE:
      "Algoritmo Módulo 11 en tiempo real con formateo automático (puntos y guion), bloqueando solicitudes con RUTs inválidos antes de tocar el servidor.",
  },
  {
    id: "6",
    codigo: "TK-7910",
    titulo: "Abandono de formulario por pérdida de anclaje visual en pantallas extensas",
    categoria: "Usabilidad y Flujo",
    impacto: "bajo",
    horasEstimadas: 0.8,
    costoPorHoraCLP: TARIFAS_TI.bajo,
    ahorroTotalCLP: 0.8 * TARIFAS_TI.bajo, // $12.000
    fechaEvitado: "22/09/2026",
    afectado: "Camila Soto (RRHH)",
    problemaHistorico:
      "El usuario hacía scroll hacia abajo, presionaba 'Procesar' y la alerta superior quedaba fuera de su campo visual. Creía que la pantalla se había congelado.",
    mecanismoSNE:
      "Auto-scroll contextual suave directo al campo conflictivo con resaltado interactivo perimetral ámbar y botón 'Corregir casilla con error'.",
  },
  {
    id: "7",
    codigo: "TK-7872",
    titulo: "Eliminación accidental de funcionario sin posibilidad de recuperación",
    categoria: "Integridad de Base de Datos",
    impacto: "medio",
    horasEstimadas: 1.2,
    costoPorHoraCLP: TARIFAS_TI.medio,
    ahorroTotalCLP: 1.2 * TARIFAS_TI.medio, // $36.000
    fechaEvitado: "20/09/2026",
    afectado: "Martina Lagos (Finanzas)",
    problemaHistorico:
      "Eliminación inmediata por clic involuntario requería abrir ticket a TI para restaurar el registro desde copias de seguridad de medianoche.",
    mecanismoSNE:
      "Modal accesible de confirmación sereno y Toast flotante no intrusivo con botón 'Deshacer' (Soft Undo).",
  },
  {
    id: "8",
    codigo: "TK-7830",
    titulo: "Dudas recurrentes sobre selección de área o departamento",
    categoria: "Usabilidad y Flujo",
    impacto: "bajo",
    horasEstimadas: 0.5,
    costoPorHoraCLP: TARIFAS_TI.bajo,
    ahorroTotalCLP: 0.5 * TARIFAS_TI.bajo, // $7.500
    fechaEvitado: "18/09/2026",
    afectado: "Kevin Huaycani (Operaciones)",
    problemaHistorico:
      "Campos desplegables ambiguos provocaban tickets consultivos menores que sobrecargaban la cola de atención Nivel 1.",
    mecanismoSNE:
      "Etiquetado estricto con selectores normalizados y retroalimentación textual explícita.",
  },
];

export function formatearCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}

export function obtenerResumenPorImpacto(tickets: TicketEvitado[]): ResumenImpacto[] {
  const configuraciones: Record<
    ImpactoTicket,
    { etiqueta: string; color: string; badgeBg: string; badgeText: string }
  > = {
    critico: {
      etiqueta: "Crítico (Nivel 3 / DBA)",
      color: "#e11d48", // rose-600
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
    },
    alto: {
      etiqueta: "Alto (Nivel 2 Senior)",
      color: "#ea580c", // orange-600
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-700",
    },
    medio: {
      etiqueta: "Medio (Nivel 1 Avanzado)",
      color: "#d97706", // amber-600
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
    },
    bajo: {
      etiqueta: "Bajo (Nivel 1 Básico)",
      color: "#16a34a", // emerald-600
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
    },
  };

  const totalAhorroGeneral = tickets.reduce((acc, t) => acc + t.ahorroTotalCLP, 0);

  const impactos: ImpactoTicket[] = ["critico", "alto", "medio", "bajo"];

  return impactos.map((imp) => {
    const items = tickets.filter((t) => t.impacto === imp);
    const cantidad = items.length;
    const horas = items.reduce((acc, t) => acc + t.horasEstimadas, 0);
    const monto = items.reduce((acc, t) => acc + t.ahorroTotalCLP, 0);
    const pct = totalAhorroGeneral > 0 ? (monto / totalAhorroGeneral) * 100 : 0;

    return {
      impacto: imp,
      etiqueta: configuraciones[imp].etiqueta,
      tarifaHoraCLP: TARIFAS_TI[imp],
      cantidadTickets: cantidad,
      horasAhorradas: Number(horas.toFixed(1)),
      montoAhorradoCLP: monto,
      porcentajeAhorro: Number(pct.toFixed(1)),
      color: configuraciones[imp].color,
      badgeBg: configuraciones[imp].badgeBg,
      badgeText: configuraciones[imp].badgeText,
    };
  });
}
