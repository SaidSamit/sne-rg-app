"use client";

import { X, CheckCircle2, AlertOctagon, Clock, DollarSign, User, ShieldCheck } from "lucide-react";
import { TicketEvitado } from "@/types/ahorro";
import { formatearCLP } from "@/lib/ahorroData";

interface ModalDetalleTicketProps {
  ticket: TicketEvitado | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDetalleTicket({ ticket, isOpen, onClose }: ModalDetalleTicketProps) {
  if (!isOpen || !ticket) return null;

  const impactoBadge = () => {
    switch (ticket.impacto) {
      case "critico":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Crítico (Nivel 3 / DBA)</span>;
      case "alto":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Alto (Nivel 2 Senior)</span>;
      case "medio":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Medio (Nivel 1 Avanzado)</span>;
      case "bajo":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Bajo (Nivel 1 Básico)</span>;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-ticket-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado del Ticket */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {ticket.codigo}
          </span>
          {impactoBadge()}
          <span className="text-xs text-slate-400 ml-auto">{ticket.fechaEvitado}</span>
        </div>

        <h3 id="modal-ticket-titulo" className="text-lg font-bold text-slate-900 leading-tight">
          {ticket.titulo}
        </h3>

        <div className="mt-4 flex flex-wrap gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            <span>Usuario: <strong>{ticket.afectado}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Tiempo ahorrado: <strong>{ticket.horasEstimadas} hrs</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Tarifa: <strong>{formatearCLP(ticket.costoPorHoraCLP)}/h</strong></span>
          </div>
        </div>

        {/* Comparativa Causa - Efecto (Antes vs Con SNE-RG) */}
        <div className="mt-5 space-y-4">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              ¿Qué ocurría antes? (Falla y Costo Operativo)
            </h4>
            <p className="text-xs text-rose-900/90 mt-1.5 leading-relaxed">
              {ticket.problemaHistorico}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¿Cómo lo evitó el sistema SNE-RG V2?
            </h4>
            <p className="text-xs text-emerald-900/90 mt-1.5 leading-relaxed">
              {ticket.mecanismoSNE}
            </p>
          </div>
        </div>

        {/* Resumen Financiero del Incidente */}
        <div className="mt-5 p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Ahorro Económico Neto</p>
              <p className="text-xs text-slate-300 font-mono">
                {ticket.horasEstimadas} hrs × {formatearCLP(ticket.costoPorHoraCLP)}/h
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {formatearCLP(ticket.ahorroTotalCLP)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cerrar detalle
          </button>
        </div>
      </div>
    </div>
  );
}
