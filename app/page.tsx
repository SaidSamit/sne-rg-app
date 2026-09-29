"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Database,
  FileCheck,
} from "lucide-react";
import { subscribeToDB, getDBSnapshot, getDBServerSnapshot } from "@/lib/storage";

export default function Dashboard() {
  const registros = useSyncExternalStore(subscribeToDB, getDBSnapshot, getDBServerSnapshot);
  const totalRegistros = registros.length;
  const totalConPDF = registros.filter((f) => Boolean(f.nombreArchivo)).length;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Impacto Operativo del Sistema SNE-RG V2
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Panel de supervisión y control del Sistema de Mensajería de Error Asistida y Recuperación Guiada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/nueva-solicitud"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Solicitud
          </Link>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <Users className="w-4 h-4" />
            Ver Directorio ({totalRegistros})
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Negocio y Soporte TI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Tickets TI Prevenidos</p>
              <h3 className="text-2xl font-bold text-slate-800">142</h3>
            </div>
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 mt-3 font-semibold">+12% respecto al mes anterior</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Tasa de Recuperación</p>
              <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Usuarios que reintentan sin abandonar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Ahorro Estimado Mensual</p>
              <h3 className="text-2xl font-bold text-slate-800">$450.000</h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Reducción de hasta un 40% en Nivel 1</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Registros Consolidados</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalRegistros}</h3>
            </div>
            <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">{totalConPDF} expedientes con PDF validado</p>
        </div>
      </div>

      {/* Arquitectura de Vistas Separadas (Slide 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Módulo Administrativo (Camila Soto)</h3>
              <p className="text-xs text-slate-500">Diseñado para cero incertidumbre y preservación de estado</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Permite el ingreso seguro de personal con respaldo en tiempo real ante cortes 504, scroll inteligente hacia campos omitidos y microcopy que garantiza la integridad de los datos.
          </p>
          <Link
            href="/nueva-solicitud"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline pt-1"
          >
            Probar ingreso con fallas inducidas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Directorio Corporativo (CRUD Integral)</h3>
              <p className="text-xs text-slate-500">Operaciones completas: Consulta, Modificación y Baja segura</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integra búsqueda instantánea, edición con actualización en vivo de cargos y departamentos, y eliminación protegida con modal y opción de deshacer.
          </p>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline pt-1"
          >
            Explorar tabla del directorio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Banner Informativo ISO/IEC 25010 */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-mono border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Norma ISO/IEC 25010 • Usabilidad y Tolerancia a Fallos
            </div>
            <h3 className="text-xl font-bold tracking-tight">Arquitectura Tolerante a Fallos SNE-RG V2</h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              El sistema aísla los dominios de falla desacoplando la experiencia del usuario operativo de los códigos crípticos del servidor. Respalda borradores automáticamente en almacenamiento local y provee trazabilidad para el equipo de soporte TI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Status: Intranet Activa
            </div>
            <div className="px-4 py-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-mono text-blue-300 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5" />
              Quota PDF: 5.0 MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}