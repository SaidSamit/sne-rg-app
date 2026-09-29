"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingDown,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  Calculator,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import {
  TICKETS_EVITADOS_CATALOGO,
  formatearCLP,
  obtenerResumenPorImpacto,
  TARIFAS_TI,
} from "@/lib/ahorroData";
import { TicketEvitado, ImpactoTicket } from "@/types/ahorro";
import ModalDetalleTicket from "@/components/ModalDetalleTicket";

export default function AhorroTI() {
  const [tickets] = useState<TicketEvitado[]>(TICKETS_EVITADOS_CATALOGO);
  const [filtroImpacto, setFiltroImpacto] = useState<"todos" | ImpactoTicket>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState<TicketEvitado | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Parámetros para la Calculadora / Simulador de ROI Corporativo (Valor Agregado)
  const [solicitudesMensuales, setSolicitudesMensuales] = useState(250);
  const [tasaFallaHistorica, setTasaFallaHistorica] = useState(15); // 15%
  const [tarifaHoraPromedio, setTarifaHoraPromedio] = useState(35000); // $35.000 CLP/h promedio

  // Resumen agrupado por impacto (Bajo, Medio, Alto, Crítico)
  const resumenImpacto = useMemo(() => {
    return obtenerResumenPorImpacto(tickets);
  }, [tickets]);

  // Totales de la muestra
  const totalAhorradoMuestra = useMemo(() => {
    return tickets.reduce((acc, t) => acc + t.ahorroTotalCLP, 0);
  }, [tickets]);

  const totalHorasAhorradasMuestra = useMemo(() => {
    return Number(tickets.reduce((acc, t) => acc + t.horasEstimadas, 0).toFixed(1));
  }, [tickets]);

  // Cálculo del Simulador de ROI
  const calculoROI = useMemo(() => {
    const ticketsEvitadosMes = Math.round((solicitudesMensuales * tasaFallaHistorica) / 100);
    const ticketsEvitadosAno = ticketsEvitadosMes * 12;
    // Asumiendo un promedio de 1.8 horas de trabajo de TI por ticket
    const horasAhorradasAno = Number((ticketsEvitadosAno * 1.8).toFixed(0));
    const ahorroMensualCLP = ticketsEvitadosMes * 1.8 * tarifaHoraPromedio;
    const ahorroAnualCLP = ahorroMensualCLP * 12;

    return {
      ticketsEvitadosMes,
      ticketsEvitadosAno,
      horasAhorradasAno,
      ahorroMensualCLP,
      ahorroAnualCLP,
    };
  }, [solicitudesMensuales, tasaFallaHistorica, tarifaHoraPromedio]);

  // Filtrado de la lista de tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((t) => {
      const matchTexto =
        t.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.afectado.toLowerCase().includes(busqueda.toLowerCase());

      const matchImpacto = filtroImpacto === "todos" || t.impacto === filtroImpacto;

      return matchTexto && matchImpacto;
    });
  }, [tickets, busqueda, filtroImpacto]);

  // Copiar resumen ejecutivo para jefatura o presentación
  const handleCopiarResumen = async () => {
    const texto = `=== INFORME DE IMPACTO ECONÓMICO SNE-RG V2 ===
• Ahorro Total Muestra Auditada: ${formatearCLP(totalAhorradoMuestra)}
• Horas de Ingeniería TI Liberadas: ${totalHorasAhorradasMuestra} hrs
• Tarifa Crítico (Nivel 3 / DBA): ${formatearCLP(TARIFAS_TI.critico)}/h
• Tarifa Alto (Nivel 2 Senior): ${formatearCLP(TARIFAS_TI.alto)}/h
• Tarifa Medio (Nivel 1 Avanzado): ${formatearCLP(TARIFAS_TI.medio)}/h
• Tarifa Bajo (Nivel 1 Básico): ${formatearCLP(TARIFAS_TI.bajo)}/h
• Proyección Anual Corporativa SNE-RG: ${formatearCLP(calculoROI.ahorroAnualCLP)}
Normativa de Referencia: ISO/IEC 25010 (Usabilidad y Tolerancia a Fallos)`;

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      console.error("Error al copiar");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-8 pb-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            Módulo Financiero y Reducción de Costos TI
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Montos Ahorrados por Prevención de Tickets
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Análisis de costos evitados clasificados por severidad horaria según el sistema tolerante a fallos SNE-RG V2.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopiarResumen}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            {copiado ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Resumen Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Reporte Ejecutivo
              </>
            )}
          </button>
          <Link
            href="/nueva-solicitud"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline px-2"
          >
            Probar Solicitud <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards de Impacto Global */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Ahorro Muestreado (CLP)</p>
              <h3 className="text-2xl font-bold text-emerald-600">{formatearCLP(totalAhorradoMuestra)}</h3>
            </div>
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Calculado en base a incidentes neutralizados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Horas TI Liberadas</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalHorasAhorradasMuestra} hrs</h3>
            </div>
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-3">Tiempo reenfocado a proyectos estratégicos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Costo Promedio Evitado</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {formatearCLP(Math.round(totalAhorradoMuestra / tickets.length))}
              </h3>
            </div>
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Por cada incidente resuelto en UI</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Reducción Nivel 1</p>
              <h3 className="text-2xl font-bold text-slate-800">-40%</h3>
            </div>
            <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-3">Cumplimiento norma ISO/IEC 25010</p>
        </div>
      </div>

      {/* Tarjetas de Clasificación por Impacto y Tarifas Reales */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Estructura de Ahorro por Nivel de Severidad
          </h2>
          <span className="text-xs text-slate-400">Tarifas horarias ponderadas de TI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumenImpacto.map((item) => (
            <div
              key={item.impacto}
              className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 space-y-3 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{ backgroundColor: item.color }}
              ></div>

              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${item.badgeBg} ${item.badgeText}`}>
                  {item.impacto.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {formatearCLP(item.tarifaHoraCLP)}/h
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 leading-tight">
                  {item.etiqueta}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {item.cantidadTickets} tickets evitados ({item.horasAhorradas} hrs acumuladas)
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Ahorro total:</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {formatearCLP(item.montoAhorradoCLP)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulador Interactivo de ROI Corporativo (Valor Agregado) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          Simulador Dinámico de Retorno de Inversión (ROI)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controles del Simulador */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Calcule el impacto económico a escala corporativa
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Ajuste las variables operativas de su organización para proyectar el ahorro mensual y anual que produce implementar la tolerancia a fallos SNE-RG.
              </p>
            </div>

            <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 backdrop-blur-xs">
              {/* Slider 1: Solicitudes Mensuales */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" /> Solicitudes de personal por mes:
                  </span>
                  <span className="font-mono font-bold text-blue-400">{solicitudesMensuales} solicitudes</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={solicitudesMensuales}
                  onChange={(e) => setSolicitudesMensuales(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Slider 2: Tasa de Errores / Fallas Evitadas */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Tasa de incidentes atajados por SNE-RG:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{tasaFallaHistorica}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={tasaFallaHistorica}
                  onChange={(e) => setTasaFallaHistorica(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 3: Tarifa Promedio TI */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Costo hora promedio de soporte TI:
                  </span>
                  <span className="font-mono font-bold text-amber-400">{formatearCLP(tarifaHoraPromedio)}/h</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="65000"
                  step="5000"
                  value={tarifaHoraPromedio}
                  onChange={(e) => setTarifaHoraPromedio(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Resultado Proyectado */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Ahorro Anual Proyectado (CLP)
              </p>
              <h3 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mt-2 font-mono tracking-tight">
                {formatearCLP(calculoROI.ahorroAnualCLP)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Equivalente a <strong className="text-white">{formatearCLP(calculoROI.ahorroMensualCLP)}</strong> mensuales en horas de soporte técnico recuperadas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/80 text-xs">
              <div className="p-3 bg-slate-900/70 rounded-xl">
                <span className="text-slate-400 block">Tickets evitados/año</span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {calculoROI.ticketsEvitadosAno} tickets
                </span>
              </div>
              <div className="p-3 bg-slate-900/70 rounded-xl">
                <span className="text-slate-400 block">Horas TI liberadas</span>
                <span className="text-lg font-bold font-mono text-blue-400 mt-1 block">
                  {calculoROI.horasAhorradasAno} hrs
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-950/60 border border-blue-800/40 rounded-xl text-[11px] text-blue-200">
              💡 <strong>Justificación para el Pitch:</strong> La inversión en usabilidad y tolerancia a fallos se amortiza desde el primer mes operativo, eliminando la fricción de Camila Soto y reduciendo la carga de incidentes críticos en base de datos.
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo Detallado de Tickets Evitados (Tabla de Auditoría) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Registro Histórico de Tickets Neutralizados por SNE-RG
            </h2>
            <p className="text-xs text-slate-500">
              Casos reales simulados con trazabilidad de causa, mecanismo preventivo y horas recuperadas.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código, falla o usuario..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Filtros por Impacto */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium shrink-0">Severidad:</span>
          {(["todos", "critico", "alto", "medio", "bajo"] as const).map((imp) => (
            <button
              key={imp}
              onClick={() => setFiltroImpacto(imp)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filtroImpacto === imp
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {imp === "todos"
                ? `Todos (${tickets.length})`
                : `${imp.charAt(0).toUpperCase() + imp.slice(1)} (${
                    tickets.filter((t) => t.impacto === imp).length
                  })`}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Código</th>
                  <th className="p-4 font-semibold">Incidente Evitado</th>
                  <th className="p-4 font-semibold">Impacto</th>
                  <th className="p-4 font-semibold">Tiempo Ahorrado</th>
                  <th className="p-4 font-semibold">Tarifa/Hora</th>
                  <th className="p-4 font-semibold">Ahorro Total</th>
                  <th className="p-4 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ticketsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 text-xs">
                      No se encontraron tickets con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  ticketsFiltrados.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {ticket.codigo}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-xs text-slate-800">{ticket.titulo}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ticket.categoria} • Afectaba a {ticket.afectado}
                        </div>
                      </td>
                      <td className="p-4">
                        {ticket.impacto === "critico" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                            Crítico
                          </span>
                        )}
                        {ticket.impacto === "alto" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700">
                            Alto
                          </span>
                        )}
                        {ticket.impacto === "medio" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                            Medio
                          </span>
                        )}
                        {ticket.impacto === "bajo" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                            Bajo
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-600">
                        {ticket.horasEstimadas} hrs
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-600">
                        {formatearCLP(ticket.costoPorHoraCLP)}
                      </td>
                      <td className="p-4 text-xs font-mono font-bold text-emerald-600">
                        {formatearCLP(ticket.ahorroTotalCLP)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setTicketSeleccionado(ticket)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Causa-Efecto
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Mostrando {ticketsFiltrados.length} de {tickets.length} incidentes prevenidos</span>
            <span>Métricas SNE-RG V2 • Auditoría de Costos</span>
          </div>
        </div>
      </div>

      {/* Modal Causa-Efecto del Ticket */}
      <ModalDetalleTicket
        ticket={ticketSeleccionado}
        isOpen={Boolean(ticketSeleccionado)}
        onClose={() => setTicketSeleccionado(null)}
      />
    </div>
  );
}
